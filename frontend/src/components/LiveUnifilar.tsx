import { Project } from '../types/project';

export const LiveUnifilar = ({ project }: { project: Project }) => {
  return (
    <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-slate-800">
      <h3 className="text-xl font-bold text-white mb-6">Esquema Unifilar en Vivo</h3>
      <div className="flex flex-col items-center gap-4">
        {/* Transformador */}
        <div className="w-24 h-24 border-2 border-white rounded-lg flex items-center justify-center text-white">
          TX: {project.transformador?.potencia || 0} kVA
        </div>
        
        {/* Interruptor Cabecera */}
        <div className="w-8 h-8 border-2 border-white rotate-45" />

        {/* Barra Omnibus */}
        <div className="w-full h-2 bg-white rounded-full my-4" />

        {/* Tableros */}
        <div className="flex gap-4">
          {project.tableros.map((t) => (
            <div key={t.id} className="flex flex-col items-center">
              <div className="w-4 h-8 bg-white" />
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
