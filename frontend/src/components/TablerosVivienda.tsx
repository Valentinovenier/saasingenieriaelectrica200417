import React, { useState } from 'react';
import { Project, Tablero, TableroSeccional, CircuitoTerminal, Conductor, Proteccion } from '../types/project';
import { ViviendaConductorForm } from '../features/vivienda/ViviendaConductorForm';
import { ChevronRight, ChevronDown, Plus, Trash2, Folder, Zap, List } from 'lucide-react';

// Tipos de nodos para la navegación
type NodeType = 'Tablero' | 'TableroSeccional';

interface TreeItem {
  id: string;
  nombre: string;
  type: NodeType;
  path: string[];
  children?: TreeItem[];
}

export const TablerosVivienda = ({ project, onChange }: { project: Project; onChange: (p: Project) => void }) => {
  const [selectedPath, setSelectedPath] = useState<string[]>(['root']);

  // --- Lógica de Navegación y Acceso al Nodo ---

  const getNodesRecursive = (node: Tablero | TableroSeccional, currentPath: string[]): TreeItem[] => {
    const items: TreeItem[] = [];
    
    // Agregar el nodo actual (excepto la raíz que es implícita)
    if (currentPath.length > 1) {
      items.push({
        id: node.id,
        nombre: node.nombre,
        type: 'Tablero', // Por simplicidad en la UI, tratamos todos como tableros para la navegación
        path: currentPath,
      });
    }

    // Procesar sub-tableros
    const subTableros = node.subTableros || [];
    subTableros.forEach(sub => {
      const subItems = getNodesRecursive(sub as Tablero, [...currentPath, sub.id]);
      if (subItems.length > 0) {
        items.push({
          id: sub.id,
          nombre: sub.nombre,
          type: 'Tablero',
          path: [...currentPath, sub.id],
          children: subItems
        });
      } else {
        // Si no tiene hijos, lo agregamos como un item simple
        items.push({
          id: sub.id,
          nombre: sub.nombre,
          type: 'Tablero',
          path: [...currentPath, sub.id]
        });
      }
    });

    return items;
  };

  const getNodeByPath = (tablero: Tablero, path: string[]): Tablero | TableroSeccional | undefined => {
    let current: any = tablero;
    for (let i = 1; i < path.length; i++) {
      const next = current.subTableros?.find((t: any) => t.id === path[i]);
      if (!next) return undefined;
      current = next;
    }
    return current;
  };

  const currentNode = getNodeByPath(project.tableroPrincipal, selectedPath) as (Tablero | TableroSeccional);

  // --- Lógica de Actualización ---

  const updateProjectRecursive = (
    node: any, 
    path: string[], 
    updateFn: (n: any) => any
  ): any => {
    if (path.length === 1) {
      return updateFn(node);
    }

    const nextId = path[1];
    const newSubTableros = node.subTableros.map((sub: any) => {
      if (sub.id === nextId) {
        return updateProjectRecursive(sub, path.slice(1), updateFn);
      }
      return sub;
    });

    return { ...node, subTableros: newSubTableros };
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

    handleUpdateNode(path, {
      subTableros: [...(getNodeByPath(project.tableroPrincipal, path as string[]) as any).subTableros, newSub]
    });
  };

  const removeSubTablero = (path: string[]) => {
    if (!confirm('¿Eliminar este tablero y todos sus sub-tableros?')) return;
    
    const targetId = path[path.length - 1];
    const parentPath = path.slice(0, -1);

    const newProject = { ...project };
    const removeRecursive = (node: any, p: string[]): any => {
      if (p.length === 1) return node;
      const nextId = p[1];
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

    handleUpdateNode(path, {
      circuitosTerminales: [...(node.circuitosTerminales || []), newCircuito]
    });
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

  // --- Renderizado ---

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
          {/* Sección: Configuración de Alimentación del Nodo */}
          <section className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700">
            <h3 className="text-sm font-bold text-[var(--accent)] uppercase mb-4">Alimentación del Nodo</h3>
            <ViviendaConductorForm 
              label="Conductor de Alimentación"
              conductor={currentNode.conductorAlimentacion}
              onChange={(c) => handleUpdateNode(selectedPath, { conductorAlimentacion: c })}
            />
          </section>

          {/* Sección: Circuitos Terminales */}
          <section className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[var(--accent)] uppercase">Circuitos Terminales</h3>
              <button 
                onClick={() => addCircuito(selectedPath)}
                className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus size={14} /> Agregar Circuito
              </button>
            </div>

            {(currentNode.circuitosTerminales || []).length > 0 ? (
              <div className="space-y-4">
                {currentNode.circuitosTerminales.map((circuito, idx) => (
                  <div key={circuito.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-xs font-mono">#{idx + 1}</span>
                        <input 
                          type="text"
                          className="bg-transparent text-white text-sm font-semibold focus:outline-none focus:border-b border-[var(--accent)]"
                          value={circuito.nombre}
                          onChange={(e) => updateCircuito(selectedPath, circuito.id, { nombre: e.target.value })}
                        />
                      </div>
                      <button 
                        onClick={() => removeCircuito(selectedPath, circuito.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {/* Aquí podrías poner un formulario simplificado para el circuito si quisieras, 
                           por ahora solo permitimos cambiar nombre y potencia básica para no complicar */}
                       <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Potencia (W):</span>
                          <input 
                            type="number"
                            className="bg-slate-800 text-white text-xs rounded px-2 py-1 w-24 border border-slate-700"
                            value={circuito.potencia}
                            onChange={(e) => updateCircuito(selectedPath, circuito.id, { potencia: parseFloat(e.target.value) })}
                          />
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Tipo:</span>
                          <input 
                            type="text"
                            className="bg-slate-800 text-white text-xs rounded px-2 py-1 w-24 border border-slate-700"
                            value={circuito.tipo}
                            onChange={(e) => updateCircuito(selectedPath, circuito.id, { tipo: e.target.value })}
                          />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-700 rounded-lg">
                No hay circuitos asignados a este tablero.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
