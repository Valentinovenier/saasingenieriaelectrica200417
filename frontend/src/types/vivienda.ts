// Tipos de datos específicos para proyectos residenciales (Viviendas)
// AEA-90364-7-770

export type TipoCircuito = 
  | 'iluminacion_usos_generales'
  | 'tomacorrientes_usos_generales'
  | 'iluminacion_con_tomacorrientes'
  | 'usos_especiales'
  | 'usos_especificos'
  | 'usos_especificos_mbtf';
export interface CondicionesTramoResidencial {
  tipoTramo: 'Principal' | 'CircuitoTerminal';
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
