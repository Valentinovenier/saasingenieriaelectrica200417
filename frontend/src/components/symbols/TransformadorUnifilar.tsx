export const TransformadorUnifilar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 50 50" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    {/* Círculos representativos de los devanados del transformador */}
    <circle cx="25" cy="15" r="10" />
    <circle cx="25" cy="35" r="10" />
    {/* Conexiones */}
    <line x1="25" y1="0" x2="25" y2="5" />
    <line x1="25" y1="45" x2="25" y2="50" />
  </svg>
);