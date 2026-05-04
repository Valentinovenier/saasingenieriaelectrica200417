import React from 'react';
import { LayoutDashboard, FileUp, Settings, Zap } from 'lucide-react';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <div className="flex items-center gap-2 text-yellow-400 mb-10">
          <Zap size={28} fill="currentColor" />
          <h1 className="text-xl font-bold">IngenieríaAuto</h1>
        </div>
        <nav className="space-y-4">
          <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-white">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-white">
            <FileUp size={20} /> Subir Plano
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-white">
            <Settings size={20} /> Configuración
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};
