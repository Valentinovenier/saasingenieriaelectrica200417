// frontend/src/data/factoresResistividad.ts

// AEA 90364-5 Tabla B52-16 - Factores de corrección para distintas resistividades térmicas del terreno
// Depende del método (D1, D2)
export const FACTORES_RESISTIVIDAD: Record<string, Record<number, number>> = {
  // Las claves son las resistividades típicas en K.m/W
  // Si bien la tabla tiene varios valores, podemos interpolar o aproximar si el usuario pone valores que no están.
  // Valores de resistividad en la tabla (aprox): 0.5, 0.7, 1.0, 1.5, 2.0, 2.5, 3.0
  D1: {
    0.5: 1.28,
    0.7: 1.20,
    1.0: 1.18,
    1.5: 1.1,
    2.0: 1.05,
    2.5: 1.0, // Base para D1 en la norma suele ser 2.5 K.m/W (En Argentina la AEA considera 1.0 como tierra, ver bien la norma local)
    3.0: 0.96
  },
  D2: {
    0.5: 1.28,
    0.7: 1.20,
    1.0: 1.18,
    1.5: 1.1,
    2.0: 1.05,
    2.5: 1.0, 
    3.0: 0.96
  }
};

export const getFactorResistividad = (metodo: string, resistividad: number): number => {
    // Si no es D1 o D2 (o variantes D), el factor es 1 (aire o similar)
    if (!metodo.toUpperCase().startsWith('D')) return 1.0;
    
    const key = metodo.toUpperCase().startsWith('D1') ? 'D1' : 'D2';
    const tabla = FACTORES_RESISTIVIDAD[key];
    
    // Buscar el valor más cercano o exacto
    // Si la resistividad es < 0.5 asumimos 0.5, etc.
    const valores = Object.keys(tabla).map(Number).sort((a, b) => a - b);
    let cercano = valores[0];
    
    // Interpolar o tomar el más próximo (para simplificar, tomamos el valor por tramos conservadores)
    for(const val of valores) {
        if(resistividad <= val) {
            cercano = val;
            break;
        }
        cercano = val; // Si es mayor al máximo, tomará el último
    }
    
    return tabla[cercano] || 1.0;
};
