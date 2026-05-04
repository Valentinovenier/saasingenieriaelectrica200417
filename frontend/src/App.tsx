import { DashboardLayout } from './layouts/DashboardLayout';
import { FileUpload } from './components/FileUpload';

export default function App() {
  return (
    <DashboardLayout>
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Subir Plano</h2>
        <p className="text-gray-600">Cargá un archivo .dxf para iniciar el cálculo automático.</p>
      </header>

      <FileUpload />
      
      <section className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Proyectos Recientes</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500">No hay cálculos realizados todavía.</p>
        </div>
      </section>
    </DashboardLayout>
  );
}
