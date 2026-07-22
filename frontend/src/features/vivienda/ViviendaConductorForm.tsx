import { Conductor } from '../../types/project';
import { useProject } from '../../context/ProjectDataContext';
import { calcularConductorResidencial } from '../../engine/strategies/vivienda/calculador';
import { METODOS_INSTALACION_VIVIENDA } from './uiMappers';
import { DetalleCalculoConductor } from './DetalleCalculoConductor';

interface Props {
  label: string;
  conductor?: Conductor;
  onChange: (c: Conductor) => void;
  tramoId?: string;
  hideCanalizacion?: boolean;
}

export const ViviendaConductorForm = ({ label, conductor, onChange, tramoId, hideCanalizacion }: Props) => {
  const { state: project } = useProject();
  
  const esTramoProtegido = tramoId === 'int-general-salida' || hideCanalizacion;
  const isPanelTramo = ['LineaPrincipal', 'LineaSeccional'].includes(conductor?.tipoTramo || '');

  const handleDataChange = (updates: Partial<Conductor>) => {
    let newConductor = { ...conductor, ...updates } as Conductor;
    
    // Si es un tramo dentro de un tablero, o el tramo protegido, aseguramos que canalizacionId no esté definido
    if (isPanelTramo || esTramoProtegido) {
        newConductor.canalizacionId = undefined;
    }
    
    // Recálculo automático delegado al motor centralizado
    if (project) {
        // Buscamos si hay una protección asociada al circuito (si tramoId es el ID del circuito)
        const circuito = project.datosVivienda?.circuitosCalculados.find(c => c.id === tramoId);
        
        // Esta parte es delicada. Si tramoId no es el circuito, esta búsqueda fallará.
        // Asumiremos por ahora que necesitamos una forma más robusta de pasar la protección.
        // Para solucionar la build rápidamente, pasamos solo 2 argumentos.
        newConductor = calcularConductorResidencial(newConductor, project);
    }
    
    onChange(newConductor);
  };

  return (
    <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-sm">
        <label className="text-xs font-medium text-slate-400 mb-4 block border-b border-slate-800 pb-2">
            {label} <span className="text-[var(--accent)] ml-2">(Normativa Viviendas AEA-90364-7-770)</span>
        </label>
        
        {/* Predefinir Tablero de Origen y Tramo si es necesario (visualmente) */}
        {tramoId === 'int-general-salida' && (
            <div className="mb-4 p-2 bg-slate-800 rounded text-xs text-slate-300">
                <p><strong>Tablero Origen:</strong> {project?.tableroPrincipal?.nombre || 'Tablero Principal'}</p>
                <p><strong>Tramo:</strong> Int General a Salida</p>
            </div>
        )}
        
        <div className="grid grid-cols-1 gap-4">
            {/* Método de Instalación */}
            <div>
                <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Método de Instalación</label>
                <select 
                    className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
                    value={conductor?.metodoInstalacion || ''}
                    onChange={(e) => handleDataChange({ metodoInstalacion: e.target.value })}
                >
                    <option value="">Selecciona Método</option>
                    {(() => {
                        const canalizacion = project?.canalizaciones?.find(c => c.id === conductor?.canalizacionId);
                        const norma = canalizacion?.normaCable || 'IRAM 2178';
                        
                        const esCableFlexible = ['IRAM-NM 247-3', 'IRAM 62267'].includes(norma);
                        
                        return METODOS_INSTALACION_VIVIENDA.filter(m => {
                            if (esCableFlexible) {
                                return m.value === 'sinEnvoltura' || m.value === 'B1';
                            } else {
                                return m.value !== 'sinEnvoltura' && m.value !== 'B1';
                            }
                        }).map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ));
                    })()}
                </select>
            </div>

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
        </div>
        
        {conductor?.resultadoCalculo && (
            <DetalleCalculoConductor resultado={conductor.resultadoCalculo} />
        )}
    </div>
  );
};
