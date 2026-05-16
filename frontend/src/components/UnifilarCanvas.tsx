import React from 'react';
import { useProject } from '../context/ProjectDataContext';

export const UnifilarCanvas = () => {
  const { state } = useProject();

  return (
    <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-slate-800 h-full">
      <h2 className="text-lg font-semibold text-white mb-6">Diagrama Unifilar</h2>
      <svg width="100%" height="400" viewBox="0 0 400 400" className="bg-[var(--bg-primary)] rounded-lg">
        {/* Transformador */}
        <circle cx="200" cy="50" r="30" fill="none" stroke="white" strokeWidth="2" />
        <text x="200" y="55" textAnchor="middle" fill="white" fontSize="12">{state.trafo.potenciaKVA} kVA</text>
        
        {/* Barra Principal */}
        <line x1="50" y1="120" x2="350" y2="120" stroke="white" strokeWidth="4" />
        
        {/* Conexión Trafo-Barra */}
        <line x1="200" y1="80" x2="200" y2="120" stroke="white" strokeWidth="2" />

        {/* Tableros */}
        {state.tableros.map((tablero, index) => {
          const x = 80 + index * 60;
          return (
            <g key={tablero.id}>
              <line x1={x} y1="120" x2={x} y2="200" stroke="white" strokeWidth="2" />
              <rect x={x - 20} y="200" width="40" height="40" fill="none" stroke="white" strokeWidth="2" />
              <text x={x} y="260" textAnchor="middle" fill="white" fontSize="10">{tablero.nombre}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
