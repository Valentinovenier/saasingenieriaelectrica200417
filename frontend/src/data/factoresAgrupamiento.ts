// frontend/src/data/factoresAgrupamiento.ts

// Factores de corrección para agrupamientos (Tabla B52-17)
export const FACTORES_AGRUPAMIENTO_B52_17: Record<number, number[]> = {
  // Item: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 16, 20] circuitos
  1: [1.00, 0.80, 0.70, 0.65, 0.60, 0.57, 0.54, 0.52, 0.50, 0.45, 0.41, 0.38],
  2: [1.00, 0.85, 0.79, 0.75, 0.73, 0.72, 0.72, 0.71, 0.70],
  3: [0.95, 0.81, 0.72, 0.68, 0.66, 0.64, 0.63, 0.62, 0.61],
  4: [1.00, 0.88, 0.82, 0.77, 0.75, 0.73, 0.73, 0.72, 0.72],
  5: [1.00, 0.87, 0.82, 0.80, 0.80, 0.79, 0.79, 0.78, 0.78]
};

// Factores por resistividad térmica del terreno (Tabla B52-16)
export const FACTORES_RESISTIVIDAD_TERRENO: Record<string, Record<number, number>> = {
  "ducto_enterrado": { 0.5: 1.08, 0.8: 1.02, 1.0: 1.00, 1.5: 0.93, 2.0: 0.89, 2.5: 0.85, 3.0: 0.81 },
  "directamente_enterrado": { 0.5: 1.25, 0.8: 1.08, 1.0: 1.00, 1.5: 0.85, 2.0: 0.75, 2.5: 0.67, 3.0: 0.60 }
};

// Tabla B52-18: Agrupamiento cables directamente enterrados (D2)
export const FACTORES_AGRUPAMIENTO_B52_18: Record<number, Record<string, number>> = {
  2: { "en_contacto": 0.75, "sep_un_diam": 0.80, "sep_0.125": 0.85, "sep_0.25": 0.90, "sep_0.5": 0.90 },
  3: { "en_contacto": 0.65, "sep_un_diam": 0.70, "sep_0.125": 0.75, "sep_0.25": 0.80, "sep_0.5": 0.85 },
  4: { "en_contacto": 0.60, "sep_un_diam": 0.60, "sep_0.125": 0.70, "sep_0.25": 0.75, "sep_0.5": 0.80 },
  5: { "en_contacto": 0.55, "sep_un_diam": 0.55, "sep_0.125": 0.65, "sep_0.25": 0.70, "sep_0.5": 0.80 },
  6: { "en_contacto": 0.50, "sep_un_diam": 0.55, "sep_0.125": 0.60, "sep_0.25": 0.70, "sep_0.5": 0.80 }
};

// Tabla B52-19: Agrupamiento cables en caños enterrados (D1)
export const FACTORES_AGRUPAMIENTO_B52_19: Record<number, Record<string, number>> = {
  2: { "en_contacto": 0.85, "sep_0.25": 0.90, "sep_0.5": 0.95, "sep_1.0": 0.95 },
  3: { "en_contacto": 0.75, "sep_0.25": 0.85, "sep_0.5": 0.90, "sep_1.0": 0.95 },
  4: { "en_contacto": 0.70, "sep_0.25": 0.80, "sep_0.5": 0.85, "sep_1.0": 0.90 },
  5: { "en_contacto": 0.65, "sep_0.25": 0.80, "sep_0.5": 0.85, "sep_1.0": 0.90 },
  6: { "en_contacto": 0.60, "sep_0.25": 0.80, "sep_0.5": 0.80, "sep_1.0": 0.90 }
};

// Tabla B52-20: Agrupamiento cables en aire sobre bandejas (Método E)
// Estructura simplificada: [nBandejas][nCircuitos]
export const FACTORES_AGRUPAMIENTO_B52_20: number[][] = [
  [1.00, 0.88, 0.82, 0.79, 0.76, 0.73], // 1 bandeja
  [1.00, 0.87, 0.80, 0.77, 0.73, 0.68], // 2 bandejas
  [1.00, 0.86, 0.79, 0.76, 0.71, 0.66], // 3 bandejas
  [1.00, 0.84, 0.77, 0.73, 0.68, 0.64]  // 6 bandejas
];

// Tabla B52-21: Agrupamiento cables unipolares (Método F)
export const FACTORES_AGRUPAMIENTO_B52_21: Record<number, number[]> = {
  // [1, 2, 3] circuitos trifásicos
  1: [0.98, 0.91, 0.87], 
  2: [0.96, 0.87, 0.81],
  3: [0.95, 0.85, 0.78]
};
