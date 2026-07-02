import { Project, Conductor, Canalizacion } from '../../../types/project';

/**
 * Servicio para gestionar la lógica de canalizaciones y agrupamiento de circuitos.
 */

export const getCircuitosPorCanalizacion = (project: Project, canalizacionId: string): Conductor[] => {
  if (!project.conductores) return [];
  
  return Object.values(project.conductores).filter(
    (c) => c.canalizacionId === canalizacionId
  );
};

export const calcularFactorAgrupamiento = (
  nCircuitos: number,
  canalizacion: Canalizacion
): number => {
  // Ahora el tipo de instalación depende del método del conductor, no de la canalización.
  // Se retornará 1.0 por defecto hasta que se integre la lógica de tablas normativas.
  return 1.0;
};
