import { Project } from '../../types/project';
import { Ambiente, CircuitoCalculado, TipoCircuito, TomasCircuito } from '../../types/vivienda';
import { useState, useEffect } from 'react';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export const ViviendaAsignacion = ({ project, onChange }: Props) => {
  const datos = project.datosVivienda || { superficieCubierta: 0, superficieSemicubierta: 0, ambientes: [], circuitosCalculados: [], tomasPorAmbiente: {} };
  
  // Inicializar tomas por ambiente si no existen
  if (!datos.tomasPorAmbiente) {
      datos.tomasPorAmbiente = {};
  }

  // Estado para el modo automático
  const [modoAutomatico, setModoAutomatico] = useState<Record<string, boolean>>({});

  const toggleAmbienteEnCircuito = (ambiente: Ambiente, circuitoId: string) => {
    const nuevosCircuitos = datos.circuitosCalculados.map(c => {
      if (c.id === circuitoId) {
        const estaAsignado = c.ambientesIds.includes(ambiente.id);
        const nuevosAmbientes = estaAsignado 
            ? c.ambientesIds.filter(id => id !== ambiente.id)
            : [...c.ambientesIds, ambiente.id];
        return { ...c, ambientesIds: nuevosAmbientes };
      }
      return c;
    });

    onChange({ ...project, datosVivienda: { ...datos, circuitosCalculados: nuevosCircuitos } });
  };

  const updateTomas = (ambienteId: string, circuitoId: string, tipo: 'IUG' | 'TUG' | 'TUE', valor: number) => {
      const nuevasTomas = { ...datos.tomasPorAmbiente };
      if (!nuevasTomas[ambienteId]) nuevasTomas[ambienteId] = {};
      if (!nuevasTomas[ambienteId][circuitoId]) nuevasTomas[ambienteId][circuitoId] = { IUG: 0, TUG: 0, TUE: 0 };
      nuevasTomas[ambienteId][circuitoId][tipo] = valor;
      
      onChange({ ...project, datosVivienda: { ...datos, tomasPorAmbiente: nuevasTomas } });
  };

  // Lógica de autocompletado
  useEffect(() => {
    datos.ambientes.forEach(ambiente => {
        if (modoAutomatico[ambiente.id]) {
            const circuitosEnAmbiente = datos.circuitosCalculados.filter(c => c.ambientesIds.includes(ambiente.id));
            
            circuitosEnAmbiente.forEach(circuito => {
                const tipoTomas = circuito.tipo === 'iluminacion_usos_generales' ? 'IUG' : 'TUG';
                const valorMinimo = ambiente[tipoTomas === 'IUG' ? 'puntosIUG' : 'puntosTUG'] || 0;
                
                if ((datos.tomasPorAmbiente?.[ambiente.id]?.[circuito.id]?.[tipoTomas] ?? 0) !== valorMinimo) {
                    updateTomas(ambiente.id, circuito.id, tipoTomas, valorMinimo);
                }
            });
        }
    });
  }, [modoAutomatico, datos.ambientes, datos.circuitosCalculados]);

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700 space-y-8">
      
      {/* 1. Resumen Superior */}
      <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
        <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Carga de Circuitos (Máx 15 por circuito)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {datos.circuitosCalculados.map(c => {
                const tomasPorAmbiente = datos.tomasPorAmbiente || {};
                let totalTomas = Object.values(tomasPorAmbiente).reduce((acc: number, amb: Record<string, TomasCircuito>) => {
                    const tomas = amb[c.id];
                    if (!tomas) return acc;
                    return acc + (tomas.IUG || 0) + (tomas.TUG || 0) + (tomas.TUE || 0);
                }, 0);
                
                const superaLimite = totalTomas > 15;
                return (
                    <div key={c.id} className={`p-3 rounded border flex justify-between items-center ${superaLimite ? 'border-red-900 bg-red-950/30' : 'border-slate-700 bg-slate-950'}`}>
                        <div className="text-white text-xs font-bold truncate">{c.nombre}</div>
                        <div className={`text-xl font-black ${superaLimite ? 'text-red-500' : 'text-emerald-500'}`}>
                            {totalTomas}<span className="text-sm text-slate-500 font-normal">/15</span>
                        </div>
                    </div>
                )
            })}
        </div>
      </div>

      {/* 2. Asignación por Ambiente */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-slate-800 pb-2">
            <h2 className="text-xl font-bold text-white">Ambientes</h2>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Puntos mínimos de utilización</h3>
        </div>
        {datos.ambientes.map((ambiente) => {
            const tomasAmbiente = datos.tomasPorAmbiente?.[ambiente.id] || {};
            const asignadoIUG = Object.values(tomasAmbiente).reduce((acc: number, c: TomasCircuito) => acc + (c.IUG || 0), 0);
            const asignadoTUG = Object.values(tomasAmbiente).reduce((acc: number, c: TomasCircuito) => acc + (c.TUG || 0), 0);
            const asignadoTUE = Object.values(tomasAmbiente).reduce((acc: number, c: TomasCircuito) => acc + (c.TUE || 0), 0);

          return (
            <div key={ambiente.id} className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-md font-semibold text-white">{ambiente.nombre}</h3>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-[10px] text-slate-400 cursor-pointer">
                            <input type="checkbox" checked={modoAutomatico[ambiente.id] || false} onChange={() => setModoAutomatico(prev => ({ ...prev, [ambiente.id]: !prev[ambiente.id] }))} />
                            Modo Automático
                        </label>
                        <div className="flex gap-4 text-[10px] font-bold bg-slate-900 p-2 rounded border border-slate-800">
                            <span className={asignadoIUG >= ambiente.puntosIUG ? 'text-emerald-400' : 'text-amber-400'}>IUG: {asignadoIUG}/{ambiente.puntosIUG}</span>
                            <span className={asignadoTUG >= ambiente.puntosTUG ? 'text-emerald-400' : 'text-amber-400'}>TUG: {asignadoTUG}/{ambiente.puntosTUG}</span>
                            <span className={asignadoTUE >= ambiente.puntosTUE ? 'text-emerald-400' : 'text-amber-400'}>TUE: {asignadoTUE}/{ambiente.puntosTUE}</span>
                        </div>
                    </div>
                </div>
                
                <div className="col-span-2 space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {datos.circuitosCalculados.map(circuito => {
                            const isSelected = circuito.ambientesIds.includes(ambiente.id);
                            return (
                                <button
                                    key={circuito.id}
                                    onClick={() => toggleAmbienteEnCircuito(ambiente, circuito.id)}
                                    className={`px-3 py-1.5 rounded text-xs font-bold border transition-colors ${
                                        isSelected 
                                        ? 'bg-[var(--accent)] border-[var(--accent)] text-black' 
                                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                                    }`}
                                >
                                    {circuito.nombre}
                                </button>
                            )
                        })}
                    </div>
                    {/* Campos de entrada */}
                    {datos.circuitosCalculados.filter(c => c.ambientesIds.includes(ambiente.id)).map(circuito => (
                        <div key={`input-${circuito.id}`} className="flex items-center gap-3 bg-black/20 p-2 rounded text-[10px]">
                            <span className="font-bold text-white w-20">{circuito.nombre}</span>
                            {circuito.tipo === 'iluminacion_usos_generales' && (
                                <div className="flex items-center">
                                    <input type="number" placeholder="IUG" className="w-16 bg-slate-800 p-1 rounded text-center text-white" 
                                        disabled={modoAutomatico[ambiente.id]}
                                        value={datos.tomasPorAmbiente?.[ambiente.id]?.[circuito.id]?.IUG ?? 0}
                                        onChange={(e) => updateTomas(ambiente.id, circuito.id, 'IUG', Math.max(parseInt(e.target.value) || 0, ambiente.puntosIUG))} />
                                    <button 
                                        className="ml-1 bg-slate-700 hover:bg-slate-600 text-white rounded w-6 h-6 flex items-center justify-center font-bold"
                                        onClick={() => updateTomas(ambiente.id, circuito.id, 'IUG', (datos.tomasPorAmbiente?.[ambiente.id]?.[circuito.id]?.IUG ?? 0) + 1)}
                                    >+</button>
                                </div>
                            )}
                            {(circuito.tipo === 'tomacorrientes_usos_generales') && (
                                <div className="flex items-center">
                                    <input type="number" placeholder="TUG" className="w-16 bg-slate-800 p-1 rounded text-center text-white" 
                                        disabled={modoAutomatico[ambiente.id]}
                                        value={datos.tomasPorAmbiente?.[ambiente.id]?.[circuito.id]?.TUG ?? 0}
                                        onChange={(e) => updateTomas(ambiente.id, circuito.id, 'TUG', Math.max(parseInt(e.target.value) || 0, ambiente.puntosTUG))} />
                                    <button 
                                        className="ml-1 bg-slate-700 hover:bg-slate-600 text-white rounded w-6 h-6 flex items-center justify-center font-bold"
                                        onClick={() => updateTomas(ambiente.id, circuito.id, 'TUG', (datos.tomasPorAmbiente?.[ambiente.id]?.[circuito.id]?.TUG ?? 0) + 1)}
                                    >+</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )})}
      </div>
    </div>
  );
};
