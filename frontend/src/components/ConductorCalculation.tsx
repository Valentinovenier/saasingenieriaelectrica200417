import { useState } from 'react';
import { Project, Conductor } from '../types/project';
import { ConductorForm } from './ConductorForm';
import { calcularConductorTramo } from '../engine/calculadorTramo';
import { catalogoCablesPVC, catalogoCablesXLPE, ParametrosCableCompleto } from '../data/cables';
import { ChevronDown, ChevronUp } from 'lucide-react';

const TRAMOS_ELECTRICOS = [
  { id: 'trafo-tgbt', label: 'Transformador - TGBT' },
  { id: 'tgbt-barra', label: 'TGBT - Barra Omnibus' },
  { id: 'barra-salida', label: 'Barra Omnibus - Interruptor de Salida' },
  { id: 'salida-tablero', label: 'Interruptor de Salida - Tablero Seccional' },
];

export const ConductorCalculation = ({ project, onChange }: { project: Project, onChange: (p: Project) => void }) => {
  const [selectedTramoId, setSelectedTramoId] = useState<string>(TRAMOS_ELECTRICOS[0].id);
  const [resultados, setResultados] = useState<Record<string, any>>({});

  const getConductor = (tramoId: string): Conductor | undefined => {
    return (project as any).conductores?.[tramoId];
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

  const handleCalcular = () => {
    const tramoId = selectedTramoId;
    const conductor = getConductor(tramoId);
    if (!conductor || !conductor.aislacion || !conductor.material || !conductor.metodoInstalacion) {
        alert("Por favor completa todos los datos del conductor");
        return;
    }
    
    setResultados(prev => ({ ...prev, [tramoId]: null }));
    
    const catalogo: ParametrosCableCompleto[] = conductor.aislacion === 'XLPE' ? catalogoCablesXLPE : catalogoCablesPVC;

    const potenciaVA = (project.transformador?.potencia || 0) * 1000;
    const tensionSecundaria = project.transformador?.tensionSecundario || (project.tipoInstalacion === 'Trifásica' ? 380 : 220);
    const Itrafo = potenciaVA / (project.tipoInstalacion === 'Trifásica' ? Math.sqrt(3) * tensionSecundaria : tensionSecundaria);

    const caidaMaxPermitida = conductor.caidaMaxPermitida || 3;
    const tiempoApertura = tramoId === 'trafo-tgbt' ? (conductor.tiempoAperturaMT || 0.1) : 0.1;

    const resultado = calcularConductorTramo(
       {...conductor, tipoInstalacion: project.tipoInstalacion, plano: conductor.plano},
       Itrafo, 
       50, 
       tiempoApertura, 
       (conductor.longitud || 0) / 1000, 
       project.transformador?.cosFi || 0.95,
       caidaMaxPermitida, 
       catalogo,
       (project as any).tempAmbiente || 40,
       true 
    );
    
    setResultados(prev => ({ ...prev, [tramoId]: resultado }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: project.id,
          name: project.name,
          data: project
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

  const currentConductor = getConductor(selectedTramoId);
  const currentResultado = resultados[selectedTramoId];
  const currentTramoLabel = TRAMOS_ELECTRICOS.find(t => t.id === selectedTramoId)?.label || '';

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Cálculo de Conductores</h2>
        <button onClick={handleSave} className="bg-[var(--accent)] text-black px-4 py-2 rounded-lg font-bold">Guardar Cambios</button>
      </div>
      
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
            Seleccionar Tramo
          </label>
          <select 
            className="bg-slate-950 text-white text-sm rounded-lg p-3 border border-slate-700 hover:border-slate-500 transition-colors w-full md:w-1/3"
            value={selectedTramoId}
            onChange={(e) => setSelectedTramoId(e.target.value)}
          >
            {TRAMOS_ELECTRICOS.map(tramo => (
              <option key={tramo.id} value={tramo.id}>{tramo.label}</option>
            ))}
          </select>
        </div>

        <div className="bg-[var(--bg-primary)] rounded-xl border border-slate-700 p-6 space-y-6 transition-all">
          <ConductorForm 
            label={`Configuración: ${currentTramoLabel}`}
            tramoId={selectedTramoId}
            conductor={currentConductor}
            onChange={(c) => updateConductor(selectedTramoId, c)}
          />
          
          <button 
            onClick={handleCalcular}
            className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg font-bold hover:bg-slate-600 transition-colors"
          >
            Calcular Conductor
          </button>

          {currentResultado?.error && (
            <div className="p-3 bg-red-950 rounded border border-red-700 text-xs text-red-200">
                <p>{currentResultado.error}</p>
            </div>
          )}
          {currentResultado && !currentResultado.error && (
            <div className="p-4 bg-slate-950 rounded border border-slate-700 text-sm text-white space-y-1">
                <p className="font-bold text-slate-400 uppercase text-[10px] mb-2">Resultado del Cálculo</p>
                <p>Sección: <span className="text-[var(--accent)] font-bold">{currentResultado.cable.seccion} mm²</span></p>
                <p>Cables en paralelo: <span className="text-[var(--accent)] font-bold">{currentResultado.nConductores}</span></p>
                <p>Caída de tensión: <span className="text-[var(--accent)] font-bold">{currentResultado.porcentajeCaida.toFixed(2)}%</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
