import React from 'react';
import { useProject } from '../context/ProjectDataContext';
import { TransformerSymbol, BoardSymbol } from './symbols/NativeSymbols';

export const UnifilarCanvas = () => {
  const { state } = useProject();

  return (
    <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-slate-800 h-full relative">
      <h2 className="text-lg font-semibold text-white mb-6">Diagrama Unifilar</h2>
      
      {/* Contenedor SVG principal para el esquema */}
      <div className="relative w-full h-[400px] bg-[var(--bg-primary)] rounded-lg overflow-hidden">
        
        {/* Transformador */}
        <div style={{ position: 'absolute', left: 200, top: 45, transform: 'translate(-50%, -50%)' }}>
          <TransformerSymbol className="w-16 h-16" />
        </div>
        <text x="200" y="30" textAnchor="middle" fill="white" fontSize="12" style={{ position: 'absolute' }}>{state?.transformador?.potencia || 0} kVA</text>
        
        {/* Barra Principal */}
        <div style={{ position: 'absolute', left: 50, top: 120, width: 300, height: 4, backgroundColor: 'white' }} />
        
        {/* Conexión Trafo-Barra */}
        <div style={{ position: 'absolute', left: 200, top: 90, width: 2, height: 30, backgroundColor: 'white' }} />

        {/* Tableros */}
        {(state?.tableros || []).map((tablero: any, index: number) => {
          const x = 80 + index * 60;
          return (
            <div key={tablero.id} style={{ position: 'absolute', left: x, top: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 2, height: 40, backgroundColor: 'white' }} />
              <BoardSymbol type={tablero.tipo} className="w-8 h-8" />
              <div className="text-white text-xs font-semibold mt-2 tracking-tight">{tablero.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
