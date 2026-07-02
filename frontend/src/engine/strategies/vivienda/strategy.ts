import { Project, CondicionesTramo } from '../../../types/project';
import { BaseProjectStrategy } from '../base';
import { calcularTramoResidencial } from './calculador';
import { ViviendaConductorForm } from '../../../components/conductor-forms/ViviendaConductorForm';
import { ViviendaReport } from '../../../components/reports/ViviendaReport';

export class ViviendaStrategy implements BaseProjectStrategy {
  calcularTramo(condiciones: CondicionesTramo): any {
    return calcularTramoResidencial(condiciones);
  }

  validarReglas(project: Project): boolean {
    return true;
  }

  getFormularioComponente(): React.ComponentType<any> {
    return ViviendaConductorForm;
  }

  getInformeComponente(): React.ComponentType<{ project: Project }> {
    return ViviendaReport;
  }
}
