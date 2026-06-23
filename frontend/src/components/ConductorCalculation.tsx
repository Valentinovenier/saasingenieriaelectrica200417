import { useState } from 'react';
import { Project, Conductor, TableroSeccionalSimple } from '../types/project';
import { ConductorForm } from './ConductorForm';
import { TablerosSeccionales } from './TablerosSeccionales';
import { calcularConductorTramo } from '../engine/calculadorTramo';
import { catalogoCablesPVC, catalogoCablesXLPE, ParametrosCableCompleto } from '../data/cables';

// Los primeros dos tramos son fijos (del transformador a la barra).
// Los últimos dos tramos se generan dinámicamente POR TABLERO.
const TRAMOS_FIJOS = [
  { id: 'trafo-tgbt', label: 'Transformador → Interruptor Cabecera TGBT', esUltimosTramos: false },
  { id: 'tgbt-barra', label: 'Interruptor Cabecera TGBT → Barra Omnibus', esUltimosTramos: false },
];

/** Devuelve el id del tramo "barra → salida" para un tablero dado */
const tramoBarraSalidaId = (tableroId: string) => `barra-salida-${tableroId}`;
/** Devuelve el id del tramo "salida → tablero" para un tablero dado */
const tramoSalidaTableroId = (tableroId: string) => `salida-tablero-${tableroId}`;

