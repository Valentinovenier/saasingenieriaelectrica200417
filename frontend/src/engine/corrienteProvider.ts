import { TABLAS_CORRIENTE_SAEA } from '../data/corrientesNormativasAdmisibles';

export const getAdmisible = (
  seccion: number,
  metodo: string,
  esTrifasico: boolean,
  material: 'Cobre' | 'Aluminio',
  aislacion: 'PVC' | 'XLPE' | 'Mineral',
  disposicion?: string,
  tipoCable?: 'unipolar' | 'multipolar'
): number | undefined => {
  const tabla = TABLAS_CORRIENTE_SAEA.find(t =>
    t.material === material &&
    t.aislacion === aislacion &&
    (esTrifasico ? t.nConductoresCargados === 3 : t.nConductoresCargados === 2)
  );

  if (!tabla || !tabla.datos[seccion]) return undefined;

  const datosSeccion = tabla.datos[seccion];
  const metodoNormalizado = metodo.toUpperCase().replace('METODO', '').trim();

  // Función auxiliar para buscar en objetos anidados
  const buscarEnObjeto = (obj: any, keyBusqueda: string, disp?: string): number | undefined => {
      if (typeof obj !== 'object' || obj === null) return undefined;
      
      // Buscar clave exacta o difusa del método
      const keys = Object.keys(obj);
      const keyFound = keys.find(k => k.toUpperCase().replace('METODO', '').trim() === keyBusqueda) 
                    || keys.find(k => k.toLowerCase().includes(keyBusqueda.toLowerCase()));
      
      if (!keyFound) return undefined;
      
      const valor = obj[keyFound];
      if (typeof valor === 'number') return valor;
      
      if (typeof valor === 'object' && disp) {
          // Intentar buscar disposición exacta
          if (valor[disp]) return valor[disp];
          
          // Búsqueda difusa de disposición
          const dispKeys = Object.keys(valor);
          const dispFound = dispKeys.find(k => k.toLowerCase().includes(disp.toLowerCase()));
          if (dispFound) return valor[dispFound];
      }
      
      // Si es objeto pero no se encontró disposición específica, retornar el primer valor numérico
      if (typeof valor === 'object') {
          return Object.values(valor).find(v => typeof v === 'number') as number | undefined;
      }
      
      return undefined;
  };

  // 1. Si hay tipo de cable (Estructuras anidadas unipolar/multipolar)
  if (tipoCable && datosSeccion[tipoCable]) {
      return buscarEnObjeto(datosSeccion[tipoCable], metodoNormalizado, disposicion);
  }

  // 2. Intento de búsqueda directa en el nivel superior (ej. tablas Mineral)
  return buscarEnObjeto(datosSeccion, metodoNormalizado, disposicion);
};
