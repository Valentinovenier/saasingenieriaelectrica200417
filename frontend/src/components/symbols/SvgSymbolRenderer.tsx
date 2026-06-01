import React, { useMemo } from 'react';

// Importaciones directas de los SVGs originales
import InterruptorSvg from './InterruptorAutomatico.svg';
import PIASvg from './PIA.svg';

interface SvgSymbolProps {
  type: 'Interruptor Automático' | 'PIA';
  className?: string;
}

export const SvgSymbolRenderer = ({ type, className }: SvgSymbolProps) => {
  const src = type === 'Interruptor Automático' ? InterruptorSvg : PIASvg;

  // Como los SVGs originales pueden tener fondos o colores fijos,
  // el enfoque más limpio es usar <img> si queremos preservar tal cual,
  // o <object>/inline si queremos manipular CSS.
  // Dado que queremos transparencia y color dinámico, 
  // una técnica robusta es renderizar el SVG como un componente.
  
  return (
    <img 
      src={src} 
      alt={type} 
      className={`w-full h-full object-contain ${className}`}
      style={{ filter: 'invert(1) sepia(1) saturate(0) hue-rotate(180deg)' }} // Intento forzar color blanco
    />
  );
};
