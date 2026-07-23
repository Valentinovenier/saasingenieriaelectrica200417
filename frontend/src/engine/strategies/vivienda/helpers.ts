import { Project, Conductor, Proteccion } from '../../../types/project';

/**
 * Obtiene la protección asignada a un tablero o circuito terminal dentro del proyecto.
 */
export const obtenerProteccionAsignada = (
  project: Project | null | undefined,
  conductor?: Conductor,
  tramoId?: string,
  tableroOrigenId?: string
): Proteccion | undefined => {
  if (!project) return undefined;

  const targetId = (conductor as any)?.destinoId || tramoId;
  const tipoTramo = conductor?.tipoTramo;
  const isPanelTramo = ['LineaPrincipal', 'LineaSeccional'].includes(tipoTramo || '');

  // 1. Caso Circuito Terminal (o tramoId correspondiente a circuito)
  if (!isPanelTramo && targetId && targetId !== 'int-general-salida') {
    const circVivienda = project.datosVivienda?.circuitosCalculados?.find(c => c.id === targetId);
    if (circVivienda?.proteccion) {
      return circVivienda.proteccion;
    }

    const allTablerosInd = [project.tableroPrincipal, ...(project.tableros || [])].filter(Boolean);
    for (const t of allTablerosInd) {
      const ct = t?.circuitosTerminales?.find(c => c.id === targetId);
      if (ct?.proteccion) {
        return ct.proteccion;
      }
    }
  }

  // 2. Caso Línea Principal o Línea Seccional (Tableros)
  const tablerosVivienda = project.datosVivienda?.tableros || [];
  const tablerosInd = [project.tableroPrincipal, ...(project.tableros || [])].filter(Boolean);

  let tableroEncontrado: any = undefined;

  if (targetId && targetId !== 'int-general-salida') {
    tableroEncontrado = tablerosVivienda.find(t => t.id === targetId) ||
                        tablerosInd.find(t => t.id === targetId);
  }

  if (!tableroEncontrado && (tipoTramo === 'LineaPrincipal' || targetId === 'int-general-salida' || !targetId)) {
    if (tableroOrigenId) {
      tableroEncontrado = tablerosVivienda.find(t => t.id === tableroOrigenId) ||
                          tablerosInd.find(t => t.id === tableroOrigenId);
    }
    if (!tableroEncontrado) {
      tableroEncontrado = tablerosVivienda.find(t => t.tipo === 'Principal') || project.tableroPrincipal;
    }
  }

  if (tableroEncontrado) {
    return tableroEncontrado.proteccionCabecera || tableroEncontrado.proteccionDiferencial;
  }

  return undefined;
};
