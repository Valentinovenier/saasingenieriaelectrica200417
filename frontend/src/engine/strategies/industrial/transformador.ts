import { TransformadorCatalogo } from '../../../types/transformador';

export const estimarParametrosTrafo = (potenciaKVA: number, tipo: 'Aceite' | 'Seco' = 'Aceite'): { uccPorcentaje: number, PccW: number } => {
  if (tipo === 'Seco') {
    if (potenciaKVA < 250) return { uccPorcentaje: 6, PccW: Math.round(potenciaKVA * 15) };
    if (potenciaKVA <= 630) return { uccPorcentaje: 6, PccW: Math.round(potenciaKVA * 11) };
    if (potenciaKVA <= 1250) return { uccPorcentaje: 6, PccW: Math.round(potenciaKVA * 9.2) };
    return { uccPorcentaje: 6, PccW: Math.round(potenciaKVA * 7.5) };
  } else {
    if (potenciaKVA <= 100) return { uccPorcentaje: 4, PccW: Math.round(potenciaKVA * 17.5) };
    if (potenciaKVA <= 315) return { uccPorcentaje: 4, PccW: Math.round(potenciaKVA * 13.5) };
    if (potenciaKVA <= 630) return { uccPorcentaje: 4, PccW: Math.round(potenciaKVA * 11.5) };
    if (potenciaKVA <= 1000) return { uccPorcentaje: 5, PccW: Math.round(potenciaKVA * 10.5) };
    return { uccPorcentaje: 6, PccW: Math.round(potenciaKVA * 9.5) };
  }
};

export const calcularImpedanciaTransformador = (trafo: {
  potencia?: number;
  potenciaKVA?: number;
  tensionSecundario?: number;
  tensionSecundarioV?: number;
  uccPorcentaje?: number;
  PccW?: number;
  tipo?: 'Aceite' | 'Seco';
}) => {
  const potenciaVal = trafo.potenciaKVA || trafo.potencia || 0;
  const tensionSecVal = trafo.tensionSecundarioV || trafo.tensionSecundario || 400;
  const tipoVal = trafo.tipo || 'Aceite';

  if (potenciaVal <= 0 || tensionSecVal <= 0) {
    return { r: 0, x: 0, z: 0 };
  }

  // Estimar si no se definieron uccPorcentaje o PccW
  let ucc = trafo.uccPorcentaje;
  let pcc = trafo.PccW;

  if (ucc === undefined || ucc === null || ucc <= 0 || pcc === undefined || pcc === null || pcc <= 0) {
    const estimacion = estimarParametrosTrafo(potenciaVal, tipoVal);
    if (ucc === undefined || ucc === null || ucc <= 0) ucc = estimacion.uccPorcentaje;
    if (pcc === undefined || pcc === null || pcc <= 0) pcc = estimacion.PccW;
  }

  const Sn = potenciaVal * 1000; // VA
  const In = Sn / (Math.sqrt(3) * tensionSecVal); // A
  
  // 1. Resistencia de cortocircuito: Rcc = Pcc / (3 * In^2)
  const Rcc = pcc / (3 * Math.pow(In, 2));
  
  // 2. Impedancia total: Zcc = (ucc / 100) * (Un^2 / Sn)
  const Zcc = (ucc / 100) * (Math.pow(tensionSecVal, 2) / Sn);
  
  // 3. Reactancia: Xcc = sqrt(Zcc^2 - Rcc^2)
  const Xcc = Math.sqrt(Math.max(0, Math.pow(Zcc, 2) - Math.pow(Rcc, 2)));
  
  return { r: Rcc, x: Xcc, z: Zcc };
};

