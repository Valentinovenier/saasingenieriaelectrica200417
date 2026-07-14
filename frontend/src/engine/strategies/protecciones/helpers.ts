import { Conductor, Project, BaseTablero, CircuitoTerminal } from '../../../types/project';
import { valoresEnergiaPasante } from '../../../data/energiaPasante';

/**
 * Obtiene el factor K de la norma IEC para el cálculo de I2t del cable.
 */
export const getFactorK = (material?: string, aislacion?: string): number => {
    const mat = material?.toLowerCase() || 'cobre';
    const ais = aislacion?.toLowerCase() || 'pvc';

    if (mat === 'cobre') {
        if (ais === 'xlpe') return 143;
        return 115; // default Cobre/PVC
    } else if (mat === 'aluminio') {
        if (ais === 'xlpe') return 94;
        return 76; // default Aluminio/PVC
    }
    return 115; // default fallback
};

/**
 * Calcula la Energía Pasante Admisible Máxima (K²S²) para un conductor dado.
 * Retorna el valor en A²s o null si falta la sección.
 */
export const calcularEnergiaPasanteAdmisible = (conductor?: Conductor): number | null => {
    if (!conductor) return null;
    const s = conductor.seccion || conductor.resultadoCalculo?.cable?.seccion;
    if (!s) return null;
    const k = getFactorK(conductor.material, conductor.aislacion);
    return Math.pow(k, 2) * Math.pow(s, 2);
};

/**
 * Busca el conductor asociado a un tablero o circuito.
 */
export const getConductorFromNode = (
    node: BaseTablero | CircuitoTerminal,
    project: Project
): Conductor | undefined => {
    // Si es un CircuitoTerminal, tiene el conductor directamente
    if ('conductor' in node) {
        return (node as CircuitoTerminal).conductor;
    }

    // Si es un Tablero (Principal/Vivienda), tiene conductorAlimentacion
    if ('conductorAlimentacion' in node && (node as any).conductorAlimentacion) {
        return (node as any).conductorAlimentacion;
    }

    // Si es TableroSeccionalSimple (Industrial), buscar en project.conductores
    if (project.conductores) {
        const keyIndustrial = `salida-tablero__${node.id}`;
        if (project.conductores[keyIndustrial]) {
            return project.conductores[keyIndustrial];
        }
    }

    // Si es un tablero seccional de vivienda, el conductor suele estar en informeConductores
    if (project.informeConductores) {
        const condInfo = project.informeConductores.find(c =>
            (c as any).destinoNombre === node.nombre
        );
        if (condInfo) {
            return condInfo;
        }
    }
    return undefined;
};

/**
 * Obtiene la energía pasante máxima (I²t) que admite un interruptor según la tabla
 * `valoresEnergiaPasante`. Sólo está contemplada la zona hasta 32 A.
 *
 * @param corrienteNominal Corriente nominal del interruptor (A)
 * @param clase          Clase de limitación (2 o 3)
 * @param tipo           Tipo de curva ("B" o "C")
 * @returns               Valor en A²s o `undefined` si no hay registro.
 */
export const obtenerEnergiaPasanteInterruptor = (
    corrienteNominal: number,
    clase: 2 | 3,
    tipo: 'B' | 'C'
): number | undefined => {
    const rango = corrienteNominal <= 16 ? valoresEnergiaPasante.hasta16A : valoresEnergiaPasante.entre16A32A;
    const claseKey = clase === 2 ? 'clase2' : 'clase3';
    const tipoKey = `tipo${tipo}` as keyof typeof rango[typeof claseKey];
    const map = (rango as any)[claseKey][tipoKey] as Record<number, number>;
    return map[corrienteNominal];
};

/**
 * Recomienda la clase de protección (1, 2 o 3) comparando la energía del conductor
 * con la energía máxima que admite el interruptor.
 *
 * - Si la energía del conductor es mayor o igual que la del interruptor → clase 3.
 * - Si está entre 80 % y 100 % → clase 2.
 * - Menor al 80 % → clase 1 (se requiere protección más restrictiva).
 */
export const recomendarClaseProteccion = (
    energiaConductor: number,
    energiaInterruptor: number
): 1 | 2 | 3 => {
    const ratio = energiaConductor / energiaInterruptor;
    if (ratio >= 1) return 3;
    if (ratio >= 0.8) return 2;
    return 1;
};
