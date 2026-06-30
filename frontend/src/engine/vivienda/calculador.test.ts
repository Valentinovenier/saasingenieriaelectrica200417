import { calcularTramoResidencial } from './calculador';
import { CondicionesTramoResidencial } from '../../types/vivienda';
import { Project } from '../../types/project';

const test = () => {
  const mockProject: Project = {
    id: 'test',
    name: 'Test Project',
    projectType: 'Vivienda',
    createdAt: '',
    status: 'draft',
    armonicos: { habilitado: false, modoEntrada: 'porcentaje', h3: 0, h5: 0, h7: 0, h9: 0 },
    tableros: []
  };

  const condiciones: CondicionesTramoResidencial = {
    tipoTramo: 'CircuitoTerminal',
    tipoCircuito: 'tomacorrientes_usos_generales',
    metodoInstalacion: 'B2',
    longitudMetros: 20,
    corrienteDiseñoAmperes: 16,
    temperaturaAmbiente: 30,
    canalizacionId: 'can1',
  };

  const resultado = calcularTramoResidencial(condiciones, mockProject);
  console.log('Resultado de prueba:', resultado);
  
  if (resultado.seccionRecomendada >= 2.5 && resultado.cumpleCapacidadCorriente && resultado.cumpleCaidaTension) {
    console.log('Test PASSED');
  } else {
    console.log('Test FAILED');
  }
};

test();
