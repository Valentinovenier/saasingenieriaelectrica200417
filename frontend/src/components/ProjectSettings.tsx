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
      name: `Tablero ${data.tableros ? data.tableros.length + 1 : 1}`,
      tipo: 'Fuerza Motriz',
      potenciaTotal: 0,
      subTableros: []
    };
    setData(prev => ({ 
      ...prev, 
      tableros: [...(prev.tableros || []), newTablero] 
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          data: data
        })
      });

      if (response.ok) {
        onSave(data);
        alert('Proyecto guardado exitosamente');
      } else {
        alert('Error al guardar el proyecto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  return (
    <div className="space-y-8 bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Configuración: {data.name}</h2>
        <button onClick={onDelete} className="text-red-400 hover:text-red-300 flex items-center gap-2">
            Eliminar proyecto
        </button>
      </div>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Transformador */}
        <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Transformador</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">Potencia (kVA)</label>
                    <input type="number" placeholder="kVA" className="w-full bg-[var(--bg-secondary)] p-2 rounded-lg border border-slate-700 text-white" value={data.transformador?.potencia ?? ''} onChange={(e) => setData({...data, transformador: {...data.transformador!, potencia: e.target.value === '' ? 0 : Number(e.target.value)}})} />
                </div>
                <div>
                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">V Primario (V)</label>
                    <input type="number" placeholder="V" className="w-full bg-[var(--bg-secondary)] p-2 rounded-lg border border-slate-700 text-white" value={data.transformador?.tensionPrimario ?? ''} onChange={(e) => setData({...data, transformador: {...data.transformador!, tensionPrimario: e.target.value === '' ? 0 : Number(e.target.value)}})} />
                </div>
                <div>
                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">V Secundario (V)</label>
                    <input type="number" placeholder="V" className="w-full bg-[var(--bg-secondary)] p-2 rounded-lg border border-slate-700 text-white" value={data.transformador?.tensionSecundario ?? ''} onChange={(e) => setData({...data, transformador: {...data.transformador!, tensionSecundario: e.target.value === '' ? 0 : Number(e.target.value)}})} />
                </div>
            </div>
        </div>

        {/* Parámetros Generales */}
        <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Parámetros Generales</h3>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">Cos Phi</label>
                    <input type="number" step="0.01" placeholder="0.95" className="w-full bg-[var(--bg-secondary)] p-2 rounded-lg border border-slate-700 text-white" 
                        value={data.transformador?.cosFi ?? ''} 
                        onChange={(e) => setData({...data, transformador: {...data.transformador!, cosFi: e.target.value === '' ? 0 : Number(e.target.value)}})} />
                </div>
                <div>
                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">Temp. (°C)</label>
                    <input type="number" placeholder="°C" className="w-full bg-[var(--bg-secondary)] p-2 rounded-lg border border-slate-700 text-white" value={(data as any).tempAmbiente ?? ''} onChange={(e) => setData({...data, tempAmbiente: e.target.value === '' ? 0 : Number(e.target.value)} as any)} />
                </div>
                <div>
                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">Coef. Simult.</label>
                    <input type="number" step="0.01" placeholder="0.0 - 1.0" className="w-full bg-[var(--bg-secondary)] p-2 rounded-lg border border-slate-700 text-white" value={(data as any).coefSimultaneidad ?? ''} onChange={(e) => setData({...data, coefSimultaneidad: e.target.value === '' ? 0 : Number(e.target.value)} as any)} />
                </div>
            </div>
        </div>
        
        <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Distorsión Armónica (%)</h3>
            <div className="grid grid-cols-4 gap-2">
                {(['h3','h5','h7','h9'] as const).map(h => (
                    <input key={h} type="number" placeholder={h.toUpperCase()} className="bg-[var(--bg-primary)] p-3 rounded-xl border border-slate-700 text-white text-sm" value={data.armonicos?.[h] ?? ''} onChange={(e) => setData({...data, armonicos: {...data.armonicos, [h]: e.target.value === '' ? 0 : Number(e.target.value)}})} />
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
          <div key={t.id} className="grid grid-cols-5 gap-2 mb-2 bg-[var(--bg-primary)] p-3 rounded-xl items-center border border-slate-700">
            <input className="col-span-2 bg-[var(--bg-secondary)] p-2 rounded-lg text-white font-medium border border-slate-600 focus:border-[var(--accent)] outline-none" value={t.name} onChange={(e) => { const tabs = [...data.tableros]; tabs[idx].name = e.target.value; setData({...data, tableros: tabs}); }} />
            <select className="col-span-2 bg-[var(--bg-secondary)] p-2 rounded-lg text-white border border-slate-600 focus:border-[var(--accent)] outline-none" value={t.tipo} onChange={(e) => { const tabs = [...data.tableros]; tabs[idx].tipo = e.target.value as any; setData({...data, tableros: tabs}); }}>
                <option value="Fuerza Motriz">Fuerza Motriz</option>
                <option value="Iluminación">Iluminación</option>
            </select>
            <div className="col-span-1 flex items-center gap-2">
                <input type="number" className="w-full bg-[var(--bg-secondary)] p-2 rounded-lg text-white border border-slate-600 focus:border-[var(--accent)] outline-none" placeholder="Potencia (kW)" value={t.potenciaTotal ?? ''} onChange={(e) => { const tabs = [...data.tableros]; tabs[idx].potenciaTotal = e.target.value === '' ? 0 : Number(e.target.value); setData({...data, tableros: tabs}); }} />
                <button onClick={() => setData({...data, tableros: (data.tableros || []).filter((_, i) => i !== idx)})} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </section>

      <button onClick={handleSave} className="bg-[var(--accent)] text-black px-6 py-2 rounded-xl font-bold">Guardar Configuración</button>
    </div>
  );
};
