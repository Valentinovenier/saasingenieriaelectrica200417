import { Project } from '../types/project';

export const LiveUnifilar = ({ project }: { project: Project }) => {
  return (
    <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-slate-800">
      <h3 className="text-xl font-bold text-white mb-6">Esquema Unifilar en Vivo</h3>
      <div className="flex flex-col items-center gap-0">
        
        {/* Transformador (Dos círculos) */}
        <svg width="60" height="120" viewBox="0 0 60 120" className="stroke-white fill-none" strokeWidth="2">
          <circle cx="30" cy="30" r="25" />
          <circle cx="30" cy="85" r="25" />
        </svg>
        <div className="text-white text-xs mb-2">TX: {project.transformador?.potencia || 0} kVA</div>
        
        {/* Interruptor (Símbolo normalizado) */}
        <svg width="40" height="40" viewBox="0 0 40 40" className="stroke-white fill-none" strokeWidth="2">
          <line x1="20" y1="5" x2="20" y2="15" />
          <line x1="10" y1="15" x2="30" y2="25" />
          <line x1="20" y1="25" x2="20" y2="35" />
        </svg>

        {/* Barra Omnibus */}
        <div className="w-full h-2 bg-white rounded-full my-4" />

        {/* Tableros */}
        <div className="flex gap-4">
          {project.tableros.map((t) => (
            <div key={t.id} className="flex flex-col items-center">
              <div className="w-1 h-8 bg-white" />
              <div className="w-32 h-20 border-2 border-white rounded-lg p-2 text-white text-xs text-center flex flex-col justify-center">
                {t.name}
                <br />
                {t.potenciaTotal} kW
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
