import { Project } from '../types/project';
import { BaseProjectStrategy } from './strategies/base';
import { IndustrialStrategy } from './strategies/industrial/strategy';
import { ViviendaStrategy } from './strategies/vivienda/strategy';
import { ComercialStrategy } from './strategies/comercial/strategy';

export const getProjectStrategy = (project: Project): BaseProjectStrategy => {
  switch (project.projectType) {
    case 'Industria':
      return new IndustrialStrategy();
    case 'Vivienda':
      return new ViviendaStrategy();
    case 'Oficina': // O Comercio
      return new ComercialStrategy();
    default:
      throw new Error(`Tipo de proyecto no soportado: ${project.projectType}`);
  }
};
