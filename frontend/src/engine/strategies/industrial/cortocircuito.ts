import { calcularImpedanciaTransformador } from './transformador';
import { calcularImpedanciaCable, calcularImpedanciaTotal } from './impedancia';

// Función para calcular Ik y Ipico en bornes del interruptor
export const calcularParametrosCortocircuito = (
  trafo: { 
    tensionSecundarioV?: number; 
    tensionSecundario?: number; 
    potenciaKVA?: number; 
    potencia?: number; 
    uccPorcentaje?: number; 
    PccW?: number; 
    tipo?: 'Aceite' | 'Seco'; 
  },
  cable: { seccion: number, longitudKm: number, aislacion: 'PVC' | 'XLPE', configuracion: any },
  chi: number, // Relación R/X (para cálculo de Ipico)
  tipoInstalacion?: 'Trifásica' | 'Monofásica'
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
  
  // 4. Ik:
  // En Trifásica: Ik = U / (|Z| * sqrt(3))
  // En Monofásica: Ik = U / (2 * |Z|)
  const Un = trafo.tensionSecundarioV || trafo.tensionSecundario || 380;

  const esTri = tipoInstalacion !== 'Monofásica';
  const Ik = esTri ? Un / (Z * Math.sqrt(3)) : Un / (2 * Z);

  // 5. Ipico = sqrt(2) * chi * Ik
  const Ipico = Math.sqrt(2) * chi * Ik;

  return { Ik, Ipico };
};
