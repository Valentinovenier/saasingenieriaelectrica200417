// Factores de corrección por agrupamiento (Tabla 770.12.II)
// AEA-90364-7-770

export const FACTORES_AGRUPAMIENTO_VIVIENDA = {
  // Se aplica a las intensidades de la Tabla 770.12.I (cables sin envoltura)
  // Nota: Los valores base de la tabla 770.12.I ya consideran 1 circuito
  // Si hay más circuitos, se multiplica por estos factores
  agrupamiento: {
    "2_monofasicos": { maxCircuitos: 4, factor: 0.80 },
    "3_monofasicos": { maxCircuitos: 6, factor: 0.70 },
    "2_trifasicos": { maxCircuitos: 6, factor: 0.80 },
    "3_trifasicos": { maxCircuitos: 9, factor: 0.70 },
  }
};
