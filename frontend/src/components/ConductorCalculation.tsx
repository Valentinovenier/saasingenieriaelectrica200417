import { useState } from 'react';
import { Project, Conductor } from '../types/project';
import { ConductorForm } from './ConductorForm';
import { calcularConductorTramo } from '../engine/calculadorTramo';
import { catalogoCablesPVC, catalogoCablesXLPE, ParametrosCableCompleto } from '../data/cables';

const TRAMOS_ELECTRICOS = [
  { id: 'trafo-tgbt', label: 'Transformador - TGBT' },
  { id: 'tgbt-barra', label: 'TGBT - Barra Omnibus' },
  { id: 'barra-salida', label: 'Barra Omnibus - Interruptor de Salida' },
  { id: 'salida-tablero', label: 'Interruptor de Salida - Tablero Seccional' },
];

export const ConductorCalculation = ({ project, onChange }: { project: Project, onChange: (p: Project) => void }) => {
  const [resultados, setResultados] = useState<Record<string, any>>({});

  const getConductor = (tramoId: string): Conductor | undefined => {
    return (project as any).conductores?.[tramoId];
  };

  const realizarCalculo = (tramoId: string, conductor: Conductor, currentProject: Project) => {
    if (!conductor || !conductor.aislacion || !conductor.material || !conductor.metodoInstalacion) {
        return; 
    }

    const catalogo: ParametrosCableCompleto[] = conductor.aislacion === 'XLPE' ? catalogoCablesXLPE : catalogoCablesPVC;

    const potenciaVA = (currentProject.transformador?.potencia || 0) * 1000;
    const tensionSecundaria = currentProject.transformador?.tensionSecundario || (currentProject.tipoInstalacion === 'Trifásica' ? 380 : 220);
    const Itrafo = potenciaVA / (currentProject.tipoInstalacion === 'Trifásica' ? Math.sqrt(3) * tensionSecundaria : tensionSecundaria);

    const caidaMaxPermitida = conductor.caidaMaxPermitida || 3;
    const tiempoApertura = tramoId === 'trafo-tgbt' ? (conductor.tiempoAperturaMT || 0.1) : 0.1;

    const resultado = calcularConductorTramo(
       {...conductor, tipoInstalacion: currentProject.tipoInstalacion},
       Itrafo, 
       50, 
       tiempoApertura, 
       (conductor.longitud || 0) / 1000, 
       currentProject.transformador?.cosFi || 0.95,
       caidaMaxPermitida, 
       catalogo,
       (currentProject as any).tempAmbiente || 40,
       true 
    );

    setResultados(prev => ({ ...prev, [tramoId]: resultado }));
  };

  const updateConductor = (tramoId: string, conductor: Conductor) => {
    onChange({
      ...project,
      conductores: {
        ...(project as any).conductores,
        [tramoId]: conductor
      }
    });
  };

  const handleCalcular = (tramoId: string) => {
    const conductor = getConductor(tramoId);
    if (!conductor || !conductor.aislacion || !conductor.material || !conductor.metodoInstalacion) {
        alert("Por favor completa todos los datos del conductor");
        return;
    }
    
    // Limpiamos el resultado previo para forzar un re-renderizado
    setResultados(prev => ({ ...prev, [tramoId]: null }));
    
    // Calculamos tras un breve instante
    setTimeout(() => realizarCalculo(tramoId, conductor, project), 0);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      // Aseguramos que estamos enviando el objeto 'project' tal cual con las actualizaciones
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: project.id,
          name: project.name,
          data: project // Enviamos todo el objeto proyecto actualizado
        })
      });

      if (response.ok) {
        alert('Configuración de conductores guardada exitosamente');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar');
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Cálculo de Conductores por Tramo</h2>
        <button onClick={handleSave} className="bg-[var(--accent)] text-black px-4 py-2 rounded-lg font-bold">Guardar Cambios</button>
      </div>
      
      <div className="space-y-4">
        {TRAMOS_ELECTRICOS.map((tramo) => {
          const conductor = getConductor(tramo.id);
          const resultado = resultados[tramo.id];
          
          return (
            <div key={tramo.id} className="bg-[var(--bg-primary)] p-4 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-3">{tramo.label}</h3>
              
              <ConductorForm 
                label={`Configuración ${tramo.label}`}
                tramoId={tramo.id}
                conductor={conductor}
                onChange={(c) => updateConductor(tramo.id, c)}
              />
              
              <button 
                onClick={() => handleCalcular(tramo.id)}
                className="mt-4 bg-slate-700 text-white px-4 py-2 rounded-lg font-bold"
              >
                Calcular
              </button>

              {resultado?.error && (
                <div className="mt-4 p-3 bg-red-950 rounded border border-red-700 text-xs text-red-200">
                    <p>{resultado.error}</p>
                </div>
              )}
              {resultado && !resultado.error && (
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
