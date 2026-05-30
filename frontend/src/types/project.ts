export interface HarmonicDistortion {
  h3: number;
  h5: number;
  h7: number;
  h9: number;
}

export interface TableroSeccional {
  id: string;
  name: string;
  tipo: 'Fuerza Motriz' | 'Iluminación';
  potenciaTotal: number;
  factorK: number;
}

export interface Transformador {
  potencia: number;
  cosFi: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  status: 'draft' | 'completed';
  transformador?: Transformador;
  armonicos: HarmonicDistortion;
  tableros: TableroSeccional[];
  tempAmbiente?: number;
  coefSimultaneidad?: number;
}
