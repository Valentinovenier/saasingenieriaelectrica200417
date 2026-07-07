import { Project } from '../../types/project';
import { Ambiente, CircuitoCalculado, TipoCircuito } from '../../types/vivienda';
import { AlertCircle } from 'lucide-react';

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
        return { ...c, ambientesIds: nuevosAmbientes };
      }
      return c;
    });

    onChange({ ...project, datosVivienda: { ...datos, circuitosCalculados: nuevosCircuitos } });
  };

  const updateCircuitoBocas = (circuitoId: string, tipo: 'manualPuntosIUG' | 'manualPuntosTUG' | 'manualPuntosTUE', valor: number, ambienteId: string) => {
      // Necesitamos una estructura más compleja para guardar tomas por ambiente y circuito
      // POR AHORA mantendremos la lógica actual pero simplificaremos la UI
      const nuevosCircuitos = datos.circuitosCalculados.map(c => 
          c.id === circuitoId ? { ...c, [tipo]: valor } : c
      );
      onChange({ ...project, datosVivienda: { ...datos, circuitosCalculados: nuevosCircuitos } });
  };

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700 space-y-8">
      
      {/* 1. Resumen Superior */}
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
        <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase">Estado de Circuitos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {datos.circuitosCalculados.map(c => {
                // Cálculo simple de tomas para el resumen
                let totalTomas = (c.manualPuntosIUG ?? c.puntosIUG) + (c.manualPuntosTUG ?? c.puntosTUG) + (c.manualPuntosTUE ?? c.puntosTUE);
                const superaLimite = totalTomas > 15;
                return (
                    <div key={c.id} className={`p-3 rounded border ${superaLimite ? 'border-red-900 bg-red-950/30' : 'border-slate-700 bg-slate-950'}`}>
                        <div className="text-white text-xs font-bold truncate">{c.nombre}</div>
                        <div className={`text-lg font-black ${superaLimite ? 'text-red-500' : 'text-emerald-500'}`}>
                            {totalTomas}<span className="text-xs text-slate-500">/15</span>
                        </div>
                    </div>
                )
            })}
        </div>
      </div>

      {/* 2. Asignación por Ambiente */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Asignación por Ambiente</h2>
        {datos.ambientes.map((ambiente) => (
            <div key={ambiente.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                <h3 className="text-md font-semibold text-white">{ambiente.nombre}</h3>
                
                <div className="col-span-2 flex flex-wrap gap-2">
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
            </div>
        ))}
      </div>
    </div>
  );
};
