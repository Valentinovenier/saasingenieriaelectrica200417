import { Conductor, TipoConductor } from '../types/project';
import { getMetodosValidos } from '../engine/metodosProvider';

export const ConductorForm = ({ label, conductor, onChange, tramoId }: { label: string, conductor?: Conductor, onChange: (c: Conductor) => void, tramoId?: string }) => {
  const tipoCable = conductor?.tipoCable || 'Multipolar';
  const aislacion = conductor?.aislacion || 'PVC';
  const material = conductor?.material || 'Cobre';
  
  // Filtrado dinámico
  const metodosDisponibles = getMetodosValidos(aislacion as any, material as any, tipoCable);

  return (
    <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
      <label className="text-xs text-slate-400 mb-2 block">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <select 
          className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors col-span-2"
          value={conductor?.tipo || 'Cable'}
          onChange={(e) => {
            const newTipo = e.target.value as TipoConductor;
            const newConductor: Conductor = {
              ...conductor,
              tipo: newTipo,
              material: newTipo === 'Cable' ? (conductor?.material || 'Cobre') : undefined,
              aislacion: newTipo === 'Cable' ? (conductor?.aislacion || 'PVC') : undefined,
              seccion: undefined, 
              metodoInstalacion: undefined, 
              tipoCable: 'Multipolar', 
              longitud: conductor?.longitud || 0,
            };
            onChange(newConductor);
          }}
        >
          <option value="Cable">Cable</option>
          <option value="CEP">Blindobarra (CEP)</option>
        </select>

        {(!conductor?.tipo || conductor.tipo === 'Cable') && (
          <>
            <select 
              className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors"
              value={material}
              onChange={(e) => {
                const newMaterial = e.target.value as any;
                const newConductor = {
                  ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                  material: newMaterial,
                  metodoInstalacion: undefined
                };
                onChange(newConductor);
              }}
            >
              <option value="Cobre">Cobre</option>
              <option value="Aluminio">Aluminio</option>
            </select>
            <select 
              className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors"
              value={aislacion}
              onChange={(e) => {
                const newAislacion = e.target.value as any;
                const newConductor = {
                  ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                  aislacion: newAislacion,
                  metodoInstalacion: undefined
                };
                onChange(newConductor);
              }}
            >
              <option value="PVC">PVC</option>
              <option value="XLPE">XLPE</option>
              <option value="Mineral">Mineral</option>
            </select>

            <select 
              className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors"
              value={tipoCable}
              onChange={(e) => {
                const newTipoCable = e.target.value as 'Multipolar' | 'Unipolar';
                const newConductor = {
                  ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                  tipoCable: newTipoCable,
                  metodoInstalacion: undefined, 
                  disposicion: undefined 
                };
                onChange(newConductor);
              }}
            >
              <option value="Multipolar">Multipolar</option>
              <option value="Unipolar">Unipolar</option>
            </select>

            {tipoCable === 'Unipolar' && (
              <select
                className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors"
                value={conductor?.disposicion || 'trebol'}
                onChange={(e) => onChange({
                  ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                  disposicion: e.target.value as 'trebol' | 'contacto' | 'separado'
                })}
              >
                {(!conductor?.metodoInstalacion || (conductor.metodoInstalacion !== 'F' && conductor.metodoInstalacion !== 'G')) && (
                    <>
                        <option value="trebol">Trébol</option>
                        <option value="contacto">En contacto</option>
                        {conductor?.aislacion !== 'Mineral' && <option value="separado">Separados</option>}
                    </>
                )}
                {conductor?.metodoInstalacion === 'F' && (
                    <>
                        <option value="trebol">Trébol</option>
                        <option value="contacto">En contacto</option>
                    </>
                )}
                {conductor?.metodoInstalacion === 'G' && (
                    <option value="separado">Separados</option>
                )}
              </select>
            )}
            <select 
              className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors col-span-2"
              value={conductor?.metodoInstalacion || ''}
              onChange={(e) => onChange({ 
                ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                metodoInstalacion: e.target.value 
              })}
            >
              <option value="">Selecciona Método de Instalación</option>
              {metodosDisponibles.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            
            <input 
              type="number" 
              placeholder="Caída tensión máx (%)" 
              className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors"
              value={conductor?.caidaMaxPermitida || ''}
              onChange={(e) => onChange({ 
                ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                caidaMaxPermitida: Number(e.target.value) 
              })}
            />

            {tramoId === 'trafo-tgbt' && (
              <input 
                type="number" 
                placeholder="Tiempo apertura MT (s)" 
                className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors"
                value={conductor?.tiempoAperturaMT || ''}
                onChange={(e) => onChange({ 
                  ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                  tiempoAperturaMT: Number(e.target.value) 
                })}
              />
            )}
          </>
        )}
        <input 
          type="number" 
          placeholder="Longitud (m)" 
          className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors col-span-2"
          value={conductor?.longitud || ''}
          onChange={(e) => onChange({ 
            ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', seccion: 0, longitud: 0 }),
            longitud: Number(e.target.value) 
          })}
        />
      </div>
    </div>
  );
};
