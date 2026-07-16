import React from 'react';
import { Project } from '../types/project';

interface Props {
  project: Project;
  onChange: (updatedProject: Project) => void;
}

export const CanalizacionesPage = ({ project, onChange }: Props) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Gestión de Canalizaciones</h2>
      <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-slate-700">
        <p className="text-slate-400">
          Aquí podrás gestionar las canalizaciones del proyecto. 
          Esta funcionalidad está en desarrollo.
        </p>
      </div>
    </div>
  );
};
