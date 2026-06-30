import { interruptoresAutomaticosAbiertosSchneider as schneider } from './interruptoresAutomaticosAbiertosSchneider';
import { interruptoresAutomaticosAbiertosABB as abb } from './interruptoresAutomaticosAbiertosABB';
import { interruptoresAutomaticosCompactosSchneider as schneiderCompactos } from './interruptoresAutomaticosCompactosSchneider';
import { interruptoresAutomaticosCompactosABB as abbCompactos } from './interruptoresAutomaticosCompactosABB';

export const catalogoCompletoInterruptoresAbiertos = [
  ...schneider,
  ...abb,
];

export const catalogoCompletoInterruptoresCompactos = [
  ...schneiderCompactos,
  ...abbCompactos,
];
