import React from 'react';

// Símbolo de Transformador (estilo unifilar limpio)
export const TransformerSymbol = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="15" r="8" />
    <circle cx="20" cy="25" r="8" />
  </svg>
);

// Símbolo de Tablero
export const BoardSymbol = ({ type, className }: { type: 'Fuerza Motriz' | 'Iluminación', className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2">
    <rect x="4" y="4" width="24" height="24" rx="2" />
    <text x="16" y="20" fontSize="12" textAnchor="middle" fill="white" strokeWidth="0" fontFamily="sans-serif">
      {type === 'Iluminación' ? 'I' : 'FM'}
    </text>
  </svg>
);
