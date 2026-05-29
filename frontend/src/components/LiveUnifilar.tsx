import { Project } from '../types/project';

export const LiveUnifilar = ({ project }: { project: Project }) => {
  return (
    <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-slate-800">
      <h3 className="text-xl font-bold text-white mb-6">Esquema Unifilar en Vivo</h3>
      <div className="flex flex-col items-center gap-0">
        
        {/* Transformador (Dos círculos tangentes) */}
        <svg width="60" height="120" viewBox="0 0 60 120" className="stroke-white fill-none" strokeWidth="2">
          <circle cx="30" cy="35" r="20" />
          <circle cx="30" cy="75" r="20" />
        </svg>
        <div className="text-white text-xs mb-4">TX: {project.transformador?.potencia || 0} kVA</div>
        
        {/* Disyuntor (Cuadrado/Rectángulo) */}
        <svg width="40" height="40" viewBox="0 0 40 40" className="stroke-white fill-none" strokeWidth="2">
          <rect x="12" y="10" width="16" height="16" />
          <line x1="20" y1="2" x2="20" y2="10" />
          <line x1="20" y1="26" x2="20" y2="34" />
        </svg>

        {/* Barra Omnibus */}
        <div className="w-full h-1 bg-white my-4" />

        {/* Tableros */}
        <div className="flex gap-4">
          {(project.tableros || []).map((t) => (
            <div key={t.id} className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-white" />
              <div className="w-28 h-16 border-2 border-white rounded p-2 text-white text-[10px] text-center flex flex-col justify-center">
                {t.name}
                <span className="font-bold">{t.potenciaTotal} kW</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
