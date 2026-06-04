import { Conductor, TipoConductor } from '../types/project';

export const ConductorForm = ({ label, conductor, onChange }: { label: string, conductor?: Conductor, onChange: (c: Conductor) => void }) => {
  return (
    <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
      <label className="text-xs text-slate-400 mb-2 block">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <select 
          className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors"
          value={conductor?.tipo || 'Cable'}
          onChange={(e) => {
            const newTipo = e.target.value as TipoConductor;
            const newConductor: Conductor = {
              ...conductor,
              tipo: newTipo,
              material: newTipo === 'Cable' ? (conductor?.material || 'Cobre') : undefined,
              aislacion: newTipo === 'Cable' ? (conductor?.aislacion || 'PVC') : undefined,
              seccion: undefined, 
              metodoInstalacion: newTipo === 'Cable' ? (conductor?.metodoInstalacion || '') : undefined,
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
              value={conductor?.material || 'Cobre'}
              onChange={(e) => onChange({ 
                ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                material: e.target.value as any 
              })}
            >
              <option value="Cobre">Cobre</option>
              <option value="Aluminio">Aluminio</option>
            </select>
            <select 
              className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors"
              value={conductor?.aislacion || 'PVC'}
              onChange={(e) => onChange({ 
                ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                aislacion: e.target.value as any 
              })}
            >
              <option value="PVC">PVC</option>
              <option value="XLPE">XLPE</option>
            </select>
            <select 
              className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors col-span-2"
              value={conductor?.metodoInstalacion || ''}
              onChange={(e) => onChange({ 
                ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                metodoInstalacion: e.target.value 
              })}
            >
              <option value="">Método de Instalación</option>
              <option value="A1">A1 - Embutida pared aislante</option>
              <option value="A2">A2 - Embutida pared aislante</option>
              <option value="B1">B1 - Cañería apoyada pared</option>
              <option value="B2">B2 - Cañería apoyada pared</option>
              <option value="C">C - Sobre pared</option>
              <option value="D1">D1 - Enterrado en cañería</option>
              <option value="D2">D2 - Enterrado directo</option>
              <option value="E">E - Bandeja tipo escalera</option>
              <option value="F">F - Tres unipolares contacto</option>
              <option value="G">G - Tres unipolares separados</option>
            </select>
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

