import { calcularTramoResidencial } from './calculador';
import { CondicionesTramoResidencial } from '../../types/vivienda';

const test = () => {
  const condiciones: CondicionesTramoResidencial = {
    tipoCircuito: 'tomacorrientes_usos_generales',
    metodoInstalacion: 'B2',
    longitudMetros: 20,
    corrienteDiseñoAmperes: 16,
    temperaturaAmbiente: 30,
    cantidadCircuitosAgrupados: 1,
  };

  const resultado = calcularTramoResidencial(condiciones);
  console.log('Resultado de prueba:', resultado);
  
  if (resultado.seccionRecomendada >= 2.5 && resultado.cumpleCapacidadCorriente && resultado.cumpleCaidaTension) {
    console.log('Test PASSED');
  } else {
    console.log('Test FAILED');
  }
};

test();
