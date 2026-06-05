// Definición de métodos según tipo de cable
export const METODOS_INSTALACION = {
  Multipolar: [
    { value: 'A1', label: 'A1 - Embutida pared aislante' },
    { value: 'A2', label: 'A2 - Embutida pared aislante' },
    { value: 'B1', label: 'B1 - Cañería apoyada pared' },
    { value: 'B2', label: 'B2 - Cañería apoyada pared' },
    { value: 'C', label: 'C - Sobre pared' },
    { value: 'D1', label: 'D1 - Enterrado en cañería' },
    { value: 'D2', label: 'D2 - Enterrado directo' },
    { value: 'E', label: 'E - Bandeja tipo escalera' },
  ],
  Unipolar: [
    { value: 'E', label: 'E - Bandeja tipo escalera' },
    { value: 'F', label: 'F - Tres unipolares contacto' },
    { value: 'G', label: 'G - Tres unipolares separados' },
  ]
};
