import { Project, BaseTablero, CircuitoTerminal } from '../../../types/project';

const getTension = (project: Project): number => {
  const isTrifasica = project.tipoInstalacion === 'Trifásica';
  return isTrifasica ? 400 * Math.sqrt(3) : 230;
};

export const getTableroNominalCurrent = (tablero: BaseTablero, project: Project): number => {
    // Si tiene potenciaTotal definida (caso TableroSeccional), usarla
    if ('potenciaTotal' in tablero && (tablero as any).potenciaTotal) {
        return (tablero as any).potenciaTotal / getTension(project);
    }
    
    // Caso contrario, sumar las corrientes de sus circuitos y subtableros
    let totalPotencia = 0;
    if (tablero.circuitosTerminales) {
        totalPotencia += tablero.circuitosTerminales.reduce((acc, c) => acc + (c.potencia || 0), 0);
    }
    if (tablero.subTableros) {
        totalPotencia += tablero.subTableros.reduce((acc, sub) => acc + ( (sub as any).potenciaTotal || 0), 0);
    }
    
    return totalPotencia / getTension(project);
};

export const getCircuitoNominalCurrent = (circuito: CircuitoTerminal, project: Project): number => {
  return (circuito.potencia || 0) / getTension(project);
};
