import { Project } from '../types/project';

/**
 * Analiza el proyecto y retorna un mapa de canalización a número de circuitos.
 * Un 'circuito' aquí se define como un conductor que tiene un canalizacionId definido.
 */
export const getAgrupamientoPorCanalizacion = (project: Project): Record<string, number> => {
  const agrupamiento: Record<string, number> = {};

  // Analizar conductores definidos en project.conductores
  if (project.conductores) {
    Object.values(project.conductores).forEach(conductor => {
      if (conductor.canalizacionId) {
        agrupamiento[conductor.canalizacionId] = (agrupamiento[conductor.canalizacionId] || 0) + 1;
      }
    });
  }

  // Se podría extender analizando tableros u otros componentes en el futuro
  return agrupamiento;
};
