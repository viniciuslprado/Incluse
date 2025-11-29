
import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import type { TipoComSubtipos, Barreira, TipoDeficiencia, SubtipoDeficiencia, Acessibilidade, Vaga, Candidato } from "../types";

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3000';

function createInstance(): AxiosInstance {
  const instance = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } });
  instance.interceptors.request.use((config) => {
    try {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      if (window && window.location && window.location.pathname.startsWith('/admin')) {
        console.log('[api.ts] Token enviado no header Authorization:', token);
      }
      if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`;
    } catch (e) {}
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as any;
      if (error.response && error.response.status === 401 && !original._retry) {
        original._retry = true;
        try {
          const refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('refreshToken') : null;
          if (!refreshToken) throw new Error('No refresh token');
          const resp = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          const { token: newToken, refreshToken: newRefresh } = resp.data || {};
          if (newToken) {
            localStorage.setItem('token', newToken);
            if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
            if (original.headers) original.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(original);
          }
        } catch (refreshErr) {
          try { localStorage.removeItem('token'); localStorage.removeItem('refreshToken'); } catch (e) {}
        }
      }
      return Promise.reject(mapAxiosError(error));
    }
  );

  return instance;
}

// ...existing code...

const axiosInstance = createInstance();

export const api = {
  // ...all methods as previously defined, starting from listarVagasPublicas, etc...
  listarVagasPublicas() { return axiosInstance.get('/vagas').then(r => r.data); },
  // ...rest of the api methods...
};

  listarCandidatosPorVaga(vagaId: number) { return axiosInstance.get(`/vagas/${vagaId}/candidatos`).then(r => r.data); },
  atualizarStatusCandidato(candidatoId: number, vagaId: number, status: string) { return axiosInstance.put(`/vagas/${vagaId}/candidatos/${candidatoId}/status`, { status }).then(r => r.data); },
  salvarAnotacoesCandidato(candidatoId: number, vagaId: number, anotacoes: string) { return axiosInstance.put(`/vagas/${vagaId}/candidatos/${candidatoId}/anotacoes`, { anotacoes }).then(r => r.data); },

  getQuemSomos() { return axiosInstance.get(`/conteudo/quem-somos`).then(r => r.data); },
  listarFAQ() { return axiosInstance.get(`/faq/list`).then(r => r.data); },

  registerCandidato(data: { nome: string; cpf?: string; telefone?: string; email?: string; escolaridade?: string; senha: string }) { return axiosInstance.post(`/candidatos`, data).then(r => r.data); },
  registerCandidatoWithFiles(formData: FormData) {
    return axios.post(`${BASE_URL}/candidatos`, formData).then(r => r.data);
  },
  requestPasswordReset(identifier: string) {
    return axiosInstance.post('/auth/forgot', { identifier }).then(r => r.data);
  },
  registerEmpresa(data: { nome: string; cnpj?: string; email?: string; telefone?: string; senha: string }) { return axiosInstance.post(`/empresa/cadastro`, data).then(r => r.data); },
  getEmpresaPerfil() { return axiosInstance.get(`/empresa/perfil`).then(r => r.data); },
  atualizarEmpresaAutenticada(data: any) { return axiosInstance.put(`/empresa/perfil`, data).then(r => r.data); },
  uploadLogoEmpresaAutenticada(formData: FormData) { return axiosInstance.post(`/empresa/logo`, formData).then(r => r.data); },
  atualizarEmpresa(id: number, data: any) { return axiosInstance.put(`/empresa/${id}`, data).then(r => r.data); },
  uploadLogoEmpresa(formData: FormData) { return axiosInstance.post(`/empresa/logo`, formData).then(r => r.data); },
  login(identifier: string, senha: string, userType: string) { return axiosInstance.post(`/auth/login`, { identifier, senha, userType }).then(r => r.data); },

  listarSubtiposCandidato(id: number) { return axiosInstance.get<SubtipoDeficiencia[]>(`/candidatos/${id}/subtipos`).then(r => r.data); },
  listarBarreirasPorSubtipo(subtipoId: number) { 
    if (!subtipoId || isNaN(subtipoId) || subtipoId <= 0) {
      return Promise.reject(new Error('ID de subtipo inválido'));
    }
    return axiosInstance.get<Barreira[]>(`/subtipos/${subtipoId}/barreiras`).then(r => r.data); 
  },
  vincularSubtiposACandidato(candidatoId: number, subtipoIds: number[]) { return axiosInstance.post(`/candidatos/${candidatoId}/subtipos`, { subtipoIds }).then(r => r.data); },
  vincularBarreirasACandidato(candidatoId: number, subtipoId: number, barreiraIds: number[]) { return axiosInstance.post(`/candidatos/${candidatoId}/subtipos/${subtipoId}/barreiras`, { barreiraIds }).then(r => r.data); },

  checkCpfExists(cpf: string) { return axiosInstance.get<{exists: boolean}>(`/candidatos/check-cpf/${encodeURIComponent(cpf)}`).then(r => r.data.exists); },
  checkCandidatoEmailExists(email: string) { return axiosInstance.get<{exists: boolean}>(`/candidatos/check-email/${encodeURIComponent(email)}`).then(r => r.data.exists); },
  checkCnpjExists(cnpj: string) { return axiosInstance.get<{exists: boolean}>(`/empresa/check-cnpj/${encodeURIComponent(cnpj)}`).then(r => r.data.exists); },
  checkEmpresaEmailExists(email: string) { return axiosInstance.get<{exists: boolean}>(`/empresa/check-email/${encodeURIComponent(email)}`).then(r => r.data.exists); },
  
  getDevToken(candidatoId: number) { return axiosInstance.post('/auth/dev-token', { candidatoId }).then(r => r.data); },
  
  listarNotificacoes(candidatoId: number, page = 1, limit = 20) { return axiosInstance.get(`/candidatos/${candidatoId}/notificacoes?page=${page}&limit=${limit}`).then(r => r.data); },
  marcarNotificacaoLida(candidatoId: number, notifId: number) { return axiosInstance.patch(`/candidatos/${candidatoId}/notificacoes/${notifId}/lida`).then(r => r.data); },
  marcarTodasNotificacoesLidas(candidatoId: number) { return axiosInstance.patch(`/candidatos/${candidatoId}/notificacoes/marcar-todas-lidas`).then(r => r.data); },

  obterConfiguracoes(candidatoId: number) { return axiosInstance.get(`/candidatos/${candidatoId}/configuracoes`).then(r => r.data); },
  atualizarConfiguracoes(candidatoId: number, config: any) { return axiosInstance.put(`/candidatos/${candidatoId}/configuracoes`, config).then(r => r.data); },

  alterarSenha(userId: number, userType: string, senhaAtual: string, novaSenha: string) {
    return axiosInstance.put('/auth/change-password', { userId, userType, senhaAtual, novaSenha }).then(r => r.data);
  },
  desativarContaCandidato(candidatoId: number) {
    return axiosInstance.patch(`/candidatos/${candidatoId}/desativar`).then(r => r.data);
  },
  excluirContaCandidato(candidatoId: number) {
    return axiosInstance.delete(`/candidatos/${candidatoId}`).then(r => r.data);
  },

  obterCurriculoBasico(candidatoId: number) { return axiosInstance.get(`/candidatos/${candidatoId}/curriculo`).then(r => r.data); },

  listarAreasFormacao() { return axiosInstance.get('/areas-formacao').then(r => r.data); },
  listarAreasFormacaoCandidato(candidatoId: number) { return axiosInstance.get(`/areas-formacao/candidato/${candidatoId}`).then(r => r.data); },
  vincularAreasFormacaoCandidato(candidatoId: number, areaIds: number[]) { return axiosInstance.post(`/areas-formacao/candidato/${candidatoId}`, { areaIds }).then(r => r.data); },

  getConfig(candidatoId: number) { return axiosInstance.get(`/candidatos/${candidatoId}/config`).then(r => r.data); },
  updateConfig(candidatoId: number, data: any) { return axiosInstance.put(`/candidatos/${candidatoId}/config`, data).then(r => r.data); },
  alterarSenhaCandidato(candidatoId: number, senhaAtual: string, novaSenha: string) { return axiosInstance.post(`/candidatos/${candidatoId}/alterar-senha`, { senhaAtual, novaSenha }).then(r => r.data); },
  aceitarTermos(candidatoId: number) { return axiosInstance.post(`/candidatos/${candidatoId}/aceitar-termos`).then(r => r.data); },
  desativarConta(candidatoId: number) { return axiosInstance.post(`/candidatos/${candidatoId}/desativar-conta`).then(r => r.data); },
  excluirConta(candidatoId: number, confirmar: string) { return axiosInstance.delete(`/candidatos/${candidatoId}/excluir-conta`, { data: { confirmar } }).then(r => r.data); },

  listarAdministradores() { return axiosInstance.get('/admin/usuarios').then(r => r.data); },
  criarAdministrador(data: { nome: string; email: string; senha: string }) { return axiosInstance.post('/admin/usuarios', data).then(r => r.data); },
  atualizarAdministrador(id: number, data: { nome?: string; email?: string; senha?: string }) { return axiosInstance.put(`/admin/usuarios/${id}`, data).then(r => r.data); },
  deletarAdministrador(id: number) { return axiosInstance.delete(`/admin/usuarios/${id}`).then(r => r.data); },
  obterAdministrador(id: number) { return axiosInstance.get(`/admin/usuarios/${id}`).then(r => r.data); },

  listarCandidaturas(candidatoId: number, status?: string, periodo?: string) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (periodo) params.append('periodo', periodo);
    return axiosInstance.get(`/candidaturas/candidato/${candidatoId}?${params.toString()}`).then(r => r.data);
  },
  obterDashboardCandidaturas(candidatoId: number) { return axiosInstance.get(`/candidaturas/candidato/${candidatoId}/dashboard`).then(r => r.data); },
  retirarCandidatura(vagaId: number, candidatoId: number) { return axiosInstance.delete(`/candidaturas/vaga/${vagaId}/candidato/${candidatoId}`).then(r => r.data); },
  verificarCandidatura(vagaId: number, candidatoId: number) { return axiosInstance.get(`/candidaturas/vaga/${vagaId}/candidato/${candidatoId}/verificar`).then(r => r.data.applied).catch(() => false); },

};

function mapAxiosError(err: AxiosError) {
  if (!err || !err.response) {
    if ((import.meta as any).env?.DEV) {
      console.error('Network or connection error:', err?.message);
    }
    return err;
  }
  const data = (err.response.data as any) || {};
  const message = data.error || data.message || err.message || 'Erro na requisição';
  const e = new Error(message) as Error & { status?: number; response?: any };
  e.status = err.response.status;
  e.response = err.response;
  
  if ((import.meta as any).env?.DEV && err.response.status !== 401 && err.response.status !== 403) {
    console.error(`API Error ${err.response.status}:`, message, data);
  }
  
  return e;
}

// ...existing code...
  atualizarBarreira(id: number, nome: string) { return axiosInstance.patch(`/admin/barreiras/${id}`, { nome }).then(r => r.data); },
  deletarBarreira(id: number) { return axiosInstance.delete(`/admin/barreiras/${id}`).then(r => r.data); },
  listarAcessibilidades() { return axiosInstance.get<Acessibilidade[]>('/admin/acessibilidades').then(r => r.data); },
  criarAcessibilidade(nome: string) { return axiosInstance.post<Acessibilidade>('/admin/acessibilidades', { nome }).then(r => r.data); },
  atualizarAcessibilidade(id: number, nome: string) { return axiosInstance.patch(`/admin/acessibilidades/${id}`, { nome }).then(r => r.data); },
  deletarAcessibilidade(id: number) { return axiosInstance.delete(`/admin/acessibilidades/${id}`).then(r => r.data); },
  listarEmpresas() { return axiosInstance.get('/empresa').then(r => r.data); },
  listarCandidatos() { return axiosInstance.get('/admin/candidatos').then(r => r.data); },
  listarVagas() { return axiosInstance.get('/admin/vagas').then(r => r.data); },
  buscarEmpresa(id: number) { return axiosInstance.get(`/empresa/${id}`).then(r => r.data); },
  listarVagasPorEmpresa(empresaId: number) { return axiosInstance.get(`/vagas/empresa/${empresaId}`).then(r => r.data); },
  criarVaga(empresaId: number, titulo: string, descricao: string, escolaridade: string, cidade?: string, estado?: string) {
    return axiosInstance.post('/vagas', { empresaId, titulo, descricao, escolaridade, cidade, estado }).then(r => r.data);
  },
  criarVagaCompleta(vagaData: any) { return axiosInstance.post('/vagas', vagaData).then(r => r.data); },
  atualizarVaga(vagaId: number, data: any) { return axiosInstance.put(`/vagas/${vagaId}`, data).then(r => r.data); },
  atualizarStatusVaga(vagaId: number, status: string) { return axiosInstance.patch(`/vagas/${vagaId}/status`, { status }).then(r => r.data); },
  excluirVaga(vagaId: number) { return axiosInstance.delete(`/vagas/${vagaId}`).then(r => r.status === 204); },

  vincularAcessibilidadesABarreira(barreiraId: number, acessibilidadeIds: number[]) { return axiosInstance.post(`/barreiras/${barreiraId}/acessibilidades`, { acessibilidadeIds }).then(r => r.data); },
  vincularSubtiposAVaga(vagaId: number, subtipoIds: number[]) { return axiosInstance.post(`/vagas/${vagaId}/subtipos`, { subtipoIds }).then(r => r.data); },
  vincularAcessibilidadesAVaga(vagaId: number, acessibilidadeIds: number[]) { return axiosInstance.post(`/vagas/${vagaId}/acessibilidades`, { acessibilidadeIds }).then(r => r.data); },
  listarAcessibilidadesPossiveis(vagaId: number) { return axiosInstance.get<Acessibilidade[]>(`/vagas/${vagaId}/acessibilidades-disponiveis`).then(r => r.data); },
  obterVaga(vagaId: number) { return axiosInstance.get<Vaga>(`/vagas/${vagaId}`).then(r => r.data); },


  getCandidato() { return axiosInstance.get<Candidato>(`/candidato/perfil`).then(r => r.data); },
  atualizarCandidato(data: any) { return axiosInstance.put(`/candidato/perfil`, data).then(r => r.data); },
  listarVagasCompativeis() { return axiosInstance.get<Vaga[]>(`/candidato/vagas-compativeis`).then(r => r.data); },
  calcularCompatibilidade(vagaId: number) { return axiosInstance.get(`/candidato/compatibilidade/${vagaId}`).then(r => r.data); },

  avaliarEmpresa(empresaId: number, nota: number, comentario?: string, anonimato?: boolean) { return axiosInstance.post(`/empresa/${empresaId}/avaliacoes`, { nota, comentario, anonimato }).then(r => r.data); },

  listarVagasFavoritas() { return axiosInstance.get<Vaga[]>(`/candidato/favoritos`).then(r => r.data); },
  favoritarVaga(vagaId: number) { return axiosInstance.post(`/candidato/favoritos/${vagaId}`).then(r => r.data); },
  desfavoritarVaga(vagaId: number) { return axiosInstance.delete(`/candidato/favoritos/${vagaId}`).then(r => r.data); },

  listarVagasSalvas() { return axiosInstance.get(`/candidato/vagas-salvas`).then(r => r.data); },
  salvarVaga(vagaId: number) { return axiosInstance.post(`/candidato/vagas-salvas/${vagaId}`).then(r => r.data); },
  removerVagaSalva(vagaId: number) { return axiosInstance.delete(`/candidato/vagas-salvas/${vagaId}`).then(r => r.data); },

  candidatarVaga(vagaId: number, candidatoId: number) { 
    return axiosInstance.post(`/vagas/${vagaId}/candidatar`, { candidatoId }).then(r => {
      window.dispatchEvent(new CustomEvent('candidaturaCreated'));
      return r.data;
    }); 
  },

  anunciarVaga(data: { empresaId: number; titulo?: string; descricao: string; escolaridade: string; cidade?: string; estado?: string }) {
    return axiosInstance.post('/vagas', data).then(r => r.data);
  },

  listarCandidatosPorVaga(vagaId: number) { return axiosInstance.get(`/vagas/${vagaId}/candidatos`).then(r => r.data); },
  atualizarStatusCandidato(candidatoId: number, vagaId: number, status: string) { return axiosInstance.put(`/vagas/${vagaId}/candidatos/${candidatoId}/status`, { status }).then(r => r.data); },
  salvarAnotacoesCandidato(candidatoId: number, vagaId: number, anotacoes: string) { return axiosInstance.put(`/vagas/${vagaId}/candidatos/${candidatoId}/anotacoes`, { anotacoes }).then(r => r.data); },

  getQuemSomos() { return axiosInstance.get(`/conteudo/quem-somos`).then(r => r.data); },
  listarFAQ() { return axiosInstance.get(`/faq/list`).then(r => r.data); },

  registerCandidato(data: { nome: string; cpf?: string; telefone?: string; email?: string; escolaridade?: string; senha: string }) { return axiosInstance.post(`/candidatos`, data).then(r => r.data); },
  registerCandidatoWithFiles(formData: FormData) {
    return axios.post(`${BASE_URL}/candidatos`, formData).then(r => r.data);
  },
  requestPasswordReset(identifier: string) {
    return axiosInstance.post('/auth/forgot', { identifier }).then(r => r.data);
  },
  registerEmpresa(data: { nome: string; cnpj?: string; email?: string; telefone?: string; senha: string }) { return axiosInstance.post(`/empresa/cadastro`, data).then(r => r.data); },
  getEmpresaPerfil() { return axiosInstance.get(`/empresa/perfil`).then(r => r.data); },
  atualizarEmpresaAutenticada(data: any) { return axiosInstance.put(`/empresa/perfil`, data).then(r => r.data); },
  uploadLogoEmpresaAutenticada(formData: FormData) { return axiosInstance.post(`/empresa/logo`, formData).then(r => r.data); },
  atualizarEmpresa(id: number, data: any) { return axiosInstance.put(`/empresa/${id}`, data).then(r => r.data); },
  uploadLogoEmpresa(formData: FormData) { return axiosInstance.post(`/empresa/logo`, formData).then(r => r.data); },
  login(identifier: string, senha: string, userType: string) { return axiosInstance.post(`/auth/login`, { identifier, senha, userType }).then(r => r.data); },

  listarSubtiposCandidato(id: number) { return axiosInstance.get<SubtipoDeficiencia[]>(`/candidatos/${id}/subtipos`).then(r => r.data); },
  listarBarreirasPorSubtipo(subtipoId: number) { 
    if (!subtipoId || isNaN(subtipoId) || subtipoId <= 0) {
      return Promise.reject(new Error('ID de subtipo inválido'));
    }
    return axiosInstance.get<Barreira[]>(`/subtipos/${subtipoId}/barreiras`).then(r => r.data); 
  },
  vincularSubtiposACandidato(candidatoId: number, subtipoIds: number[]) { return axiosInstance.post(`/candidatos/${candidatoId}/subtipos`, { subtipoIds }).then(r => r.data); },
  vincularBarreirasACandidato(candidatoId: number, subtipoId: number, barreiraIds: number[]) { return axiosInstance.post(`/candidatos/${candidatoId}/subtipos/${subtipoId}/barreiras`, { barreiraIds }).then(r => r.data); },

  checkCpfExists(cpf: string) { return axiosInstance.get<{exists: boolean}>(`/candidatos/check-cpf/${encodeURIComponent(cpf)}`).then(r => r.data.exists); },
  checkCandidatoEmailExists(email: string) { return axiosInstance.get<{exists: boolean}>(`/candidatos/check-email/${encodeURIComponent(email)}`).then(r => r.data.exists); },
  checkCnpjExists(cnpj: string) { return axiosInstance.get<{exists: boolean}>(`/empresa/check-cnpj/${encodeURIComponent(cnpj)}`).then(r => r.data.exists); },
  checkEmpresaEmailExists(email: string) { return axiosInstance.get<{exists: boolean}>(`/empresa/check-email/${encodeURIComponent(email)}`).then(r => r.data.exists); },
  
  getDevToken(candidatoId: number) { return axiosInstance.post('/auth/dev-token', { candidatoId }).then(r => r.data); },
  
  listarNotificacoes(candidatoId: number, page = 1, limit = 20) { return axiosInstance.get(`/candidatos/${candidatoId}/notificacoes?page=${page}&limit=${limit}`).then(r => r.data); },
  marcarNotificacaoLida(candidatoId: number, notifId: number) { return axiosInstance.patch(`/candidatos/${candidatoId}/notificacoes/${notifId}/lida`).then(r => r.data); },
  marcarTodasNotificacoesLidas(candidatoId: number) { return axiosInstance.patch(`/candidatos/${candidatoId}/notificacoes/marcar-todas-lidas`).then(r => r.data); },

  obterConfiguracoes(candidatoId: number) { return axiosInstance.get(`/candidatos/${candidatoId}/configuracoes`).then(r => r.data); },
  atualizarConfiguracoes(candidatoId: number, config: any) { return axiosInstance.put(`/candidatos/${candidatoId}/configuracoes`, config).then(r => r.data); },

  alterarSenha(userId: number, userType: string, senhaAtual: string, novaSenha: string) {
    return axiosInstance.put('/auth/change-password', { userId, userType, senhaAtual, novaSenha }).then(r => r.data);
  },
  desativarContaCandidato(candidatoId: number) {
    return axiosInstance.patch(`/candidatos/${candidatoId}/desativar`).then(r => r.data);
  },
  excluirContaCandidato(candidatoId: number) {
    return axiosInstance.delete(`/candidatos/${candidatoId}`).then(r => r.data);
  },

  obterCurriculoBasico(candidatoId: number) { return axiosInstance.get(`/candidatos/${candidatoId}/curriculo`).then(r => r.data); },

  listarAreasFormacao() { return axiosInstance.get('/areas-formacao').then(r => r.data); },
  listarAreasFormacaoCandidato(candidatoId: number) { return axiosInstance.get(`/areas-formacao/candidato/${candidatoId}`).then(r => r.data); },
  vincularAreasFormacaoCandidato(candidatoId: number, areaIds: number[]) { return axiosInstance.post(`/areas-formacao/candidato/${candidatoId}`, { areaIds }).then(r => r.data); },

  getConfig(candidatoId: number) { return axiosInstance.get(`/candidatos/${candidatoId}/config`).then(r => r.data); },
  updateConfig(candidatoId: number, data: any) { return axiosInstance.put(`/candidatos/${candidatoId}/config`, data).then(r => r.data); },
  alterarSenhaCandidato(candidatoId: number, senhaAtual: string, novaSenha: string) { return axiosInstance.post(`/candidatos/${candidatoId}/alterar-senha`, { senhaAtual, novaSenha }).then(r => r.data); },
  aceitarTermos(candidatoId: number) { return axiosInstance.post(`/candidatos/${candidatoId}/aceitar-termos`).then(r => r.data); },
  desativarConta(candidatoId: number) { return axiosInstance.post(`/candidatos/${candidatoId}/desativar-conta`).then(r => r.data); },
  excluirConta(candidatoId: number, confirmar: string) { return axiosInstance.delete(`/candidatos/${candidatoId}/excluir-conta`, { data: { confirmar } }).then(r => r.data); },

  listarAdministradores() { return axiosInstance.get('/admin/usuarios').then(r => r.data); },
  criarAdministrador(data: { nome: string; email: string; senha: string }) { return axiosInstance.post('/admin/usuarios', data).then(r => r.data); },
  atualizarAdministrador(id: number, data: { nome?: string; email?: string; senha?: string }) { return axiosInstance.put(`/admin/usuarios/${id}`, data).then(r => r.data); },
  deletarAdministrador(id: number) { return axiosInstance.delete(`/admin/usuarios/${id}`).then(r => r.data); },
  obterAdministrador(id: number) { return axiosInstance.get(`/admin/usuarios/${id}`).then(r => r.data); },

  listarCandidaturas(candidatoId: number, status?: string, periodo?: string) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (periodo) params.append('periodo', periodo);
    return axiosInstance.get(`/candidaturas/candidato/${candidatoId}?${params.toString()}`).then(r => r.data);
  },
  obterDashboardCandidaturas(candidatoId: number) { return axiosInstance.get(`/candidaturas/candidato/${candidatoId}/dashboard`).then(r => r.data); },
  retirarCandidatura(vagaId: number, candidatoId: number) { return axiosInstance.delete(`/candidaturas/vaga/${vagaId}/candidato/${candidatoId}`).then(r => r.data); },
  verificarCandidatura(vagaId: number, candidatoId: number) { return axiosInstance.get(`/candidaturas/vaga/${vagaId}/candidato/${candidatoId}/verificar`).then(r => r.data.applied).catch(() => false); },

};
