import { Project } from '../../types/project';
import { Ambiente, CircuitoVivienda } from '../../types/vivienda';
import { Check, X } from 'lucide-react';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

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
      <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Asignación de Circuitos por Ambiente</h2>

      {datos.ambientes.length === 0 && (
        <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-700 text-slate-500">
          No hay ambientes definidos. Vuelve al paso anterior.
        </div>
      )}

      <div className="space-y-8">
        {datos.ambientes.map((ambiente) => (
          <div key={ambiente.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{ambiente.nombre}</h3>
              <div className="flex gap-4 text-xs text-slate-400">
                <span>IUG: <b className="text-white">{ambiente.puntosIUG || 0}</b></span>
                <span>TUG: <b className="text-white">{ambiente.puntosTUG || 0}</b></span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {datos.circuitos.map((circuito) => {
                const isSelected = ambiente.circuitos?.includes(circuito.id);
                return (
                  <button
                    key={circuito.id}
                    onClick={() => toggleCircuitoEnAmbiente(ambiente.id, circuito.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[var(--accent)] border-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                    }`}
                  >
                    <span>{circuito.nombre}</span>
                    {isSelected ? <Check size={14} /> : <X size={14} className="opacity-30" />}
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
        ))}
      </div>
    </div>
  );
};
