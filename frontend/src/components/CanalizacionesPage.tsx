import React, { useState } from 'react';
import { Project, Canalizacion } from '../types/project';
import { Plus, Trash2, Cable } from 'lucide-react';
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
      conductorIds: [],
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

  const toggleConductor = (canalizacionId: string, conductorId: string) => {
    const canalizacion = canalizaciones.find(c => c.id === canalizacionId);
    if (!canalizacion) return;

    const newIds = canalizacion.conductorIds.includes(conductorId)
      ? canalizacion.conductorIds.filter(id => id !== conductorId)
      : [...canalizacion.conductorIds, conductorId];

    // Validar antes de aplicar cambios
    const hypotheticalCanalizacion = { ...canalizacion, conductorIds: newIds };
    const resultado = validarAgrupamiento(project, hypotheticalCanalizacion);

    if (!resultado.esValido) {
      alert("Agrupamiento no permitido por norma AEA 770:\n" + resultado.errores.join('\n'));
      return;
    }

    updateCanalizacion(canalizacionId, { conductorIds: newIds });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Gestión de Canalizaciones</h2>
      
      <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-slate-700 mb-8">
        <div className="flex gap-4">
          <input 
            className="flex-1 bg-[var(--bg-primary)] p-3 rounded-lg text-white border border-slate-700" 
            placeholder="Nombre de la nueva canalización" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button onClick={addCanalizacion} className="bg-[var(--accent)] text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90">
            <Plus size={20} /> Añadir
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {canalizaciones.map(c => (
          <div key={c.id} className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-bold text-lg">{c.nombre}</span>
              <select
                className="bg-slate-950 text-white text-sm rounded-lg p-2 border border-slate-700"
                value={c.normaCable || 'IRAM 2178'}
                onChange={(e) => updateCanalizacion(c.id, { normaCable: e.target.value as any })}
              >
                <option value="IRAM-NM 247-3">IRAM-NM 247-3</option>
                <option value="IRAM 62267">IRAM 62267</option>
                <option value="IRAM 2178">IRAM 2178</option>
              </select>
              <button onClick={() => deleteCanalizacion(c.id)} className="text-red-400 hover:text-red-300">
                <Trash2 size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {conductores.map((cond: any, i: number) => (
                <label key={i} className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer hover:bg-slate-800 p-2 rounded">
                  <input 
                    type="checkbox" 
                    checked={c.conductorIds.includes(cond.id || i.toString())}
                    onChange={() => toggleConductor(c.id, cond.id || i.toString())}
                    className="accent-[var(--accent)]"
                  />
                  <Cable size={14} /> {cond.destinoNombre || `Conductor ${i + 1}`}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
