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

  // Obtener las normas únicas presentes en los circuitos de esta canalización
  // Aseguramos normalización de nombres
  const normasPresentes = Array.from(new Set(circuitosEnCanalizacion.map(c => c.normaCable || 'IRAM 2178')));

  // Reglas de convivencia entre normas (simplificación basada en exigencias térmicas/instalación)
  // Restringimos mezclas que no son recomendables:
  // 1. IRAM-NM 247-3 (cables de uso general, generalmente menores exigencias térmicas) 
  //    no debe mezclarse con cables de normas más exigentes (62266, 62267, 2178).
  
  if (normasPresentes.length > 1) {
    const normasExigentes = ['IRAM 62266', 'IRAM 62267', 'IRAM 2178'];
    const tieneNM247 = normasPresentes.includes('IRAM-NM 247-3');
    const tieneExigentes = normasPresentes.some(n => normasExigentes.includes(n));

    if (tieneNM247 && tieneExigentes) {
        errores.push("Los cables IRAM-NM 247-3 no deben compartirse en la misma canalización con cables de normas IRAM 62266, 62267 o 2178 debido a diferencias en su comportamiento térmico y exigencias de instalación.");
    }
  }

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
