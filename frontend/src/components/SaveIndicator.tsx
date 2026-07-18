import { Project } from '../types/project';

export const SaveIndicator = ({ project, lastSaved }: { project: Project | null, lastSaved: Project | null }) => {
  if (!project) return null;
  
  const isDirty = JSON.stringify(project) !== JSON.stringify(lastSaved);
  
  return (
    <div className={`text-xs font-bold px-2 py-1 rounded ${isDirty ? 'text-amber-500 bg-amber-950/30' : 'text-emerald-500 bg-emerald-950/30'}`}>
        {isDirty ? '● Cambios pendientes' : '✓ Guardado'}
    </div>
  );
};
