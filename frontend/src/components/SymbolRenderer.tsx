import React from 'react';

const symbolModules = import.meta.glob('../assets/symbols/**/*.svg', { eager: true, as: 'url' });

interface SymbolRendererProps {
  name: string;
  category?: 'protecciones' | '';
  className?: string;
  [key: string]: any;
}

export const SymbolRenderer = ({ name, category = '', className, ...props }: SymbolRendererProps) => {
  const path = category ? `../assets/symbols/${category}/${name}.svg` : `../assets/symbols/${name}.svg`;
  const src = symbolModules[path];

  if (!src) {
    console.warn(`Símbolo no encontrado: ${path}`);
    return null;
  }

  return (
    <img 
      src={src} 
      alt={name} 
      className={`stroke-current fill-none ${className}`} 
      {...props} 
    />
  );
};
