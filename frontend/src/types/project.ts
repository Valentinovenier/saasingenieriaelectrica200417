export interface Trafo {
  potenciaKVA: number;
  tensionPrimaria: number;
  tensionSecundaria: number;
}

export interface Carga {
  id: string;
  nombre: string;
  potenciaKW: number;
}

export interface Tablero {
  id: string;
  nombre: string;
  cargas: Carga[];
}

export interface ProjectState {
  trafo: Trafo;
  tableros: Tablero[];
}
