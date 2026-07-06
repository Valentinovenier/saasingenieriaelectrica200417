import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export const ProteccionesForm = ({ onClose, onSave }: { onClose: () => void, onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    marca_id: 1, 
    modelo: '',
    tipo_proteccion: 'PIA',
    in_amp: 0,
    curva_disparo: 'C',
    polos: 1,
    specs_tecnicas: {},
    capacidades: [{ tension_v: 230, icn_ka: 6, icu_ka: 0, ics_ka: 0 }]
  });

  const addCapacidad = () => {
    setFormData(prev => ({
      ...prev,
      capacidades: [...prev.capacidades, { tension_v: 400, icn_ka: 0, icu_ka: 0, ics_ka: 0 }]
    }));
  };

  const updateCapacidad = (index: number, field: string, value: number) => {
    const caps = [...formData.capacidades];
    caps[index] = { ...caps[index], [field]: value };
    setFormData(prev => ({ ...prev, capacidades: caps }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--bg-secondary)] p-6 rounded-xl w-full max-w-2xl border border-slate-800">
        <h3 className="text-xl font-bold text-white mb-4">Nueva Protección</h3>
        <div className="grid grid-cols-2 gap-4">
          <input className="bg-[var(--bg-primary)] p-2 rounded text-white" placeholder="Modelo" onChange={(e) => setFormData({...formData, modelo: e.target.value})} />
          <input className="bg-[var(--bg-primary)] p-2 rounded text-white" placeholder="Corriente Nominal (A)" type="number" onChange={(e) => setFormData({...formData, in_amp: Number(e.target.value)})} />
        </div>
        
        <h4 className="text-white mt-6 mb-2">Capacidades de Corte</h4>
        {formData.capacidades.map((cap, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className="bg-[var(--bg-primary)] p-1 rounded text-white w-20" placeholder="Ue (V)" type="number" onChange={(e) => updateCapacidad(i, 'tension_v', Number(e.target.value))} />
            <input className="bg-[var(--bg-primary)] p-1 rounded text-white w-20" placeholder="Icn" type="number" onChange={(e) => updateCapacidad(i, 'icn_ka', Number(e.target.value))} />
            <input className="bg-[var(--bg-primary)] p-1 rounded text-white w-20" placeholder="Icu" type="number" onChange={(e) => updateCapacidad(i, 'icu_ka', Number(e.target.value))} />
          </div>
        ))}
        <button onClick={addCapacidad} className="text-[var(--accent)] text-sm flex items-center gap-1"><Plus size={16}/> Añadir tensión</button>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-white">Cancelar</button>
          <button onClick={() => onSave(formData)} className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg">Guardar</button>
        </div>
      </div>
    </div>
  );
};
