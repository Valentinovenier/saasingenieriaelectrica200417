import React from 'react';
import { UnifilarEditor } from '../components/UnifilarEditor';
import { UnifilarCanvas } from '../components/UnifilarCanvas';

export const UnifilarPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <UnifilarEditor />
      <UnifilarCanvas />
    </div>
  );
};
