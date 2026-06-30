import { FACTORES_TEMPERATURA_AIRE, FACTORES_TEMPERATURA_TIERRA } from '../../data/factoresTemperatura';
import { 
  FACTORES_AGRUPAMIENTO_B52_17, 
  FACTORES_AGRUPAMIENTO_B52_18, 
  FACTORES_AGRUPAMIENTO_B52_19, 
  FACTORES_AGRUPAMIENTO_B52_20, 
  FACTORES_AGRUPAMIENTO_B52_21 
} from '../../data/factoresAgrupamiento';

export const getFactorTemperatura = (aislacion: string, temperatura: number, tipoInstalacionAire: boolean): number => {
  let aisKey = aislacion === 'Mineral' ? 'Mineral_70' : aislacion;
  const tempMap = tipoInstalacionAire ? FACTORES_TEMPERATURA_AIRE : FACTORES_TEMPERATURA_TIERRA;
  return tempMap[aisKey]?.[temperatura] || 1.0;
};

export const getFactorAgrupamiento = (
    nCircuitos: number, 
    metodo: string, 
    tipoCable: 'Unipolar' | 'Multipolar' | undefined,
    disposicion: string = 'en_contacto'
): number => {
  if (nCircuitos <= 1) return 1.0;
  
  if (metodo.startsWith('D2')) {
      const nCirc = nCircuitos > 6 ? 6 : nCircuitos;
      const tabla = FACTORES_AGRUPAMIENTO_B52_18[nCirc] || FACTORES_AGRUPAMIENTO_B52_18[2];
      return tabla[disposicion] || tabla['en_contacto'] || 0.5;
  }
  if (metodo.startsWith('D1')) {
      const nCirc = nCircuitos > 6 ? 6 : nCircuitos;
      const tabla = FACTORES_AGRUPAMIENTO_B52_19[nCirc] || FACTORES_AGRUPAMIENTO_B52_19[2];
      return tabla[disposicion] || tabla['en_contacto'] || 0.6;
  }
  if (metodo === 'E') {
      const nCirc = nCircuitos > 6 ? 6 : nCircuitos;
      return FACTORES_AGRUPAMIENTO_B52_20[0][nCirc - 1] || 0.7;
  }
  if (tipoCable === 'Unipolar' && (metodo === 'F' || metodo === 'G')) {
      const nCirc = nCircuitos > 3 ? 3 : nCircuitos;
      return FACTORES_AGRUPAMIENTO_B52_21[1][nCirc - 1] || 0.8;
  }
  
  const mapaCircuitos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 16, 20];
  let idx = mapaCircuitos.findIndex(c => c >= nCircuitos);
  if (idx === -1) idx = mapaCircuitos.length - 1;
  
  return FACTORES_AGRUPAMIENTO_B52_17[1][idx] || 0.5;
};
