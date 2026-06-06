import { TABLAS_CORRIENTE_SAEA } from '../data/corrientesNormativasAdmisibles';
import { METODOS_INSTALACION } from '../data/metodosInstalacion';

export const getMetodosValidos = (
  aislacion: 'PVC' | 'XLPE' | 'Mineral',
  material: 'Cobre' | 'Aluminio',
  tipoCable: 'Multipolar' | 'Unipolar'
) => {
  // Filtramos las tablas que coinciden con los criterios técnicos
  const tablasCompatibles = TABLAS_CORRIENTE_SAEA.filter(t => 
    t.aislacion === aislacion && 
    t.material === material
  );

  // Obtenemos los códigos de métodos soportados por estas tablas
  const metodosSoportados = new Set<string>();
  tablasCompatibles.forEach(t => {
    Object.keys(t.metodosSoportados).forEach(m => metodosSoportados.add(m));
  });

  // Cruzamos con la lista maestra para obtener etiquetas y asegurar el formato
  const metodosDisponibles = METODOS_INSTALACION[tipoCable] || [];
  return metodosDisponibles.filter(m => metodosSoportados.has(m.value));
};
