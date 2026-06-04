export interface HarmonicDistortion {
  h3: number;
  h5: number;
  h7: number;
  h9: number;
}

export type TipoConductor = 'Cable' | 'CEP';
export type MaterialConductor = 'Cobre' | 'Aluminio';
export type AislacionConductor = 'PVC' | 'XLPE';

export interface Conductor {
  tipo: TipoConductor;
  material?: MaterialConductor;
  aislacion?: AislacionConductor;
  seccion?: number; // mm²
  longitud?: number; // m
  metodoInstalacion?: string;
  agrupamiento?: number;
}

export interface CondicionesTramo {
  tipoInstalacion?: 'Monofásica' | 'Trifásica';
  aislacion?: AislacionConductor;
  material?: MaterialConductor;
  metodoInstalacion?: string;
}

export interface Proteccion {
  tipo: 'Termomagnética' | 'Fusible' | 'Interruptor Automático Abierto' | 'Interruptor Automático Compacto' | 'PIA';
  valorNominal: number;
  curva?: string;
  marca?: 'Schneider' | 'ABB';
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
  conductorTrafoTGBT?: Conductor;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  status: 'draft' | 'completed';
  transformador?: Transformador;
  armonicos: HarmonicDistortion;
  tableros: TableroSeccional[];
  conductorTGBTBarra?: Conductor;
  tempAmbiente?: number;
  coefSimultaneidad?: number;
  tipoInstalacion?: 'Monofásica' | 'Trifásica';
}
