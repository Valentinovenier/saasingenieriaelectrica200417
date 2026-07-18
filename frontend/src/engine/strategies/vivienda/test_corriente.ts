import { getCircuitoNominalCurrent } from './corriente';

const mockProject = {
    tipoInstalacion: 'Monofásica',
} as any;

const mockCircuito = {
    id: 'c1',
    nombre: 'Circuito 1',
    tipo: 'tomacorrientes_usos_generales',
    puntosIUG: 0,
    puntosTUG: 1,
    puntosTUE: 0,
    tieneTomacorrientesDerivados: false,
} as any;

console.log('Nominal current:', getCircuitoNominalCurrent(mockCircuito, mockProject));
