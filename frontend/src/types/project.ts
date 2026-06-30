export interface HarmonicDistortion {
  habilitado: boolean;
  modoEntrada: 'porcentaje' | 'amperios';
  h3: number;
  h5: number;
  h7: number;
  h9: number;
}

export type TipoConductor = 'Cable' | 'CEP';
export type MaterialConductor = 'Cobre' | 'Aluminio';
export type AislacionConductor = 'PVC' | 'XLPE' | 'Mineral';

export interface Conductor {
  tipo: TipoConductor;
  material?: MaterialConductor;
  aislacion?: AislacionConductor;
  seccion?: number; // mm²
  longitud?: number; // m
  metodoInstalacion?: string;
  agrupamiento?: number;
  tipoCable?: 'Multipolar' | 'Unipolar'; // Nuevo campo
  disposicion?: 'trebol' | 'contacto' | 'separado'; // Nuevo campo para unipolares
  plano?: 'horizontal' | 'vertical'; // Nuevo campo para método G
  caidaMaxPermitida?: number;           // Nuevo campo (en %)
  tiempoAperturaMT?: number;            // Nuevo campo (en seg)
  resultadoCalculo?: any;               // Resultado del cálculo (cable seleccionado, Ik, etc.)
  canalizacionId?: string;              // Identificador para agrupamiento automático
}

export interface CondicionesTramo {
  tipoInstalacion?: 'Monofásica' | 'Trifásica';
  aislacion?: AislacionConductor;
  material?: MaterialConductor;
  metodoInstalacion?: string;
  disposicion?: 'trebol' | 'contacto' | 'separado';
  plano?: 'horizontal' | 'vertical'; // Nuevo campo para método G
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
  impedancia: number; // Zcc total en Ohms
  tipo?: 'Aceite' | 'Seco';
  uccPorcentaje?: number;
  PccW?: number;
  modoEntrada?: 'catalogo' | 'manual';
  catalogoId?: string;
  proteccionCabecera?: Proteccion;
  proteccionesSalida: Proteccion[]; // Cambiado a array
  conductorTrafoTGBT?: Conductor;
}

export interface TableroSeccionalSimple {
  id: string;
  nombre: string;
  potencia: number; // kVA
}

export interface Project {
  id: string;
  name: string;
  projectType: string;
  createdAt: string;
  status: 'draft' | 'completed';
  transformador?: Transformador;
  armonicos: HarmonicDistortion;
  tableros: TableroSeccional[];
  tablerosSeccionales?: TableroSeccionalSimple[]; // Nuevo: lista de tableros con nombre y potencia
  conductorTGBTBarra?: Conductor;
  conductores?: Record<string, Conductor>;
  tempAmbiente?: number;
  coefSimultaneidad?: number;
  tipoInstalacion?: 'Monofásica' | 'Trifásica';
}
