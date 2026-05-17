export const IECBreaker = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Cuerpo del breaker */}
    <rect x="-10" y="-10" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" />
    {/* Línea diagonal característica de interruptor automático */}
    <line x1="-10" y1="10" x2="10" y2="-10" stroke="currentColor" strokeWidth="2" />
    {/* Conexiones */}
    <line x1="0" y1="-20" x2="0" y2="-10" stroke="currentColor" strokeWidth="2" />
    <line x1="0" y1="10" x2="0" y2="20" stroke="currentColor" strokeWidth="2" />
  </g>
);
