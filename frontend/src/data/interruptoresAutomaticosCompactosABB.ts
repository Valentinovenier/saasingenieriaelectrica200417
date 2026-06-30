import { InterruptorAutomáticoCompacto } from '../types/protecciones';

// Catálogo de interruptores automáticos compactos (MCCB) ABB (SACE Tmax XT)
export const interruptoresAutomaticosCompactosABB: InterruptorAutomáticoCompacto[] = [
  // XT1 (hasta 160A)
  { id: 'abb-xt1b-16', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT1B 16', In: 16, Icu: 18 },
  { id: 'abb-xt1b-32', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT1B 32', In: 32, Icu: 18 },
  { id: 'abb-xt1b-63', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT1B 63', In: 63, Icu: 18 },
  { id: 'abb-xt1b-100', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT1B 100', In: 100, Icu: 18 },
  { id: 'abb-xt1b-125', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT1B 125', In: 125, Icu: 18 },
  { id: 'abb-xt1b-160', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT1B 160', In: 160, Icu: 18 },

  // XT2 (hasta 160A, mayor poder de corte)
  { id: 'abb-xt2n-125', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT2N 125', In: 125, Icu: 36 },
  { id: 'abb-xt2n-160', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT2N 160', In: 160, Icu: 36 },
  { id: 'abb-xt2s-160', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT2S 160', In: 160, Icu: 50 },

  // XT3 (hasta 250A)
  { id: 'abb-xt3n-200', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT3N 200', In: 200, Icu: 36 },
  { id: 'abb-xt3n-250', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT3N 250', In: 250, Icu: 36 },

  // XT4 (hasta 250A, mayor poder de corte)
  { id: 'abb-xt4n-250', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT4N 250', In: 250, Icu: 36 },
  { id: 'abb-xt4s-250', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT4S 250', In: 250, Icu: 50 },
  { id: 'abb-xt4h-250', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT4H 250', In: 250, Icu: 70 },

  // XT5 (hasta 400A / 630A)
  { id: 'abb-xt5n-400', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT5N 400', In: 400, Icu: 36 },
  { id: 'abb-xt5s-400', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT5S 400', In: 400, Icu: 50 },
  { id: 'abb-xt5n-630', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT5N 630', In: 630, Icu: 36 },
  { id: 'abb-xt5s-630', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT5S 630', In: 630, Icu: 50 },

  // XT6 (hasta 800A / 1000A)
  { id: 'abb-xt6n-800', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT6N 800', In: 800, Icu: 36 },
  { id: 'abb-xt6s-800', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT6S 800', In: 800, Icu: 50 },
  { id: 'abb-xt6n-1000', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT6N 1000', In: 1000, Icu: 36 },

  // XT7 (hasta 1600A)
  { id: 'abb-xt7s-1250', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT7S 1250', In: 1250, Icu: 50 },
  { id: 'abb-xt7s-1600', marca: 'ABB', serie: 'Tmax XT', modelo: 'XT7S 1600', In: 1600, Icu: 50 }
];
