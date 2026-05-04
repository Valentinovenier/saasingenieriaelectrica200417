import React, { useState } from 'react';
import { Upload } from 'lucide-react';

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
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-yellow-500 transition-colors">
      <Upload className="mx-auto text-gray-400 mb-4" size={48} />
      <input type="file" className="hidden" id="file-upload" onChange={handleUpload} />
      <label htmlFor="file-upload" className="cursor-pointer text-yellow-600 font-semibold">
        {uploading ? 'Procesando...' : 'Seleccionar archivo plano (.dxf)'}
      </label>
    </div>
  );
};
