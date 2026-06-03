import { TransformadorCatalogo } from '../types/transformador';

// Catálogo de transformadores secos (Clase F)
export const transformadoresSecos: TransformadorCatalogo[] = [
  // Relación 13.2 / 0.4 kV
  { id: 'seco-13-250', tipo: 'Seco', potenciaKVA: 250, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 3300 },
  { id: 'seco-13-315', tipo: 'Seco', potenciaKVA: 315, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 4000 },
  { id: 'seco-13-400', tipo: 'Seco', potenciaKVA: 400, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 4800 },
  { id: 'seco-13-500', tipo: 'Seco', potenciaKVA: 500, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 5900 },
  { id: 'seco-13-630', tipo: 'Seco', potenciaKVA: 630, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 6800 },
  { id: 'seco-13-800', tipo: 'Seco', potenciaKVA: 800, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 8000 },
  { id: 'seco-13-1000', tipo: 'Seco', potenciaKVA: 1000, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 9400 },
  { id: 'seco-13-1250', tipo: 'Seco', potenciaKVA: 1250, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 11500 },
  { id: 'seco-13-1600', tipo: 'Seco', potenciaKVA: 1600, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 13500 },
  { id: 'seco-13-2000', tipo: 'Seco', potenciaKVA: 2000, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 16000 },
  { id: 'seco-13-2500', tipo: 'Seco', potenciaKVA: 2500, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 18000 },

  // Relación 33 / 0.4 kV
  { id: 'seco-33-315', tipo: 'Seco', potenciaKVA: 315, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 4000 },
  { id: 'seco-33-400', tipo: 'Seco', potenciaKVA: 400, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 4800 },
  { id: 'seco-33-500', tipo: 'Seco', potenciaKVA: 500, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 5900 },
  { id: 'seco-33-630', tipo: 'Seco', potenciaKVA: 630, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 6800 },
  { id: 'seco-33-800', tipo: 'Seco', potenciaKVA: 800, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 8000 },
  { id: 'seco-33-1000', tipo: 'Seco', potenciaKVA: 1000, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 9400 },
  { id: 'seco-33-1250', tipo: 'Seco', potenciaKVA: 1250, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 11500 },
  { id: 'seco-33-1600', tipo: 'Seco', potenciaKVA: 1600, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 13500 },
  { id: 'seco-33-2000', tipo: 'Seco', potenciaKVA: 2000, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 16000 },
  { id: 'seco-33-2500', tipo: 'Seco', potenciaKVA: 2500, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 6, PccW: 18000 },
];
