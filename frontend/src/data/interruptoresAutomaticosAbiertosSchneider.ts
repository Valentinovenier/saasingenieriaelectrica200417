import { InterruptorAutomáticoAbierto } from '../types/protecciones';

// Catálogo completo basado en Masterpact MTZ1, MTZ2 y MTZ3 (Schneider)
export const interruptoresAutomaticosAbiertosSchneider: InterruptorAutomáticoAbierto[] = [
  // MTZ1 06 a 16
  { id: 'sch-mtz1-06-h1', marca: 'Schneider', serie: 'Masterpact MTZ1', modelo: 'MTZ1 06 H1', In: 630, Icu: 42, Icw: 42, Icm: 88 },
  { id: 'sch-mtz1-08-h2', marca: 'Schneider', serie: 'Masterpact MTZ1', modelo: 'MTZ1 08 H2', In: 800, Icu: 50, Icw: 50, Icm: 105 },
  { id: 'sch-mtz1-10-h3', marca: 'Schneider', serie: 'Masterpact MTZ1', modelo: 'MTZ1 10 H3', In: 1000, Icu: 66, Icw: 50, Icm: 145 },
  { id: 'sch-mtz1-12-h1', marca: 'Schneider', serie: 'Masterpact MTZ1', modelo: 'MTZ1 12 H1', In: 1250, Icu: 42, Icw: 42, Icm: 88 },
  { id: 'sch-mtz1-16-h3', marca: 'Schneider', serie: 'Masterpact MTZ1', modelo: 'MTZ1 16 H3', In: 1600, Icu: 66, Icw: 42, Icm: 145 },

  // MTZ2 08 a 20
  { id: 'sch-mtz2-08-h1', marca: 'Schneider', serie: 'Masterpact MTZ2', modelo: 'MTZ2 08 H1', In: 800, Icu: 42, Icw: 42, Icm: 88 },
  { id: 'sch-mtz2-10-h2', marca: 'Schneider', serie: 'Masterpact MTZ2', modelo: 'MTZ2 10 H2', In: 1000, Icu: 66, Icw: 50, Icm: 145 },
  { id: 'sch-mtz2-12-h2', marca: 'Schneider', serie: 'Masterpact MTZ2', modelo: 'MTZ2 12 H2', In: 1250, Icu: 66, Icw: 50, Icm: 145 },
  { id: 'sch-mtz2-16-h2', marca: 'Schneider', serie: 'Masterpact MTZ2', modelo: 'MTZ2 16 H2', In: 1600, Icu: 66, Icw: 50, Icm: 145 },
  { id: 'sch-mtz2-20-h2', marca: 'Schneider', serie: 'Masterpact MTZ2', modelo: 'MTZ2 20 H2', In: 2000, Icu: 66, Icw: 50, Icm: 145 },

  // MTZ2 25 a 40
  { id: 'sch-mtz2-25-h2', marca: 'Schneider', serie: 'Masterpact MTZ2', modelo: 'MTZ2 25 H2', In: 2500, Icu: 66, Icw: 66, Icm: 145 },
  { id: 'sch-mtz2-32-h2', marca: 'Schneider', serie: 'Masterpact MTZ2', modelo: 'MTZ2 32 H2', In: 3200, Icu: 66, Icw: 66, Icm: 145 },
  { id: 'sch-mtz2-40-h2', marca: 'Schneider', serie: 'Masterpact MTZ2', modelo: 'MTZ2 40 H2', In: 4000, Icu: 66, Icw: 66, Icm: 145 },

  // MTZ3 40 a 63
  { id: 'sch-mtz3-40-h2', marca: 'Schneider', serie: 'Masterpact MTZ3', modelo: 'MTZ3 40 H2', In: 4000, Icu: 100, Icw: 100, Icm: 220 },
  { id: 'sch-mtz3-50-h2', marca: 'Schneider', serie: 'Masterpact MTZ3', modelo: 'MTZ3 50 H2', In: 5000, Icu: 100, Icw: 100, Icm: 220 },
  { id: 'sch-mtz3-63-h2', marca: 'Schneider', serie: 'Masterpact MTZ3', modelo: 'MTZ3 63 H2', In: 6300, Icu: 100, Icw: 100, Icm: 220 },
];
