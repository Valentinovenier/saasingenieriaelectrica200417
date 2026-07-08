// frontend/src/data/vivienda/circuitosDistribucion.ts

export type GradoElectrificacion = 'Minimo' | 'Medio' | 'Elevado' | 'Superior';

export interface ConfiguracionCircuitos {
  grado: GradoElectrificacion;
  cantidadMinima: number;
  variante: string;
  IUG: number;
  TUG: number;
  CLE: number | null; // Circuito de libre elección
}

export const DISTRIBUCION_CIRCUITOS: ConfiguracionCircuitos[] = [
  { grado: 'Minimo', cantidadMinima: 2, variante: 'Única', IUG: 1, TUG: 1, CLE: null },
  { grado: 'Medio', cantidadMinima: 3, variante: 'a)', IUG: 2, TUG: 1, CLE: null },
  { grado: 'Medio', cantidadMinima: 3, variante: 'b)', IUG: 1, TUG: 2, CLE: null },
  { grado: 'Elevado', cantidadMinima: 5, variante: 'a)', IUG: 2, TUG: 3, CLE: null },
  { grado: 'Elevado', cantidadMinima: 5, variante: 'b)', IUG: 3, TUG: 2, CLE: null },
  { grado: 'Superior', cantidadMinima: 6, variante: 'a)', IUG: 2, TUG: 3, CLE: 1 },
  { grado: 'Superior', cantidadMinima: 6, variante: 'b)', IUG: 3, TUG: 2, CLE: 1 },
];
