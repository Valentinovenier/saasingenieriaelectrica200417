import React from 'react';
import { useProject } from '../context/ProjectDataContext';
import { Plus } from 'lucide-react';

export const UnifilarEditor = () => {
  const { state, updateTrafo, addTablero } = useProject();

  const handlePotenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTrafo({ ...state.trafo, potenciaKVA: Number(e.target.value) });
  };

  const handleAddTablero = () => {
    addTablero({
      id: Date.now().toString(),
      nombre: `Tablero ${state.tableros.length + 1}`,
      cargas: []
    });
  };

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <h2 className="text-lg font-semibold text-white mb-6">Configuración TGBT</h2>
      
      <div className="mb-6">
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Potencia Transformador (kVA)</label>
        <input 
          type="number" 
          value={state.trafo.potenciaKVA} 
          onChange={handlePotenciaChange}
          className="w-full bg-[var(--bg-primary)] border border-slate-700 rounded-lg px-4 py-2 text-white"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md text-white">Tableros</h3>
        <button onClick={handleAddTablero} className="bg-[var(--accent)] text-white p-2 rounded-lg">
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-2">
        {state.tableros.map((tablero) => (
          <div key={tablero.id} className="p-3 bg-[var(--bg-primary)] rounded-lg text-[var(--text-secondary)] text-sm">
            {tablero.nombre}
          </div>
        ))}
      </div>
    </div>
  );
};
