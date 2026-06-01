export const TableroUnifilar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    {/* Cuadrado del Tablero */}
    <rect x="5" y="5" width="30" height="30" />
    {/* Conexión central */}
    <line x1="20" y1="0" x2="20" y2="5" />
  </svg>
);