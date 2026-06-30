import { Conductor, TipoConductor } from '../types/project';
import { getMetodosValidos } from '../engine/metodosProvider';
import { useProject } from '../context/ProjectDataContext';
import { calcularTramoResidencial } from '../engine/vivienda/calculador';

const FieldWrapper = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 ml-1">
      {label}
    </label>
    {children}
  </div>
);

export const ConductorForm = ({ label, conductor, onChange, tramoId }: { label: string, conductor?: Conductor, onChange: (c: Conductor) => void, tramoId?: string }) => {
  const { state: project } = useProject();
  const isVivienda = project?.projectType === 'Vivienda';

  const tipoCable = conductor?.tipoCable || 'Multipolar';
  const aislacion = conductor?.aislacion || 'PVC';
  const material = conductor?.material || 'Cobre';
  
  const metodosDisponibles = getMetodosValidos(aislacion as any, material as any, tipoCable);

  const handleDataChange = (newConductor: Conductor) => {
    // Si es vivienda, recalculamos automáticamente
    if (isVivienda && newConductor.longitud && newConductor.metodoInstalacion) {
        // Nota: Corriente diseño debería venir del conductor o tramo. Asumimos 16A como placeholder para la prueba.
        const corrienteDiseño = 16; 
        
        const resultado = calcularTramoResidencial({
            tipoCircuito: 'tomacorrientes_usos_generales',
            metodoInstalacion: newConductor.metodoInstalacion as any,
            longitudMetros: newConductor.longitud,
            corrienteDiseñoAmperes: corrienteDiseño,
            temperaturaAmbiente: project?.tempAmbiente || 30,
            canalizacionId: newConductor.canalizacionId
        }, project!);
        newConductor.resultadoCalculo = resultado;
        newConductor.seccion = resultado.seccionRecomendada;
    }
    onChange(newConductor);
  };

  return (
    <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-sm">
      <label className="text-xs font-medium text-slate-400 mb-4 block border-b border-slate-800 pb-2">
        {label} {isVivienda && <span className="text-[var(--accent)] ml-2">(Normativa Viviendas AEA-90364-7-770)</span>}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
        
        <FieldWrapper label="Tipo de Conductor">
          <select 
            className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors col-span-2"
            value={conductor?.tipo || 'Cable'}
            onChange={(e) => {
              const newTipo = e.target.value as TipoConductor;
              handleDataChange({
                ...conductor,
                tipo: newTipo,
                material: newTipo === 'Cable' ? (conductor?.material || 'Cobre') : undefined,
                aislacion: newTipo === 'Cable' ? (conductor?.aislacion || 'PVC') : undefined,
                seccion: undefined, 
                metodoInstalacion: undefined, 
                tipoCable: 'Multipolar', 
                longitud: conductor?.longitud || 0,
              } as Conductor);
            }}
          >
            <option value="Cable">Cable</option>
          </select>
        </FieldWrapper>

        {(!conductor?.tipo || conductor.tipo === 'Cable') && (
          <>
            <FieldWrapper label="Material">
              <select 
                className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors"
                value={material}
                onChange={(e) => {
                  handleDataChange({
                    ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                    material: e.target.value as any,
                    metodoInstalacion: undefined
                  });
                }}
              >
                <option value="Cobre">Cobre</option>
                <option value="Aluminio">Aluminio</option>
              </select>
            </FieldWrapper>

            <FieldWrapper label="Aislamiento">
              <select 
                className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors"
                value={aislacion}
                onChange={(e) => {
                  handleDataChange({
                    ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                    aislacion: e.target.value as any,
                    metodoInstalacion: undefined
                  });
                }}
              >
                <option value="PVC">PVC</option>
                <option value="XLPE">XLPE</option>
                <option value="Mineral">Mineral</option>
              </select>
            </FieldWrapper>

            <FieldWrapper label="Tipo de Cable">
              <select
                className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors"
                value={tipoCable}
                onChange={(e) => {
                  handleDataChange({
                    ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                    tipoCable: e.target.value as any,
                    metodoInstalacion: undefined, // Resetear método ya que depende de Unipolar/Multipolar
                    disposicion: e.target.value === 'Unipolar' ? 'trebol' : undefined
                  });
                }}
              >
                <option value="Multipolar">Multipolar</option>
                <option value="Unipolar">Unipolar</option>
              </select>
            </FieldWrapper>

            {tipoCable === 'Unipolar' && (
              <FieldWrapper label="Disposición">
                <select
                  className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors"
                  value={conductor?.disposicion || 'trebol'}
                  onChange={(e) => {
                    handleDataChange({
                      ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                      disposicion: e.target.value as any
                    });
                  }}
                >
                  <option value="trebol">Trébol</option>
                  <option value="contacto">En contacto plano</option>
                  {conductor?.metodoInstalacion === 'G' && <option value="separado">Separado 1D</option>}
                </select>
              </FieldWrapper>
            )}

            {tipoCable === 'Unipolar' && conductor?.metodoInstalacion === 'G' && conductor?.disposicion === 'separado' && (
              <FieldWrapper label="Plano Disposición">
                <select
                  className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors"
                  value={conductor?.plano || 'horizontal'}
                  onChange={(e) => {
                    handleDataChange({
                      ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                      plano: e.target.value as any
                    });
                  }}
                >
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
              </FieldWrapper>
            )}

            <FieldWrapper label="Método de Instalación">
              <select 
                className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors col-span-2"
                value={conductor?.metodoInstalacion || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  handleDataChange({ 
                    ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', longitud: 0 }),
                    metodoInstalacion: val,
                    // Si cambia a G, asegurar disposición 'separado' o resetear plano
                    disposicion: val === 'G' ? 'separado' : (tipoCable === 'Unipolar' ? 'trebol' : undefined)
                  });
                }}
              >
                <option value="">Selecciona Método</option>
                {metodosDisponibles.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </FieldWrapper>
            
            <FieldWrapper label="Longitud del Tramo (m)">
              <input 
                type="number" 
                placeholder="0" 
                className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors col-span-2"
                value={conductor?.longitud || ''}
                onChange={(e) => handleDataChange({ 
                  ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', seccion: 0, longitud: 0 }),
                  longitud: parseInt(e.target.value) || 0
                })}
              />
            </FieldWrapper>

            <FieldWrapper label="Canalización">
              <select 
                className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors col-span-2"
                value={conductor?.canalizacionId || ''}
                onChange={(e) => handleDataChange({ 
                  ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', seccion: 0, longitud: 0 }),
                  canalizacionId: e.target.value
                })}
              >
                <option value="">Selecciona Canalización</option>
                {project?.canalizaciones?.map((can) => (
                  <option key={can.id} value={can.id}>{can.nombre}</option>
                ))}
              </select>
            </FieldWrapper>

            <FieldWrapper label="Caída de Tensión Máx (%)">
              <input 
                type="number" 
                step="0.1"
                placeholder="3" 
                className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors col-span-2"
                value={conductor?.caidaMaxPermitida || 3}
                onChange={(e) => handleDataChange({ 
                  ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', seccion: 0, longitud: 0 }),
                  caidaMaxPermitida: parseFloat(e.target.value) || 3
                })}
              />
            </FieldWrapper>

            {tramoId === 'trafo-tgbt' && (
              <FieldWrapper label="Tiempo Apertura MT (seg)">
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.1" 
                  className="bg-slate-950 text-white text-sm rounded-lg p-2.5 border border-slate-700 hover:border-slate-500 transition-colors col-span-2"
                  value={conductor?.tiempoAperturaMT || 0.1}
                  onChange={(e) => handleDataChange({ 
                    ...(conductor || { tipo: 'Cable', material: 'Cobre', aislacion: 'PVC', seccion: 0, longitud: 0 }),
                    tiempoAperturaMT: parseFloat(e.target.value) || 0.1
                  })}
                />
              </FieldWrapper>
            )}

            {conductor?.resultadoCalculo && (
              <div className="col-span-2 p-3 bg-slate-800 rounded-lg text-xs text-slate-300">
                {conductor.resultadoCalculo.seccionRecomendada ? (
                  <>
                    <p><strong>Sección Recomendada:</strong> {conductor.resultadoCalculo.seccionRecomendada} mm²</p>
                    <p><strong>Caída de Tensión:</strong> {conductor.resultadoCalculo.caidaTensionPorcentaje?.toFixed(2)} %</p>
                    {conductor.resultadoCalculo.advertencias && (
                        <p className="text-red-400 mt-2">{conductor.resultadoCalculo.advertencias[0]}</p>
                    )}
                  </>
                ) : (
                  <>
                    <p><strong>Sección:</strong> {conductor.resultadoCalculo.cable?.seccion} mm²</p>
                    <p><strong>Caída de Tensión:</strong> {conductor.resultadoCalculo.porcentajeCaida?.toFixed(2)} %</p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
