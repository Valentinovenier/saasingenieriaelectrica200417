import { Project, Conductor, Canalizacion } from '../types/project';

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
  // Regla de negocio: Embutido o Subterráneo -> 0.8 fijo
  if (['embutido', 'subterraneo'].includes(canalizacion.tipoInstalacion.toLowerCase())) {
    return 0.8;
  }

  // Para otros métodos, se deberá implementar la búsqueda en tablas normativas.
  // Por ahora, retornamos 1.0 como valor por defecto seguro hasta integrar las tablas.
  return 1.0;
};
