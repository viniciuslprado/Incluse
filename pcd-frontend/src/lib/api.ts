// ...existing code...
  // ...existing code...
// ...existing code...
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
          listarEmpresasAdmin() {
            return axiosInstance.get('/admin/empresas').then(r => r.data);
          },
        // --- ADMINISTRADORES ---
        listarAdministradores() {
          return axiosInstance.get('/admin/administradores').then(r => r.data);
        },
        criarAdministrador(data: { nome: string; email: string; senha: string }) {
          return axiosInstance.post('/admin/administradores', data).then(r => r.data);
        },
        atualizarAdministrador(id: number, data: { nome: string; email: string; senha?: string }) {
          return axiosInstance.put(`/admin/administradores/${id}`, data).then(r => r.data);
        },
        deletarAdministrador(id: number) {
          return axiosInstance.delete(`/admin/administradores/${id}`).then(r => r.data);
        },
      /**
       * Cria uma vaga (compatibilidade)
       */
      async criarVaga(empresaId: number, titulo: string, descricao: string, escolaridade: string, cidade: string, estado: string) {
        return api.criarVagaCompleta({ empresaId, titulo, descricao, escolaridade, cidade, estado });
      },
    /**
     * Avalia uma empresa
     * @param empresaId ID da empresa
     * @param nota Nota de 1 a 5
     * @param comentario Comentário opcional
     * @param anonimo Se a avaliação é anônima
     */
    async avaliarEmpresa(empresaId: number, nota: number, comentario?: string, anonimo?: boolean) {
      return axiosInstance.post(`/empresas/${empresaId}/avaliacoes`, { nota, comentario, anonimo }).then(r => r.data);
    },
  /**
   * Cadastra uma nova empresa
   * @param data Dados da empresa
   */
  async registerEmpresa(data: any) {
    return axiosInstance.post('/empresas', data).then(r => r.data);
  },

  /**
   * Verifica se já existe uma empresa com o CNPJ informado
   * @param cnpj string (apenas números)
   * @returns Promise<boolean>
   */
  async checkCnpjExists(cnpj: string): Promise<boolean> {
    if (!cnpj || cnpj.length < 14) return false;
    try {
      const res = await axiosInstance.get(`/empresas/check-cnpj/${encodeURIComponent(cnpj)}`);
      return !!res.data?.exists;
    } catch (e: any) {
      if (e?.status === 404) return false;
      throw e;
    }
  },

  vincularBarreirasACandidato(candidatoId: number, subtipoId: number, barreiraIds: number[]) {
    return axiosInstance.post(`/candidatos/${candidatoId}/subtipos/${subtipoId}/barreiras`, { barreiraIds }).then(r => r.data);
  },

      registerCandidatoWithFiles(formData: FormData) {
        return axiosInstance.post('/candidatos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(r => r.data);
      },
    /**
     * Verifica se já existe um candidato com o e-mail informado
     * @param email string
     * @returns Promise<boolean>
     */
    async checkCandidatoEmailExists(email: string): Promise<boolean> {
      if (!email) return false;
      try {
        const res = await axiosInstance.get(`/candidatos/check-email/${encodeURIComponent(email)}`);
        return !!res.data?.exists;
      } catch (e: any) {
        if (e?.status === 404) return false;
        throw e;
      }
    },
  /**
   * Verifica se já existe um candidato com o CPF informado
   * @param cpfOnly string (apenas números)
   * @returns Promise<boolean>
   */
  async checkCpfExists(cpfOnly: string): Promise<boolean> {
    if (!cpfOnly || cpfOnly.length !== 11) return false;
    try {
      const res = await axiosInstance.get(`/candidatos/cpf/${cpfOnly}/exists`);
      // Espera resposta: { exists: true/false }
      return !!res.data?.exists;
    } catch (e: any) {
      if (e?.status === 404) return false;
      throw e;
    }
  },
  listarBarreirasPorTipo(tipoId: number) {
    return axiosInstance.get(`/tipos/${tipoId}/barreiras`).then(r => r.data);
  },
  deletarTipo(id: number) { return axiosInstance.delete(`/admin/deficiencias/${id}`).then(r => r.data); },
  deletarBarreira(id: number) { return axiosInstance.delete(`/admin/barreiras/${id}`).then(r => r.data); },
  deletarAcessibilidade(id: number) { return axiosInstance.delete(`/admin/acessibilidades/${id}`).then(r => r.data); },
  deletarSubtipo(id: number) { return axiosInstance.delete(`/admin/subtipos/${id}`).then(r => r.data); },
  listarLogsAdmin(params?: { page?: number; limit?: number; tipo?: string }) {
    return axiosInstance.get('/admin/logs', { params }).then(r => r.data);
  },
  // --- CRIAÇÃO DE RECURSOS ---
  criarTipo(nome: string) { return axiosInstance.post('/admin/deficiencias', { nome }).then(r => r.data); },
  criarSubtipo(tipoId: number, nome: string) { return axiosInstance.post('/admin/subtipos', { tipoId, nome }).then(r => r.data); },
  criarBarreira(subtipoId: number, descricao: string) { return axiosInstance.post('/admin/barreiras', { subtipoId, descricao }).then(r => r.data); },
  criarAcessibilidade(barreiraId: number, descricao: string) { return axiosInstance.post('/admin/acessibilidades', { barreiraId, descricao }).then(r => r.data); },
            atualizarSubtipo(id: number, nome: string) { return axiosInstance.patch(`/admin/subtipos/${id}`, { nome }).then(r => r.data); },
            atualizarBarreira(id: number, descricao: string) { return axiosInstance.patch(`/admin/barreiras/${id}`, { descricao }).then(r => r.data); },
            atualizarAcessibilidade(id: number, descricao: string) { return axiosInstance.patch(`/admin/acessibilidades/${id}`, { descricao }).then(r => r.data); },
            atualizarTipo(id: number, nome: string) { return axiosInstance.patch(`/admin/deficiencias/${id}`, { nome }).then(r => r.data); },
        listarAcessibilidadesPorBarreira(barreiraId: number) { return axiosInstance.get(`/barreiras/${barreiraId}/acessibilidades`).then(r => r.data); },
      listarBarreiras() { return axiosInstance.get('/barreiras').then(r => r.data); },
    getConfig(candidatoId: number) {
      return axiosInstance.get(`/candidatos/${candidatoId}/config`).then(r => r.data);
    },
    updateConfig(candidatoId: number, data: any) {
      return axiosInstance.put(`/candidatos/${candidatoId}/config`, data).then(r => r.data);
    },
  // --- PÚBLICO E UTILITÁRIOS ---
  listarTiposPublicos() { return axiosInstance.get('/tipos').then(r => r.data); },
  listarTipos() { return axiosInstance.get('/tipos').then(r => r.data); },
  listarSubtiposPorTipo(tipoId: number) { return axiosInstance.get(`/tipos/${tipoId}/subtipos`).then(r => r.data); },
  listarAcessibilidadesPublicas() { return axiosInstance.get('/acessibilidades').then(r => r.data); },
  listarEmpresas() { return axiosInstance.get('/empresas').then(r => r.data); },
  listarVagasPublicas() { return axiosInstance.get('/vagas').then(r => r.data); },

  // Vagas recomendadas para o candidato
  listarVagasRecomendadas(candidatoId: number) {
    return axiosInstance.get(`/candidatos/${candidatoId}/vagas-recomendadas`).then(r => r.data);
  },
  requestPasswordReset(identifier: string) { return axiosInstance.post('/auth/request-password-reset', { identifier }).then(r => r.data); },
  listarAreasFormacao() { return axiosInstance.get('/areas-formacao').then(r => r.data); },
  listarSubtiposCandidato(candidatoId: number) { return axiosInstance.get(`/candidatos/${candidatoId}/subtipos`).then(r => r.data); },
  listarBarreirasPorSubtipo(subtipoId: number) { return axiosInstance.get(`/subtipos/${subtipoId}/barreiras`).then(r => r.data); },
  getDevToken(id: number) { return axiosInstance.post(`/candidatos/${id}/dev-auth`).then(r => r.data); },
  listarAreasFormacaoCandidato(id: number) { return axiosInstance.get(`/candidatos/${id}/areas-formacao`).then(r => r.data); },
  vincularAreasFormacaoCandidato(id: number, areas: number[]) { return axiosInstance.post(`/candidatos/${id}/areas-formacao`, { areas }).then(r => r.data); },
  vincularSubtiposACandidato(id: number, subtipoIds: number[]) { return axiosInstance.post(`/candidatos/${id}/subtipos`, { subtipoIds }).then(r => r.data); },
  obterCurriculoBasico(id: number) { return axiosInstance.get(`/candidatos/${id}/curriculo`).then(r => r.data); },
  buscarEmpresa(id: number) { return axiosInstance.get(`/empresas/${id}`).then(r => r.data); },
  getEmpresaPerfil() { return axiosInstance.get('/empresas/me').then(r => r.data); },
  uploadLogoEmpresaAutenticada(formData: FormData) { return axiosInstance.post('/empresas/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data); },
  atualizarEmpresaAutenticada(empresa: any) { return axiosInstance.put('/empresas/update', empresa).then(r => r.data); },
  alterarSenha(userId: number, userType: string, senhaAtual: string, novaSenha: string) {
    return axiosInstance.post('/auth/alterar-senha', { userId, userType, senhaAtual, novaSenha }).then(r => r.data);
  },
  listarVagasPorEmpresa(empresaId: number) { return axiosInstance.get(`/vagas/empresas/${empresaId}/vagas`).then(r => r.data); },
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
  atualizarStatusCandidato(candidatoId: number, vagaId: number, status: string) { return axiosInstance.post(`/vagas/${vagaId}/candidato/${candidatoId}/status`, { status }).then(r => r.data); },
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
    return axiosInstance.get<any>(`/candidatos/${id}`).then(r => r.data);
  },
  atualizarCandidato(id: number, data: any) { return axiosInstance.put(`/candidatos/${id}`, data).then(r => r.data); },
  // calcularCompatibilidade removido: lógica agora é backend, vagas já vêm filtradas.
  listarVagasFavoritas(candidatoId: number) { return axiosInstance.get<any[]>(`/candidatos/${candidatoId}/favoritos`).then(r => r.data); },
  favoritarVaga(vagaId: number) { return axiosInstance.post(`/candidatos/favoritos/${vagaId}`).then(r => r.data); },
  desfavoritarVaga(vagaId: number) {
    return axiosInstance.delete(`/candidatos/favoritos/${vagaId}`).then(r => r.data);
  },
  // verificarCandidatura removido: lógica agora é backend, vagas já vêm com status de candidatura.


  listarVagasSalvas() {
    return axiosInstance.get(`/candidatos/vagas-salvas`).then(r => r.data);
  },

  // --- NOTIFICAÇÕES ---
  listarNotificacoes(candidatoId: number) {
    return axiosInstance.get(`/candidatos/${candidatoId}/notificacoes`).then(r => r.data);
  },
  marcarNotificacaoLida(candidatoId: number, notifId: number) {
    return axiosInstance.patch(`/candidatos/${candidatoId}/notificacoes/${notifId}/lida`).then(r => r.data);
  },
  marcarTodasNotificacoesLidas(candidatoId: number) {
    return axiosInstance.patch(`/candidatos/${candidatoId}/notificacoes/marcar-todas-lidas`).then(r => r.data);
  },

  // --- NOTIFICAÇÕES EMPRESA ---
  listarNotificacoesEmpresa(empresaId: number) {
    return axiosInstance.get(`/empresas/${empresaId}/notificacoes`).then(r => r.data);
  },
  marcarNotificacaoEmpresaLida(empresaId: number, notifId: number) {
    return axiosInstance.patch(`/empresas/${empresaId}/notificacoes/${notifId}/lida`).then(r => r.data);
  },
  marcarTodasNotificacoesEmpresaLidas(empresaId: number) {
    return axiosInstance.patch(`/empresas/${empresaId}/notificacoes/marcar-todas-lidas`).then(r => r.data);
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

  // --- CANDIDATURAS ---
  candidatarVaga(candidatoId: number | undefined | null, vagaId: number) {
    if (!vagaId || isNaN(Number(vagaId))) return Promise.reject(new Error('ID da vaga ausente ou inválido.'));
    // Se candidatoId for fornecido, envie no corpo; caso contrário, confie no token (rota protegida)
    if (candidatoId && !isNaN(Number(candidatoId))) {
      return axiosInstance.post(`/candidaturas/${vagaId}`, { candidatoId }).then(r => r.data);
    }
    return axiosInstance.post(`/candidaturas/${vagaId}`).then(r => r.data);
  },

  retirarCandidatura(candidatoId: number, vagaId: number) {
    if (!candidatoId || isNaN(Number(candidatoId))) return Promise.reject(new Error('ID do candidato ausente ou inválido.'));
    return axiosInstance.delete(`/candidaturas/vaga/${vagaId}/candidato/${candidatoId}`).then(r => r.data);
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