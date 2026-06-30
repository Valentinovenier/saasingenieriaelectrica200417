import { useState } from 'react';
import { Project, Tablero } from '../types/project';
import { ConductorForm } from './conductor-forms/ViviendaConductorForm';
import { calcularTramoResidencial } from '../engine/vivienda/calculador';

export const ResidentialTopologyEditor = ({ project, onChange }: { project: Project; onChange: (p: Project) => void }) => {
  const [selectedPath, setSelectedPath] = useState<string[]>(['root']); // Ruta para navegar el árbol

  // Función para obtener el nodo actual basado en la ruta
  const getNodeByPath = (tablero: Tablero, path: string[]): Tablero | undefined => {
    let current = tablero;
    for (let i = 1; i < path.length; i++) {
        const next = current.subTableros.find(t => t.id === path[i]);
        if (!next) return undefined;
        current = next;
    }
    return current;
  };

  const currentNode = getNodeByPath(project.tableroPrincipal, selectedPath);

  const updateNode = (path: string[], updates: Partial<Tablero>) => {
    const newProject = { ...project };
    
    // Función recursiva para actualizar un nodo en el árbol
    const updateRecursive = (node: Tablero, currentPath: string[]): Tablero => {
        if (currentPath.length === 1) {
            return { ...node, ...updates };
        }
        
        const nextId = currentPath[1];
        const nextNode = node.subTableros.find(t => t.id === nextId);
        if (!nextNode) return node;
        
        return {
            ...node,
            subTableros: node.subTableros.map(t => 
                t.id === nextId ? updateRecursive(nextNode, currentPath.slice(1)) : t
            )
        };
    };

    newProject.tableroPrincipal = updateRecursive(newProject.tableroPrincipal, path);
    onChange(newProject);
  };

  // Función para navegar
  const navigateTo = (path: string[]) => {
      setSelectedPath(path);
  };

  if (!currentNode) return <div>Error en la topología: Nodo no encontrado</div>;

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <h2 className="text-2xl font-bold text-white mb-6">Editor de Topología Residencial</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Árbol de navegación */}
        <div className="md:col-span-1 bg-slate-900 p-4 rounded-xl border border-slate-700">
          <h3 className="text-sm font-bold text-white mb-4">Estructura</h3>
          <div className="text-slate-400 text-sm">
             <button onClick={() => navigateTo(['root'])} className="hover:text-white">Raíz ({project.tableroPrincipal.nombre})</button>
             {/* Aquí se debería mapear recursivamente los subtableros */}
          </div>
        </div>

        {/* Editor del tramo seleccionado */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700">
             <h3 className="text-lg font-bold text-white mb-4">Tramo: Alimentación {currentNode.nombre}</h3>
             <ConductorForm 
                label={`Configuración: Tramo hacia ${currentNode.nombre}`}
                conductor={currentNode.conductorAlimentacion}
                onChange={(c) => updateNode(selectedPath, { conductorAlimentacion: c })}
             />
          </div>
        </div>
      </div>
    </div>
  );
};
