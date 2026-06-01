import React from 'react';
import { UnifilarEditor } from '../components/UnifilarEditor';
import { UnifilarCanvas } from '../components/UnifilarCanvas';

export const UnifilarPage = () => {
  return (
    <div className="flex flex-col gap-8 w-full">
      <UnifilarEditor />
      <UnifilarCanvas />
    </div>
  );
};
