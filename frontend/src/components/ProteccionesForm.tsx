import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export const ProteccionesForm = ({ onClose, onSave, initialData }: { onClose: () => void, onSave: (data: any) => void, initialData?: any }) => {
  const [formData, setFormData] = useState(initialData || {
    marca_id: 1, 
    modelo: '',
    tipo_proteccion: 'Interruptor Automático',
    in_amp: 0,
    curva_disparo: 'C',
    polos: 1,
    specs_tecnicas: {},
    capacidades: [{ tension_v: 230, icn_ka: 6, icu_ka: 0, ics_ka: 0 }]
  });

  const addCapacidad = () => {
    setFormData((prev: any) => ({
      ...prev,
      capacidades: [...prev.capacidades, { tension_v: 400, icn_ka: 0, icu_ka: 0, ics_ka: 0 }]
    }));
  };

  const updateCapacidad = (index: number, field: string, value: number) => {
    const caps = [...formData.capacidades];
    caps[index] = { ...caps[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, capacidades: caps }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl w-full max-w-2xl border border-slate-700 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-4">
          {initialData ? 'Editar Protección' : 'Nueva Protección'}
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Modelo</label>
            <input className="w-full bg-[var(--bg-primary)] p-3 rounded-lg text-white border border-slate-700" value={formData.modelo} placeholder="Ej: iC60N" onChange={(e) => setFormData({...formData, modelo: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Corriente Nominal (In)</label>
            <input className="w-full bg-[var(--bg-primary)] p-3 rounded-lg text-white border border-slate-700" value={formData.in_amp} placeholder="Ej: 20" type="number" onChange={(e) => setFormData({...formData, in_amp: Number(e.target.value)})} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Tipo</label>
            <select className="w-full bg-[var(--bg-primary)] p-3 rounded-lg text-white border border-slate-700" value={formData.tipo_proteccion} onChange={(e) => setFormData({...formData, tipo_proteccion: e.target.value})}>
              <option value="Interruptor Automático">Interruptor Automático</option>
              <option value="Interruptor Diferencial">Interruptor Diferencial</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Polos</label>
            <select className="w-full bg-[var(--bg-primary)] p-3 rounded-lg text-white border border-slate-700" value={formData.polos} onChange={(e) => setFormData({...formData, polos: Number(e.target.value)})}>
              <option value={1}>1 Polo</option>
              <option value={2}>2 Polos</option>
              <option value={3}>3 Polos</option>
              <option value={4}>4 Polos</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Curva</label>
            <select className="w-full bg-[var(--bg-primary)] p-3 rounded-lg text-white border border-slate-700" value={formData.curva_disparo} onChange={(e) => setFormData({...formData, curva_disparo: e.target.value})}>
              <option value="B">Curva B</option>
              <option value="C">Curva C</option>
              <option value="D">Curva D</option>
            </select>
          </div>
        </div>
        
        <h4 className="text-lg font-semibold text-white mt-8 mb-4 border-b border-slate-700 pb-2">Capacidades de Corte</h4>
        <div className="space-y-3">
          {formData.capacidades.map((cap: any, i: number) => (
            <div key={i} className="grid grid-cols-4 gap-3 items-center bg-[var(--bg-primary)] p-3 rounded-lg border border-slate-700">
              <input className="bg-transparent text-white text-sm" value={cap.tension_v} placeholder="Ue (V)" type="number" onChange={(e) => updateCapacidad(i, 'tension_v', Number(e.target.value))} />
              <input className="bg-transparent text-white text-sm" value={cap.icn_ka} placeholder="Icn (kA)" type="number" onChange={(e) => updateCapacidad(i, 'icn_ka', Number(e.target.value))} />
              <input className="bg-transparent text-white text-sm" value={cap.icu_ka} placeholder="Icu (kA)" type="number" onChange={(e) => updateCapacidad(i, 'icu_ka', Number(e.target.value))} />
              <input className="bg-transparent text-white text-sm" value={cap.ics_ka} placeholder="Ics (kA)" type="number" onChange={(e) => updateCapacidad(i, 'ics_ka', Number(e.target.value))} />
            </div>
          ))}
        </div>
        <button onClick={addCapacidad} className="text-[var(--accent)] text-sm font-medium mt-3 flex items-center gap-2 hover:text-white transition-colors">
          <Plus size={16}/> Añadir nivel de tensión
        </button>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-6 py-2 text-white hover:bg-slate-700 rounded-lg transition-colors">Cancelar</button>
          <button onClick={() => onSave(formData)} className="bg-[var(--accent)] hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium transition-all">
            {initialData ? 'Actualizar Protección' : 'Guardar Protección'}
          </button>
        </div>
      </div>
    </div>
  );
};
