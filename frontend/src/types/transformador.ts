export interface TransformadorCatalogo {
  id: string;
  tipo: 'Aceite' | 'Seco';
  potenciaKVA: number;
  tensionPrimarioKV: number;
  tensionSecundarioV: number;
  uccPorcentaje: number; // Ucc (%)
  PccW: number; // Potencia de cortocircuito (W)
}
