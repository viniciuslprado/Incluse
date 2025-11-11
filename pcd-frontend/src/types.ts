export type TipoDeficiencia = {
  id: number;
  nome: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SubtipoDeficiencia = {
  id: number;
  nome: string;
  tipoId: number;
  createdAt?: string;
  updatedAt?: string;
};

// útil para listar: cada tipo com seus subtipos
export type TipoComSubtipos = TipoDeficiencia & {
  subtipos: SubtipoDeficiencia[];
};

export type Barreira = {
  id: number;
  descricao: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Acessibilidade = {
  id: number;
  descricao: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Empresa = {
  id: number;
  nome: string;
  cnpj?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
};
export type Vaga = {
  id: number;
  titulo?: string;
  descricao: string;
  escolaridade: string;
  cidade?: string;
  estado?: string;
  empresaId: number;
  empresa?: {
    id: number;
    nome: string;
  };
  subtipos?: SubtipoDeficiencia[];
  createdAt?: string;
  updatedAt?: string;
};

// Tipos para Candidato e associação com subtipos/barreiras
export type CandidatoSubtipoBarreira = {
  barreiraId: number;
  barreira: Barreira;
};

export type CandidatoSubtipo = {
  subtipoId: number;
  subtipo: SubtipoDeficiencia;
  barreiras?: CandidatoSubtipoBarreira[];
};

export type Candidato = {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  escolaridade: string;
  subtipos?: CandidatoSubtipo[];
};

