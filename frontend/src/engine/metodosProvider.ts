import { TABLAS_CORRIENTE_SAEA } from '../data/corrientesNormativasAdmisibles';
import { METODOS_INSTALACION } from '../data/metodosInstalacion';

export const getMetodosValidos = (
  aislacion: 'PVC' | 'XLPE' | 'Mineral',
  material: 'Cobre' | 'Aluminio'
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
    // También añadir métodos que puedan estar en los datos pero no explicitados en metodosSoportados
    Object.values(t.datos).forEach(seccionData => {
        Object.keys(seccionData).forEach(m => metodosSoportados.add(m.replace('metodo', '')));
    });
  });

  return METODOS_INSTALACION.filter(m => metodosSoportados.has(m.value));
};
