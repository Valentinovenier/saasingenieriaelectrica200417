import { InterruptorAutomáticoCompacto } from '../types/protecciones';

// Catálogo de interruptores automáticos compactos (MCCB) Schneider Electric (Compact NSX / NS)
export const interruptoresAutomaticosCompactosSchneider: InterruptorAutomáticoCompacto[] = [
  // NSX100 (hasta 100A)
  { id: 'sch-nsx100f-16', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX100F 16', In: 16, Icu: 36 },
  { id: 'sch-nsx100f-32', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX100F 32', In: 32, Icu: 36 },
  { id: 'sch-nsx100f-63', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX100F 63', In: 63, Icu: 36 },
  { id: 'sch-nsx100f-100', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX100F 100', In: 100, Icu: 36 },
  { id: 'sch-nsx100n-100', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX100N 100', In: 100, Icu: 50 },

  // NSX160 (hasta 160A)
  { id: 'sch-nsx160f-125', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX160F 125', In: 125, Icu: 36 },
  { id: 'sch-nsx160f-160', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX160F 160', In: 160, Icu: 36 },
  { id: 'sch-nsx160n-160', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX160N 160', In: 160, Icu: 50 },

  // NSX250 (hasta 250A)
  { id: 'sch-nsx250f-200', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX250F 200', In: 200, Icu: 36 },
  { id: 'sch-nsx250f-250', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX250F 250', In: 250, Icu: 36 },
  { id: 'sch-nsx250n-250', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX250N 250', In: 250, Icu: 50 },
  { id: 'sch-nsx250h-250', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX250H 250', In: 250, Icu: 70 },

  // NSX400 (hasta 400A)
  { id: 'sch-nsx400f-400', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX400F 400', In: 400, Icu: 36 },
  { id: 'sch-nsx400n-400', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX400N 400', In: 400, Icu: 50 },

  // NSX630 (hasta 630A)
  { id: 'sch-nsx630f-630', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX630F 630', In: 630, Icu: 36 },
  { id: 'sch-nsx630n-630', marca: 'Schneider', serie: 'Compact NSX', modelo: 'NSX630N 630', In: 630, Icu: 50 },

  // Compact NS (hasta 1600A)
  { id: 'sch-ns800n-800', marca: 'Schneider', serie: 'Compact NS', modelo: 'NS800N 800', In: 800, Icu: 50 },
  { id: 'sch-ns1000n-1000', marca: 'Schneider', serie: 'Compact NS', modelo: 'NS1000N 1000', In: 1000, Icu: 50 },
  { id: 'sch-ns1250n-1250', marca: 'Schneider', serie: 'Compact NS', modelo: 'NS1250N 1250', In: 1250, Icu: 50 },
  { id: 'sch-ns1600n-1600', marca: 'Schneider', serie: 'Compact NS', modelo: 'NS1600N 1600', In: 1600, Icu: 50 }
];
