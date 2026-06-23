import { Project } from '../types/project';

const TRAMOS_ELECTRICOS = [
  { id: 'trafo-tgbt', label: 'Transformador - Interruptor Cabecera TGBT' },
  { id: 'tgbt-barra', label: 'Interruptor Cabecera TGBT - Barra Omnibus' },
  { id: 'barra-salida', label: 'Barra Omnibus - Interruptor de salida TGBT' },
  { id: 'salida-tablero', label: 'Interruptor de salida TGBT - Tablero Seccional' },
];

export const ProjectReport = ({ project }: { project: Project }) => {
  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white">Informe Técnico: {project.name}</h2>
        <span className="text-sm font-medium text-slate-400">Instalación: {project.tipoInstalacion || 'Trifásica'}</span>
      </div>

      {/* Resumen del transformador */}
      <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700 shadow-sm">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
          1. Parámetros del Transformador
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white">
          <div>
            <p className="text-slate-500 text-[10px] uppercase">Potencia (kVA)</p>
            <p className="font-semibold text-lg">{project.transformador?.potencia || '-'}</p>
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
            <p className="text-slate-500 text-[10px] uppercase">Impedancia Z (Ω)</p>
            <p className="font-semibold text-lg text-red-400">{project.transformador?.impedancia || '0'}</p>
          </div>
        </div>
      </div>

      {/* Armónicos */}
      {project.armonicos?.habilitado && (
        <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700 shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            2. Distorsión Armónica Aplicada
          </h3>
          <div className="grid grid-cols-4 gap-4 text-sm text-white">
            {(['h3', 'h5', 'h7', 'h9'] as const).map(h => (
              <div key={h}>
                <p className="text-slate-500 text-[10px] uppercase">{h}</p>
                <p className="font-semibold">{project.armonicos?.[h] || '0'} {project.armonicos?.modoEntrada === 'amperios' ? 'A' : '%'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resultados de Conductores */}
      <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700 shadow-sm">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
          3. Tramos y Conductores Calculados
        </h3>
        
        <div className="space-y-4">
          {TRAMOS_ELECTRICOS.map((tramo, index) => {
            const conductor = (project as any).conductores?.[tramo.id];
            const resultado = conductor?.resultadoCalculo;

            if (!conductor || !resultado || resultado.error) {
              return (
                <div key={tramo.id} className="bg-slate-900 rounded-lg p-4 border border-slate-800 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-400">{index + 1}. {tramo.label}</span>
                  <span className="text-xs text-slate-600 italic">No calculado</span>
                </div>
              );
            }

            return (
              <div key={tramo.id} className="bg-slate-900 rounded-lg p-5 border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-3">{index + 1}. {tramo.label}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Datos del conductor elegido */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Cable Seleccionado</p>
                    <div className="flex gap-2 items-center">
                      <span className="text-slate-400 text-xs">Tipo:</span>
                      <span className="text-white text-xs font-semibold">{conductor.aislacion} / {conductor.material} / {conductor.tipoCable}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-slate-400 text-xs">Método Inst.:</span>
                      <span className="text-white text-xs font-semibold">{conductor.metodoInstalacion}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-slate-400 text-xs">Longitud:</span>
                      <span className="text-white text-xs font-semibold">{conductor.longitud} m</span>
                    </div>
                    <div className="flex gap-2 items-center mt-2 p-2 bg-slate-950 rounded">
                      <span className="text-[var(--accent)] text-sm font-bold">{resultado.nConductores} x {resultado.cable.seccion} mm²</span>
                    </div>
                  </div>

                  {/* Resultados eléctricos */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Cálculo Eléctrico</p>
                    <div className="flex justify-between items-center bg-slate-950 p-1.5 rounded px-3">
                      <span className="text-slate-400 text-xs">Caída de Tensión:</span>
                      <span className="text-white text-xs font-bold">{resultado.porcentajeCaida?.toFixed(2)} %</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950 p-1.5 rounded px-3">
                      <span className="text-slate-400 text-xs">Corriente (I<sub>fase</sub>):</span>
                      <span className="text-amber-400 text-xs font-bold">{resultado.I_fase?.toFixed(1)} A</span>
                    </div>
                    {resultado.I_neutro !== undefined && (
                      <div className="flex justify-between items-center bg-slate-950 p-1.5 rounded px-3">
                        <span className="text-slate-400 text-xs">I<sub>neutro</sub> (Armónicos):</span>
                        <span className="text-orange-400 text-xs font-bold">{resultado.I_neutro?.toFixed(1)} A</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center bg-slate-950 p-1.5 rounded px-3 border border-red-900/30">
                      <span className="text-slate-400 text-xs">Ik (inicio del tramo):</span>
                      <span className="text-red-400 text-xs font-bold">{resultado.Ik?.toFixed(2)} kA</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950 p-1.5 rounded px-3">
                      <span className="text-slate-400 text-xs">Z<sub>cable</sub> agregada:</span>
                      <span className="text-blue-400 text-xs font-bold">
                        R: {resultado.cable.resistencia} Ω/km
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
