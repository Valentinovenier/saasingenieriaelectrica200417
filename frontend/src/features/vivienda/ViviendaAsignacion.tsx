import { Project } from '../../types/project';
import { Ambiente, CircuitoCalculado, TipoCircuito } from '../../types/vivienda';
import { CheckCircle2, AlertCircle } from 'lucide-react';

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
  
  // Inicializar tomas por ambiente si no existen (debería ser parte del tipo Project en el futuro)
  if (!datos.tomasPorAmbiente) {
      datos.tomasPorAmbiente = {};
  }

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
        <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Carga de Circuitos (Máx 15 por circuito)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {datos.circuitosCalculados.map(c => {
                // Sumar tomas de todos los ambientes para este circuito
                let totalTomas = Object.values(datos.tomasPorAmbiente || {}).reduce((acc, amb) => {
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
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Asignación por Ambiente</h2>
        {datos.ambientes.map((ambiente) => {
            // Calcular asignado local (para mostrar en el ambiente)
            const tomasAmbiente = datos.tomasPorAmbiente?.[ambiente.id] || {};
            const asignadoIUG = Object.values(tomasAmbiente).reduce((acc, c) => acc + (c.IUG || 0), 0);
            const asignadoTUG = Object.values(tomasAmbiente).reduce((acc, c) => acc + (c.TUG || 0), 0);
            const asignadoTUE = Object.values(tomasAmbiente).reduce((acc, c) => acc + (c.TUE || 0), 0);

          return (
            <div key={ambiente.id} className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-md font-semibold text-white">{ambiente.nombre}</h3>
                    <div className="flex gap-4 text-[10px] font-bold bg-slate-900 p-2 rounded">
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
                    {/* Campos de entrada para tomas por circuito seleccionado en este ambiente */}
                    {datos.circuitosCalculados.filter(c => c.ambientesIds.includes(ambiente.id)).map(circuito => (
                        <div key={`input-${circuito.id}`} className="flex items-center gap-3 bg-black/20 p-2 rounded text-[10px]">
                            <span className="font-bold text-white w-20">{circuito.nombre}</span>
                            {circuito.tipo === 'iluminacion_usos_generales' && (
                                <input type="number" placeholder="IUG" className="w-16 bg-slate-800 p-1 rounded text-center text-white" 
                                    value={datos.tomasPorAmbiente?.[ambiente.id]?.[circuito.id]?.IUG ?? 0}
                                    onChange={(e) => updateTomas(ambiente.id, circuito.id, 'IUG', parseInt(e.target.value) || 0)} />
                            )}
                            {(circuito.tipo === 'tomacorrientes_usos_generales' || (circuito.tipo === 'iluminacion_usos_generales' && circuito.tieneTomacorrientesDerivados)) && (
                                <input type="number" placeholder="TUG" className="w-16 bg-slate-800 p-1 rounded text-center text-white" 
                                    value={datos.tomasPorAmbiente?.[ambiente.id]?.[circuito.id]?.TUG ?? 0}
                                    onChange={(e) => updateTomas(ambiente.id, circuito.id, 'TUG', parseInt(e.target.value) || 0)} />
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
