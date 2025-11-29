import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { FiSearch, FiUser, FiCalendar, FiMessageSquare, FiX, FiCheckCircle, FiFileText, FiDownload } from 'react-icons/fi';

interface Candidato {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  dataCandidatura: string;
  vagaId: number;
  vagaTitulo?: string;
  etapa?: string;
  compatibilidade?: number;
}

export default function CandidatosGeralPage() {
  const { id } = useParams<{ id: string }>();
  const empresaId = Number(id);
  const navigate = useNavigate();
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroEtapa, setFiltroEtapa] = useState<string>('todas');
  const [candidatoSelecionado, setCandidatoSelecionado] = useState<Candidato | null>(null);

  useEffect(() => {
    carregarCandidatos();
  }, [empresaId]);

  async function carregarCandidatos() {
    try {
      setLoading(true);
      const vagasResult = await api.listarVagasPorEmpresa(empresaId);
      const vagas = Array.isArray(vagasResult) ? vagasResult : vagasResult.data;

      const todosCandidatos: Candidato[] = [];
      for (const vaga of vagas) {
        try {
          const candidatosVaga = await api.listarCandidatosPorVaga(vaga.id);
          const candidatosComVaga = candidatosVaga.map((c: any) => ({
            ...c,
            vagaId: vaga.id,
            vagaTitulo: vaga.titulo || 'Vaga sem título',
            etapa: c.etapa || 'Análise de currículo',
            dataCandidatura: c.dataCandidatura || c.createdAt || new Date().toISOString()
          }));
          todosCandidatos.push(...candidatosComVaga);
        } catch (error) {
          console.error(`Erro ao carregar candidatos da vaga ${vaga.id}:`, error);
        }
      }

      setCandidatos(todosCandidatos);
    } catch (error) {
      console.error('Erro ao carregar candidatos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function avancarEtapa(candidato: Candidato) {
    try {
      // Implementar lógica de avanço de etapa
      alert(`Candidato ${candidato.nome} avançado para próxima etapa`);
    } catch (error) {
      console.error('Erro ao avançar etapa:', error);
    }
  }

  async function rejeitarCandidato(candidato: Candidato) {
    if (!confirm(`Deseja rejeitar o candidato ${candidato.nome}?`)) return;
    
    try {
      // Implementar lógica de rejeição
      alert(`Candidato ${candidato.nome} rejeitado`);
      carregarCandidatos();
    } catch (error) {
      console.error('Erro ao rejeitar candidato:', error);
    }
  }

  async function exportarCandidatos() {
    try {
      // Implementar lógica de exportação para CSV
      const csv = [
        ['Nome', 'Email', 'Telefone', 'Vaga', 'Etapa', 'Data da Candidatura'].join(','),
        ...candidatosFiltrados.map(c => 
          [c.nome, c.email, c.telefone || '', c.vagaTitulo, c.etapa, new Date(c.dataCandidatura).toLocaleDateString('pt-BR')].join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `candidatos_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (error) {
      console.error('Erro ao exportar candidatos:', error);
    }
  }

  const etapas = ['Análise de currículo', 'Triagem', 'Entrevista', 'Teste prático', 'Aprovado', 'Rejeitado'];

  const candidatosFiltrados = candidatos
    .filter(c => 
      (busca === '' || 
       c.nome.toLowerCase().includes(busca.toLowerCase()) ||
       c.email.toLowerCase().includes(busca.toLowerCase()) ||
       c.vagaTitulo?.toLowerCase().includes(busca.toLowerCase())) &&
      (filtroEtapa === 'todas' || c.etapa === filtroEtapa)
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Candidatos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gerencie todos os candidatos das suas vagas</p>
        </div>
        <button
          onClick={exportarCandidatos}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <FiDownload className="w-4 h-4" />
          Exportar CSV
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
              placeholder="Buscar por nome, email ou vaga..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro de Etapa */}
          <div className="w-full md:w-64">
            <select
              value={filtroEtapa}
              onChange={(e) => setFiltroEtapa(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todas as Etapas</option>
              {etapas.map(etapa => (
                <option key={etapa} value={etapa}>{etapa}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total de Candidatos</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{candidatos.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Em Análise</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {candidatos.filter(c => c.etapa === 'Análise de currículo').length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Em Entrevista</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {candidatos.filter(c => c.etapa === 'Entrevista').length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Aprovados</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {candidatos.filter(c => c.etapa === 'Aprovado').length}
          </div>
        </div>
      </div>

      {/* Lista de Candidatos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {candidatosFiltrados.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Nenhum candidato encontrado
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {candidatosFiltrados.map((candidato) => (
              <div key={`${candidato.vagaId}-${candidato.id}`} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{candidato.nome}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{candidato.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 ml-13">
                      <span className="flex items-center gap-1">
                        <FiFileText className="w-4 h-4" />
                        {candidato.vagaTitulo}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        {new Date(candidato.dataCandidatura).toLocaleDateString('pt-BR')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        candidato.etapa === 'Aprovado' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        candidato.etapa === 'Rejeitado' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        candidato.etapa === 'Entrevista' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {candidato.etapa}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCandidatoSelecionado(candidato)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Ver perfil"
                    >
                      <FiFileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => avancarEtapa(candidato)}
                      className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                      title="Avançar etapa"
                    >
                      <FiCheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => alert('Funcionalidade de mensagem em desenvolvimento')}
                      className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                      title="Enviar mensagem"
                    >
                      <FiMessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => rejeitarCandidato(candidato)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Rejeitar"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Perfil do Candidato */}
      {candidatoSelecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setCandidatoSelecionado(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Perfil do Candidato</h2>
                <button
                  onClick={() => setCandidatoSelecionado(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nome</label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">{candidatoSelecionado.nome}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">{candidatoSelecionado.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Vaga</label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">{candidatoSelecionado.vagaTitulo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Etapa Atual</label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">{candidatoSelecionado.etapa}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Data da Candidatura</label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">
                    {new Date(candidatoSelecionado.dataCandidatura).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => navigate(`/empresa/${empresaId}/candidato/${candidatoSelecionado.id}`)}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Ver Perfil Completo
                </button>
                <button
                  onClick={() => setCandidatoSelecionado(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
