import { useState } from 'react';
import { Project, Conductor } from '../types/project';
import { ConductorForm } from './ConductorForm';

const TRAMOS_ELECTRICOS = [
  { id: 'trafo-tgbt', label: 'Transformador - TGBT' },
  { id: 'tgbt-barra', label: 'TGBT - Barra Omnibus' },
  { id: 'barra-salida', label: 'Barra Omnibus - Interruptor de Salida' },
  { id: 'salida-tablero', label: 'Interruptor de Salida - Tablero Seccional' },
];

export const ConductorCalculation = ({ project }: { project: Project }) => {
  const [conductores, setConductores] = useState<Record<string, Conductor>>({});

  const updateConductor = (tramoId: string, conductor: Conductor) => {
    setConductores(prev => ({
      ...prev,
      [tramoId]: conductor
    }));
  };

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <h2 className="text-2xl font-bold text-white mb-6">Cálculo de Conductores por Tramo</h2>
      
      <div className="space-y-4">
        {TRAMOS_ELECTRICOS.map((tramo) => {
          const conductor = conductores[tramo.id];
          
          return (
            <div key={tramo.id} className="bg-[var(--bg-primary)] p-4 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-3">{tramo.label}</h3>
              
              <ConductorForm 
                label={`Configuración ${tramo.label}`}
                conductor={conductor}
                onChange={(c) => updateConductor(tramo.id, c)}
              />
              
              <button className="mt-4 bg-[var(--accent)] text-black px-4 py-2 rounded-lg font-bold">Calcular</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
