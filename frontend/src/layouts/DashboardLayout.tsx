import React from 'react';
import { LayoutDashboard, Settings, Zap, LogOut, FileText, BarChart3, Box } from 'lucide-react';
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
    { icon: Settings, label: 'Parámetros', id: 'parametros' },
    { icon: BarChart3, label: 'TGBT', id: 'tgbt' },
    { icon: Box, label: 'Tableros', id: 'tableros' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      {/* Header (Top Navigation) */}
      <header className="bg-[var(--bg-secondary)] border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[var(--accent)] px-2">
          <Zap size={28} fill="currentColor" />
          <h1 className="text-xl font-bold tracking-tight text-white">IngenieríaAuto</h1>
        </div>
        
        <nav className="flex items-center gap-2">
          {menuItems.map((item) => (
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

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1 bg-slate-800/50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <p className="text-sm font-medium text-white">{user?.username || 'Usuario'}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
