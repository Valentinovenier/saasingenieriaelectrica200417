import { CondicionesTramoResidencial, ResultadoCalculoResidencial } from '../../../types/vivienda';
import { Project } from '../../../types/project';
import { getAdmisible } from '../industrial/corrienteProvider';
import { IMPEDANCIAS_CABLES_VIVIENDA } from '../../../data/vivienda/impedancias';
import { SECCIONES_MINIMAS_VIVIENDA } from '../../../data/vivienda/seccionesMinimas';
import { getFactorTemperatura } from '../industrial/helpers/normativeFactors';
import { calcularFactorAgrupamiento } from '../industrial/canalizacionService';
import { calcularImpedanciaTransformador } from '../industrial/transformador';
import { PARAMETROS_CALCULO_VIVIENDA } from '../../../data/vivienda/parametrosCalculo';
import { getFactorResistividad } from '../../../data/factoresResistividad';

export const calcularTramoResidencial = (
  condiciones: CondicionesTramoResidencial,
  project: Project
): ResultadoCalculoResidencial => {
  let advertencias: string[] = [];

  // PASO 1: Corriente de Proyecto (IB)
  // La corriente de diseño viene calculada a partir de la DPMS. Si hay cosPhi, lo aplicamos.
  const cosPhi = condiciones.cosPhi || 0.9;
  const I_B = condiciones.corrienteDiseñoAmperes; // Ya asume DPMS / (V * cosPhi) para monofásica

  // PASO 2: Selección de Sección Mínima Reglamentaria (Tabla 770.11.I)
  let seccionMinima = 1.5;

  switch (condiciones.tipoTramo) {
    case 'LineaPrincipal':
        seccionMinima = SECCIONES_MINIMAS_VIVIENDA.lineasPrincipales;
        break;
    case 'LineaSeccional':
        seccionMinima = 2.5; // Valor seguro base para líneas seccionales en vivienda
        break;
    case 'CircuitoTerminal':
        switch (condiciones.tipoCircuito) {
            case 'iluminacion_usos_generales':
            seccionMinima = SECCIONES_MINIMAS_VIVIENDA.terminalesIluminacion;
            break;
            case 'tomacorrientes_usos_generales':
            case 'usos_especiales':
            seccionMinima = SECCIONES_MINIMAS_VIVIENDA.terminalesTomacorrientes;
            break;
            case 'usos_especificos_mbtf':
            seccionMinima = SECCIONES_MINIMAS_VIVIENDA.usosEspecificosMBTF;
            break;
        }
        break;
  }

  // Agrupamiento (N° de circuitos en la misma canalización)
  const canalizacion = project.canalizaciones?.find(c => c.id === condiciones.canalizacionId);
  const nCircuitos = canalizacion ? canalizacion.conductorIds.length : 1;

  // Obtenemos secciones comerciales
  const seccionesComerciales = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70];
  let seccionElegida = seccionesComerciales.find(s => s >= seccionMinima) || seccionMinima;
  
  let cumpleTodo = false;
  let caidaTensionPorcentaje = 0;
  let IzCorregida = 0;
  let termomagneticaRecomendada = 0;

  // Calculamos la impedancia aguas arriba para el cortocircuito presunto
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
    const impCable = IMPEDANCIAS_CABLES_VIVIENDA[project.acometida.seccion.toFixed(1)] || { r: 0.5, x: 0.1 };
    const longitudKm = project.acometida.longitud / 1000;
    Z_upstream.r += impCable.r * longitudKm;
    Z_upstream.x += impCable.x * longitudKm;
  }

  const valoresTermomagneticas = [10, 15, 16, 20, 25, 32, 40, 50, 63];

  for (const s of seccionesComerciales.filter(sec => sec >= seccionElegida)) {
    // PASO 3: Capacidad de Conducción (Iz)
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

    if (!IzBase) {
        continue;
    }

    const esInstalacionAire = !(condiciones.metodoInstalacion || '').toUpperCase().startsWith('D');
    const factorTemp = getFactorTemperatura('PVC', condiciones.temperaturaAmbiente, esInstalacionAire, condiciones.tempSuelo);
    const factorAgrup = calcularFactorAgrupamiento(nCircuitos, canalizacion);
    const factorResistividad = condiciones.resistividadTermica ? getFactorResistividad(condiciones.metodoInstalacion, condiciones.resistividadTermica) : 1.0;
    IzCorregida = IzBase * factorTemp * factorAgrup * factorResistividad;

    // PASO 4: Coordinación con Protección Termomagnética (I_B <= I_N <= I_Z)
    // Buscamos un valor comercial de termomagnética que proteja el cable y permita la carga
    const InPosibles = valoresTermomagneticas.filter(In => In >= I_B && In <= IzCorregida);
    
    if (InPosibles.length === 0) {
        // Ninguna termomagnética sirve, pasamos a la siguiente sección
        continue;
    }
    
    termomagneticaRecomendada = InPosibles[0]; // La menor que cumpla

    // PASO 5: Verificación de Caída de Tensión
    const impedancia = IMPEDANCIAS_CABLES_VIVIENDA[s.toFixed(1)] || IMPEDANCIAS_CABLES_VIVIENDA[s.toString()];
    if (impedancia) {
      const sinPhi = Math.sqrt(1 - Math.pow(cosPhi, 2));
      const longitudKm = condiciones.longitudMetros / 1000;
      // Fórmula monofásica exacta: ΔV = 2 * L * IB * (R*cosφ + X*sinφ)
      const dv = 2 * I_B * longitudKm * (impedancia.r * cosPhi + impedancia.x * sinPhi);
      caidaTensionPorcentaje = (dv / 220) * 100;
    } else {
      caidaTensionPorcentaje = (I_B * condiciones.longitudMetros * 0.02) / 220 * 100;
    }
    
    // Límite AEA 770.15.6
    let limiteCaida = PARAMETROS_CALCULO_VIVIENDA.limitesCaidaTension.iluminacionTomacorrientes;
    if (condiciones.tipoCircuito.includes('fuerza_motriz') || condiciones.tipoCircuito.includes('especificos')) {
        limiteCaida = PARAMETROS_CALCULO_VIVIENDA.limitesCaidaTension.motoresRegimen;
    }
    if (condiciones.tipoTramo === 'LineaPrincipal') {
        limiteCaida = PARAMETROS_CALCULO_VIVIENDA.limitesCaidaTension.recomendacionSeccionales;
    }

    if (caidaTensionPorcentaje > limiteCaida) {
        // Si no cumple caída de tensión, iteramos a la siguiente sección
        continue;
    }

    // PASO 6: Verificación de Cortocircuito (I²t <= K²S²)
    if (impedancia) {
        const rTramo = impedancia.r * (condiciones.longitudMetros / 1000);
        const xTramo = impedancia.x * (condiciones.longitudMetros / 1000);
        const Z_total = Math.sqrt(Math.pow((Z_upstream.r + rTramo)*2, 2) + Math.pow((Z_upstream.x + xTramo)*2, 2));
        const Icc_A = (220 / Z_total); // Corriente de cortocircuito presunta al final del tramo
        
        // Verificación térmica: Icc^2 * t <= K^2 * S^2
        // Asumiendo t = 0.1s para curva C y K = 115 para Cobre/PVC
        const K = 115;
        const energiaFalla = Math.pow(Icc_A, 2) * 0.1;
        const capacidadCable = Math.pow(K * s, 2);
        
        if (energiaFalla > capacidadCable) {
            continue; // No soporta el cortocircuito
        }
    }

    // Si llegamos hasta aquí, todas las verificaciones rigurosas pasaron
    seccionElegida = s;
    cumpleTodo = true;
    break;
  }

  if (!cumpleTodo) {
      advertencias.push('No se encontró una sección comercial que cumpla todos los criterios rigurosos de AEA 770 para este tramo.');
  } else {
      advertencias.push(`Protección recomendada: Interruptor termomagnético de ${termomagneticaRecomendada}A (Curva C).`);
  }

  return {
    seccionRecomendada: seccionElegida,
    caidaTensionPorcentaje,
    cumpleCapacidadCorriente: cumpleTodo,
    cumpleCaidaTension: cumpleTodo,
    advertencias: advertencias.length > 0 ? advertencias : undefined
  };
};
