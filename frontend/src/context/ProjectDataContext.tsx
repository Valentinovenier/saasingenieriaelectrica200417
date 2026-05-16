import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProjectState, Trafo, Tablero, Carga } from '../types/project';

interface ProjectContextType {
  state: ProjectState;
  updateTrafo: (trafo: Trafo) => void;
  addTablero: (tablero: Tablero) => void;
  updateTablero: (id: string, tablero: Partial<Tablero>) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ProjectState>({
    trafo: { potenciaKVA: 630, tensionPrimaria: 13200, tensionSecundaria: 400 },
    tableros: [],
  });

  const updateTrafo = (trafo: Trafo) => setState(prev => ({ ...prev, trafo }));
  const addTablero = (tablero: Tablero) => setState(prev => ({ ...prev, tableros: [...prev.tableros, tablero] }));
  const updateTablero = (id: string, updates: Partial<Tablero>) => setState(prev => ({
    ...prev,
    tableros: prev.tableros.map(t => t.id === id ? { ...t, ...updates } : t)
  }));

  return (
    <ProjectContext.Provider value={{ state, updateTrafo, addTablero, updateTablero }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
};
