import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export const ProteccionesForm = ({ onClose, onSave, initialData }: { onClose: () => void, onSave: (data: any) => void, initialData?: any }) => {
  const [formData, setFormData] = useState(initialData ? {
    ...initialData,
    capacidades: initialData.capacidades || []
  } : {
    marca_id: 1, 
    modelo: '',
    tipo_proteccion: 'Interruptor Automático',
    in_amp: 1,
    curva_disparo: 'C',
    polos: 1,
    specs_tecnicas: {},
    capacidades: [{ tension_v: 230, icn_ka: 3, clase_limitacion: 1 }]
  });

  const addCapacidad = () => {
    setFormData((prev: any) => ({
      ...prev,
      capacidades: [...prev.capacidades, { tension_v: 400, icn_ka: 3, clase_limitacion: 1 }]
    }));
  };

  const updateCapacidad = (index: number, field: string, value: number) => {
    const caps = [...formData.capacidades];
    caps[index] = { ...caps[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, capacidades: caps }));
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
        await onSave(formData);
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Error al guardar la protección");
    } finally {
        setSaving(false);
    }
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
            <select className="w-full bg-[var(--bg-primary)] p-3 rounded-lg text-white border border-slate-700" value={formData.in_amp} onChange={(e) => setFormData({...formData, in_amp: Number(e.target.value)})}>
              {[1, 2, 3, 4, 6, 10, 16, 20, 25, 32, 40, 50, 63].map(val => (
                <option key={val} value={val}>{val} A</option>
              ))}
            </select>
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
        <div className="grid grid-cols-3 gap-3 mb-2 px-2">
          <label className="text-xs font-medium text-[var(--text-secondary)]">Ue (V)</label>
          <label className="text-xs font-medium text-[var(--text-secondary)]">Icn (kA)</label>
          <label className="text-xs font-medium text-[var(--text-secondary)]">Clase Lim.</label>
        </div>
        <div className="space-y-3">
          {formData.capacidades.map((cap: any, i: number) => (
            <div key={i} className="grid grid-cols-3 gap-3 items-center bg-[var(--bg-primary)] p-3 rounded-lg border border-slate-700">
              <select className="bg-[var(--bg-secondary)] text-white p-2 rounded text-sm border border-slate-700" value={cap.tension_v} onChange={(e) => updateCapacidad(i, 'tension_v', Number(e.target.value))}>
                <option value={230}>230 V</option>
                <option value={400}>400 V</option>
              </select>
              <select className="bg-[var(--bg-secondary)] text-white p-2 rounded text-sm border border-slate-700" value={cap.icn_ka} onChange={(e) => updateCapacidad(i, 'icn_ka', Number(e.target.value))}>
                <option value={3}>3000 A</option>
                <option value={4.5}>4500 A</option>
                <option value={6}>6000 A</option>
                <option value={10}>10000 A</option>
              </select>
              <select className="bg-[var(--bg-secondary)] text-white p-2 rounded text-sm border border-slate-700" value={cap.clase_limitacion} onChange={(e) => updateCapacidad(i, 'clase_limitacion', Number(e.target.value))}>
                <option value={1}>Clase 1</option>
                <option value={2}>Clase 2</option>
                <option value={3}>Clase 3</option>
              </select>
            </div>
          ))}
        </div>
        <button onClick={addCapacidad} className="text-[var(--accent)] text-sm font-medium mt-3 flex items-center gap-2 hover:text-white transition-colors">
          <Plus size={16}/> Añadir nivel de tensión
        </button>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-6 py-2 text-white hover:bg-slate-700 rounded-lg transition-colors">Cancelar</button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[var(--accent)] hover:opacity-90 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all"
          >
            {saving ? 'Guardando...' : (initialData ? 'Actualizar Protección' : 'Guardar Protección')}
          </button>
        </div>
      </div>
    </div>
  );

};
