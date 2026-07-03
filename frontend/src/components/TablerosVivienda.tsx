import React, { useState } from 'react';
import { Project, Tablero, TableroSeccional, CircuitoTerminal } from '../types/project';
import { ViviendaConductorForm } from '../features/vivienda/ViviendaConductorForm';
import { ChevronRight, ChevronDown, Plus, Trash2, Folder, Zap, List, Activity } from 'lucide-react';

// --- Tipos de Navegación ---
type NodeType = 'Tablero' | 'TableroSeccional';

interface TreeItem {
  id: string;
  nombre: string;
  type: NodeType;
  path: string[];
  children?: TreeItem[];
}

// --- Componente Principal ---
export const TablerosVivienda = ({ project, onChange }: { project: Project; onChange: (p: Project) => void }) => {
  const [selectedPath, setSelectedPath] = useState<string[]>(['root']);

  // --- LÓGICA DE CÁLCULO DE CORRIENTES (DERECHA HACIA IZQUIERDA) ---

  /**
   * Calcula la corriente total (IB) que debe pasar por un nodo específico.
   * La corriente de un nodo es la suma de:
   * 1. La corriente de sus circuitos terminales asignados.
   * 2. La corriente de todos sus sub-tableros (recursivo).
   */
  const getAggregateCurrent = (node: any, currentProject: Project): number => {
    let total = 0;
    if (node.circuitosTerminales && Array.isArray(node.circuitosTerminales)) {
      total += node.circuitosTerminales.reduce((acc: number, c: any) => {
        // Usamos la potencia para la estimación en la fase de configuración
        return acc + (c.potencia || 0) / 220; 
      }, 0);
    }
    if (node.subTableros && Array.isArray(node.subTableros)) {
      total += node.subTableros.reduce((acc: number, sub: any) => {
        return acc + getAggregateCurrent(sub, currentProject);
      }, 0);
    }
    return total;
  };

  const getEffectiveCurrent = (circuito: CircuitoTerminal, currentProject: Project): number => {
    return (circuito.potencia || 0) / 220;
  };

  // --- LÓGICA DE NAVEGACIÓN ---

  const getNodesRecursive = (node: any, currentPath: string[]): TreeItem[] => {
    const items: TreeItem[] = [];
    
    if (currentPath.length > 1) {
      items.push({
        id: node.id,
        nombre: node.nombre,
        type: node.subTableros?.length > 0 ? 'Tablero' : 'TableroSeccional', 
        path: currentPath,
      });
    }

    const subTableros = node.subTableros || [];
    subTableros.forEach((sub: any) => {
      const subItems = getNodesRecursive(sub, [...currentPath, sub.id]);
      if (subItems.length > 0) {
        items.push({
          id: sub.id,
          nombre: sub.nombre,
          type: 'Tablero',
          path: [...currentPath, sub.id],
          children: subItems
        });
      } else {
        items.push({
          id: sub.id,
          nombre: sub.nombre,
          type: 'TableroSeccional',
          path: [...currentPath, sub.id]
        });
      }
    });

    return items;
  };

  const getNodeByPath = (tablero: Tablero, path: string[]): any => {
    let current: any = tablero;
    for (let i = 1; i < path.length; i++) {
      const next = current.subTableros?.find((t: any) => t.id === path[i]);
      if (!next) return undefined;
      current = next;
    }
    return current;
  };

  const currentNode = getNodeByPath(project.tableroPrincipal, selectedPath);

  // --- LÓGICA DE ACTUALIZACIÓN ---

  const updateProjectRecursive = (
    node: any, 
    path: string[], 
    updateFn: (n: any) => any
  ): any => {
    if (path.length === 1) return updateFn(node);
    const nextId = path[1];
    return {
      ...node,
      subTableros: node.subTableros.map((sub: any) => 
        sub.id === nextId ? updateProjectRecursive(sub, path.slice(1), updateFn) : sub
      )
    };
  };

  const handleUpdateNode = (path: string[], updates: Partial<any>) => {
    const newProject = { ...project };
    newProject.tableroPrincipal = updateProjectRecursive(newProject.tableroPrincipal, path, (node) => ({
      ...node,
      ...updates
    }));
    onChange(newProject);
  };

  const addSubTablero = (path: string[], type: 'Tablero' | 'TableroSeccional') => {
    const newId = `${type === 'Tablero' ? 't' : 'ts'}-${Date.now()}`;
    const newSub: any = {
      id: newId,
      nombre: `Nuevo ${type === 'Tablero' ? 'Tablero' : 'Seccional'}`,
      conductorAlimentacion: { tipo: 'Cable' },
      proteccionCabecera: { tipo: 'Termomagnética', valorNominal: 32 },
      subTableros: [],
      circuitosTerminales: []
    };
    const node = getNodeByPath(project.tableroPrincipal, path) as any;
    handleUpdateNode(path, { subTableros: [...(node.subTableros || []), newSub] });
  };

  const removeSubTablero = (path: string[]) => {
    if (!confirm('¿Eliminar este tablero y todos sus sub-tableros?')) return;
    const targetId = path[path.length - 1];
    const parentPath = path.slice(0, -1);
    const newProject = { ...project };
    const removeRecursive = (node: any, p: string[]): any => {
      if (p.length === 1) return node;
      return {
        ...node,
        subTableros: node.subTableros
          .filter((sub: any) => sub.id !== targetId)
          .map((sub: any) => removeRecursive(sub, p.slice(1)))
      };
    };
    newProject.tableroPrincipal = removeRecursive(newProject.tableroPrincipal, parentPath);
    onChange(newProject);
  };

  const addCircuito = (path: string[]) => {
    const node = getNodeByPath(project.tableroPrincipal, path) as any;
    const newCircuito: CircuitoTerminal = {
      id: `c-${Date.now()}`,
      nombre: `Circuito ${node.circuitosTerminales.length + 1}`,
      tipo: 'Iluminación',
      potencia: 1000,
      conductor: { tipo: 'Cable' },
      proteccion: { tipo: 'PIA', valorNominal: 16 }
    };
    handleUpdateNode(path, { circuitosTerminales: [...(node.circuitosTerminales || []), newCircuito] });
  };

  const removeCircuito = (path: string[], circuitoId: string) => {
    const node = getNodeByPath(project.tableroPrincipal, path) as any;
    handleUpdateNode(path, {
      circuitosTerminales: node.circuitosTerminales.filter((c: CircuitoTerminal) => c.id !== circuitoId)
    });
  };

  const updateCircuito = (path: string[], circuitoId: string, updates: Partial<CircuitoTerminal>) => {
    const node = getNodeByPath(project.tableroPrincipal, path) as any;
    const newCircuitos = node.circuitosTerminales.map((c: CircuitoTerminal) => 
      c.id === circuitoId ? { ...c, ...updates } : c
    );
    handleUpdateNode(path, { circuitosTerminales: newCircuitos });
  };

  // --- RENDERIZADO ---

  const TreeItem = ({ item, depth }: { item: TreeItem; depth: number }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div className="select-none">
        <div 
          className={`flex items-center gap-2 py-1 px-2 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors ${
            selectedPath.join('/') === item.path.join('/') ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => setSelectedPath(item.path)}
        >
          {hasChildren ? (
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : <div className="w-4" />}
          
          {item.type === 'Tablero' ? <Folder size={16} /> : <Zap size={16} />}
          <span className="text-sm truncate">{item.nombre}</span>
        </div>
        {hasChildren && isOpen && (
          <div>
            {item.children?.map(child => (
              <TreeItem key={child.id} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!currentNode) return <div className="text-white">Error: Nodo no encontrado</div>;

  const treeData = getNodesRecursive(project.tableroPrincipal, ['root']);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-160px)]">
      {/* Sidebar: Árbol de Navegación */}
      <div className="w-full md:w-72 bg-[var(--bg-secondary)] rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <List size={16} className="text-[var(--accent)]" />
            Estructura de Tableros
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {treeData.map(item => (
            <TreeItem key={item.id} item={item} depth={0} />
          ))}
        </div>
      </div>

      {/* Main Content: Editor del Nodo Seleccionado */}
      <div className="flex-1 bg-[var(--bg-secondary)] rounded-2xl border border-slate-800 overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{currentNode.nombre}</h2>
            <p className="text-slate-400 text-sm">Configuración del nodo seleccionado</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => addSubTablero(selectedPath, 'Tablero')}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-2 rounded-lg transition-colors"
            >
              <Plus size={14} /> Agregar Tablero
            </button>
            <button 
              onClick={() => addSubTablero(selectedPath, 'TableroSeccional')}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-2 rounded-lg transition-colors"
            >
              <Plus size={14} /> Agregar Seccional
            </button>
            {selectedPath.length > 1 && (
              <button 
                onClick={() => removeSubTablero(selectedPath)}
                className="flex items-center gap-1 bg-red-950/30 hover:bg-red-900/40 text-red-400 text-xs px-3 py-2 rounded-lg transition-colors"
              >
                <Trash2 size={14} /> Eliminar
              </button>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Sección: Tramos del Nodo */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
              <Activity size={16} /> Tramos de este Tablero
            </h3>
            
            {/* TRAMO 1: Cabecera a Salida */}
            <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-semibold text-white">Tramo: Cabecera $ightarrow$ Salida</h4>
                <div className="text-amber-400 text-xs font-bold">
                  I_{diseño}: {getAggregateCurrent(currentNode, project).toFixed(1)} A
                </div>
              </div>
              <ViviendaConductorForm 
                label="Configuración del conductor"
                conductor={currentNode.conductorAlimentacion}
                onChange={(c) => handleUpdateNode(selectedPath, { conductorAlimentacion: c })}
              />
            </div>

            {/* TRAMO 2: Salida a Circuitos / Sub-tableros */}
            
            {/* Tramos hacia Circuitos Terminales */}
            {(currentNode.circuitosTerminales || []).map((circuito, idx) => (
              <div key={circuito.id} className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-semibold text-white">Tramo: Salida $ightarrow$ {circuito.nombre}</h4>
                  <div className="text-amber-400 text-xs font-bold">
                    I_{diseño}: {getEffectiveCurrent(circuito, project).toFixed(1)} A
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 items-end">
                   <div className="flex-1 min-w-[200px]">
                     <ViviendaConductorForm 
                        label="Configuración del conductor"
                        conductor={circuito.conductor}
                        onChange={(c) => updateCircuito(selectedPath, circuito.id, { conductor: c })}
                      />
                   </div>
                   <div className="flex flex-col gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => removeCircuito(selectedPath, circuito.id)}
                        className="flex items-center justify-center gap-1 bg-red-950/30 hover:bg-red-900/40 text-red-400 text-xs px-3 py-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} /> Eliminar Circuito
                      </button>
                   </div>
                </div>
              </div>
            ))}

            {/* Tramos hacia Sub-tableros */}
            {(currentNode.subTableros || []).map((sub) => (
               <div key={sub.id} className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700">
                 <div className="flex justify-between items-center mb-4">
                   <h4 className="text-sm font-semibold text-white">Tramo: Salida $ightarrow$ {sub.nombre}</h4>
                   <div className="text-amber-400 text-xs font-bold">
                     I_{diseño}: {getAggregateCurrent(sub, project).toFixed(1)} A
                   </div>
                 </div>
                 <ViviendaConductorForm 
                    label="Configuración del conductor"
                    conductor={sub.conductorAlimentacion}
                    onChange={(c) => {
                      // Para actualizar un sub-tablero, necesitamos encontrar su path
                      // Para este prototipo, vamos a buscar el path de forma recursiva
                      const findPath = (node: any, targetId: string, currentPath: string[]): string[] | null => {
                        if (node.id === targetId) return currentPath;
                        if (node.subTableros) {
                          for (const sub of node.subTableros) {
                            const res = findPath(sub, targetId, [...currentPath, sub.id]);
                            if (res) return res;
                          }
                        }
                        return null;
                      };
                      const path = findPath(project.tableroPrincipal, sub.id, ['root']);
                      if (path) handleUpdateNode(path, { conductorAlimentacion: c });
                    }}
                  />
               </div>
            ))}
          </section>

          {/* Sección: Gestión de Elementos del Nodo */}
          <section className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700">
            <h3 className="text-sm font-bold text-[var(--accent)] uppercase mb-4">Elementos de este Tablero</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sub-tableros */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Sub-tableros</h4>
                  <button 
                    onClick={() => addSubTablero(selectedPath, 'Tablero')}
                    className="text-white bg-slate-700 hover:bg-slate.600 p-1 rounded transition-colors"
                    title="Agregar Tablero"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-2">
                  {(currentNode.subTableros || []).map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                      <span className="text-sm text-slate-300 truncate max-w-[120px]">{sub.nombre}</span>
                      <div className="flex gap-1">
                         <button 
                           onClick={() => setSelectedPath([...selectedPath, sub.id])}
                           className="text-blue-400 hover:text-blue-300 p-1"
                           title="Navegar"
                         >
                           <ChevronRight size={14} />
                         </button>
                         <button 
                           onClick={() => removeSubTablero([...selectedPath, sub.id])}
                           className="text-red-400 hover:text-red-300 p-1"
                           title="Eliminar"
                         >
                           <Trash2 size={14} />
                         </button>
                      </div>
                    </div>
                  ))}
                  {(currentNode.subTableros || []).length === 0 && <p className="text-xs text-slate-600 italic">Sin sub-tableros.</p>}
                </div>
              </div>

              {/* Circuitos */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Circuitos</h4>
                  <button 
                    onClick={() => addCircuito(selectedPath)}
                    className="text-white bg-slate-700 hover:bg-slate-600 p-1 rounded transition-colors"
                    title="Agregar Circuito"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-2">
                  {(currentNode.circuitosTerminales || []).map((circuito, idx) => (
                    <div key={circuito.id} className="flex items-center justify-between bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                      <span className="text-sm text-slate-300 truncate max-w-[120px]">{circuito.nombre}</span>
                      <div className="flex gap-1">
                         <button 
                           onClick={() => {
                             const findPath = (node: any, targetId: string, currentPath: string[]): string[] | null => {
                               if (node.id === targetId) return currentPath;
                               if (node.circuitosTerminales) {
                                 for (const c of node.circuitosTerminales) {
                                   if (c.id === targetId) return currentPath;
                                 }
                               }
                               if (node.subTableros) {
                                 for (const sub of node.subTableros) {
                                   const res = findPath(sub, targetId, [...currentPath, sub.id]);
                                   if (res) return res;
                                 }
                               }
                               return null;
                             };
                             const path = findPath(project.tableroPrincipal, circuito.id, ['root']);
                             if (path) setSelectedPath(path);
                           }}
                           className="text-blue-400 hover:text-blue-300 p-1"
                           title="Navegar al circuito"
                         >
                           <Zap size={14} />
                         </button>
                         <button 
                           onClick={() => removeCircuito(selectedPath, circuito.id)}
                           className="text-red-400 hover:text-red-300 p-1"
                           title="Eliminar"
                         >
                           <Trash2 size={14} />
                         </button>
                      </div>
                    </div>
                  ))}
                  {(currentNode.circuitosTerminales || []).length === 0 && <p className="text-xs text-slate-600 italic">Sin circuitos.</p>}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
