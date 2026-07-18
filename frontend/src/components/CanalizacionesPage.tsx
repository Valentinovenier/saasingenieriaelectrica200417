import React, { useState } from 'react';
import { Project, Canalizacion } from '../types/project';
import { Plus, Trash2, Cable, AlertTriangle } from 'lucide-react';
import { validarAgrupamiento } from '../engine/strategies/vivienda/validacionesAgrupamiento';

interface Props {
  project: Project;
  onChange: (updatedProject: Project) => void;
}

export const CanalizacionesPage = ({ project, onChange }: Props) => {
  const [nombre, setNombre] = useState('');
  const canalizaciones = project.canalizaciones || [];
  const conductores = project.informeConductores || [];

  const addCanalizacion = () => {
    if (!nombre) return;
    const nueva: Canalizacion = {
      id: Date.now().toString(),
      nombre,
      circuitosIds: [],
      normaCable: 'IRAM 2178'
    };
    onChange({ ...project, canalizaciones: [...canalizaciones, nueva] });
    setNombre('');
  };

  const updateCanalizacion = (id: string, updates: Partial<Canalizacion>) => {
    onChange({
      ...project,
      canalizaciones: canalizaciones.map(c => c.id === id ? { ...c, ...updates } : c)
    });
  };

  const deleteCanalizacion = (id: string) => {
    onChange({ ...project, canalizaciones: canalizaciones.filter(c => c.id !== id) });
  };

  const toggleCircuito = (canalizacionId: string, circuitoId: string) => {
    const canalizacion = canalizaciones.find(c => c.id === canalizacionId);
    if (!canalizacion) return;

    const newIds = canalizacion.circuitosIds.includes(circuitoId)
      ? canalizacion.circuitosIds.filter(id => id !== circuitoId)
      : [...canalizacion.circuitosIds, circuitoId];

    // Validar antes de aplicar cambios
    const hypotheticalCanalizacion = { ...canalizacion, circuitosIds: newIds };
    const resultado = validarAgrupamiento(project, hypotheticalCanalizacion);

    if (!resultado.esValido) {
      alert("Agrupamiento no permitido por norma AEA 770:\n" + resultado.errores.join('\n'));
      return;
    }

    updateCanalizacion(canalizacionId, { circuitosIds: newIds });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Gestión de Canalizaciones</h2>
        <div className="flex gap-2">
          <input 
            className="bg-[var(--bg-secondary)] p-3 rounded-lg text-white border border-slate-700" 
            placeholder="Nueva canalización..." 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button onClick={addCanalizacion} className="bg-[var(--accent)] text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90">
            <Plus size={20} /> Añadir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {canalizaciones.map(c => {
            const val = validarAgrupamiento(project, c);
            const circuitosDisponibles = project.datosVivienda?.circuitosCalculados || [];
            
            return (
              <div key={c.id} className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-slate-700 shadow-lg">
                <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                  <div className='flex items-center gap-4'>
                    <span className="text-white font-bold text-xl">{c.nombre}</span>
                  </div>
                  <button onClick={() => deleteCanalizacion(c.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={20} />
                  </button>
                </div>
                
                {!val.esValido && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded text-red-300 text-sm flex items-center gap-2">
                        <AlertTriangle size={16}/> {val.errores[0]}
                    </div>
                )}

                <h4 className="text-slate-400 text-sm font-semibold uppercase mb-3">Circuitos Asignados</h4>
                {circuitosDisponibles.length === 0 ? (
                  <p className="text-slate-500 text-sm italic">No hay circuitos definidos en la vivienda.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {circuitosDisponibles.map((circ: any) => {
                      return (
                        <label key={circ.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${c.circuitosIds.includes(circ.id) ? 'bg-slate-800 border-[var(--accent)]' : 'bg-slate-950 border-slate-700 hover:border-slate-500'}`}>
                          <input 
                            type="checkbox" 
                            checked={c.circuitosIds.includes(circ.id)}
                            onChange={() => toggleCircuito(c.id, circ.id)}
                            className="accent-[var(--accent)] w-4 h-4"
                          />
                          <div className='flex flex-col'>
                            <span className="text-white text-sm font-medium flex items-center gap-1.5"><Cable size={14} className="text-slate-500"/> {circ.nombre}</span>
                            <span className="text-slate-500 text-[10px]">{circ.tipo || 'Sin tipo'}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
        })}
      </div>
    </div>
  );
};
