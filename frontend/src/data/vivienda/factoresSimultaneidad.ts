// Datos específicos para viviendas según AEA-90364-7-770
// Factores de simultaneidad y demanda

export const FACTORES_SIMULTANEIDAD_VIVIENDA = {
  // Ejemplos simplificados, se deben completar según la norma
  cantidadCircuitos: {
    2: 1.0,
    3: 0.8,
    5: 0.7,
    6: 0.6,
  },
  tipoCarga: {
    iluminacion: 0.6,
    tomacorrientes: 0.4,
    aireAcondicionado: 0.7,
  }
};
