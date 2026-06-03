import { useState } from 'react';
import { Project } from '../types/project';

type TipoConductor = 'Cable' | 'CEP';
type Material = 'Cobre' | 'Aluminio';

interface ConfiguracionTramo {
  longitud: number;
  tipoConductor?: TipoConductor;
  material?: Material;
  metodoInstalacion?: string;
}

const TRAMOS_ELECTRICOS = [
  { id: 'trafo-tgbt', label: 'Transformador - TGBT' },
  { id: 'tgbt-barra', label: 'TGBT - Barra Omnibus' },
  { id: 'barra-salida', label: 'Barra Omnibus - Interruptor de Salida' },
  { id: 'salida-tablero', label: 'Interruptor de Salida - Tablero Seccional' },
];

const METODOS_INSTALACION = [
  'Bandeja perforada',
  'Bandeja tipo escalera',
  'Embebido en pared',
  'Subterráneo en ducto',
  'Al aire libre',
];

export const ConductorCalculation = ({ project }: { project: Project }) => {
  const [configuraciones, setConfiguraciones] = useState<Record<string, ConfiguracionTramo>>({});

  const updateConfig = (id: string, field: keyof ConfiguracionTramo, value: any) => {
    setConfiguraciones(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <h2 className="text-2xl font-bold text-white mb-6">Cálculo de Conductores por Tramo</h2>
      
      <div className="space-y-4">
        {TRAMOS_ELECTRICOS.map((tramo) => {
          const config = configuraciones[tramo.id] || { longitud: 0 };
          return (
            <div key={tramo.id} className="bg-[var(--bg-primary)] p-4 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-3">{tramo.label}</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <input 
                  type="number" 
                  placeholder="Longitud (m)" 
                  className="bg-[var(--bg-secondary)] p-2 rounded-lg text-white border border-slate-600" 
                  value={config.longitud || ''}
                  onChange={(e) => updateConfig(tramo.id, 'longitud', Number(e.target.value))}
                />
                <select 
                  className="bg-[var(--bg-secondary)] p-2 rounded-lg text-white border border-slate-600"
                  value={config.tipoConductor || ''}
                  onChange={(e) => updateConfig(tramo.id, 'tipoConductor', e.target.value as TipoConductor)}
                >
                  <option value="">Tipo Conductor</option>
                  <option value="Cable">Cable</option>
                  <option value="CEP">CEP</option>
                </select>

                {config.tipoConductor === 'Cable' && (
                  <select 
                    className="bg-[var(--bg-secondary)] p-2 rounded-lg text-white border border-slate-600"
                    value={config.material || ''}
                    onChange={(e) => updateConfig(tramo.id, 'material', e.target.value as Material)}
                  >
                    <option value="">Material</option>
                    <option value="Cobre">Cobre</option>
                    <option value="Aluminio">Aluminio</option>
                  </select>
                )}

                {(config.tipoConductor === 'Cable' || config.tipoConductor === 'CEP') && (
                  <select 
                    className="bg-[var(--bg-secondary)] p-2 rounded-lg text-white border border-slate-600"
                    value={config.metodoInstalacion || ''}
                    onChange={(e) => updateConfig(tramo.id, 'metodoInstalacion', e.target.value)}
                  >
                    <option value="">Método de Instalación</option>
                    {METODOS_INSTALACION.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                )}
                
                <button className="bg-[var(--accent)] text-black px-4 py-2 rounded-lg font-bold">Calcular</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
