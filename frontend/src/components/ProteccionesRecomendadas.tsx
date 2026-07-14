import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface Props {
  corrienteNominal: number;
  ikKa?: number;
  label: string;
  energiaPasanteAdmisible?: number | null;
}

export const ProteccionesRecomendadas = ({ corrienteNominal, ikKa, label, energiaPasanteAdmisible }: Props) => {
  // Recomendaciones básicas
  const minIn = Math.ceil(corrienteNominal * 1.15 / 5) * 5; // Margen 15% y redondeo a múltiplo de 5A
  const minIcu = ikKa ? Math.ceil(ikKa) : 6; // Mínimo 6kA estándar residencial

  return (
    <div className="bg-slate-900 p-4 rounded-lg border border-emerald-900/50 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Info className="text-emerald-500" size={18} />
        <h4 className="text-emerald-400 font-bold text-sm">Recomendación para {label}</h4>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-950 p-2 rounded">
          <p className="text-slate-500 uppercase">In Mínima</p>
          <p className="text-white font-bold text-lg">{minIn} A</p>
        </div>
        <div className="bg-slate-950 p-2 rounded">
          <p className="text-slate-500 uppercase">Icn/Icu Mínima</p>
          <p className="text-white font-bold text-lg">{minIcu} kA</p>
        </div>
        {energiaPasanteAdmisible !== undefined && energiaPasanteAdmisible !== null && (
          <div className="bg-slate-950 p-2 rounded">
            <p className="text-slate-500 uppercase">Límite Térmico (I²t Max)</p>
            <p className="text-white font-bold text-lg">
              {(energiaPasanteAdmisible / 1e6).toFixed(2)} MA²s
            </p>
          </div>
        )}
      </div>
      
      {ikKa && ikKa < 6 && (
        <div className="mt-3 flex items-center gap-2 text-amber-500 text-[10px]">
          <AlertTriangle size={14} />
          <span>Atención: El valor de Ik bajo puede requerir revisión de selectividad.</span>
        </div>
      )}
    </div>
  );
};
