import { ParametrosCable } from '../types/cables';

// Definimos una interfaz extendida que sí tiene 'corrientes'
export interface ParametrosCableCompleto extends ParametrosCable {
  corrientes: Record<string, number>; // Método -> Amperios
}

// Estos datos deberían ser cargados de forma real, esto es un MOCK para corregir el error de ejecución
export const catalogoCablesPVC: ParametrosCableCompleto[] = [
  { seccion: 1.5, resistencia: 14.48, reactancia: { unipolar_trebol: 0.154, unipolar_contacto: 0.140, monofasico: 0.101, trifasico: 0.101, trifasico_neutro: 0.101 }, corrientes: { 'A1': 15, 'C': 18, 'E': 20 } },
  { seccion: 2.5, resistencia: 8.87, reactancia: { unipolar_trebol: 0.145, unipolar_contacto: 0.130, monofasico: 0.095, trifasico: 0.095, trifasico_neutro: 0.095 }, corrientes: { 'A1': 20, 'C': 25, 'E': 28 } },
  { seccion: 4, resistencia: 5.52, reactancia: { unipolar_trebol: 0.142, unipolar_contacto: 0.127, monofasico: 0.097, trifasico: 0.097, trifasico_neutro: 0.097 }, corrientes: { 'A1': 25, 'C': 34, 'E': 38 } },
  { seccion: 6, resistencia: 3.69, reactancia: { unipolar_trebol: 0.134, unipolar_contacto: 0.120, monofasico: 0.092, trifasico: 0.092, trifasico_neutro: 0.092 }, corrientes: { 'A1': 32, 'C': 44, 'E': 49 } },
  { seccion: 10, resistencia: 2.19, reactancia: { unipolar_trebol: 0.125, unipolar_contacto: 0.111, monofasico: 0.086, trifasico: 0.086, trifasico_neutro: 0.086 }, corrientes: { 'A1': 44, 'C': 60, 'E': 67 } },
  { seccion: 16, resistencia: 1.38, reactancia: { unipolar_trebol: 0.118, unipolar_contacto: 0.103, monofasico: 0.082, trifasico: 0.082, trifasico_neutro: 0.082 }, corrientes: { 'A1': 60, 'C': 80, 'E': 90 } },
  { seccion: 25, resistencia: 0.870, reactancia: { unipolar_trebol: 0.113, unipolar_contacto: 0.099, monofasico: 0.081, trifasico: 0.081, trifasico_neutro: 0.086 }, corrientes: { 'A1': 80, 'C': 105, 'E': 115 } },
  { seccion: 35, resistencia: 0.627, reactancia: { unipolar_trebol: 0.109, unipolar_contacto: 0.094, monofasico: 0.078, trifasico: 0.078, trifasico_neutro: 0.086 }, corrientes: { 'A1': 100, 'C': 130, 'E': 140 } },
  { seccion: 50, resistencia: 0.464, reactancia: { unipolar_trebol: 0.106, unipolar_contacto: 0.091, monofasico: 0.077, trifasico: 0.077, trifasico_neutro: 0.082 }, corrientes: { 'A1': 120, 'C': 155, 'E': 170 } },
  { seccion: 70, resistencia: 0.321, reactancia: { unipolar_trebol: 0.103, unipolar_contacto: 0.088, monofasico: 0.075, trifasico: 0.075, trifasico_neutro: 0.080 }, corrientes: { 'A1': 150, 'C': 195, 'E': 210 } },
  { seccion: 95, resistencia: 0.232, reactancia: { unipolar_trebol: 0.101, unipolar_contacto: 0.086, monofasico: 0.075, trifasico: 0.075, trifasico_neutro: 0.080 }, corrientes: { 'A1': 180, 'C': 230, 'E': 250 } },
  { seccion: 120, resistencia: 0.184, reactancia: { unipolar_trebol: 0.099, unipolar_contacto: 0.084, monofasico: 0.073, trifasico: 0.073, trifasico_neutro: 0.078 }, corrientes: { 'A1': 210, 'C': 270, 'E': 290 } },
  { seccion: 150, resistencia: 0.145, reactancia: { unipolar_trebol: 0.098, unipolar_contacto: 0.083, monofasico: 0.073, trifasico: 0.073, trifasico_neutro: 0.078 }, corrientes: { 'A1': 240, 'C': 310, 'E': 335 } },
  { seccion: 185, resistencia: 0.1207, reactancia: { unipolar_trebol: 0.098, unipolar_contacto: 0.083, monofasico: 0.073, trifasico: 0.073, trifasico_neutro: 0.078 }, corrientes: { 'A1': 275, 'C': 355, 'E': 380 } },
  { seccion: 240, resistencia: 0.0930, reactancia: { unipolar_trebol: 0.096, unipolar_contacto: 0.082, monofasico: 0.073, trifasico: 0.073, trifasico_neutro: 0.077 }, corrientes: { 'A1': 320, 'C': 410, 'E': 450 } },
];

