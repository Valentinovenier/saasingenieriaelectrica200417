import React from 'react';
import { useProject } from '../context/ProjectDataContext';
import { Plus, Trash2 } from 'lucide-react';
import { TableroSeccional } from '../types/project';

const TableroItem = ({ tablero, onUpdate, onAddSub, onDelete }: { 
  tablero: TableroSeccional; 
  onUpdate: (id: string, updates: Partial<TableroSeccional>) => void;
  onAddSub: (parentId: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="ml-4 mt-2 p-3 bg-[var(--bg-primary)] rounded-lg border border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <input 
          value={tablero.name}
          onChange={(e) => onUpdate(tablero.id, { name: e.target.value })}
          className="bg-transparent text-white border-b border-transparent focus:border-[var(--accent)] focus:outline-none"
        />
        <button onClick={() => onAddSub(tablero.id)} className="text-[var(--accent)]">
          <Plus size={16} />
        </button>
        <button onClick={() => onDelete(tablero.id)} className="text-red-500">
          <Trash2 size={16} />
        </button>
      </div>
      {tablero.subTableros.map(sub => (
        <TableroItem key={sub.id} tablero={sub} onUpdate={onUpdate} onAddSub={onAddSub} onDelete={onDelete} />
      ))}
    </div>
  );
};

export const UnifilarEditor = () => {
  const { state, setState } = useProject();

  const handlePotenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!state) return;
    setState({ ...state, transformador: { ...state.transformador!, potencia: Number(e.target.value) } });
  };

  const updateTableroRecursive = (tableros: TableroSeccional[], id: string, updates: Partial<TableroSeccional>): TableroSeccional[] => {
    return tableros.map(t => {
      if (t.id === id) return { ...t, ...updates };
      return { ...t, subTableros: updateTableroRecursive(t.subTableros, id, updates) };
    });
  };

  const addSubTableroRecursive = (tableros: TableroSeccional[], parentId: string): TableroSeccional[] => {
    return tableros.map(t => {
      if (t.id === parentId) {
        return {
          ...t,
          subTableros: [...t.subTableros, {
            id: Date.now().toString(),
            name: `Sub ${t.subTableros.length + 1}`,
            tipo: 'Fuerza Motriz',
            potenciaTotal: 0,
            factorK: 1,
            subTableros: []
          }]
        };
      }
      return { ...t, subTableros: addSubTableroRecursive(t.subTableros, parentId) };
    });
  };

  const deleteTableroRecursive = (tableros: TableroSeccional[], id: string): TableroSeccional[] => {
    return tableros.filter(t => t.id !== id).map(t => ({
      ...t,
      subTableros: deleteTableroRecursive(t.subTableros, id)
    }));
  };

  const handleAddTopTablero = () => {
    if (!state) return;
    setState({ 
      ...state, 
      tableros: [...state.tableros, {
        id: Date.now().toString(),
        name: `Tablero ${state.tableros.length + 1}`,
        tipo: 'Fuerza Motriz',
        potenciaTotal: 0,
        factorK: 1,
        subTableros: []
      }] 
    });
  };

  if (!state) return null;

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <h2 className="text-lg font-semibold text-white mb-6">Configuración TGBT</h2>
      
      <div className="mb-6">
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Potencia Transformador (kVA)</label>
        <input 
          type="number" 
          value={state.transformador?.potencia || ''} 
          onChange={handlePotenciaChange}
          className="w-full bg-[var(--bg-primary)] border border-slate-700 rounded-lg px-4 py-2 text-white"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md text-white">Tableros</h3>
        <button onClick={handleAddTopTablero} className="bg-[var(--accent)] text-white p-2 rounded-lg">
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-2">
        {state.tableros.map((tablero: TableroSeccional) => (
          <TableroItem 
            key={tablero.id} 
            tablero={tablero} 
            onUpdate={(id, updates) => setState({...state, tableros: updateTableroRecursive(state.tableros, id, updates)})}
            onAddSub={(parentId) => setState({...state, tableros: addSubTableroRecursive(state.tableros, parentId)})}
            onDelete={(id) => setState({...state, tableros: deleteTableroRecursive(state.tableros, id)})}
          />
        ))}
      </div>
    </div>
  );
};
