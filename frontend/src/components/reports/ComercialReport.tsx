import { Project } from '../../types/project';

export const ComercialReport = ({ project }: { project: Project }) => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white mb-4">Memoria de Cálculo: Comercial (AEA 771)</h1>
        
        <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 border-b border-slate-800 pb-2">Resultados de Tramos</h3>
            <div className="space-y-3">
                {Object.entries(project.conductores || {}).map(([key, cond]) => (
                    <div key={key} className="p-3 bg-slate-900 rounded border border-slate-800 text-sm">
                        <p className="font-semibold text-white">{key.replace('__', ' - ')}</p>
                        <p className="text-xs text-slate-400">Sección: {cond.seccion || 'N/A'} mm²</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
