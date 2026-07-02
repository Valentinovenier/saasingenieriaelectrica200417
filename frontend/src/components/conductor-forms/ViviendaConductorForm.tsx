import { Conductor } from '../../types/project';
import { useProject } from '../../context/ProjectDataContext';
import { calcularTramoResidencial } from '../../engine/strategies/vivienda/calculador';
import { METODOS_INSTALACION_VIVIENDA, TIPOS_CIRCUITO_VIVIENDA } from './uiMappers';

interface Props {
  label: string;
  conductor?: Conductor;
  onChange: (c: Conductor) => void;
  tramoId?: string;
}

export const ViviendaConductorForm = ({ label, conductor, onChange }: Props) => {
  const { state: project } = useProject();

  const handleDataChange = (updates: Partial<Conductor>) => {
    const newConductor = { ...conductor, ...updates } as Conductor;
    
    // Recálculo automático para Viviendas
    if (newConductor.longitud && newConductor.metodoInstalacion && newConductor.tipoTramo) {
        const resultado = calcularTramoResidencial({
            tipoTramo: newConductor.tipoTramo as 'LineaPrincipal' | 'LineaSeccional' | 'CircuitoTerminal',
            tipoCircuito: (newConductor.tipoCircuito || 'iluminacion_usos_generales') as any,
            metodoInstalacion: newConductor.metodoInstalacion as any,
            longitudMetros: newConductor.longitud || 0,
            corrienteDiseñoAmperes: 16, // placeholder - debería venir del proyecto
            temperaturaAmbiente: project?.tempAmbiente || 30,
            canalizacionId: newConductor.canalizacionId
        }, project as any);
        newConductor.resultadoCalculo = resultado;
        newConductor.seccion = resultado.seccionRecomendada;
    }
    onChange(newConductor);
  };

  return (
    <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-sm">
        <label className="text-xs font-medium text-slate-400 mb-4 block border-b border-slate-800 pb-2">
            {label} <span className="text-[var(--accent)] ml-2">(Normativa Viviendas AEA-90364-7-770)</span>
        </label>
        
        <div className="grid grid-cols-1 gap-4">
            <div>
                <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Método de Instalación</label>
                <select 
                    className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
                    value={conductor?.metodoInstalacion || ''}
                    onChange={(e) => handleDataChange({ metodoInstalacion: e.target.value })}
                >
                    <option value="">Selecciona Método</option>
                    {METODOS_INSTALACION_VIVIENDA.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Longitud (m)</label>
                <input 
                    type="number"
                    className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
                    value={conductor?.longitud || ''}
                    onChange={(e) => handleDataChange({ longitud: parseFloat(e.target.value) || 0 })}
                />
            </div>
        </div>
    </div>
  );
};
