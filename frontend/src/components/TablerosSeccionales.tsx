import { useState } from 'react';
import { Project, TableroSeccionalSimple } from '../types/project';
import { Plus, Trash2, Server, Save } from 'lucide-react';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export const TablerosSeccionales = ({ project, onChange }: Props) => {
  const tableros: TableroSeccionalSimple[] = project.tablerosSeccionales || [];
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaPotencia, setNuevaPotencia] = useState('');

  const agregar = () => {
    const nombre = nuevoNombre.trim();
    const potencia = parseFloat(nuevaPotencia);
    if (!nombre || isNaN(potencia) || potencia <= 0) {
      alert('Ingresá un nombre y una potencia válida (kVA > 0)');
      return;
    }
    const nuevo: TableroSeccionalSimple = {
      id: `ts-${Date.now()}`,
      nombre,
      potencia,
    };
    onChange({
      ...project,
      tablerosSeccionales: [...tableros, nuevo],
    });
    setNuevoNombre('');
    setNuevaPotencia('');
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

  const actualizar = (id: string, campo: 'nombre' | 'potencia', valor: string) => {
    onChange({
      ...project,
      tablerosSeccionales: tableros.map(t =>
        t.id === id ? { ...t, [campo]: campo === 'potencia' ? (valor as any) : valor } : t
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
        alert('Tableros seccionales guardados exitosamente');
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
          <h2 className="text-2xl font-bold text-white">Tableros Seccionales</h2>
        </div>
        <button
          onClick={handleGuardar}
          className="flex items-center gap-2 bg-[var(--accent)] text-black px-4 py-2 rounded-lg font-bold text-sm"
        >
          <Save size={15} />
          Guardar
        </button>
      </div>

      <p className="text-sm text-slate-400">
        Agregá los tableros seccionales del proyecto. Cada tablero aparecerá en la sección{' '}
        <strong className="text-white">Conductores</strong> para calcular los tramos{' '}
        <em>Barra Omnibus → Interruptor de Salida</em> e{' '}
        <em>Interruptor de Salida → Tablero Seccional</em>.
      </p>

      {/* Tabla de tableros */}
      {tableros.length > 0 ? (
        <div className="bg-[var(--bg-primary)] rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">#</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Nombre del Tablero</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Potencia (kVA)</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">I nominal (A)</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {tableros.map((t, idx) => {
                const tension =
                  Number(project.transformador?.tensionSecundario) ||
                  (project.tipoInstalacion === 'Trifásica' ? 380 : 220);
                const esTri = project.tipoInstalacion === 'Trifásica';
                const Inom =
                  ((Number(t.potencia) || 0) * 1000) / (esTri ? Math.sqrt(3) * tension : tension);
                return (
                  <tr
                    key={t.id}
                    className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-3 text-slate-500 text-xs">{idx + 1}</td>
                    <td className="px-5 py-3">
                      <input
                        type="text"
                        className="bg-slate-800 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-700 hover:border-slate-500 focus:border-[var(--accent)] focus:outline-none transition-colors w-full max-w-xs"
                        value={t.nombre}
                        onChange={e => actualizar(t.id, 'nombre', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          className="bg-slate-800 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-700 hover:border-slate-500 focus:border-[var(--accent)] focus:outline-none transition-colors w-28"
                          value={t.potencia}
                          onChange={e => actualizar(t.id, 'potencia', e.target.value)}
                        />
                        <span className="text-slate-500 text-xs">kVA</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-amber-400 font-semibold text-xs">
                      {Inom > 0 ? Inom.toFixed(1) : '—'} A
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => eliminar(t.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                        title="Eliminar tablero"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-800/40">
                <td colSpan={2} className="px-5 py-3 text-xs font-semibold text-slate-400">
                  Potencia total instalada
                </td>
                <td className="px-4 py-3 text-sm font-bold text-[var(--accent)]">
                  {potenciaTotal.toFixed(1)} kVA
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="bg-[var(--bg-primary)] rounded-xl border border-dashed border-slate-700 p-12 text-center">
          <Server size={32} className="mx-auto mb-3 text-slate-700" />
          <p className="text-slate-500 text-sm">No hay tableros seccionales cargados.</p>
          <p className="text-slate-600 text-xs mt-1">Usá el formulario de abajo para agregar.</p>
        </div>
      )}

      {/* Formulario de alta */}
      <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Agregar Tablero Seccional
        </p>
        <div className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-slate-400 mb-1 block">Nombre</label>
            <input
              type="text"
              placeholder="Ej: TS-Planta Baja"
              className="w-full bg-slate-950 text-white text-sm rounded-lg px-3 py-2.5 border border-slate-700 hover:border-slate-500 focus:border-[var(--accent)] focus:outline-none transition-colors"
              value={nuevoNombre}
              onChange={e => setNuevoNombre(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && agregar()}
            />
          </div>
          <div className="w-44">
            <label className="text-xs text-slate-400 mb-1 block">Potencia (kVA)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="Ej: 100"
              className="w-full bg-slate-950 text-white text-sm rounded-lg px-3 py-2.5 border border-slate-700 hover:border-slate-500 focus:border-[var(--accent)] focus:outline-none transition-colors"
              value={nuevaPotencia}
              onChange={e => setNuevaPotencia(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && agregar()}
            />
          </div>
          <button
            onClick={agregar}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0"
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};
