import React from 'react';
import { ExcelMapper } from './ExcelMapper';

export const FileUpload = () => {
  return (
    <div className="w-full">
      <ExcelMapper onMappingComplete={(m, d) => console.log('Mapeo final:', m, d)} />
    </div>
  );
};
