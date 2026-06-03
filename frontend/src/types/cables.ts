// frontend/src/types/cables.ts
export type Aislacion = 'PVC' | 'XLPE';

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
}
