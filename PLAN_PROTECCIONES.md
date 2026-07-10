# Plan de Trabajo: Gestión de Protecciones en Tableros

## Objetivo
Implementar la capacidad de configurar protecciones (cabecera y por salida) en tableros principales, seccionales y subseccionales, con una interfaz uniforme.

## Fase 1: Análisis y Modelado de Datos
- [ ] Actualizar interfaces de `Tablero`, `TableroSeccional` en `project.ts` para uniformizar la estructura de protecciones (`proteccionCabecera`, `proteccionesSalida`).
- [ ] Asegurar que `Proteccion` en `project.ts` sea compatible con la estructura que maneja `ProteccionesForm.tsx`.

## Fase 2: Componentes de UI Reutilizables
- [ ] Crear/adaptar un componente `ConfiguracionProteccion` que reciba `initialData` y una función `onChange`. Este componente integrará `ProteccionesForm` para la edición/creación.
- [ ] Diseñar la UI para gestionar:
    - [ ] Cabecera (opcional en seccionales).
    - [ ] Lista de protecciones por salida (asociadas a circuitos o cargas).

## Fase 3: Integración en Tableros
- [ ] Actualizar `TablerosSeccionales.tsx` y `TablerosVivienda.tsx` para integrar el componente `ConfiguracionProteccion`.
- [ ] Implementar la lógica para guardar estas protecciones en el objeto del proyecto.

## Fase 4: Validación y Pruebas
- [ ] Verificar que la asignación de protecciones sea consistente en la jerarquía (Principal -> Seccional -> Subseccional).
- [ ] Validar el flujo de guardado de los datos de protección.
