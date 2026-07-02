import { Project } from '../../types/project';
import { Trash2, Plus } from 'lucide-react';
import { transformadoresAceite } from '../../data/transformadoresAceite';
import { transformadoresSecos } from '../../data/transformadoresSecos';
import { calcularImpedanciaTransformador, estimarParametrosTrafo } from '../../engine/strategies/industrial/transformador';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export const IndustrialSettings = ({ project, onChange }: Props) => {
  return (
    <div className="space-y-6">
      {/* Parámetros Generales (Industria) */}
      <section className="bg-[var(--bg-primary)] p-4 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">Parámetros Generales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-sm text-[var(--text-secondary)] block mb-1">Tipo de Instalación</label>
                <select 
                    className="w-full bg-[var(--bg-secondary)] p-2 rounded border border-slate-700 text-white"
                    value={project.tipoInstalacion || 'Trifásica'}
                    onChange={(e) => onChange({...project, tipoInstalacion: e.target.value as 'Monofásica' | 'Trifásica'})}
                >
                    <option value="Trifásica">Trifásica</option>
                    <option value="Monofásica">Monofásica</option>
                </select>
            </div>
            <div>
                <label className="text-sm text-[var(--text-secondary)] block mb-1">Temperatura Ambiente (°C)</label>
                <input 
                    type="number"
                    className="w-full bg-[var(--bg-secondary)] p-2 rounded border border-slate-700 text-white"
                    value={project.tempAmbiente || 30}
                    onChange={(e) => onChange({...project, tempAmbiente: Number(e.target.value)})}
                />
            </div>
            <div>
                <label className="text-sm text-[var(--text-secondary)] block mb-1">Factor de Potencia (cos φ)</label>
                <input 
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    className="w-full bg-[var(--bg-secondary)] p-2 rounded border border-slate-700 text-white"
                    value={project.cosPhi || 0.95}
                    onChange={(e) => onChange({...project, cosPhi: Number(e.target.value)})}
                />
            </div>
            <div>
                <label className="text-sm text-[var(--text-secondary)] block mb-1">Coef. Simultaneidad Global</label>
                <input 
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    className="w-full bg-[var(--bg-secondary)] p-2 rounded border border-slate-700 text-white"
                    value={project.coefSimultaneidad || 1}
                    onChange={(e) => onChange({...project, coefSimultaneidad: Number(e.target.value)})}
                />
            </div>
        </div>
      </section>

      {/* Aquí irían acometida, trafo y armónicos... */}
    </div>
  );
};
