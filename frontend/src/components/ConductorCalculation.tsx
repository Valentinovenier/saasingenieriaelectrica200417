import { useState } from 'react';
import { Project, Conductor } from '../types/project';
import { ConductorForm } from './ConductorForm';
import { calcularConductorTramo } from '../engine/calculadorTramo';
import { catalogoCablesPVC, catalogoCablesXLPE } from '../data/cables';

const TRAMOS_ELECTRICOS = [
  { id: 'trafo-tgbt', label: 'Transformador - TGBT' },
  { id: 'tgbt-barra', label: 'TGBT - Barra Omnibus' },
  { id: 'barra-salida', label: 'Barra Omnibus - Interruptor de Salida' },
  { id: 'salida-tablero', label: 'Interruptor de Salida - Tablero Seccional' },
];

export const ConductorCalculation = ({ project }: { project: Project }) => {
  const [conductores, setConductores] = useState<Record<string, Conductor>>({});
  const [resultados, setResultados] = useState<Record<string, any>>({});

  const updateConductor = (tramoId: string, conductor: Conductor) => {
    setConductores(prev => ({
      ...prev,
      [tramoId]: conductor
    }));
  };

  const handleCalcular = (tramoId: string) => {
    const conductor = conductores[tramoId];
    if (!conductor || !conductor.aislacion || !conductor.material || !conductor.metodoInstalacion) {
        alert("Por favor completa todos los datos del conductor");
        return;
    }

    const catalogo = conductor.aislacion === 'XLPE' ? catalogoCablesXLPE : catalogoCablesPVC;

    const resultado = calcularConductorTramo(
        {...conductor, tipoInstalacion: project.tipoInstalacion},
        project.transformador?.potencia || 0, // Itrafo - Esto deberá calcularse en el motor
        50, // Ik hipotético (kA) - En una integración real vendría del cálculo de cortocircuito
        0.1, // t_apertura hipotético (s)
        (conductor.longitud || 0) / 1000, // km
        project.transformador?.cosFi || 0.95, 
        3, // caida 3%
        catalogo,
        project.tempAmbiente || 40,
        true, // tipoInstalacionAire
        1 // nCircuitosAgrupados
    );

    setResultados(prev => ({ ...prev, [tramoId]: resultado }));
  };

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <h2 className="text-2xl font-bold text-white mb-6">Cálculo de Conductores por Tramo</h2>
      
      <div className="space-y-4">
        {TRAMOS_ELECTRICOS.map((tramo) => {
          const conductor = conductores[tramo.id];
          const resultado = resultados[tramo.id];
          
          return (
            <div key={tramo.id} className="bg-[var(--bg-primary)] p-4 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-3">{tramo.label}</h3>
              
              <ConductorForm 
                label={`Configuración ${tramo.label}`}
                conductor={conductor}
                onChange={(c) => updateConductor(tramo.id, c)}
              />
              
              <button 
                onClick={() => handleCalcular(tramo.id)}
                className="mt-4 bg-[var(--accent)] text-black px-4 py-2 rounded-lg font-bold"
              >
                Calcular
              </button>

              {resultado && (
                <div className="mt-4 p-3 bg-slate-950 rounded border border-slate-700 text-xs text-white">
                    <p>Resultado: {resultado.cable.seccion} mm²</p>
                    <p>Cables en paralelo: {resultado.nConductores}</p>
                    <p>Caída de tensión: {resultado.porcentajeCaida.toFixed(2)}%</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
