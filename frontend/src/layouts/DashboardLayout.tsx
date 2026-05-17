import React from 'react';
import { LayoutDashboard, FileUp, Settings, Zap, Sliders, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout = ({ 
  children, 
  activePage, 
  onNavigate 
}: { 
  children: React.ReactNode,
  activePage: string,
  onNavigate: (page: string) => void
}) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Inicio', id: 'inicio' },
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
        <nav className="space-y-2 flex-1">
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

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-slate-800/50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.username || 'Usuario'}</p>
              <p className="text-xs text-[var(--text-secondary)] truncate">Cuenta Activa</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
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
