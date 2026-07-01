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
  tipoCable?: 'Multipolar' | 'Unipolar';
  disposicion?: 'trebol' | 'contacto' | 'separado';
  plano?: 'horizontal' | 'vertical';
  caidaMaxPermitida?: number;
  tiempoAperturaMT?: number;
  resultadoCalculo?: any;
  canalizacionId?: string;
  tipoTramo?: 'LineaPrincipal' | 'LineaSeccional' | 'CircuitoTerminal';
  tipoCircuito?: string;
}

export interface Proteccion {
  tipo: 'Termomagnética' | 'Fusible' | 'Interruptor Automático Abierto' | 'Interruptor Automático Compacto' | 'PIA';
  valorNominal: number;
  curva?: string;
  marca?: 'Schneider' | 'ABB';
}

export interface Transformador {
  potencia: number;
  tensionPrimario: number;
  tensionSecundario: number;
  cosFi: number;
  impedancia: number;
  proteccionesSalida: Proteccion[];
  modoEntrada?: 'manual' | 'catalogo';
  tipo?: 'Aceite' | 'Seco';
  uccPorcentaje?: number;
  PccW?: number;
  catalogoId?: string;
}

export interface CondicionesTramo {
  tipoTramo: 'LineaPrincipal' | 'LineaSeccional' | 'CircuitoTerminal';
  tipoCircuito: string;
  metodoInstalacion: string;
  longitudMetros: number;
  corrienteDiseñoAmperes: number;
  temperaturaAmbiente: number;
  canalizacionId?: string;
}

// --- Nueva Estructura Topológica (Árbol) ---

export interface CircuitoTerminal {
  id: string;
  nombre: string;
  tipo: string; // Ej: 'iluminacion_usos_generales'
  potencia: number; // VA
  conductor: Conductor; // Tramo que alimenta este circuito
  proteccion: Proteccion;
}

export interface Tablero {
  id: string;
  nombre: string;
  conductorAlimentacion: Conductor; // Tramo que alimenta este tablero
  proteccionCabecera: Proteccion;
  subTableros: Tablero[];
  circuitosTerminales: CircuitoTerminal[];
}

export interface TableroSeccional {
  id: string;
  name: string;
  tipo: 'Fuerza Motriz' | 'Iluminación';
  potenciaTotal: number;
  subTableros: TableroSeccional[];
  proteccionCabecera?: Proteccion;
  proteccionesSalida: Proteccion[];
}

export interface TableroSeccionalSimple {
  id: string;
  nombre: string;
  potencia: number;
}

export interface Canalizacion {
  id: string;
  nombre: string;
}

// --- Fin Nueva Estructura ---

export interface Project {
  id: string;
  name: string;
  projectType: string;
  createdAt: string;
  status: 'draft' | 'completed';
  transformador?: any; // Mantener compatibilidad temporal
  acometida?: any; // Mantener compatibilidad temporal
  armonicos: HarmonicDistortion;
  
  // Nodo raíz de la topología
  tableroPrincipal: Tablero; 
  
  tableros?: TableroSeccional[];
  tablerosSeccionales?: TableroSeccionalSimple[];
  conductores?: Record<string, Conductor>;
  canalizaciones?: Canalizacion[];
  
  tempAmbiente?: number;
  coefSimultaneidad?: number;
  tipoInstalacion?: 'Monofásica' | 'Trifásica';
  cosPhi?: number;
}
