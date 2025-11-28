// Valores padronizados para escolaridade, alinhados com o backend
export type Escolaridade =
  | 'Ensino Fundamental Completo'
  | 'Ensino Fundamental Incompleto'
  | 'Ensino Médio Completo'
  | 'Ensino Médio Incompleto'
  | 'Ensino Superior Completo'
  | 'Ensino Superior Incompleto'
  | 'Técnico'
  | 'Pós-graduação'
  | 'Mestrado'
  | 'Doutorado';
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
  email?: string;
  cnpj?: string;
  senhaHash?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
export type Vaga = {
  id: number;
  titulo?: string;
  descricao: string;
  escolaridade?: Escolaridade;
  cidade?: string;
  estado?: string;
  empresaId: number;
  status?: 'ativa' | 'pausada' | 'encerrada';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  tipoContratacao?: string; // CLT, PJ, Estágio, etc
  modeloTrabalho?: string; // Remoto, Presencial, Híbrido
  localizacao?: string;
  area?: string;
  exigeMudanca?: boolean;
  exigeViagens?: boolean;
  empresa?: Empresa;
  descricaoVaga?: {
    resumo?: string;
    atividades?: string;
    jornada?: string;
    salarioMin?: number;
    salarioMax?: number;
  };
  requisitos?: {
    formacao?: string;
    experiencia?: string;
    competencias?: string;
    habilidadesTecnicas?: string;
  };
  beneficios?: Array<{ id: number; vagaId: number; descricao: string }>;
  processos?: Array<{ id: number; vagaId: number; etapa: string; ordem: number }>;
  acessibilidades?: Array<{ 
    acessibilidadeId?: number; 
    acessibilidade?: { id: number; descricao: string } 
  }>;
  subtipos?: SubtipoDeficiencia[];
  candidaturas?: any[];
  vagasSalvas?: any[];
  favoritos?: any[];
  notificacoes?: any[];
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
  escolaridade: Escolaridade;
  curso?: string;
  situacao?: 'concluido' | 'cursando';
  cidade?: string;
  estado?: string;
  disponibilidadeGeografica?: string;
  aceitaMudanca?: boolean;
  aceitaViajar?: boolean;
  pretensaoSalarialMin?: number;
  cpf?: string;
  senhaHash?: string;
  curriculo?: string;
  laudo?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  subtipos?: CandidatoSubtipo[];
  barras?: any[];
  candidaturas?: any[];
  vagasSalvas?: any[];
  favoritos?: any[];
  configuracoes?: any;
  notificacoes?: any[];
  experiencias?: CandidatoExperiencia[];
  formacoes?: CandidatoFormacao[];
  cursos?: CandidatoCurso[];
  competencias?: CandidatoCompetencia[];
  idiomas?: CandidatoIdioma[];
  areasFormacao?: any[];
};

// Tipos para Currículo
export type CandidatoExperiencia = {
  id?: number;
  candidatoId?: number;
  cargo: string;
  empresa: string;
  dataInicio: string;
  dataTermino?: string | null;
  atualmenteTrabalha: boolean;
  descricao?: string;
};

  id?: number;
  candidatoId?: number;
  escolaridade: Escolaridade;
  instituicao?: string;
  curso?: string;
  situacao?: 'concluido' | 'cursando';
  inicio?: string;
  termino?: string | null;
  anoConclusao?: string;
};

export type CandidatoCurso = {
  id?: number;
  candidatoId?: number;
  nome: string;
  instituicao: string;
  cargaHoraria?: number;
  certificado?: string;
};

export type CandidatoCompetencia = {
  id?: number;
  candidatoId?: number;
  tipo: 'Hard skill' | 'Soft skill';
  nome: string;
  nivel: 'Básico' | 'Intermediário' | 'Avançado';
};

export type CandidatoIdioma = {
  id?: number;
  candidatoId?: number;
  idioma: string;
  nivel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Básico' | 'Intermediário' | 'Avançado' | 'Fluente';
  certificado?: string;
};

export type CurriculoBasico = {
  experiencias: CandidatoExperiencia[];
  formacoes: CandidatoFormacao[];
  cursos: CandidatoCurso[];
  competencias: CandidatoCompetencia[];
  idiomas: CandidatoIdioma[];
};

