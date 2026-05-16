import { useState } from 'react';
import { X } from 'lucide-react';

export const NewProjectModal = ({ onClose, onCreate }: { onClose: () => void, onCreate: (name: string) => void }) => {
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--bg-secondary)] border border-slate-700 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Nuevo Proyecto</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <input 
          autoFocus
          className="w-full bg-[var(--bg-primary)] border border-slate-700 rounded-xl px-4 py-3 text-white mb-6 focus:outline-none focus:border-[var(--accent)]"
          placeholder="Nombre del proyecto..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button 
          className="w-full bg-[var(--accent)] text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
          onClick={() => onCreate(name)}
        >
          Crear Proyecto
        </button>
      </div>
    </div>
  );
};
