import { Project, CondicionesTramo } from '../../../types/project';
import { BaseProjectStrategy } from '../base';
import { calcularTramoResidencial } from './calculador';
import { ViviendaWorkflow } from '../../../features/vivienda/ViviendaWorkflow';
import { ViviendaReport } from '../../../features/vivienda/ViviendaReport';
import { CondicionesTramoResidencial, TipoCircuito } from '../../../types/vivienda';

export class ViviendaStrategy implements BaseProjectStrategy {
  calcularTramo(condiciones: CondicionesTramo, project: Project): any {
    const condicionesRes: CondicionesTramoResidencial = {
        ...condiciones,
        tipoCircuito: condiciones.tipoCircuito as TipoCircuito,
        metodoInstalacion: (condiciones.metodoInstalacion === 'sinEnvoltura' ? 'sinEnvoltura' : 'B2') as 'B2' | 'D1' | 'D2' | 'sinEnvoltura' // Adaptación simple
    };
    return calcularTramoResidencial(condicionesRes, project);
  }

  validarReglas(project: Project): boolean {
    return true;
  }

  getFormularioComponente(): React.ComponentType<any> {
    return ViviendaWorkflow;
  }

  getInformeComponente(): React.ComponentType<{ project: Project }> {
    return ViviendaReport;
  }
}
