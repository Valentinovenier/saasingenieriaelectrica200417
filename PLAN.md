# Plan de Trabajo: Actualizaciones del Proyecto

## Objetivo
Realizar una serie de mejoras en la aplicación de diseño eléctrico, incluyendo la implementación de cálculos de cables según normas AEA, mejoras en la UI de tableros, normalización de nombres de circuitos y corrección de flujos de guardado.

## Fase 1: Investigación y Mapeo
- [ ] Identificar la lógica de creación de "Tableros Seccionales" y el componente de UI.
- [ ] Localizar la definición de los circuitos (TUG, IUG, TUE) y sus etiquetas en la UI.
- [ ] Analizar el flujo del paso 5 en la configuración de parámetros y la lógica del botón "Guardar".
- [ ] Revisar la estructura de datos actual para cálculos de conductores.

## Fase 2: Implementación - Parámetros y Circuitos
- [ ] Renombrar "TUG", "IUG", "TUE" a "Circuito IUG 1", etc., en los archivos de datos y componentes.
- [ ] Corregir la funcionalidad del botón "Guardar" en el paso 5 de los parámetros.
- [ ] Eliminar el botón "Guardar configuración" y consolidar la funcionalidad.

## Fase 3: Implementación - Tableros y UI
- [ ] Modificar el componente de "Tableros Seccionales" para incluir un modal al crear un nuevo tablero.
- [ ] Implementar la lógica de nombrado automático (Predeterminado: "Tablero Seccional 1", "Tablero Seccional 2", etc.).
- [ ] Cambiar la etiqueta "Circuitos Terminales" a "Circuitos" en todos los tableros.
- [ ] Agregar el botón "Guardar" en los tableros.

## Fase 4: Implementación - Cálculos AEA
- [ ] Integrar las tablas de la AEA para la verificación de cables dentro de los tableros.
- [ ] Validar los cálculos contra los datos existentes.

## Fase 5: Verificación y Pruebas
- [ ] Probar el flujo de creación y nombrado de tableros.
- [ ] Verificar que el guardado de parámetros funcione correctamente.
- [ ] Validar los nuevos nombres de circuitos.
- [ ] Ejecutar pruebas unitarias para los nuevos cálculos de cables.
