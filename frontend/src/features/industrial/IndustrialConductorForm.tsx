import { Conductor } from '../../types/project';
import { getMetodosValidos } from '../../engine/strategies/industrial/metodosProvider';
import { TipoConductor } from '../../types/project';

interface Props {
  label: string;
  conductor?: Conductor;
  onChange: (c: Conductor) => void;
  tramoId?: string;
}

export const IndustrialConductorForm = ({ label, conductor, onChange, tramoId }: Props) => {
  const tipoCable = conductor?.tipoCable || 'Multipolar';
  const aislacion = conductor?.aislacion || 'PVC';
  const material = conductor?.material || 'Cobre';

  const metodosDisponibles = getMetodosValidos(aislacion as any, material as any, tipoCable);

  const handleDataChange = (updates: Partial<Conductor>) => {
    onChange({
      ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
      ...updates,
    } as Conductor);
  };

  return (
    <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-sm">
      <label className="text-xs font-medium text-slate-400 mb-4 block border-b border-slate-800 pb-2">
        {label} <span className="text-[var(--accent)] ml-2">(Configuración Industrial)</span>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Material</label>
          <select 
            className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
            value={material}
            onChange={(e) => handleDataChange({ material: e.target.value as any, metodoInstalacion: undefined })}
          >
            <option value="Cobre">Cobre</option>
            <option value="Aluminio">Aluminio</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Aislamiento</label>
          <select 
            className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
            value={aislacion}
            onChange={(e) => handleDataChange({ aislacion: e.target.value as any, metodoInstalacion: undefined })}
          >
            <option value="PVC">PVC</option>
            <option value="XLPE">XLPE</option>
            <option value="Mineral">Mineral</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Tipo de Cable</label>
          <select
            className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
            value={tipoCable}
            onChange={(e) => handleDataChange({ tipoCable: e.target.value as any, metodoInstalacion: undefined })}
          >
            <option value="Multipolar">Multipolar</option>
            <option value="Unipolar">Unipolar</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Método de Instalación</label>
          <select 
            className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
            value={conductor?.metodoInstalacion || ''}
            onChange={(e) => handleDataChange({ metodoInstalacion: e.target.value })}
          >
            <option value="">Selecciona Método</option>
            {metodosDisponibles.map((m: { value: string; label: string }) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {tipoCable === 'Unipolar' && (
          <div className="col-span-2">
            <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Disposición de Conductores</label>
            <div className="relative">
              <select 
                className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
                value={conductor?.disposicion || 'contacto'}
                onChange={(e) => handleDataChange({ disposicion: e.target.value as any })}
              >
                <option value="contacto">Contacto</option>
                <option value="trebol">Trébol</option>
                <option value="separado">Separado</option>
              </select>
            </div>
          </div>
        )}

        <div>
          <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Longitud (m)</label>
          <input 
            type="number" 
            className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
            value={conductor?.longitud || ''}
            onChange={(e) => handleDataChange({ longitud: parseFloat(e.target.value) || 0 })}
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Caída Máx (%)</label>
          <input 
            type="number" 
            step="0.1"
            className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
            value={conductor?.caidaMaxPermitida || 3}
            onChange={(e) => handleDataChange({ caidaMaxPermitida: parseFloat(e.target.value) || 3 })}
          />
        </div>

        {tramoId === 'trafo-tgbt' && (
          <div className="col-span-2">
            <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Tiempo Apertura MT (seg)</label>
            <input 
              type="number" 
              step="0.01"
              className="w-full bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700"
              value={conductor?.tiempoAperturaMT || 0.1}
              onChange={(e) => handleDataChange({ tiempoAperturaMT: parseFloat(e.target.value) || 0.1 })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

