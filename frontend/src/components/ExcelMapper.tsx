import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export const ExcelMapper = ({ onMappingComplete }: { onMappingComplete: (mapping: any, data: any[]) => void }) => {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});

  const requiredFields = ['section', 'current_rating', 'material', 'insulation', 'conductors_count'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  const handleMap = (field: string, header: string) => {
    setMapping((prev) => ({ ...prev, [field]: header }));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Mapeo de Columnas</h2>
      <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" className="mb-4" />
      
      {headers.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {requiredFields.map((field) => (
            <div key={field} className="flex flex-col">
              <label className="font-semibold text-sm">{field}</label>
              <select 
                className="border p-2 rounded"
                onChange={(e) => handleMap(field, e.target.value)}
              >
                <option value="">Seleccionar columna...</option>
                {headers.map((h, i) => <option key={i} value={h}>{h}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
      
      <button 
        onClick={() => onMappingComplete(mapping, rawData)}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Confirmar Mapeo
      </button>
    </div>
  );
};
