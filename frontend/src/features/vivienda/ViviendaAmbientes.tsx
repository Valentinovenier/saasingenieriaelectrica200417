import { Project } from '../../types/project';
import { Ambiente } from '../../types/vivienda';
import { calcularPuntosMinimosAmbiente } from '../../engine/strategies/vivienda/normas770';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

const TIPOS_AMBIENTES = [
    'Estar-Comedor', 'Dormitorio', 'Cocina', 'Baño', 'Pasillo', 'Lavadero', 'Garage'
];

export const ViviendaAmbientes = ({ project, onChange }: Props) => {
  const datos = project.datosVivienda || { superficieCubierta: 0, superficieSemicubierta: 0, ambientes: [], circuitos: [] };

  const handleAddAmbiente = (tipo: string) => {
    // Contar cuántos ambientes de este tipo ya existen para autoincrementar
    const existentes = datos.ambientes.filter(a => a.nombre.startsWith(tipo)).length;
    const nuevoNombre = `${tipo} ${existentes + 1}`;
    
    const nuevoAmbiente: Ambiente = { id: Date.now().toString(), nombre: nuevoNombre, superficie: 0, longitud: 0 };
    onChange({ ...project, datosVivienda: { ...datos, ambientes: [...datos.ambientes, nuevoAmbiente] } });
  };

  const updateAmbiente = (id: string, updates: Partial<Ambiente>) => {
    const nuevosAmbientes = datos.ambientes.map(a => {
        if (a.id !== id) return a;
        const updated = { ...a, ...updates };
        const pmu = calcularPuntosMinimosAmbiente(updated.nombre, updated.superficie, updated.longitud);
        return { ...updated, puntosIUG: pmu.iug, puntosTUG: pmu.tug };
    });
    onChange({ ...project, datosVivienda: { ...datos, ambientes: nuevosAmbientes } });
  };

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700 space-y-4">
      <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Ambientes y PMU (AEA 770)</h2>
      
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {TIPOS_AMBIENTES.map(tipo => (
            <button key={tipo} onClick={() => handleAddAmbiente(tipo)} className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-full text-xs">
                <Plus size={14} /> {tipo}
            </button>
        ))}
      </div>
      
      <div className="space-y-3">
        {datos.ambientes.map((a) => (
          <div key={a.id} className="grid grid-cols-6 gap-3 items-center bg-slate-900 p-3 rounded-lg text-sm">
            <span className="col-span-2 text-white font-medium">{a.nombre}</span>
            <input type="number" className="bg-slate-950 p-2 rounded border border-slate-700 text-white" value={a.superficie || ''} onChange={(e) => updateAmbiente(a.id, { superficie: parseFloat(e.target.value) || 0 })} placeholder="m²" />
            <input type="number" className="bg-slate-950 p-2 rounded border border-slate-700 text-white" value={a.longitud || ''} onChange={(e) => updateAmbiente(a.id, { longitud: parseFloat(e.target.value) || 0 })} placeholder="Largo" />
            
            <div className="text-center">
                <p className="text-[10px] text-slate-500">IUG</p>
                <p className="font-bold text-[var(--accent)]">{a.puntosIUG || 0}</p>
            </div>
            <div className="text-center">
                <p className="text-[10px] text-slate-500">TUG</p>
                <p className="font-bold text-[var(--accent)]">{a.puntosTUG || 0}</p>
            </div>
            
            <button onClick={() => onChange({ ...project, datosVivienda: { ...datos, ambientes: datos.ambientes.filter(amb => amb.id !== a.id) } })} className="text-red-400 p-2">
                <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
