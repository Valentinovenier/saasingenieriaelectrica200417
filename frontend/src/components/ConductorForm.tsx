import { Conductor, TipoConductor } from '../types/project';

export const ConductorForm = ({ label, conductor, onChange }: { label: string, conductor?: Conductor, onChange: (c: Conductor) => void }) => {
  return (
    <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
      <label className="text-xs text-slate-400 mb-2 block">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <select 
          className="bg-slate-950 text-white text-xs rounded p-1"
          value={conductor?.tipo || 'Cable'}
          onChange={(e) => {
            const newTipo = e.target.value as TipoConductor;
            const newConductor: Conductor = {
              ...conductor,
              tipo: newTipo,
              material: newTipo === 'Cable' ? (conductor?.material || 'Cobre') : undefined,
              aislacion: newTipo === 'Cable' ? (conductor?.aislacion || 'PVC') : undefined,
              seccion: undefined, // Asegurar que sea undefined
              metodoInstalacion: newTipo === 'Cable' ? (conductor?.metodoInstalacion || '') : undefined,
              longitud: conductor?.longitud || 0,
            };
            onChange(newConductor);
          }}
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
            <select 
              className="bg-slate-950 text-white text-xs rounded p-1 col-span-2"
              value={conductor.metodoInstalacion || ''}
              onChange={(e) => onChange({ ...conductor, metodoInstalacion: e.target.value })}
            >
              <option value="">Método de Instalación</option>
              <option value="Bandeja perforada">Bandeja perforada</option>
              <option value="Bandeja tipo escalera">Bandeja tipo escalera</option>
              <option value="Embebido en pared">Embebido en pared</option>
              <option value="Subterráneo en ducto">Subterráneo en ducto</option>
              <option value="Al aire libre">Al aire libre</option>
            </select>
          </>
        )}
        <input 
          type="number" 
          placeholder="Longitud (m)" 
          className="bg-slate-950 text-white text-xs rounded p-1"
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

