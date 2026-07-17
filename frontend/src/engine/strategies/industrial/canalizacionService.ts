import { Project, Conductor, Canalizacion } from '../../../types/project';

/**
 * Servicio para gestionar la lógica de canalizaciones y agrupamiento de circuitos.
 */

export const getCircuitosPorCanalizacion = (project: Project, canalizacionId: string): Conductor[] => {
  // Buscamos la canalización
  const canalizacion = project.canalizaciones?.find(c => c.id === canalizacionId);
  if (!canalizacion) return [];
  
  // Obtenemos los conductores que están en el informe y que figuran en el conductorIds de esta canalización
  return (project.informeConductores || []).filter(
    (c: any) => canalizacion.conductorIds.includes(c.id)
  );
};

export const calcularFactorAgrupamiento = (
  nCircuitos: number,
  canalizacion?: Canalizacion
): number => {
  // Según Tabla 770.12.II:
  // 1 circuito: 1.0
  // 2 circuitos: 0.8
  // 3 circuitos: 0.7
  // >3 circuitos: No permitido por norma (debería validarse antes)

  if (nCircuitos <= 1) return 1.0;
  if (nCircuitos === 2) return 0.8;
  if (nCircuitos === 3) return 0.7;
  
  return 0.7; // Factor conservador si supera los permitidos, aunque la validación debería evitarlo
};
