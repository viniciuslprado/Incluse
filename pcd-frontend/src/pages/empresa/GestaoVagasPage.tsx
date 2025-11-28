import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { FiSearch, FiEdit, FiCopy, FiUsers, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import ResponsiveCardList from '../../components/common/ResponsiveCardList';

interface Vaga {
  id: number;
  titulo: string;
  descricao: string;
  status?: string;
  createdAt: string;
  totalCandidatos?: number;
}

export default function GestaoVagasPage() {
  const { id } = useParams<{ id: string }>();
  const empresaId = Number(id);
  const navigate = useNavigate();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todas' | 'ativas' | 'encerradas' | 'pendentes'>('todas');
  const [busca, setBusca] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<number | null>(null);

  useEffect(() => {
    carregarVagas();
  }, [empresaId]);

  async function carregarVagas() {
    try {
      setLoading(true);
      const data = await api.listarVagas(empresaId);
      
      // Carregar candidatos para cada vaga
      const vagasComCandidatos = await Promise.all(
        data.map(async (vaga: any) => {
          try {
            const candidatos = await api.listarCandidatosPorVaga(vaga.id);
            return { ...vaga, totalCandidatos: candidatos.length };
          } catch {
            return { ...vaga, totalCandidatos: 0 };
          }
        })
      );
      
      setVagas(vagasComCandidatos);
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
    } finally {
      setLoading(false);
    }
  }

  async function duplicarVaga(vagaId: number) {
    try {
      const vaga = vagas.find(v => v.id === vagaId);
      if (!vaga) return;
      
      // Implementar lógica de duplicação via API
      alert('Funcionalidade de duplicar vaga será implementada');
      // await api.duplicarVaga(vagaId);
      // carregarVagas();
    } catch (error) {
      console.error('Erro ao duplicar vaga:', error);
    }
  }

  async function alterarStatus(vagaId: number, status: 'ativa' | 'encerrada') {
    try {
      await api.atualizarStatusVaga(vagaId, status);
      setStatusDropdownOpen(null);
      carregarVagas();
    } catch (error) {
      console.error('Erro ao alterar status da vaga:', error);
      alert('Erro ao alterar status da vaga');
    }
  }

  const vagasFiltradas = vagas
    .filter(vaga => {
      if (filtro === 'ativas') return vaga.status === 'ativa';
      if (filtro === 'encerradas') return vaga.status === 'encerrada';
      if (filtro === 'pendentes') return false; // Implementar lógica de pendentes
      return true;
    })
    .filter(vaga => 
      vaga.titulo?.toLowerCase().includes(busca.toLowerCase()) ||
      vaga.descricao?.toLowerCase().includes(busca.toLowerCase())
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestão de Vagas</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gerencie todas as suas vagas em um só lugar</p>
        </div>
        <button
          onClick={() => navigate(`/empresa/${empresaId}/anunciar`)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          + Nova Vaga
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar vagas..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <button
              onClick={() => setFiltro('todas')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'todas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltro('ativas')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'ativas'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Ativas
            </button>
            <button
              onClick={() => setFiltro('encerradas')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'encerradas'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Encerradas
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Vagas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {vagasFiltradas.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Nenhuma vaga encontrada
          </div>
        ) : (
          <>
            {/* Tabela (desktop) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data de Criação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Candidatos
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {vagasFiltradas.map((vaga) => (
                  <tr key={vaga.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {vaga.titulo || 'Sem título'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                        {vaga.descricao ? `${vaga.descricao.substring(0, 80)}...` : 'Sem descrição'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setStatusDropdownOpen(statusDropdownOpen === vaga.id ? null : vaga.id)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                            vaga.status === 'ativa'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                          title={vaga.status === 'ativa' ? 'Clique para encerrar' : 'Vaga encerrada'}
                          disabled={vaga.status === 'encerrada'}
                        >
                          {vaga.status === 'ativa' ? <FiCheckCircle /> : <FiXCircle />}
                          {vaga.status === 'ativa' ? 'Ativa' : 'Encerrada'}
                        </button>
                        {statusDropdownOpen === vaga.id && vaga.status === 'ativa' && (
                          <div className="absolute bottom-full mb-1 left-0 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10 p-1">
                            <button
                              onClick={() => {
                                if (confirm('Tem certeza que deseja encerrar esta vaga? Esta ação não pode ser desfeita.')) {
                                  alterarStatus(vaga.id, 'encerrada');
                                }
                              }}
                              className="px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5 text-red-600 dark:text-red-400 rounded whitespace-nowrap"
                              title="Encerrar vaga"
                            >
                              <FiXCircle className="w-3 h-3" />
                              Encerrar Vaga
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(vaga.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center gap-1">
                        <FiUsers className="text-gray-400" />
                        {vaga.totalCandidatos || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/empresa/${empresaId}/vagas/${vaga.id}/editar`)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/empresa/${empresaId}/vagas/${vaga.id}/candidatos`)}
                          className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                          title="Ver candidatos"
                        >
                          <FiUsers className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => duplicarVaga(vaga.id)}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                          title="Duplicar"
                        >
                          <FiCopy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Cards (mobile) */}
            <div className="md:hidden">
              <ResponsiveCardList
                items={vagasFiltradas.map((vaga) => ({
                  id: vaga.id,
                  title: vaga.titulo || 'Sem título',
                  description: vaga.descricao || 'Sem descrição',
                  badge: { text: vaga.isActive ? 'Ativa' : 'Encerrada', color: vaga.isActive ? 'green' : 'gray' },
                  meta: [
                    { label: 'Candidatos', value: `${vaga.totalCandidatos || 0}` },
                    { label: 'Criada em', value: new Date(vaga.createdAt).toLocaleDateString('pt-BR') },
                  ],
                  actions: [
                    { label: 'Editar', onClick: () => navigate(`/empresa/${empresaId}/vagas/${vaga.id}/editar`), variant: 'blue' },
                    { label: 'Ver candidatos', onClick: () => navigate(`/empresa/${empresaId}/vagas/${vaga.id}/candidatos`), variant: 'purple' },
                    { label: 'Duplicar', onClick: () => duplicarVaga(vaga.id), variant: 'green', full: true },
                    vaga.isActive
                      ? { label: 'Arquivar', onClick: () => arquivarVaga(vaga.id), variant: 'yellow', full: true }
                      : { label: 'Reativar', onClick: () => reativarVaga(vaga.id), variant: 'green', full: true },
                  ],
                }))}
              />
            </div>
          </>
        )}
      </div>

      {/* Estatísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total de Vagas</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{vagas.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Vagas Ativas</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {vagas.filter(v => v.isActive).length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total de Candidatos</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {vagas.reduce((acc, v) => acc + (v.totalCandidatos || 0), 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
