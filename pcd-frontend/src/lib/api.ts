// Axios-based API client with auth interceptors
import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import type { TipoComSubtipos, Barreira, TipoDeficiencia, SubtipoDeficiencia, Acessibilidade, Vaga, Candidato } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function createInstance(): AxiosInstance {
  const instance = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } });

  // Request interceptor: attach token
  instance.interceptors.request.use((config) => {
    try {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`;
    } catch (e) {
      // ignore
    }
    return config;
  });

  // Response interceptor: handle 401 -> try refresh
  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as any;
      if (error.response && error.response.status === 401 && !original._retry) {
        original._retry = true;
        try {
          const refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('refreshToken') : null;
          if (!refreshToken) throw new Error('No refresh token');
          // Attempt refresh — backend must implement /auth/refresh
          const resp = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          const { token: newToken, refreshToken: newRefresh } = resp.data || {};
          if (newToken) {
            localStorage.setItem('token', newToken);
            if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
            if (original.headers) original.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(original);
          }
        } catch (refreshErr) {
          // refresh failed — clear tokens and fallthrough to reject
          try { localStorage.removeItem('token'); localStorage.removeItem('refreshToken'); } catch (e) {}
        }
      }
      return Promise.reject(mapAxiosError(error));
    }
  );

  return instance;
}

function mapAxiosError(err: AxiosError) {
  if (!err || !err.response) return err;
  const data = (err.response.data as any) || {};
  const message = data.error || data.message || err.message || 'Erro na requisição';
  const e = new Error(message) as Error & { status?: number };
  e.status = err.response.status;
  return e;
}

const axiosInstance = createInstance();

export const api = {
  // Tipos/Subtipos/Barreiras
  listarTipos() { return axiosInstance.get<TipoDeficiencia[]>('/tipos').then(r => r.data); },
  criarTipo(nome: string) { return axiosInstance.post<TipoDeficiencia>('/tipos', { nome }).then(r => r.data); },
  listarTiposComSubtipos() { return axiosInstance.get<TipoComSubtipos[]>('/tipos/com-subtipos').then(r => r.data); },
  criarSubtipo(nome: string, tipoId: number) { return axiosInstance.post<SubtipoDeficiencia>('/subtipos', { nome, tipoId }).then(r => r.data); },
  listarBarreiras() { return axiosInstance.get<Barreira[]>('/barreiras').then(r => r.data); },
  criarBarreira(descricao: string) { return axiosInstance.post<Barreira>('/barreiras', { descricao }).then(r => r.data); },
  listarSubtipos() { return axiosInstance.get<SubtipoDeficiencia[]>('/subtipos').then(r => r.data); },
  obterSubtipo(id: number) { return axiosInstance.get(`/subtipos/${id}`).then(r => r.data); },
  vincularBarreirasASubtipo(subtipoId: number, barreiraIds: number[]) { return axiosInstance.post(`/vinculos/subtipos/${subtipoId}/barreiras`, { barreiraIds }).then(r => r.data); },

  // Empresas / Vagas
  listarEmpresas() { return axiosInstance.get('/empresas').then(r => r.data); },
  buscarEmpresa(id: number) { return axiosInstance.get(`/empresas/${id}`).then(r => r.data); },
  listarVagas(empresaId: number) { return axiosInstance.get(`/vagas/empresa/${empresaId}`).then(r => r.data); },
  criarVaga(empresaId: number, titulo: string, descricao: string, escolaridade: string, cidade?: string, estado?: string) {
    return axiosInstance.post('/vagas', { empresaId, titulo, descricao, escolaridade, cidade, estado }).then(r => r.data);
  },

  // Acessibilidades
  listarAcessibilidades() { return axiosInstance.get<Acessibilidade[]>('/acessibilidades').then(r => r.data); },
  criarAcessibilidade(descricao: string) { return axiosInstance.post<Acessibilidade>('/acessibilidades', { descricao }).then(r => r.data); },
  vincularAcessibilidadesABarreira(barreiraId: number, acessibilidadeIds: number[]) { return axiosInstance.post(`/barreiras/${barreiraId}/acessibilidades`, { acessibilidadeIds }).then(r => r.data); },
  vincularSubtiposAVaga(vagaId: number, subtipoIds: number[]) { return axiosInstance.post(`/vagas/${vagaId}/subtipos`, { subtipoIds }).then(r => r.data); },
  vincularAcessibilidadesAVaga(vagaId: number, acessibilidadeIds: number[]) { return axiosInstance.post(`/vagas/${vagaId}/acessibilidades`, { acessibilidadeIds }).then(r => r.data); },
  listarAcessibilidadesPossiveis(vagaId: number) { return axiosInstance.get<Acessibilidade[]>(`/vagas/${vagaId}/acessibilidades-disponiveis`).then(r => r.data); },
  obterVaga(vagaId: number) { return axiosInstance.get<Vaga>(`/vagas/${vagaId}`).then(r => r.data); },

  // Candidatos
  getCandidato(id: number) { return axiosInstance.get<Candidato>(`/candidatos/${id}`).then(r => r.data); },
  listarVagasCompativeis(candidatoId: number) { return axiosInstance.get<Vaga[]>(`/match/${candidatoId}`).then(r => r.data); },

  avaliarEmpresa(empresaId: number, nota: number, comentario?: string, anonimato?: boolean) { return axiosInstance.post(`/empresas/${empresaId}/avaliacoes`, { nota, comentario, anonimato }).then(r => r.data); },

  // Vagas salvas
  listarVagasSalvas(candidatoId: number) { return axiosInstance.get<Vaga[]>(`/candidatos/${candidatoId}/salvas`).then(r => r.data); },
  salvarVaga(candidatoId: number, vagaId: number) { return axiosInstance.post(`/candidatos/${candidatoId}/salvas/${vagaId}`).then(r => r.data); },
  removerVagaSalva(candidatoId: number, vagaId: number) { return axiosInstance.delete(`/candidatos/${candidatoId}/salvas/${vagaId}`).then(r => r.data); },

  candidatarVaga(vagaId: number, candidatoId: number) { return axiosInstance.post(`/vagas/${vagaId}/candidatar`, { candidatoId }).then(r => r.data); },

  // Anunciar vaga
  anunciarVaga(data: { empresaId: number; titulo?: string; descricao: string; escolaridade: string; cidade?: string; estado?: string }) {
    return axiosInstance.post('/vagas', data).then(r => r.data);
  },

  listarCandidatosPorVaga(vagaId: number) { return axiosInstance.get(`/vagas/${vagaId}/candidatos`).then(r => r.data); },

  getQuemSomos() { return axiosInstance.get(`/conteudo/quem-somos`).then(r => r.data); },
  listarFAQ() { return axiosInstance.get(`/faq/list`).then(r => r.data); },

  registerCandidato(data: { nome: string; cpf?: string; telefone?: string; email?: string; escolaridade?: string; senha: string }) { return axiosInstance.post(`/candidatos`, data).then(r => r.data); },
  registerEmpresa(data: { nome: string; cnpj?: string; email?: string; telefone?: string; senha: string }) { return axiosInstance.post(`/empresas`, data).then(r => r.data); },
  login(identifier: string, senha: string, userType: string) { return axiosInstance.post(`/auth/login`, { identifier, senha, userType }).then(r => r.data); },

  listarSubtiposCandidato(id: number) { return axiosInstance.get<SubtipoDeficiencia[]>(`/candidatos/${id}/subtipos`).then(r => r.data); },
  listarBarreirasPorSubtipo(subtipoId: number) { return axiosInstance.get<Barreira[]>(`/subtipos/${subtipoId}/barreiras`).then(r => r.data); },
  vincularSubtiposACandidato(candidatoId: number, subtipoIds: number[]) { return axiosInstance.post(`/candidatos/${candidatoId}/subtipos`, { subtipoIds }).then(r => r.data); },
  vincularBarreirasACandidato(candidatoId: number, subtipoId: number, barreiraIds: number[]) { return axiosInstance.post(`/candidatos/${candidatoId}/subtipos/${subtipoId}/barreiras`, { barreiraIds }).then(r => r.data); },

};
