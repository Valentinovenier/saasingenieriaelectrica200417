import { Conductor, Project } from '../../../types/project';
import { CondicionesTramoResidencial, TipoCircuito } from '../../../types/vivienda';

export const adaptarConductorACondiciones = (
  conductor: Conductor,
  project: Project
): CondicionesTramoResidencial => {
  const canalizacion = project.canalizaciones?.find(c => c.id === conductor.canalizacionId);
  const normaCable = canalizacion?.normaCable || conductor.normaCable || 'IRAM 2178';

  return {
    tipoTramo: conductor.tipoTramo as 'LineaPrincipal' | 'LineaSeccional' | 'CircuitoTerminal',
    tipoCircuito: (conductor.tipoCircuito as TipoCircuito) || 'iluminacion_usos_generales',
    metodoInstalacion: conductor.metodoInstalacion || 'B1',
    longitudMetros: conductor.longitud || 0,
    corrienteDiseñoAmperes: 16, // Deberíamos obtener este valor del proyecto o conductor
    temperaturaAmbiente: project.tempAmbiente || 30,
    canalizacionId: conductor.canalizacionId,
    tempSuelo: conductor.tempSuelo,
    resistividadTermica: conductor.resistividadTermica,
    separacionBordes: conductor.separacionBordes,
    normaCable: normaCable as any
  };
};
