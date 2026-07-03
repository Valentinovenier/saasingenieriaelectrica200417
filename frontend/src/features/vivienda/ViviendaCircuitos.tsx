import { Project } from '../../types/project';
import { obtenerCircuitosMinimos } from '../../engine/strategies/vivienda/normas770';
import { Zap, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { CircuitoCalculado } from '../../types/vivienda';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export const ViviendaCircuitos = ({ project, onChange }: Props) => {
  const datos = project.datosVivienda || { superficieCubierta: 0, superficieSemicubierta: 0, ambientes: [], circuitosCalculados: [] };
  
  const grado = datos.gradoElectrificacion || 'Minimo';
  const minCircuitos = obtenerCircuitosMinimos(grado as any);

  // Lógica de cálculo automático
  useEffect(() => {
    if (!datos.ambientes) return;

    const totalIUG = datos.ambientes.reduce((acc, a) => acc + (a.puntosIUG || 0), 0);
    const totalTUG = datos.ambientes.reduce((acc, a) => acc + (a.puntosTUG || 0), 0);
    
    // Comparar con circuitos existentes para evitar actualizaciones innecesarias (prevenir bucles)
    const numCircuitosIUG = Math.ceil(totalIUG / 13);
    const numCircuitosTUG = Math.ceil(totalTUG / 13);

    const actualesIUG = datos.circuitosCalculados.filter(c => c.tipo === 'iluminacion_usos_generales').length;
    const actualesTUG = datos.circuitosCalculados.filter(c => c.tipo === 'tomacorrientes_usos_generales').length;

    if (numCircuitosIUG === actualesIUG && numCircuitosTUG === actualesTUG) return;

    const nuevosCircuitos: CircuitoCalculado[] = [];
    
    for (let i = 0; i < Math.max(numCircuitosIUG, 1); i++) {
        nuevosCircuitos.push({ 
            id: `iug-${i}`, nombre: `Circuito IUG ${i + 1}`, 
            tipo: 'iluminacion_usos_generales', puntosIUG: 0, puntosTUG: 0, ambientesIds: [] 
        });
    }
    for (let i = 0; i < Math.max(numCircuitosTUG, 1); i++) {
        nuevosCircuitos.push({ 
            id: `tug-${i}`, nombre: `Circuito TUG ${i + 1}`, 
            tipo: 'tomacorrientes_usos_generales', puntosIUG: 0, puntosTUG: 0, ambientesIds: [] 
        });
    }

    onChange({ ...project, datosVivienda: { ...datos, circuitosCalculados: nuevosCircuitos } });
  }, [datos.ambientes, datos.circuitosCalculados.length]);

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white">Circuitos Calculados (AEA 770)</h2>
        <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 ${
            datos.circuitosCalculados.length >= minCircuitos 
            ? 'bg-emerald-900/20 border-emerald-800 text-emerald-400' 
            : 'bg-red-900/20 border-red-800 text-red-400'
        }`}>
            <Zap size={18} />
            <div>
                <p className="text-[10px] uppercase font-bold opacity-70">Circuitos</p>
                <p className="text-lg font-bold">{datos.circuitosCalculados.length} / {minCircuitos} Mínimos</p>
            </div>
        </div>
      </div>

      <div className="space-y-3">
        {datos.circuitosCalculados.map(c => (
          <div key={c.id} className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
            <div>
              <p className="font-bold text-white">{c.nombre}</p>
              <p className="text-[10px] text-slate-500 uppercase">{c.tipo.replace(/_/g, ' ')}</p>
            </div>
            <div className="text-xs text-slate-400">
                Límite normativo: 15 bocas
            </div>
          </div>
        ))}
        {datos.circuitosCalculados.length < minCircuitos && (
            <div className="text-amber-400 text-sm flex items-center gap-2 pt-4">
                <AlertTriangle size={16} />
                Se requiere agregar más carga o ambientes para alcanzar los circuitos mínimos.
            </div>
        )}
      </div>
    </div>
  );
};
