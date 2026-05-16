import { useState } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { FileUpload } from './components/FileUpload';
import { ProjectCriteria } from './components/ProjectCriteria';
import { UnifilarPage } from './components/UnifilarPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('upload');

  const renderContent = () => {
    switch (currentPage) {
      case 'upload':
        return (
          <>
            <header className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">Subir Plano</h2>
              <p className="text-[var(--text-secondary)]">Cargá un archivo .dxf para iniciar el cálculo automático.</p>
            </header>
            <FileUpload />
          </>
        );
      case 'criteria':
        return (
          <>
            <header className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">Criterios de Proyectista</h2>
              <p className="text-[var(--text-secondary)]">Definí los parámetros base para tus cálculos de ingeniería.</p>
            </header>
            <ProjectCriteria />
          </>
        );
      case 'unifilar':
        return (
          <>
            <header className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">Diseño Unifilar TGBT</h2>
              <p className="text-[var(--text-secondary)]">Configurá tu sistema y visualizá el esquema en tiempo real.</p>
            </header>
            <UnifilarPage />
          </>
        );
      default:
        return (
          <div className="text-white">Página en construcción</div>
        );
    }
  };

  return (
    <DashboardLayout activePage={currentPage} onNavigate={setCurrentPage}>
      {renderContent()}
    </DashboardLayout>
  );
}
