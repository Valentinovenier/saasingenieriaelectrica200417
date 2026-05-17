export const IECEarth = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    <line x1="0" y1="0" x2="0" y2="15" stroke="currentColor" strokeWidth="2" />
    <line x1="-10" y1="15" x2="10" y2="15" stroke="currentColor" strokeWidth="2" />
    <line x1="-6" y1="20" x2="6" y2="20" stroke="currentColor" strokeWidth="2" />
    <line x1="-2" y1="25" x2="2" y2="25" stroke="currentColor" strokeWidth="2" />
  </g>
);
