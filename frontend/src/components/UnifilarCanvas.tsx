import React from 'react';
import { useProject } from '../context/ProjectDataContext';
import { SymbolRenderer } from './SymbolRenderer';

export const UnifilarCanvas = () => {
  const { state } = useProject();

  return (
    <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-slate-800 h-full relative">
      <h2 className="text-lg font-semibold text-white mb-6">Diagrama Unifilar</h2>
      
      {/* Usamos un contenedor para renderizar los símbolos SVG posicionados absolutamente sobre el lienzo */}
      <div className="relative w-full h-[400px] bg-[var(--bg-primary)] rounded-lg">
        
        {/* Transformador */}
        <div style={{ position: 'absolute', left: 200, top: 45, transform: 'translate(-50%, -50%)' }}>
          <SymbolRenderer name="transformador" className="w-16 h-16" />
        </div>
        <text x="200" y="30" textAnchor="middle" fill="white" fontSize="12" style={{ position: 'absolute' }}>{state?.transformador?.potencia || 0} kVA</text>
        
        {/* Barra Principal */}
        <div style={{ position: 'absolute', left: 50, top: 120, width: 300, height: 4, backgroundColor: 'white' }} />
        
        {/* Conexión Trafo-Barra */}
        <div style={{ position: 'absolute', left: 200, top: 90, width: 2, height: 30, backgroundColor: 'white' }} />

        {/* Tableros */}
        {state?.tableros.map((tablero: any, index: number) => {
          const x = 80 + index * 60;
          return (
            <div key={tablero.id} style={{ position: 'absolute', left: x, top: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 2, height: 40, backgroundColor: 'white' }} />
              <SymbolRenderer name="blindobarra" className="w-8 h-8" />
              <div className="text-white text-[10px] mt-1">{tablero.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
