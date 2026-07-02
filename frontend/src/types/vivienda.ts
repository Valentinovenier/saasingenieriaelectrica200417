// Tipos de datos específicos para proyectos residenciales (Viviendas)
// AEA-90364-7-770

export type TipoCircuito = 
  | 'iluminacion_usos_generales'
  | 'tomacorrientes_usos_generales'
  | 'iluminacion_con_tomacorrientes'
  | 'usos_especiales'
  | 'usos_especificos'
  | 'usos_especificos_mbtf';

export interface Ambiente {
  id: string;
  nombre: string;
  superficie: number;
  longitud: number;
  puntosIUG?: number;
  puntosTUG?: number;
}

export interface CircuitoVivienda {
  id: string;
  nombre: string;
  tipo: TipoCircuito;
  puntosUtilizacion: number;
  potenciaEstimada: number;
}

export interface DatosVivienda {
  superficieCubierta: number;
  superficieSemicubierta: number;
  superficieLimiteManual?: number;
  gradoElectrificacion?: 'Minimo' | 'Medio' | 'Elevado' | 'Superior';
  ambientes: Ambiente[];
  circuitos: CircuitoVivienda[];
}

export interface CondicionesTramoResidencial {
  tipoTramo: 'LineaPrincipal' | 'LineaSeccional' | 'CircuitoTerminal';
  tipoCircuito: TipoCircuito;
  metodoInstalacion: 'B2' | 'D1' | 'D2' | 'sinEnvoltura';
  longitudMetros: number;
  corrienteDiseñoAmperes: number;
  temperaturaAmbiente: number;
  canalizacionId?: string;
  cosPhi?: number;
}

export interface ResultadoCalculoResidencial {
  seccionRecomendada: number;
  caidaTensionPorcentaje: number;
  cumpleCapacidadCorriente: boolean;
  cumpleCaidaTension: boolean;
  advertencias?: string[];
}
