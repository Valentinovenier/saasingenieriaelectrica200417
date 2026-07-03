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

        // Calcular total de bocas en el circuito (suma de puntos IUG + TUG de los ambientes asignados)
        const totalBocas = nuevosAmbientes.reduce((acc, id) => {
            const amb = datos.ambientes.find(a => a.id === id);
            return acc + (amb ? (amb.puntosIUG + amb.puntosTUG) : 0);
        }, 0);

        if (totalBocas > 15) {
             // Opcional: Podríamos prevenir la asignación o solo avisar.
             // Aquí dejo que se asigne pero el usuario verá el aviso.
        }
        
        // Recalcular puntos del circuito
        const puntosIUG = nuevosAmbientes.reduce((acc, id) => {
            const amb = datos.ambientes.find(a => a.id === id);
            return acc + (c.tipo === 'iluminacion_usos_generales' ? (amb?.puntosIUG || 0) : 0);
        }, 0);
        const puntosTUG = nuevosAmbientes.reduce((acc, id) => {
            const amb = datos.ambientes.find(a => a.id === id);
            return acc + (c.tipo === 'tomacorrientes_usos_generales' ? (amb?.puntosTUG || 0) : 0);
        }, 0);
        const puntosTUE = nuevosAmbientes.reduce((acc, id) => {
            const amb = datos.ambientes.find(a => a.id === id);
            return acc + (c.tipo === 'usos_especiales' ? (amb?.puntosTUE || 0) : 0);
        }, 0);

        return { ...c, ambientesIds: nuevosAmbientes, puntosIUG, puntosTUG, puntosTUE };
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
          const totalBocasAmbiente = ambiente.puntosIUG + ambiente.puntosTUG;
          return (
            <div key={ambiente.id} className="space-y-3 border-l-2 border-slate-800 pl-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">{ambiente.nombre}</h3>
                <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded space-x-2">
                    <span>IUG: {ambiente.puntosIUG}</span>
                    <span>TUG: {ambiente.puntosTUG}</span>
                    <span>TUE: {ambiente.puntosTUE}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {datos.circuitosCalculados.map((circuito) => {
                  const isSelected = circuito.ambientesIds.includes(ambiente.id);
                  const info = getCircuitoInfo(circuito.tipo);
                  
                  // Calcular bocas actuales del circuito
                  const bocasCircuito = circuito.ambientesIds.reduce((acc, id) => {
                      const amb = datos.ambientes.find(a => a.id === id);
                      return acc + (amb ? (amb.puntosIUG + amb.puntosTUG) : 0);
                  }, 0);
                  const superaLimite = bocasCircuito > 15;

                  // Validar compatibilidad estricta
                  let esCompatible = false;
                  if (circuito.tipo === 'iluminacion_usos_generales') esCompatible = ambiente.puntosIUG > 0;
                  else if (circuito.tipo === 'tomacorrientes_usos_generales') esCompatible = ambiente.puntosTUG > 0;
                  else if (circuito.tipo === 'usos_especiales') esCompatible = ambiente.puntosTUE > 0;
                  else if (circuito.tipo === 'usos_especificos') esCompatible = true; // Permisivo para específicos

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
                      {isSelected && (
                        <span className={`text-[9px] mt-1 ${superaLimite ? 'text-red-500 font-bold' : 'text-slate-600'}`}>
                            {bocasCircuito} / 15 bocas
                        </span>
                      )}
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
