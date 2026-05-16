import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project } from './project';

interface ProjectContextType {
  state: Project | null;
  setState: React.Dispatch<React.SetStateAction<Project | null>>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Project | null>(null);

  return (
    <ProjectContext.Provider value={{ state, setState }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
};
