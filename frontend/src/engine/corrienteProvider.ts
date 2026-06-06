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
  const metodoNormalizado = metodo.toUpperCase().replace('METODO', '').trim();
  
  // Mapeo de métodos E, F, G a normas B52-10 a B52-13
  const mapaMetodoNorma: Record<string, string[]> = {
      'E': ['B52-10', 'B52-11', 'B52-12', 'B52-13'],
      'F': ['B52-10', 'B52-11', 'B52-12', 'B52-13'],
      'G': ['B52-10', 'B52-11', 'B52-12', 'B52-13']
  };

  const normasPrioritarias = mapaMetodoNorma[metodoNormalizado];

  const tabla = TABLAS_CORRIENTE_SAEA.find(t => {
    // Si buscamos E, F, G, usar normas prioritarias
    if (normasPrioritarias) {
        if (!normasPrioritarias.includes(t.norma)) return false;
    } else {
        // Para otros métodos, evitar tablas B52-10 a B52-13
        if (t.norma.startsWith('B52-1')) return false;
    }

    return t.material === material &&
           t.aislacion === aislacion &&
           t.nConductoresCargados === nConductoresBuscado;
  });

  if (!tabla) {
      console.log(`[DEBUG] No se encontró tabla para: Mat=${material}, Aisl=${aislacion}, nCarg=${nConductoresBuscado}, Metodo=${metodoNormalizado}`);
      return undefined;
  }
  
  console.log(`[DEBUG] Tabla seleccionada: Norma=${tabla.norma}, Mat=${tabla.material}, Aisl=${tabla.aislacion}, nCarg=${tabla.nConductoresCargados}`);

  if (!tabla.datos[seccion]) {
      console.log(`[DEBUG] No se encontró sección ${seccion} en la tabla ${tabla.norma}`);
      return undefined;
  }

  const datosSeccion = tabla.datos[seccion];
  
  // Función auxiliar para buscar en objetos anidados
  const buscarEnObjeto = (obj: any, keyBusqueda: string, disp?: string): number | undefined => {
      if (typeof obj !== 'object' || obj === null) return undefined;
      
      const keys = Object.keys(obj);
      // Buscar clave exacta o difusa del método (manejando el prefijo 'metodo' en datos)
      const keyFound = keys.find(k => k.toUpperCase().replace('METODO', '').trim() === keyBusqueda) 
                    || keys.find(k => k.toLowerCase().includes(keyBusqueda.toLowerCase()));
      
      if (!keyFound) return undefined;
      
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
      return buscarEnObjeto(datosSeccion[tipoCable], metodoNormalizado, disposicion);
  }

  return buscarEnObjeto(datosSeccion, metodoNormalizado, disposicion);
};
