import { calcularImpedanciaTransformador } from './transformador';
import { calcularImpedanciaCable, calcularImpedanciaTotal } from './impedancia';
import { TransformadorCatalogo } from '../types/transformador';

// Función para calcular Ik y Ipico en bornes del interruptor
export const calcularParametrosCortocircuito = (
  trafo: TransformadorCatalogo,
  cable: { seccion: number, longitudKm: number, aislacion: 'PVC' | 'XLPE', configuracion: any },
  chi: number // Relación R/X (para cálculo de Ipico)
) => {
  // 1. Obtener impedancias complejas
  const zTrafo = calcularImpedanciaTransformador(trafo);
  const zCable = calcularImpedanciaCable(
    cable.seccion, 
    cable.longitudKm, 
    cable.aislacion, 
    cable.configuracion
  );

  // 2. Sumar impedancias (vectorialmente: R+R, X+X)
  const zTotal = calcularImpedanciaTotal(zTrafo, zCable);
  
  // 3. Módulo de Z total: |Z| = sqrt(R^2 + X^2)
  const Z = Math.sqrt(Math.pow(zTotal.r, 2) + Math.pow(zTotal.x, 2));
  
  // 4. Ik = U / (|Z| * sqrt(3))
  const Un = trafo.tensionSecundarioV;
  const Ik = Un / (Z * Math.sqrt(3));

  // 5. Ipico = sqrt(2) * chi * Ik
  const Ipico = Math.sqrt(2) * chi * Ik;

  return { Ik, Ipico };
};
