import { Project } from '../../types/project';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { calcularPotencias } from '../../engine/strategies/vivienda/normas770';

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export const ViviendaResumen = ({ project, onChange }: Props) => {
  const datos = project.datosVivienda || { superficieCubierta: 0, superficieSemicubierta: 0, ambientes: [], circuitosCalculados: [] };
  const grado = datos.gradoElectrificacion || 'Minimo';
  
  // Usar la función centralizada de normas770.ts
  const { potenciaInstalada, potenciaMaximaSimultanea } = calcularPotencias(datos);
  
  // Actualizamos el proyecto con los valores calculados
  // Esto asegura que al hacer click en guardar, el proyecto ya contenga estos valores
  const actualizarPotencias = () => {
    if (project.datosVivienda) {
        onChange({
            ...project,
            datosVivienda: {
                ...project.datosVivienda,
                potenciaInstalada,
                potenciaMaximaSimultanea
            }
        });
    }
  };

  // Llamamos a la actualización al renderizar el resumen
  // (Esto es temporal para asegurar que los datos estén en el proyecto al momento de guardar)
  if (project.datosVivienda && (project.datosVivienda.potenciaInstalada !== potenciaInstalada)) {
      actualizarPotencias();
  }

  const minCircuitosMap: Record<string, number> = { 'Minimo': 2, 'Medio': 3, 'Elevado': 5, 'Superior': 6 };
  const minCircuitos = minCircuitosMap[grado] || 2;
  
  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-slate-700 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white">Resumen de Carga y Tablero</h2>
        <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">DPMS Estimada</p>
                <p className="text-lg font-bold text-white">{potenciaMaximaSimultanea.toFixed(0)} VA</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase">Detalle de Circuitos</h3>
          <div className="space-y-2">
            {datos.circuitosCalculados.map((c: any, index: number) => (
              <div key={index} className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{c.nombre}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{c.tipo.replace(/_/g, ' ')}</p>
                </div>
              </div>
            ))}
            {datos.circuitosCalculados.length === 0 && (
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
                <span className={`font-bold ${datos.circuitosCalculados.length >= minCircuitos ? 'text-emerald-400' : 'text-red-400'}`}>
                    {datos.circuitosCalculados.length} / {minCircuitos}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Potencia Instalada:</span>
                <span className="text-white font-bold">{potenciaInstalada.toFixed(0)} VA</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Potencia Máxima (DPMS):</span>
                <span className="text-emerald-400 font-bold">{potenciaMaximaSimultanea.toFixed(0)} VA</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-800">
                <span className="text-slate-400">Tipo de Instalación Sugerido:</span>
                <span className="text-white font-bold">
                    {potenciaMaximaSimultanea > 7000 ? 'Trifásica' : 'Monofásica'}
                </span>
              </div>
            </div>
          </div>

          {datos.circuitosCalculados.length < minCircuitos && (
            <div className="bg-red-900/20 border border-red-800 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-red-400 shrink-0" size={20} />
              <div>
                <p className="text-sm font-bold text-red-400">Cumplimiento insuficiente</p>
                <p className="text-[10px] text-red-400/80 mt-1">
                  Faltan {minCircuitos - datos.circuitosCalculados.length} circuitos para cumplir con el grado de electrificación {grado}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
