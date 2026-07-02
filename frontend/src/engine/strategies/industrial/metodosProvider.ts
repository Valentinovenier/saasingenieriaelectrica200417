import { TABLAS_CORRIENTE_SAEA } from '../../../data/corrientesNormativasAdmisibles';
import { METODOS_INSTALACION } from '../../../data/metodosInstalacion';

export const getMetodosValidos = (
  aislacion: 'PVC' | 'XLPE' | 'Mineral',
  material: 'Cobre' | 'Aluminio',
  tipoCable: 'Multipolar' | 'Unipolar'
) => {
  if (aislacion === 'Mineral') {
      // Definir métodos permitidos para Mineral
      const metodosMineral: { value: string, label: string }[] = [];
      if (tipoCable === 'Unipolar') {
          metodosMineral.push(
              { value: 'C', label: 'C' },
              { value: 'F', label: 'F' },
              { value: 'G', label: 'G' }
          );
      } else { // Multipolar
          metodosMineral.push(
              { value: 'C', label: 'C' },
              { value: 'E', label: 'E' }
          );
      }
      return metodosMineral;
  }

  // Comportamiento original para PVC/XLPE
  const tablasCompatibles = TABLAS_CORRIENTE_SAEA.filter(t => 
    t.aislacion === aislacion && 
    t.material === material
  );

  const metodosSoportados = new Set<string>();
  tablasCompatibles.forEach(t => {
    Object.keys(t.metodosSoportados).forEach(m => metodosSoportados.add(m));
  });

  const metodosDisponibles = METODOS_INSTALACION[tipoCable] || [];
  return metodosDisponibles.filter(m => metodosSoportados.has(m.value));
};
