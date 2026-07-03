import { Project } from '../../types/project';
import { calcularDPMS } from '../../engine/strategies/vivienda/normas770';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export const ViviendaResumen = ({ project, onChange }: Props) => {
  const datos = project.datosVivienda || { superficieCubierta: 0, superficieSemicubierta: 0, ambientes: [], circuitos: [] };
  
  // Calculamos la potencia real sumando los puntos de los ambientes asignados a cada circuito
  const calcularPotenciaCircuito = (circuitoId: string) => {
    let puntosIUG = 0;
    let puntosTUG = 0;

    datos.ambientes.forEach(a => {
      if (a.circuitos?.includes(circuitoId)) {
        puntosIUG += (a.puntosIUG || 0);
        puntosTUG += (a.puntosTUG || 0);
      }
    });

    // Valores base por punto según AEA 770
    const POTENCIA_BOCA_IUG = 100; 
    const POTENCIA_BOCA_TUG = 150; 

    return puntosIUG * POTENCIA_BOCA_IUG + puntosTUG * POTENCIA_BOCA_TUG;
  };

  const circuitosConPotencia = datos.circuitos.map(c => ({
    ...c,
    potenciaCalculada: calcularPotenciaCircuito(c.id)
  }));

  const potenciaTotalSinSimultaneidad = circuitosConPotencia.reduce((acc, c) => acc + c.potenciaCalculada, 0);
  
  const grado = datos.gradoElectrificacion || 'Minimo';
  const minCircuitosMap: Record<string, number> = { 'Minimo': 2, 'Medio': 3, 'Elevado': 5, 'Superior': 6 };
  const minCircuitos = minCircuitosMap[grado] || 2;
  
  // Coeficiente de simultaneidad basado en la cantidad de CIRCUITOS MÍNIMOS requeridos por la norma
  const coefSimultaneidad = minCircuitos > 5 ? 0.7 : 0.8;
  const dpms = potenciaTotalSinSimultaneidad * coefSimultaneidad;

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white">Resumen de Carga y Tablero</h2>
        <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">DPMS Estimada</p>
                <p className="text-lg font-bold text-white">{dpms.toFixed(0)} VA</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase">Detalle de Circuitos</h3>
          <div className="space-y-2">
            {circuitosConPotencia.map(c => (
              <div key={c.id} className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{c.nombre}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{c.tipo.replace(/_/g, ' ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[var(--accent)]">{c.potenciaCalculada} VA</p>
                  <p className="text-[10px] text-slate-500">Potencia de carga</p>
                </div>
              </div>
            ))}
            {datos.circuitos.length === 0 && (
                <div className="text-center py-8 text-slate-500 italic text-sm">No hay circuitos definidos.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase">Estado del Proyecto</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Circuitos:</span>
                <span className={`font-bold ${datos.circuitos.length >= minCircuitos ? 'text-emerald-400' : 'text-red-400'}`}>
                    {datos.circuitos.length} / {minCircuitos}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Potencia Total (P.Nom):</span>
                <span className="text-white font-bold">{potenciaTotalSinSimultaneidad.toFixed(0)} VA</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Simultaneidad:</span>
                <span className="text-white font-bold">{coefSimultaneidad * 100}%</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Info size={16} />
                <span className="text-xs font-bold uppercase">Nota de cálculo</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                El DPMS se calcula sobre la suma de las potencias de los circuitos asignados, aplicando un factor de simultaneidad del {coefSimultaneidad * 100}% basado en los circuitos mínimos requeridos por la norma para su grado de electrificación.
              </p>
            </div>
          </div>

          {datos.circuitos.length < minCircuitos && (
            <div className="bg-red-900/20 border border-red-800 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-red-400 shrink-0" size={20} />
              <div>
                <p className="text-sm font-bold text-red-400">Cumplimiento insuficiente</p>
                <p className="text-[10px] text-red-400/80 mt-1">
                  Faltan {minCircuitos - datos.circuitos.length} circuitos para cumplir con el grado de electrificación {grado}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
