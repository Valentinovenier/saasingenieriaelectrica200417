import { Conductor } from '../types/project';

export const ConductorForm = ({ label, conductor, onChange }: { label: string, conductor?: Conductor, onChange: (c: Conductor) => void }) => {
  return (
    <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
      <label className="text-xs text-slate-400 mb-2 block">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <select 
          className="bg-slate-950 text-white text-xs rounded p-1"
          value={conductor?.tipo || 'Cable'}
          onChange={(e) => onChange({ ...conductor, tipo: (e.target.value as TipoConductor) || 'Cable', material: conductor?.material || 'Cobre', aislacion: conductor?.aislacion || 'PVC' })}
        >
          <option value="Cable">Cable</option>
          <option value="CEP">Blindobarra (CEP)</option>
        </select>

        {conductor?.tipo === 'Cable' && (
          <>
            <select 
              className="bg-slate-950 text-white text-xs rounded p-1"
              value={conductor.material || 'Cobre'}
              onChange={(e) => onChange({ ...conductor, material: e.target.value as any })}
            >
              <option value="Cobre">Cobre</option>
              <option value="Aluminio">Aluminio</option>
            </select>
            <select 
              className="bg-slate-950 text-white text-xs rounded p-1"
              value={conductor.aislacion || 'PVC'}
              onChange={(e) => onChange({ ...conductor, aislacion: e.target.value as any })}
            >
              <option value="PVC">PVC</option>
              <option value="XLPE">XLPE</option>
            </select>
            <input 
              type="number" 
              placeholder="Sección (mm²)" 
              className="bg-slate-950 text-white text-xs rounded p-1"
              value={conductor.seccion || ''}
              onChange={(e) => onChange({ ...conductor, seccion: Number(e.target.value) })}
            />
          </>
        )}
        <input 
          type="number" 
          placeholder="Longitud (m)" 
          className="bg-slate-950 text-white text-xs rounded p-1"
          value={conductor?.longitud || ''}
          onChange={(e) => onChange({ ...conductor, longitud: Number(e.target.value) })}
        />
      </div>
    </div>
  );
};
