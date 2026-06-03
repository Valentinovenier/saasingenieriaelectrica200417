import { TransformadorCatalogo } from '../types/transformador';

export const calcularImpedanciaTransformador = (trafo: TransformadorCatalogo) => {
  const Un = trafo.tensionSecundarioV; // Voltios
  const Sn = trafo.potenciaKVA * 1000; // Volt-Amperios
  const In = Sn / (Math.sqrt(3) * Un); // Amperios
  
  // 1. Resistencia de cortocircuito: Rcc = Pcc / (3 * In^2)
  const Rcc = trafo.PccW / (3 * Math.pow(In, 2));
  
  // 2. Impedancia total: Zcc = (ucc / 100) * (Un^2 / Sn)
  const Zcc = (trafo.uccPorcentaje / 100) * (Math.pow(Un, 2) / Sn);
  
  // 3. Reactancia: Xcc = sqrt(Zcc^2 - Rcc^2)
  // Nota: si Rcc > Zcc por error en datos, la reactancia es 0
  const Xcc = Math.sqrt(Math.max(0, Math.pow(Zcc, 2) - Math.pow(Rcc, 2)));
  
  return { r: Rcc, x: Xcc };
};
