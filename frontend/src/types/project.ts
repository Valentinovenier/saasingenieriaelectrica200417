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
}

export interface Proteccion {
  tipo: 'Termomagnética' | 'Fusible' | 'Interruptor Automático Abierto' | 'Interruptor Automático Compacto' | 'PIA';
  valorNominal: number;
  curva?: string;
  marca?: 'Schneider' | 'ABB';
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
  
  tempAmbiente?: number;
  coefSimultaneidad?: number;
  tipoInstalacion?: 'Monofásica' | 'Trifásica';
  cosPhi?: number;
}
