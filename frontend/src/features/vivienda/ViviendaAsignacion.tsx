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

        // Recalcular puntos del circuito sumando puntos correspondientes al tipo del circuito
        // IUG: suma IUG (y TUG si tiene derivados), TUG: suma TUG, TUE: suma TUE
        let puntosIUG = c.puntosIUG;
        let puntosTUG = c.puntosTUG;
        let puntosTUE = c.puntosTUE;

        if (c.tipo === 'iluminacion_usos_generales') {
            puntosIUG = nuevosAmbientes.reduce((acc, id) => { const amb = datos.ambientes.find(a => a.id === id); return acc + (amb?.puntosIUG || 0); }, 0);
            if (c.tieneTomacorrientesDerivados) {
                puntosTUG = nuevosAmbientes.reduce((acc, id) => { const amb = datos.ambientes.find(a => a.id === id); return acc + (amb?.puntosTUG || 0); }, 0);
            }
        } else if (c.tipo === 'tomacorrientes_usos_generales') {
            puntosTUG = nuevosAmbientes.reduce((acc, id) => { const amb = datos.ambientes.find(a => a.id === id); return acc + (amb?.puntosTUG || 0); }, 0);
        } else if (c.tipo === 'usos_especiales') {
            puntosTUE = nuevosAmbientes.reduce((acc, id) => { const amb = datos.ambientes.find(a => a.id === id); return acc + (amb?.puntosTUE || 0); }, 0);
        }

        return { ...c, ambientesIds: nuevosAmbientes, puntosIUG, puntosTUG, puntosTUE };
      }
      return c;
    });

    onChange({ ...project, datosVivienda: { ...datos, circuitosCalculados: nuevosCircuitos } });
  };

  const updateBocasCircuito = (circuitoId: string, tipo: 'puntosIUG' | 'puntosTUG' | 'puntosTUE', valor: number) => {
      const nuevosCircuitos = datos.circuitosCalculados.map(c => 
          c.id === circuitoId ? { ...c, [tipo]: valor } : c
      );
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
                  
                  // Calcular bocas correctas para el tipo de circuito
                  let bocasCircuito = 0;
                  if (circuito.tipo === 'iluminacion_usos_generales') bocasCircuito = circuito.puntosIUG + (circuito.tieneTomacorrientesDerivados ? circuito.puntosTUG : 0);
                  else if (circuito.tipo === 'tomacorrientes_usos_generales') bocasCircuito = circuito.puntosTUG;
                  else if (circuito.tipo === 'usos_especiales') bocasCircuito = circuito.puntosTUE;
                  else bocasCircuito = 0;
                  
                  const superaLimite = bocasCircuito > 15;

                  // Validar compatibilidad estricta
                  let esCompatible = false;
                  if (circuito.tipo === 'iluminacion_usos_generales') esCompatible = ambiente.puntosIUG > 0;
                  else if (circuito.tipo === 'tomacorrientes_usos_generales') esCompatible = ambiente.puntosTUG > 0;
                  else if (circuito.tipo === 'usos_especiales') esCompatible = ambiente.puntosTUE > 0;
                  else if (circuito.tipo === 'usos_especificos') esCompatible = true; 

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
                        <div className="flex flex-col items-center mt-1 gap-1">
                            {/* Input para IUG */}
                            {(circuito.tipo === 'iluminacion_usos_generales') && (
                                <div className="flex items-center gap-1">
                                    <span className="text-[9px]">IUG:</span>
                                    <input type="number" className="w-8 bg-transparent text-center font-bold outline-none" value={circuito.puntosIUG} 
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => updateBocasCircuito(circuito.id, 'puntosIUG', parseInt(e.target.value) || 0)} />
                                </div>
                            )}
                            {/* Input para TUG en IUG derivado o TUG normal */}
                            {(circuito.tipo === 'tomacorrientes_usos_generales' || (circuito.tipo === 'iluminacion_usos_generales' && circuito.tieneTomacorrientesDerivados)) && (
                                <div className="flex items-center gap-1">
                                    <span className="text-[9px]">TUG:</span>
                                    <input type="number" className="w-8 bg-transparent text-center font-bold outline-none" value={circuito.puntosTUG} 
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => updateBocasCircuito(circuito.id, 'puntosTUG', parseInt(e.target.value) || 0)} />
                                </div>
                            )}
                            {/* Input para TUE */}
                            {circuito.tipo === 'usos_especiales' && (
                                <input type="number" className="w-8 bg-transparent text-center font-bold outline-none" value={circuito.puntosTUE}
                                   onClick={(e) => e.stopPropagation()}
                                   onChange={(e) => updateBocasCircuito(circuito.id, 'puntosTUE', parseInt(e.target.value) || 0)} />
                            )}
                            
                            <span className={`text-[9px] ${superaLimite ? 'text-red-500 font-bold' : 'text-slate-600'}`}>
                                {bocasCircuito} / 15 bocas
                            </span>
                        </div>
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
