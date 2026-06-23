import { useState } from 'react';
import { Project, Conductor } from '../types/project';
import { ConductorForm } from './ConductorForm';
import { calcularConductorTramo } from '../engine/calculadorTramo';
import { catalogoCablesPVC, catalogoCablesXLPE, ParametrosCableCompleto } from '../data/cables';
import { ChevronDown, ChevronUp } from 'lucide-react';

const TRAMOS_ELECTRICOS = [
  { id: 'trafo-tgbt', label: 'Transformador - Interruptor Cabecera TGBT' },
  { id: 'tgbt-barra', label: 'Interruptor Cabecera TGBT - Barra Omnibus' },
  { id: 'barra-salida', label: 'Barra Omnibus - Interruptor de salida TGBT' },
  { id: 'salida-tablero', label: 'Interruptor de salida TGBT - Tablero Seccional' },
];

export const ConductorCalculation = ({ project, onChange }: { project: Project, onChange: (p: Project) => void }) => {
  const [selectedTramoId, setSelectedTramoId] = useState<string>(TRAMOS_ELECTRICOS[0].id);
  const [resultados, setResultados] = useState<Record<string, any>>({});

  const getConductor = (tramoId: string): Conductor | undefined => {
    return (project as any).conductores?.[tramoId];
  };

  const updateConductor = (tramoId: string, conductor: Conductor) => {
    onChange({
      ...project,
      conductores: {
        ...(project as any).conductores,
        [tramoId]: conductor
      }
    });
  };

  const handleCalcular = () => {
    const tramoId = selectedTramoId;
    const conductor = getConductor(tramoId);
    if (!conductor || !conductor.aislacion || !conductor.material || !conductor.metodoInstalacion) {
        alert("Por favor completa todos los datos del conductor");
        return;
    }
    
    setResultados(prev => ({ ...prev, [tramoId]: null }));
    
    const catalogo: ParametrosCableCompleto[] = conductor.aislacion === 'XLPE' ? catalogoCablesXLPE : catalogoCablesPVC;

    const potenciaVA = (project.transformador?.potencia || 0) * 1000;
    const tensionSecundaria = project.transformador?.tensionSecundario || (project.tipoInstalacion === 'Trifásica' ? 380 : 220);
    const Inominal = potenciaVA / (project.tipoInstalacion === 'Trifásica' ? Math.sqrt(3) * tensionSecundaria : tensionSecundaria);

    // --- Lógica de armónicos ---
    const armonicos = project.armonicos;
    let I_fase = Inominal;
    let I_neutro: number | undefined = undefined;

    if (armonicos?.habilitado) {
      // Convertir a porcentaje (0 a 1) si el modo es amperios
      const toPorc = (val: number) => {
        if (armonicos.modoEntrada === 'amperios') {
          return Inominal > 0 ? val / Inominal : 0;
        }
        return val;
      };

      const I3 = toPorc(armonicos.h3 ?? 0);
      const I5 = toPorc(armonicos.h5 ?? 0);
      const I7 = toPorc(armonicos.h7 ?? 0);
      const I9 = toPorc(armonicos.h9 ?? 0);

      // Corriente por fase: Inominal * sqrt(1 + I3² + I5² + I7² + I9²)
      I_fase = Inominal * Math.sqrt(1 + I3 ** 2 + I5 ** 2 + I7 ** 2 + I9 ** 2);

      // Corriente de neutro: 3 * Inominal * (I3 + I9)
      I_neutro = 3 * Inominal * (I3 + I9);
    }

    // --- Cálculo de Ik (Cortocircuito) con impedancias acumuladas ---
    let total_R = 0;
    let total_X = project.transformador?.impedancia || 0; // Ztrafo (asumido mayormente reactivo)

    const tramoIndex = TRAMOS_ELECTRICOS.findIndex(t => t.id === tramoId);
    
    for (let i = 0; i < tramoIndex; i++) {
        const tramoAnteriorId = TRAMOS_ELECTRICOS[i].id;
        const resAnterior = resultados[tramoAnteriorId];
        const condAnterior = getConductor(tramoAnteriorId);
        
        if (!resAnterior || !resAnterior.cable || !condAnterior) {
             alert(`Para calcular este tramo y su Ik, primero debes calcular el tramo aguas arriba: ${TRAMOS_ELECTRICOS[i].label}`);
             return;
        }

        const longitudKm = (condAnterior.longitud || 0) / 1000;
        const n = resAnterior.nConductores;
        const R = Number(resAnterior.cable.resistencia || 0);
        
        let X = 0;
        if (condAnterior.tipoCable === 'Unipolar' && condAnterior.disposicion === 'trebol') {
            X = Number(resAnterior.cable.reactancia?.['unipolar_trebol'] || 0);
        } else if (condAnterior.tipoCable === 'Unipolar' && condAnterior.disposicion === 'contacto') {
            X = Number(resAnterior.cable.reactancia?.['unipolar_contacto'] || 0);
        } else {
            X = Number(resAnterior.cable.reactancia?.[project.tipoInstalacion === 'Trifásica' ? 'trifasico' : 'monofasico'] || 0);
        }

        total_R += (R * longitudKm) / n;
        total_X += (X * longitudKm) / n;
    }

    const Z_total = Math.sqrt(total_R ** 2 + total_X ** 2);
    
    let Ik_calculado = 50; // Fallback
    if (Z_total > 0) {
        if (project.tipoInstalacion === 'Trifásica') {
            Ik_calculado = tensionSecundaria / (Math.sqrt(3) * Z_total) / 1000; // en kA
        } else {
            Ik_calculado = tensionSecundaria / (2 * Z_total) / 1000; // en kA
        }
    }

    const caidaMaxPermitida = conductor.caidaMaxPermitida || 3;
    const tiempoApertura = tramoId === 'trafo-tgbt' ? (conductor.tiempoAperturaMT || 0.1) : 0.1;

    const resultado = calcularConductorTramo(
       {...conductor, tipoInstalacion: project.tipoInstalacion, plano: conductor.plano},
       I_fase,  
       Ik_calculado, // Ik real acumulado 
       tiempoApertura, 
       (conductor.longitud || 0) / 1000, 
       project.transformador?.cosFi || 0.95,
       caidaMaxPermitida, 
       catalogo,
       (project as any).tempAmbiente || 40,
       true 
    );
    setResultados(prev => ({ ...prev, [tramoId]: { ...resultado, I_nominal: Inominal, I_fase, I_neutro, armonicosActivos: armonicos?.habilitado ?? false, Ik: Ik_calculado } }));
  };


  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: project.id,
          name: project.name,
          data: project
        })
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
  const currentTramoLabel = TRAMOS_ELECTRICOS.find(t => t.id === selectedTramoId)?.label || '';

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Cálculo de Conductores</h2>
        <button onClick={handleSave} className="bg-[var(--accent)] text-black px-4 py-2 rounded-lg font-bold">Guardar Cambios</button>
      </div>
      
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
            Seleccionar Tramo
          </label>
          <select 
            className="bg-slate-950 text-white text-sm rounded-lg p-3 border border-slate-700 hover:border-slate-500 transition-colors w-full md:w-1/3"
            value={selectedTramoId}
            onChange={(e) => setSelectedTramoId(e.target.value)}
          >
            {TRAMOS_ELECTRICOS.map(tramo => (
              <option key={tramo.id} value={tramo.id}>{tramo.label}</option>
            ))}
          </select>
        </div>

        <div className="bg-[var(--bg-primary)] rounded-xl border border-slate-700 p-6 space-y-6 transition-all">
          <ConductorForm 
            label={`Configuración: ${currentTramoLabel}`}
            tramoId={selectedTramoId}
            conductor={currentConductor}
            onChange={(c) => updateConductor(selectedTramoId, c)}
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
                  <p className="text-[var(--accent)] font-bold text-base">{currentResultado.cable.seccion} mm²</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-slate-500 uppercase mb-0.5">Cables ‖</p>
                  <p className="text-[var(--accent)] font-bold text-base">{currentResultado.nConductores}</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-slate-500 uppercase mb-0.5">Caída V</p>
                  <p className="text-[var(--accent)] font-bold text-base">{currentResultado.porcentajeCaida.toFixed(2)}%</p>
                </div>
              </div>

              {/* Corrientes */}
              <div className="border-t border-slate-800 pt-3 space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Corrientes del Tramo</p>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Corriente nominal (I<sub>nom</sub>):</span>
                  <span className="font-bold text-white">{currentResultado.I_nominal?.toFixed(1)} A</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Ik (Corriente de Cortocircuito):</span>
                  <span className="font-bold text-red-400">{currentResultado.Ik?.toFixed(2)} kA</span>
                </div>
                {currentResultado.armonicosActivos && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-400">Corriente real por fase (con armónicos):</span>
                      <span className="font-bold text-amber-300">{currentResultado.I_fase?.toFixed(1)} A</span>
                    </div>
                    {currentResultado.I_neutro !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-orange-400">Corriente por neutro (3° + 9° arm.):</span>
                        <span className="font-bold text-orange-300">{currentResultado.I_neutro?.toFixed(1)} A</span>
                      </div>
                    )}
                    <div className="mt-2 p-2 bg-amber-950/40 rounded border border-amber-900/50 text-[10px] text-amber-400">
                      ⚠ Diseño con armónicos activos. El conductor fue seleccionado para I<sub>fase</sub> = {currentResultado.I_fase?.toFixed(1)} A.
                      {currentResultado.I_neutro !== undefined && ` El neutro debe soportar ${currentResultado.I_neutro?.toFixed(1)} A.`}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
