import { Project } from '../../types/project';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export const ViviendaSettings = ({ project, onChange }: Props) => {
  return (
    <div className="p-6 bg-[var(--bg-primary)] rounded-xl border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Configuración de Vivienda</h3>
      <p className="text-slate-400">Configuración específica para proyectos de vivienda simplificada.</p>
      {/* Aquí irán los parámetros específicos de vivienda */}
    </div>
  );
};
