import React, { useState, useEffect } from 'react';
import { Plus, Zap, Trash2, Pencil, Layout } from 'lucide-react';
import { ProteccionesForm } from './ProteccionesForm';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectDataContext';
import { AsignacionProteccion } from './AsignacionProteccion';

export const ProteccionesPage = () => {
  const { isAuthenticated } = useAuth();
  const { state: project, setState: setProject } = useProject();
  const [protecciones, setProtecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProteccion, setEditingProteccion] = useState<any>(null);

  const fetchProtecciones = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    fetch('/api/guardar-proteccion', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setProtecciones(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching protecciones:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProtecciones();
  }, []);

  if (!project) return <div className="text-white p-6">Por favor, selecciona un proyecto para gestionar protecciones.</div>;

  const handleSave = async (data: any) => {
    const token = localStorage.getItem('token');
    const method = editingProteccion ? 'PUT' : 'POST';
    const payload = editingProteccion ? { ...data, id: editingProteccion.id } : data;

    await fetch('/api/guardar-proteccion', {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(payload)
    });
    
    setShowForm(false);
    setEditingProteccion(null);
    fetchProtecciones();
  };

  const saveProject = async (updatedProject: any) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/projects`, {
        method: 'PUT', // Cambiado a PUT para actualizar en lugar de crear un nuevo registro
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: updatedProject.id,
          name: updatedProject.name,
          data: updatedProject
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.reload();
        }
        throw new Error('Error al guardar el proyecto');
      }
    } catch (error) {
      console.error('Error al persistir:', error);
      alert('No se pudieron guardar los cambios.');
    }
  };

  const handleUpdateTablero = async (tableroId: string, updates: any) => {
    // Lógica para actualizar el tablero específico en el proyecto
    // Asumiendo que project tiene 'tableroPrincipal' y 'tableros'
    const newProject = { ...project };
    if (newProject.tableroPrincipal.id === tableroId) {
      newProject.tableroPrincipal = { ...newProject.tableroPrincipal, ...updates };
    } else {
      newProject.tableros = newProject.tableros?.map(t => t.id === tableroId ? { ...t, ...updates } : t);
    }
    
    // Actualizamos estado local
    setProject(newProject);
    
    // Persistimos en el servidor
    await saveProject(newProject);
  };

  const calcularCorriente = (potencia: number) => {
    const isTrifasica = project.tipoInstalacion === 'Trifásica';
    const tension = isTrifasica ? 400 * Math.sqrt(3) : 230;
    return potencia / tension;
  };

  const calcularPotenciaTotal = (tablero: any) => {
    return (tablero.circuitosTerminales || []).reduce((sum: number, c: any) => sum + (c.potencia || 0), 0) + 
           (tablero.subTableros || []).reduce((sum: number, st: any) => sum + (st.potenciaTotal || 0), 0);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Zap className="text-[var(--accent)]" />
        Gestión de Protecciones por Tablero
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lista de Tableros */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Tableros</h3>
          {[project.tableroPrincipal, ...(project.tableros || [])].map((tablero) => {
            const potenciaTotal = calcularPotenciaTotal(tablero);
            const corrienteEstimada = calcularCorriente(potenciaTotal);
            
            return (
              <div key={tablero.id} className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <Layout size={16} /> {tablero.nombre}
                  </h4>
                  <span className="text-xs text-[var(--accent)] bg-slate-800 px-2 py-1 rounded">
                    In Estimada: {corrienteEstimada.toFixed(2)} A
                  </span>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                      <AsignacionProteccion 
                        label="Protección General (Cabecera)"
                        proteccion={tablero.proteccionCabecera}
                        disponibles={protecciones}
                        onChange={(p) => handleUpdateTablero(tablero.id, { proteccionCabecera: p })}
                      />
                      <AsignacionProteccion 
                        label="Protección Diferencial"
                        proteccion={tablero.proteccionDiferencial}
                        disponibles={protecciones}
                        onChange={(p) => handleUpdateTablero(tablero.id, { proteccionDiferencial: p })}
                      />
                  </div>
                  
                  <div className="border-t border-slate-700 pt-4">
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Protecciones por Circuito</label>
                    <div className="space-y-3">
                      {tablero.circuitosTerminales?.map((circuito) => {
                        const corrienteNominal = calcularCorriente(circuito.potencia);

                        return (
                          <div key={circuito.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-white font-medium">{circuito.nombre}</span>
                                <span className="text-xs text-[var(--accent)] font-bold">
                                  {corrienteNominal.toFixed(2)} A
                                </span>
                            </div>
                            <AsignacionProteccion 
                              label={`Asignar Protección (Req: ${corrienteNominal.toFixed(2)} A)`}
                              proteccion={circuito.proteccion}
                              disponibles={protecciones}
                              opcional={true}
                              onChange={(p) => {
                                // Actualizar la protección del circuito específico
                                const nuevosCircuitos = tablero.circuitosTerminales.map(c => 
                                  c.id === circuito.id ? { ...c, proteccion: p! } : c
                                );
                                handleUpdateTablero(tablero.id, { circuitosTerminales: nuevosCircuitos });
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Catálogo */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="text-lg font-semibold text-white">Catálogo de Protecciones</h3>
             <button onClick={() => { setEditingProteccion(null); setShowForm(true); }} className="bg-[var(--accent)] text-white px-3 py-1 rounded flex items-center gap-1 text-sm">
                <Plus size={14} /> Nueva
             </button>
          </div>
          
          {protecciones.map((p: any) => (
            <div key={p.id} className="bg-[var(--bg-secondary)] p-3 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-white text-sm">{p.modelo}</p>
                <p className="text-[var(--text-secondary)] text-xs">{p.tipo_proteccion} | {p.in_amp}A</p>
              </div>
              <button onClick={() => { setEditingProteccion(p); setShowForm(true); }} className="text-[var(--text-secondary)] hover:text-white">
                <Pencil size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <ProteccionesForm 
          onClose={() => { setShowForm(false); setEditingProteccion(null); }} 
          onSave={handleSave} 
          initialData={editingProteccion} 
        />
      )}
    </div>
  );
};
