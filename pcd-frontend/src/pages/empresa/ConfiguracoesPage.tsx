import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { FiBell, FiShield, FiUsers, FiFileText, FiTrash2, FiAlertTriangle } from 'react-icons/fi';

export default function ConfiguracoesPage() {
  const { id } = useParams<{ id: string }>();
  const empresaId = Number(id);
  const navigate = useNavigate();
  const [secaoAtiva, setSecaoAtiva] = useState<'notificacoes' | 'responsaveis' | 'seguranca' | 'termos' | 'desativar' | 'excluir'>('notificacoes');

  // Estados para notificações
  const [notificacoes, setNotificacoes] = useState({
    emailNovaCandidatura: true,
    emailStatusProcesso: true,
    emailMensagensCandidatos: false,
    alertasVagasExpirando: true
  });

  // Estados para segurança
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');

  // Estados para exclusão
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState('');

  async function salvarNotificacoes() {
    try {
      // Implementar chamada à API
      alert('Notificações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  }

  async function alterarSenha() {
    if (novaSenha !== confirmarNovaSenha) {
      alert('As senhas não coincidem');
      return;
    }
    if (novaSenha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const userId = Number(localStorage.getItem('userId'));
      const userType = localStorage.getItem('userType') || 'empresa';
      await api.alterarSenha(userId, userType, senhaAtual, novaSenha);
      alert('Senha alterada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarNovaSenha('');
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      alert(error.response?.data?.error || 'Erro ao alterar senha');
    }
  }

  async function desativarConta() {
    if (!confirm('Deseja realmente desativar sua conta? Você poderá reativá-la fazendo login novamente.')) return;

    try {
      // Implementar chamada à API
      alert('Conta desativada com sucesso!');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Erro ao desativar conta:', error);
    }
  }

  async function excluirConta() {
    if (confirmacaoExclusao !== 'EXCLUIR') {
      alert('Digite EXCLUIR para confirmar a exclusão da conta');
      return;
    }

    if (!confirm('Esta ação é PERMANENTE e não pode ser desfeita. Todos os seus dados serão apagados. Tem certeza?')) return;

    try {
      // Implementar chamada à API
      alert('Conta excluída permanentemente!');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
    }
  }

  const secoes = [
    { id: 'notificacoes' as const, nome: 'Notificações', icone: FiBell },
    { id: 'responsaveis' as const, nome: 'Responsáveis', icone: FiUsers },
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
                    {secao.nome}
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
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Preferências de Notificações</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Configure como deseja receber notificações</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Nova Candidatura</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Receba um email quando um candidato se candidatar</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificacoes.emailNovaCandidatura}
                      onChange={(e) => setNotificacoes({...notificacoes, emailNovaCandidatura: e.target.checked})}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Status do Processo</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Notificações sobre mudanças no processo seletivo</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificacoes.emailStatusProcesso}
                      onChange={(e) => setNotificacoes({...notificacoes, emailStatusProcesso: e.target.checked})}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>

                <button
                  onClick={salvarNotificacoes}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Salvar Preferências
                </button>
              </div>
            )}

            {/* Responsáveis */}
            {secaoAtiva === 'responsaveis' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Gerenciar Responsáveis</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Adicione ou remova pessoas que podem gerenciar esta conta</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Funcionalidade de multiusuário disponível em breve. Entre em contato com o suporte para mais informações.
                  </p>
                </div>
              </div>
            )}

            {/* Segurança */}
            {secaoAtiva === 'seguranca' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Segurança</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Altere sua senha e gerencie opções de segurança</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Senha Atual</label>
                    <input
                      type="password"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nova Senha</label>
                    <input
                      type="password"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      value={confirmarNovaSenha}
                      onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={alterarSenha}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Alterar Senha
                </button>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => navigate(`/empresa/${empresaId}/recuperar-senha`)}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              </div>
            )}

            {/* Termos & Políticas */}
            {secaoAtiva === 'termos' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Termos & Políticas</h2>
                </div>

                <div className="space-y-4">
                  <a
                    href="/termos-de-uso"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">Termos de Uso do Incluse</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Leia nossos termos e condições</div>
                      </div>
                      <FiFileText className="w-5 h-5 text-gray-400" />
                    </div>
                  </a>

                  <a
                    href="/politica-de-privacidade"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">Política de Privacidade</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Como protegemos seus dados</div>
                      </div>
                      <FiFileText className="w-5 h-5 text-gray-400" />
                    </div>
                  </a>
                </div>
              </div>
            )}

            {/* Desativar Conta */}
            {secaoAtiva === 'desativar' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Desativar Conta</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Desative temporariamente sua conta. Você poderá reativá-la fazendo login novamente.</p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <FiAlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      <p className="font-medium mb-2">O que acontece quando você desativa sua conta:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Suas vagas ficarão invisíveis</li>
                        <li>Candidatos não poderão se candidatar</li>
                        <li>Você pode reativar fazendo login novamente</li>
                        <li>Seus dados serão preservados</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  onClick={desativarConta}
                  className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
                >
                  Desativar Minha Conta
                </button>
              </div>
            )}

            {/* Excluir Conta */}
            {secaoAtiva === 'excluir' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Excluir Conta</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Esta ação é PERMANENTE e não pode ser desfeita.</p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <FiTrash2 className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-800 dark:text-red-200">
                      <p className="font-medium mb-2">O que será excluído permanentemente:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Todos os seus dados pessoais</li>
                        <li>Todas as vagas publicadas</li>
                        <li>Histórico de candidatos</li>
                        <li>Não será possível recuperar a conta</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Digite EXCLUIR para confirmar
                  </label>
                  <input
                    type="text"
                    value={confirmacaoExclusao}
                    onChange={(e) => setConfirmacaoExclusao(e.target.value)}
                    placeholder="Digite EXCLUIR"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={excluirConta}
                  disabled={confirmacaoExclusao !== 'EXCLUIR'}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  Excluir Permanentemente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
