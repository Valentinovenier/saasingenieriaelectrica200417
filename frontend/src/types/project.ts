export interface HarmonicDistortion {
  h3: number;
  h5: number;
  h7: number;
  h9: number;
}

export interface Proteccion {
  tipo: 'Termomagnética' | 'Fusible' | 'Interruptor Automático';
  valorNominal: number;
  curva?: string;
}

export interface TableroSeccional {
  id: string;
  name: string;
  tipo: 'Fuerza Motriz' | 'Iluminación';
  potenciaTotal: number;
  subTableros: TableroSeccional[];
  proteccionCabecera?: Proteccion;
  proteccionesSalida: Proteccion[]; // Cambiado a array
}

export interface Transformador {
  potencia: number;
  tensionPrimario: number;
  tensionSecundario: number;
  cosFi: number;
  impedancia: number;
  proteccionCabecera?: Proteccion;
  proteccionesSalida: Proteccion[]; // Cambiado a array
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
