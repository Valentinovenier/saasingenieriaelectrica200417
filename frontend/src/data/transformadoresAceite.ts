import { TransformadorCatalogo } from '../types/transformador';

// Catálogo de transformadores en aceite (IRAM 2250)
export const transformadoresAceite: TransformadorCatalogo[] = [
  // Relación 13.2 / 0.4 kV
  { id: 'aceite-13-25', tipo: 'Aceite', potenciaKVA: 25, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 600 },
  { id: 'aceite-13-40', tipo: 'Aceite', potenciaKVA: 40, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 900 },
  { id: 'aceite-13-63', tipo: 'Aceite', potenciaKVA: 63, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 1350 },
  { id: 'aceite-13-80', tipo: 'Aceite', potenciaKVA: 80, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 1500 },
  { id: 'aceite-13-100', tipo: 'Aceite', potenciaKVA: 100, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 1750 },
  { id: 'aceite-13-125', tipo: 'Aceite', potenciaKVA: 125, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 2100 },
  { id: 'aceite-13-160', tipo: 'Aceite', potenciaKVA: 160, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 2500 },
  { id: 'aceite-13-200', tipo: 'Aceite', potenciaKVA: 200, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 3000 },
  { id: 'aceite-13-250', tipo: 'Aceite', potenciaKVA: 250, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 3500 },
  { id: 'aceite-13-315', tipo: 'Aceite', potenciaKVA: 315, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 4250 },
  { id: 'aceite-13-400', tipo: 'Aceite', potenciaKVA: 400, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 5200 },
  { id: 'aceite-13-500', tipo: 'Aceite', potenciaKVA: 500, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 6000 },
  { id: 'aceite-13-630', tipo: 'Aceite', potenciaKVA: 630, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 7250 },
  { id: 'aceite-13-800', tipo: 'Aceite', potenciaKVA: 800, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 5, PccW: 8750 },
  { id: 'aceite-13-1000', tipo: 'Aceite', potenciaKVA: 1000, tensionPrimarioKV: 13.2, tensionSecundarioV: 400, uccPorcentaje: 5, PccW: 10500 },

  // Relación 33 / 0.4 kV
  { id: 'aceite-33-16', tipo: 'Aceite', potenciaKVA: 16, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 480 },
  { id: 'aceite-33-25', tipo: 'Aceite', potenciaKVA: 25, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 650 },
  { id: 'aceite-33-40', tipo: 'Aceite', potenciaKVA: 40, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 900 },
  { id: 'aceite-33-63', tipo: 'Aceite', potenciaKVA: 63, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 1500 },
  { id: 'aceite-33-80', tipo: 'Aceite', potenciaKVA: 80, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 1600 },
  { id: 'aceite-33-100', tipo: 'Aceite', potenciaKVA: 100, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 1900 },
  { id: 'aceite-33-125', tipo: 'Aceite', potenciaKVA: 125, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 2300 },
  { id: 'aceite-33-160', tipo: 'Aceite', potenciaKVA: 160, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 2800 },
  { id: 'aceite-33-200', tipo: 'Aceite', potenciaKVA: 200, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 3250 },
  { id: 'aceite-33-250', tipo: 'Aceite', potenciaKVA: 250, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 4000 },
  { id: 'aceite-33-315', tipo: 'Aceite', potenciaKVA: 315, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 4800 },
  { id: 'aceite-33-400', tipo: 'Aceite', potenciaKVA: 400, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 5750 },
  { id: 'aceite-33-500', tipo: 'Aceite', potenciaKVA: 500, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 6400 },
  { id: 'aceite-33-630', tipo: 'Aceite', potenciaKVA: 630, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 4, PccW: 7500 },
  { id: 'aceite-33-800', tipo: 'Aceite', potenciaKVA: 800, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 5, PccW: 9800 },
  { id: 'aceite-33-1000', tipo: 'Aceite', potenciaKVA: 1000, tensionPrimarioKV: 33.0, tensionSecundarioV: 400, uccPorcentaje: 5, PccW: 11700 },
];
