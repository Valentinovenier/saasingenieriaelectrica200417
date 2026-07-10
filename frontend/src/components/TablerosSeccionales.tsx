import { useState } from 'react';
import { Project, TableroSeccionalSimple } from '../types/project';
import { Plus, Trash2, Server, Save } from 'lucide-react';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export const TablerosSeccionales = ({ project, onChange }: Props) => {
  const tableros: TableroSeccionalSimple[] = project.tablerosSeccionales || [];
  
  const agregar = () => {
    // Nombrado automático: Tablero Seccional 1, Tablero Seccional 2...
    // Buscamos el mayor número actual si existe, o usamos length + 1
    const numerosExistentes = tableros
        .map(t => parseInt(t.nombre.replace('Tablero Seccional ', '')) || 0)
        .filter(n => !isNaN(n));
    const maxNumero = numerosExistentes.length > 0 ? Math.max(...numerosExistentes) : 0;
    const nuevo: TableroSeccionalSimple = {
      id: `ts-${Date.now()}`,
      nombre: `Tablero Seccional ${maxNumero + 1}`,
      potencia: 0, // Potencia inicial 0 para que el usuario la defina
    };
    onChange({
      ...project,
      tablerosSeccionales: [...tableros, nuevo],
    });
  };

  const eliminar = (id: string) => {
    if (!confirm('¿Eliminar este tablero? Se borrarán también sus conductores calculados.')) return;
    onChange({
      ...project,
      tablerosSeccionales: tableros.filter(t => t.id !== id),
      conductores: Object.fromEntries(
        Object.entries(project.conductores || {}).filter(([key]) => !key.includes(`__${id}`))
      ),
    });
  };

  const actualizar = (id: string, campo: 'nombre' | 'potencia' | 'Ik', valor: string) => {
    onChange({
      ...project,
      tablerosSeccionales: tableros.map(t =>
        t.id === id ? { ...t, [campo]: campo === 'nombre' ? valor : (parseFloat(valor) || 0) } : t
      ),
    });
  };

  const handleGuardar = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: project.id, name: project.name, data: project }),
      });
      if (response.ok) {
        alert('Tableros guardados exitosamente');
      } else {
        throw new Error('Error al guardar');
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const potenciaTotal = tableros.reduce((acc, t) => acc + (Number(t.potencia) || 0), 0);

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800 space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Server size={22} className="text-[var(--accent)]" />
          <h2 className="text-2xl font-bold text-white">Tableros</h2>
        </div>
        <div className="flex gap-2">
            <button
                onClick={agregar}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold text-sm"
            >
                <Plus size={15} />
                Nuevo Tablero
            </button>
            <button
                onClick={handleGuardar}
                className="flex items-center gap-2 bg-[var(--accent)] text-black px-4 py-2 rounded-lg font-bold text-sm"
            >
                <Save size={15} />
                Guardar
            </button>
        </div>
      </div>

      {/* Tabla de tableros */}
      {tableros.length > 0 ? (
        <div className="bg-[var(--bg-primary)] rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">#</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Nombre</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Potencia (kVA)</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Ik (kA)</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {tableros.map((t, idx) => (
                  <tr key={t.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3 text-slate-500 text-xs">{idx + 1}</td>
                    <td className="px-5 py-3">
                      <input
                        type="text"
                        className="bg-slate-800 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-700 w-full"
                        value={t.nombre}
                        onChange={e => actualizar(t.id, 'nombre', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.1"
                          className="bg-slate-800 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-700 w-28"
                          value={t.potencia}
                          onChange={e => actualizar(t.id, 'potencia', e.target.value)}
                        />
                    </td>
                    <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          className="bg-slate-800 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-700 w-24"
                          value={t.Ik || ''}
                          placeholder="Ik"
                          onChange={e => actualizar(t.id, 'Ik', e.target.value)}
                        />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => eliminar(t.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-12 text-slate-500">No hay tableros.</div>
      )}
    </div>
  );
};
