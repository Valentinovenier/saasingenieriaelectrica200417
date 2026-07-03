import { Project } from '../../types/project';
import { CircuitoVivienda } from '../../types/vivienda';
import { obtenerCircuitosMinimos } from '../../engine/strategies/vivienda/normas770';
import { Trash2, Plus, Zap } from 'lucide-react';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export const ViviendaCircuitos = ({ project, onChange }: Props) => {
  const datos = project.datosVivienda || { superficieCubierta: 0, superficieSemicubierta: 0, ambientes: [], circuitos: [] };
  
  const grado = datos.gradoElectrificacion || 'Minimo';
  const minCircuitos = obtenerCircuitosMinimos(grado as any);

  const handleAddCircuito = () => {
    const nuevoCircuito: CircuitoVivienda = { 
      id: Date.now().toString(), 
      nombre: `Circuito ${datos.circuitos.length + 1}`, 
      tipo: 'tomacorrientes_usos_generales', 
      puntosUtilizacion: 0, 
      potenciaEstimada: 0 
    };
    onChange({ ...project, datosVivienda: { ...datos, circuitos: [...datos.circuitos, nuevoCircuito] } });
  };

  const updateCircuito = (id: string, updates: Partial<CircuitoVivienda>) => {
    const nuevosCircuitos = datos.circuitos.map(c => c.id === id ? { ...c, ...updates } : c);
    onChange({ ...project, datosVivienda: { ...datos, circuitos: nuevosCircuitos } });
  };

  const removeCircuito = (id: string) => {
    onChange({ ...project, datosVivienda: { ...datos, circuitos: datos.circuitos.filter(c => c.id !== id) } });
  };

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white">Definición de Circuitos</h2>
        <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 ${
            datos.circuitos.length >= minCircuitos 
            ? 'bg-emerald-900/20 border-emerald-800 text-emerald-400' 
            : 'bg-red-900/20 border-red-800 text-red-400'
        }`}>
            <Zap size={18} />
            <div>
                <p className="text-[10px] uppercase font-bold opacity-70">Circuitos</p>
                <p className="text-lg font-bold">{datos.circuitos.length} / {minCircuitos} Mínimos</p>
            </div>
        </div>
      </div>

      <div className="space-y-3">
        {datos.circuitos.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-700 text-slate-500">
                No hay circuitos definidos. Comienza agregando uno.
            </div>
        ) : (
            datos.circuitos.map(c => (
                <div key={c.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center gap-4">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                        <input 
                            className="bg-slate-950 p-2 rounded border border-slate-700 text-white text-sm focus:border-[var(--accent)] outline-none transition-colors" 
                            value={c.nombre} 
                            onChange={(e) => updateCircuito(c.id, { nombre: e.target.value })} 
                            placeholder="Nombre del circuito"
                        />
                        <select 
                            className="bg-slate-950 p-2 rounded border border-slate-700 text-white text-sm focus:border-[var(--accent)] outline-none transition-colors"
                            value={c.tipo}
                            onChange={(e) => updateCircuito(c.id, { tipo: e.target.value as any })}
                        >
                            <option value="iluminacion_usos_generales">IUG (Iluminación)</option>
                            <option value="tomacorrientes_usos_generales">TUG (Tomacorrientes)</option>
                            <option value="usos_especiales">TUE (Usos Específicos)</option>
                        </select>
                    </div>
                    <button 
                        onClick={() => removeCircuito(c.id)} 
                        className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))
        )}
      </div>

      <button 
        onClick={handleAddCircuito} 
        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
      >
        <Plus size={18} /> Agregar Circuito
      </button>
    </div>
  );
};
