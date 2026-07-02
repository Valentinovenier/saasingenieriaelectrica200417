import { Conductor } from '../../types/project';
import { useProject } from '../../context/ProjectDataContext';

// TODO: Importar el calculador comercial cuando esté listo en el motor
// import { calcularTramoComercial } from '../../engine/strategies/comercial/calculador';

interface Props {
  label: string;
  conductor?: Conductor;
  onChange: (c: Conductor) => void;
  tramoId?: string;
}

export const ComercialConductorForm = ({ label, conductor, onChange }: Props) => {
  const { state: project } = useProject();

  const handleDataChange = (updates: Partial<Conductor>) => {
    const newConductor = { ...conductor, ...updates } as Conductor;
    
    // TODO: Implementar lógica de recálculo para Comercial (AEA-90364-7-771)
    // newConductor.resultadoCalculo = calcularTramoComercial(...)
    
    onChange(newConductor);
  };

  return (
    <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-sm">
        <label className="text-xs font-medium text-slate-400 mb-4 block border-b border-slate-800 pb-2">
            {label} <span className="text-[var(--accent)] ml-2">(Normativa Comercial AEA-90364-7-771)</span>
        </label>
        
        <div className="grid grid-cols-1 gap-4">
            <div>
                <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Longitud (m)</label>
                <input 
                    type="number"
                    className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
                    value={conductor?.longitud || ''}
                    onChange={(e) => handleDataChange({ longitud: parseFloat(e.target.value) || 0 })}
                />
            </div>
            {/* Otros campos específicos de comercial irían aquí */}
        </div>
    </div>
  );
};
