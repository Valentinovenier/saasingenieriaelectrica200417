import { DatosVivienda } from '../../../types/vivienda';
import { FACTORES_SIMULTANEIDAD_VIVIENDA } from '../../../data/vivienda/factoresSimultaneidad';

// ... (se mantienen funciones previas calcularSuperficieLimite, determinarGradoElectrificacion, obtenerCircuitosMinimos, calcularPuntosMinimosAmbiente)

/**
 * AEA 770: Calcula la Potencia Instalada (PI) y la Demanda de Potencia Máxima Simultánea (DPMS)
 */
export const calcularPotencias = (circuitos: any[]): { potenciaInstalada: number; potenciaMaximaSimultanea: number } => {
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
                potenciaCircuito = 0; 
                break;
            default:
                potenciaCircuito = 0;
        }
        potenciaTotal += potenciaCircuito;
    });

    const cantidad = circuitos.length;
    // Obtener factor según la tabla, default 0.6 para más de 6
    const factorSimultaneidad = (FACTORES_SIMULTANEIDAD_VIVIENDA.cantidadCircuitos as any)[cantidad] || 0.6;
    
    return {
        potenciaInstalada: potenciaTotal,
        potenciaMaximaSimultanea: potenciaTotal * factorSimultaneidad
    };
};