export const ConductorCalculation = ({ project, onChange }: { project: Project; onChange: (p: Project) => void }) => {
  const tablerosSec: TableroSeccionalSimple[] = project.tablerosSeccionales || [];

  // Construir lista completa de tramos: 2 fijos + (2 × N tableros)
  const todosLosTramos = [
    ...TRAMOS_FIJOS,
    ...tablerosSec.flatMap(t => [
      { id: tramoBarraSalidaId(t.id), label: `Barra → Int. Salida [${t.nombre}]`, esUltimosTramos: true, tableroId: t.id },
      { id: tramoSalidaTableroId(t.id), label: `Int. Salida → Tablero [${t.nombre}]`, esUltimosTramos: true, tableroId: t.id },
    ]),
  ];

  const [selectedTramoId, setSelectedTramoId] = useState<string>(TRAMOS_FIJOS[0].id);
  const [resultados, setResultados] = useState<Record<string, any>>({});

  const getConductor = (tramoId: string): Conductor | undefined =>
    (project as any).conductores?.[tramoId];

  const updateConductor = (tramoId: string, conductor: Conductor) => {
    onChange({
      ...project,
      conductores: {
        ...(project as any).conductores,
        [tramoId]: conductor,
      },
    });
  };

  /**
   * Calcula la corriente nominal del tramo seleccionado.
   * - Para los dos tramos fijos: usa la potencia total del transformador.
   * - Para los tramos de tablero: usa la potencia del tablero correspondiente.
   */
  const getInominalTramo = (tramoId: string): number => {
    const tensionSecundaria =
      project.transformador?.tensionSecundario ||
      (project.tipoInstalacion === 'Trifásica' ? 380 : 220);
    const esTrifasica = project.tipoInstalacion === 'Trifásica';

    // Tramos fijos → potencia total del trafo
    if (tramoId === 'trafo-tgbt' || tramoId === 'tgbt-barra') {
      const potenciaVA = (project.transformador?.potencia || 0) * 1000;
      return potenciaVA / (esTrifasica ? Math.sqrt(3) * tensionSecundaria : tensionSecundaria);
    }

    // Tramos de tablero → buscar el tablero por id incrustado en el tramoId
    const matchedTablero = tablerosSec.find(
      t => tramoId === tramoBarraSalidaId(t.id) || tramoId === tramoSalidaTableroId(t.id)
    );
    if (matchedTablero) {
      const potenciaVA = (Number(matchedTablero.potencia) || 0) * 1000;
      return potenciaVA / (esTrifasica ? Math.sqrt(3) * tensionSecundaria : tensionSecundaria);
    }

    return 0;
  };

  const handleCalcular = () => {
    const tramoId = selectedTramoId;
    const conductor = getConductor(tramoId);
    if (!conductor || !conductor.aislacion || !conductor.material || !conductor.metodoInstalacion) {
      alert('Por favor completa todos los datos del conductor');
      return;
    }

    setResultados(prev => ({ ...prev, [tramoId]: null }));

    const catalogo: ParametrosCableCompleto[] =
      conductor.aislacion === 'XLPE' ? catalogoCablesXLPE : catalogoCablesPVC;

    const tensionSecundaria =
      project.transformador?.tensionSecundario ||
      (project.tipoInstalacion === 'Trifásica' ? 380 : 220);

    const Inominal = getInominalTramo(tramoId);

    // --- Armónicos ---
    const armonicos = project.armonicos;
    let I_fase = Inominal;
    let I_neutro: number | undefined = undefined;

    if (armonicos?.habilitado) {
      const toPorc = (val: number) =>
        armonicos.modoEntrada === 'amperios' ? (Inominal > 0 ? val / Inominal : 0) : val;

      const I3 = toPorc(Number(armonicos.h3) ?? 0);
      const I5 = toPorc(Number(armonicos.h5) ?? 0);
      const I7 = toPorc(Number(armonicos.h7) ?? 0);
      const I9 = toPorc(Number(armonicos.h9) ?? 0);

      I_fase = Inominal * Math.sqrt(1 + I3 ** 2 + I5 ** 2 + I7 ** 2 + I9 ** 2);
      I_neutro = 3 * Inominal * (I3 + I9);
    }

    // --- Ik acumulado ---
    // Para tramos fijos: acumular desde el inicio.
    // Para tramos de tablero: los dos tramos previos obligatorios son los fijos,
    //   y además si es "salida→tablero", se suma también el cable "barra→salida" del mismo tablero.
    let total_R = 0;
    let total_X = Number(project.transformador?.impedancia) || 0;

    const tramoIndex = todosLosTramos.findIndex(t => t.id === tramoId);
    // Para el cálculo de Z acumulada, los tramos de "otros tableros" no aplican.
    // Solo se suman: los 2 fijos + el tramo barra-salida del mismo tablero (si aplica).
    const tramosParaAcumular = todosLosTramos.slice(0, tramoIndex).filter(t => {
      if (!t.esUltimosTramos) return true; // fijos siempre
      // Si es un tramo de tablero, solo acumular si pertenece al MISMO tablero
      return (t as any).tableroId === (todosLosTramos[tramoIndex] as any).tableroId;
    });

    for (const tramoPrev of tramosParaAcumular) {
      const condAnterior = getConductor(tramoPrev.id);
      const resAnterior = resultados[tramoPrev.id] || condAnterior?.resultadoCalculo;

      if (!resAnterior || !resAnterior.cable || !condAnterior) {
        alert(
          `Para calcular este tramo y su Ik, primero debés calcular el tramo aguas arriba: ${tramoPrev.label}`
        );
        return;
      }

      const longitudKm = (Number(condAnterior.longitud) || 0) / 1000;
      const n = resAnterior.nConductores;
      const R = Number(resAnterior.cable.resistencia || 0);

      let X = 0;
      if (condAnterior.tipoCable === 'Unipolar' && condAnterior.disposicion === 'trebol') {
        X = Number(resAnterior.cable.reactancia?.['unipolar_trebol'] || 0);
      } else if (condAnterior.tipoCable === 'Unipolar' && condAnterior.disposicion === 'contacto') {
        X = Number(resAnterior.cable.reactancia?.['unipolar_contacto'] || 0);
      } else {
        X = Number(
          resAnterior.cable.reactancia?.[
            project.tipoInstalacion === 'Trifásica' ? 'trifasico' : 'monofasico'
          ] || 0
        );
      }

      total_R += (R * longitudKm) / n;
      total_X += (X * longitudKm) / n;
    }

    const Z_total = Math.sqrt(total_R ** 2 + total_X ** 2);
    let Ik_calculado = 50;
    if (Z_total > 0) {
      Ik_calculado =
        project.tipoInstalacion === 'Trifásica'
          ? tensionSecundaria / (Math.sqrt(3) * Z_total) / 1000
          : tensionSecundaria / (2 * Z_total) / 1000;
    }

    const caidaMaxPermitida = Number(conductor.caidaMaxPermitida) || 3;
    const tiempoApertura = tramoId === 'trafo-tgbt' ? (Number(conductor.tiempoAperturaMT) || 0.1) : 0.1;

    const resultado = calcularConductorTramo(
      { ...conductor, tipoInstalacion: project.tipoInstalacion, plano: conductor.plano },
      I_fase,
      Ik_calculado,
      tiempoApertura,
      (Number(conductor.longitud) || 0) / 1000,
      Number(project.transformador?.cosFi) || 0.95,
      caidaMaxPermitida,
      catalogo,
      Number((project as any).tempAmbiente) || 40,
      true
    );

    const resultadoCompleto = {
      ...resultado,
      I_nominal: Inominal,
      I_fase,
      I_neutro,
      armonicosActivos: armonicos?.habilitado ?? false,
      Ik: Ik_calculado,
    };

    setResultados(prev => ({ ...prev, [tramoId]: resultadoCompleto }));
    updateConductor(tramoId, { ...conductor, resultadoCalculo: resultadoCompleto });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: project.id, name: project.name, data: project }),
      });
      if (response.ok) {
        alert('Configuración de conductores guardada exitosamente');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar');
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const currentConductor = getConductor(selectedTramoId);
  const currentResultado = resultados[selectedTramoId];
  const currentTramoLabel = todosLosTramos.find(t => t.id === selectedTramoId)?.label || '';

  return (
    <div className="flex gap-5 items-start">
      {/* ── Columna izquierda: Tableros Seccionales ── */}
      <div className="w-72 shrink-0 sticky top-4 max-h-[calc(100vh-8rem)] flex flex-col">
        <TablerosSeccionales project={project} onChange={onChange} />
      </div>

      {/* ── Columna derecha: Cálculo de Conductores ── */}
      <div className="flex-1 min-w-0 bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Cálculo de Conductores</h2>
          <button
            onClick={handleSave}
            className="bg-[var(--accent)] text-black px-4 py-2 rounded-lg font-bold"
          >
            Guardar Cambios
          </button>
        </div>

        <div className="space-y-6">
          {/* Selector de tramo */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
              Seleccionar Tramo
            </label>
            <select
              className="bg-slate-950 text-white text-sm rounded-lg p-3 border border-slate-700 hover:border-slate-500 transition-colors w-full"
              value={selectedTramoId}
              onChange={e => setSelectedTramoId(e.target.value)}
            >
              <optgroup label="Tramos fijos">
                {TRAMOS_FIJOS.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </optgroup>
              {tablerosSec.length > 0 && (
                <optgroup label="Tramos por tablero seccional">
                  {tablerosSec.flatMap(t => [
                    <option key={tramoBarraSalidaId(t.id)} value={tramoBarraSalidaId(t.id)}>
                      Barra → Int. Salida [{t.nombre}] ({Number(t.potencia).toFixed(1)} kVA)
                    </option>,
                    <option key={tramoSalidaTableroId(t.id)} value={tramoSalidaTableroId(t.id)}>
                      Int. Salida → Tablero [{t.nombre}] ({Number(t.potencia).toFixed(1)} kVA)
                    </option>,
                  ])}
                </optgroup>
              )}
            </select>

            {/* Indicador de corriente nominal del tramo */}
            {selectedTramoId && (
              <div className="text-xs text-slate-400 ml-1">
                Corriente nominal del tramo:{' '}
                <span className="font-bold text-amber-400">
                  {getInominalTramo(selectedTramoId).toFixed(1)} A
                </span>
              </div>
            )}

            {/* Aviso si no hay tableros y se intenta acceder a tramos de tablero */}
            {tablerosSec.length === 0 && (
              <div className="text-xs text-slate-500 italic ml-1 mt-1">
                ↑ Agregá tableros seccionales en el panel izquierdo para habilitar los tramos de salida.
              </div>
            )}
          </div>

          {/* Formulario del tramo */}
          <div className="bg-[var(--bg-primary)] rounded-xl border border-slate-700 p-6 space-y-6 transition-all">
            <ConductorForm
              label={`Configuración: ${currentTramoLabel}`}
              tramoId={selectedTramoId}
              conductor={currentConductor}
              onChange={c => updateConductor(selectedTramoId, c)}
            />

            <button
              onClick={handleCalcular}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg font-bold hover:bg-slate-600 transition-colors"
            >
              Calcular Conductor
            </button>

            {currentResultado?.error && (
              <div className="p-3 bg-red-950 rounded border border-red-700 text-xs text-red-200">
                <p>{currentResultado.error}</p>
              </div>
            )}

            {currentResultado && !currentResultado.error && (
              <div className="p-4 bg-slate-950 rounded border border-slate-700 text-sm text-white space-y-3">
                <p className="font-bold text-slate-400 uppercase text-[10px] mb-3">Resultado del Cálculo</p>

                {/* Conductor seleccionado */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-900 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase mb-0.5">Sección</p>
                    <p className="text-[var(--accent)] font-bold text-base">
                      {currentResultado.cable.seccion} mm²
                    </p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase mb-0.5">Cables ‖</p>
                    <p className="text-[var(--accent)] font-bold text-base">
                      {currentResultado.nConductores}
                    </p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase mb-0.5">Caída V</p>
                    <p className="text-[var(--accent)] font-bold text-base">
                      {currentResultado.porcentajeCaida.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Corrientes */}
                <div className="border-t border-slate-800 pt-3 space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Corrientes del Tramo
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">
                      Corriente nominal (I<sub>nom</sub>):
                    </span>
                    <span className="font-bold text-white">
                      {currentResultado.I_nominal?.toFixed(1)} A
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Ik (Corriente de Cortocircuito):</span>
                    <span className="font-bold text-red-400">
                      {currentResultado.Ik?.toFixed(2)} kA
                    </span>
                  </div>
                  {currentResultado.armonicosActivos && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-amber-400">Corriente real por fase (con armónicos):</span>
                        <span className="font-bold text-amber-300">
                          {currentResultado.I_fase?.toFixed(1)} A
                        </span>
                      </div>
                      {currentResultado.I_neutro !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-orange-400">Corriente por neutro (3° + 9° arm.):</span>
                          <span className="font-bold text-orange-300">
                            {currentResultado.I_neutro?.toFixed(1)} A
                          </span>
                        </div>
                      )}
                      <div className="mt-2 p-2 bg-amber-950/40 rounded border border-amber-900/50 text-[10px] text-amber-400">
                        ⚠ Diseño con armónicos activos. El conductor fue seleccionado para I
                        <sub>fase</sub> = {currentResultado.I_fase?.toFixed(1)} A.
                        {currentResultado.I_neutro !== undefined &&
                          ` El neutro debe soportar ${currentResultado.I_neutro?.toFixed(1)} A.`}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
