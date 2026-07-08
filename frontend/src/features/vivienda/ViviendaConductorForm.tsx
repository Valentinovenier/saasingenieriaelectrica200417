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
            canalizacionId: newConductor.canalizacionId,
            tempSuelo: newConductor.tempSuelo,
            resistividadTermica: newConductor.resistividadTermica,
            separacionBordes: newConductor.separacionBordes,
            normaCable: newConductor.normaCable
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
                <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Norma del Cable</label>
                <select 
                    className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
                    value={conductor?.normaCable || ''}
                    onChange={(e) => handleDataChange({ normaCable: e.target.value as any, metodoInstalacion: '' })}
                >
                    <option value="">Seleccionar norma</option>
                    <option value="IRAM-NM 247-3">IRAM-NM 247-3</option>
                    <option value="IRAM 62267">IRAM 62267</option>
                    <option value="IRAM 2178">IRAM 2178</option>
                </select>
            </div>

            {conductor?.normaCable && (
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
                                if (conductor.normaCable === 'IRAM 2178') {
                                    return ['B1', 'B2', 'D1', 'D2'].includes(m.value);
                                } else {
                                    // IRAM-NM 247-3 y IRAM 62267 solo permiten B1
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
        </div>
    </div>
  );
};
