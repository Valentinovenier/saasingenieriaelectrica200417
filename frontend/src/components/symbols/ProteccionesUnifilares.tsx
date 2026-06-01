import React from 'react';

// Símbolo vectorial recreado basándose en el SVG original, simplificando trayectorias para renderizado limpio
export const InterruptorAutomaticoUnifilar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" strokeWidth="15">
    {/* Representación esquemática basada en el SVG original */}
    <line x1="100" y1="20" x2="100" y2="180" />
    <line x1="50" y1="50" x2="150" y2="150" />
    <line x1="50" y1="150" x2="150" y2="50" />
  </svg>
);

// Símbolo vectorial recreado basándose en el SVG original
export const PIAUnifilar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" strokeWidth="15">
    {/* Representación esquemática basada en el SVG original */}
    <rect x="50" y="50" width="100" height="100" />
    <line x1="100" y1="0" x2="100" y2="50" />
    <line x1="100" y1="150" x2="100" y2="200" />
  </svg>
);