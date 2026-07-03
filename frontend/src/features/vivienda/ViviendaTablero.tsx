import { useState } from 'react';
import { Project } from '../../types/project';
import { obtenerCircuitosMinimos, calcularDPMS } from '../../engine/strategies/vivienda/normas770';
import { Trash2, Plus, Zap } from 'lucide-react';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export const ViviendaTablero = ({ project, onChange }: Props) => {
  const datos = project.datosVivienda || { superficieCubierta: 0, superficieSemicubierta: 0, ambientes: [], circuitosCalculados: [] };
  
  const grado = project.datosVivienda?.gradoElectrificacion || 'Minimo';
  const minCircuitos = obtenerCircuitosMinimos(grado as any);

  // Simplificación del cálculo de DPMS para adaptarse a la nueva estructura
  const dpms = datos.circuitosCalculados.reduce((acc, c) => {
    const pot = (c.puntosIUG * 100) + (c.puntosTUG * 150);
    return acc + pot;
  }, 0) * 0.8; // Simplificado

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
                <h3 className="text-sm font-semibold text-slate-400 uppercase">Circuitos Calculados</h3>
                <span className={`text-xs px-2 py-1 rounded ${datos.circuitosCalculados.length >= minCircuitos ? 'bg-emerald-900 text-emerald-400' : 'bg-red-900 text-red-400'}`}>
                    {datos.circuitosCalculados.length} / {minCircuitos} Mínimos
                </span>
            </div>
            
            <div className="space-y-2">
                {datos.circuitosCalculados.map(c => (
                    <div key={c.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                        <div className="flex-1">
                            <p className="font-bold text-white text-sm">{c.nombre}</p>
                            <p className="text-[10px] text-slate-400 uppercase">{c.tipo}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-400 uppercase mb-4">Resumen de Carga</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Total Circuitos:</span>
                    <span className="text-white font-bold">{datos.circuitosCalculados.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Cumplimiento Normativo:</span>
                    <span className={datos.circuitosCalculados.length >= minCircuitos ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {datos.circuitosCalculados.length >= minCircuitos ? '✓ CUMPLE' : '✗ INSUFICIENTE'}
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
