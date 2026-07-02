import { DatosVivienda } from './vivienda';

export interface ProjectStrategy {
  calcularTramo(condiciones: CondicionesTramo, project?: Project): any;
  validarReglas(project: Project): boolean;
  getFormularioComponente(): React.ComponentType<any>;
  getInformeComponente(): React.ComponentType<{ project: Project }>;
}

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
  tipoInstalacion?: 'Monofásica' | 'Trifásica';
  aislacion?: AislacionConductor;
  material?: MaterialConductor;
  disposicion?: 'trebol' | 'contacto' | 'separado';
  plano?: 'horizontal' | 'vertical';
}

export interface CircuitoTerminal {
  id: string;
  nombre: string;
  tipo: string;
  potencia: number;
  conductor: Conductor;
  proteccion: Proteccion;
}

export interface Tablero {
  id: string;
  nombre: string;
  conductorAlimentacion: Conductor;
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

export interface Project {
  id: string;
  name: string;
  projectType: string;
  createdAt: string;
  status: 'draft' | 'completed';
  transformador?: any;
  acometida?: any;
  armonicos: HarmonicDistortion;
  
  datosVivienda?: DatosVivienda;

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
