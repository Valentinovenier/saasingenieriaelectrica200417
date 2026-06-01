export const PIAUnifilar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 40" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    {/* Caja de PIA: un pequeño cuadro representativo */}
    <rect x="4" y="10" width="12" height="20" />
    {/* Conexiones */}
    <line x1="10" y1="0" x2="10" y2="10" />
    <line x1="10" y1="30" x2="10" y2="40" />
  </svg>
);