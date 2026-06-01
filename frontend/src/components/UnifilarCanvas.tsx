import React from 'react';
import { useProject } from '../context/ProjectDataContext';
import { SymbolRenderer } from './SymbolRenderer';
import { TransformadorUnifilar } from './symbols/TransformadorUnifilar';
import { PIAUnifilar } from './symbols/PIAUnifilar';
import { TableroUnifilar } from './symbols/TableroUnifilar';

export const UnifilarCanvas = () => {
  const { state } = useProject();
  if (!state) return null;

  return (
    <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-slate-800 h-full">
      <h2 className="text-lg font-semibold text-white mb-6">Diagrama Unifilar</h2>
      
      <svg width="100%" height="500" viewBox="0 0 500 500" className="bg-[var(--bg-primary)] rounded-lg">
        {/* Transformador */}
        <foreignObject x="225" y="20" width="50" height="50">
           <TransformadorUnifilar className="w-full h-full text-white" />
        </foreignObject>
        <text x="250" y="85" textAnchor="middle" fill="white" fontSize="12">{state.transformador?.potencia || 0} kVA</text>
        
        {/* Línea de conexión principal */}
        <line x1="250" y1="70" x2="250" y2="90" stroke="white" strokeWidth="2" />
        
        {/* Protección Cabecera (PIA) */}
        <foreignObject x="235" y="90" width="30" height="40">
           <PIAUnifilar className="w-full h-full text-white" />
        </foreignObject>

        {/* Línea hacia la Barra */}
        <line x1="250" y1="130" x2="250" y2="135" stroke="white" strokeWidth="2" />
        
        {/* Barra Principal */}
        <line x1="50" y1="135" x2="450" y2="135" stroke="white" strokeWidth="4" />

        {/* Tableros */}
        {(state.tableros || []).map((tablero, index) => {
          const x = 100 + index * 80;
          return (
            <g key={tablero.id}>
              {/* Conexión */}
              <line x1={x} y1="135" x2={x} y2="155" stroke="white" strokeWidth="2" />
              
              {/* Protección Salida */}
              <foreignObject x={x - 10} y={155} width="20" height="40">
                  <SymbolRenderer name={tablero.proteccionCabecera?.tipo === 'Fusible' ? 'fusible' : 'termomagnetica'} category="protecciones" className="w-full h-full text-white" />
              </foreignObject>

              {/* Tablero Seccional */}
              <foreignObject x={x - 15} y={195} width="30" height="30">
                  <TableroUnifilar className="w-full h-full text-white" />
              </foreignObject>

              <text x={x} y={245} textAnchor="middle" fill="white" fontSize="10">{tablero.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
