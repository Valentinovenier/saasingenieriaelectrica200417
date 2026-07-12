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

  // Estado para el modo automático global
  const [modoAutomatico, setModoAutomatico] = useState(false);

  // Lógica de autocompletado global
  useEffect(() => {
    if (modoAutomatico) {
        let nuevosCircuitos = [...datos.circuitosCalculados];
        let nuevasTomas = { ...datos.tomasPorAmbiente };

        datos.ambientes.forEach(ambiente => {
            // 1. Asignar circuitos si no están asignados (lógica simplificada de asignación automática)
            nuevosCircuitos = nuevosCircuitos.map(circuito => {
                if (!circuito.ambientesIds.includes(ambiente.id)) {
                    // Lógica para decidir si asignar (basado en el tipo de circuito y puntos del ambiente)
                    const necesitaIUG = ambiente.puntosIUG > 0 && circuito.tipo === 'iluminacion_usos_generales';
                    const necesitaTUG = ambiente.puntosTUG > 0 && circuito.tipo === 'tomacorrientes_usos_generales';
                    
                    if (necesitaIUG || necesitaTUG) {
                        return { ...circuito, ambientesIds: [...circuito.ambientesIds, ambiente.id] };
                    }
                }
                return circuito;
            });

            // 2. Completar tomas
            const circuitosEnAmbiente = nuevosCircuitos.filter(c => c.ambientesIds.includes(ambiente.id));
            
            circuitosEnAmbiente.forEach(circuito => {
                const tipoTomas = circuito.tipo === 'iluminacion_usos_generales' ? 'IUG' : 'TUG';
                const valorMinimo = ambiente[tipoTomas === 'IUG' ? 'puntosIUG' : 'puntosTUG'] || 0;
                
                if (valorMinimo > 0) {
                    if (!nuevasTomas[ambiente.id]) nuevasTomas[ambiente.id] = {};
                    if (!nuevasTomas[ambiente.id][circuito.id]) nuevasTomas[ambiente.id][circuito.id] = { IUG: 0, TUG: 0, TUE: 0 };
                    nuevasTomas[ambiente.id][circuito.id] = { 
                        ...nuevasTomas[ambiente.id][circuito.id], 
                        [tipoTomas]: valorMinimo 
                    };
                }
            });
        });

        onChange({ ...project, datosVivienda: { ...datos, circuitosCalculados: nuevosCircuitos, tomasPorAmbiente: nuevasTomas } });
        setModoAutomatico(false);
    }
  }, [modoAutomatico]);

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

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700 space-y-8">
      
      {/* 1. Resumen Superior */}
      <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Carga de Circuitos (Máx 15 por circuito)</h3>
            <button 
                onClick={() => setModoAutomatico(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"
            >
                Auto-completar Circuitos y Tomas (Norma)
            </button>
        </div>
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
                    <div className="flex gap-4 text-[10px] font-bold bg-slate-900 p-2 rounded border border-slate-800">
                        <span className={asignadoIUG >= ambiente.puntosIUG ? 'text-emerald-400' : 'text-amber-400'}>IUG: {asignadoIUG}/{ambiente.puntosIUG}</span>
                        <span className={asignadoTUG >= ambiente.puntosTUG ? 'text-emerald-400' : 'text-amber-400'}>TUG: {asignadoTUG}/{ambiente.puntosTUG}</span>
                        <span className={asignadoTUE >= ambiente.puntosTUE ? 'text-emerald-400' : 'text-amber-400'}>TUE: {asignadoTUE}/{ambiente.puntosTUE}</span>
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
