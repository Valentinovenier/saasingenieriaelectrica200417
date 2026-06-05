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
import { getAdmisible } from './corrienteProvider';

export const calcularConductorTramo = (
  condiciones: CondicionesTramo & { tipoCable?: 'Multipolar' | 'Unipolar', agrupamiento?: number, norma?: string },
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
  
  // 1. Factores base (Temperatura y Simetría)
  const f_temp = tipoInstalacionAire 
    ? FACTORES_TEMPERATURA_AIRE[condiciones.aislacion!][tempAmbiente] 
    : FACTORES_TEMPERATURA_TIERRA[condiciones.aislacion!][tempAmbiente];
    
  // Refactor: Calcular factor de simetría dinámico
  const getFsimetria = (nCond: number) => {
      if (condiciones.tipoCable === 'Unipolar') {
          return (nCond === 1 || nCond === 2 || nCond === 4 || nCond === 6) ? 1.0 : 0.8;
      }
      // Multipolar
      return (nCond === 1) ? 1.0 : 0.8;
  };
  
  const f_base_temp = f_temp; // Simetría se aplica dentro del bucle


  // 2. Preparar factores de agrupamiento
  const nCircuitos = condiciones.agrupamiento || 1;
  const metodo = condiciones.metodoInstalacion;
  
  const getFagrup = (nCond: number) => {
      // Si solo hay 1 conductor en paralelo O solo hay 1 circuito total, no hay reducción por agrupamiento
      if (nCond === 1 || nCircuitos === 1) return 1.0;
      
      // Con más de un conductor y más de un circuito, aplicamos el factor de agrupamiento
      const nCirc = nCircuitos > 6 ? 6 : nCircuitos;
      const disp = condiciones.disposicion || 'en_contacto';

      if (metodo?.startsWith('D2')) {
          const tabla = FACTORES_AGRUPAMIENTO_B52_18[nCirc] || FACTORES_AGRUPAMIENTO_B52_18[2];
          return tabla[disp] || tabla['en_contacto'] || 0.5;
      }
      if (metodo?.startsWith('D1')) {
          const tabla = FACTORES_AGRUPAMIENTO_B52_19[nCirc] || FACTORES_AGRUPAMIENTO_B52_19[2];
          return tabla[disp] || tabla['en_contacto'] || 0.6;
      }
      if (metodo === 'E') return FACTORES_AGRUPAMIENTO_B52_20[0][nCirc - 1] || 0.7;
      if (condiciones.tipoCable === 'Unipolar' && (metodo === 'F' || metodo === 'G')) {
          return FACTORES_AGRUPAMIENTO_B52_21[1][nCirc - 1] || 0.8;
      }
      
      // Default (B52-17 para A, B, C)
      return FACTORES_AGRUPAMIENTO_B52_17[1][nCircuitos > 12 ? 11 : nCirc - 1] || 0.5;
  };

  const SECCION_MAX = 240;
  let advertencia: string | undefined;

  // 3. Iterar de 1 a 6 conductores
  let mejorResultado: any = null;
  
  for (let n = 1; n <= 6; n++) { 
    const factorTotal = f_base_temp * getFsimetria(n) * getFagrup(n);

    for (const cable of catalogoCables) {
      if (cable.seccion > SECCION_MAX) continue;

      // Lógica de tipo de cable: solo filtramos si el cable TIENE un tipo definido y no coincide
      if (condiciones.tipoCable === 'Multipolar' && cable.tipo && cable.tipo !== 'Multipolar') continue;
      if (condiciones.tipoCable === 'Unipolar' && cable.tipo && cable.tipo !== 'Unipolar') continue;

      // Obtener corriente base usando el nuevo Provider
      const I_adm_base = getAdmisible(
          cable.seccion,
          condiciones.metodoInstalacion!,
          condiciones.tipoInstalacion === 'Trifásica',
          condiciones.material!,
          condiciones.aislacion!,
          condiciones.disposicion,
          condiciones.tipoCable?.toLowerCase() as 'unipolar' | 'multipolar'
      );

      if (I_adm_base === undefined || I_adm_base === null) continue;

      const I_adm_corregida = I_adm_base * n * factorTotal;
      if (I_adm_corregida < Itrafo) continue;

      const K = K_VALUES[condiciones.aislacion!][condiciones.material!];
      const capacidadCorto = Math.pow(cable.seccion * K, 2) * n; 
      const energiaCorto = Math.pow(Ik * 1000, 2) * t_apertura;
      if (capacidadCorto < energiaCorto) continue;

      const h = condiciones.tipoInstalacion === 'Trifásica' ? Math.sqrt(3) : 2;
      const sinPhi = Math.sqrt(1 - Math.pow(cosPhi, 2));
      
      // Acceso correcto a R y X desde el catálogo
      const R = Number(cable.resistencia || 0);
      const tipoReactancia = condiciones.tipoInstalacion === 'Trifásica' ? 'trifasico' : 'monofasico';
      const X = Number(cable.reactancia?.[tipoReactancia] || 0);
      
      const dv = (h * Itrafo * longitudKm * (R * cosPhi + X * sinPhi)) / n;
      const porcentajeCaida = (dv / tensionNominal) * 100;
      
      if (isNaN(porcentajeCaida) || porcentajeCaida > caidaMaxPermitida) continue;

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
