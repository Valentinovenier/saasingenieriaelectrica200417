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

  // 1. Verificar si ya hay un token al cargar la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchProjects();
    }
  }, []);

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/projects', { 
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        const parsed = Array.isArray(data) ? data.map((p: any) => ({ ...p, data: JSON.parse(p.data) })) : [];
        setProjects(parsed);
      } else if (res.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error("Error al cargar proyectos:", e);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    fetchProjects();
  };

  // SI NO ESTÁ AUTENTICADO, SOLO MOSTRAR EL LOGIN. SIN LLAMADAS A API PREVIAS.
  if (!isAuthenticated) {
    return <Auth onAuth={handleAuthSuccess} />;
  }

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

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: newProject.id,
          name: newProject.name,
          data: newProject
        })
      });
      
      if (response.ok) {
        setProjects([...projects, newProject]);
        setIsModalOpen(false);
      }
    } catch (error: any) {
      alert(`Error al crear el proyecto: ${error.message}`);
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
