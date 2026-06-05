import { CondicionesTramo } from '../types/project';
import { K_VALUES } from './constantes';
import { FACTORES_TEMPERATURA_AIRE, FACTORES_TEMPERATURA_TIERRA } from '../data/factoresTemperatura';
import { FACTORES_AGRUPAMIENTO_B52_17 } from '../data/factoresAgrupamiento';
import { FACTOR_SIMETRIA_PARALELO } from '../data/factoresSimetria';

export const calcularConductorTramo = (
  condiciones: CondicionesTramo & { tipoCable?: 'Multipolar' | 'Unipolar' },
  Itrafo: number,
  Ik: number, // kA
  t_apertura: number, // seg
  longitudKm: number,
  cosPhi: number,
  caidaMaxPermitida: number, // %
  catalogoCables: any[], // Tabla correspondiente
  tempAmbiente: number,
  tipoInstalacionAire: boolean,
  nCircuitosAgrupados: number
) => {
  const tensionNominal = condiciones.tipoInstalacion === 'Trifásica' ? 380 : 220;
  
  // 1. Obtener factores reales
  const f_temp = tipoInstalacionAire 
    ? FACTORES_TEMPERATURA_AIRE[condiciones.aislacion!][tempAmbiente] 
    : FACTORES_TEMPERATURA_TIERRA[condiciones.aislacion!][tempAmbiente];
    
  const f_agrup = FACTORES_AGRUPAMIENTO_B52_17[1][nCircuitosAgrupados]; 
  const f_simetria = FACTOR_SIMETRIA_PARALELO.no_cumple_disposicion; 
  const SECCION_MAX = 240;
  console.log("Catálogo recibido:", catalogoCables);

  for (let n = 1; n <= 4; n++) { 
    console.log(`Evaluando con n=${n} conductores en paralelo`);
    for (const cable of catalogoCables) {
      console.log(`Evaluando cable sección: ${cable.seccion}`);
      if (cable.seccion > SECCION_MAX) continue;

      // Nueva lógica: Selección Unipolar vs Multipolar basada en sección
      const esUnipolarNecesario = cable.seccion > 95;
      if (condiciones.tipoCable === 'Multipolar' && esUnipolarNecesario) {
        console.log(`[Cable ${cable.seccion}mm²] Saltado por regla Unipolar/Multipolar`);
        continue;
      }

      if (!cable.corrientes || typeof cable.corrientes !== 'object') {
        console.log(`[Cable ${cable.seccion}mm²] Saltado por falta de corrientes`);
        continue;
      }

      const I_adm_base = cable.corrientes[condiciones.metodoInstalacion!];

      if (I_adm_base === undefined || I_adm_base === null) {
        console.log(`[Cable ${cable.seccion}mm²] Saltado por falta de corriente base para método ${condiciones.metodoInstalacion}`);
        continue;
      }

      const I_adm_corregida = I_adm_base * n * factorTotal;

      // LOGS PARA DIAGNÓSTICO
      if (I_adm_corregida < Itrafo) {
        console.log(`[Cable ${cable.seccion}mm²] Falla Corriente: ${I_adm_corregida.toFixed(2)}A < ${Itrafo.toFixed(2)}A`);
        continue;
      }

      const K = K_VALUES[condiciones.aislacion!][condiciones.material!];
      const capacidadCorto = Math.pow(cable.seccion * K, 2) * n; 
      const energiaCorto = Math.pow(Ik * 1000, 2) * t_apertura;

      if (capacidadCorto < energiaCorto) {
        console.log(`[Cable ${cable.seccion}mm²] Falla Corto: ${capacidadCorto.toFixed(0)} < ${energiaCorto.toFixed(0)}`);
        continue;
      }

      const h = condiciones.tipoInstalacion === 'Trifásica' ? Math.sqrt(3) : 2;
      const sinPhi = Math.sqrt(1 - Math.pow(cosPhi, 2));
      const dv = (h * Itrafo * longitudKm * (cable.R * cosPhi + cable.X * sinPhi)) / n;
      const porcentajeCaida = (dv / tensionNominal) * 100;

      if (porcentajeCaida > caidaMaxPermitida) {
        console.log(`[Cable ${cable.seccion}mm²] Falla Caída: ${porcentajeCaida.toFixed(2)}% > ${caidaMaxPermitida}%`);
        continue;
      }

      console.log(`[Cable ${cable.seccion}mm²] ACEPTADO!`);
      return { 
        cable, 
        nConductores: n, 
        porcentajeCaida,
        I_adm_corregida 
      };
    }
  }

  return { error: "Ningún conductor cumple con los criterios de Corriente, Cortocircuito o Caída de Tensión." };
};
