export const IECFuse = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-5" y="-10" width="10" height="20" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="-5" y1="-10" x2="5" y2="10" stroke="currentColor" strokeWidth="2" />
  </g>
);
