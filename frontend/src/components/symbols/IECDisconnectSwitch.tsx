export const IECDisconnectSwitch = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle cx="0" cy="-10" r="3" fill="currentColor" />
    <circle cx="0" cy="10" r="3" fill="currentColor" />
    <line x1="0" y1="-7" x2="0" y2="7" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
  </g>
);
