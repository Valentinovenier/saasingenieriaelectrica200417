import React from 'react';

// Símbolo vectorial recreado basado en la estructura de InterruptorAutomatico.svg
export const InterruptorAutomaticoUnifilar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 40" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    {/* Contorno rectangular */}
    <rect x="2" y="10" width="16" height="20" />
    {/* Línea diagonal característica de interruptor automático */}
    <line x1="2" y1="30" x2="18" y2="10" />
    {/* Conexiones */}
    <line x1="10" y1="0" x2="10" y2="10" />
    <line x1="10" y1="30" x2="10" y2="40" />
  </svg>
);

// Símbolo vectorial recreado basado en la estructura de PIA.svg
export const PIAUnifilar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 40" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    {/* Caja de PIA: un pequeño cuadro representativo */}
    <rect x="4" y="10" width="12" height="20" />
    {/* Conexiones */}
    <line x1="10" y1="0" x2="10" y2="10" />
    <line x1="10" y1="30" x2="10" y2="40" />
  </svg>
);
