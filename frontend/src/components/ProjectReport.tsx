import { Project } from '../types/project';
import { getProjectStrategy } from '../engine/factory';

export const ProjectReport = ({ project }: { project: Project }) => {
  const handlePrint = () => window.print();
  const strategy = getProjectStrategy(project);
  const ReportComponent = strategy.getInformeComponente();

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-slate-800 space-y-6 print:bg-white print:text-black print:p-0 print:border-none">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4 print:hidden">
        <h2 className="text-2xl font-bold text-white">Informe Técnico: {project.name}</h2>
        <button
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
        >
          Imprimir / Exportar PDF
        </button>
      </div>

      <ReportComponent project={project} />
    </div>
  );
};

