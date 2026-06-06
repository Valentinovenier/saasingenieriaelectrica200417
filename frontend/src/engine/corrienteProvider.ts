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

  if (!tabla) {
      console.log(`[DEBUG] No se encontró tabla para: Mat=${material}, Aisl=${aislacion}, Trifasico=${esTrifasico}`);
      return undefined;
  }
  
  if (!tabla.datos[seccion]) {
      console.log(`[DEBUG] No se encontró sección ${seccion} en la tabla para: Mat=${material}, Aisl=${aislacion}`);
      return undefined;
  }

  const datosSeccion = tabla.datos[seccion];
  const metodoNormalizado = metodo.toUpperCase().replace('METODO', '').trim();
  console.log(`[DEBUG] Buscando Metodo=${metodoNormalizado}, TipoCable=${tipoCable}, DatosSeccion=`, datosSeccion);

  // Función auxiliar para buscar en objetos anidados
  const buscarEnObjeto = (obj: any, keyBusqueda: string, disp?: string): number | undefined => {
      if (typeof obj !== 'object' || obj === null) return undefined;
      
      // Buscar clave exacta o difusa del método
      const keys = Object.keys(obj);
      console.log(`[DEBUG] Keys disponibles en objeto:`, keys);
      
      const keyFound = keys.find(k => k.toUpperCase().replace('METODO', '').trim() === keyBusqueda) 
                    || keys.find(k => k.toLowerCase().includes(keyBusqueda.toLowerCase()));
      
      if (!keyFound) {
          console.log(`[DEBUG] No se encontró clave para ${keyBusqueda}`);
          return undefined;
      }
      
      console.log(`[DEBUG] Clave encontrada: ${keyFound}`);
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
