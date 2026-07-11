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

  const saveProject = async (updatedProject: any) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/projects`, {
        method: 'POST', // Siguiendo el patrón de App.tsx para persistir cambios
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
          {[project.tableroPrincipal, ...(project.tableros || [])].map((tablero) => (
            <div key={tablero.id} className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-slate-700">
              <h4 className="text-white font-medium flex items-center gap-2">
                <Layout size={16} /> {tablero.nombre}
              </h4>
              <div className="mt-4 space-y-4">
                <AsignacionProteccion 
                  label="Protección Cabecera"
                  proteccion={tablero.proteccionCabecera}
                  disponibles={protecciones}
                  onChange={(p) => handleUpdateTablero(tablero.id, { proteccionCabecera: p })}
                />
                
                <div className="border-t border-slate-700 pt-4">
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Protecciones de Salida</label>
                  <div className="space-y-2">
                    {tablero.proteccionesSalida?.map((p, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <span className="text-xs text-white bg-slate-800 p-1 rounded">{p.modelo}</span>
                        <button 
                          onClick={() => {
                            const nuevasSalidas = tablero.proteccionesSalida?.filter((_, i) => i !== idx);
                            handleUpdateTablero(tablero.id, { proteccionesSalida: nuevasSalidas });
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <AsignacionProteccion 
                      label="Añadir Salida"
                      proteccion={undefined}
                      disponibles={protecciones}
                      opcional={false}
                      onChange={(p) => {
                        if (p) {
                          handleUpdateTablero(tablero.id, { 
                            proteccionesSalida: [...(tablero.proteccionesSalida || []), p] 
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
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
          onSave={async (data) => {
            // Lógica existente de guardado
            setShowForm(false);
            setEditingProteccion(null);
            fetchProtecciones();
          }} 
          initialData={editingProteccion} 
        />
      )}
    </div>
  );
};
