// Definición de métodos según tipo de cable, basados en AEA 90364-5-52
export const METODOS_INSTALACION = {
  Multipolar: [
    { value: 'A2', label: 'A2 - Cables multipolares en cañerías embutidas' },
    { value: 'B2', label: 'B2 - Cables multipolares en cañería apoyada' },
    { value: 'C', label: 'C - Sobre pared' },
    { value: 'D1', label: 'D1 - Enterrado en cañería' },
    { value: 'D2', label: 'D2 - Enterrado directo' },
    { value: 'E', label: 'E - Bandeja tipo escalera' },
  ],
  Unipolar: [
    { value: 'A1', label: 'A1 - Conductores unipolares en cañerías embutidas' },
    { value: 'B1', label: 'B1 - Conductores unipolares en cañería apoyada' },
    { value: 'C', label: 'C - Sobre pared' },
    { value: 'D1', label: 'D1 - Enterrado en cañería' },
    { value: 'D2', label: 'D2 - Enterrado directo' },
    { value: 'F', label: 'F - Tres unipolares en contacto' },
    { value: 'G', label: 'G - Tres unipolares separados' },
  ]
};
