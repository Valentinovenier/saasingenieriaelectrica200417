import { CondicionesTramoResidencial, ResultadoCalculoResidencial } from '../../types/vivienda';
import { Project } from '../../types/project';
import { getAdmisible } from '../corrienteProvider';
import { PARAMETROS_CALCULO_VIVIENDA } from '../../data/vivienda/parametrosCalculo';
import { IMPEDANCIAS_CABLES_VIVIENDA } from '../../data/vivienda/impedancias';
import { SECCIONES_MINIMAS_VIVIENDA } from '../../data/vivienda/seccionesMinimas';
import { getFactorTemperatura, getFactorAgrupamiento } from '../helpers/normativeFactors';
import { getCircuitosPorCanalizacion } from '../canalizacionService';

export const calcularTramoResidencial = (
  condiciones: CondicionesTramoResidencial,
  project: Project
): ResultadoCalculoResidencial => {
  // 1. Determinar número de circuitos agrupados automáticamente
  const nCircuitos = condiciones.canalizacionId 
    ? getCircuitosPorCanalizacion(project, condiciones.canalizacionId).length || 1 
    : 1;

  // 1. Determinar sección mínima por tipo de circuito (Tabla 770.11.I)
  let seccionMinima = 1.5;
  switch (condiciones.tipoCircuito) {
    case 'iluminacion_usos_generales':
      seccionMinima = SECCIONES_MINIMAS_VIVIENDA.terminalesIluminacion;
      break;
    case 'tomacorrientes_usos_generales':
      seccionMinima = SECCIONES_MINIMAS_VIVIENDA.terminalesTomacorrientes;
      break;
    case 'iluminacion_con_tomacorrientes':
      seccionMinima = SECCIONES_MINIMAS_VIVIENDA.terminalesIluminacionConTomacorrientes;
      break;
    case 'usos_especiales':
      seccionMinima = SECCIONES_MINIMAS_VIVIENDA.usosEspeciales;
      break;
    case 'usos_especificos':
      seccionMinima = SECCIONES_MINIMAS_VIVIENDA.usosEspecificos;
      break;
    case 'usos_especificos_mbtf':
      seccionMinima = SECCIONES_MINIMAS_VIVIENDA.usosEspecificosMBTF;
      break;
  }
  
  // 2. Obtener secciones disponibles
  const seccionesDisponibles = [1.5, 2.5, 4, 6, 10, 16, 25];

  // 3. Bucle de selección iterativa
  let seccionElegida = seccionesDisponibles.find(s => s >= seccionMinima) || seccionMinima;
  let cumpleTodo = false;
  let caidaTensionPorcentaje = 0;
  let cumpleCapacidadCorriente = false;
  let cumpleCaidaTension = false;
  let cumpleCortocircuito = false;
  let advertencias: string[] = [];

  for (const s of seccionesDisponibles.filter(s => s >= seccionElegida)) {
    // 3.1. Obtener I_z usando el motor normativo
    const IzBase = getAdmisible(
        '770',
        s,
        condiciones.metodoInstalacion === 'sinEnvoltura' ? 'B1' : condiciones.metodoInstalacion,
        'Monofásica', 
        'Cobre',
        'PVC',
        undefined,
        undefined,
        'multipolar'
    );

    if (IzBase === undefined) {
        advertencias.push(`Método ${condiciones.metodoInstalacion} no permitido para sección ${s} en norma 770.`);
        continue;
    }

    // Factores de corrección reales
    const factorTemp = getFactorTemperatura('PVC', condiciones.temperaturaAmbiente, true);
    const factorAgrup = getFactorAgrupamiento(nCircuitos, condiciones.metodoInstalacion, 'Multipolar');
    const IzCorregida = IzBase * factorTemp * factorAgrup;

    cumpleCapacidadCorriente = IzCorregida >= condiciones.corrienteDiseñoAmperes;

    // 3.2. Verificar caída de tensión (exacta monofásica)
    const impedancia = IMPEDANCIAS_CABLES_VIVIENDA[s.toFixed(1)] || IMPEDANCIAS_CABLES_VIVIENDA[s.toString()];
    if (impedancia) {
      const cosPhi = condiciones.cosPhi || 0.9;
      const sinPhi = Math.sqrt(1 - Math.pow(cosPhi, 2));
      const longitudKm = condiciones.longitudMetros / 1000;
      // Monofásica: dv = 2 * Ib * L * (R * cosPhi + X * sinPhi)
      const dv = 2 * condiciones.corrienteDiseñoAmperes * longitudKm * (impedancia.r * cosPhi + impedancia.x * sinPhi);
      caidaTensionPorcentaje = (dv / 220) * 100;
    } else {
      caidaTensionPorcentaje = (condiciones.corrienteDiseñoAmperes * condiciones.longitudMetros * 0.02) / 220 * 100;
    }
    
    const limiteCaida = condiciones.tipoCircuito.includes('iluminacion') ? 3.0 : 5.0;
    cumpleCaidaTension = caidaTensionPorcentaje <= limiteCaida;

    // 3.3. Verificar Cortocircuito
    if (impedancia) {
        const IccPresunta = 220 / ((impedancia.r * condiciones.longitudMetros / 1000) * 1.5);
        cumpleCortocircuito = IccPresunta > (condiciones.corrienteDiseñoAmperes * 10);
    } else {
        cumpleCortocircuito = true;
    }

    if (cumpleCapacidadCorriente && cumpleCaidaTension && cumpleCortocircuito) {
      seccionElegida = s;
      cumpleTodo = true;
      break;
    }
  }

  return {
    seccionRecomendada: seccionElegida,
    caidaTensionPorcentaje,
    cumpleCapacidadCorriente,
    cumpleCaidaTension,
    advertencias: !cumpleTodo ? [...advertencias, 'No se encontró sección que cumpla todas las condiciones.'] : undefined
  };
};
