import React from 'react';
import { useProject } from '../context/ProjectDataContext';
import { Plus } from 'lucide-react';
import { Transformador, Proteccion } from '../types/project';
import * as transformadorEngine from '../engine/strategies/industrial/transformador';
import * as potenciaEngine from '../engine/strategies/industrial/formulas/potencia';

const ProteccionFields = ({ label, value, onChange, tiposPermitidos }: { 
  label: string, 
  value?: Proteccion, 
  onChange: (p: Proteccion | undefined) => void,
  tiposPermitidos?: string[]
}) => (
  <div className="mt-2 p-2 bg-slate-900 rounded border border-slate-700">
    <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
    <div className="flex gap-2">
      <select 
        className="bg-[var(--bg-secondary)] text-white text-xs rounded p-1"
        value={value?.tipo_proteccion || 'Termomagnética'}
        onChange={(e) => onChange({ 
          ...value!,
          tipo_proteccion: e.target.value as any,
          in_amp: value?.in_amp || 0,
          marca: value?.marca || 'Schneider',
          id: value?.id || Date.now().toString(),
          modelo: value?.modelo || 'Estándar',
          polos: value?.polos || 2,
          capacidades: value?.capacidades || []
        })}
      >
        {tiposPermitidos ? tiposPermitidos.map(t => <option key={t} value={t}>{t}</option>) : (
          <>
            <option value="Termomagnética">Termomagnética</option>
            <option value="Fusible">Fusible</option>
            <option value="Interruptor Automático Abierto">Interruptor Automático Abierto</option>
            <option value="Interruptor Automático Compacto">Interruptor Automático Compacto</option>
            <option value="PIA">PIA</option>
          </>
        )}
      </select>
      <input 
        type="number" 
        placeholder="A" 
        className="w-16 bg-[var(--bg-secondary)] text-white text-xs rounded p-1"
        value={value?.in_amp || ''}
        onChange={(e) => onChange({ 
          ...value!,
          tipo_proteccion: value?.tipo_proteccion || 'Termomagnética',
          in_amp: Number(e.target.value),
          marca: value?.marca || 'Schneider',
          id: value?.id || Date.now().toString(),
          modelo: value?.modelo || 'Estándar',
          polos: value?.polos || 2,
          capacidades: value?.capacidades || []
        })}
      />
      <select 
        className="bg-[var(--bg-secondary)] text-white text-xs rounded p-1"
        value={value?.marca || 'Schneider'}
        onChange={(e) => onChange({ 
          ...value!,
          tipo_proteccion: value?.tipo_proteccion || 'Termomagnética',
          in_amp: value?.in_amp || 0,
          marca: e.target.value as any,
          id: value?.id || Date.now().toString(),
          modelo: value?.modelo || 'Estándar',
          polos: value?.polos || 2,
          capacidades: value?.capacidades || []
        })}
      >
        <option value="Schneider">Schneider</option>
        <option value="ABB">ABB</option>
      </select>
    </div>
  </div>
);

export const UnifilarEditor = () => {
  const { state, setState } = useProject();

  if (!state) return null;

  const intr = 0;
  const ik1 = 0;

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800">
      <h2 className="text-lg font-semibold text-white mb-6">Configuración TGBT</h2>
      
      {/* Sección de Protecciones TGBT */}
      <div className="mb-6 p-4 bg-slate-900 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">Protección Cabecera</h3>
        <ProteccionFields 
            label="" 
            value={state.transformador?.proteccionCabecera} 
            tiposPermitidos={['Interruptor Automático Abierto', 'Interruptor Automático Compacto', 'PIA']}
            onChange={(p) => setState({...state, transformador: {...state.transformador!, proteccionCabecera: p}})} 
        />
        
        <div className="mt-6 flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Protección de Salida TGBT</h3>
            <button 
                onClick={() => setState({...state, transformador: {...state.transformador!, proteccionesSalida: [...(state.transformador?.proteccionesSalida || []), { 
                    id: Date.now().toString(),
                    modelo: 'Nuevo',
                    tipo_proteccion: 'Interruptor Automático Compacto', 
                    in_amp: 0,
                    polos: 3,
                    capacidades: []
                }] }})} 
                className="bg-[var(--accent)] text-white p-3 rounded-lg hover:bg-opacity-80"
            >
                <Plus size={24} />
            </button>
        </div>
        <div className="space-y-2">
          {(state.transformador?.proteccionesSalida || []).map((p: Proteccion, i: number) => (
            <ProteccionFields key={i} label={`Salida ${i+1}`} value={p} onChange={(newP) => {
                const newSalidas = [...(state.transformador?.proteccionesSalida || [])];
                if (newP) newSalidas[i] = newP;
                else newSalidas.splice(i, 1);
                setState({...state, transformador: {...state.transformador!, proteccionesSalida: newSalidas}});
            }} />
          ))}
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-slate-900 rounded-lg">
        <p className="text-sm text-[var(--text-secondary)]">Potencia Total Proyecto:</p>
        <p className="text-2xl font-bold text-white">{potenciaEngine.calcularPotenciaTotal(state.tableros || [])} kVA</p>
      </div>

      <div className="mt-8 p-6 bg-slate-900 rounded-2xl border border-slate-700">
        <h3 className="text-md font-semibold text-white mb-4">Datos calculados</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-slate-700">
            <p className="text-xs text-[var(--text-secondary)]">Intr (A)</p>
            <p className="text-lg font-bold text-white">{intr.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-slate-700">
            <p className="text-xs text-[var(--text-secondary)]">Ik1 (kA)</p>
            <p className="text-lg font-bold text-white">{ik1.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};