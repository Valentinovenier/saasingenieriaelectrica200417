import React from 'react';
import { useProject } from '../context/ProjectDataContext';
import { TransformadorUnifilar } from './symbols/TransformadorUnifilar';
import { TableroSeccionalUnifilar } from './symbols/TableroSeccionalUnifilar';
import { InterruptorAutomaticoSvg } from './symbols/InterruptorAutomaticoSvg';
import { PIAUnifilar } from './symbols/ProteccionesUnifilares';
import { Proteccion } from '../types/project';

const ProteccionRenderer = ({ proteccion, className }: { proteccion?: Proteccion, className?: string }) => {
  if (proteccion?.tipo === 'Interruptor Automático') {
    return <InterruptorAutomaticoSvg className={className} />;
  }
  if (proteccion?.tipo === 'PIA') {
    return <PIAUnifilar className={className} />;
  }
  return <div className={`border-2 border-dashed border-white ${className}`} title={proteccion?.tipo} />; 
};
// Definición de tamaño base para símbolos
const SYMBOL_SIZE = 80;

export const UnifilarCanvas = () => {
  const { state } = useProject();
  if (!state) return null;

  return (
    <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-slate-800 h-full">
      <h2 className="text-lg font-semibold text-white mb-6">Diagrama Unifilar</h2>
      
      <svg width="100%" height="800" viewBox="0 0 500 800" className="bg-[var(--bg-primary)] rounded-lg">
        {/* Transformador */}
        <foreignObject x={250 - SYMBOL_SIZE/2} y="20" width={SYMBOL_SIZE} height={SYMBOL_SIZE}>
           <TransformadorUnifilar className="w-full h-full text-white" />
        </foreignObject>
        
        {/* Línea de conexión principal */}
        <line x1="250" y1={20 + SYMBOL_SIZE} x2="250" y2={20 + SYMBOL_SIZE + 20} stroke="white" strokeWidth="4" />
        
        {/* Protección Cabecera Transformador */}
        <foreignObject x={250 - SYMBOL_SIZE/2} y={20 + SYMBOL_SIZE + 20} width={SYMBOL_SIZE} height={SYMBOL_SIZE}>
           <ProteccionRenderer proteccion={state.transformador?.proteccionCabecera} className="w-full h-full text-white" />
        </foreignObject>

        {/* Línea hacia la Barra */}
        <line x1="250" y1={20 + SYMBOL_SIZE*2 + 20} x2="250" y2={20 + SYMBOL_SIZE*2 + 40} stroke="white" strokeWidth="4" />
        
        {/* Barra Principal (Grosor aumentado a 8 para resaltar) */}
        <line x1="50" y1={20 + SYMBOL_SIZE*2 + 40} x2="450" y2={20 + SYMBOL_SIZE*2 + 40} stroke="white" strokeWidth="8" />

        {/* Protecciones de Salida TGBT */}
        {(state.transformador?.proteccionesSalida || []).map((proteccion, index) => {
          const x = 50 + index * 100; 
          const yBarra = 20 + SYMBOL_SIZE*2 + 40;
          return (
            <g key={index}>
              <line x1={x} y1={yBarra} x2={x} y2={yBarra + 30} stroke="white" strokeWidth="4" />
              <foreignObject x={x - SYMBOL_SIZE/2} y={yBarra + 30} width={SYMBOL_SIZE} height={SYMBOL_SIZE}>
                <ProteccionRenderer proteccion={proteccion} className="w-full h-full text-white" />
              </foreignObject>
              <text x={x} y={yBarra + 30 + SYMBOL_SIZE + 20} textAnchor="middle" fill="white" fontSize="14">{proteccion.valorNominal} A</text>
            </g>
          );
        })}

        {/* Tableros */}
        {(state.tableros || []).map((tablero, index) => {
          const x = 200 + index * 120;
          const yBarra = 20 + SYMBOL_SIZE*2 + 40;
          return (
            <g key={tablero.id}>
              {/* Conexión */}
              <line x1={x} y1={yBarra} x2={x} y2={yBarra + 30} stroke="white" strokeWidth="4" />
              
              {/* Tablero Seccional */}
              <foreignObject x={x - SYMBOL_SIZE/2} y={yBarra + 30} width={SYMBOL_SIZE} height={SYMBOL_SIZE}>
                  <TableroSeccionalUnifilar className="w-full h-full text-white" />
              </foreignObject>

              <text x={x} y={yBarra + 30 + SYMBOL_SIZE + 20} textAnchor="middle" fill="white" fontSize="14">{tablero.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
