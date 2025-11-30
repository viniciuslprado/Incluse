


import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { AxiosInstance } from 'axios';

// Objeto da API

const BASE_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:3000';

// Função auxiliar para mapear erros
function mapAxiosError(err: AxiosError) {
  if (!err || !err.response) {
    if (import.meta.env?.DEV) {
      console.error('Network or connection error:', err?.message);
    }
    // Retorna um erro genérico se não houver resposta
    return new Error(err?.message || 'Erro de conexão');
  }

  const data = (err.response.data as any) || {};
  const message = data.error || data.message || err.message || 'Erro na requisição';
  
  // Cria um erro estendido
  const e = new Error(message) as Error & { status?: number; response?: any };
  e.status = err.response.status;
  e.response = err.response;

  // Log apenas em DEV e se não for erro de auth (401/403 poluem o console)
  if (import.meta.env?.DEV && err.response.status !== 401 && err.response.status !== 403) {
    console.error(`API Error ${err.response.status}:`, message, data);
  }

  return e;
}

function createInstance(): AxiosInstance {
  const instance = axios.create({ 
    baseURL: BASE_URL, 
    headers: { 'Content-Type': 'application/json' } 
  });

  // --- REQUEST INTERCEPTOR ---
  instance.interceptors.request.use((config) => {
    try {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      
      // Log de debug para admin (apenas em DEV para segurança)
      if (import.meta.env?.DEV && window?.location?.pathname?.startsWith('/admin')) {
        console.log('[api.ts] Token enviado no header Authorization:', token ? 'Presente' : 'Ausente');
      }

      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      // Ignora erros de localStorage
    }
    return config;
  }, (error) => Promise.reject(error));

  // --- RESPONSE INTERCEPTOR ---
  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Se erro for 401 (Unauthorized) e ainda não tentamos reconectar
      if (error.response?.status === 401 && original && !original._retry) {
        original._retry = true;

        try {
          const refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('refreshToken') : null;
          
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Tenta renovar o token
          // Nota: Usamos axios.post direto para evitar cair no interceptor da instância e criar loop
          const resp = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          
          const { token: newToken, refreshToken: newRefresh } = resp.data || {};

          if (newToken) {
            localStorage.setItem('token', newToken);
            if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
            
            // Atualiza o header da requisição original e refaz a chamada
            if (original.headers) {
              original.headers['Authorization'] = `Bearer ${newToken}`;
            }
            
            return instance(original);
          }
        } catch (refreshErr) {
          // Se falhar o refresh (ex: token expirado), limpa tudo e força logout
          try {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            // Opcional: Redirecionar para login
            // window.location.href = '/login'; 
          } catch (e) {}
        }
      }

      return Promise.reject(mapAxiosError(error));
    }
  );

  return instance;
}

const axiosInstance = createInstance();

