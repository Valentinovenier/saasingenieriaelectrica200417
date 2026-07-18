import { Project } from '../types/project';

/**
 * Limpia las canalizaciones del proyecto eliminando referencias a circuitos
 * que ya no existen en el proyecto.
 */
export const limpiarCanalizaciones = (project: Project): Project => {
  if (!project.canalizaciones || !project.datosVivienda?.circuitosCalculados) {
    return project;
  }

  const circuitosIdsValidos = new Set(
    project.datosVivienda.circuitosCalculados.map(c => c.id)
  );

  const canalizacionesLimpias = project.canalizaciones.map(canalizacion => ({
    ...canalizacion,
    circuitosIds: canalizacion.circuitosIds.filter(id => circuitosIdsValidos.has(id))
  }));

  return {
    ...project,
    canalizaciones: canalizacionesLimpias
  };
};
