import React from 'react';
import { LayoutDashboard, Settings, Zap, LogOut, FileText, BarChart3, Box, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout = ({ 
  children, 
  activePage, 
  onNavigate,
  projectSelected
}: { 
  children: React.ReactNode,
  activePage: string,
  onNavigate: (page: string) => void,
  projectSelected: boolean
}) => {
  const { user, logout } = useAuth();

  // Menú global lateral
  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Inicio', id: 'inicio' },
    { icon: Settings, label: 'Configuración', id: 'settings' },
  ];

  // Menú contextual superior (solo si hay proyecto)
  const headerItems = projectSelected 
    ? [
        { icon: Settings, label: 'Parámetros', id: 'parametros' },
        { icon: ShieldAlert, label: 'Protecciones', id: 'protecciones' },
        { icon: BarChart3, label: 'TGBT', id: 'tgbt' },
        { icon: Box, label: 'Tableros Seccionales', id: 'tableros' },
        { icon: FileText, label: 'Conductores', id: 'conductores' },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Sidebar Global */}
      <aside className="w-64 bg-[var(--bg-secondary)] border-r border-slate-800 p-6 flex flex-col">
        <div className="flex items-center gap-2 text-[var(--accent)] mb-10 px-2">
          <Zap size={28} fill="currentColor" />
          <h1 className="text-2xl font-black tracking-tighter text-white font-sans uppercase">Check</h1>
        </div>
        <nav className="space-y-2 flex-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activePage === item.id 
                  ? 'bg-[var(--bg-primary)] text-white' 
                  : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-primary)]'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Contextual (Solo si hay proyecto) */}
        {projectSelected && (
          <header className="bg-[var(--bg-secondary)] border-b border-slate-800 p-4 flex items-center justify-between">
            <nav className="flex items-center gap-2">
              {headerItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    activePage === item.id 
                      ? 'bg-[var(--bg-primary)] text-white' 
                      : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-primary)]'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </header>
        )}

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
