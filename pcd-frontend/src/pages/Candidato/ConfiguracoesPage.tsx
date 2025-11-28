import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useToast } from "../../components/common/Toast";
import { FiBell, FiLock, FiShield, FiEye, FiEyeOff, FiFileText, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';

type ConfigType = {
  emailNovasVagas: boolean;
  emailAtualizacoes: boolean;
  emailMensagens: boolean;
  emailCurriculoIncompleto: boolean;
  emailVagasExpiradas: boolean;
  appNovasVagas: boolean;
  appAtualizacoes: boolean;
  appMensagens: boolean;
  appCurriculoIncompleto: boolean;
  appVagasExpiradas: boolean;
  curriculoVisivel: boolean;
  idioma: string;
  termosAceitos: boolean;
  termosAceitosEm?: string;
};

export default function ConfiguracoesPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [config, setConfig] = useState<ConfigType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState<'notificacoes' | 'privacidade' | 'seguranca' | 'termos' | 'desativar' | 'excluir'>('notificacoes');
  
  // Senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [alterandoSenha, setAlterandoSenha] = useState(false);
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  
  // Exclusão/Desativação
  const [confirmarExclusao, setConfirmarExclusao] = useState('');
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    async function carregar() {
      if (!candidatoId) return;
      try {
        const data = await api.getConfig(candidatoId);
        setConfig(data);
      } catch (err: any) {
        addToast({ type: 'error', title: 'Erro', message: err?.message || 'Erro ao carregar configurações' });
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [candidatoId]);

  async function salvarConfig() {
    if (!config) return;
    setSaving(true);
    try {
      await api.updateConfig(candidatoId, config);
      addToast({ type: 'success', title: 'Salvo', message: 'Configurações atualizadas!' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Erro', message: err?.message || 'Erro ao salvar' });
    } finally {
      setSaving(false);
    }
  }

  async function handleAlterarSenha() {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      return addToast({ type: 'error', title: 'Erro', message: 'Preencha todos os campos' });
    }
    if (novaSenha !== confirmarSenha) {
      return addToast({ type: 'error', title: 'Erro', message: 'Senhas não coincidem' });
    }
    if (novaSenha.length < 6) {
      return addToast({ type: 'error', title: 'Erro', message: 'Senha deve ter no mínimo 6 caracteres' });
    }
    
    setAlterandoSenha(true);
    try {
      await api.alterarSenhaCandidato(candidatoId, senhaAtual, novaSenha);
      addToast({ type: 'success', title: 'Sucesso', message: 'Senha alterada!' });
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (err: any) {
      addToast({ type: 'error', title: 'Erro', message: err?.message || 'Erro ao alterar senha' });
    } finally {
      setAlterandoSenha(false);
    }
  }



  async function handleDesativarConta() {
    if (!window.confirm('Tem certeza que deseja desativar sua conta?')) return;
    setProcessando(true);
    try {
      await api.desativarConta(candidatoId);
      addToast({ type: 'info', title: 'Conta desativada', message: 'Sua conta foi desativada.' });
      localStorage.clear();
      navigate('/');
    } catch (err: any) {
      addToast({ type: 'error', title: 'Erro', message: err?.message || 'Erro ao desativar conta' });
    } finally {
      setProcessando(false);
    }
  }

  async function handleExcluirConta() {
    if (confirmarExclusao !== 'EXCLUIR') {
      return addToast({ type: 'error', title: 'Erro', message: 'Digite EXCLUIR para confirmar' });
    }
    setProcessando(true);
    try {
      await api.excluirConta(candidatoId, 'EXCLUIR');
      addToast({ type: 'info', title: 'Conta excluída', message: 'Sua conta foi excluída permanentemente.' });
      localStorage.clear();
      navigate('/');
    } catch (err: any) {
      addToast({ type: 'error', title: 'Erro', message: err?.message || 'Erro ao excluir conta' });
    } finally {
      setProcessando(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-4 border rounded bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
        Erro ao carregar configurações
      </div>
    );
  }

  const secoes = [
    { id: 'notificacoes' as const, nome: 'Notificações', icone: FiBell },
    { id: 'privacidade' as const, nome: 'Privacidade', icone: FiLock },
    { id: 'seguranca' as const, nome: 'Segurança', icone: FiShield },
    { id: 'termos' as const, nome: 'Termos & Políticas', icone: FiFileText },
    { id: 'desativar' as const, nome: 'Desativar Conta', icone: FiAlertTriangle },
    { id: 'excluir' as const, nome: 'Excluir Conta', icone: FiTrash2 }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Configurações</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Gerencie suas preferências e configurações da conta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu Lateral */}
        <div className="lg:col-span-1 -ml-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2">
            <nav className="space-y-1">
              {secoes.map((secao) => {
                const Icone = secao.icone;
                return (
                  <button
                    key={secao.id}
                    onClick={() => setSecaoAtiva(secao.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      secaoAtiva === secao.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Icone className="w-5 h-5" />
                    <span className="text-sm">{secao.nome}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            
            {/* Notificações */}
            {secaoAtiva === 'notificacoes' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Preferências de Notificação</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Escolha como e quando deseja receber notificações</p>
                </div>

                <div className="space-y-6">
                  {/* Email */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Notificações por E-mail</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'emailNovasVagas' as const, label: 'Novas vagas compatíveis' },
                        { key: 'emailAtualizacoes' as const, label: 'Atualização de candidaturas' },
                        { key: 'emailMensagens' as const, label: 'Mensagens das empresas' },
                        { key: 'emailCurriculoIncompleto' as const, label: 'Alertas de currículo incompleto' },
                        { key: 'emailVagasExpiradas' as const, label: 'Vagas salvas expiradas' }
                      ].map(item => (
                        <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                          <span className="text-sm text-gray-900 dark:text-gray-100">{item.label}</span>
                          <input
                            type="checkbox"
                            checked={config[item.key]}
                            onChange={(e) => setConfig({...config, [item.key]: e.target.checked})}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* App */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Notificações no Aplicativo</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'appNovasVagas' as const, label: 'Novas vagas compatíveis' },
                        { key: 'appAtualizacoes' as const, label: 'Atualização de candidaturas' },
                        { key: 'appMensagens' as const, label: 'Mensagens das empresas' },
                        { key: 'appCurriculoIncompleto' as const, label: 'Alertas de currículo incompleto' },
                        { key: 'appVagasExpiradas' as const, label: 'Vagas salvas expiradas' }
                      ].map(item => (
                        <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                          <span className="text-sm text-gray-900 dark:text-gray-100">{item.label}</span>
                          <input
                            type="checkbox"
                            checked={config[item.key]}
                            onChange={(e) => setConfig({...config, [item.key]: e.target.checked})}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={salvarConfig}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {saving ? 'Salvando...' : 'Salvar Preferências'}
                </button>
              </div>
            )}

            {/* Privacidade */}
            {secaoAtiva === 'privacidade' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Privacidade</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Controle quem pode ver suas informações</p>
                </div>

                <label className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Tornar currículo visível para empresas</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Seu perfil aparecerá no banco de talentos e buscas</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.curriculoVisivel}
                    onChange={(e) => setConfig({...config, curriculoVisivel: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>

                <button
                  onClick={salvarConfig}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {saving ? 'Salvando...' : 'Salvar Privacidade'}
                </button>
              </div>
            )}

            {/* Segurança */}
            {secaoAtiva === 'seguranca' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Segurança</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Altere sua senha e gerencie a segurança da conta</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Senha Atual</label>
                    <div className="relative">
                      <input
                        type={showSenhaAtual ? 'text' : 'password'}
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 pr-10"
                        placeholder="Digite sua senha atual"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showSenhaAtual ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nova Senha</label>
                    <div className="relative">
                      <input
                        type={showNovaSenha ? 'text' : 'password'}
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 pr-10"
                        placeholder="Digite a nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNovaSenha(!showNovaSenha)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showNovaSenha ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirmar Nova Senha</label>
                    <div className="relative">
                      <input
                        type={showConfirmarSenha ? 'text' : 'password'}
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 pr-10"
                        placeholder="Confirme a nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmarSenha ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAlterarSenha}
                    disabled={alterandoSenha}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {alterandoSenha ? 'Alterando...' : 'Alterar Senha'}
                  </button>
                </div>
              </div>
            )}

            {/* Termos */}
            {secaoAtiva === 'termos' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Termos & Políticas</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Informações sobre termos de uso e privacidade</p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-green-900 dark:text-green-100 mb-2">
                    <span>✓ Termos aceitos em {config.termosAceitosEm ? new Date(config.termosAceitosEm).toLocaleDateString('pt-BR') : 'criação da conta'}</span>
                  </div>
                  <a 
                    href="/politica-privacidade" 
                    target="_blank" 
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Ler a Política de Privacidade
                  </a>
                </div>
              </div>
            )}

            {/* Desativar Conta */}
            {secaoAtiva === 'desativar' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Desativar Conta</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Desative temporariamente sua conta</p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-900 dark:text-yellow-100">
                    Sua conta será desativada temporariamente. Você poderá reativá-la fazendo login novamente.
                  </p>
                </div>

                <button
                  onClick={handleDesativarConta}
                  disabled={processando}
                  className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {processando ? 'Processando...' : 'Desativar Conta'}
                </button>
              </div>
            )}

            {/* Excluir Conta */}
            {secaoAtiva === 'excluir' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Excluir Conta</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Exclua permanentemente sua conta e todos os dados</p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-900 dark:text-red-100">
                    ⚠️ Esta ação é <strong>permanente</strong> e não pode ser desfeita. Todos os seus dados serão excluídos.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Digite <span className="font-bold">EXCLUIR</span> para confirmar
                    </label>
                    <input
                      type="text"
                      value={confirmarExclusao}
                      onChange={(e) => setConfirmarExclusao(e.target.value)}
                      className="w-full max-w-xs px-4 py-2 border border-red-300 dark:border-red-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500"
                      placeholder="EXCLUIR"
                    />
                  </div>

                  <button
                    onClick={handleExcluirConta}
                    disabled={processando || confirmarExclusao !== 'EXCLUIR'}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {processando ? 'Excluindo...' : 'Excluir Conta Permanentemente'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}