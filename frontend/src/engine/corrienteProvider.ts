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
    // 1. Caso Aislación Mineral: Priorizar B52-8/B52-9
    if (aislacion === 'Mineral') {
        return (t.norma === 'B52-8' || t.norma === 'B52-9') && t.material === material;
    }

    const isB52_10_13 = ['B52-10', 'B52-11', 'B52-12', 'B52-13'].includes(t.norma);
    const isMetodoE_F_G = ['E', 'F', 'G'].includes(metodoNormalizado);

    // 2. Si buscamos E, F, G, solo usar B52-10 a 13
    if (isMetodoE_F_G && !isB52_10_13) return false;
    // 3. Si NO buscamos E, F, G, evitar B52-10 a 13
    if (!isMetodoE_F_G && isB52_10_13) return false;

    // 4. Filtro base
    return t.material === material && 
           t.aislacion === aislacion && 
           t.nConductoresCargados === nConductoresBuscado;
  });

  if (!tabla) {
      console.log(`[DEBUG] No se encontró tabla para: Mat=${material}, Aisl=${aislacion}, nCarg=${nConductoresBuscado}, Metodo=${metodoNormalizado}`);
      return undefined;
  }
  
  console.log(`[DEBUG] Tabla seleccionada: Norma=${tabla.norma}, Mat=${tabla.material}, Aisl=${tabla.aislacion}`);

  if (!tabla.datos[seccion]) return undefined;

  const datosSeccion = tabla.datos[seccion];
  
  // Función auxiliar mejorada para buscar en objetos anidados
  const buscarEnObjeto = (obj: any, keyBusqueda: string, disp?: string): number | undefined => {
      if (typeof obj !== 'object' || obj === null) return undefined;
      
      // Manejo específico para estructura Mineral (E_F como clave)
      if (tabla.aislacion === 'Mineral' && keyBusqueda === 'E' && obj['E_F']) {
          return buscarEnObjeto(obj['E_F'], 'E_F', disp);
      }
      
      const keys = Object.keys(obj);
      // Buscar clave exacta o difusa
      const keyFound = keys.find(k => k.toUpperCase().replace('METODO', '').trim() === keyBusqueda) 
                    || keys.find(k => k.toLowerCase().includes(keyBusqueda.toLowerCase()));
      
      if (!keyFound) return undefined;
      
      const valor = obj[keyFound];
      if (typeof valor === 'number') return valor;
      
      if (typeof valor === 'object' && disp) {
          // Búsqueda de disposición
          if (valor[disp]) return valor[disp];
          
          const dispKeys = Object.keys(valor);
          const dispFound = dispKeys.find(k => k.toLowerCase().includes(disp.toLowerCase()));
          if (dispFound) return valor[dispFound];
          
          // Fallback para trifásico en tablas 10+
          if (esTrifasico) {
              const kTrifasico = dispKeys.find(k => k.toLowerCase().includes('3c'));
              if (kTrifasico) return valor[kTrifasico];
          }
      }
      
      if (typeof valor === 'object') {
          return Object.values(valor).find(v => typeof v === 'number') as number | undefined;
      }
      
      return undefined;
  };

  // En las tablas 10-13, la estructura es: seccion -> [tipoCable] -> [metodo] -> [disposicion]
  if (tabla.norma.startsWith('B52-1') && tipoCable && datosSeccion[tipoCable]) {
      return buscarEnObjeto(datosSeccion[tipoCable], metodoNormalizado, esTrifasico ? '3C' : '2C');
  }

  // Búsqueda estándar (incluye A, B, C, D)
  // Nota: En tablas estándar, los datos ya están en el nivel método
  return buscarEnObjeto(datosSeccion, metodoNormalizado, disposicion);
};
