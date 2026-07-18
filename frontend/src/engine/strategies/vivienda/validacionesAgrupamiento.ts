import { Project, Canalizacion } from '../../../types/project';

export interface ValidacionResultado {
  esValido: boolean;
  errores: string[];
}

/**
 * Valida las reglas de agrupamiento de la sección 770.10.3.8.2 de la AEA 770.
 */
export const validarAgrupamiento = (project: Project, canalizacion: Canalizacion): ValidacionResultado => {
  const errores: string[] = [];
  
  // Obtener los circuitos asignados
  const circuitosEnCanalizacion = project.datosVivienda?.circuitosCalculados?.filter(c => 
    canalizacion.circuitosIds.includes(c.id)
  ) || [];

  if (circuitosEnCanalizacion.length === 0) return { esValido: true, errores: [] };

  // Nota: Las validaciones de agrupamiento físico real requieren conocer el tipo de conductor y su sección.
  // Como estamos en una etapa de diseño PREVIA al cálculo, las reglas normativas que dependen de la sección o el agrupamiento térmico 
  // deben evaluarse después o mediante límites de diseño.

  // Ejemplo de reglas de diseño preventivas (según AEA 770):
  
  // d) Circuitos de uso general
  const tugs = circuitosEnCanalizacion.filter(c => c.tipo === 'tomacorrientes_usos_generales');
  if (tugs.length > 3) {
    errores.push("Máximo tres circuitos para usos generales por cañería.");
  }

  return {
    esValido: errores.length === 0,
    errores
  };
};
