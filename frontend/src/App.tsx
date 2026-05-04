import { DashboardLayout } from './layouts/DashboardLayout';
import { FileUpload } from './components/FileUpload';

export default function App() {
  return (
    <DashboardLayout>
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Subir Plano</h2>
        <p className="text-[var(--text-secondary)]">Cargá un archivo .dxf para iniciar el cálculo automático.</p>
      </header>

      <FileUpload />
      
      <section className="mt-12">
        <h3 className="text-xl font-semibold mb-6 text-white">Proyectos Recientes</h3>
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-slate-800 p-8 shadow-sm">
          <p className="text-[var(--text-secondary)]">No hay cálculos realizados todavía.</p>
        </div>
      </section>
    </DashboardLayout>
  );
}
