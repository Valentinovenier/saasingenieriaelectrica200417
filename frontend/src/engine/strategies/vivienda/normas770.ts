import { DatosVivienda } from '../../../types/vivienda';
import { FACTORES_SIMULTANEIDAD_VIVIENDA } from '../../../data/vivienda/factoresSimultaneidad';

/**
 * AEA 770: Determina la superficie límite de aplicación
 */
export const calcularSuperficieLimite = (datos: DatosVivienda): number => {
  if (datos.superficieLimiteManual) {
    return datos.superficieLimiteManual;
  }
  return datos.superficieCubierta + (datos.superficieSemicubierta * 0.5);
};

/**
 * AEA 770: Determina el grado de electrificación
 */
export const determinarGradoElectrificacion = (superficieLimite: number): 'Minimo' | 'Medio' | 'Elevado' | 'Superior' => {
  if (superficieLimite < 60) return 'Minimo';
  if (superficieLimite < 130) return 'Medio';
  if (superficieLimite < 200) return 'Elevado';
  return 'Superior';
};

/**
 * AEA 770: Define la cantidad mínima de circuitos por grado
 */
export const obtenerCircuitosMinimos = (grado: 'Minimo' | 'Medio' | 'Elevado' | 'Superior'): number => {
  const minimos = {
    'Minimo': 2,
    'Medio': 3,
    'Elevado': 5,
    'Superior': 6
  };
  return minimos[grado];
};

/**
 * AEA 770: Determina la cantidad mínima de bocas de IUG y TUG basándose en la Tabla 770.7.III.
 */
export const calcularPuntosMinimosAmbiente = (
  tipoAmbiente: string, 
  superficie: number, 
  longitud: number, 
  grado: 'Minimo' | 'Medio' | 'Elevado' | 'Superior' = 'Minimo'
) => {
    let iug = 0;
    let tug = 0;

    const tipo = tipoAmbiente.toLowerCase();

    // 1. Estar, Comedor, Escritorio, etc.
    if (tipo.includes('estar') || tipo.includes('comedor') || tipo.includes('estudio') || tipo.includes('biblioteca')) {
        iug = Math.max(1, Math.ceil(superficie / 18));
        tug = Math.max(2, Math.ceil(superficie / 6));
    } 
    // 2. Dormitorios (Lógica por superficie)
    else if (tipo.includes('dormitorio')) {
        if (superficie < 10) {
            iug = 1; tug = 2;
        } else if (superficie <= 36) {
            iug = 1; tug = 3;
        } else {
            // Dormitorio > 36m2 se considera Grado Elevado según Nota 1
            iug = 2; tug = 3;
        }
    }
    // 3. Cocina
    else if (tipo.includes('cocina')) {
        iug = 1; 
        tug = 3; 
    }
    // 4. Baño
    else if (tipo.includes('baño') || tipo.includes('banio')) {
        iug = 1; tug = 1;
    }
    // 5. Vestíbulo, Garage, Hall, Vestidor
    else if (tipo.includes('vestibulo') || tipo.includes('garage') || tipo.includes('hall') || tipo.includes('vestidor')) {
        iug = 1;
        tug = Math.max(1, Math.ceil(superficie / 12));
    }
    // 6. Pasillos Cubiertos
    else if (tipo.includes('pasillo')) {
        iug = Math.max(1, Math.ceil(longitud / 5));
        tug = 0;
    }
    // 7. Lavadero
    else if (tipo.includes('lavadero')) {
        iug = 1; tug = 1;
    }
    // 8. Semicubiertos (Balcones, Galerías)
    else if (tipo.includes('balcon') || tipo.includes('galeria') || tipo.includes('semicubierto')) {
        iug = Math.max(1, Math.ceil(longitud / 5));
        tug = 0;
    }
    else {
        iug = 1; tug = 1;
    }

    return { iug, tug };
};

/**
 * AEA 770: Calcula la Potencia Instalada (PI) y la Demanda de Potencia Máxima Simultánea (DPMS)
 * 
 * Basado en Tabla 770.8.1:
 * - IUG (sin tomas derivados): (2/3) * puntos * 60 VA
 * - IUG (con tomas derivados): 2200 VA
 * - TUG (Tomacorrientes): 2200 VA
 * - TUE (Usos Especiales): 3300 VA
 */
export const calcularPotencias = (circuitos: any[], grado: 'Minimo' | 'Medio' | 'Elevado' | 'Superior'): { potenciaInstalada: number; potenciaMaximaSimultanea: number } => {
    let potenciaTotal = 0;

    circuitos.forEach(circ => {
        let potenciaCircuito = 0;
        
        switch (circ.tipo) {
            case 'iluminacion_usos_generales':
                if (circ.tieneTomacorrientesDerivados) {
                    potenciaCircuito = 2200;
                } else {
                    potenciaCircuito = (2 / 3) * (circ.puntosIUG || 0) * 60;
                }
                break;
            case 'tomacorrientes_usos_generales':
                potenciaCircuito = 2200;
                break;
            case 'usos_especiales':
                potenciaCircuito = 3300;
                break;
            case 'usos_especificos':
                potenciaCircuito = circ.potenciaManual || 0; 
                break;
            default:
                potenciaCircuito = 0;
        }
        potenciaTotal += potenciaCircuito;
    });

    const minimos = obtenerCircuitosMinimos(grado);
    // Obtener factor según la tabla AEA 770.7.IV (cantidad de circuitos MÍNIMOS del grado)
    const factorSimultaneidad = (FACTORES_SIMULTANEIDAD_VIVIENDA.cantidadCircuitos as any)[minimos] || 0.6;
    
    return {
        potenciaInstalada: potenciaTotal,
        potenciaMaximaSimultanea: potenciaTotal * factorSimultaneidad
    };
};
