import { TABLAS_CORRIENTE_SAEA } from '../data/corrientesNormativasAdmisibles';

export const getAdmisible = (
  seccion: number,
  metodo: string,
  esTrifasico: boolean,
  material: 'Cobre' | 'Aluminio',
  aislacion: 'PVC' | 'XLPE' | 'Mineral',
  normaMineral?: 'B52-8' | 'B52-9', // Nuevo parámetro
  disposicion?: string,
  tipoCable?: 'unipolar' | 'multipolar',
  plano?: 'horizontal' | 'vertical'
): number | undefined => {
  const nConductoresBuscado = esTrifasico ? 3 : 2;
  const metodoNormalizado = metodo.toUpperCase().replace('METODO', '').trim();
  
  const tablas = TABLAS_CORRIENTE_SAEA.filter(t => {
    if (aislacion === 'Mineral') {
        // Para Mineral, verificar que la tabla soporta el método solicitado
        if (!t.metodosSoportados[metodoNormalizado]) return false;
        
        if (metodoNormalizado === 'C') {
             return (t.norma === 'B52-6' || t.norma === 'B52-7') && t.material === material;
        }
        
        // Para E, F, G usar normaMineral explícita
        if (normaMineral) {
            return t.norma === normaMineral && t.material === material;
        }
        
        // Fallback si no se especificó normaMineral para E, F, G
        return (t.norma === 'B52-8' || t.norma === 'B52-9') && t.material === material;
    }
    // Filtrado universal
    return t.material === material && 
           t.aislacion === aislacion && 
           t.nConductoresCargados === nConductoresBuscado &&
           !!t.metodosSoportados[metodoNormalizado];
  });

  // Find the first table that actually has data for this section
  const tabla = tablas.find(t => !!t.datos[seccion]);

  if (!tabla) return undefined;
  
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
            console.log(`[DEBUG] Método F, disposicion recibida: ${disposicion}`);
            const keyMap: Record<string, string> = esTrifasico 
                ? { 'trebol': '3C_tresbolillo_cuadrete', 'contacto': '3C_contacto' }
                : { 'trebol': '2C_contacto', 'contacto': '2C_contacto' };
            const key = disposicion ? keyMap[disposicion.toLowerCase()] : undefined; // Asegurar minúsculas
            console.log(`[DEBUG] Método F, Key buscada: ${key}`);
            return (datosSeccion.unipolar as any)?.metodoF?.[key || ''];
        }
        if (metodoNormalizado === 'G') {
            // Claves reales: '3C_plano_horizontal_separado_1D', '3C_plano_vertical_separado_1D'
            const key = esTrifasico && disposicion === 'separado' 
                ? (plano === 'horizontal' ? '3C_plano_horizontal_separado_1D' : '3C_plano_vertical_separado_1D') 
                : undefined;
            
            console.log(`[DEBUG] Método G, Key buscada: ${key}`);
            
            if (key) {
                const metodoGData = (datosSeccion.unipolar as any)?.metodoG;
                if (metodoGData) {
                    // Try exact key first
                    if (metodoGData[key] !== undefined) return metodoGData[key];

                    // Fallback: try removing '_separado_1D'
                    const fallbackKey = key.replace('_separado_1D', '');
                    console.log(`[DEBUG] Clave exacta no encontrada, probando fallback: ${fallbackKey}`);
                    return metodoGData[fallbackKey];
                }
            }
            return undefined;
        }
    }
    return undefined;
  }
  
  // Búsqueda estándar (A, B, C, D)
  const valor = (datosSeccion as any)[metodoNormalizado];
  
  // Si es Método C y aislación Mineral, el valor es un objeto con disposiciones
  if (metodoNormalizado === 'C' && aislacion === 'Mineral' && typeof valor === 'object') {
       // Buscar la disposición correcta (por ahora asumimos una lógica simple o la primera)
       // Esto necesitaría mayor refinamiento si el usuario puede elegir la disposición para Mineral C.
       return Object.values(valor)[0] as number;
  }

  return valor;
};
