import { interruptoresAutomaticosAbiertosSchneider as schneider } from './interruptoresAutomaticosAbiertosSchneider';
import { interruptoresAutomaticosAbiertosABB as abb } from './interruptoresAutomaticosAbiertosABB';

export const catalogoCompletoInterruptoresAbiertos = [
  ...schneider,
  ...abb,
];
