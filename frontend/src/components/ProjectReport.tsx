import { Project } from '../types/project';
import { seleccionarInterruptorAbierto, seleccionarInterruptorCompacto } from '../engine/seleccionProtecciones';

const TRAMOS_ELECTRICOS = [
  { id: 'trafo-tgbt', label: 'Transformador - Interruptor Cabecera TGBT' },
  { id: 'tgbt-barra', label: 'Interruptor Cabecera TGBT - Barra Omnibus' },
];

export const ProjectReport = ({ project }: { project: Project }) => {
  const tablerosSec = project.tablerosSeccionales || [];

  // Calcular la caída de tensión acumulada para un tablero seccional
  const calcularCaidaAcumulada = (tsId: string): number => {
    let acumulada = 0;
    
    // Tramos fijos aguas arriba
    const t1 = project.conductores?.['trafo-tgbt']?.resultadoCalculo?.porcentajeCaida || 0;
    const t2 = project.conductores?.['tgbt-barra']?.resultadoCalculo?.porcentajeCaida || 0;
    
    // Tramos específicos del tablero
    const t3 = project.conductores?.[`barra-salida__${tsId}`]?.resultadoCalculo?.porcentajeCaida || 0;
    const t4 = project.conductores?.[`salida-tablero__${tsId}`]?.resultadoCalculo?.porcentajeCaida || 0;

    return t1 + t2 + t3 + t4;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800 space-y-6 print:bg-white print:text-black print:p-0 print:border-none">
      {/* Botón para imprimir / PDF */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4 print:hidden">
        <h2 className="text-2xl font-bold text-white">Informe Técnico: {project.name}</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
          >
            Imprimir / Exportar PDF
          </button>
          <span className="text-sm font-medium text-slate-400 self-center">
            Instalación: {project.tipoInstalacion || 'Trifásica'}
          </span>
        </div>
      </div>

      <div className="hidden print:block mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">MEMORIA DE CÁLCULO ELÉCTRICO</h1>
        <p className="text-slate-600 mt-2">SaaS Ingeniería Eléctrica - AEA 90364</p>
        <p className="text-slate-500 text-sm mt-1">Proyecto: {project.name} ({project.tipoInstalacion || 'Trifásica'})</p>
      </div>

      {/* Resumen del transformador */}
      <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700 shadow-sm print:bg-white print:border-slate-300">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 print:text-slate-600 print:border-slate-300">
          1. Parámetros del Transformador
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-white print:text-black">
          <div>
            <p className="text-slate-500 text-[10px] uppercase">Potencia (kVA)</p>
            <p className="font-semibold text-lg">{project.transformador?.potencia || '-'}</p>
          </div>
          <div>
            <p className="text-slate-500 text-[10px] uppercase">Tipo / Aislamiento</p>
            <p className="font-semibold text-lg">{project.transformador?.tipo || 'Aceite'}</p>
          </div>
          <div>
            <p className="text-slate-500 text-[10px] uppercase">Tensión Sec. (V)</p>
            <p className="font-semibold text-lg">{project.transformador?.tensionSecundario || '-'}</p>
          </div>
          <div>
            <p className="text-slate-500 text-[10px] uppercase">Cos φ</p>
            <p className="font-semibold text-lg">{project.transformador?.cosFi || '-'}</p>
          </div>
          <div>
            <p className="text-slate-500 text-[10px] uppercase">Impedancia Z<sub>cc</sub> (Ω)</p>
            <p className="font-semibold text-lg text-emerald-400 print:text-emerald-700">{project.transformador?.impedancia || '0'}</p>
          </div>
        </div>
      </div>

      {/* Armónicos */}
      {project.armonicos?.habilitado && (
        <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700 shadow-sm print:bg-white print:border-slate-300">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 print:text-slate-600 print:border-slate-300">
            2. Distorsión Armónica Aplicada
          </h3>
          <div className="grid grid-cols-4 gap-4 text-sm text-white print:text-black">
            {(['h3', 'h5', 'h7', 'h9'] as const).map(h => (
              <div key={h}>
                <p className="text-slate-500 text-[10px] uppercase">{h === 'h3' ? '3° Armónico' : h === 'h5' ? '5°' : h === 'h7' ? '7°' : '9°'}</p>
                <p className="font-semibold">{project.armonicos?.[h] || '0'} {project.armonicos?.modoEntrada === 'amperios' ? 'A' : '%'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resultados de Conductores Principales */}
      <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700 shadow-sm print:bg-white print:border-slate-300">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 print:text-slate-600 print:border-slate-300">
          3. Conductores y Alimentadores Principales
        </h3>
        
        <div className="space-y-4">
          {TRAMOS_ELECTRICOS.map((tramo, index) => {
            const conductor = (project as any).conductores?.[tramo.id];
            const resultado = conductor?.resultadoCalculo;

            if (!conductor || !resultado || resultado.error) {
              return (
                <div key={tramo.id} className="bg-slate-900 rounded-lg p-4 border border-slate-800 flex justify-between items-center print:bg-white print:border-slate-300">
                  <span className="text-sm font-medium text-slate-400 print:text-slate-600">{index + 1}. {tramo.label}</span>
                  <span className="text-xs text-slate-600 italic">No calculado</span>
                </div>
              );
            }

            return (
              <div key={tramo.id} className="bg-slate-900 rounded-lg p-4 border border-slate-800 print:bg-white print:border-slate-300">
                <h4 className="text-sm font-bold text-white mb-2 print:text-black">{index + 1}. {tramo.label}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <p><span className="text-slate-500">Cable:</span> <span className="font-semibold text-white print:text-black">{conductor.aislacion} / {conductor.material} / {conductor.tipoCable}</span></p>
                    <p><span className="text-slate-500">Instalación:</span> <span className="text-white print:text-black">Método {conductor.metodoInstalacion} {conductor.agrupamiento > 1 ? `(Agrupado: ${conductor.agrupamiento})` : ''}</span></p>
                    <p><span className="text-slate-500">Longitud:</span> <span className="text-white print:text-black">{conductor.longitud} m</span></p>
                    <p className="mt-1 font-bold text-emerald-400 print:text-emerald-700">Sección: {resultado.nConductores}x({resultado.cable.seccion} mm²)</p>
                  </div>
                  <div className="space-y-1">
                    <p><span className="text-slate-500">Caída de Tensión:</span> <span className="font-bold text-white print:text-black">{resultado.porcentajeCaida?.toFixed(2)} %</span></p>
                    <p><span className="text-slate-500">I nominal:</span> <span className="text-white print:text-black">{resultado.I_nominal?.toFixed(1)} A</span></p>
                    <p><span className="text-slate-500">I fase (con armónicos):</span> <span className="text-amber-400 font-bold">{resultado.I_fase?.toFixed(1)} A</span></p>
                    <p><span className="text-slate-500">Ik cortocircuito:</span> <span className="text-red-400 font-bold">{resultado.Ik?.toFixed(2)} kA</span></p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resultados de Tableros Seccionales */}
      <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700 shadow-sm print:bg-white print:border-slate-300">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 print:text-slate-600 print:border-slate-300">
          4. Alimentación a Tableros Seccionales
        </h3>
        
        {tablerosSec.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No se han configurado tableros seccionales.</p>
        ) : (
          <div className="space-y-6">
            {tablerosSec.map((ts, index) => {
              const condBarraSalida = (project as any).conductores?.[`barra-salida__${ts.id}`];
              const condSalidaTablero = (project as any).conductores?.[`salida-tablero__${ts.id}`];
              
              const resBarra = condBarraSalida?.resultadoCalculo;
              const resSalida = condSalidaTablero?.resultadoCalculo;

              return (
                <div key={ts.id} className="border border-slate-800 rounded-lg p-4 bg-slate-900/50 print:bg-white print:border-slate-300">
                  <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-1.5 mb-3 print:text-black">
                    {index + 1}. Tablero "{ts.nombre}" — Potencia: {ts.potencia} kVA
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tramo 1: Barra a Interruptor */}
                    <div className="p-3 bg-slate-950/60 rounded border border-slate-800 print:bg-white print:border-slate-200">
                      <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Tramo: Barra a Salida TGBT</p>
                      {resBarra && !resBarra.error ? (
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-emerald-400 print:text-emerald-700">Cable: {resBarra.nConductores}x({resBarra.cable.seccion} mm²)</p>
                          <p><span className="text-slate-500">Longitud:</span> {condBarraSalida.longitud} m</p>
                          <p><span className="text-slate-500">Caída V:</span> {resBarra.porcentajeCaida?.toFixed(2)}%</p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-600 italic">No calculado</p>
                      )}
                    </div>

                    {/* Tramo 2: Interruptor a Tablero */}
                    <div className="p-3 bg-slate-950/60 rounded border border-slate-800 print:bg-white print:border-slate-200">
                      <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Tramo: Salida a Tablero Seccional</p>
                      {resSalida && !resSalida.error ? (
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-emerald-400 print:text-emerald-700">Cable: {resSalida.nConductores}x({resSalida.cable.seccion} mm²)</p>
                          <p><span className="text-slate-500">Longitud:</span> {condSalidaTablero.longitud} m</p>
                          <p><span className="text-slate-500">Caída V:</span> {resSalida.porcentajeCaida?.toFixed(2)}%</p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-600 italic">No calculado</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recomendación de Protecciones */}
      <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700 shadow-sm print:bg-white print:border-slate-300">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 print:text-slate-600 print:border-slate-300">
          5. Protecciones Recomendadas (Verificación Normativa)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left print:text-black">
            <thead>
              <tr className="border-b border-slate-800 print:border-slate-300 text-slate-500 text-[10px] uppercase">
                <th className="pb-2">Tramo / Destino</th>
                <th className="pb-2">I diseño (A)</th>
                <th className="pb-2">Ik (kA)</th>
                <th className="pb-2">Interruptor Recomendado</th>
                <th className="pb-2">Marca / Serie</th>
                <th className="pb-2">Poder Corte (Icu)</th>
              </tr>
            </thead>
            <tbody>
              {/* Cabecera TGBT */}
              {(() => {
                const res = project.conductores?.['trafo-tgbt']?.resultadoCalculo;
                if (!res || res.error) return null;
                const acb = seleccionarInterruptorAbierto(res.I_fase, res.Ik, res.Ik * 2.1, 0.1);
                return (
                  <tr className="border-b border-slate-800/50 print:border-slate-200">
                    <td className="py-2.5 font-semibold text-white print:text-black">Cabecera TGBT (Trafo)</td>
                    <td className="py-2.5">{res.I_fase?.toFixed(1)} A</td>
                    <td className="py-2.5">{res.Ik?.toFixed(2)} kA</td>
                    <td className="py-2.5 text-emerald-400 print:text-emerald-700 font-bold">{acb?.modelo || 'ACB no disponible'}</td>
                    <td className="py-2.5">{acb?.marca} {acb?.serie}</td>
                    <td className="py-2.5 font-bold">{acb?.Icu} kA</td>
                  </tr>
                );
              })()}

              {/* Salidas a Tableros Seccionales */}
              {tablerosSec.map(ts => {
                const res = project.conductores?.[`salida-tablero__${ts.id}`]?.resultadoCalculo;
                if (!res || res.error) return null;
                // Seleccionar interruptor compacto MCCB
                const mccb = seleccionarInterruptorCompacto(res.I_fase, res.Ik);
                return (
                  <tr key={ts.id} className="border-b border-slate-800/50 print:border-slate-200">
                    <td className="py-2.5 font-semibold text-white print:text-black">Salida a Tablero "{ts.nombre}"</td>
                    <td className="py-2.5">{res.I_fase?.toFixed(1)} A</td>
                    <td className="py-2.5">{res.Ik?.toFixed(2)} kA</td>
                    <td className="py-2.5 text-emerald-400 print:text-emerald-700 font-bold">{mccb?.modelo || 'MCCB no disponible'}</td>
                    <td className="py-2.5">{mccb?.marca} {mccb?.serie}</td>
                    <td className="py-2.5 font-bold">{mccb?.Icu} kA</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Caída de Tensión Acumulada */}
      <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700 shadow-sm print:bg-white print:border-slate-300">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 print:text-slate-600 print:border-slate-300">
          6. Verificación de Caída de Tensión Acumulada
        </h3>
        <div className="space-y-3">
          {tablerosSec.map(ts => {
            const dvAcumulada = calcularCaidaAcumulada(ts.id);
            const limite = 5.0; // Límite general fuerza motriz
            const cumple = dvAcumulada <= limite;
            return (
              <div key={ts.id} className="flex justify-between items-center p-3 bg-slate-900 rounded border border-slate-800 print:bg-white print:border-slate-300 text-xs">
                <div>
                  <p className="font-semibold text-white print:text-black">Ruta a Tablero: "{ts.nombre}"</p>
                  <p className="text-[10px] text-slate-500">Trafo → TGBT → Barra → Tablero Seccional</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${cumple ? 'text-emerald-400 print:text-emerald-700' : 'text-red-400 print:text-red-700'}`}>
                    {dvAcumulada.toFixed(2)} % / {limite}% máx
                  </p>
                  <span className={`text-[10px] font-bold uppercase ${cumple ? 'text-emerald-500' : 'text-red-500'}`}>
                    {cumple ? '✓ Cumple' : '✗ Excede límite'}
                  </span>
                </div>
              </div>
            );
          })}
          {tablerosSec.length === 0 && (
            <p className="text-xs text-slate-500 italic">No hay tableros configurados para verificación acumulada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

