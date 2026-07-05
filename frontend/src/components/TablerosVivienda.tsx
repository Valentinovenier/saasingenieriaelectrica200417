import { useState } from 'react';
import { Project } from '../types/project';
import { TableroVivienda, CircuitoCalculado } from '../types/vivienda';
import { ChevronDown, ChevronRight, Plus, FolderTree } from 'lucide-react';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export const TablerosVivienda = ({ project, onChange }: Props) => {
  const datos = project.datosVivienda || { superficieCubierta: 0, superficieSemicubierta: 0, ambientes: [], circuitosCalculados: [], tableros: [] };
  const tableros = datos.tableros || [];

  // Estado para gestionar nodos expandidos por ID
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(tableros.map(t => t.id)));

  const toggleExpand = (id: string) => {
    const next = new Set(expandedNodes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedNodes(next);
  };

  const toggleCircuitoEnTablero = (tableroId: string, circuitoId: string) => {
    const nuevosTableros = tableros.map((t: TableroVivienda) => {
      if (t.id === tableroId) {
        const estaAsignado = t.circuitosIds.includes(circuitoId);
        return {
          ...t,
          circuitosIds: estaAsignado 
            ? t.circuitosIds.filter((id: string) => id !== circuitoId)
            : [...t.circuitosIds, circuitoId]
        };
      }
      // Quitar de otros tableros si se asigna aquí
      return {
        ...t,
        circuitosIds: t.circuitosIds.filter((id: string) => id !== circuitoId)
      };
    });
    onChange({ ...project, datosVivienda: { ...datos, tableros: nuevosTableros } });
  };

  const addTablero = (tipo: 'Seccional' | 'SubSeccional', padreId?: string) => {
    const nuevoTablero: TableroVivienda = {
        id: Date.now().toString(),
        nombre: `${tipo} ${tableros.length + 1}`,
        tipo,
        tableroPadreId: padreId,
        circuitosIds: []
    };
    onChange({ ...project, datosVivienda: { ...datos, tableros: [...tableros, nuevoTablero] } });
  };

  const renderTableroNode = (tablero: TableroVivienda, depth = 0) => {
    const expanded = expandedNodes.has(tablero.id);
    const subTableros = tableros.filter((t: TableroVivienda) => t.tableroPadreId === tablero.id);

    return (
      <div key={tablero.id} className={`${depth > 0 ? 'ml-6' : ''} border-l border-slate-700 pl-4 space-y-2`}>
        <div className="flex items-center gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800">
            <button onClick={() => toggleExpand(tablero.id)}>
                {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            <FolderTree size={16} className="text-[var(--accent)]" />
            <span className="font-bold text-white flex-1">{tablero.nombre}</span>
            <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase">{tablero.tipo}</span>
            {tablero.tipo !== 'SubSeccional' && (
                <button onClick={() => addTablero(tablero.tipo === 'Principal' ? 'Seccional' : 'SubSeccional', tablero.id)} className="text-[var(--accent)] hover:bg-slate-800 p-1 rounded">
                    <Plus size={16} />
                </button>
            )}
        </div>
        
        {expanded && (
            <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase ml-2">Circuitos Terminales</div>
                {datos.circuitosCalculados.map((c: CircuitoCalculado) => {
                    const esAsignado = tablero.circuitosIds.includes(c.id);
                    const estaEnOtro = tableros.some((t: TableroVivienda) => t.id !== tablero.id && t.circuitosIds.includes(c.id));
                    
                    return (
                        <label key={c.id} className={`flex items-center gap-2 p-2 rounded text-sm transition-colors ${estaEnOtro ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-800'}`}>
                            <input 
                                type="checkbox" 
                                checked={esAsignado} 
                                disabled={estaEnOtro}
                                onChange={() => toggleCircuitoEnTablero(tablero.id, c.id)}
                            />
                            {c.nombre}
                            {estaEnOtro && <span className="text-[9px] text-slate-500 italic ml-auto">(Asignado)</span>}
                        </label>
                    );
                })}
                {subTableros.map((st: TableroVivienda) => renderTableroNode(st, depth + 1))}
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700 space-y-6">
      <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Gestión de Tableros</h2>
      
      <div className="space-y-4">
        {tableros.filter((t: TableroVivienda) => t.tipo === 'Principal').map((tp: TableroVivienda) => renderTableroNode(tp))}
        {tableros.length === 0 && (
            <button onClick={() => {
                const tp: TableroVivienda = { id: 'tp', nombre: 'Tablero Principal', tipo: 'Principal', circuitosIds: [] };
                onChange({ ...project, datosVivienda: { ...datos, tableros: [tp] } });
            }} className="bg-[var(--accent)] text-black px-4 py-2 rounded-lg font-bold">
                Crear Tablero Principal
            </button>
        )}
      </div>
    </div>
  );
};
