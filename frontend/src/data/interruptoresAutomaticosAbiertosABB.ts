import { InterruptorAutomáticoAbierto } from '../types/protecciones';

// Catálogo de interruptores abiertos ABB (SACE Emax 2)
export const interruptoresAutomaticosAbiertosABB: InterruptorAutomáticoAbierto[] = [
  // E1.2
  { id: 'abb-e1.2-b-06', marca: 'ABB', serie: 'Emax 2', modelo: 'E1.2 B 630', In: 630, Icu: 42, Icw: 42, Icm: 88 },
  { id: 'abb-e1.2-b-08', marca: 'ABB', serie: 'Emax 2', modelo: 'E1.2 B 800', In: 800, Icu: 42, Icw: 42, Icm: 88 },
  { id: 'abb-e1.2-c-10', marca: 'ABB', serie: 'Emax 2', modelo: 'E1.2 C 1000', In: 1000, Icu: 50, Icw: 42, Icm: 105 },
  { id: 'abb-e1.2-n-12', marca: 'ABB', serie: 'Emax 2', modelo: 'E1.2 N 1250', In: 1250, Icu: 66, Icw: 50, Icm: 145 },
  { id: 'abb-e1.2-n-16', marca: 'ABB', serie: 'Emax 2', modelo: 'E1.2 N 1600', In: 1600, Icu: 66, Icw: 50, Icm: 145 },

  // E2.2
  { id: 'abb-e2.2-b-16', marca: 'ABB', serie: 'Emax 2', modelo: 'E2.2 B 1600', In: 1600, Icu: 42, Icw: 42, Icm: 88 },
  { id: 'abb-e2.2-n-20', marca: 'ABB', serie: 'Emax 2', modelo: 'E2.2 N 2000', In: 2000, Icu: 66, Icw: 66, Icm: 145 },

  // E4.2
  { id: 'abb-e4.2-n-32', marca: 'ABB', serie: 'Emax 2', modelo: 'E4.2 N 3200', In: 3200, Icu: 66, Icw: 66, Icm: 145 },
  { id: 'abb-e4.2-h-40', marca: 'ABB', serie: 'Emax 2', modelo: 'E4.2 H 4000', In: 4000, Icu: 85, Icw: 85, Icm: 187 },

  // E6.2
  { id: 'abb-e6.2-h-40', marca: 'ABB', serie: 'Emax 2', modelo: 'E6.2 H 4000', In: 4000, Icu: 100, Icw: 100, Icm: 220 },
  { id: 'abb-e6.2-h-50', marca: 'ABB', serie: 'Emax 2', modelo: 'E6.2 H 5000', In: 5000, Icu: 100, Icw: 100, Icm: 220 },
  { id: 'abb-e6.2-h-63', marca: 'ABB', serie: 'Emax 2', modelo: 'E6.2 H 6300', In: 6300, Icu: 100, Icw: 100, Icm: 220 },
];
