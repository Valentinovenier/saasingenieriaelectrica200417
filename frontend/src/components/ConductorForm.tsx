import { Conductor } from '../../types/project';
import { useProject } from '../../context/ProjectDataContext';
import { ViviendaConductorForm } from './conductor-forms/ViviendaConductorForm';
import { IndustrialConductorForm } from './conductor-forms/IndustrialConductorForm';

interface Props {
  label: string;
  conductor?: Conductor;
  onChange: (c: Conductor) => void;
  tramoId?: string;
}

export const ConductorForm = (props: Props) => {
  const { state: project } = useProject();
  const isVivienda = project?.projectType === 'Vivienda';

  if (isVivienda) {
    return <ViviendaConductorForm {...props} />;
  }

  return <IndustrialConductorForm {...props} />;
};
