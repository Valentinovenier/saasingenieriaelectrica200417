import React, { useState } from 'react';
import { Proteccion } from '../types/project';
import { ProteccionesForm } from './ProteccionesForm';
import { Plus, Trash2, Edit2, Shield } from 'lucide-react';

interface Props {
  proteccionCabecera?: Proteccion;
  proteccionesSalida: Proteccion[];
  onChange: (data: { proteccionCabecera?: Proteccion; proteccionesSalida: Proteccion[] }) => void;
  esSeccional?: boolean; // Para saber si la cabecera es opcional
}

export const ConfiguracionProteccion = ({ proteccionCabecera, proteccionesSalida, onChange, esSeccional = false }: Props) => {
  const [editingProteccion, setEditingProteccion] = useState<{tipo: 'cabecera' | 'salida', index?: number, data?: Proteccion} | null>(null);

  const handleSave = (proteccion: Proteccion) => {
    if (editingProteccion?.tipo === 'cabecera') {
      onChange({ proteccionCabecera: proteccion, proteccionesSalida });
    } else {
      if (editingProteccion?.index !== undefined) {
        const nuevas = [...proteccionesSalida];
        nuevas[editingProteccion.index] = proteccion;
        onChange({ proteccionCabecera, proteccionesSalida: nuevas });
      } else {
        onChange({ proteccionCabecera, proteccionesSalida: [...proteccionesSalida, proteccion] });
      }
    }
    setEditingProteccion(null);
  };

  const eliminarSalida = (index: number) => {
    const nuevas = proteccionesSalida.filter((_, i) => i !== index);
    onChange({ proteccionCabecera, proteccionesSalida: nuevas });
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-slate-700">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Shield size={16} /> Protección Cabecera
        </h4>
        {proteccionCabecera ? (
          <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
            <span className="text-sm text-white">{proteccionCabecera.modelo} - {proteccionCabecera.in_amp}A</span>
            <button onClick={() => setEditingProteccion({tipo: 'cabecera', data: proteccionCabecera})} className="text-blue-400"><Edit2 size={16} /></button>
          </div>
        ) : (
            <button onClick={() => setEditingProteccion({tipo: 'cabecera'})} className="text-sm text-[var(--accent)]">+ Configurar Cabecera</button>
        )}
      </div>

      {/* Salidas */}
      <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-slate-700">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Shield size={16} /> Protecciones por Salida
        </h4>
        <div className="space-y-2">
            {proteccionesSalida.map((p, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-sm text-white">{p.modelo} - {p.in_amp}A</span>
                    <div className="flex gap-2">
                        <button onClick={() => setEditingProteccion({tipo: 'salida', index: i, data: p})} className="text-blue-400"><Edit2 size={16} /></button>
                        <button onClick={() => eliminarSalida(i)} className="text-red-400"><Trash2 size={16} /></button>
                    </div>
                </div>
            ))}
        </div>
        <button onClick={() => setEditingProteccion({tipo: 'salida'})} className="mt-3 text-sm text-[var(--accent)]">+ Agregar Salida</button>
      </div>

      {/* Modal Form */}
      {editingProteccion && (
        <ProteccionesForm 
            onClose={() => setEditingProteccion(null)}
            onSave={handleSave}
            initialData={editingProteccion.data}
        />
      )}
    </div>
  );
};
