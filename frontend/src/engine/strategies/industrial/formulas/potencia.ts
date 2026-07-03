import { Tablero, TableroSeccional } from '../../../../types/project';

/**
 * Calcula la potencia total de una lista de tableros y sus sub-tableros.
 * Es una función pura: no depende de React ni de estados externos.
 */
export const calcularPotenciaTotal = (tableros: (Tablero | TableroSeccional)[]): number => {
  return tableros.reduce((total, tablero) => {
    // Solo sumamos si es un TableroSeccional (tiene potenciaTotal)
    const potenciaHijos = calcularPotenciaTotal(tablero.subTableros);
    const potenciaPropia = 'potenciaTotal' in tablero ? Number(tablero.potenciaTotal || 0) : 0;
    return total + potenciaPropia + potenciaHijos;
  }, 0);
};
