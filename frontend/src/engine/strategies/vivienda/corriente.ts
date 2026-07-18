import { Project, BaseTablero, CircuitoTerminal, isTablero } from '../../../types/project';

const getTension = (project: Project): number => {
  const isTrifasica = project.tipoInstalacion === 'Trifásica';
  return isTrifasica ? 400 * Math.sqrt(3) : 230;
};

// Función auxiliar para calcular potencia según normas si no existe
const getPotenciaCircuito = (c: any): number => {
    if (c.potencia !== undefined && c.potencia !== null) return c.potencia;
    
    // Si es un CircuitoCalculado (Vivienda)
    if (c.tipo) {
        switch (c.tipo) {
            case 'iluminacion_usos_generales': 
                return c.tieneTomacorrientesDerivados ? 2200 : (2 / 3) * (c.puntosIUG || 0) * 60;
            case 'tomacorrientes_usos_generales': return 2200;
            case 'usos_especiales': return 3300;
            case 'usos_especificos_mbtf': return c.potenciaManual || 0;
            default: return 0;
        }
    }
    
    // Caso de uso industrial/comercial (CircuitoTerminal)
    switch (c.tipo) {
        case 'iluminacion_usos_generales': 
            return c.tieneTomacorrientesDerivados ? 2200 : (2 / 3) * (c.puntosIUG || 0) * 60;
        case 'tomacorrientes_usos_generales': return 2200;
        case 'usos_especiales': return 3300;
        case 'usos_especificos': return c.potenciaManual || 0;
        default: return 0;
    }
};

export const getTableroNominalCurrent = (tablero: BaseTablero, project: Project): number => {
    // 1. Si es el tablero principal, usamos la DPMS calculada para la vivienda
    if (isTablero(tablero) && tablero.nombre.toLowerCase().includes('principal') && project.datosVivienda?.potenciaMaximaSimultanea) {
        return project.datosVivienda.potenciaMaximaSimultanea / getTension(project);
    }

    // 2. Si tiene potenciaTotal definida (caso TableroSeccional), usarla
    if ('potenciaTotal' in tablero && (tablero as any).potenciaTotal) {
        return (tablero as any).potenciaTotal / getTension(project);
    }
    
    // 3. Caso contrario (Tableros Seccionales / Otros), sumar las potencias de sus circuitos y subtableros
    let totalPotencia = 0;
    if (tablero.circuitosTerminales) {
        totalPotencia += tablero.circuitosTerminales.reduce((acc, c) => acc + getPotenciaCircuito(c), 0);
    }
    if (tablero.subTableros) {
        totalPotencia += tablero.subTableros.reduce((acc, sub) => acc + ( (sub as any).potenciaTotal || 0), 0);
    }
    
    return totalPotencia / getTension(project);
};

export const getCircuitoNominalCurrent = (circuito: CircuitoTerminal, project: Project): number => {
  return getPotenciaCircuito(circuito) / getTension(project);
};
