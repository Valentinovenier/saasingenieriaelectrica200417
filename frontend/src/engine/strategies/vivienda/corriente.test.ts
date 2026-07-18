import { getCircuitoNominalCurrent } from './corriente';

describe('getCircuitoNominalCurrent', () => {
    it('should calculate nominal current for TUG', () => {
        const mockProject = {
            tipoInstalacion: 'Monofásica',
        } as any;

        const mockCircuito = {
            id: 'c1',
            nombre: 'Circuito 1',
            tipo: 'tomacorrientes_usos_generales',
        } as any;

        const current = getCircuitoNominalCurrent(mockCircuito, mockProject);
        // 2200 VA / 230 V = 9.565 A
        expect(current).toBeCloseTo(9.565, 2);
    });
});
