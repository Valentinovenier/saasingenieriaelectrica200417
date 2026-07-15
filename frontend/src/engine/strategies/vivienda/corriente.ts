import { Project, BaseTablero, CircuitoTerminal, isTablero } from '../../../types/project';

const getTension = (project: Project): number => {
  const isTrifasica = project.tipoInstalacion === 'Trifásica';
  return isTrifasica ? 400 * Math.sqrt(3) : 230;
};

export const getTableroNominalCurrent = (tablero: BaseTablero, project: Project): number => {
    // 1. Si es el tablero principal, usamos la DPMS calculada para la vivienda
    if (isTablero(tablero) && tablero.nombre.toLowerCase().includes('principal') && project.datosVivienda?.potenciaMaximaSimultanea) {
        console.log(`DEBUG [getTableroNominalCurrent] Principal: ${project.datosVivienda.potenciaMaximaSimultanea}`);
        return project.datosVivienda.potenciaMaximaSimultanea / getTension(project);
    }

    // 2. Si tiene potenciaTotal definida (caso TableroSeccional), usarla
    if ('potenciaTotal' in tablero && (tablero as any).potenciaTotal) {
        console.log(`DEBUG [getTableroNominalCurrent] PotenciaTotal: ${(tablero as any).potenciaTotal}`);
        return (tablero as any).potenciaTotal / getTension(project);
    }
    
    // 3. Caso contrario (Tableros Seccionales / Otros), sumar las potencias de sus circuitos y subtableros
    let totalPotencia = 0;
    if (tablero.circuitosTerminales) {
        totalPotencia += tablero.circuitosTerminales.reduce((acc, c) => {
            console.log(`DEBUG [getTableroNominalCurrent] Circuito ${c.nombre}: ${c.potencia}`);
            return acc + (c.potencia || 0);
        }, 0);
    }
    if (tablero.subTableros) {
        totalPotencia += tablero.subTableros.reduce((acc, sub) => acc + ( (sub as any).potenciaTotal || 0), 0);
    }
    
    console.log(`DEBUG [getTableroNominalCurrent] Total: ${totalPotencia}`);
    return totalPotencia / getTension(project);
};

export const getCircuitoNominalCurrent = (circuito: CircuitoTerminal, project: Project): number => {
  console.log(`DEBUG [getCircuitoNominalCurrent] ${circuito.nombre}: ${circuito.potencia}`);
  return (circuito.potencia || 0) / getTension(project);
};
