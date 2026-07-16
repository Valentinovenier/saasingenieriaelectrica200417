// Tipos de datos específicos para proyectos residenciales (Viviendas)
// AEA-90364-7-770

export type TipoCircuito = 
  | 'iluminacion_usos_generales'
  | 'tomacorrientes_usos_generales'
  | 'usos_especiales'
  | 'usos_especificos_mbtf';

export interface Ambiente {
  id: string;
  nombre: string;
  superficie: number;
  longitud: number;
  puntosIUG: number;
  puntosTUG: number;
  puntosTUE: number;
  // Campos para control de asignación automática/manual
  circuitoIUGId?: string;
  circuitoTUGId?: string;
  circuitoTUEId?: string;
}

export interface CircuitoCalculado {
  id: string;
  nombre: string;
  tipo: TipoCircuito;
  puntosIUG: number;
  puntosTUG: number;
  puntosTUE: number;
  manualPuntosIUG?: number;
  manualPuntosTUG?: number;
  manualPuntosTUE?: number;
  tieneTomacorrientesDerivados?: boolean;
  ambientesIds: string[];
}

export interface TableroVivienda {
  id: string;
  nombre: string;
  tipo: 'Principal' | 'Seccional' | 'SubSeccional';
  tableroPadreId?: string; // Para definir la jerarquía
  circuitosIds: string[];
}

export interface TomasCircuito {
  IUG: number;
  TUG: number;
  TUE: number;
}

export interface DatosVivienda {
  superficieCubierta: number;
  superficieSemicubierta: number;
  superficieLimiteManual?: number;
  gradoElectrificacion?: 'Minimo' | 'Medio' | 'Elevado' | 'Superior';
  varianteElectrificacion?: string;
  ambientes: Ambiente[];
  circuitosCalculados: CircuitoCalculado[];
  tableros?: TableroVivienda[];
  tomasPorAmbiente?: Record<string, Record<string, TomasCircuito>>;
  potenciaInstalada?: number;
  potenciaMaximaSimultanea?: number;
}

export interface CondicionesTramoResidencial {
  tipoTramo: 'LineaPrincipal' | 'LineaSeccional' | 'CircuitoTerminal';
  tipoCircuito: TipoCircuito;
  metodoInstalacion: 'B2' | 'D1' | 'D2' | 'sinEnvoltura' | string;
  longitudMetros: number;
  corrienteDiseñoAmperes: number;
  temperaturaAmbiente: number;
  canalizacionId?: string;
  cosPhi?: number;
  normaCable?: string;
  tempSuelo?: number;
  resistividadTermica?: number;
  separacionBordes?: string;
}

export interface ResultadoCalculoResidencial {
  seccionRecomendada: number;
  caidaTensionPorcentaje: number;
  cumpleCapacidadCorriente: boolean;
  cumpleCaidaTension: boolean;
  advertencias?: string[];
}
