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

  // Caso para las tablas con estructura unipolar/multipolar (ej. B52-10)
  if (tipoCable && datosSeccion[tipoCable]) {
    const datosTipo = datosSeccion[tipoCable] as any;
    // Buscamos por nombre de método, ej: 'metodoE'
    const metodoKey = `metodo${metodo.toUpperCase()}`;
    if (datosTipo[metodoKey]) {
      const valores = datosTipo[metodoKey];
      if (typeof valores === 'number') return valores;
      if (disposicion && valores[disposicion]) return valores[disposicion];
    }
  }

  // Caso para tablas con estructura anterior (métodos directos)
  if (datosSeccion[metodo]) {
    const valor = datosSeccion[metodo];
    if (typeof valor === 'number') return valor;
    if (disposicion && typeof valor === 'object' && !Array.isArray(valor)) {
      return (valor as Record<string, number>)[disposicion];
    }
  }

  return undefined;
};
