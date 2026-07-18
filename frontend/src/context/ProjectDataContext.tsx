import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project } from '../types/project';

interface ProjectContextType {
  state: Project | null;
  lastSavedProject: Project | null;
  setState: React.Dispatch<React.SetStateAction<Project | null>>;
  setLastSaved: (p: Project) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Project | null>(null);
  const [lastSavedProject, setLastSavedProject] = useState<Project | null>(null);

  const setLastSaved = (p: Project) => setLastSavedProject(JSON.parse(JSON.stringify(p)));

  return (
    <ProjectContext.Provider value={{ state, lastSavedProject, setState, setLastSaved }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
};
