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
      if (nCond === 1) return 1.0; // Sin factor de agrupamiento para un solo conductor
      
      // Con más de un conductor, aplicamos el factor de agrupamiento
      if (metodo?.startsWith('D2')) return FACTORES_AGRUPAMIENTO_B52_18[nCircuitos > 6 ? 6 : nCircuitos]?.en_contacto || 0.5;
      if (metodo?.startsWith('D1')) return FACTORES_AGRUPAMIENTO_B52_19[nCircuitos > 6 ? 6 : nCircuitos]?.en_contacto || 0.6;
      if (metodo === 'E') return FACTORES_AGRUPAMIENTO_B52_20[0][nCircuitos > 6 ? 5 : nCircuitos - 1] || 0.7;
      if (condiciones.tipoCable === 'Unipolar' && (metodo === 'F' || metodo === 'G')) return FACTORES_AGRUPAMIENTO_B52_21[1][nCircuitos > 3 ? 2 : nCircuitos - 1] || 0.8;
      return FACTORES_AGRUPAMIENTO_B52_17[1][nCircuitos > 12 ? 11 : nCircuitos - 1] || 0.5;
  };

  const SECCION_MAX = 240;
  let advertencia: string | undefined;

  // 3. Iterar de 1 a 6 conductores
  let mejorResultado: any = null;
  console.log("Iniciando simulación de cálculo...");

  for (let n = 1; n <= 6; n++) { 
    const factorTotal = f_base_temp * getFsimetria(n) * getFagrup(n);
    console.log(`Probando con n=${n} conductores, factorTotal=${factorTotal.toFixed(3)}`);

    for (const cable of catalogoCables) {
      if (cable.seccion > SECCION_MAX) continue;

      // (Lógica de tipo de cable omitida por brevedad en este log, pero se mantiene en el código)
      if (condiciones.tipoCable === 'Multipolar' && cable.tipo !== 'Multipolar') continue;
      if (condiciones.tipoCable === 'Unipolar' && cable.tipo !== 'Unipolar') continue;

      if (!cable.corrientes || typeof cable.corrientes !== 'object') continue;
      
      const I_adm_base = cable.corrientes[condiciones.metodoInstalacion!];
      if (I_adm_base === undefined || I_adm_base === null) {
        console.log(`Cable ${cable.seccion}mm² descartado: método ${condiciones.metodoInstalacion} no encontrado en catálogo`);
        continue;
      }

      const I_adm_corregida = I_adm_base * n * factorTotal;
      if (I_adm_corregida < Itrafo) {
        console.log(`Cable ${cable.seccion}mm² descartado por corriente: ${I_adm_corregida.toFixed(1)}A < ${Itrafo.toFixed(1)}A`);
        continue;
      }

      const K = K_VALUES[condiciones.aislacion!][condiciones.material!];
      const capacidadCorto = Math.pow(cable.seccion * K, 2) * n; 
      const energiaCorto = Math.pow(Ik * 1000, 2) * t_apertura;
      if (capacidadCorto < energiaCorto) {
        console.log(`Cable ${cable.seccion}mm² descartado por corto: cap=${capacidadCorto.toFixed(0)} < energ=${energiaCorto.toFixed(0)}`);
        continue;
      }

      const h = condiciones.tipoInstalacion === 'Trifásica' ? Math.sqrt(3) : 2;
      const sinPhi = Math.sqrt(1 - Math.pow(cosPhi, 2));
      const dv = (h * Itrafo * longitudKm * (cable.R * cosPhi + cable.X * sinPhi)) / n;
      const porcentajeCaida = (dv / tensionNominal) * 100;
      if (porcentajeCaida > caidaMaxPermitida) {
        console.log(`Cable ${cable.seccion}mm² descartado por caída: ${porcentajeCaida.toFixed(2)}% > ${caidaMaxPermitida}%`);
        continue;
      }

      console.log(`¡Candidato encontrado! Sección: ${cable.seccion}mm², n: ${n}`);
      const resultadoActual = { 
        cable, 
        nConductores: n, 
        porcentajeCaida,
        I_adm_corregida,
        advertencia
      };

      // Si encontramos una solución, comparamos:
      // Preferimos menos conductores o menor sección.
      // Si el factor de simetría era 0.8 y encontramos uno con 1.0 (ej. 4 conductores), es mejor.
      if (!mejorResultado || 
          (resultadoActual.nConductores === 4 && getFsimetria(n) === 1.0 && getFsimetria(mejorResultado.nConductores) === 0.8) ||
          (resultadoActual.cable.seccion < mejorResultado.cable.seccion)) {
          mejorResultado = resultadoActual;
      }
    }
  }

  return mejorResultado || { error: "Ningún conductor cumple con los criterios de Corriente, Cortocircuito o Caída de Tensión." };
};
