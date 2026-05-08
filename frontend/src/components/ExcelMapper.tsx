import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, CheckCircle2, ChevronRight } from 'lucide-react';

export const ExcelMapper = ({ onMappingComplete }: { onMappingComplete: (mapping: any, data: any[]) => void }) => {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});

  const fields = [
    { id: 'section', label: 'Sección (mm²)', desc: 'Área del conductor' },
    { id: 'current_rating', label: 'Corriente Admisible (A)', desc: 'Capacidad de corriente' },
    { id: 'material', label: 'Material', desc: 'Cobre o Aluminio' },
    { id: 'insulation', label: 'Aislante', desc: 'Tipo (PVC/XLPE)' },
    { id: 'conductors_count', label: 'Conductores Cargados', desc: 'Cantidad de fases' },
  ];

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      const fileHeaders = data[0] as string[];
      setHeaders(fileHeaders);
      setRawData(data.slice(1));
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-slate-900 rounded-2xl border border-slate-700 shadow-xl text-slate-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-white">Asignar Columnas del Excel</h2>
        <p className="text-slate-400">
          Relaciona las columnas de tu archivo con los campos técnicos necesarios para el cálculo.
        </p>
      </div>

      {!headers.length ? (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-blue-500 transition-colors bg-slate-800">
          <Upload className="w-10 h-10 text-slate-400 mb-2" />
          <span className="font-medium text-white">Seleccionar archivo Excel</span>
          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} accept=".xlsx, .xls" />
        </label>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4">
            {fields.map((field) => (
              <div key={field.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div>
                  <h4 className="font-semibold text-white">{field.label}</h4>
                  <p className="text-xs text-slate-400">{field.desc}</p>
                </div>
                <div className="flex items-center gap-3">
                  <ChevronRight className="text-slate-600" />
                  <select 
                    className="bg-slate-950 text-white border border-slate-600 rounded-md p-2 outline-none focus:border-blue-500"
                    onChange={(e) => setMapping({...mapping, [field.id]: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    {headers.map((h, i) => <option key={i} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onMappingComplete(mapping, rawData)}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={20} />
            Finalizar Mapeo y Calcular
          </button>
        </div>
      )}
    </div>
  );
};
