import { useState, useEffect } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProjectList } from './components/ProjectList';
import { NewProjectModal } from './components/NewProjectModal';
import { ProjectSettings } from './components/ProjectSettings';
import { ConductorCalculation } from './components/ConductorCalculation';
import { LiveUnifilar } from './components/LiveUnifilar';
import { Project } from './types/project';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';

export default function App() {
  const { isAuthenticated, loading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('inicio');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        
        // Verificación estricta: asegurar que 'data' sea un array
        if (Array.isArray(data)) {
          const parsed = data.map((p: any) => {
            try {
              return { ...p, data: typeof p.data === 'string' ? JSON.parse(p.data) : p.data };
            } catch (e) {
              console.error("Error al parsear el JSON de un proyecto:", p.id, e);
              return { ...p, data: {} }; // Fallback para datos corruptos
            }
          });
          setProjects(parsed);
        } else {
          console.error("La respuesta de /api/projects no es un array:", data);
          setProjects([]); // Estado seguro
        }
      } else if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
      }
    } catch (e) {
      console.error("Error al cargar proyectos:", e);
      setProjects([]); // Estado seguro en caso de error de red
    }
  };


  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return showRegister ? (
      <RegisterPage onLoginClick={() => setShowRegister(false)} />
    ) : (
      <LoginPage onRegisterClick={() => setShowRegister(true)} />
    );
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
        // Aseguramos que el objeto tenga la estructura completa
        const projectToAdd = { ...newProject, data: newProject };
        setProjects([...projects, projectToAdd]);
        setSelectedProjectId(newProject.id);
        setIsModalOpen(false);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        window.location.reload();
      } else {
        throw new Error('No se pudo crear el proyecto');
      }
    } catch (error: any) {
      alert(`Error al crear el proyecto: ${error.message}`);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/projects?id=' + id, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== id));
      } else {
        alert('No se pudo eliminar el proyecto.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderContent = () => {
    if (selectedProject) {
      return (
        <div className="space-y-6">
          <ProjectSettings
            project={selectedProject}
            onSave={(updated) => {
              setProjects((projects || []).map(p => p.id === updated.id ? updated : p));
            }}
            onDelete={() => deleteProject(selectedProject.id)}
          />
          <ConductorCalculation project={selectedProject} />
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
              onDelete={deleteProject}
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
