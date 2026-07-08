import { Project } from '../../types/project';
import { obtenerCircuitosMinimos, obtenerConfiguracionCircuitos } from '../../engine/strategies/vivienda/normas770';
import { Zap, AlertTriangle, Trash2, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { CircuitoCalculado } from '../../types/vivienda';
import { DISTRIBUCION_CIRCUITOS } from '../../data/vivienda/circuitosDistribucion';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export const ViviendaCircuitos = ({ project, onChange }: Props) => {
  const datos = project.datosVivienda || { superficieCubierta: 0, superficieSemicubierta: 0, ambientes: [], circuitosCalculados: [], gradoElectrificacion: 'Minimo', varianteElectrificacion: 'Única' };
  
  const grado = datos.gradoElectrificacion || 'Minimo';
  const variante = datos.varianteElectrificacion || 'Única';
  
  const minCircuitos = obtenerCircuitosMinimos(grado as any, variante);
  const configuraciones = obtenerConfiguracionCircuitos(grado as any);

  // Estados para formulario de nuevo circuito
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState<CircuitoCalculado['tipo']>('iluminacion_usos_generales');

  const addCircuito = () => {
    if (!nuevoNombre) return;
    const nuevoCircuito: CircuitoCalculado = {
        id: `custom-${Date.now()}`,
        nombre: nuevoNombre,
        tipo: nuevoTipo,
        puntosIUG: 0,
        puntosTUG: 0,
        puntosTUE: 0,
        ambientesIds: []
    };
    onChange({ ...project, datosVivienda: { ...datos, circuitosCalculados: [...datos.circuitosCalculados, nuevoCircuito] } });
    setNuevoNombre('');
  };

  const removeCircuito = (id: string) => {
    onChange({ ...project, datosVivienda: { ...datos, circuitosCalculados: datos.circuitosCalculados.filter(c => c.id !== id) } });
  };

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white">Circuitos (AEA 770)</h2>
        <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 ${
            datos.circuitosCalculados.length >= minCircuitos 
            ? 'bg-emerald-900/20 border-emerald-800 text-emerald-400' 
            : 'bg-red-900/20 border-red-800 text-red-400'
        }`}>
            <Zap size={18} />
            <div>
                <p className="text-[10px] uppercase font-bold opacity-70">Circuitos</p>
                <p className="text-lg font-bold">{datos.circuitosCalculados.length} / {minCircuitos} Mínimos</p>
            </div>
        </div>
      </div>

      <div className="space-y-3">
        {datos.circuitosCalculados.map(c => (
          <div key={c.id} className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <div>
                <p className="font-bold text-white">{c.nombre}</p>
                <p className="text-[10px] text-slate-500 uppercase">{c.tipo.replace(/_/g, ' ')}</p>
              </div>
              {c.tipo === 'iluminacion_usos_generales' && (
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={!!c.tieneTomacorrientesDerivados} 
                        onChange={(e) => {
                            const nuevosCircuitos = datos.circuitosCalculados.map(circ => 
                                circ.id === c.id ? { ...circ, tieneTomacorrientesDerivados: e.target.checked } : circ
                            );
                            onChange({ ...project, datosVivienda: { ...datos, circuitosCalculados: nuevosCircuitos } });
                        }}
                    />
                    Tiene tomas derivados
                </label>
              )}
            </div>
            <button onClick={() => removeCircuito(c.id)} className="text-red-400 p-1">
                <Trash2 size={16} />
            </button>
          </div>
        ))}
        {datos.circuitosCalculados.length < minCircuitos && (
            <div className="text-amber-400 text-sm flex items-center gap-2 pt-4">
                <AlertTriangle size={16} />
                Se requiere agregar más circuitos para alcanzar los mínimos.
            </div>
        )}
      </div>

      {/* Formulario nuevo circuito */}
      <div className="bg-slate-900 p-4 rounded-lg border border-dashed border-slate-700 flex flex-col gap-3">
        <p className="text-sm font-bold text-white">Agregar nuevo circuito</p>
        <div className="flex gap-2">
            <input 
                type="text" 
                placeholder="Nombre del circuito" 
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                className="flex-grow bg-slate-800 p-2 rounded-lg text-white text-sm border border-slate-700"
            />
            <select 
                value={nuevoTipo}
                onChange={(e) => setNuevoTipo(e.target.value as CircuitoCalculado['tipo'])}
                className="bg-slate-800 p-2 rounded-lg text-white text-sm border border-slate-700"
            >
                <option value="iluminacion_usos_generales">IUG</option>
                <option value="tomacorrientes_usos_generales">TUG</option>
                <option value="usos_especiales">TUE</option>
                <option value="usos_especificos">Específico</option>
            </select>
            <button onClick={addCircuito} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-500">
                <PlusCircle size={16} /> Agregar
            </button>
        </div>
      </div>
    </div>
  );
};
