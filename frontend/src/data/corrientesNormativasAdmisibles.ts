export type ValorCorriente = number | Record<string, any>;

export interface TablaCorriente {
  norma: string;
  aislacion: 'PVC' | 'XLPE' | 'Mineral';
  material: 'Cobre' | 'Aluminio';
  nConductoresCargados: 2 | 3;
  tempConductor: number;
  tempAmbienteAire: number;
  tempAmbienteEnterrado: number;
  metodosSoportados: Record<string, 'unipolar' | 'multipolar' | 'ambos'>;
  disposiciones?: Record<string, string[]>;
  // Seccion -> { Método: CorrienteDirecta o { Disposición: Corriente } }
  // Usamos 'any' para acomodar estructuras anidadas complejas
  datos: Record<number, Record<string, ValorCorriente>>;
}

export const TABLAS_CORRIENTE_SAEA: TablaCorriente[] = [
  {
    norma: "B52-2",
    aislacion: "PVC",
    material: "Cobre",
    nConductoresCargados: 2,
    tempConductor: 70,
    tempAmbienteAire: 40,
    tempAmbienteEnterrado: 25,
    metodosSoportados: { A1: 'unipolar', A2: 'multipolar', B1: 'unipolar', B2: 'multipolar', C: 'ambos', D1: 'ambos', D2: 'ambos' },
    datos: {
      1.5: { A1: 13, A2: 12, B1: 15, B2: 14, C: 17, D1: 25, D2: 29 },
      2.5: { A1: 17, A2: 16, B1: 21, B2: 20, C: 23, D1: 33, D2: 39 },
      4: { A1: 23, A2: 22, B1: 28, B2: 26, C: 31, D1: 43, D2: 51 },
      6: { A1: 30, A2: 28, B1: 36, B2: 33, C: 40, D1: 53, D2: 65 },
      10: { A1: 40, A2: 37, B1: 50, B2: 45, C: 55, D1: 71, D2: 88 },
      16: { A1: 53, A2: 50, B1: 66, B2: 60, C: 74, D1: 91, D2: 112 },
      25: { A1: 70, A2: 65, B1: 88, B2: 78, C: 97, D1: 117, D2: 144 },
      35: { A1: 86, A2: 80, B1: 109, B2: 97, C: 120, D1: 140, D2: 173 },
      50: { A1: 104, A2: 96, B1: 131, B2: 116, C: 146, D1: 166, D2: 207 },
      70: { A1: 131, A2: 121, B1: 167, B2: 146, C: 185, D1: 205, D2: 254 },
      95: { A1: 158, A2: 145, B1: 202, B2: 175, C: 224, D1: 242, D2: 306 },
      120: { A1: 183, A2: 167, B1: 234, B2: 202, C: 260, D1: 276, D2: 350 },
      150: { A1: 209, A2: 191, B1: 261, B2: 224, C: 299, D1: 312, D2: 393 },
      185: { A1: 238, A2: 216, B1: 297, B2: 256, C: 341, D1: 350, D2: 445 },
      240: { A1: 279, A2: 253, B1: 348, B2: 299, C: 401, D1: 405, D2: 519 },
      300: { A1: 319, A2: 291, B1: 398, B2: 343, C: 461, D1: 457, D2: 587 }
    }
  },
  {
    norma: "B52-2",
    aislacion: "PVC",
    material: "Aluminio",
    nConductoresCargados: 2,
    tempConductor: 70,
    tempAmbienteAire: 40,
    tempAmbienteEnterrado: 25,
    metodosSoportados: { A1: 'unipolar', A2: 'multipolar', B1: 'unipolar', B2: 'multipolar', C: 'ambos', D1: 'ambos', D2: 'ambos' },
    datos: {
      2.5: { A1: 13, A2: 13, B1: 16, B2: 15, C: 18, D1: 33, D2: 40 },
      4: { A1: 17, A2: 17, B1: 22, B2: 21, C: 24, D1: 33, D2: 40 },
      6: { A1: 23, A2: 22, B1: 28, B2: 26, C: 31, D1: 40, D2: 53 },
      10: { A1: 31, A2: 29, B1: 38, B2: 36, C: 43, D1: 54, D2: 67 },
      16: { A1: 42, A2: 38, B1: 52, B2: 47, C: 57, D1: 70, D2: 86 },
      25: { A1: 55, A2: 50, B1: 69, B2: 62, C: 72, D1: 90, D2: 112 },
      35: { A1: 67, A2: 62, B1: 84, B2: 75, C: 90, D1: 106, D2: 134 },
      50: { A1: 81, A2: 75, B1: 103, B2: 90, C: 109, D1: 127, D2: 161 },
      70: { A1: 103, A2: 94, B1: 131, B2: 114, C: 139, D1: 157, D2: 198 },
      95: { A1: 124, A2: 113, B1: 157, B2: 137, C: 170, D1: 186, D2: 237 },
      120: { A1: 143, A2: 131, B1: 183, B2: 157, C: 197, D1: 212, D2: 272 },
      150: { A1: 164, A2: 150, B1: 204, B2: 175, C: 227, D1: 239, D2: 305 },
      185: { A1: 187, A2: 170, B1: 231, B2: 200, C: 259, D1: 269, D2: 346 },
      240: { A1: 219, A2: 199, B1: 271, B2: 234, C: 306, D1: 311, D2: 403 },
      300: { A1: 251, A2: 229, B1: 311, B2: 268, C: 353, D1: 351, D2: 457 }
    }
  },
  {
    norma: "B52-3",
    aislacion: "XLPE",
    material: "Cobre",
    nConductoresCargados: 2,
    tempConductor: 90,
    tempAmbienteAire: 40,
    tempAmbienteEnterrado: 25,
    metodosSoportados: { A1: 'unipolar', A2: 'multipolar', B1: 'unipolar', B2: 'multipolar', C: 'ambos', D1: 'ambos', D2: 'ambos' },
    datos: {
      1.5: { A1: 17, A2: 17, B1: 21, B2: 20, C: 22, D1: 29, D2: 34 },
      2.5: { A1: 24, A2: 23, B1: 28, B2: 27, C: 30, D1: 39, D2: 46 },
      4: { A1: 32, A2: 30, B1: 38, B2: 36, C: 41, D1: 50, D2: 60 },
      6: { A1: 41, A2: 38, B1: 49, B2: 46, C: 53, D1: 63, D2: 76 },
      10: { A1: 56, A2: 52, B1: 68, B2: 63, C: 73, D1: 83, D2: 102 },
      16: { A1: 74, A2: 69, B1: 91, B2: 83, C: 97, D1: 106, D2: 135 },
      25: { A1: 96, A2: 90, B1: 121, B2: 108, C: 126, D1: 137, D2: 175 },
      35: { A1: 119, A2: 110, B1: 149, B2: 133, C: 156, D1: 165, D2: 210 },
      50: { A1: 144, A2: 132, B1: 180, B2: 159, C: 190, D1: 196, D2: 251 },
      70: { A1: 182, A2: 167, B1: 230, B2: 201, C: 245, D1: 241, D2: 307 },
      95: { A1: 219, A2: 200, B1: 278, B2: 241, C: 298, D1: 285, D2: 369 },
      120: { A1: 253, A2: 230, B1: 322, B2: 278, C: 348, D1: 325, D2: 420 },
      150: { A1: 289, A2: 264, B1: 358, B2: 304, C: 401, D1: 367, D2: 472 },
      185: { A1: 329, A2: 299, B1: 409, B2: 349, C: 460, D1: 411, D2: 535 },
      240: { A1: 386, A2: 351, B1: 480, B2: 418, C: 545, D1: 475, D2: 623 },
      300: { A1: 442, A2: 402, B1: 549, B2: 484, C: 631, D1: 537, D2: 704 }
    }
  },
  {
    norma: "B52-3",
    aislacion: "XLPE",
    material: "Aluminio",
    nConductoresCargados: 2,
    tempConductor: 90,
    tempAmbienteAire: 40,
    tempAmbienteEnterrado: 25,
    metodosSoportados: { A1: 'unipolar', A2: 'multipolar', B1: 'unipolar', B2: 'multipolar', C: 'ambos', D1: 'ambos', D2: 'ambos' },
    datos: {
      2.5: { A1: 18, A2: 18, B1: 23, B2: 21, C: 24, D1: 33, D2: 40 },
      4: { A1: 25, A2: 24, B1: 30, B2: 28, C: 32, D1: 39, D2: 47 },
      6: { A1: 32, A2: 30, B1: 39, B2: 36, C: 41, D1: 46, D2: 62 },
      10: { A1: 44, A2: 41, B1: 54, B2: 49, C: 56, D1: 63, D2: 79 },
      16: { A1: 58, A2: 55, B1: 72, B2: 66, C: 76, D1: 83, D2: 104 },
      25: { A1: 76, A2: 71, B1: 96, B2: 86, C: 92, D1: 105, D2: 136 },
      35: { A1: 94, A2: 87, B1: 118, B2: 105, C: 115, D1: 127, D2: 163 },
      50: { A1: 114, A2: 105, B1: 143, B2: 126, C: 140, D1: 150, D2: 194 },
      70: { A1: 144, A2: 132, B1: 182, B2: 159, C: 180, D1: 185, D2: 239 },
      95: { A1: 174, A2: 159, B1: 220, B2: 191, C: 219, D1: 219, D2: 286 },
      120: { A1: 200, A2: 183, B1: 256, B2: 220, C: 255, D1: 249, D2: 326 },
      150: { A1: 230, A2: 209, B1: 279, B2: 238, C: 295, D1: 282, D2: 366 },
      185: { A1: 262, A2: 238, B1: 319, B2: 273, C: 338, D1: 316, D2: 415 },
      240: { A1: 308, A2: 279, B1: 375, B2: 326, C: 399, D1: 365, D2: 484 },
      300: { A1: 352, A2: 320, B1: 429, B2: 378, C: 462, D1: 412, D2: 547 }
    }
  },
  {
    norma: "B52-4",
    aislacion: "PVC",
    material: "Cobre",
    nConductoresCargados: 3,
    tempConductor: 70,
    tempAmbienteAire: 40,
    tempAmbienteEnterrado: 25,
    metodosSoportados: { A1: 'unipolar', A2: 'multipolar', B1: 'unipolar', B2: 'multipolar', C: 'ambos', D1: 'ambos', D2: 'ambos' },
    datos: {
      1.5: { A1: 12, A2: 11, B1: 14, B2: 13, C: 15, D1: 20, D2: 25 },
      2.5: { A1: 16, A2: 15, B1: 18, B2: 17, C: 21, D1: 27, D2: 34 },
      4: { A1: 21, A2: 20, B1: 25, B2: 23, C: 28, D1: 35, D2: 44 },
      6: { A1: 27, A2: 25, B1: 32, B2: 30, C: 36, D1: 44, D2: 55 },
      10: { A1: 37, A2: 34, B1: 44, B2: 40, C: 50, D1: 58, D2: 74 },
      16: { A1: 49, A2: 45, B1: 59, B2: 54, C: 66, D1: 75, D2: 95 },
      25: { A1: 64, A2: 59, B1: 77, B2: 70, C: 84, D1: 96, D2: 123 },
      35: { A1: 77, A2: 72, B1: 96, B2: 86, C: 104, D1: 115, D2: 147 },
      50: { A1: 94, A2: 86, B1: 117, B2: 103, C: 125, D1: 137, D2: 173 },
      70: { A1: 118, A2: 109, B1: 149, B2: 130, C: 160, D1: 169, D2: 211 },
      95: { A1: 143, A2: 130, B1: 180, B2: 156, C: 194, D1: 201, D2: 254 },
      120: { A1: 164, A2: 150, B1: 208, B2: 179, C: 225, D1: 228, D2: 290 },
      150: { A1: 188, A2: 171, B1: 228, B2: 196, C: 260, D1: 258, D2: 325 },
      185: { A1: 213, A2: 194, B1: 258, B2: 222, C: 297, D1: 289, D2: 369 },
      240: { A1: 249, A2: 227, B1: 301, B2: 258, C: 351, D1: 333, D2: 428 },
      300: { A1: 285, A2: 259, B1: 343, B2: 295, C: 404, D1: 377, D2: 484 }
    }
  },
  {
    norma: "B52-4",
    aislacion: "PVC",
    material: "Aluminio",
    nConductoresCargados: 3,
    tempConductor: 70,
    tempAmbienteAire: 40,
    tempAmbienteEnterrado: 25,
    metodosSoportados: { A1: 'unipolar', A2: 'multipolar', B1: 'unipolar', B2: 'multipolar', C: 'ambos', D1: 'ambos', D2: 'ambos' },
    datos: {
      2.5: { A1: 12, A2: 12, B1: 14, B2: 13, C: 16 },
      4: { A1: 16, A2: 15, B1: 19, B2: 18, C: 22, D1: 27, D2: 34 },
      6: { A1: 21, A2: 20, B1: 24, B2: 23, C: 28, D1: 34, D2: 45 },
      10: { A1: 28, A2: 27, B1: 34, B2: 31, C: 38, D1: 45, D2: 57 },
      16: { A1: 37, A2: 36, B1: 46, B2: 42, C: 51, D1: 58, D2: 73 },
      25: { A1: 50, A2: 46, B1: 61, B2: 54, C: 64, D1: 74, D2: 94 },
      35: { A1: 61, A2: 57, B1: 75, B2: 67, C: 78, D1: 90, D2: 113 },
      50: { A1: 73, A2: 68, B1: 90, B2: 80, C: 96, D1: 105, D2: 135 },
      70: { A1: 93, A2: 85, B1: 116, B2: 101, C: 122, D1: 131, D2: 168 },
      95: { A1: 112, A2: 103, B1: 140, B2: 121, C: 148, D1: 155, D2: 202 },
      120: { A1: 130, A2: 117, B1: 162, B2: 139, C: 171, D1: 176, D2: 231 },
      150: { A1: 148, A2: 135, B1: 177, B2: 153, C: 197, D1: 200, D2: 260 },
      185: { A1: 169, A2: 153, B1: 200, B2: 173, C: 225, D1: 224, D2: 294 },
      240: { A1: 197, A2: 180, B1: 234, B2: 202, C: 265, D1: 258, D2: 341 },
      300: { A1: 227, A2: 206, B1: 266, B2: 231, C: 305, D1: 291, D2: 386 }
    }
  },
  {
    norma: "B52-5",
    aislacion: "XLPE",
    material: "Aluminio",
    nConductoresCargados: 3,
    tempConductor: 90,
    tempAmbienteAire: 40,
    tempAmbienteEnterrado: 25,
    metodosSoportados: { A1: 'unipolar', A2: 'multipolar', B1: 'unipolar', B2: 'multipolar', C: 'ambos', D1: 'ambos', D2: 'ambos' },
    datos: {
      2.5: { A1: 17, A2: 16, B1: 20, B2: 19, C: 22 },
      4: { A1: 23, A2: 22, B1: 26, B2: 25, C: 29, D1: 33, D2: 40 },
      6: { A1: 29, A2: 28, B1: 35, B2: 32, C: 37, D1: 41, D2: 52 },
      10: { A1: 40, A2: 37, B1: 47, B2: 44, C: 52, D1: 53, D2: 67 },
      16: { A1: 53, A2: 50, B1: 65, B2: 58, C: 69, D1: 69, D2: 88 },
      25: { A1: 69, A2: 65, B1: 85, B2: 76, C: 82, D1: 88, D2: 115 },
      35: { A1: 86, A2: 79, B1: 106, B2: 94, C: 102, D1: 106, D2: 137 },
      50: { A1: 103, A2: 95, B1: 127, B2: 113, C: 124, D1: 127, D2: 162 },
      70: { A1: 129, A2: 119, B1: 163, B2: 142, C: 158, D1: 156, D2: 198 },
      95: { A1: 156, A2: 143, B1: 197, B2: 171, C: 192, D1: 186, D2: 239 },
      120: { A1: 179, A2: 164, B1: 228, B2: 197, C: 223, D1: 211, D2: 272 },
      150: { A1: 206, A2: 187, B1: 243, B2: 218, C: 258, D1: 238, D2: 305 },
      185: { A1: 233, A2: 212, B1: 273, B2: 248, C: 294, D1: 267, D2: 347 },
      240: { A1: 273, A2: 248, B1: 319, B2: 289, C: 348, D1: 308, D2: 403 },
      300: { A1: 313, A2: 285, B1: 366, B2: 331, C: 400, D1: 349, D2: 456 }
    }
  },
  {
    norma: "B52-6",
    aislacion: "Mineral",
    material: "Cobre",
    nConductoresCargados: 3,
    tempConductor: 70,
    tempAmbienteAire: 40,
    tempAmbienteEnterrado: 25,
    metodosSoportados: { C: 'ambos' },
    disposiciones: {
      C: ['2 conductores (uni/multi)', '3 conductores tresbolillo/cuadrete (uni/multi)', '3 conductores en plano (unipolar)']
    },
    datos: {
      1.5: { C: { '2C': 21, '3C_tresbolillo': 18, '3C_plano': 20 } },
      2.5: { C: { '2C': 29, '3C_tresbolillo': 24, '3C_plano': 26 } },
      4: { C: { '2C': 38, '3C_tresbolillo': 31, '3C_plano': 35 } },
      6: { C: { '2C': 48, '3C_tresbolillo': 41, '3C_plano': 44 } },
      10: { C: { '2C': 65, '3C_tresbolillo': 55, '3C_plano': 60 } },
      16: { C: { '2C': 87, '3C_tresbolillo': 73, '3C_plano': 78 } },
      25: { C: { '2C': 113, '3C_tresbolillo': 95, '3C_plano': 102 } },
      35: { C: { '2C': 139, '3C_tresbolillo': 116, '3C_plano': 125 } },
      50: { C: { '2C': 172, '3C_tresbolillo': 144, '3C_plano': 154 } },
      70: { C: { '2C': 210, '3C_tresbolillo': 176, '3C_plano': 188 } },
      95: { C: { '2C': 252, '3C_tresbolillo': 212, '3C_plano': 224 } },
      120: { C: { '2C': 289, '3C_tresbolillo': 243, '3C_plano': 258 } },
      150: { C: { '2C': 330, '3C_tresbolillo': 278, '3C_plano': 294 } },
      185: { C: { '2C': 374, '3C_tresbolillo': 315, '3C_plano': 333 } },
      240: { C: { '2C': 437, '3C_tresbolillo': 369, '3C_plano': 388 } }
    }
  },
  {
    norma: "B52-7",
    aislacion: "Mineral",
    material: "Cobre",
    nConductoresCargados: 3,
    tempConductor: 105,
    tempAmbienteAire: 40,
    tempAmbienteEnterrado: 25,
    metodosSoportados: { C: 'ambos' },
    disposiciones: {
      C: ['2 conductores (uni/multi)', '3 conductores tresbolillo/cuadrete (uni/multi)', '3 conductores en plano (unipolar)']
    },
    datos: {
      1.5: { C: { '2C': 29, '3C_tresbolillo': 24, '3C_plano': 28 } },
      2.5: { C: { '2C': 39, '3C_tresbolillo': 32, '3C_plano': 38 } },
      4: { C: { '2C': 51, '3C_tresbolillo': 43, '3C_plano': 49 } },
      6: { C: { '2C': 64, '3C_tresbolillo': 54, '3C_plano': 62 } },
      10: { C: { '2C': 88, '3C_tresbolillo': 75, '3C_plano': 84 } },
      16: { C: { '2C': 117, '3C_tresbolillo': 98, '3C_plano': 109 } },
      25: { C: { '2C': 153, '3C_tresbolillo': 129, '3C_plano': 142 } },
      35: { C: { '2C': 187, '3C_tresbolillo': 157, '3C_plano': 172 } },
      50: { C: { '2C': 231, '3C_tresbolillo': 195, '3C_plano': 212 } },
      70: { C: { '2C': 261, '3C_tresbolillo': 239, '3C_plano': 258 } },
      95: { C: { '2C': 339, '3C_tresbolillo': 287, '3C_plano': 307 } },
      120: { C: { '2C': 390, '3C_tresbolillo': 330, '3C_plano': 352 } },
      150: { C: { '2C': 446, '3C_tresbolillo': 377, '3C_plano': 400 } },
      185: { C: { '2C': 506, '3C_tresbolillo': 428, '3C_plano': 453 } },
      240: { C: { '2C': 592, '3C_tresbolillo': 500, '3C_plano': 526 } }
    }
  },
  {
    norma: "B52-8",
    aislacion: "Mineral",
    material: "Cobre",
    nConductoresCargados: 3,
    tempConductor: 70,
    tempAmbienteAire: 40,
    tempAmbienteEnterrado: 25,
    metodosSoportados: { E_F: 'ambos', F: 'unipolar', G: 'unipolar' },
    disposiciones: {
      E_F: ['2 conductores (uni/multi)', '3 conductores tresbolillo/cuadrete (uni/multi)'],
      F: ['3 conductores en contacto (unipolar)'],
      G: ['3 conductores plano horizontal (unipolar)', '3 conductores plano vertical (unipolar)']
    },
    datos: {
      1.5: { E_F: { '2C': 22, '3C_tresbolillo': 19 }, F: { '3C_contacto': 22 }, G: { '3C_plano_horizontal': 24, '3C_plano_vertical': 27 } },
      2.5: { E_F: { '2C': 31, '3C_tresbolillo': 26 }, F: { '3C_contacto': 29 }, G: { '3C_plano_horizontal': 31, '3C_plano_vertical': 37 } },
      4: { E_F: { '2C': 40, '3C_tresbolillo': 34 }, F: { '3C_contacto': 38 }, G: { '3C_plano_horizontal': 42, '3C_plano_vertical': 48 } },
      6: { E_F: { '2C': 51, '3C_tresbolillo': 43 }, F: { '3C_contacto': 48 }, G: { '3C_plano_horizontal': 53, '3C_plano_vertical': 60 } },
      10: { E_F: { '2C': 70, '3C_tresbolillo': 59 }, F: { '3C_contacto': 65 }, G: { '3C_plano_horizontal': 71, '3C_plano_vertical': 81 } },
      16: { E_F: { '2C': 93, '3C_tresbolillo': 78 }, F: { '3C_contacto': 87 }, G: { '3C_plano_horizontal': 94, '3C_plano_vertical': 106 } },
      25: { E_F: { '2C': 121, '3C_tresbolillo': 102 }, F: { '3C_contacto': 112 }, G: { '3C_plano_horizontal': 121, '3C_plano_vertical': 138 } },
      35: { E_F: { '2C': 148, '3C_tresbolillo': 125 }, F: { '3C_contacto': 137 }, G: { '3C_plano_horizontal': 147, '3C_plano_vertical': 167 } },
      50: { E_F: { '2C': 183, '3C_tresbolillo': 155 }, F: { '3C_contacto': 168 }, G: { '3C_plano_horizontal': 181, '3C_plano_vertical': 206 } },
      70: { E_F: { '2C': 224, '3C_tresbolillo': 190 }, F: { '3C_contacto': 205 }, G: { '3C_plano_horizontal': 220, '3C_plano_vertical': 250 } },
      95: { E_F: { '2C': 269, '3C_tresbolillo': 227 }, F: { '3C_contacto': 246 }, G: { '3C_plano_horizontal': 263, '3C_plano_vertical': 298 } },
      120: { E_F: { '2C': 309, '3C_tresbolillo': 262 }, F: { '3C_contacto': 281 }, G: { '3C_plano_horizontal': 300, '3C_plano_vertical': 342 } },
      150: { E_F: { '2C': 353, '3C_tresbolillo': 299 }, F: { '3C_contacto': 320 }, G: { '3C_plano_horizontal': 340, '3C_plano_vertical': 386 } },
      185: { E_F: { '2C': 401, '3C_tresbolillo': 339 }, F: { '3C_contacto': 362 }, G: { '3C_plano_horizontal': 379, '3C_plano_vertical': 431 } },
      240: { E_F: { '2C': 469, '3C_tresbolillo': 396 }, F: { '3C_contacto': 422 }, G: { '3C_plano_horizontal': 422, '3C_plano_vertical': 480 } }
    }
  },
  {
    norma: "B52-9",
    aislacion: "Mineral",
    material: "Cobre",
    nConductoresCargados: 3,
    tempConductor: 105,
    tempAmbienteAire: 40,
    tempAmbienteEnterrado: 25,
    metodosSoportados: { E_F: 'ambos', F: 'unipolar', G: 'unipolar' },
    disposiciones: {
      E_F: ['2 conductores (uni/multi)', '3 conductores tresbolillo/cuadrete (uni/multi)'],
      F: ['3 conductores en contacto (unipolar)'],
      G: ['3 conductores plano horizontal (unipolar)', '3 conductores plano vertical (unipolar)']
    },
    datos: {
      1.5: { E_F: { '2C': 30, '3C_tresbolillo': 26 }, F: { '3C_contacto': 29 }, G: { '3C_plano_horizontal': 32, '3C_plano_vertical': 37 } },
      2.5: { E_F: { '2C': 41, '3C_tresbolillo': 35 }, F: { '3C_contacto': 40 }, G: { '3C_plano_horizontal': 43, '3C_plano_vertical': 50 } },
      4: { E_F: { '2C': 55, '3C_tresbolillo': 46 }, F: { '3C_contacto': 52 }, G: { '3C_plano_horizontal': 56, '3C_plano_vertical': 64 } },
      6: { E_F: { '2C': 70, '3C_tresbolillo': 59 }, F: { '3C_contacto': 65 }, G: { '3C_plano_horizontal': 72, '3C_plano_vertical': 82 } },
      10: { E_F: { '2C': 96, '3C_tresbolillo': 80 }, F: { '3C_contacto': 88 }, G: { '3C_plano_horizontal': 97, '3C_plano_vertical': 110 } },
      16: { E_F: { '2C': 126, '3C_tresbolillo': 106 }, F: { '3C_contacto': 117 }, G: { '3C_plano_horizontal': 126, '3C_plano_vertical': 144 } },
      25: { E_F: { '2C': 165, '3C_tresbolillo': 138 }, F: { '3C_contacto': 151 }, G: { '3C_plano_horizontal': 164, '3C_plano_vertical': 188 } },
      35: { E_F: { '2C': 202, '3C_tresbolillo': 169 }, F: { '3C_contacto': 184 }, G: { '3C_plano_horizontal': 199, '3C_plano_vertical': 228 } },
      50: { E_F: { '2C': 250, '3C_tresbolillo': 210 }, F: { '3C_contacto': 227 }, G: { '3C_plano_horizontal': 245, '3C_plano_vertical': 280 } },
      70: { E_F: { '2C': 306, '3C_tresbolillo': 257 }, F: { '3C_contacto': 276 }, G: { '3C_plano_horizontal': 297, '3C_plano_vertical': 340 } },
      95: { E_F: { '2C': 368, '3C_tresbolillo': 308 }, F: { '3C_contacto': 330 }, G: { '3C_plano_horizontal': 354, '3C_plano_vertical': 406 } },
      120: { E_F: { '2C': 423, '3C_tresbolillo': 354 }, F: { '3C_contacto': 378 }, G: { '3C_plano_horizontal': 406, '3C_plano_vertical': 465 } },
      150: { E_F: { '2C': 484, '3C_tresbolillo': 406 }, F: { '3C_contacto': 431 }, G: { '3C_plano_horizontal': 458, '3C_plano_vertical': 520 } },
      185: { E_F: { '2C': 548, '3C_tresbolillo': 460 }, F: { '3C_contacto': 488 }, G: { '3C_plano_horizontal': 512, '3C_plano_vertical': 579 } },
      240: { E_F: { '2C': 641, '3C_tresbolillo': 537 }, F: { '3C_contacto': 568 }, G: { '3C_plano_horizontal': 574, '3C_plano_vertical': 648 } }
    }
  },
  {
    norma: "B52-10",
    aislacion: "PVC",
    material: "Cobre",
    nConductoresCargados: 3,
    tempConductor: 70,
    tempAmbienteAire: 40,
    tempAmbienteEnterrado: 25,
    metodosSoportados: { E: 'ambos', F: 'unipolar', G: 'unipolar' },
    datos: {
      1.5: { multipolar: { metodoE: { '2C': 19, '3C': 16 } }, unipolar: { metodoF: { '2C_contacto': 19, '3C_tresbolillo_cuadrete': 16, '3C_contacto': 16 }, metodoG: { '3C_plano_horizontal_separado_1D': 24, '3C_plano_vertical_separado_1D': 20 } } },
      2.5: { multipolar: { metodoE: { '2C': 26, '3C': 22 } }, unipolar: { metodoF: { '2C_contacto': 26, '3C_tresbolillo_cuadrete': 22, '3C_contacto': 22 }, metodoG: { '3C_plano_horizontal_separado_1D': 31, '3C_plano_vertical': 26 } } },
      4: { multipolar: { metodoE: { '2C': 35, '3C': 30 } }, unipolar: { metodoF: { '2C_contacto': 35, '3C_tresbolillo_cuadrete': 30, '3C_contacto': 30 }, metodoG: { '3C_plano_horizontal_separado_1D': 42, '3C_plano_vertical': 35 } } },
      6: { multipolar: { metodoE: { '2C': 44, '3C': 37 } }, unipolar: { metodoF: { '2C_contacto': 44, '3C_tresbolillo_cuadrete': 37, '3C_contacto': 37 }, metodoG: { '3C_plano_horizontal_separado_1D': 53, '3C_plano_vertical': 44 } } },
      10: { multipolar: { metodoE: { '2C': 61, '3C': 52 } }, unipolar: { metodoF: { '2C_contacto': 61, '3C_tresbolillo_cuadrete': 52, '3C_contacto': 52 }, metodoG: { '3C_plano_horizontal_separado_1D': 71, '3C_plano_vertical': 60 } } },
      16: { multipolar: { metodoE: { '2C': 82, '3C': 70 } }, unipolar: { metodoF: { '2C_contacto': 82, '3C_tresbolillo_cuadrete': 70, '3C_contacto': 70 }, metodoG: { '3C_plano_horizontal_separado_1D': 94, '3C_plano_vertical': 78 } } },
      25: { multipolar: { metodoE: { '2C': 104, '3C': 88 } }, unipolar: { metodoF: { '2C_contacto': 114, '3C_tresbolillo_cuadrete': 96, '3C_contacto': 99 }, metodoG: { '3C_plano_horizontal_separado_1D': 127, '3C_plano_vertical': 113 } } },
      35: { multipolar: { metodoE: { '2C': 129, '3C': 110 } }, unipolar: { metodoF: { '2C_contacto': 141, '3C_tresbolillo_cuadrete': 119, '3C_contacto': 124 }, metodoG: { '3C_plano_horizontal_separado_1D': 157, '3C_plano_vertical': 141 } } },
      50: { multipolar: { metodoE: { '2C': 157, '3C': 133 } }, unipolar: { metodoF: { '2C_contacto': 171, '3C_tresbolillo_cuadrete': 145, '3C_contacto': 151 }, metodoG: { '3C_plano_horizontal_separado_1D': 191, '3C_plano_vertical': 171 } } },
      70: { multipolar: { metodoE: { '2C': 202, '3C': 171 } }, unipolar: { metodoF: { '2C_contacto': 218, '3C_tresbolillo_cuadrete': 188, '3C_contacto': 196 }, metodoG: { '3C_plano_horizontal_separado_1D': 244, '3C_plano_vertical': 221 } } },
      95: { multipolar: { metodoE: { '2C': 245, '3C': 207 } }, unipolar: { metodoF: { '2C_contacto': 264, '3C_tresbolillo_cuadrete': 230, '3C_contacto': 239 }, metodoG: { '3C_plano_horizontal_separado_1D': 297, '3C_plano_vertical': 271 } } },
      120: { multipolar: { metodoE: { '2C': 285, '3C': 240 } }, unipolar: { metodoF: { '2C_contacto': 306, '3C_tresbolillo_cuadrete': 268, '3C_contacto': 279 }, metodoG: { '3C_plano_horizontal_separado_1D': 345, '3C_plano_vertical': 315 } } },
      150: { multipolar: { metodoE: { '2C': 330, '3C': 278 } }, unipolar: { metodoF: { '2C_contacto': 353, '3C_tresbolillo_cuadrete': 310, '3C_contacto': 324 }, metodoG: { '3C_plano_horizontal_separado_1D': 397, '3C_plano_vertical': 365 } } },
      185: { multipolar: { metodoE: { '2C': 378, '3C': 317 } }, unipolar: { metodoF: { '2C_contacto': 403, '3C_tresbolillo_cuadrete': 356, '3C_contacto': 371 }, metodoG: { '3C_plano_horizontal_separado_1D': 453, '3C_plano_vertical': 418 } } },
      240: { multipolar: { metodoE: { '2C': 447, '3C': 374 } }, unipolar: { metodoF: { '2C_contacto': 475, '3C_tresbolillo_cuadrete': 422, '3C_contacto': 441 }, metodoG: { '3C_plano_horizontal_separado_1D': 535, '3C_plano_vertical_separado_1D': 495 } } }
    }
  },
  {
    norma: "B52-11",
    aislacion: "PVC",
    material: "Aluminio",
    nConductoresCargados: 3,
    tempConductor: 70,
    tempAmbienteAire: 40,
    tempAmbienteEnterrado: 25,
    metodosSoportados: { E: 'ambos', F: 'unipolar', G: 'unipolar' },
    datos: {
      2.5: { multipolar: { metodoE: { '2C': 20, '3C': 17 } }, unipolar: { metodoF: { '2C_contacto': 20, '3C_tresbolillo_cuadrete': 17, '3C_contacto': 17 }, metodoG: { '3C_plano_horizontal_separado_1D': 25, '3C_plano_vertical_separado_1D': 21 } } },
      4: { multipolar: { metodoE: { '2C': 27, '3C': 23 } }, unipolar: { metodoF: { '2C_contacto': 27, '3C_tresbolillo_cuadrete': 23, '3C_contacto': 23 }, metodoG: { '3C_plano_horizontal_separado_1D': 33, '3C_plano_vertical': 28 } } },
      6: { multipolar: { metodoE: { '2C': 34, '3C': 29 } }, unipolar: { metodoF: { '2C_contacto': 34, '3C_tresbolillo_cuadrete': 29, '3C_contacto': 29 }, metodoG: { '3C_plano_horizontal_separado_1D': 42, '3C_plano_vertical': 35 } } },
      10: { multipolar: { metodoE: { '2C': 47, '3C': 40 } }, unipolar: { metodoF: { '2C_contacto': 47, '3C_tresbolillo_cuadrete': 40, '3C_contacto': 40 }, metodoG: { '3C_plano_horizontal_separado_1D': 57, '3C_plano_vertical': 47 } } },
      16: { multipolar: { metodoE: { '2C': 64, '3C': 53 } }, unipolar: { metodoF: { '2C_contacto': 64, '3C_tresbolillo_cuadrete': 53, '3C_contacto': 53 }, metodoG: { '3C_plano_horizontal_separado_1D': 76, '3C_plano_vertical': 63 } } },
      25: { multipolar: { metodoE: { '2C': 77, '3C': 68 } }, unipolar: { metodoF: { '2C_contacto': 85, '3C_tresbolillo_cuadrete': 73, '3C_contacto': 76 }, metodoG: { '3C_plano_horizontal_separado_1D': 97, '3C_plano_vertical': 86 } } },
      35: { multipolar: { metodoE: { '2C': 97, '3C': 84 } }, unipolar: { metodoF: { '2C_contacto': 106, '3C_tresbolillo_cuadrete': 91, '3C_contacto': 95 }, metodoG: { '3C_plano_horizontal_separado_1D': 121, '3C_plano_vertical': 108 } } },
      50: { multipolar: { metodoE: { '2C': 117, '3C': 102 } }, unipolar: { metodoF: { '2C_contacto': 130, '3C_tresbolillo_cuadrete': 111, '3C_contacto': 116 }, metodoG: { '3C_plano_horizontal_separado_1D': 147, '3C_plano_vertical': 132 } } },
      70: { multipolar: { metodoE: { '2C': 151, '3C': 131 } }, unipolar: { metodoF: { '2C_contacto': 167, '3C_tresbolillo_cuadrete': 144, '3C_contacto': 151 }, metodoG: { '3C_plano_horizontal_separado_1D': 189, '3C_plano_vertical': 171 } } },
      95: { multipolar: { metodoE: { '2C': 183, '3C': 159 } }, unipolar: { metodoF: { '2C_contacto': 204, '3C_tresbolillo_cuadrete': 177, '3C_contacto': 184 }, metodoG: { '3C_plano_horizontal_separado_1D': 231, '3C_plano_vertical': 210 } } },
      120: { multipolar: { metodoE: { '2C': 212, '3C': 184 } }, unipolar: { metodoF: { '2C_contacto': 238, '3C_tresbolillo_cuadrete': 206, '3C_contacto': 215 }, metodoG: { '3C_plano_horizontal_separado_1D': 268, '3C_plano_vertical': 245 } } },
      150: { multipolar: { metodoE: { '2C': 245, '3C': 213 } }, unipolar: { metodoF: { '2C_contacto': 275, '3C_tresbolillo_cuadrete': 238, '3C_contacto': 250 }, metodoG: { '3C_plano_horizontal_separado_1D': 310, '3C_plano_vertical': 284 } } },
      185: { multipolar: { metodoE: { '2C': 280, '3C': 244 } }, unipolar: { metodoF: { '2C_contacto': 316, '3C_tresbolillo_cuadrete': 274, '3C_contacto': 287 }, metodoG: { '3C_plano_horizontal_separado_1D': 354, '3C_plano_vertical': 327 } } },
      240: { multipolar: { metodoE: { '2C': 331, '3C': 287 } }, unipolar: { metodoF: { '2C_contacto': 374, '3C_tresbolillo_cuadrete': 326, '3C_contacto': 341 }, metodoG: { '3C_plano_horizontal_separado_1D': 419, '3C_plano_vertical': 389 } } }
    }
  },
  {
    norma: "B52-12",
    aislacion: "XLPE",
    material: "Cobre",
    nConductoresCargados: 3,
    tempConductor: 90,
    tempAmbienteAire: 40,
    tempAmbienteEnterrado: 25,
    metodosSoportados: { E: 'ambos', F: 'unipolar', G: 'unipolar' },
    datos: {
      1.5: { multipolar: { metodoE: { '2C': 24, '3C': 21 } }, unipolar: { metodoF: { '2C_contacto': 24, '3C_tresbolillo_cuadrete': 21, '3C_contacto': 21 }, metodoG: { '3C_plano_horizontal_separado_1D': 32, '3C_plano_vertical_separado_1D': 27 } } },
      2.5: { multipolar: { metodoE: { '2C': 33, '3C': 29 } }, unipolar: { metodoF: { '2C_contacto': 33, '3C_tresbolillo_cuadrete': 29, '3C_contacto': 29 }, metodoG: { '3C_plano_horizontal_separado_1D': 43, '3C_plano_vertical': 35 } } },
      4: { multipolar: { metodoE: { '2C': 45, '3C': 38 } }, unipolar: { metodoF: { '2C_contacto': 45, '3C_tresbolillo_cuadrete': 38, '3C_contacto': 38 }, metodoG: { '3C_plano_horizontal_separado_1D': 56, '3C_plano_vertical': 45 } } },
      6: { multipolar: { metodoE: { '2C': 57, '3C': 49 } }, unipolar: { metodoF: { '2C_contacto': 57, '3C_tresbolillo_cuadrete': 49, '3C_contacto': 49 }, metodoG: { '3C_plano_horizontal_separado_1D': 71, '3C_plano_vertical': 57 } } },
      10: { multipolar: { metodoE: { '2C': 78, '3C': 68 } }, unipolar: { metodoF: { '2C_contacto': 78, '3C_tresbolillo_cuadrete': 68, '3C_contacto': 68 }, metodoG: { '3C_plano_horizontal_separado_1D': 95, '3C_plano_vertical': 78 } } },
      16: { multipolar: { metodoE: { '2C': 105, '3C': 91 } }, unipolar: { metodoF: { '2C_contacto': 105, '3C_tresbolillo_cuadrete': 91, '3C_contacto': 91 }, metodoG: { '3C_plano_horizontal_separado_1D': 125, '3C_plano_vertical': 105 } } },
      25: { multipolar: { metodoE: { '2C': 136, '3C': 116 } }, unipolar: { metodoF: { '2C_contacto': 147, '3C_tresbolillo_cuadrete': 123, '3C_contacto': 128 }, metodoG: { '3C_plano_horizontal_separado_1D': 166, '3C_plano_vertical': 147 } } },
      35: { multipolar: { metodoE: { '2C': 168, '3C': 144 } }, unipolar: { metodoF: { '2C_contacto': 182, '3C_tresbolillo_cuadrete': 154, '3C_contacto': 160 }, metodoG: { '3C_plano_horizontal_separado_1D': 206, '3C_plano_vertical': 183 } } },
      50: { multipolar: { metodoE: { '2C': 205, '3C': 175 } }, unipolar: { metodoF: { '2C_contacto': 220, '3C_tresbolillo_cuadrete': 188, '3C_contacto': 197 }, metodoG: { '3C_plano_horizontal_separado_1D': 250, '3C_plano_vertical': 224 } } },
      70: { multipolar: { metodoE: { '2C': 263, '3C': 224 } }, unipolar: { metodoF: { '2C_contacto': 282, '3C_tresbolillo_cuadrete': 244, '3C_contacto': 254 }, metodoG: { '3C_plano_horizontal_separado_1D': 321, '3C_plano_vertical': 289 } } },
      95: { multipolar: { metodoE: { '2C': 320, '3C': 271 } }, unipolar: { metodoF: { '2C_contacto': 343, '3C_tresbolillo_cuadrete': 298, '3C_contacto': 311 }, metodoG: { '3C_plano_horizontal_separado_1D': 391, '3C_plano_vertical': 354 } } },
      120: { multipolar: { metodoE: { '2C': 373, '3C': 315 } }, unipolar: { metodoF: { '2C_contacto': 398, '3C_tresbolillo_cuadrete': 349, '3C_contacto': 364 }, metodoG: { '3C_plano_horizontal_separado_1D': 455, '3C_plano_vertical': 413 } } },
      150: { multipolar: { metodoE: { '2C': 430, '3C': 363 } }, unipolar: { metodoF: { '2C_contacto': 459, '3C_tresbolillo_cuadrete': 404, '3C_contacto': 422 }, metodoG: { '3C_plano_horizontal_separado_1D': 525, '3C_plano_vertical': 480 } } },
      185: { multipolar: { metodoE: { '2C': 493, '3C': 415 } }, unipolar: { metodoF: { '2C_contacto': 523, '3C_tresbolillo_cuadrete': 464, '3C_contacto': 485 }, metodoG: { '3C_plano_horizontal_separado_1D': 602, '3C_plano_vertical': 551 } } },
      240: { multipolar: { metodoE: { '2C': 583, '3C': 490 } }, unipolar: { metodoF: { '2C_contacto': 618, '3C_tresbolillo_cuadrete': 552, '3C_contacto': 577 }, metodoG: { '3C_plano_horizontal_separado_1D': 711, '3C_plano_vertical': 654 } } }
    }
  },
  {
    norma: "B52-13",
    aislacion: "XLPE",
    material: "Aluminio",
    nConductoresCargados: 3,
    tempConductor: 90,
    tempAmbienteAire: 40,
    tempAmbienteEnterrado: 25,
    metodosSoportados: { E: 'ambos', F: 'unipolar', G: 'unipolar' },
    datos: {
      2.5: { multipolar: { metodoE: { '2C': 25, '3C': 22 } }, unipolar: { metodoF: { '2C_contacto': 25, '3C_tresbolillo_cuadrete': 22, '3C_contacto': 22 }, metodoG: { '3C_plano_horizontal_separado_1D': 26, '3C_plano_vertical_separado_1D': 22 } } },
      4: { multipolar: { metodoE: { '2C': 35, '3C': 29 } }, unipolar: { metodoF: { '2C_contacto': 35, '3C_tresbolillo_cuadrete': 29, '3C_contacto': 29 }, metodoG: { '3C_plano_horizontal_separado_1D': 35, '3C_plano_vertical': 29 } } },
      6: { multipolar: { metodoE: { '2C': 45, '3C': 38 } }, unipolar: { metodoF: { '2C_contacto': 45, '3C_tresbolillo_cuadrete': 38, '3C_contacto': 38 }, metodoG: { '3C_plano_horizontal_separado_1D': 45, '3C_plano_vertical': 38 } } },
      10: { multipolar: { metodoE: { '2C': 61, '3C': 53 } }, unipolar: { metodoF: { '2C_contacto': 61, '3C_tresbolillo_cuadrete': 53, '3C_contacto': 53 }, metodoG: { '3C_plano_horizontal_separado_1D': 61, '3C_plano_vertical': 53 } } },
      16: { multipolar: { metodoE: { '2C': 83, '3C': 70 } }, unipolar: { metodoF: { '2C_contacto': 83, '3C_tresbolillo_cuadrete': 70, '3C_contacto': 70 }, metodoG: { '3C_plano_horizontal_separado_1D': 83, '3C_plano_vertical': 70 } } },
      25: { multipolar: { metodoE: { '2C': 98, '3C': 88 } }, unipolar: { metodoF: { '2C_contacto': 110, '3C_tresbolillo_cuadrete': 94, '3C_contacto': 97 }, metodoG: { '3C_plano_horizontal_separado_1D': 126, '3C_plano_vertical': 111 } } },
      35: { multipolar: { metodoE: { '2C': 123, '3C': 109 } }, unipolar: { metodoF: { '2C_contacto': 137, '3C_tresbolillo_cuadrete': 117, '3C_contacto': 123 }, metodoG: { '3C_plano_horizontal_separado_1D': 157, '3C_plano_vertical': 139 } } },
      50: { multipolar: { metodoE: { '2C': 149, '3C': 133 } }, unipolar: { metodoF: { '2C_contacto': 167, '3C_tresbolillo_cuadrete': 145, '3C_contacto': 150 }, metodoG: { '3C_plano_horizontal_separado_1D': 191, '3C_plano_vertical': 171 } } },
      70: { multipolar: { metodoE: { '2C': 192, '3C': 170 } }, unipolar: { metodoF: { '2C_contacto': 216, '3C_tresbolillo_cuadrete': 187, '3C_contacto': 196 }, metodoG: { '3C_plano_horizontal_separado_1D': 247, '3C_plano_vertical': 222 } } },
      95: { multipolar: { metodoE: { '2C': 234, '3C': 207 } }, unipolar: { metodoF: { '2C_contacto': 263, '3C_tresbolillo_cuadrete': 230, '3C_contacto': 240 }, metodoG: { '3C_plano_horizontal_separado_1D': 302, '3C_plano_vertical': 273 } } },
      120: { multipolar: { metodoE: { '2C': 273, '3C': 239 } }, unipolar: { metodoF: { '2C_contacto': 307, '3C_tresbolillo_cuadrete': 269, '3C_contacto': 280 }, metodoG: { '3C_plano_horizontal_separado_1D': 352, '3C_plano_vertical': 319 } } },
      150: { multipolar: { metodoE: { '2C': 315, '3C': 277 } }, unipolar: { metodoF: { '2C_contacto': 354, '3C_tresbolillo_cuadrete': 312, '3C_contacto': 326 }, metodoG: { '3C_plano_horizontal_separado_1D': 408, '3C_plano_vertical': 371 } } },
      185: { multipolar: { metodoE: { '2C': 361, '3C': 316 } }, unipolar: { metodoF: { '2C_contacto': 407, '3C_tresbolillo_cuadrete': 359, '3C_contacto': 376 }, metodoG: { '3C_plano_horizontal_separado_1D': 469, '3C_plano_vertical': 428 } } },
      240: { multipolar: { metodoE: { '2C': 428, '3C': 372 } }, unipolar: { metodoF: { '2C_contacto': 482, '3C_tresbolillo_cuadrete': 429, '3C_contacto': 448 }, metodoG: { '3C_plano_horizontal_separado_1D': 556, '3C_plano_vertical': 511 } } }
    }
  }
];
