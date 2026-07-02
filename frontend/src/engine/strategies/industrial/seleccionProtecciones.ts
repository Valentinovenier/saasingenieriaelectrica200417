import { InterruptorAutomáticoAbierto, InterruptorAutomáticoCompacto } from '../../../types/protecciones';
import { catalogoCompletoInterruptoresAbiertos, catalogoCompletoInterruptoresCompactos } from '../../../data/index';

// Función para seleccionar el mejor interruptor automático abierto (TGBT cabecera)
export const seleccionarInterruptorAbierto = (
  InRequerida: number,
  IkCalculada: number, // kA
  IpicoCalculada: number, // kA
  t_apertura: number // segundos
): InterruptorAutomáticoAbierto | null => {
  
  // 1. Filtrar por In >= InRequerida
  const candidatos = catalogoCompletoInterruptoresAbiertos.filter(i => i.In >= InRequerida);

  // 2. Aplicar validaciones técnicas
  const interruptorValido = candidatos.find(i => {
    // a. Icu >= Ik (Poder de corte)
    const cumpleIcu = i.Icu >= IkCalculada;

    // b. Icw^2 * 1s >= Ik^2 * t_apertura (Solicitación térmica)
    // Usamos Ik en A para las potencias, por eso Ik (kA) * 1000
    const IkA = IkCalculada * 1000;
    const IcwA = i.Icw * 1000;
    const cumpleIcw = Math.pow(IcwA, 2) * 1 >= Math.pow(IkA, 2) * t_apertura;

    // c. Icm >= Ipico (Poder de cierre)
    const cumpleIcm = i.Icm >= IpicoCalculada;

    return cumpleIcu && cumpleIcw && cumpleIcm;
  });

  // 3. Retornar el primero que cumple (ordenado por In ascendente)
  return interruptorValido || null;
};

// Función para seleccionar el mejor interruptor automático compacto (Salidas o Seccionales)
export const seleccionarInterruptorCompacto = (
  InRequerida: number,
  IkCalculada: number, // kA
  marcaPreferida?: 'Schneider' | 'ABB'
): InterruptorAutomáticoCompacto | null => {
  let candidatos = catalogoCompletoInterruptoresCompactos.filter(i => i.In >= InRequerida && i.Icu >= IkCalculada);

  if (marcaPreferida) {
    const candidatosMarca = candidatos.filter(c => c.marca === marcaPreferida);
    if (candidatosMarca.length > 0) {
      candidatos = candidatosMarca;
    }
  }

  // Ordenar por In ascendente, y luego por menor Icu (económico/óptimo)
  candidatos.sort((a, b) => a.In - b.In || a.Icu - b.Icu);

  return candidatos[0] || null;
};
