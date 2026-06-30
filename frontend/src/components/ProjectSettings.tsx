import { useState } from 'react';
import { Project, TableroSeccional, Proteccion } from '../types/project';
import { ConductorForm } from './ConductorForm';
import { Trash2, Plus } from 'lucide-react';
import { transformadoresAceite } from '../data/transformadoresAceite';
import { transformadoresSecos } from '../data/transformadoresSecos';
import { calcularImpedanciaTransformador, estimarParametrosTrafo } from '../engine/transformador';

const ProteccionFields = ({ label, value, onChange }: { label: string, value?: Proteccion, onChange: (p: Proteccion | undefined) => void }) => (
  <div className="mt-2 p-2 bg-slate-900 rounded border border-slate-700">
    <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
    <div className="flex gap-2">
      <select 
        className="bg-[var(--bg-secondary)] text-white text-xs rounded p-1"
        value={value?.tipo || 'Termomagnética'}
        onChange={(e) => onChange({ 
          tipo: e.target.value as any,
          valorNominal: value?.valorNominal || 0,
          marca: value?.marca || 'Schneider',
          ...value
        })}
      >
        <option value="Termomagnética">Termomagnética</option>
        <option value="Fusible">Fusible</option>
        <option value="Interruptor Automático Abierto">Int. Aut. Abierto</option>
        <option value="Interruptor Automático Compacto">Int. Aut. Compacto</option>
        <option value="PIA">PIA</option>
      </select>
      <input 
        type="number" 
        placeholder="A" 
        className="w-16 bg-[var(--bg-secondary)] text-white text-xs rounded p-1"
        value={value?.valorNominal || ''}
        onChange={(e) => onChange({ 
          tipo: value?.tipo || 'Termomagnética',
          valorNominal: Number(e.target.value),
          marca: value?.marca || 'Schneider',
          ...value
        })}
      />
      <select 
        className="bg-[var(--bg-secondary)] text-white text-xs rounded p-1"
        value={value?.marca || 'Schneider'}
        onChange={(e) => onChange({ 
          tipo: value?.tipo || 'Termomagnética',
          valorNominal: value?.valorNominal || 0,
          marca: e.target.value as any,
          ...value
        })}
      >
        <option value="Schneider">Schneider</option>
        <option value="ABB">ABB</option>
      </select>
    </div>
  </div>
);

