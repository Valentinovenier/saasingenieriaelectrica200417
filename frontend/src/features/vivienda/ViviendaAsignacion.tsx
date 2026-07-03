import { Project } from '../../types/project';
import { Ambiente, CircuitoCalculado, TipoCircuito } from '../../types/vivienda';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

const getCircuitoInfo = (tipo: TipoCircuito) => {
  switch (tipo) {
    case 'iluminacion_usos_generales': return { label: 'IUG' };
    case 'tomacorrientes_usos_generales': return { label: 'TUG' };
    case 'usos_especiales': return { label: 'Especial' };
    default: return { label: tipo };
  }
};

export const ViviendaAsignacion = ({ project, onChange }: Props) => {
  const datos = project.datosVivienda || { superficieCubierta: 0, superficieSemicubierta: 0, ambientes: [], circuitosCalculados: [] };

  const toggleAmbienteEnCircuito = (ambiente: Ambiente, circuitoId: string) => {
    const nuevosCircuitos = datos.circuitosCalculados.map(c => {
      if (c.id === circuitoId) {
        const estaAsignado = c.ambientesIds.includes(ambiente.id);
        const nuevosAmbientes = estaAsignado 
            ? c.ambientesIds.filter(id => id !== ambiente.id)
            : [...c.ambientesIds, ambiente.id];
        
        // Recalcular puntos del circuito
        const puntosIUG = nuevosAmbientes.reduce((acc, id) => {
            const amb = datos.ambientes.find(a => a.id === id);
            return acc + (c.tipo === 'iluminacion_usos_generales' ? (amb?.puntosIUG || 0) : 0);
        }, 0);
        const puntosTUG = nuevosAmbientes.reduce((acc, id) => {
            const amb = datos.ambientes.find(a => a.id === id);
            return acc + (c.tipo === 'tomacorrientes_usos_generales' ? (amb?.puntosTUG || 0) : 0);
        }, 0);

        return { ...c, ambientesIds: nuevosAmbientes, puntosIUG, puntosTUG };
      }
      return c;
    });

    onChange({ ...project, datosVivienda: { ...datos, circuitosCalculados: nuevosCircuitos } });
  };

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white">Asignación de Ambientes a Circuitos</h2>
      </div>

      <div className="space-y-8">
        {datos.ambientes.map((ambiente) => {
          return (
            <div key={ambiente.id} className="space-y-3 border-l-2 border-slate-800 pl-4">
              <h3 className="text-lg font-semibold text-white">{ambiente.nombre}</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {datos.circuitosCalculados.map((circuito) => {
                  const isSelected = circuito.ambientesIds.includes(ambiente.id);
                  const info = getCircuitoInfo(circuito.tipo);
                  
                  // Validar compatibilidad (solo IUG a circuitos IUG, TUG a TUG)
                  const esCompatible = (circuito.tipo === 'iluminacion_usos_generales' && ambiente.puntosIUG > 0) ||
                                       (circuito.tipo === 'tomacorrientes_usos_generales' && ambiente.puntosTUG > 0);

                  return (
                    <button
                      key={circuito.id}
                      onClick={() => toggleAmbienteEnCircuito(ambiente, circuito.id)}
                      disabled={!esCompatible}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-[10px] font-bold transition-all ${
                        isSelected
                          ? 'bg-[var(--accent)] border-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20'
                          : esCompatible 
                            ? 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                            : 'bg-slate-950 border-slate-800 text-slate-700 cursor-not-allowed'
                      }`}
                    >
                      <span className="text-xs mb-1">{circuito.nombre}</span>
                      <span className={isSelected ? 'text-black/70' : 'text-slate-500'}>{info.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
