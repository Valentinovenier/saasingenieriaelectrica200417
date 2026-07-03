import { useState, useEffect } from 'react';
import { Project } from '../../types/project';
import { 
  calcularSuperficieLimite, 
  determinarGradoElectrificacion, 
  obtenerCircuitosMinimos 
} from '../../engine/strategies/vivienda/normas770';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export const ViviendaConfiguracion = ({ project, onChange }: Props) => {
  const datos = project.datosVivienda || { superficieCubierta: 0, superficieSemicubierta: 0, ambientes: [], circuitosCalculados: [] };
  
  const [localDatos, setLocalDatos] = useState(datos);

  // Calcular valores normativos derivados
  const superficieLimite = calcularSuperficieLimite(localDatos);
  const grado = determinarGradoElectrificacion(superficieLimite);
  const circuitosMinimos = obtenerCircuitosMinimos(grado);

  const handleUpdate = (updates: Partial<typeof datos>) => {
    const nuevosDatos = { ...localDatos, ...updates };
    setLocalDatos(nuevosDatos);
    onChange({ ...project, datosVivienda: nuevosDatos });
  };

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700 space-y-6">
      <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Configuración Normativa AEA 770</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Superficie Cubierta (m²)</label>
          <input 
            type="number" 
            className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
            value={localDatos.superficieCubierta}
            onChange={(e) => handleUpdate({ superficieCubierta: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Superficie Semicubierta (m²)</label>
          <input 
            type="number" 
            className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
            value={localDatos.superficieSemicubierta}
            onChange={(e) => handleUpdate({ superficieSemicubierta: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 grid grid-cols-3 gap-4">
        <div>
          <p className="text-[10px] text-slate-500 uppercase">Superficie Límite</p>
          <p className="text-lg font-bold text-[var(--accent)]">{superficieLimite.toFixed(1)} m²</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase">Grado Electrificación</p>
          <p className="text-lg font-bold text-white">{grado}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase">Circuitos Mínimos</p>
          <p className="text-lg font-bold text-white">{circuitosMinimos}</p>
        </div>
      </div>
    </div>
  );
};
