import { Project, Tablero, TableroSeccional, CircuitoTerminal } from '../../../types/project';

export const getAggregateCurrent = (node: any, currentProject: Project): number => {
  let total = 0;
  if (node.circuitosTerminales && Array.isArray(node.circuitosTerminales)) {
    total += node.circuitosTerminales.reduce((acc: number, c: any) => {
      // Usamos la potencia para la estimación en la fase de configuración
      return acc + (c.potencia || 0) / 220; 
    }, 0);
  }
  if (node.subTableros && Array.isArray(node.subTableros)) {
    total += node.subTableros.reduce((acc: number, sub: any) => {
      return acc + getAggregateCurrent(sub, currentProject);
    }, 0);
  }
  return total;
};

export const getEffectiveCurrent = (circuito: CircuitoTerminal, currentProject: Project): number => {
  return (circuito.potencia || 0) / 220;
};
