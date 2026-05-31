import { useState } from 'react';
import { Project } from '../types/project';

// Definición de los tramos solicitados
const TRAMOS_ELECTRICOS = [
  { id: 'trafo-tgbt', label: 'Transformador - TGBT' },
  { id: 'tgbt-barra', label: 'TGBT - Barra Omnibus' },
  { id: 'barra-salida', label: 'Barra Omnibus - Interruptor de Salida' },
  { id: 'salida-tablero', label: 'Interruptor de Salida - Tablero Seccional' },
];

// Opciones de método de instalación
const METODOS_INSTALACION = [
  'Bandeja perforada',
  'Bandeja tipo escalera',
  'Embebido en pared',
  'Subterráneo en ducto',
  'Al aire libre',
];

export const ConductorCalculation = ({ project }: { project: Project }) => {
  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <h2 className="text-2xl font-bold text-white mb-6">Cálculo de Conductores por Tramo</h2>
      
      <div className="space-y-4">
        {TRAMOS_ELECTRICOS.map((tramo) => (
          <div key={tramo.id} className="bg-[var(--bg-primary)] p-4 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">{tramo.label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="number" placeholder="Longitud (m)" className="bg-[var(--bg-secondary)] p-2 rounded-lg text-white border border-slate-600" />
                <select className="bg-[var(--bg-secondary)] p-2 rounded-lg text-white border border-slate-600">
                    <option value="">Material</option>
                    <option value="cobre">Cobre</option>
                    <option value="aluminio">Aluminio</option>
                </select>
                <select className="bg-[var(--bg-secondary)] p-2 rounded-lg text-white border border-slate-600">
                    <option value="">Método de Instalación</option>
                    {METODOS_INSTALACION.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <button className="bg-[var(--accent)] text-black px-4 py-2 rounded-lg font-bold">Calcular</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
