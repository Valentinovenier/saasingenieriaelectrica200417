import { Project } from '../../types/project';
import { Ambiente, CircuitoVivienda, TipoCircuito } from '../../types/vivienda';
import { Check, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

// Helper to get human-readable name and capabilities
const getCircuitoInfo = (tipo: TipoCircuito) => {
  switch (tipo) {
    case 'iluminacion_usos_generales': return { label: 'IUG', iug: 1, tug: 0 };
    case 'tomacorrientes_usos_generales': return { label: 'TUG', iug: 0, tug: 1 };
    case 'iluminacion_con_tomacorrientes': return { label: 'IUG+TUG', iug: 1, tug: 1 };
    case 'usos_especiales': return { label: 'Especial', iug: 0, tug: 0 };
    default: return { label: tipo, iug: 0, tug: 0 };
  }
};

export const ViviendaAsignacion = ({ project, onChange }: Props) => {
  const datos = project.datosVivienda || { superficieCubierta: 0, superficieSemicubierta: 0, ambientes: [], circuitos: [] };

  const toggleCircuitoEnAmbiente = (ambienteId: string, circuitoId: string) => {
    const nuevosAmbientes = datos.ambientes.map(a => {
      if (a.id !== ambienteId) return a;
      const currentCircuitos = a.circuitos || [];
      const nuevosCircuitos = currentCircuitos.includes(circuitoId)
        ? currentCircuitos.filter(id => id !== circuitoId)
        : [...currentCircuitos, circuitoId];
      return { ...a, circuitos: nuevosCircuitos };
    });
    onChange({ ...project, datosVivienda: { ...datos, ambientes: nuevosAmbientes } });
  };

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white">Asignación de Circuitos por Ambiente</h2>
        <div className="text-xs text-slate-400 italic">
          Asigne circuitos para cubrir los puntos mínimos de cada ambiente.
        </div>
      </div>

      {datos.ambientes.length === 0 && (
        <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-700 text-slate-500">
          No hay ambientes definidos. Vuelve al paso anterior.
        </div>
      )}

      <div className="space-y-8">
        {datos.ambientes.map((ambiente) => {
          // Calculate assigned points for this environment
          let assignedIUG = 0;
          let assignedTUG = 0;

          ambiente.circuitos?.forEach(cId => {
            const circ = datos.circuitos.find(c => c.id === cId);
            if (circ) {
              const info = getCircuitoInfo(circ.tipo);
              assignedIUG += info.iug;
              assignedTUG += info.tug;
            }
          });

          const iugOk = (ambiente.puntosIUG || 0) <= assignedIUG;
          const tugOk = (ambiente.puntosTUG || 0) <= assignedTUG;
          const ambienteOk = iugOk && tugOk;

          return (
            <div key={ambiente.id} className="space-y-3 border-l-2 border-slate-800 pl-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">{ambiente.nombre}</h3>
                  {ambienteOk ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <AlertCircle size={18} className="text-amber-500" />
                  )}
                </div>
                
                <div className="flex gap-4 text-[11px] font-medium">
                  <div className={`flex items-center gap-1 ${iugOk ? 'text-emerald-400' : 'text-red-400'}`}>
                    <span className="text-slate-500 uppercase">Req IUG:</span>
                    <span>{ambiente.puntosIUG || 0}</span>
                    <span className="text-white opacity-50">/ {assignedIUG}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${tugOk ? 'text-emerald-400' : 'text-red-400'}`}>
                    <span className="text-slate-500 uppercase">Req TUG:</span>
                    <span>{ambiente.puntosTUG || 0}</span>
                    <span className="text-white opacity-50">/ {assignedTUG}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {datos.circuitos.map((circuito) => {
                  const isSelected = ambiente.circuitos?.includes(circuito.id);
                  const info = getCircuitoInfo(circuito.tipo);
                  return (
                    <button
                      key={circuito.id}
                      onClick={() => toggleCircuitoEnAmbiente(ambiente.id, circuito.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-[10px] font-bold transition-all ${
                        isSelected
                          ? 'bg-[var(--accent)] border-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xs mb-1">{circuito.nombre}</span>
                      <span className={isSelected ? 'text-black/70' : 'text-slate-500'}>{info.label}</span>
                    </button>
                  );
                })}
                {datos.circuitos.length === 0 && (
                   <div className="col-span-full text-center py-4 bg-slate-900/30 rounded text-slate-500 text-xs italic">
                      Define circuitos primero en el paso anterior.
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
