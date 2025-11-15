//react chama a API do backend para consumir
import type { TipoComSubtipos, Barreira, TipoDeficiencia, SubtipoDeficiencia, Acessibilidade, Vaga, Candidato } from "../types";

// Define a URL base da API. Primeiro tenta pegar do arquivo .env (VITE_API_URL),
// caso não exista, usa "http://localhost:3000" como padrão.
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Função genérica http<T>, que faz uma requisição HTTP usando fetch
// e retorna o resultado já convertido em JSON do tipo T.
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  // Faz a requisição para BASE_URL + path
  //fetch é a busca ou envio dados para um servidor
  //path parametro que foi passado no metodo
  // attach auth token when present
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { "Content-Type": "application/json", ...(init?.headers || {}) } as Record<string,string>;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, { // linha 6 vai no backend e trás
    headers,
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let msg = text || res.statusText || "Erro na requisição";
    try {
      const j = JSON.parse(text);
      msg = j.error || msg;
    } catch {
      // Ignora erro de parsing do JSON, usa msg original
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

// Objeto api que organiza as funções para acessar o backend
export const api = {
  // Método para listar todos os tipos de deficiência
  listarTipos() {
    // Chama o endpoint GET /tipos e retorna uma lista de TipoDeficiencia[]
    console.log(http<TipoDeficiencia[]>("/tipos"))
    return http<TipoDeficiencia[]>("/tipos");
  },
  // Método para criar um novo tipo de deficiência
  criarTipo(nome: string) {
    // Faz um POST para /tipos com o body em JSON { nome }
    return http<TipoDeficiencia>("/tipos", {
      method: "POST",
      body: JSON.stringify({ nome }),
    });

  },
  // novos:
  // GET /subtipos → seu backend retorna Tipos com seus subtipos
  listarTiposComSubtipos(): Promise<TipoComSubtipos[]> {
    return http("/tipos/com-subtipos");
  },

  // POST /subtipos { nome, tipoId }
  criarSubtipo(nome: string, tipoId: number): Promise<SubtipoDeficiencia> {
    return http("/subtipos", {
      method: "POST",
      body: JSON.stringify({ nome, tipoId }),
    });
  },
  listarBarreiras(): Promise<Barreira[]> {
    return http("/barreiras");
  },
  criarBarreira(descricao: string): Promise<Barreira> {
    return http("/barreiras", {
      method: "POST",
      body: JSON.stringify({ descricao }),
    });
  },
  listarSubtipos(): Promise<SubtipoDeficiencia[]> {
    return http("/subtipos");
  },
  obterSubtipo(id: number) {
    return http(`/subtipos/${id}`);
  },
  vincularBarreirasASubtipo(subtipoId: number, barreiraIds: number[]) {
    return http(`/vinculos/subtipos/${subtipoId}/barreiras`, {
      method: "POST",
      body: JSON.stringify({ barreiraIds }),
    });
  },
  async listarEmpresas() {
    const res = await fetch("http://localhost:3000/empresas");
    if (!res.ok) throw new Error("Erro ao listar empresas");
    return res.json();
  },
  async buscarEmpresa(id: number) {
    const res = await fetch(`http://localhost:3000/empresas/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar empresa");
    return res.json();
  },
  async listarVagas(empresaId: number) {
    const res = await fetch(`http://localhost:3000/vagas/empresa/${empresaId}`);
    if (!res.ok) throw new Error("Erro ao listar vagas");
    return res.json();
  },
  async criarVaga(empresaId: number, titulo: string, descricao: string, escolaridade: string, cidade?: string, estado?: string) {
    const res = await fetch("http://localhost:3000/vagas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ empresaId, titulo, descricao, escolaridade, cidade, estado }),
    });
    if (!res.ok) throw new Error("Erro ao criar vaga");
    return res.json();
  },

  // Acessibilidades
  listarAcessibilidades(): Promise<Acessibilidade[]> {
    return http("/acessibilidades");
  },
  criarAcessibilidade(descricao: string): Promise<Acessibilidade> {
    return http("/acessibilidades", {
      method: "POST",
      body: JSON.stringify({ descricao }),
    });
  },
  vincularAcessibilidadesABarreira(barreiraId: number, acessibilidadeIds: number[]) {
    return http(`/barreiras/${barreiraId}/acessibilidades`, {
      method: "POST",
      body: JSON.stringify({ acessibilidadeIds }),
    });
  },
  
  vincularSubtiposAVaga(vagaId: number, subtipoIds: number[]) {
    return http(`/vagas/${vagaId}/subtipos`, {
      method: "POST",
      body: JSON.stringify({ subtipoIds }),
    });
  },
  vincularAcessibilidadesAVaga(vagaId: number, acessibilidadeIds: number[]) {
    return http(`/vagas/${vagaId}/acessibilidades`, {
      method: "POST",
      body: JSON.stringify({ acessibilidadeIds }),
    });
  },
  listarAcessibilidadesPossiveis(vagaId: number) {
    return http<Acessibilidade[]>(`/vagas/${vagaId}/acessibilidades-disponiveis`);
  },
  obterVaga(vagaId: number): Promise<Vaga> {
    return http(`/vagas/${vagaId}`);
  },
  obterVagaComSubtipos(vagaId: number): Promise<Vaga> {
    return http(`/vagas/${vagaId}`);
  },

  // --- Candidatos
  getCandidato(id: number) {
    return http<Candidato>(`/candidatos/${id}`);
  },

  // listar vagas compatíveis para um candidato (GET /match/:candidatoId)
  listarVagasCompativeis(candidatoId: number) {
    return http<Vaga[]>(`/match/${candidatoId}`);
  },

  // Avaliar empresa (POST /empresas/:id/avaliacoes)
  avaliarEmpresa(empresaId: number, nota: number, comentario?: string, anonimato?: boolean) {
    return http(`/empresas/${empresaId}/avaliacoes`, {
      method: 'POST',
      body: JSON.stringify({ nota, comentario, anonimato }),
    });
  },

  // Vagas salvas (favoritas)
  listarVagasSalvas(candidatoId: number) {
    return http<Vaga[]>(`/candidatos/${candidatoId}/salvas`);
  },

  salvarVaga(candidatoId: number, vagaId: number) {
    return http(`/candidatos/${candidatoId}/salvas/${vagaId}`, { method: 'POST' });
  },

  removerVagaSalva(candidatoId: number, vagaId: number) {
    return http(`/candidatos/${candidatoId}/salvas/${vagaId}`, { method: 'DELETE' });
  },

  // candidatar em uma vaga (POST /vagas/:id/candidatar { candidatoId })
  candidatarVaga(vagaId: number, candidatoId: number) {
    return http(`/vagas/${vagaId}/candidatar`, { method: 'POST', body: JSON.stringify({ candidatoId }) });
  },

  // Anunciar vaga (empresa)
  anunciarVaga(data: { empresaId: number; titulo?: string; descricao: string; escolaridade: string; cidade?: string; estado?: string }) {
    return http(`/vagas`, { method: 'POST', body: JSON.stringify(data) });
  },

  // Listar candidatos inscritos por vaga
  listarCandidatosPorVaga(vagaId: number) {
    return http(`/vagas/${vagaId}/candidatos`);
  },

  // Conteúdo estático / CMS-like
  getQuemSomos() {
    return http(`/conteudo/quem-somos`);
  },
  listarFAQ() {
    return http(`/faq/list`);
  },

  // registrar candidato (POST /candidatos)
  registerCandidato(data: { nome: string; cpf?: string; telefone?: string; email?: string; escolaridade?: string; senha: string }) {
    return http(`/candidatos`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // registrar empresa (POST /empresas)
  registerEmpresa(data: { nome: string; cnpj?: string; email?: string; telefone?: string; senha: string }) {
    return http(`/empresas`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // login (POST /auth/login) -> { identifier, senha, userType }
  login(identifier: string, senha: string, userType: string) {
    return http(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ identifier, senha, userType }),
    });
  },

  // retorna apenas os subtipos vinculados ao candidato
  listarSubtiposCandidato(id: number) {
    return http<SubtipoDeficiencia[]>(`/candidatos/${id}/subtipos`);
  },

  // retorna barreiras (achatadas) para um subtipo
  listarBarreirasPorSubtipo(subtipoId: number) {
    return http<Barreira[]>(`/subtipos/${subtipoId}/barreiras`);
  },

  // vincular subtipos ao candidato
  vincularSubtiposACandidato(candidatoId: number, subtipoIds: number[]) {
    return http(`/candidatos/${candidatoId}/subtipos`, {
      method: "POST",
      body: JSON.stringify({ subtipoIds }),
    });
  },

  // vincular barreiras (apenas para um subtipo específico) ao candidato
  vincularBarreirasACandidato(candidatoId: number, subtipoId: number, barreiraIds: number[]) {
    return http(`/candidatos/${candidatoId}/subtipos/${subtipoId}/barreiras`, {
      method: "POST",
      body: JSON.stringify({ barreiraIds }),
    });
  },


};

/* GET → buscar dados.

POST → enviar dados.

PUT/PATCH → atualizar dados.

DELETE → remover dados. */