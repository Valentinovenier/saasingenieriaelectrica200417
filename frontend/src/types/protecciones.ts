export interface InterruptorAutomáticoAbierto {
  id: string;
  marca: string;
  serie: string;
  modelo: string;
  In: number;          // Corriente nominal máxima (A)
  Icu: number;         // Poder de corte último (kA) a 220/415V
  Icw: number;         // Corriente de corta duración admisible (kA/1s)
  Icm: number;         // Poder de cierre nominal (kA) a 220/415V
}

export interface InterruptorAutomáticoCompacto {
  id: string;
  marca: string;
  serie: string;
  modelo: string;
  In: number;          // Corriente nominal (A)
  Icu: number;         // Poder de corte último (kA)
  Icm?: number;        // Poder de cierre nominal (kA)
  claseLimitacionEnergia?: number; // 1, 2 o 3
}
