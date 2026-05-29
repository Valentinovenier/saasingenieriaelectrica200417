import { useState } from 'react';
import { Project, TableroSeccional } from '../types/project';
import { Trash2, Plus } from 'lucide-react';

export const ProjectSettings = ({ project, onSave, onDelete }: { project: Project, onSave: (p: Project) => void, onDelete: () => void }) => {
  const [data, setData] = useState<Project>({
    ...project,
    armonicos: project.armonicos || { h3: 0, h5: 0, h7: 0, h9: 0 }
  });

  const addTablero = () => {
    const newTablero: TableroSeccional = {
      id: Date.now().toString(),
      name: `Tablero ${data.tableros.length + 1}`,
      tipo: 'Fuerza Motriz',
      potenciaTotal: 0,
      factorK: 1
    };
    setData({ ...data, tableros: [...data.tableros, newTablero] });
  };

  return (
    <div className="space-y-8 bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Configuración: {data.name}</h2>
        <button onClick={onDelete} className="text-red-400 hover:text-red-300 flex items-center gap-2">
            Eliminar proyecto
        </button>
      </div>
      
      <section className="grid grid-cols-2 gap-6">
        <div>
            <h3 className="text-lg font-semibold text-white mb-4">Transformador</h3>
            <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Potencia (kVA)" className="bg-[var(--bg-primary)] p-3 rounded-xl border border-slate-700 text-white" value={data.transformador?.potencia || ''} onChange={(e) => setData({...data, transformador: {...data.transformador!, potencia: Number(e.target.value)}})} />
                <input type="number" step="0.01" placeholder="Cos Phi" className="bg-[var(--bg-primary)] p-3 rounded-xl border border-slate-700 text-white" 
                    value={data.transformador?.cosFi ?? 0.95} 
                    onChange={(e) => setData({...data, transformador: {...data.transformador!, cosFi: Number(e.target.value)}})} />
            </div>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-white mb-4">Distorsión Armónica (%)</h3>
            <div className="grid grid-cols-4 gap-2">
                {(['h3','h5','h7','h9'] as const).map(h => (
                    <input key={h} type="number" placeholder={h.toUpperCase()} className="bg-[var(--bg-primary)] p-3 rounded-xl border border-slate-700 text-white text-sm" value={data.armonicos?.[h] || ''} onChange={(e) => setData({...data, armonicos: {...data.armonicos, [h]: Number(e.target.value)}})} />
                ))}
            </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Tableros Seccionales</h3>
          <button onClick={addTablero} className="text-[var(--accent)] flex items-center gap-2"><Plus size={18} /> Agregar</button>
        </div>
        {(data.tableros || []).map((t, idx) => (
          <div key={t.id} className="grid grid-cols-6 gap-2 mb-2 bg-[var(--bg-primary)] p-3 rounded-xl items-center">
            <input className="col-span-1 bg-transparent text-white" value={t.name} onChange={(e) => { const tabs = [...data.tableros]; tabs[idx].name = e.target.value; setData({...data, tableros: tabs}); }} />
            <select className="col-span-2 bg-transparent text-white" value={t.tipo} onChange={(e) => { const tabs = [...data.tableros]; tabs[idx].tipo = e.target.value as any; setData({...data, tableros: tabs}); }}>
                <option value="Fuerza Motriz">Fuerza Motriz</option>
                <option value="Iluminación">Iluminación</option>
            </select>
            <input type="number" className="col-span-1 bg-transparent text-white" placeholder="Potencia (kW)" value={t.potenciaTotal || ''} onChange={(e) => { const tabs = [...data.tableros]; tabs[idx].potenciaTotal = Number(e.target.value); setData({...data, tableros: tabs}); }} />
            <input type="number" className="col-span-1 bg-transparent text-white" placeholder="Factor K" value={t.factorK || ''} onChange={(e) => { const tabs = [...data.tableros]; tabs[idx].factorK = Number(e.target.value); setData({...data, tableros: tabs}); }} />
            <button onClick={() => setData({...data, tableros: data.tableros.filter((_, i) => i !== idx)})} className="text-red-400"><Trash2 size={16}/></button>
          </div>
        ))}
      </section>

      <button onClick={() => onSave(data)} className="bg-[var(--accent)] text-black px-6 py-2 rounded-xl font-bold">Guardar</button>
    </div>
  );
};
