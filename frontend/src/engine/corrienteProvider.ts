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
  
  // Lógica de inferencia: busca la tabla que coincida con los criterios técnicos
  const tabla = TABLAS_CORRIENTE_SAEA.find(t => 
    t.material === material && 
    t.aislacion === aislacion && 
    (esTrifasico ? t.nConductoresCargados === 3 : t.nConductoresCargados === 2)
  );

  if (!tabla || !tabla.datos[seccion]) return undefined;

  const datosSeccion = tabla.datos[seccion];

  // Caso especial para Mineral (B52-6, B52-7, B52-8, B52-9)
  if (aislacion === 'Mineral') {
    const valor = datosSeccion[metodo] || datosSeccion[metodo.replace('_', '')] || datosSeccion['C'] || datosSeccion['E_F'] || datosSeccion['F'] || datosSeccion['G'];
    if (typeof valor === 'number') return valor;
    
    if (disposicion && typeof valor === 'object') {
       // Buscar por disposición dentro de las sub-estructuras
       const valores = valor as Record<string, any>;
       if (valores[disposicion]) return valores[disposicion];
       // Intento de búsqueda difusa si la disposición no coincide exacto
       const key = Object.keys(valores).find(k => k.toLowerCase().includes(disposicion.toLowerCase()));
       if (key) return valores[key];
    }
  }

  // Caso para las tablas con estructura estándar (métodos directos como A1, F, etc.)
  if (datosSeccion[metodo]) {
    const valor = datosSeccion[metodo];
    if (typeof valor === 'number') return valor;
    if (disposicion && typeof valor === 'object' && !Array.isArray(valor)) {
       // Buscar por disposición dentro de las sub-estructuras
       const valores = valor as Record<string, any>;
       if (valores[disposicion]) return valores[disposicion];
       // Intento de búsqueda difusa
       const key = Object.keys(valores).find(k => k.toLowerCase().includes(disposicion.toLowerCase()));
       if (key && typeof valores[key] === 'number') return valores[key];
       
       // Si es un objeto, intentar devolver el primer valor si la disposición no coincide
       const firstValue = Object.values(valores)[0];
       return typeof firstValue === 'number' ? firstValue : undefined;
    }
  }

  // Caso para las tablas con estructura unipolar/multipolar (ej. B52-10, B52-11)
  if (tipoCable && datosSeccion[tipoCable]) {
    const datosTipo = datosSeccion[tipoCable] as any;
    // Buscamos por nombre de método, ej: 'metodoE'
    const metodoKey = `metodo${metodo.toUpperCase()}`;
    if (datosTipo[metodoKey]) {
      const valores = datosTipo[metodoKey];
      if (typeof valores === 'number') return valores;
      if (disposicion && valores[disposicion] && typeof valores[disposicion] === 'number') return valores[disposicion];
      
      const firstValue = Object.values(valores)[0];
      return typeof firstValue === 'number' ? firstValue : undefined; // Fallback
    }
  }

  return undefined;
};
