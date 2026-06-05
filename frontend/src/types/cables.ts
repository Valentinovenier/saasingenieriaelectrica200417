// frontend/src/types/cables.ts
export type Aislacion = 'PVC' | 'XLPE';
export type MaterialConductor = 'Cobre' | 'Aluminio';
export type MetodoInstalacion = 'A1' | 'A2' | 'B1' | 'B2' | 'C' | 'D1' | 'D2' | 'E' | 'F' | 'G';

export interface ParametrosCable {
  seccion: number;
  resistencia: number; // Ω/km (70°C para PVC, 90°C para XLPE)
  reactancia: {
    unipolar_trebol: number; // Disposición en trébol
    unipolar_contacto: number; // Peor caso (plano en contacto)
    monofasico: number;       // 2x
    trifasico: number;        // 3x
    trifasico_neutro: number; // 3x / N
  };
  // Corrientes separadas por cantidad de conductores cargados
  // mono: 2 cargados, tri: 3 cargados
  corrientes: {
    mono: Record<MetodoInstalacion, number | Record<string, number>>;
    tri: Record<MetodoInstalacion, number | Record<string, number>>;
  };
}

export interface CorrienteAdmisible {
  aislacion: Aislacion;
  material: MaterialConductor;
  conductoresCargados: 2 | 3;
  metodo: MetodoInstalacion;
  tabla: Record<number, number>; // Seccion -> Amperios
}
