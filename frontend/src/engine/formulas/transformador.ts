/**
 * Calcula la corriente nominal del transformador (Intr).
 * Fórmula: Intr = S / (sqrt(3) * Vsecundario)
 * @param potencia kVA
 * @param tensionSecundario Volts
 */
export const calcularIntr = (potenciaKVA: number, tensionSecundarioV: number): number => {
  if (!tensionSecundarioV || tensionSecundarioV === 0) return 0;
  // potenciaKVA * 1000 para pasar a VA
  return (potenciaKVA * 1000) / (Math.sqrt(3) * tensionSecundarioV);
};
