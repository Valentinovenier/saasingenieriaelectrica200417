import { useState, useEffect } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProjectList } from './components/ProjectList';
import { NewProjectModal } from './components/NewProjectModal';
import { ProjectSettings } from './components/ProjectSettings';
import { LiveUnifilar } from './components/LiveUnifilar';
import { Project } from './types/project';
import { Auth } from './components/Auth';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('inicio');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('No autorizado');
      const data = await res.json();
      const parsed = data.map((p: any) => ({ ...p, data: JSON.parse(p.data) }));
      setProjects(parsed);
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  if (!isAuthenticated) return <Auth onAuth={fetchProjects} />;

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const createProject = async (name: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft',
      tableros: [],
      armonicos: {h3:0, h5:0, h7:0, h9:0}
    };

    if (import.meta.env.DEV) {
      const updated = [...projects, newProject];
      setProjects(updated);
      localStorage.setItem('localProjects', JSON.stringify(updated));
      setIsModalOpen(false);
      return;
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newProject.id,
          name: newProject.name,
          data: newProject
        })
      });
      
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      setProjects([...projects, newProject]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al crear proyecto:", error);
    }
  };

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
          <LiveUnifilar project={selectedProject} />
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
                onCreate={createProject} 
              />
            )}
          </>
        );
      default:
        return <div className="text-white">Página en construcción</div>;
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
