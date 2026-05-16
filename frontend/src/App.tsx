import { useState } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { UnifilarPage } from './components/UnifilarPage';
import { ProjectList } from './components/ProjectList';
import { NewProjectModal } from './components/NewProjectModal';
import { ProjectSettings } from './components/ProjectSettings';
import { Project } from './types/project';

export default function App() {
  const [currentPage, setCurrentPage] = useState('inicio');
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Edificio Residencial A', createdAt: '2026-05-15', status: 'draft', tableros: [] },
    { id: '2', name: 'Nave Industrial B', createdAt: '2026-05-10', status: 'completed', tableros: [] },
  ]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const renderContent = () => {
    if (selectedProject) {
      return (
        <div className="space-y-6">
          <ProjectSettings 
            project={selectedProject} 
            onSave={(updated) => {
              setProjects(projects.map(p => p.id === updated.id ? updated : p));
            }} 
          />
        </div>
      );
    }

    switch (currentPage) {
      case 'inicio':
        return (
          <>
            <header className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">Mis Proyectos</h2>
              <p className="text-[var(--text-secondary)]">Gestioná tus diseños eléctricos y cálculos de ingeniería.</p>
            </header>
            <ProjectList 
              projects={projects}
              onSelectProject={setSelectedProjectId} 
              onAddNew={() => setIsModalOpen(true)} 
            />
            {isModalOpen && (
              <NewProjectModal 
                onClose={() => setIsModalOpen(false)} 
                onCreate={(name) => {
                  const newProject: Project = {
                    id: Date.now().toString(),
                    name,
                    createdAt: new Date().toISOString().split('T')[0],
                    status: 'draft',
                    tableros: []
                  };
                  setProjects([...projects, newProject]);
                  setIsModalOpen(false);
                }} 
              />
            )}
          </>
        );
      default:
        return (
          <div className="text-white">Página en construcción</div>
        );
    }
  };

  return (
    <DashboardLayout activePage={currentPage} onNavigate={(page) => {
      setSelectedProjectId(null);
      setCurrentPage(page);
    }}>
      {renderContent()}
    </DashboardLayout>
  );
}
