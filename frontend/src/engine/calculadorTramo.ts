import { CondicionesTramo } from '../types/project';
import { K_VALUES } from './constantes';
import { FACTORES_TEMPERATURA_AIRE, FACTORES_TEMPERATURA_TIERRA } from '../data/factoresTemperatura';
import { 
  FACTORES_AGRUPAMIENTO_B52_17, 
  FACTORES_AGRUPAMIENTO_B52_18, 
  FACTORES_AGRUPAMIENTO_B52_19, 
  FACTORES_AGRUPAMIENTO_B52_20, 
  FACTORES_AGRUPAMIENTO_B52_21 
} from '../data/factoresAgrupamiento';
import { FACTOR_SIMETRIA_PARALELO } from '../data/factoresSimetria';

export const calcularConductorTramo = (
  condiciones: CondicionesTramo & { tipoCable?: 'Multipolar' | 'Unipolar', agrupamiento?: number },
  Itrafo: number,
  Ik: number, // kA
  t_apertura: number, // seg
  longitudKm: number,
  cosPhi: number,
  caidaMaxPermitida: number, // %
  catalogoCables: any[], // Tabla correspondiente
  tempAmbiente: number,
  tipoInstalacionAire: boolean
) => {
  const tensionNominal = condiciones.tipoInstalacion === 'Trifásica' ? 380 : 220;
  
  // 1. Obtener factores reales
  const f_temp = tipoInstalacionAire 
    ? FACTORES_TEMPERATURA_AIRE[condiciones.aislacion!][tempAmbiente] 
    : FACTORES_TEMPERATURA_TIERRA[condiciones.aislacion!][tempAmbiente];
    
  // Refactor: Seleccionar factor de agrupamiento dinámico
  let f_agrup = 1.0;
  const nCircuitos = condiciones.agrupamiento || 1;
  const metodo = condiciones.metodoInstalacion;

  if (metodo?.startsWith('D2')) { // Enterrado directo
      f_agrup = FACTORES_AGRUPAMIENTO_B52_18[nCircuitos > 6 ? 6 : nCircuitos]?.en_contacto || 0.5;
  } else if (metodo?.startsWith('D1')) { // Enterrado en ducto
      f_agrup = FACTORES_AGRUPAMIENTO_B52_19[nCircuitos > 6 ? 6 : nCircuitos]?.en_contacto || 0.6;
  } else if (metodo === 'E') { // Aire bandeja
      f_agrup = FACTORES_AGRUPAMIENTO_B52_20[0][nCircuitos > 6 ? 5 : nCircuitos - 1] || 0.7;
  } else if (condiciones.tipoCable === 'Unipolar' && (metodo === 'F' || metodo === 'G')) {
      f_agrup = FACTORES_AGRUPAMIENTO_B52_21[1][nCircuitos > 3 ? 2 : nCircuitos - 1] || 0.8;
  } else { // Método B52-17 (por defecto)
      f_agrup = FACTORES_AGRUPAMIENTO_B52_17[1][nCircuitos > 12 ? 11 : nCircuitos - 1] || 0.5;
  }
  
  const f_simetria = FACTOR_SIMETRIA_PARALELO.no_cumple_disposicion; 
  
  const factorTotal = f_temp * f_agrup * f_simetria;

  const SECCION_MAX = 240;
  
  // Refactor: Preparar advertencia para sugerir unipolares si sección > 95mm²
  let advertencia: string | undefined;

  for (let n = 1; n <= 4; n++) { 
    for (const cable of catalogoCables) {
      if (cable.seccion > SECCION_MAX) continue;

      // Lógica de validación de tipo y sugerencia de cambio
      if (condiciones.tipoCable === 'Multipolar') {
        if (cable.tipo !== 'Multipolar') continue;
        if (cable.seccion > 95 && !advertencia) {
            advertencia = "Para secciones mayores a 95mm², se recomienda el uso de cables unipolares.";
        }
      } else if (condiciones.tipoCable === 'Unipolar') {
        if (cable.tipo !== 'Unipolar') continue;
      }

      if (!cable.corrientes || typeof cable.corrientes !== 'object') continue;
      
      const I_adm_base = cable.corrientes[condiciones.metodoInstalacion!];

      if (I_adm_base === undefined || I_adm_base === null) continue;

      const I_adm_corregida = I_adm_base * n * factorTotal;
      
      if (I_adm_corregida < Itrafo) continue;

      const K = K_VALUES[condiciones.aislacion!][condiciones.material!];
      const capacidadCorto = Math.pow(cable.seccion * K, 2) * n; 
      const energiaCorto = Math.pow(Ik * 1000, 2) * t_apertura;

      if (capacidadCorto < energiaCorto) continue;

      const h = condiciones.tipoInstalacion === 'Trifásica' ? Math.sqrt(3) : 2;
      const sinPhi = Math.sqrt(1 - Math.pow(cosPhi, 2));
      const dv = (h * Itrafo * longitudKm * (cable.R * cosPhi + cable.X * sinPhi)) / n;
      const porcentajeCaida = (dv / tensionNominal) * 100;

      if (porcentajeCaida > caidaMaxPermitida) continue;

      return { 
        cable, 
        nConductores: n, 
        porcentajeCaida,
        I_adm_corregida,
        advertencia
      };
    }
  }

  return { error: "Ningún conductor cumple con los criterios de Corriente, Cortocircuito o Caída de Tensión." };
};
