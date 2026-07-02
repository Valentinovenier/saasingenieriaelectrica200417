import { calcularPotenciaTotal } from './formulas/potencia';
import { calcularIntr, calcularIk1 } from './formulas/transformador';

// Aquí exportaremos todos los cálculos disponibles en el motor
export const engine = {
  potencia: {
    total: calcularPotenciaTotal,
  },
  transformador: {
    calcularIntr,
    calcularIk1,
  }
};