// Objeto da API
export const api = {
  deletarBarreira(id: number) { return axiosInstance.delete(`/barreiras/${id}`).then(r => r.data); },
  deletarAcessibilidade(id: number) { return axiosInstance.delete(`/acessibilidades/${id}`).then(r => r.data); },
  deletarSubtipo(id: number) { return axiosInstance.delete(`/subtipos/${id}`).then(r => r.data); },
  listarLogsAdmin(params?: { page?: number; limit?: number; tipo?: string }) {
    return axiosInstance.get('/admin/logs', { params }).then(r => r.data);
  },
  // --- CRIAÇÃO DE RECURSOS ---
  criarTipo(nome: string) { return axiosInstance.post('/tipos', { nome }).then(r => r.data); },
  criarSubtipo(tipoId: number, nome: string) { return axiosInstance.post('/subtipos', { tipoId, nome }).then(r => r.data); },
  criarBarreira(subtipoId: number, descricao: string) { return axiosInstance.post('/barreiras', { subtipoId, descricao }).then(r => r.data); },
  criarAcessibilidade(barreiraId: number, descricao: string) { return axiosInstance.post('/acessibilidades', { barreiraId, descricao }).then(r => r.data); },
  criarTipo(nome: string) { return axiosInstance.post('/tipos', { nome }).then(r => r.data); },
            atualizarSubtipo(id: number, nome: string) { return axiosInstance.put(`/subtipos/${id}`, { nome }).then(r => r.data); },
            atualizarBarreira(id: number, descricao: string) { return axiosInstance.put(`/barreiras/${id}`, { descricao }).then(r => r.data); },
            atualizarAcessibilidade(id: number, descricao: string) { return axiosInstance.put(`/acessibilidades/${id}`, { descricao }).then(r => r.data); },
          atualizarTipo(id: number, nome: string) { return axiosInstance.put(`/tipos/${id}`, { nome }).then(r => r.data); },
        listarAcessibilidadesPorBarreira(barreiraId: number) { return axiosInstance.get(`/barreiras/${barreiraId}/acessibilidades`).then(r => r.data); },
      listarBarreiras() { return axiosInstance.get('/barreiras').then(r => r.data); },
    getConfig(candidatoId: number) {
      return axiosInstance.get(`/candidato/${candidatoId}/config`).then(r => r.data);
    },
    updateConfig(candidatoId: number, data: any) {
      return axiosInstance.put(`/candidato/${candidatoId}/config`, data).then(r => r.data);
    },
  // --- PÚBLICO E UTILITÁRIOS ---
  listarTiposPublicos() { return axiosInstance.get('/tipos').then(r => r.data); },
  listarTipos() { return axiosInstance.get('/tipos').then(r => r.data); },
  listarSubtiposPorTipo(tipoId: number) { return axiosInstance.get(`/tipos/${tipoId}/subtipos`).then(r => r.data); },
  listarAcessibilidadesPublicas() { return axiosInstance.get('/acessibilidades').then(r => r.data); },
  listarEmpresas() { return axiosInstance.get('/admin/empresas').then(r => r.data); },
  listarVagasPublicas() { return axiosInstance.get('/vagas').then(r => r.data); },
  requestPasswordReset(identifier: string) { return axiosInstance.post('/auth/request-password-reset', { identifier }).then(r => r.data); },
  listarAreasFormacao() { return axiosInstance.get('/areas-formacao').then(r => r.data); },
  listarSubtiposCandidato(candidatoId: number) { return axiosInstance.get(`/candidato/${candidatoId}/subtipos`).then(r => r.data); },
  listarBarreirasPorSubtipo(subtipoId: number) { return axiosInstance.get(`/subtipos/${subtipoId}/barreiras`).then(r => r.data); },
  async getLaudo(id: number) {
    // Primeiro busca a URL do laudo
    const res = await axiosInstance.get(`/candidato/${id}/laudo`);
    const laudoUrl = res.data?.laudo;
    if (!laudoUrl) throw new Error('Laudo não encontrado');
    // Agora faz o download do arquivo
    // Se a URL for relativa, ajusta para o baseURL
    const url = laudoUrl.startsWith('http') ? laudoUrl : `${BASE_URL}${laudoUrl}`;
    const fileRes = await axios.get(url, { responseType: 'blob' });
    return fileRes;
  },
  getDevToken(id: number) { return axiosInstance.post(`/candidato/${id}/dev-auth`).then(r => r.data); },
  listarAreasFormacaoCandidato(id: number) { return axiosInstance.get(`/candidato/${id}/areas-formacao`).then(r => r.data); },
  vincularAreasFormacaoCandidato(id: number, areas: number[]) { return axiosInstance.post(`/candidato/${id}/areas-formacao`, { areas }).then(r => r.data); },
  uploadLaudo(id: number, file: File) {
    const formData = new FormData();
    formData.append('laudo', file);
    return axiosInstance.post(`/candidato/${id}/laudo`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },
  deleteLaudo(id: number) { return axiosInstance.delete(`/candidato/${id}/laudo`).then(r => r.data); },
  obterCurriculoBasico(id: number) { return axiosInstance.get(`/candidato/${id}/curriculo`).then(r => r.data); },
  buscarEmpresa(id: number) { return axiosInstance.get(`/empresa/${id}`).then(r => r.data); },
  getEmpresaPerfil() { return axiosInstance.get('/empresa/me').then(r => r.data); },
  uploadLogoEmpresaAutenticada(formData: FormData) { return axiosInstance.post('/empresas/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data); },
  atualizarEmpresaAutenticada(empresa: any) { return axiosInstance.put('/empresa/update', empresa).then(r => r.data); },
  alterarSenha(userId: number, userType: string, senhaAtual: string, novaSenha: string) {
    return axiosInstance.post('/auth/alterar-senha', { userId, userType, senhaAtual, novaSenha }).then(r => r.data);
  },
  listarVagasPorEmpresa(empresaId: number) { return axiosInstance.get(`/vagas/empresa/${empresaId}/vagas`).then(r => r.data); },
  duplicarVaga(vagaId: number) { return axiosInstance.post(`/vagas/${vagaId}/duplicar`).then(r => r.data); },
  listarTiposComSubtiposPublico() { return axiosInstance.get('/tipos/com-subtipos').then(r => r.data); },

  // --- VAGAS ---
  criarVagaCompleta(vagaData: any) { return axiosInstance.post('/vagas', vagaData).then(r => r.data); },
  atualizarVaga(vagaId: number, data: any) { return axiosInstance.put(`/vagas/${vagaId}`, data).then(r => r.data); },
  atualizarStatusVaga(vagaId: number, status: string) { return axiosInstance.patch(`/vagas/${vagaId}/status`, { status }).then(r => r.data); },
  excluirVaga(vagaId: number) { return axiosInstance.delete(`/vagas/${vagaId}`).then(r => r.status === 204); },
  anunciarVaga(data: { empresaId: number; titulo?: string; descricao: string; escolaridade: string; cidade?: string; estado?: string }) {
    return axiosInstance.post('/vagas', data).then(r => r.data);
  },
  listarCandidatosPorVaga(vagaId: number) { return axiosInstance.get(`/vagas/${vagaId}/candidatos`).then(r => r.data); },
  atualizarStatusCandidato(candidatoId: number, vagaId: number, status: string) { return axiosInstance.put(`/vagas/${vagaId}/candidatos/${candidatoId}/status`, { status }).then(r => r.data); },
  salvarAnotacoesCandidato(candidatoId: number, vagaId: number, anotacoes: string) { return axiosInstance.put(`/vagas/${vagaId}/candidatos/${candidatoId}/anotacoes`, { anotacoes }).then(r => r.data); },
  
  // --- VINCULOS / ACESSIBILIDADE ---
  vincularAcessibilidadesABarreira(barreiraId: number, acessibilidadeIds: number[]) { return axiosInstance.post(`/barreiras/${barreiraId}/acessibilidades`, { acessibilidadeIds }).then(r => r.data); },
  vincularSubtiposAVaga(vagaId: number, subtipoIds: number[]) { return axiosInstance.post(`/vagas/${vagaId}/subtipos`, { subtipoIds }).then(r => r.data); },
  vincularAcessibilidadesAVaga(vagaId: number, acessibilidadeIds: number[]) { return axiosInstance.post(`/vagas/${vagaId}/acessibilidades`, { acessibilidadeIds }).then(r => r.data); },
  listarAcessibilidadesPossiveis(vagaId: number) { return axiosInstance.get<any[]>(`/vagas/${vagaId}/acessibilidades-disponiveis`).then(r => r.data); },
  obterVaga(vagaId: number) { return axiosInstance.get<any>(`/vagas/vaga/${vagaId}`).then(r => r.data); },

  // --- CANDIDATO ---
  getCandidato(id: number) {
    if (!id) throw new Error('ID do candidato é obrigatório');
    return axiosInstance.get<any>(`/candidato/${id}`).then(r => r.data);
  },
  atualizarCandidato(id: number, data: any) { return axiosInstance.put(`/candidato/${id}`, data).then(r => r.data); },
  calcularCompatibilidade(vagaId: number) { return axiosInstance.get(`/candidato/compatibilidade/${vagaId}`).then(r => r.data); },
  listarVagasFavoritas(candidatoId: number) { return axiosInstance.get<any[]>(`/candidato/${candidatoId}/favoritos`).then(r => r.data); },
  favoritarVaga(vagaId: number) { return axiosInstance.post(`/candidato/favoritos/${vagaId}`).then(r => r.data); },
  desfavoritarVaga(vagaId: number) {
    return axiosInstance.delete(`/candidato/favoritos/${vagaId}`).then(r => r.data);
  },


  listarVagasSalvas() {
    return axiosInstance.get(`/candidato/vagas-salvas`).then(r => r.data);
  },

  // --- NOTIFICAÇÕES ---
  listarNotificacoes(candidatoId: number) {
    return axiosInstance.get(`/candidato/${candidatoId}/notificacoes`).then(r => r.data);
  },
  marcarNotificacaoLida(candidatoId: number, notifId: number) {
    return axiosInstance.patch(`/candidato/${candidatoId}/notificacoes/${notifId}/lida`).then(r => r.data);
  },
  marcarTodasNotificacoesLidas(candidatoId: number) {
    return axiosInstance.patch(`/candidato/${candidatoId}/notificacoes/marcar-todas-lidas`).then(r => r.data);
  },

  // --- NOTIFICAÇÕES EMPRESA ---
  listarNotificacoesEmpresa(empresaId: number) {
    return axiosInstance.get(`/empresa/${empresaId}/notificacoes`).then(r => r.data);
  },
  marcarNotificacaoEmpresaLida(empresaId: number, notifId: number) {
    return axiosInstance.patch(`/empresa/${empresaId}/notificacoes/${notifId}/lida`).then(r => r.data);
  },
  marcarTodasNotificacoesEmpresaLidas(empresaId: number) {
    return axiosInstance.patch(`/empresa/${empresaId}/notificacoes/marcar-todas-lidas`).then(r => r.data);
  },

  // --- ADMIN ---
  listarCandidatos() {
    return axiosInstance.get('/admin/candidatos').then(r => r.data);
  },
  listarVagas() {
    return axiosInstance.get('/admin/vagas').then(r => r.data);
  },
  obterEmpresaAdmin(empresaId: number) {
    return axiosInstance.get(`/admin/empresas/${empresaId}`).then(r => r.data);
  },
  // --- DASHBOARD ADMIN ---
  obterDashboardAdmin() {
    return axiosInstance.get('/admin/dashboard').then(r => r.data);
  },
  // --- DASHBOARD CANDIDATURAS ---
  obterDashboardCandidaturas(candidatoId: number) {
    if (!candidatoId || isNaN(Number(candidatoId))) {
      return Promise.reject(new Error('ID do candidato ausente ou inválido.'));
    }
    return axiosInstance.get(`/candidaturas/candidato/${candidatoId}/dashboard`).then(r => r.data);
  },

  salvarVaga(vagaId: number) {
    return axiosInstance.post(`/candidato/vagas-salvas/${vagaId}`).then(r => r.data);
  },

  // --- AUTH ---
  login(identifier: string, senha: string, userType: string) {
    return axiosInstance.post(`/auth/login`, { identifier, senha, userType }).then(r => r.data);
  },

  // --- CANDIDATURAS ---
  listarCandidaturas(candidatoId: number, status?: string, periodo?: string) {
    if (!candidatoId || isNaN(Number(candidatoId))) {
      return Promise.reject(new Error('ID do candidato ausente ou inválido.'));
    }
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (periodo) params.append('periodo', periodo);
    return axiosInstance.get(`/candidaturas/candidato/${candidatoId}?${params.toString()}`).then(r => r.data);
  },
};