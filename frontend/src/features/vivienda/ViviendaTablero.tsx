import { useState } from 'react';
import { Project } from '../../types/project';
import { CircuitoVivienda } from '../../types/vivienda';
import { obtenerCircuitosMinimos, calcularDPMS } from '../../engine/strategies/vivienda/normas770';
import { Trash2, Plus, Zap } from 'lucide-react';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export const ViviendaTablero = ({ project, onChange }: Props) => {
  const datos = project.datosVivienda || { superficieCubierta: 0, superficieSemicubierta: 0, ambientes: [], circuitos: [] };
  
  // Calcular mínimos normativos basados en la superficie actual
  const superficieLimite = project.datosVivienda?.superficieCubierta || 0; // Simplificado
  const grado = project.datosVivienda?.gradoElectrificacion || 'Minimo';
  const minCircuitos = obtenerCircuitosMinimos(grado as any);

  const handleAddCircuito = () => {
    const nuevoCircuito: CircuitoVivienda = { 
      id: Date.now().toString(), 
      nombre: `Circuito ${datos.circuitos.length + 1}`, 
      tipo: 'tomacorrientes_usos_generales', 
      puntosUtilizacion: 0, 
      potenciaEstimada: 0 
    };
    onChange({ ...project, datosVivienda: { ...datos, circuitos: [...datos.circuitos, nuevoCircuito] } });
  };

  const updateCircuito = (id: string, updates: Partial<CircuitoVivienda>) => {
    const nuevosCircuitos = datos.circuitos.map(c => c.id === id ? { ...c, ...updates } : c);
    onChange({ ...project, datosVivienda: { ...datos, circuitos: nuevosCircuitos } });
  };

  const dpms = calcularDPMS(datos.circuitos);

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white">Distribución de Circuitos (Tablero)</h2>
        <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 flex items-center gap-3">
            <Zap size={18} className="text-amber-400" />
            <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">DPMS Estimada</p>
                <p className="text-lg font-bold text-white">{dpms.toFixed(0)} VA</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-400 uppercase">Circuitos Definidos</h3>
                <span className={`text-xs px-2 py-1 rounded ${datos.circuitos.length >= minCircuitos ? 'bg-emerald-900 text-emerald-400' : 'bg-red-900 text-red-400'}`}>
                    {datos.circuitos.length} / {minCircuitos} Mínimos
                </span>
            </div>
            
            <div className="space-y-2">
                {datos.circuitos.map(c => (
                    <div key={c.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                            <input 
                                className="bg-slate-950 p-2 rounded border border-slate-700 text-white text-sm" 
                                value={c.nombre} 
                                onChange={(e) => updateCircuito(c.id, { nombre: e.target.value })} 
                            />
                            <select 
                                className="bg-slate-950 p-2 rounded border border-slate-700 text-white text-sm"
                                value={c.tipo}
                                onChange={(e) => updateCircuito(c.id, { tipo: e.target.value as any })}
                            >
                                <option value="iluminacion_usos_generales">IUG</option>
                                <option value="tomacorrientes_usos_generales">TUG</option>
                                <option value="usos_especiales">Usos Especiales</option>
                            </select>
                        </div>
                        <button onClick={() => onChange({ ...project, datosVivienda: { ...datos, circuitos: datos.circuitos.filter(circ => circ.id !== c.id) } })} className="text-red-400 ml-4">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <button onClick={handleAddCircuito} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                <Plus size={16} /> Agregar Circuito
            </button>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-400 uppercase mb-4">Resumen de Carga</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Total Circuitos:</span>
                    <span className="text-white font-bold">{datos.circuitos.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Cumplimiento Normativo:</span>
                    <span className={datos.circuitos.length >= minCircuitos ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {datos.circuitos.length >= minCircuitos ? '✓ CUMPLE' : '✗ INSUFICIENTE'}
                    </span>
                </div>
                <div className="border-t border-slate-800 pt-3 mt-3">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Potencia Total Simultánea</p>
                    <p className="text-2xl font-bold text-[var(--accent)]">{dpms.toFixed(0)} VA</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
