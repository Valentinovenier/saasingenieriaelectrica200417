import React from 'react';
import { useProject } from '../context/ProjectDataContext';
import { Plus, Trash2 } from 'lucide-react';
import { TableroSeccional, Transformador, Proteccion } from '../types/project';
import { engine } from '../engine';

const ProteccionFields = ({ label, value, onChange }: { label: string, value?: Proteccion, onChange: (p: Proteccion | undefined) => void }) => (
  <div className="mt-2 p-2 bg-slate-900 rounded border border-slate-700">
    <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
    <div className="flex gap-2">
      <select 
        className="bg-[var(--bg-secondary)] text-white text-xs rounded p-1"
        value={value?.tipo || 'Termomagnética'}
        onChange={(e) => onChange({ ...value, tipo: e.target.value as any, valorNominal: value?.valorNominal || 0 })}
      >
        <option value="Termomagnética">Termomagnética</option>
        <option value="Fusible">Fusible</option>
        <option value="Interruptor Automático">Int. Automático</option>
      </select>
      <input 
        type="number" 
        placeholder="A" 
        className="w-16 bg-[var(--bg-secondary)] text-white text-xs rounded p-1"
        value={value?.valorNominal || ''}
        onChange={(e) => onChange({ ...value, tipo: value?.tipo || 'Termomagnética', valorNominal: Number(e.target.value) })}
      />
    </div>
  </div>
);

const TableroItem = ({ tablero, onUpdate, onAddSub, onDelete }: { 
  tablero: TableroSeccional; 
  onUpdate: (id: string, updates: Partial<TableroSeccional>) => void;
  onAddSub: (parentId: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="ml-4 mt-2 p-3 bg-[var(--bg-primary)] rounded-lg border border-slate-700">
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex items-center gap-2">
          <input 
            value={tablero.name || ''}
            onChange={(e) => onUpdate(tablero.id, { name: e.target.value })}
            className="flex-grow bg-transparent text-white border-b border-transparent focus:border-[var(--accent)] focus:outline-none"
            placeholder="Nombre"
          />
          <button onClick={() => onAddSub(tablero.id)} className="text-[var(--accent)]">
            <Plus size={16} />
          </button>
          <button onClick={() => onDelete(tablero.id)} className="text-red-500">
            <Trash2 size={16} />
          </button>
        </div>
        <input 
          type="number"
          value={tablero.potenciaTotal ?? ''}
          onChange={(e) => onUpdate(tablero.id, { potenciaTotal: Number(e.target.value) })}
          className="bg-[var(--bg-secondary)] text-sm text-white rounded px-2 py-1 border border-slate-700"
          placeholder="Potencia (kVA)"
        />
        <div className="grid grid-cols-2 gap-2">
            <ProteccionFields label="Cabecera" value={tablero.proteccionCabecera} onChange={(p) => onUpdate(tablero.id, { proteccionCabecera: p })} />
            <ProteccionFields label="Salida" value={tablero.proteccionSalida} onChange={(p) => onUpdate(tablero.id, { proteccionSalida: p })} />
        </div>
      </div>
      {tablero.subTableros?.map(sub => (
        <TableroItem key={sub.id} tablero={sub} onUpdate={onUpdate} onAddSub={onAddSub} onDelete={onDelete} />
      ))}
    </div>
  );
};

export const UnifilarEditor = () => {
  const { state, setState } = useProject();

  const handleTransformadorChange = (field: keyof Transformador, value: number) => {
    if (!state) return;
    setState({ 
      ...state, 
      transformador: { 
        ...state.transformador!, 
        [field]: value 
      } 
    });
  };

  const updateTableroRecursive = (tableros: TableroSeccional[] | undefined, id: string, updates: Partial<TableroSeccional>): TableroSeccional[] => {
    return (tableros || []).map(t => {
      if (t.id === id) return { ...t, ...updates };
      return { ...t, subTableros: updateTableroRecursive(t.subTableros, id, updates) };
    });
  };

  const addSubTableroRecursive = (tableros: TableroSeccional[] | undefined, parentId: string): TableroSeccional[] => {
    return (tableros || []).map(t => {
      if (t.id === parentId) {
        return {
          ...t,
          subTableros: [...(t.subTableros || []), {
            id: Date.now().toString(),
            name: `Sub ${(t.subTableros?.length || 0) + 1}`,
            tipo: 'Fuerza Motriz',
            potenciaTotal: 0,
            subTableros: []
          }]
        };
      }
      return { ...t, subTableros: addSubTableroRecursive(t.subTableros, parentId) };
    });
  };

  const deleteTableroRecursive = (tableros: TableroSeccional[] | undefined, id: string): TableroSeccional[] => {
    return (tableros || []).filter(t => t.id !== id).map(t => ({
      ...t,
      subTableros: deleteTableroRecursive(t.subTableros, id)
    }));
  };

  const handleAddTopTablero = () => {
    if (!state) return;
    setState({ 
      ...state, 
      tableros: [...(state.tableros || []), {
        id: Date.now().toString(),
        name: `Tablero ${(state.tableros?.length || 0) + 1}`,
        tipo: 'Fuerza Motriz',
        potenciaTotal: 0,
        subTableros: []
      }] 
    });
  };

  if (!state) return null;

  const intr = state.transformador ? engine.transformador.calcularIntr(
    state.transformador.potencia ?? 0,
    state.transformador.tensionSecundario ?? 0
  ) : 0;

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <h2 className="text-lg font-semibold text-white mb-6">Configuración TGBT</h2>
      
      <div className="mb-6 p-4 bg-slate-900 rounded-lg">
        <p className="text-sm text-[var(--text-secondary)]">Potencia Total Proyecto:</p>
        <p className="text-2xl font-bold text-white">{engine.potencia.total(state.tableros || [])} kVA</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md text-white">Tableros</h3>
        <button onClick={handleAddTopTablero} className="bg-[var(--accent)] text-white p-2 rounded-lg">
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-2">
        {state.tableros?.map((tablero: TableroSeccional) => (
          <TableroItem 
            key={tablero.id} 
            tablero={tablero} 
            onUpdate={(id, updates) => setState({...state, tableros: updateTableroRecursive(state.tableros, id, updates)})}
            onAddSub={(parentId) => setState({...state, tableros: addSubTableroRecursive(state.tableros, parentId)})}
            onDelete={(id) => setState({...state, tableros: deleteTableroRecursive(state.tableros, id)})}
          />
        ))}
      </div>

      <div className="mt-8 p-6 bg-slate-900 rounded-2xl border border-slate-700">
        <h3 className="text-md font-semibold text-white mb-4">Datos calculados</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-slate-700">
            <p className="text-xs text-[var(--text-secondary)]">Intr (A)</p>
            <p className="text-lg font-bold text-white">{intr.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-slate-700">
            <p className="text-xs text-[var(--text-secondary)]">Ik1 (kA)</p>
            <p className="text-lg font-bold text-white">--</p>
          </div>
        </div>
      </div>
    </div>
  );
};
