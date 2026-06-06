// Definición de métodos según tipo de cable, basados en AEA 90364-5-52
export const METODOS_INSTALACION = {
  Multipolar: [
    { value: 'A2', label: 'A2' },
    { value: 'B2', label: 'B2' },
    { value: 'C', label: 'C' },
    { value: 'D1', label: 'D1' },
    { value: 'D2', label: 'D2' },
    { value: 'E', label: 'E' },
  ],
  Unipolar: [
    { value: 'A1', label: 'A1' },
    { value: 'B1', label: 'B1' },
    { value: 'C', label: 'C' },
    { value: 'D1', label: 'D1' },
    { value: 'D2', label: 'D2' },
    { value: 'F', label: 'F' },
    { value: 'G', label: 'G' },
  ]
};
