import React from 'react';
import { useProject } from '../context/ProjectDataContext';
import { IECTransformer } from './symbols/IECTransformer';
import { IECBreaker } from './symbols/IECBreaker';

export const UnifilarCanvas = () => {
  const { state } = useProject();

  return (
    <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-slate-800 h-full">
      <h2 className="text-lg font-semibold text-white mb-6">Diagrama Unifilar</h2>
      <svg width="100%" height="400" viewBox="0 0 400 400" className="bg-[var(--bg-primary)] rounded-lg text-white" stroke="currentColor">
        {/* Transformador */}
        <IECTransformer x={200} y={45} />
        <text x="200" y="20" textAnchor="middle" fill="white" fontSize="12">{state?.transformador?.potencia || 0} kVA</text>
        
        {/* Barra Principal */}
        <line x1="50" y1="120" x2="350" y2="120" stroke="white" strokeWidth="4" />
        
        {/* Conexión Trafo-Barra */}
        <line x1="200" y1="90" x2="200" y2="120" stroke="white" strokeWidth="2" />

        {/* Tableros */}
        {state?.tableros.map((tablero: any, index: number) => {
          const x = 80 + index * 60;
          return (
            <g key={tablero.id}>
              <line x1={x} y1="120" x2={x} y2="160" stroke="white" strokeWidth="2" />
              <IECBreaker x={x} y={180} />
              <text x={x} y={220} textAnchor="middle" fill="white" fontSize="10">{tablero.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
