// frontend/src/components/conductor-forms/uiMappers.ts

export const METODOS_INSTALACION_VIVIENDA = [
  { label: 'Embutido en pared', value: 'B1' },
  { label: 'Cañería a la vista', value: 'B2' },
  { label: 'Bajo contrapiso', value: 'A1' },
  { label: 'Cielorraso suspendido', value: 'A2' },
  { label: 'Cañería enterrada (D1)', value: 'D1' },
  { label: 'Directamente enterrado (D2)', value: 'D2' },
];

export const TIPOS_CIRCUITO_VIVIENDA = [
  { label: 'Iluminación usos generales', value: 'iluminacion_usos_generales' },
  { label: 'Tomacorrientes usos generales', value: 'tomacorrientes_usos_generales' },
  { label: 'Iluminación con tomacorrientes', value: 'iluminacion_con_tomacorrientes' },
  { label: 'Usos especiales', value: 'usos_especiales' },
  { label: 'Usos específicos', value: 'usos_especificos' },
  { label: 'Usos específicos MBTF', value: 'usos_especificos_mbtf' },
];
