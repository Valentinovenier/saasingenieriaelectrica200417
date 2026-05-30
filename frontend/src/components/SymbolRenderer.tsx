import React from 'react';

// Importamos los símbolos como URLs (Vite lo permite directamente)
// Para que esto funcione dinámicamente sin importar manualmente cada uno, 
// usaremos una función que mapee el nombre al archivo.
// Como estamos en Vite, usaremos import.meta.glob para cargar todos los SVG.

const symbolModules = import.meta.glob('../assets/symbols/*.svg', { eager: true, as: 'url' });

interface SymbolRendererProps {
  name: string;
  className?: string;
  [key: string]: any;
}

export const SymbolRenderer = ({ name, className, ...props }: SymbolRendererProps) => {
  const symbolPath = `../assets/symbols/${name}.svg`;
  const src = symbolModules[symbolPath];

  if (!src) {
    console.warn(`Símbolo no encontrado: ${name}`);
    return null;
  }

  // Renderizamos usando un elemento img o object. 
  // Para que el color cambie con "currentColor" (necesario para temas), 
  // la mejor opción en React suele ser inyectar el SVG, 
  // pero para empezar, usaremos un componente SVG que cargue el contenido.
  
  return (
    <img 
      src={src} 
      alt={name} 
      className={`fill-current text-white ${className}`} 
      {...props} 
    />
  );
};
