import { useState } from 'react';
import { Project } from '../types/project';

export const ConductorCalculation = ({ project }: { project: Project }) => {
  // Aquí irá la lógica de cálculo
  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <h2 className="text-2xl font-bold text-white mb-6">Cálculo de Conductores</h2>
      <p className="text-[var(--text-secondary)]">Sección en construcción. Aquí se realizarán los cálculos basados en la configuración del proyecto.</p>
      
      {/* Ejemplo de estructura futura */}
      <div className="mt-4 p-4 bg-[var(--bg-primary)] rounded-xl text-white">
        <h4 className="font-semibold mb-2">Resumen de Tableros</h4>
        <ul>
          {project.tableros.map(t => (
            <li key={t.id}>{t.name} - {t.potenciaTotal} kW</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
