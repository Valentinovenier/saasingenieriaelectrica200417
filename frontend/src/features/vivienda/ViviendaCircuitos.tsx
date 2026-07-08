import { Project } from '../../types/project';
import { obtenerCircuitosMinimos } from '../../engine/strategies/vivienda/normas770';
import { Zap, AlertTriangle, Plus, Trash2 } from 'lucide-react';
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
    const totalTUE = datos.ambientes.reduce((acc, a) => acc + (a.puntosTUE || 0), 0);
    
    // Filtramos los circuitos automáticos para no contar los específicos manuales
    const actualesIUGs = datos.circuitosCalculados.filter(c => c.tipo === 'iluminacion_usos_generales');
    const actualesTUGs = datos.circuitosCalculados.filter(c => c.tipo === 'tomacorrientes_usos_generales');
    const actualesTUEs = datos.circuitosCalculados.filter(c => c.tipo === 'usos_especiales');
    const específicos = datos.circuitosCalculados.filter(c => c.tipo === 'usos_especificos');

    const numCircuitosIUG = Math.max(Math.ceil(totalIUG / 13), 1);
    const numCircuitosTUG = Math.max(Math.ceil(totalTUG / 13), 1);
    const numCircuitosTUE = totalTUE > 0 ? 1 : 0; 

    // Solo actualizar si la estructura de circuitos automáticos cambia
    if (
        actualesIUGs.length === numCircuitosIUG && 
        actualesTUGs.length === numCircuitosTUG && 
        actualesTUEs.length === numCircuitosTUE
    ) return;

    const nuevosCircuitos: CircuitoCalculado[] = [...específicos]; 
    
    for (let i = 0; i < numCircuitosIUG; i++) {
        nuevosCircuitos.push({ 
            id: `iug-${i}`, nombre: `Circuito IUG ${i + 1}`, 
            tipo: 'iluminacion_usos_generales', puntosIUG: 0, puntosTUG: 0, puntosTUE: 0, ambientesIds: [] 
        });
    }
    for (let i = 0; i < numCircuitosTUG; i++) {
        nuevosCircuitos.push({ 
            id: `tug-${i}`, nombre: `Circuito TUG ${i + 1}`, 
            tipo: 'tomacorrientes_usos_generales', puntosIUG: 0, puntosTUG: 0, puntosTUE: 0, ambientesIds: [] 
        });
    }
    for (let i = 0; i < numCircuitosTUE; i++) {
        nuevosCircuitos.push({ 
            id: `tue-${i}`, nombre: `Circuito Especial ${i + 1}`, 
            tipo: 'usos_especiales', puntosIUG: 0, puntosTUG: 0, puntosTUE: 0, ambientesIds: [] 
        });
    }

    onChange({ ...project, datosVivienda: { ...datos, circuitosCalculados: nuevosCircuitos } });
  }, [datos.ambientes]);

  const addCircuitoEspecifico = () => {
    const nuevoCircuito: CircuitoCalculado = {
        id: `esp-${Date.now()}`,
        nombre: `Circuito Específico ${datos.circuitosCalculados.filter(c => c.tipo === 'usos_especificos').length + 1}`,
        tipo: 'usos_especificos',
        puntosIUG: 0,
        puntosTUG: 0,
        puntosTUE: 0,
        ambientesIds: []
    };
    onChange({ ...project, datosVivienda: { ...datos, circuitosCalculados: [...datos.circuitosCalculados, nuevoCircuito] } });
  };

  const removeCircuito = (id: string) => {
    onChange({ ...project, datosVivienda: { ...datos, circuitosCalculados: datos.circuitosCalculados.filter(c => c.id !== id) } });
  };

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white">Circuitos Calculados (AEA 770)</h2>
        <button onClick={addCircuitoEspecifico} className="flex items-center gap-1 bg-[var(--accent)] text-black px-3 py-1.5 rounded-full text-xs font-bold hover:opacity-90">
            <Plus size={14} /> Circuito Específico
        </button>
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
            <div className="flex flex-col gap-2">
              <div>
                <p className="font-bold text-white">{c.nombre}</p>
                <p className="text-[10px] text-slate-500 uppercase">{c.tipo.replace(/_/g, ' ')}</p>
              </div>
              {c.tipo === 'iluminacion_usos_generales' && (
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={!!c.tieneTomacorrientesDerivados} 
                        onChange={(e) => {
                            const nuevosCircuitos = datos.circuitosCalculados.map(circ => 
                                circ.id === c.id ? { ...circ, tieneTomacorrientesDerivados: e.target.checked } : circ
                            );
                            onChange({ ...project, datosVivienda: { ...datos, circuitosCalculados: nuevosCircuitos } });
                        }}
                    />
                    Tiene tomas derivados
                </label>
              )}
            </div>
            {c.tipo === 'usos_especificos' && (
                <button onClick={() => removeCircuito(c.id)} className="text-red-400 p-1">
                    <Trash2 size={16} />
                </button>
            )}
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
