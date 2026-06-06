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

  // Caso para las tablas con estructura anidada (unipolar/multipolar -> métodos)
  if (tipoCable && datosSeccion[tipoCable]) {
    const datosTipo = datosSeccion[tipoCable] as any;
    
    // Primero, intentar buscar por el nombre de método directo (ej. 'F', 'G')
    // A veces los datos tienen claves como 'metodoF' o directamente 'F'
    const valorDirecto = datosTipo[metodo] || datosTipo[`metodo${metodo.toUpperCase()}`];
    
    if (valorDirecto) {
        if (typeof valorDirecto === 'number') return valorDirecto;
        if (disposicion && valorDirecto[disposicion]) return valorDirecto[disposicion];
        return Object.values(valorDirecto)[0] as number;
    }
    
    // Si no se encontró, buscar por la clave estandarizada 'metodoX'
    const metodoKey = `metodo${metodo.toUpperCase()}`;
    if (datosTipo[metodoKey]) {
      const valores = datosTipo[metodoKey];
      if (typeof valores === 'number') return valores;
      if (disposicion && valores[disposicion]) return valores[disposicion];
      return Object.values(valores)[0] as number;
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
       const key = Object.keys(valores).find(k => k.toLowerCase().includes(disposicion?.toLowerCase() || ''));
       if (key && typeof valores[key] === 'number') return valores[key];
       
       // Si es un objeto, intentar devolver el primer valor si la disposición no coincide
       const firstValue = Object.values(valores)[0];
       return typeof firstValue === 'number' ? firstValue : undefined;
    }
  }

  return undefined;
};
