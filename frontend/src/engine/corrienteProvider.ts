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
  const nConductoresBuscado = esTrifasico ? 3 : 2;
  const tabla = TABLAS_CORRIENTE_SAEA.find(t =>
    t.material === material &&
    t.aislacion === aislacion &&
    t.nConductoresCargados === nConductoresBuscado
  );

  if (!tabla) {
      console.log(`[DEBUG] No se encontró tabla para: Mat=${material}, Aisl=${aislacion}, nCarg=${nConductoresBuscado}`);
      return undefined;
  }
  
  console.log(`[DEBUG] Tabla seleccionada: Norma=${tabla.norma}, Mat=${tabla.material}, Aisl=${tabla.aislacion}, nCarg=${tabla.nConductoresCargados}`);

  if (!tabla.datos[seccion]) {
      console.log(`[DEBUG] No se encontró sección ${seccion} en la tabla ${tabla.norma}`);
      return undefined;
  }

  const datosSeccion = tabla.datos[seccion];
  const metodoNormalizado = metodo.toUpperCase().replace('METODO', '').trim();
  
  // Función auxiliar para buscar en objetos anidados
  const buscarEnObjeto = (obj: any, keyBusqueda: string, disp?: string): number | undefined => {
      if (typeof obj !== 'object' || obj === null) return undefined;
      
      const keys = Object.keys(obj);
      console.log(`[DEBUG] Buscando "${keyBusqueda}" en objeto con keys:`, keys);
      
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
          if (valor[disp]) return valor[disp];
          
          const dispKeys = Object.keys(valor);
          const dispFound = dispKeys.find(k => k.toLowerCase().includes(disp.toLowerCase()));
          if (dispFound) return valor[dispFound];
      }
      
      if (typeof valor === 'object') {
          return Object.values(valor).find(v => typeof v === 'number') as number | undefined;
      }
      
      return undefined;
  };

  if (tipoCable && datosSeccion[tipoCable]) {
      console.log(`[DEBUG] Estructura anidada para ${tipoCable}`);
      return buscarEnObjeto(datosSeccion[tipoCable], metodoNormalizado, disposicion);
  }

  console.log(`[DEBUG] Estructura directa`);
  return buscarEnObjeto(datosSeccion, metodoNormalizado, disposicion);
};
