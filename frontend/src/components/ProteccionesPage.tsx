import { Project } from '../types/project';

export const ProteccionesPage = ({ project, onSave }: { project: Project, onSave: (p: Project) => void }) => {
  return (
    <div className="space-y-8 bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <h2 className="text-2xl font-bold text-white">Configuración de Protecciones</h2>

      {/* Marca de Protección */}
      <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-slate-700">
        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Marca Protección</label>
        <select 
            className="w-full bg-[var(--bg-secondary)] p-2 rounded-lg border border-slate-700 text-white" 
            value={(project as any).marcaProteccion || 'Schneider'} 
            onChange={(e) => onSave({...project, marcaProteccion: e.target.value} as any)}
        >
            <option value="Schneider">Schneider</option>
            <option value="ABB">ABB</option>
        </select>
      </div>
      
      <div className="text-white">Más configuraciones de protecciones próximamente...</div>
    </div>
  );
};
