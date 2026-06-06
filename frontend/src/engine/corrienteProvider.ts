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
  
  const tabla = TABLAS_CORRIENTE_SAEA.find(t => {
    if (aislacion === 'Mineral') {
        return (t.norma === 'B52-8' || t.norma === 'B52-9') && t.material === material;
    }
    const isB52_10_13 = ['B52-10', 'B52-11', 'B52-12', 'B52-13'].includes(t.norma);
    const isMetodoE_F_G = ['E', 'F', 'G'].includes(metodoNormalizado);
    if (isMetodoE_F_G && !isB52_10_13) return false;
    if (!isMetodoE_F_G && isB52_10_13) return false;
    return t.material === material && 
           t.aislacion === aislacion && 
           t.nConductoresCargados === nConductoresBuscado;
  });

  if (!tabla || !tabla.datos[seccion]) return undefined;
  
  const datosSeccion = tabla.datos[seccion];

  // Lógica de selección explícita para E, F, G
  if (['E', 'F', 'G'].includes(metodoNormalizado)) {
    if (tipoCable === 'multipolar' && metodoNormalizado === 'E') {
        const key = esTrifasico ? '3C' : '2C';
        return (datosSeccion.multipolar as any)?.metodoE?.[key];
    }
    if (tipoCable === 'unipolar') {
        if (metodoNormalizado === 'F') {
            const key = esTrifasico ? '3C_contacto' : '2C_contacto';
            return (datosSeccion.unipolar as any)?.metodoF?.[key];
        }
        if (metodoNormalizado === 'G') {
            // Mapeo explícito según disposición para Método G
            const key = esTrifasico && disposicion === 'separado' ? '3C_plano_horizontal_separado_1D' : undefined;
            return (datosSeccion.unipolar as any)?.metodoG?.[key || ''];
        }
    }
    return undefined;
  }

  // Búsqueda estándar (A, B, C, D)
  return (datosSeccion as any)[metodoNormalizado];
};
