// frontend/src/engine/constantes.ts

// Constantes K para cálculo de soportabilidad térmica al cortocircuito
// Smin >= Ik * sqrt(t) / K
// Fuente: AEA 90364 Parte 5, Tabla B52-1
export const K_VALUES: Record<string, Record<string, number>> = {
  "PVC": { "Cobre": 115, "Aluminio": 76 },
  "XLPE": { "Cobre": 143, "Aluminio": 94 },
  "Mineral": { "Cobre": 135, "Aluminio": 93 },       // Mineral a 70°C
  "Mineral_105": { "Cobre": 170, "Aluminio": 116 }    // Mineral a 105°C
};
