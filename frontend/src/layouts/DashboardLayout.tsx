import React from 'react';
import { LayoutDashboard, FileUp, Settings, Zap, Sliders } from 'lucide-react';

export const DashboardLayout = ({ 
  children, 
  activePage, 
  onNavigate 
}: { 
  children: React.ReactNode,
  activePage: string,
  onNavigate: (page: string) => void
}) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: FileUp, label: 'Subir Plano', id: 'upload' },
    { icon: Sliders, label: 'Criterios', id: 'criteria' },
    { icon: Settings, label: 'Configuración', id: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--bg-secondary)] border-r border-slate-800 p-6 flex flex-col backdrop-blur-md">
        <div className="flex items-center gap-2 text-[var(--accent)] mb-10 px-2">
          <Zap size={28} fill="currentColor" />
          <h1 className="text-xl font-bold tracking-tight text-white">IngenieríaAuto</h1>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
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

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
