import { Project, TableroSeccionalSimple } from '../types/project';
import { seleccionarInterruptorAbierto, seleccionarInterruptorCompacto } from '../engine/seleccionProtecciones';

const TRAMOS_ELECTRICOS = [
  { id: 'trafo-tgbt', label: 'Transformador - Interruptor Cabecera TGBT' },
  { id: 'tgbt-barra', label: 'Interruptor Cabecera TGBT - Barra Omnibus' },
];

export const ProjectReport = ({ project }: { project: Project }) => {
  const isVivienda = project.projectType === 'Vivienda';
  const tablerosSec = project.tablerosSeccionales || [];

  const handlePrint = () => window.print();

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800 space-y-6 print:bg-white print:text-black print:p-0 print:border-none">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4 print:hidden">
        <h2 className="text-2xl font-bold text-white">Informe Técnico: {project.name}</h2>
        <button
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
        >
          Imprimir / Exportar PDF
        </button>
      </div>

      {isVivienda ? (
        <ViviendaReport project={project} />
      ) : (
        <IndustrialReport project={project} tablerosSec={tablerosSec} />
      )}
    </div>
  );
};

// --- Sub-componente para Informe Vivienda ---
const ViviendaReport = ({ project }: { project: Project }) => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white mb-4">Memoria de Cálculo: Vivienda (AEA 770)</h1>
        
        <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 border-b border-slate-800 pb-2">Resultados de Tramos</h3>
            <div className="space-y-3">
                {Object.entries(project.conductores || {}).map(([key, cond]) => (
                    <div key={key} className="p-3 bg-slate-900 rounded border border-slate-800 text-sm">
                        <p className="font-semibold text-white">{key.replace('__', ' - ')}</p>
                        <p className="text-xs text-slate-400">Sección: {cond.seccion} mm² | Caída: {cond.resultadoCalculo?.caidaTensionPorcentaje?.toFixed(2)}%</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- Sub-componente para Informe Industrial ---
const IndustrialReport = ({ project, tablerosSec }: { project: Project, tablerosSec: TableroSeccionalSimple[] }) => {
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

  return (
    <div className="space-y-6">
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

      {/* Resultados de Conductores Principales */}
      <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700 shadow-sm print:bg-white print:border-slate-300">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 print:text-slate-600 print:border-slate-300">
          2. Conductores y Alimentadores Principales
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
                    <p><span className="text-slate-500">I fase:</span> <span className="text-amber-400 font-bold">{resultado.I_fase?.toFixed(1)} A</span></p>
                    <p><span className="text-slate-500">Ik cortocircuito:</span> <span className="text-red-400 font-bold">{resultado.Ik?.toFixed(2)} kA</span></p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ... (el resto de las secciones industriales: Tableros, Protecciones, Caída Acumulada) ... */}
    </div>
  );
};

