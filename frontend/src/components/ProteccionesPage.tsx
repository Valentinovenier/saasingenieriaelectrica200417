import React, { useState, useEffect } from 'react';
import { Plus, Zap, Trash2, Pencil } from 'lucide-react';
import { ProteccionesForm } from './ProteccionesForm';
import { useAuth } from '../context/AuthContext';

export const ProteccionesPage = () => {
  const { isAuthenticated } = useAuth();
  const [protecciones, setProtecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProteccion, setEditingProteccion] = useState<any>(null);

  const fetchProtecciones = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    fetch('/api/guardar-proteccion', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error en la respuesta');
        return res.json();
      })
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

  const handleEdit = (p: any) => {
    setEditingProteccion(p);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="text-[var(--accent)]" />
          Mis Protecciones
        </h2>
        <button onClick={() => { setEditingProteccion(null); setShowForm(true); }} className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90">
          <Plus size={18} /> Nueva Protección
        </button>
      </div>

      {showForm && (
        <ProteccionesForm 
          onClose={() => { setShowForm(false); setEditingProteccion(null); }} 
          onSave={handleSave} 
          initialData={editingProteccion} 
        />
      )}

      {loading ? (
        <div className="text-[var(--text-secondary)]">Cargando...</div>
      ) : (
        <div className="grid gap-4">
          {protecciones.map((p: any) => (
            <div key={p.id} className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-slate-800 flex justify-between items-center">
              <div className='flex items-center gap-4'>
                <button onClick={() => handleEdit(p)} className="text-[var(--text-secondary)] hover:text-white">
                  <Pencil size={18} />
                </button>
                <div>
                  <h3 className="text-white font-semibold">{p.modelo}</h3>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Tipo: {p.tipo_proteccion} | In: {p.in_amp}A
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
