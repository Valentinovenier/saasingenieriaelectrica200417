import { CondicionesTramoResidencial, ResultadoCalculoResidencial } from '../../types/vivienda';
import { Project } from '../../types/project';
import { getAdmisible } from '../corrienteProvider';
import { IMPEDANCIAS_CABLES_VIVIENDA } from '../../data/vivienda/impedancias';
import { SECCIONES_MINIMAS_VIVIENDA } from '../../data/vivienda/seccionesMinimas';
import { getFactorTemperatura, getFactorAgrupamiento } from '../helpers/normativeFactors';
import { getCircuitosPorCanalizacion } from '../canalizacionService';
import { calcularImpedanciaTransformador } from '../transformador';

export const calcularTramoResidencial = (
  condiciones: CondicionesTramoResidencial,
  project: Project
): ResultadoCalculoResidencial => {
  // 1. Determinar número de circuitos agrupados automáticamente
  const nCircuitos = condiciones.canalizacionId 
    ? getCircuitosPorCanalizacion(project, condiciones.canalizacionId).length || 1 
    : 1;

  // Cálculo de Impedancia Aguas Arriba (Transformador + Acometida)
  let Z_upstream = { r: 0.05, x: 0.05 }; 
  
  if (project.transformador) {
    const Z_trafo = calcularImpedanciaTransformador({
        potenciaKVA: Number(project.transformador.potencia),
        tensionSecundarioV: Number(project.transformador.tensionSecundario),
        uccPorcentaje: project.transformador.uccPorcentaje,
        PccW: project.transformador.PccW,
        tipo: project.transformador.tipo
      });
    Z_upstream.r += Z_trafo.r;
    Z_upstream.x += Z_trafo.x;
  }

  if (project.acometida) {
    const seccionStr = project.acometida.seccion.toFixed(1);
    
    // Aquí podríamos refinar más la búsqueda usando el material y aislación
    // Por ahora, usamos el mapa existente que asume cobre (o adaptamos el mapa)
    const impCable = IMPEDANCIAS_CABLES_VIVIENDA[seccionStr] || { r: 0.5, x: 0.1 };
    
    // Ajuste simple por material (Aluminio tiene ~1.6 veces más resistencia que Cobre)
    const factorMaterial = project.acometida.material === 'Aluminio' ? 1.6 : 1.0;
    
    const longitudKm = project.acometida.longitud / 1000;
    
    Z_upstream.r += impCable.r * factorMaterial * longitudKm;
    Z_upstream.x += impCable.x * longitudKm;
  }

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

    // 3.3. Verificar Cortocircuito (TÉCNICO)
    if (impedancia) {
        // Impedancia del tramo
        const rTramo = impedancia.r * (condiciones.longitudMetros / 1000);
        const xTramo = impedancia.x * (condiciones.longitudMetros / 1000);

        // Bucle de falla (Fase + Neutro -> x2)
        const R_total = (Z_upstream.r + rTramo) * 2; 
        const X_total = (Z_upstream.x + xTramo) * 2;
        const Z_total = Math.sqrt(R_total**2 + X_total**2);

        // Icc = U / Z
        const Icc_kA = (220 / Z_total) / 1000;

        // Verificación conservadora: ¿El interruptor aguanta 3kA? (Poder de corte estándar)
        // Debería ser un campo configurable, asumimos 3kA para vivienda.
        cumpleCortocircuito = Icc_kA <= 3.0; 
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
