import { Conductor } from '../../types/project';
import { useProject } from '../../context/ProjectDataContext';
import { calcularConductorResidencial } from '../../engine/strategies/vivienda/calculador';
import { METODOS_INSTALACION_VIVIENDA } from './uiMappers';

interface Props {
  label: string;
  conductor?: Conductor;
  onChange: (c: Conductor) => void;
  tramoId?: string;
  hideCanalizacion?: boolean;
}

export const ViviendaConductorForm = ({ label, conductor, onChange, hideCanalizacion }: Props) => {
  const { state: project } = useProject();
  const isPanelTramo = ['LineaPrincipal', 'LineaSeccional'].includes(conductor?.tipoTramo || '');

  const handleDataChange = (updates: Partial<Conductor>) => {
    let newConductor = { ...conductor, ...updates } as Conductor;
    
    // Si es un tramo dentro de un tablero, aseguramos que canalizacionId no esté definido
    if (isPanelTramo || hideCanalizacion) {
        newConductor.canalizacionId = undefined;
    }
    
    // Recálculo automático delegado al motor centralizado
    if (project) {
        newConductor = calcularConductorResidencial(newConductor, project);
    }
    
    onChange(newConductor);
  };

  return (
    <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-sm">
        <label className="text-xs font-medium text-slate-400 mb-4 block border-b border-slate-800 pb-2">
            {label} <span className="text-[var(--accent)] ml-2">(Normativa Viviendas AEA-90364-7-770)</span>
        </label>
        
        <div className="grid grid-cols-1 gap-4">
            {/* Selección de Canalización - Ahora es mandatoria para obtener la norma, salvo en tableros o si se oculta */}
            {!hideCanalizacion && !isPanelTramo && (
            <div>
                <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Canalización</label>
                <select 
                    className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
                    value={conductor?.canalizacionId || ''}
                    onChange={(e) => handleDataChange({ canalizacionId: e.target.value })}
                >
                    <option value="">Seleccionar Canalización</option>
                    {project?.canalizaciones?.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
            </div>
            )}

            {/* Método de Instalación - Ahora depende de la norma de la canalización seleccionada o si es tramo de tablero o si se oculta la canalización en la raíz */}
            {(conductor?.canalizacionId || conductor?.normaCable || isPanelTramo || hideCanalizacion) && (
                <div>
                    <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Método de Instalación</label>
                    <select 
                        className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
                        value={conductor?.metodoInstalacion || ''}
                        onChange={(e) => handleDataChange({ metodoInstalacion: e.target.value })}
                    >
                        <option value="">Selecciona Método</option>
                        {METODOS_INSTALACION_VIVIENDA
                            .filter(m => {
                                if (isPanelTramo || hideCanalizacion) return true;
                                const canalizacion = project?.canalizaciones?.find(c => c.id === conductor?.canalizacionId);
                                const norma = canalizacion?.normaCable || conductor?.normaCable;
                                if (norma === 'IRAM 2178') {
                                    return ['B1', 'B2', 'D1', 'D2'].includes(m.value);
                                } else {
                                    return m.value === 'B1';
                                }
                            })
                            .map((m: {label: string, value: string}) => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))
                        }
                    </select>
                </div>
            )}

            {conductor?.metodoInstalacion?.startsWith('D') && (
                <>
                    <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Temp. Suelo (°C)</label>
                        <input 
                            type="number"
                            className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
                            value={conductor?.tempSuelo ?? 25}
                            onChange={(e) => handleDataChange({ tempSuelo: parseFloat(e.target.value) || 25 })}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Resistividad Térmica (K·m/W)</label>
                        <input 
                            type="number"
                            step="0.1"
                            className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
                            value={conductor?.resistividadTermica ?? 1.0}
                            onChange={(e) => handleDataChange({ resistividadTermica: parseFloat(e.target.value) || 1.0 })}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Separación de bordes</label>
                        <select 
                            className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
                            value={conductor?.separacionBordes || 'en_contacto'}
                            onChange={(e) => handleDataChange({ separacionBordes: e.target.value })}
                        >
                            <option value="en_contacto">En contacto</option>
                            {conductor?.metodoInstalacion.startsWith('D1') && (
                                <>
                                    <option value="sep_0.25">0.25m</option>
                                    <option value="sep_0.5">0.5m</option>
                                    <option value="sep_1.0">1.0m</option>
                                </>
                            )}
                            {conductor?.metodoInstalacion.startsWith('D2') && (
                                <>
                                    <option value="sep_un_diam">Separados un diámetro</option>
                                    <option value="sep_0.125">0.125m</option>
                                    <option value="sep_0.25">0.25m</option>
                                    <option value="sep_0.5">0.5m</option>
                                </>
                            )}
                        </select>
                    </div>
                </>
            )}

            <div>
                <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Longitud (m)</label>
                <input 
                    type="number"
                    className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
                    value={conductor?.longitud || ''}
                    onChange={(e) => handleDataChange({ longitud: parseFloat(e.target.value) || 0 })}
                />
            </div>
            
            {conductor?.tipoCircuito === 'iluminacion_usos_generales' && (
              <div>
                <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Cantidad de Tomas TUG (derivados)</label>
                <input 
                    type="number"
                    min={0}
                    className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
                    value={conductor?.tomasTUGDerivados || 0}
                    onChange={(e) => handleDataChange({ tomasTUGDerivados: parseInt(e.target.value) || 0 })}
                />
              </div>
            )}
        </div>
    </div>
  );
};
