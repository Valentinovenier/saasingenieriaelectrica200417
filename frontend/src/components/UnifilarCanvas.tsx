import React from 'react';
import { useProject } from '../context/ProjectDataContext';
import { TransformadorUnifilar } from './symbols/TransformadorUnifilar';
import { TableroSeccionalUnifilar } from './symbols/TableroSeccionalUnifilar';
import { SvgSymbolRenderer } from './symbols/SvgSymbolRenderer';
import { Proteccion } from '../types/project';

const ProteccionRenderer = ({ proteccion, className }: { proteccion?: Proteccion, className?: string }) => {
  if (proteccion?.tipo === 'Interruptor Automático' || proteccion?.tipo === 'PIA') {
    return <SvgSymbolRenderer type={proteccion.tipo} className={className} />;
  }
  return <div className={`border-2 border-dashed border-white ${className}`} title={proteccion?.tipo} />; 
};
export const UnifilarCanvas = () => {
  const { state } = useProject();
  if (!state) return null;

  return (
    <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-slate-800 h-full">
      <h2 className="text-lg font-semibold text-white mb-6">Diagrama Unifilar</h2>
      
      <svg width="100%" height="800" viewBox="0 0 500 800" className="bg-[var(--bg-primary)] rounded-lg">
        {/* Transformador */}
        <foreignObject x="225" y="20" width="50" height="50">
           <TransformadorUnifilar className="w-full h-full text-white" />
        </foreignObject>
        
        {/* Línea de conexión principal */}
        <line x1="250" y1="70" x2="250" y2="90" stroke="white" strokeWidth="2" />
        
        {/* Protección Cabecera Transformador (Asumiendo Interruptor Automático por defecto o configurable) */}
        <foreignObject x="225" y="90" width="50" height="50">
           <ProteccionRenderer proteccion={state.transformador?.proteccionCabecera} className="w-full h-full" />
        </foreignObject>

        {/* Línea hacia la Barra */}
        <line x1="250" y1="140" x2="250" y2="145" stroke="white" strokeWidth="2" />
        
        {/* Barra Principal */}
        <line x1="50" y1="145" x2="450" y2="145" stroke="white" strokeWidth="4" />

        {/* Protecciones de Salida TGBT */}
        {(state.transformador?.proteccionesSalida || []).map((proteccion, index) => {
          const x = 50 + index * 60; // Posicionamiento automático horizontal
          return (
            <g key={index}>
              <line x1={x} y1="145" x2={x} y2="165" stroke="white" strokeWidth="2" />
              <foreignObject x={x - 25} y={165} width="50" height="50">
                <ProteccionRenderer proteccion={proteccion} className="w-full h-full" />
              </foreignObject>
              <text x={x} y={225} textAnchor="middle" fill="white" fontSize="10">{proteccion.valorNominal} A</text>
            </g>
          );
        })}

        {/* Tableros */}
        {(state.tableros || []).map((tablero, index) => {
          const x = 200 + index * 80;
          return (
            <g key={tablero.id}>
              {/* Conexión */}
              <line x1={x} y1="145" x2={x} y2="165" stroke="white" strokeWidth="2" />
              
              {/* Tablero Seccional */}
              <foreignObject x={x - 20} y={165} width="40" height="40">
                  <TableroSeccionalUnifilar className="w-full h-full text-white" />
              </foreignObject>

              <text x={x} y={220} textAnchor="middle" fill="white" fontSize="10">{tablero.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
