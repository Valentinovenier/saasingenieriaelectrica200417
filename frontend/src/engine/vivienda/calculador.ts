import { CondicionesTramoResidencial, ResultadoCalculoResidencial } from '../../types/vivienda';
import { SECCIONES_MINIMAS_VIVIENDA } from '../../data/vivienda/seccionesMinimas';
import { CAPACIDAD_CORRIENTE_VIVIENDA } from '../../data/vivienda/corrientesAdmisibles';
import { PARAMETROS_CALCULO_VIVIENDA } from '../../data/vivienda/parametrosCalculo';
import { IMPEDANCIAS_CABLES_VIVIENDA } from '../../data/vivienda/impedancias';

export const calcularTramoResidencial = (
  condiciones: CondicionesTramoResidencial
): ResultadoCalculoResidencial => {
  // 1. Determinar sección mínima
  let seccionMinima = SECCIONES_MINIMAS_VIVIENDA.circuitosSeccionales; 
  
  // 2. Obtener todas las secciones disponibles y ordenar
  const seccionesDisponibles = Object.keys(CAPACIDAD_CORRIENTE_VIVIENDA.conEnvoltura.B2).map(Number).sort((a,b) => a - b);

  // 3. Bucle de selección iterativa
  let seccionElegida = seccionesDisponibles.find(s => s >= seccionMinima) || seccionMinima;
  let cumpleTodo = false;
  let caidaTensionPorcentaje = 0;
  let cumpleCapacidadCorriente = false;
  let cumpleCaidaTension = false;
  let cumpleCortocircuito = false;

  for (const s of seccionesDisponibles.filter(s => s >= seccionElegida)) {
    // 3.1. Obtener I_z corregida
    const datosCapacidad = CAPACIDAD_CORRIENTE_VIVIENDA.conEnvoltura.B2[s.toString() as keyof typeof CAPACIDAD_CORRIENTE_VIVIENDA.conEnvoltura.B2];
    const IzBase = datosCapacidad ? datosCapacidad['3x'] : 0;
    const factorAgrupamiento = condiciones.cantidadCircuitosAgrupados > 1 ? 0.8 : 1.0; 
    const IzCorregida = IzBase * factorAgrupamiento;

    cumpleCapacidadCorriente = IzCorregida >= condiciones.corrienteDiseñoAmperes;

    // 3.2. Verificar caída de tensión
    caidaTensionPorcentaje = (condiciones.corrienteDiseñoAmperes * condiciones.longitudMetros * 0.02) / 220 * 100;
    cumpleCaidaTension = caidaTensionPorcentaje <= PARAMETROS_CALCULO_VIVIENDA.limitesCaidaTension.iluminacionTomacorrientes;

    // 3.3. Verificar Cortocircuito (Simplificado según norma: Icc mínima para actuación protección)
    const impedancia = IMPEDANCIAS_CABLES_VIVIENDA[s.toString()];
    if (impedancia) {
        const IccPresunta = 220 / ((impedancia.r * condiciones.longitudMetros / 1000) * 1.5); // Simplificación
        cumpleCortocircuito = IccPresunta > (condiciones.corrienteDiseñoAmperes * 10); // Ejemplo simplificado
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
    advertencias: !cumpleTodo ? ['No se encontró sección que cumpla todas las condiciones (incluyendo cortocircuito).'] : undefined
  };
};
