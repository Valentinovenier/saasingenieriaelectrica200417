import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { ExcelMapper } from './ExcelMapper';

export const FileUpload = () => {
  const [showMapper, setShowMapper] = useState(false);

  if (showMapper) {
    return <ExcelMapper onMappingComplete={(m, d) => console.log('Mapeo final:', m, d)} />;
  }

  return (
    <div className="group relative border-2 border-dashed border-slate-700 hover:border-[var(--accent)] rounded-2xl p-12 text-center transition-all duration-300 bg-[var(--bg-secondary)] hover:shadow-lg hover:shadow-[var(--accent)]/10">
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-[var(--bg-primary)] group-hover:scale-110 transition-transform duration-300">
          <Upload className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" size={40} />
        </div>
        <input 
          type="file" 
          className="hidden" 
          id="file-upload" 
          onChange={(e) => {
            if (e.target.files?.length) setShowMapper(true);
          }} 
          accept=".xlsx, .xls"
        />
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <span className="text-lg font-semibold text-white">Arrastra tu Excel aquí</span>
          <span className="text-sm text-[var(--text-secondary)]">
            o haz clic para explorar (.xlsx)
          </span>
        </label>
      </div>
    </div>
  );
};
