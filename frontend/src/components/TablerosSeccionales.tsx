import { useState } from 'react';
import { Project, TableroSeccionalSimple } from '../types/project';
import { Plus, Trash2, Zap } from 'lucide-react';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export const TablerosSeccionales = ({ project, onChange }: Props) => {
  const tableros: TableroSeccionalSimple[] = project.tablerosSeccionales || [];
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaPotencia, setNuevaPotencia] = useState('');

  const agregar = () => {
    const nombre = nuevoNombre.trim();
    const potencia = parseFloat(nuevaPotencia);
    if (!nombre || isNaN(potencia) || potencia <= 0) {
      alert('Ingresá un nombre y una potencia válida (kVA > 0)');
      return;
    }
    const nuevo: TableroSeccionalSimple = {
      id: `ts-${Date.now()}`,
      nombre,
      potencia,
    };
    onChange({
      ...project,
      tablerosSeccionales: [...tableros, nuevo],
    });
    setNuevoNombre('');
    setNuevaPotencia('');
  };

  const eliminar = (id: string) => {
    onChange({
      ...project,
      tablerosSeccionales: tableros.filter(t => t.id !== id),
      // Limpiar conductores asociados a este tablero
      conductores: Object.fromEntries(
        Object.entries(project.conductores || {}).filter(
          ([key]) => !key.startsWith(`barra-salida-${id}`) && !key.startsWith(`salida-tablero-${id}`)
        )
      ),
    });
  };

  const actualizar = (id: string, campo: 'nombre' | 'potencia', valor: string) => {
    onChange({
      ...project,
      tablerosSeccionales: tableros.map(t =>
        t.id === id
          ? { ...t, [campo]: campo === 'potencia' ? (valor as any) : valor }
          : t
      ),
    });
  };

  const potenciaTotal = tableros.reduce((acc, t) => acc + (Number(t.potencia) || 0), 0);

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap size={16} className="text-[var(--accent)]" />
          Tableros Seccionales
        </h3>
        <p className="text-[11px] text-slate-500 mt-1">
          Cada tablero genera dos tramos de conductores en el cálculo.
        </p>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {tableros.length === 0 && (
          <div className="text-center py-8 text-slate-600 text-xs italic">
            No hay tableros. Agregá uno abajo.
          </div>
        )}
        {tableros.map((t, idx) => (
          <div
            key={t.id}
            className="bg-slate-900 rounded-xl border border-slate-800 p-3.5 flex flex-col gap-2.5 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Tablero #{idx + 1}
              </span>
              <button
                onClick={() => eliminar(t.id)}
                className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                title="Eliminar tablero"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Nombre del tablero"
              className="bg-slate-950 text-white text-xs rounded-lg px-3 py-2 border border-slate-700 hover:border-slate-500 focus:border-[var(--accent)] focus:outline-none transition-colors"
              value={t.nombre}
              onChange={e => actualizar(t.id, 'nombre', e.target.value)}
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Potencia (kVA)"
                className="bg-slate-950 text-white text-xs rounded-lg px-3 py-2 border border-slate-700 hover:border-slate-500 focus:border-[var(--accent)] focus:outline-none transition-colors flex-1"
                value={t.potencia}
                onChange={e => actualizar(t.id, 'potencia', e.target.value)}
              />
              <span className="text-xs text-slate-500 shrink-0">kVA</span>
            </div>
          </div>
        ))}
      </div>

      {/* Potencia total */}
      {tableros.length > 0 && (
        <div className="px-4 py-2.5 border-t border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-500">Potencia total instalada:</span>
          <span className="text-sm font-bold text-[var(--accent)]">{potenciaTotal.toFixed(1)} kVA</span>
        </div>
      )}

      {/* Agregar nuevo */}
      <div className="p-4 border-t border-slate-800 space-y-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Agregar tablero</p>
        <input
          type="text"
          placeholder="Nombre (ej: TS-Planta Baja)"
          className="w-full bg-slate-950 text-white text-xs rounded-lg px-3 py-2 border border-slate-700 hover:border-slate-500 focus:border-[var(--accent)] focus:outline-none transition-colors"
          value={nuevoNombre}
          onChange={e => setNuevoNombre(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && agregar()}
        />
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="Potencia (kVA)"
            className="bg-slate-950 text-white text-xs rounded-lg px-3 py-2 border border-slate-700 hover:border-slate-500 focus:border-[var(--accent)] focus:outline-none transition-colors flex-1"
            value={nuevaPotencia}
            onChange={e => setNuevaPotencia(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && agregar()}
          />
          <button
            onClick={agregar}
            className="flex items-center gap-1.5 bg-[var(--accent)] text-black font-bold text-xs px-3 py-2 rounded-lg hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus size={13} />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};
