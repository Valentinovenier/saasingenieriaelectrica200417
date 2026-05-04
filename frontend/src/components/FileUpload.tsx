import React, { useState } from 'react';
import { Upload, FileUp } from 'lucide-react';

export const FileUpload = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const res = await fetch('/api/upload-plano', { method: 'POST', body: formData });
      if (res.ok) alert('Plano subido con éxito');
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="group relative border-2 border-dashed border-slate-700 hover:border-[var(--accent)] rounded-2xl p-12 text-center transition-all duration-300 bg-[var(--bg-secondary)] hover:shadow-lg hover:shadow-[var(--accent)]/10">
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-[var(--bg-primary)] group-hover:scale-110 transition-transform duration-300">
          <Upload className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" size={40} />
        </div>
        <input type="file" className="hidden" id="file-upload" onChange={handleUpload} />
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <span className="text-lg font-semibold text-white">
            {uploading ? 'Procesando archivo...' : 'Arrastra tu plano aquí'}
          </span>
          <span className="text-sm text-[var(--text-secondary)]">
            o haz clic para explorar (.dxf, .dwg)
          </span>
        </label>
      </div>
    </div>
  );
};
