import { ProjectStrategy } from '../../types/project';

// Esta interfaz base define el contrato que cada estrategia de proyecto (Industrial, Vivienda, Comercial) debe cumplir.
// Se puede expandir a medida que necesitemos más métodos comunes.
export interface BaseProjectStrategy extends ProjectStrategy {
  // Aquí podemos añadir métodos compartidos si fuera necesario en el futuro.
}
