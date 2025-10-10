//react chama a API do backend para consumir
import type { TipoComSubtipos, Barreira, TipoDeficiencia, SubtipoDeficiencia, Acessibilidade, Vaga } from "../types";

// Define a URL base da API. Primeiro tenta pegar do arquivo .env (VITE_API_URL),
// caso não exista, usa "http://localhost:3000" como padrão.
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Função genérica http<T>, que faz uma requisição HTTP usando fetch
// e retorna o resultado já convertido em JSON do tipo T.
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  // Faz a requisição para BASE_URL + path
  //fetch é a busca ou envio dados para um servidor
  //path parametro que foi passado no metodo
  const res = await fetch(`${BASE_URL}${path}`, { // linha 6 vai no backend e trás
    // Adiciona headers padrão "Content-Type: application/json"
    // e permite sobrescrever ou adicionar outros headers via init
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
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
  vincularBarreirasASubtipo(subtipoId: number, barreiraIds: number[]) {
    return http(`/vinculos/subtipos/${subtipoId}/barreiras`, {
      method: "POST",
      body: JSON.stringify({ barreiraIds }),
    });
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
  async criarVaga(empresaId: number, descricao: string, escolaridade: string) {
    const res = await fetch("http://localhost:3000/vagas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ empresaId, descricao, escolaridade }),
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
  obterVaga(vagaId: number): Promise<Vaga> {
    return http(`/vagas/${vagaId}`);
  },


};

/* GET → buscar dados.

POST → enviar dados.

PUT/PATCH → atualizar dados.

DELETE → remover dados. */