export const catalogoCablesXLPE: ParametrosCableCompleto[] = [
  { seccion: 1.5, resistencia: 15.429, reactancia: { unipolar_trebol: 0.201, unipolar_contacto: 0.143, monofasico: 0.143, trifasico: 0.143, trifasico_neutro: 0.143 }, corrientes: { 'A1': 18, 'C': 22, 'E': 25 } },
  { seccion: 2.5, resistencia: 9.448, reactancia: { unipolar_trebol: 0.188, unipolar_contacto: 0.130, monofasico: 0.130, trifasico: 0.130, trifasico_neutro: 0.130 }, corrientes: { 'A1': 25, 'C': 30, 'E': 35 } },
  { seccion: 4, resistencia: 5.878, reactancia: { unipolar_trebol: 0.178, unipolar_contacto: 0.120, monofasico: 0.120, trifasico: 0.120, trifasico_neutro: 0.120 }, corrientes: { 'A1': 34, 'C': 40, 'E': 45 } },
  { seccion: 6, resistencia: 3.927, reactancia: { unipolar_trebol: 0.172, unipolar_contacto: 0.114, monofasico: 0.114, trifasico: 0.114, trifasico_neutro: 0.114 }, corrientes: { 'A1': 43, 'C': 50, 'E': 60 } },
  { seccion: 10, resistencia: 2.333, reactancia: { unipolar_trebol: 0.164, unipolar_contacto: 0.106, monofasico: 0.106, trifasico: 0.106, trifasico_neutro: 0.106 }, corrientes: { 'A1': 60, 'C': 70, 'E': 80 } },
  { seccion: 16, resistencia: 1.466, reactancia: { unipolar_trebol: 0.158, unipolar_contacto: 0.100, monofasico: 0.100, trifasico: 0.100, trifasico_neutro: 0.100 }, corrientes: { 'A1': 80, 'C': 95, 'E': 105 } },
  { seccion: 25, resistencia: 0.927, reactancia: { unipolar_trebol: 0.154, unipolar_contacto: 0.096, monofasico: 0.096, trifasico: 0.096, trifasico_neutro: 0.096 }, corrientes: { 'A1': 105, 'C': 125, 'E': 140 } },
  { seccion: 35, resistencia: 0.668, reactancia: { unipolar_trebol: 0.149, unipolar_contacto: 0.091, monofasico: 0.091, trifasico: 0.091, trifasico_neutro: 0.091 }, corrientes: { 'A1': 130, 'C': 155, 'E': 170 } },
  { seccion: 50, resistencia: 0.494, reactancia: { unipolar_trebol: 0.147, unipolar_contacto: 0.089, monofasico: 0.089, trifasico: 0.089, trifasico_neutro: 0.089 }, corrientes: { 'A1': 160, 'C': 190, 'E': 205 } },
  { seccion: 70, resistencia: 0.342, reactancia: { unipolar_trebol: 0.143, unipolar_contacto: 0.085, monofasico: 0.085, trifasico: 0.085, trifasico_neutro: 0.085 }, corrientes: { 'A1': 200, 'C': 240, 'E': 260 } },
  { seccion: 95, resistencia: 0.246, reactancia: { unipolar_trebol: 0.141, unipolar_contacto: 0.083, monofasico: 0.083, trifasico: 0.083, trifasico_neutro: 0.083 }, corrientes: { 'A1': 240, 'C': 290, 'E': 315 } },
  { seccion: 120, resistencia: 0.196, reactancia: { unipolar_trebol: 0.139, unipolar_contacto: 0.081, monofasico: 0.081, trifasico: 0.081, trifasico_neutro: 0.081 }, corrientes: { 'A1': 280, 'C': 340, 'E': 365 } },
  { seccion: 150, resistencia: 0.159, reactancia: { unipolar_trebol: 0.139, unipolar_contacto: 0.081, monofasico: 0.081, trifasico: 0.081, trifasico_neutro: 0.081 }, corrientes: { 'A1': 320, 'C': 390, 'E': 420 } },
  { seccion: 185, resistencia: 0.127, reactancia: { unipolar_trebol: 0.138, unipolar_contacto: 0.080, monofasico: 0.080, trifasico: 0.080, trifasico_neutro: 0.080 }, corrientes: { 'A1': 365, 'C': 445, 'E': 480 } },
  { seccion: 240, resistencia: 0.097, reactancia: { unipolar_trebol: 0.137, unipolar_contacto: 0.079, monofasico: 0.079, trifasico: 0.079, trifasico_neutro: 0.079 }, corrientes: { 'A1': 430, 'C': 520, 'E': 565 } },
];
