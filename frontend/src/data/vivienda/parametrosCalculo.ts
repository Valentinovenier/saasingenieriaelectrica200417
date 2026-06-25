// Parámetros de cálculo y constantes específicas para cables en viviendas
// AEA-90364-7-770

export const PARAMETROS_CALCULO_VIVIENDA = {
  // Según 770.15.6:
  // 1. Circuitos terminales, de uso general o especial, para iluminación y tomacorrientes: 3 %.
  // 2. Otros circuitos que alimentan sólo motores: 5 % en régimen y 15 % durante el arranque.
  // Nota: Se recomienda que la caída de tensión parcial en los circuitos seccionales no exceda del 1 %.
  limitesCaidaTension: {
    iluminacionTomacorrientes: 3.0,
    motoresRegimen: 5.0,
    motoresArranque: 15.0,
    recomendacionSeccionales: 1.0,
  },
  temperaturaAmbienteReferencia: 40, // ºC para aire según norma
};
