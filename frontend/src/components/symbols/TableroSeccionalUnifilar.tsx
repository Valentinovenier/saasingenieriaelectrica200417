export const TableroSeccionalUnifilar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    {/* Rectángulo principal */}
    <rect x="5" y="5" width="30" height="30" />
    {/* Línea diagonal */}
    <line x1="5" y1="35" x2="35" y2="5" />
    {/* Conexión central superior */}
    <line x1="20" y1="0" x2="20" y2="5" />
  </svg>
);