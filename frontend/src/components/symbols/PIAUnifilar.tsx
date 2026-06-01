export const PIAUnifilar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 40" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    {/* Caja de PIA */}
    <rect x="2" y="10" width="16" height="20" />
    {/* Línea diagonal */}
    <line x1="2" y1="30" x2="18" y2="10" />
    {/* Conexiones */}
    <line x1="10" y1="0" x2="10" y2="10" />
    <line x1="10" y1="30" x2="10" y2="40" />
  </svg>
);