export const IECTransformer = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Círculos del transformador */}
    <circle cx="0" cy="-15" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="0" cy="15" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
    {/* Línea central */}
    <line x1="0" y1="-30" x2="0" y2="30" stroke="currentColor" strokeWidth="2" />
  </g>
);