export const ProjectSettings = ({ project, onChange, onSave, onDelete }: { project: Project, onChange: (p: Project) => void, onSave: (p: Project) => void, onDelete: () => void }) => {
  // Eliminamos el useState local 'data' y usamos 'project' (prop) directamente

  const addTablero = () => {
    const newTablero: TableroSeccional = {
      id: Date.now().toString(),
      name: `Tablero ${project.tableros ? project.tableros.length + 1 : 1}`,
      tipo: 'Fuerza Motriz',
      potenciaTotal: 0,
      subTableros: [],
      proteccionesSalida: []
    };
    onChange({ 
      ...project, 
      tableros: [...(project.tableros || []), newTablero] 
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: project.id,
          name: project.name,
          data: project
        })
      });

      if (response.ok) {
        onSave(project);
        alert('Proyecto guardado exitosamente');
      } else {
        alert('Error al guardar el proyecto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  return (
    <div className="space-y-8 bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Configuración: {project.name}</h2>
        <button onClick={onDelete} className="text-red-400 hover:text-red-300 flex items-center gap-2">
            Eliminar proyecto
        </button>
      </div>
      
      <section className="bg-[var(--bg-primary)] p-4 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">Canalizaciones</h3>
        <div className="space-y-2">
            {(project.canalizaciones || []).map((can) => (
                <div key={can.id} className="flex gap-2 items-center">
                    <input 
                        className="bg-[var(--bg-secondary)] p-2 rounded border border-slate-700 text-white flex-1"
                        value={can.nombre}
                        onChange={(e) => {
                            const updated = project.canalizaciones?.map(c => c.id === can.id ? {...c, nombre: e.target.value} : c);
                            onChange({...project, canalizaciones: updated});
                        }}
                    />
                    <button 
                        onClick={() => onChange({...project, canalizaciones: project.canalizaciones?.filter(c => c.id !== can.id)})}
                        className="text-red-400 p-2"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
            <button 
                onClick={() => onChange({
                    ...project, 
                    canalizaciones: [...(project.canalizaciones || []), { id: Date.now().toString(), nombre: 'Nueva Canalización' }]
                })}
                className="text-[var(--accent)] flex items-center gap-2 text-sm"
            >
                <Plus size={16} /> Añadir Canalización
            </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ... resto del contenido existente ... */}

        {/* Transformador */}
        <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-slate-700 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-lg font-bold text-white">Transformador</h3>
                <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                    <button
                        type="button"
                        onClick={() => {
                            const current = project.transformador || { potencia: 0, tensionPrimario: 13.2, tensionSecundario: 400, cosFi: 0.95, impedancia: 0, proteccionesSalida: [] };
                            const updated = { ...current, modoEntrada: 'catalogo' as const };
                            // Si se cambia a catálogo y hay potencia, intentar buscar el primer match en el catálogo
                            const list = (updated.tipo || 'Aceite') === 'Aceite' ? transformadoresAceite : transformadoresSecos;
                            const match = list.find(t => t.potenciaKVA === Number(updated.potencia)) || list[0];
                            if (match) {
                                updated.potencia = match.potenciaKVA;
                                updated.tensionSecundario = match.tensionSecundarioV;
                                updated.uccPorcentaje = match.uccPorcentaje;
                                updated.PccW = match.PccW;
                                updated.tipo = match.tipo;
                                updated.catalogoId = match.id;
                            }
                            const imp = calcularImpedanciaTransformador({
                                potenciaKVA: Number(updated.potencia),
                                tensionSecundarioV: Number(updated.tensionSecundario),
                                uccPorcentaje: updated.uccPorcentaje,
                                PccW: updated.PccW,
                                tipo: updated.tipo
                            });
                            updated.impedancia = Number(imp.z.toFixed(6));
                            onChange({ ...project, transformador: updated });
                        }}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                            (project.transformador?.modoEntrada ?? 'manual') === 'catalogo'
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        Catálogo
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const current = project.transformador || { potencia: 0, tensionPrimario: 13.2, tensionSecundario: 400, cosFi: 0.95, impedancia: 0, proteccionesSalida: [] };
                            onChange({
                                ...project,
                                transformador: { ...current, modoEntrada: 'manual' as const }
                            });
                        }}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                            (project.transformador?.modoEntrada ?? 'manual') === 'manual'
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        Manual
                    </button>
                </div>
            </div>

            {(project.transformador?.modoEntrada ?? 'manual') === 'catalogo' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Tipo de Transformador</label>
                        <select
                            className="w-full bg-[var(--bg-secondary)] p-2 rounded-lg border border-slate-700 text-white"
                            value={project.transformador?.tipo || 'Aceite'}
                            onChange={(e) => {
                                const tipo = e.target.value as 'Aceite' | 'Seco';
                                const list = tipo === 'Aceite' ? transformadoresAceite : transformadoresSecos;
                                const match = list[0];
                                const current = project.transformador || { potencia: 0, tensionPrimario: 13.2, tensionSecundario: 400, cosFi: 0.95, impedancia: 0, proteccionesSalida: [] };
                                const updated = {
                                    ...current,
                                    tipo,
                                    potencia: match.potenciaKVA,
                                    tensionSecundario: match.tensionSecundarioV,
                                    uccPorcentaje: match.uccPorcentaje,
                                    PccW: match.PccW,
                                    catalogoId: match.id
                                };
                                const imp = calcularImpedanciaTransformador({
                                    potenciaKVA: Number(updated.potencia),
                                    tensionSecundarioV: Number(updated.tensionSecundario),
                                    uccPorcentaje: updated.uccPorcentaje,
                                    PccW: updated.PccW,
                                    tipo: updated.tipo
                                });
                                updated.impedancia = Number(imp.z.toFixed(6));
                                onChange({ ...project, transformador: updated });
                            }}
                        >
                            <option value="Aceite">En Aceite (IRAM 2250)</option>
                            <option value="Seco">Seco en Resina Clase F</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Transformador Catálogo</label>
                        <select
                            className="w-full bg-[var(--bg-secondary)] p-2 rounded-lg border border-slate-700 text-white"
                            value={project.transformador?.catalogoId || ''}
                            onChange={(e) => {
                                const id = e.target.value;
                                const list = (project.transformador?.tipo || 'Aceite') === 'Aceite' ? transformadoresAceite : transformadoresSecos;
                                const match = list.find(t => t.id === id);
                                if (match) {
                                    const current = project.transformador || { potencia: 0, tensionPrimario: 13.2, tensionSecundario: 400, cosFi: 0.95, impedancia: 0, proteccionesSalida: [] };
                                    const updated = {
                                        ...current,
                                        potencia: match.potenciaKVA,
                                        tensionSecundario: match.tensionSecundarioV,
                                        uccPorcentaje: match.uccPorcentaje,
                                        PccW: match.PccW,
                                        catalogoId: match.id
                                    };
                                    const imp = calcularImpedanciaTransformador({
                                        potenciaKVA: Number(updated.potencia),
                                        tensionSecundarioV: Number(updated.tensionSecundario),
                                        uccPorcentaje: updated.uccPorcentaje,
                                        PccW: updated.PccW,
                                        tipo: updated.tipo
                                    });
                                    updated.impedancia = Number(imp.z.toFixed(6));
                                    onChange({ ...project, transformador: updated });
                                }
                            }}
                        >
                            <option value="" disabled>Seleccione transformador...</option>
                            {((project.transformador?.tipo || 'Aceite') === 'Aceite' ? transformadoresAceite : transformadoresSecos).map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.potenciaKVA} kVA - {t.tensionPrimarioKV} kV / {t.tensionSecundarioV} V (ucc: {t.uccPorcentaje}%, Pcc: {t.PccW}W)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Potencia (kVA)</label>
                        <input
                            type="number"
                            placeholder="kVA"
                            className="w-full bg-[var(--bg-secondary)] p-2 rounded-lg border border-slate-700 text-white"
                            value={project.transformador?.potencia ?? ''}
                            onChange={(e) => {
                                const potencia = Number(e.target.value);
                                const current = project.transformador || { potencia: 0, tensionPrimario: 13.2, tensionSecundario: 400, cosFi: 0.95, impedancia: 0, proteccionesSalida: [] };
                                // Estimar parámetros automáticamente por defecto si no existen
                                const tipo = current.tipo || 'Aceite';
                                const est = estimarParametrosTrafo(potencia, tipo);
                                const updated = {
                                    ...current,
                                    potencia,
                                    uccPorcentaje: current.uccPorcentaje || est.uccPorcentaje,
                                    PccW: current.PccW || est.PccW
                                };
                                const imp = calcularImpedanciaTransformador({
                                    potenciaKVA: Number(updated.potencia),
                                    tensionSecundarioV: Number(updated.tensionSecundario),
                                    uccPorcentaje: updated.uccPorcentaje,
                                    PccW: updated.PccW,
                                    tipo: updated.tipo
                                });
                                updated.impedancia = Number(imp.z.toFixed(6));
                                onChange({ ...project, transformador: updated });
                            }}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-[var(--text-secondary)] mb-1 block">V Secundario (V)</label>
                        <input
                            type="number"
                            placeholder="V"
                            className="w-full bg-[var(--bg-secondary)] p-2 rounded-lg border border-slate-700 text-white"
                            value={project.transformador?.tensionSecundario ?? ''}
                            onChange={(e) => {
                                const tensionSecundario = Number(e.target.value);
                                const current = project.transformador || { potencia: 0, tensionPrimario: 13.2, tensionSecundario: 400, cosFi: 0.95, impedancia: 0, proteccionesSalida: [] };
                                const updated = { ...current, tensionSecundario };
                                const imp = calcularImpedanciaTransformador({
                                    potenciaKVA: Number(updated.potencia),
                                    tensionSecundarioV: Number(updated.tensionSecundario),
                                    uccPorcentaje: updated.uccPorcentaje,
                                    PccW: updated.PccW,
                                    tipo: updated.tipo
                                });
                                updated.impedancia = Number(imp.z.toFixed(6));
                                onChange({ ...project, transformador: updated });
                            }}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Tipo de Construcción</label>
                        <select
                            className="w-full bg-[var(--bg-secondary)] p-2 rounded-lg border border-slate-700 text-white"
                            value={project.transformador?.tipo || 'Aceite'}
                            onChange={(e) => {
                                const tipo = e.target.value as 'Aceite' | 'Seco';
                                const current = project.transformador || { potencia: 0, tensionPrimario: 13.2, tensionSecundario: 400, cosFi: 0.95, impedancia: 0, proteccionesSalida: [] };
                                const est = estimarParametrosTrafo(Number(current.potencia), tipo);
                                const updated = {
                                    ...current,
                                    tipo,
                                    uccPorcentaje: est.uccPorcentaje,
                                    PccW: est.PccW
                                };
                                const imp = calcularImpedanciaTransformador({
                                    potenciaKVA: Number(updated.potencia),
                                    tensionSecundarioV: Number(updated.tensionSecundario),
                                    uccPorcentaje: updated.uccPorcentaje,
                                    PccW: updated.PccW,
                                    tipo: updated.tipo
                                });
                                updated.impedancia = Number(imp.z.toFixed(6));
                                onChange({ ...project, transformador: updated });
                            }}
                        >
                            <option value="Aceite">En Aceite</option>
                            <option value="Seco">Seco</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-[var(--text-secondary)] mb-1 block">ucc (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="ucc"
                                className="w-full bg-[var(--bg-secondary)] p-2 rounded-lg border border-slate-700 text-white"
                                value={project.transformador?.uccPorcentaje ?? ''}
                                onChange={(e) => {
                                    const uccPorcentaje = Number(e.target.value);
                                    const current = project.transformador || { potencia: 0, tensionPrimario: 13.2, tensionSecundario: 400, cosFi: 0.95, impedancia: 0, proteccionesSalida: [] };
                                    const updated = { ...current, uccPorcentaje };
                                    const imp = calcularImpedanciaTransformador({
                                        potenciaKVA: Number(updated.potencia),
                                        tensionSecundarioV: Number(updated.tensionSecundario),
                                        uccPorcentaje: updated.uccPorcentaje,
                                        PccW: updated.PccW,
                                        tipo: updated.tipo
                                    });
                                    updated.impedancia = Number(imp.z.toFixed(6));
                                    onChange({ ...project, transformador: updated });
                                }}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-[var(--text-secondary)] mb-1 block">Pcc (W)</label>
                            <input
                                type="number"
                                placeholder="Pcc"
                                className="w-full bg-[var(--bg-secondary)] p-2 rounded-lg border border-slate-700 text-white"
                                value={project.transformador?.PccW ?? ''}
                                onChange={(e) => {
                                    const PccW = Number(e.target.value);
                                    const current = project.transformador || { potencia: 0, tensionPrimario: 13.2, tensionSecundario: 400, cosFi: 0.95, impedancia: 0, proteccionesSalida: [] };
                                    const updated = { ...current, PccW };
                                    const imp = calcularImpedanciaTransformador({
                                        potenciaKVA: Number(updated.potencia),
                                        tensionSecundarioV: Number(updated.tensionSecundario),
                                        uccPorcentaje: updated.uccPorcentaje,
                                        PccW: updated.PccW,
                                        tipo: updated.tipo
                                    });
                                    updated.impedancia = Number(imp.z.toFixed(6));
                                    onChange({ ...project, transformador: updated });
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                    <span className="text-slate-400">Impedancia Calculada (Z<sub>cc</sub>):</span>
                    <span className="font-mono text-emerald-400 font-semibold">{project.transformador?.impedancia ? `${project.transformador.impedancia} Ω` : '—'}</span>
                </div>
                {(!project.transformador?.uccPorcentaje || !project.transformador?.PccW) && Number(project.transformador?.potencia) > 0 && (
                    <p className="text-[10px] text-slate-500 italic">
                        * Los valores de ucc y Pcc están siendo estimados automáticamente a partir de la potencia de {project.transformador?.potencia} kVA.
                    </p>
                )}
            </div>
        </div>
        
        <div className="col-span-1 md:col-span-2">
            <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-slate-700">
              {/* Header con checkbox habilitador */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Distorsión Armónica</h3>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={project.armonicos?.habilitado ?? false}
                      onChange={(e) => onChange({
                        ...project,
                        armonicos: {
                          ...project.armonicos,
                          habilitado: e.target.checked,
                          modoEntrada: project.armonicos?.modoEntrada ?? 'porcentaje',
                          h3: project.armonicos?.h3 ?? 0,
                          h5: project.armonicos?.h5 ?? 0,
                          h7: project.armonicos?.h7 ?? 0,
                          h9: project.armonicos?.h9 ?? 0,
                        }
                      })}
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${project.armonicos?.habilitado ? 'bg-[var(--accent)]' : 'bg-slate-700'}`}></div>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${project.armonicos?.habilitado ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                  <span className={`text-xs font-medium ${project.armonicos?.habilitado ? 'text-[var(--accent)]' : 'text-slate-500'}`}>
                    {project.armonicos?.habilitado ? 'Habilitado' : 'Deshabilitado'}
                  </span>
                </label>
              </div>

              {project.armonicos?.habilitado && (
                <>
                  {/* Selector de modo de entrada */}
                  <div className="mb-4">
                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">Modo de entrada de valores</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onChange({...project, armonicos: {...project.armonicos, modoEntrada: 'porcentaje'}})}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors border ${
                          (project.armonicos?.modoEntrada ?? 'porcentaje') === 'porcentaje'
                            ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        Porcentaje (0 a 1)
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({...project, armonicos: {...project.armonicos, modoEntrada: 'amperios'}})}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors border ${
                          project.armonicos?.modoEntrada === 'amperios'
                            ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        Amperios (A)
                      </button>
                    </div>
                    {project.armonicos?.modoEntrada === 'amperios' && (
                      <p className="text-[10px] text-slate-500 mt-1.5">
                        Los valores en A se convierten automáticamente a porcentaje de la corriente nominal del tramo para el cálculo.
                      </p>
                    )}
                  </div>

                  {/* Inputs de armónicos */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['h3','h5','h7','h9'] as const).map(h => (
                      <div key={h} className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 ml-1">
                          {h === 'h3' ? '3° Armónico' : h === 'h5' ? '5° Armónico' : h === 'h7' ? '7° Armónico' : '9° Armónico'}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step={project.armonicos?.modoEntrada === 'amperios' ? '0.1' : '0.01'}
                            min="0"
                            max={project.armonicos?.modoEntrada === 'porcentaje' ? '1' : undefined}
                            placeholder={project.armonicos?.modoEntrada === 'amperios' ? '0.0 A' : '0.00'}
                            className="w-full bg-[var(--bg-secondary)] p-2.5 pr-8 rounded-lg border border-slate-700 text-white text-sm hover:border-slate-500 focus:border-[var(--accent)] outline-none transition-colors"
                            value={project.armonicos?.[h] ?? ''}
                            onChange={(e) => onChange({
                              ...project,
                              armonicos: {
                                ...project.armonicos,
                                [h]: e.target.value as any
                              }
                            })}
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 pointer-events-none">
                            {project.armonicos?.modoEntrada === 'amperios' ? 'A' : '%'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!project.armonicos?.habilitado && (
                <p className="text-xs text-slate-600 italic">
                  Los armónicos están deshabilitados. Se usará la corriente nominal del tramo directamente.
                </p>
              )}
            </div>
        </div>
      </section>



      <button onClick={handleSave} className="bg-[var(--accent)] text-black px-6 py-2 rounded-xl font-bold">Guardar Configuración</button>
    </div>
  );
};
