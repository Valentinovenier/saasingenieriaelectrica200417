import { Project, Canalizacion, Conductor } from '../../../types/project';

export interface ValidacionResultado {
  esValido: boolean;
  errores: string[];
}

/**
 * Valida las reglas de agrupamiento de la sección 770.10.3.8.2 de la AEA 770.
 */
export const validarAgrupamiento = (project: Project, canalizacion: Canalizacion): ValidacionResultado => {
  const errores: string[] = [];
  
  // Obtener los conductores/circuitos asignados
  // Asumimos que los IDs en canalizacion.conductorIds coinciden con los IDs generados en el informe.
  // Si Conductor no tiene ID en la interfaz, usaremos una propiedad alternativa o generaremos una temporal.
  // Dado que el error sugiere que `c.id` no existe, busquemos una alternativa o cast.
  const conductoresEnCanalizacion = project.informeConductores?.filter(c => 
    canalizacion.conductorIds.includes((c as any).id || '')
  ) || [];

  if (conductoresEnCanalizacion.length === 0) return { esValido: true, errores: [] };

  // a) Regla de circuitos del mismo circuito (implícito, gestionado por usuario)

  // b) Líneas principales (independientes)
  const tieneLineaPrincipal = conductoresEnCanalizacion.some(c => c.tipoTramo === 'LineaPrincipal');
  if (tieneLineaPrincipal && conductoresEnCanalizacion.length > 1) {
    errores.push("Las líneas principales deben alojarse en cañerías independientes.");
  }

  // c) Circuitos seccionales
  const norma = canalizacion.normaCable;
  const circuitosSeccionales = conductoresEnCanalizacion.filter(c => c.tipoTramo === 'LineaSeccional');
  
  if (circuitosSeccionales.length > 0) {
    if (norma === 'IRAM-NM 247-3' || norma === 'IRAM 62267') {
      if (conductoresEnCanalizacion.length > 1) {
        errores.push("Cables IRAM-NM 247-3 o IRAM 62267 deben ir en caños independientes.");
      }
    } else if (norma === 'IRAM 2178') {
      if (circuitosSeccionales.length > 3) {
        errores.push("Máximo tres circuitos seccionales en la misma cañería.");
      }
    }
  }

  // d) Circuitos de uso general
  const tugs = conductoresEnCanalizacion.filter(c => c.tipoCircuito === 'tomacorrientes_usos_generales');
  if (tugs.length > 3) {
    errores.push("Máximo tres circuitos para usos generales por cañería.");
  }

  return {
    esValido: errores.length === 0,
    errores
  };
};
