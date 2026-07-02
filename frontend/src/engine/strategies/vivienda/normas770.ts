import { DatosVivienda } from '../../../types/vivienda';

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
    'Minimo': 3,
    'Medio': 5,
    'Elevado': 8,
    'Superior': 12
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
 * AEA 770: Calcula la Demanda de Potencia Máxima Simultánea (DPMS)
 * Basado en la cantidad de bocas y coeficientes de simultaneidad.
 */
export const calcularDPMS = (circuitos: any[]): number => {
    let potenciaTotal = 0;
    
    // Potencia estimada por boca según norma (valores base)
    const POTENCIA_BOCA_IUG = 100; // VA
    const POTENCIA_BOCA_TUG = 150; // VA

    circuitos.forEach(circ => {
        const potenciaCircuito = (circ.puntosIUG || 0) * POTENCIA_BOCA_IUG + (circ.puntosTUG || 0) * POTENCIA_BOCA_TUG;
        potenciaTotal += potenciaCircuito;
    });

    // Coeficiente de simultaneidad simplificado
    const coefSimultaneidad = circuitos.length > 5 ? 0.7 : 0.8; 
    
    return potenciaTotal * coefSimultaneidad;
};
