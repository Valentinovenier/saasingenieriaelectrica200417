import { CondicionesTramo } from '../types/project';
import { K_VALUES } from './constantes';
import { FACTORES_TEMPERATURA_AIRE, FACTORES_TEMPERATURA_TIERRA } from '../data/factoresTemperatura';
import { FACTORES_AGRUPAMIENTO_B52_17 } from '../data/factoresAgrupamiento';
import { FACTOR_SIMETRIA_PARALELO } from '../data/factoresSimetria';

export const calcularConductorTramo = (
  condiciones: CondicionesTramo,
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
  console.log("Datos de entrada:", { condiciones, Itrafo, Ik, tempAmbiente });
  const tensionNominal = condiciones.tipoInstalacion === 'Trifásica' ? 380 : 220;
  
  // 1. Obtener factores reales
  const f_temp = tipoInstalacionAire 
    ? FACTORES_TEMPERATURA_AIRE[condiciones.aislacion!][tempAmbiente] 
    : FACTORES_TEMPERATURA_TIERRA[condiciones.aislacion!][tempAmbiente];
    
  const f_agrup = FACTORES_AGRUPAMIENTO_B52_17[1][nCircuitosAgrupados]; 
  const f_simetria = FACTOR_SIMETRIA_PARALELO.no_cumple_disposicion; 
  
  const factorTotal = f_temp * f_agrup * f_simetria;
  console.log("Factores:", { f_temp, f_agrup, f_simetria, factorTotal });

  const SECCION_MAX = 240;

  for (let n = 1; n <= 4; n++) { 
    for (const cable of catalogoCables) {
      if (cable.seccion > SECCION_MAX) continue;

      if (!cable.corrientes || typeof cable.corrientes !== 'object') continue;
      
      const I_adm_base = cable.corrientes[condiciones.metodoInstalacion!];
      if (I_adm_base === undefined || I_adm_base === null) continue;
      
      const I_adm_corregida = I_adm_base * n * factorTotal;
      
      // LOGS PARA DIAGNÓSTICO
      if (I_adm_corregida <= Itrafo) {
        console.log(`Fallo I_adm: ${I_adm_corregida} <= ${Itrafo} (S:${cable.seccion})`);
        continue;
      }
      // ... resto de logs ...
