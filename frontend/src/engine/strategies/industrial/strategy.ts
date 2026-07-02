import { Project, CondicionesTramo } from '../../../types/project';
import { BaseProjectStrategy } from '../base';
import { calcularConductorTramo } from './calculadorTramo';
import { IndustrialConductorForm } from '../../../components/conductor-forms/IndustrialConductorForm';

export class IndustrialStrategy implements BaseProjectStrategy {
  calcularTramo(condiciones: CondicionesTramo): any {
    return calcularConductorTramo(condiciones, 0, 0, 0, 0, 0, 0, [], 0, false);
  }

  validarReglas(project: Project): boolean {
    return true;
  }

  getFormularioComponente(): React.ComponentType<any> {
    return IndustrialConductorForm;
  }
}
