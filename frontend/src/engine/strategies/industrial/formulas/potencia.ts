import { TableroSeccional } from '../../types/project';

/**
 * Calcula la potencia total de una lista de tableros y sus sub-tableros.
 * Es una función pura: no depende de React ni de estados externos.
 */
export const calcularPotenciaTotal = (tableros: TableroSeccional[]): number => {
  return tableros.reduce((total, tablero) => {
    // Suma la potencia de este tablero + la de todos sus sub-tableros
    const potenciaHijos = calcularPotenciaTotal(tablero.subTableros);
    return total + Number(tablero.potenciaTotal || 0) + potenciaHijos;
  }, 0);
};
