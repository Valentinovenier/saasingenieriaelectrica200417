import { TABLAS_CORRIENTE_SAEA } from '../data/corrientesNormativasAdmisibles';

export const getAdmisible = (
  seccion: number,
  metodo: string,
  esTrifasico: boolean,
  material: 'Cobre' | 'Aluminio',
  aislacion: 'PVC' | 'XLPE' | 'Mineral',
  disposicion?: string,
  tipoCable?: 'unipolar' | 'multipolar',
  plano?: 'horizontal' | 'vertical'
): number | undefined => {
  const nConductoresBuscado = esTrifasico ? 3 : 2;
  const metodoNormalizado = metodo.toUpperCase().replace('METODO', '').trim();
  
  const tabla = TABLAS_CORRIENTE_SAEA.find(t => {
    if (aislacion === 'Mineral') {
        return (t.norma === 'B52-8' || t.norma === 'B52-9') && t.material === material;
    }
    // Filtrado universal: coincide material, aislación, número de conductores y el método es soportado
    return t.material === material && 
           t.aislacion === aislacion && 
           t.nConductoresCargados === nConductoresBuscado &&
           !!t.metodosSoportados[metodoNormalizado];
  });

  if (!tabla || !tabla.datos[seccion]) return undefined;
  
  const datosSeccion = tabla.datos[seccion];

  // Lógica de selección explícita para E, F, G
  if (['E', 'F', 'G'].includes(metodoNormalizado)) {
    console.log(`[DEBUG] Buscando Método ${metodoNormalizado}, Unipolar: ${tipoCable === 'unipolar'}, Trifasico: ${esTrifasico}`);
    if (tipoCable === 'multipolar' && metodoNormalizado === 'E') {
        const key = esTrifasico ? '3C' : '2C';
        return (datosSeccion.multipolar as any)?.metodoE?.[key];
    }
    if (tipoCable === 'unipolar') {
        if (metodoNormalizado === 'F') {
            // Claves reales: '3C_tresbolillo_cuadrete', '3C_contacto', '2C_contacto'
            const keyMap: Record<string, string> = esTrifasico 
                ? { 'trebol': '3C_tresbolillo_cuadrete', 'contacto': '3C_contacto' }
                : { 'trebol': '2C_contacto', 'contacto': '2C_contacto' };
            const key = disposicion ? keyMap[disposicion] : undefined;
            console.log(`[DEBUG] Método F, Key buscada: ${key}`);
            return (datosSeccion.unipolar as any)?.metodoF?.[key || ''];
        }
        if (metodoNormalizado === 'G') {
            // Claves reales: '3C_plano_horizontal_separado_1D', '3C_plano_vertical_separado_1D'
            const key = esTrifasico && disposicion === 'separado' 
                ? (plano === 'horizontal' ? '3C_plano_horizontal_separado_1D' : '3C_plano_vertical_separado_1D') 
                : undefined;
            console.log(`[DEBUG] Método G, Key buscada: ${key}`);
            return (datosSeccion.unipolar as any)?.metodoG?.[key || ''];
        }
    }
    return undefined;
  }

  // Búsqueda estándar (A, B, C, D)
  return (datosSeccion as any)[metodoNormalizado];
};
