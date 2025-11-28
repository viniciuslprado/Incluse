import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import ResponsiveCardList from '../../components/common/ResponsiveCardList';

interface Vaga {
  id: number;
  titulo: string;
  descricao?: string;
  status: string; // ativa, pausada, encerrada
  createdAt: string;
  _count?: { candidaturas?: number };
  candidaturasCount?: number; // mapeado manualmente
}

export default function VagaPage() {
  const { id } = useParams<{ id: string }>();
  const empresaId = Number(id);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarVagas() {
      try {
        const result = await api.listarVagas();
        const lista = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];
        setVagas(lista as any);
      } catch (error) {
        setErro('Erro ao carregar vagas');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    carregarVagas();
  }, []);

  const handleToggleStatus = async (vagaId: number, currentStatus: boolean) => {
    try {
      const novoStatus = currentStatus ? 'pausada' : 'ativa';
      await api.atualizarStatusVaga(vagaId, novoStatus);
      setVagas(prev => prev.map(v => v.id === vagaId ? { ...v, status: novoStatus } : v));
    } catch (error) {
      console.error('Erro ao alterar status da vaga:', error);
    }
  };

  const handleDeleteVaga = async (vagaId: number) => {
    if (!confirm('Tem certeza que deseja excluir esta vaga?')) return;
    
    try {
      // await api.excluirVaga(vagaId);
      setVagas(prev => prev.filter(v => v.id !== vagaId));
    } catch (error) {
      console.error('Erro ao excluir vaga:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { text: string; classes: string }> = {
      ativa: { text: 'Ativa', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      pausada: { text: 'Pausada', classes: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
      encerrada: { text: 'Encerrada', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
    };
    const info = map[status] || map['pausada'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${info.classes}`}>
        {info.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestão de Vagas</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gerencie suas vagas publicadas</p>
        </div>
        <Link
          to={`/empresa/${empresaId}/vagas/nova`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Vaga
        </Link>
      </div>

      {erro && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700 dark:text-red-300">{erro}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Tabela (desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Vaga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Candidatos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {vagas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V8m8 0V6a2 2 0 00-2-2H10a2 2 0 00-2 2v2" />
                      </svg>
                      <p className="text-lg font-medium">Nenhuma vaga encontrada</p>
                      <p className="mt-1">Comece criando sua primeira vaga</p>
                    </div>
                  </td>
                </tr>
              ) : (
                vagas.map((vaga) => (
                  <tr key={vaga.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {vaga.titulo || 'Sem título'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {(vaga.descricao?.substring(0, 100) ?? '') + (vaga.descricao ? '...' : '')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(vaga.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {vaga.candidaturasCount ?? vaga._count?.candidaturas ?? 0} candidatos
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(vaga.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      <Link
                        to={`/empresa/${empresaId}/vagas/${vaga.id}/candidatos`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Ver Candidatos
                      </Link>
                      <Link
                        to={`/empresa/${empresaId}/vagas/${vaga.id}/editar`}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(vaga.id, vaga.status === 'ativa')}
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                      >
                        {vaga.status === 'ativa' ? 'Pausar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => handleDeleteVaga(vaga.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cards (mobile) */}
        <div className="md:hidden">
          <ResponsiveCardList
            className=""
            emptyMessage="Nenhuma vaga encontrada. Comece criando sua primeira vaga."
            items={vagas.map((vaga) => ({
              id: vaga.id,
              title: vaga.titulo || 'Sem título',
              description: vaga.descricao,
              badge: { text: vaga.status === 'ativa' ? 'Ativa' : vaga.status === 'pausada' ? 'Pausada' : 'Encerrada', color: vaga.status === 'ativa' ? 'green' : vaga.status === 'pausada' ? 'gray' : 'red' },
              meta: [
                { label: 'Candidatos', value: `${vaga.candidaturasCount ?? vaga._count?.candidaturas ?? 0}` },
                { label: 'Criada em', value: new Date(vaga.createdAt).toLocaleDateString() },
              ],
              actions: [
                { label: 'Ver Candidatos', to: `/empresa/${empresaId}/vagas/${vaga.id}/candidatos`, variant: 'blue' },
                { label: 'Editar', to: `/empresa/${empresaId}/vagas/${vaga.id}/editar`, variant: 'indigo' },
                { label: vaga.status === 'ativa' ? 'Pausar' : 'Ativar', onClick: () => handleToggleStatus(vaga.id, vaga.status === 'ativa'), variant: 'yellow', full: true },
                { label: 'Excluir', onClick: () => handleDeleteVaga(vaga.id), variant: 'red', full: true },
              ],
            }))}
          />
        </div>
      </div>
    </div>
  );
}