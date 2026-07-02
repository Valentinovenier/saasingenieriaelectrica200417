import { Conductor } from '../types/project';
import { useProject } from '../context/ProjectDataContext';
import { getProjectStrategy } from '../engine/factory';

interface Props {
  label: string;
  conductor?: Conductor;
  onChange: (c: Conductor) => void;
  tramoId?: string;
}

export const ConductorForm = (props: Props) => {
  const { state: project } = useProject();
  
  if (!project) return null;

  const strategy = getProjectStrategy(project);
  const FormComponent = strategy.getFormularioComponente();

  return <FormComponent {...props} />;
};
