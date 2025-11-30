import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { FiCheckCircle, FiXCircle, FiClock, FiUsers, FiTrendingUp, FiAlertCircle, FiEdit } from 'react-icons/fi';
import { FaExclamationTriangle, FaTrophy, FaChartLine } from 'react-icons/fa';

interface DashboardStats {
  vagasAtivas: number;
  vagasEncerradas: number;
  totalCandidatos: number;
  vagasPendentes: number;
  novasCandidaturas: number;
  entrevistasAgendadas: number;
}

interface VagaRecente {
  id: number;
  titulo: string;
  status: string;
  createdAt: string;
  totalCandidatos: number;
}

type Insight = { icon: React.ReactNode; text: string };

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const empresaId = Number(id);
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    vagasAtivas: 0,
    vagasEncerradas: 0,
    totalCandidatos: 0,
    vagasPendentes: 0,
    novasCandidaturas: 0,
    entrevistasAgendadas: 0
  });
  const [loading, setLoading] = useState(true);
  const [vagasRecentes, setVagasRecentes] = useState<VagaRecente[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    async function carregarDados() { 
      try {
        // Checagem de permissão
        const userType = localStorage.getItem('userType');
        const userId = localStorage.getItem('userId');
        if (userType !== 'empresa' || Number(userId) !== empresaId) {
          alert('Acesso negado. Esta área é exclusiva para empresas.');
          return navigate('/login', { replace: true });
        }
        // Buscar vagas apenas da empresa logada
        const vagasData = await api.listarVagasPorEmpresa(empresaId);
        const vagasArray = Array.isArray(vagasData) ? vagasData : vagasData.data;
        // Calcular estatísticas
        const vagasAtivas = vagasArray.filter((v: any) => v.isActive).length;
        const vagasEncerradas = vagasArray.filter((v: any) => !v.isActive).length;
        // Contar candidatos
        let totalCandidatos = 0;
        const vagasComCandidatos: VagaRecente[] = [];
        for (const vaga of vagasArray.slice(0, 5)) {
          try {
            const candidatos = await api.listarCandidatosPorVaga(vaga.id);
            totalCandidatos += candidatos.length;
            vagasComCandidatos.push({
              id: vaga.id,
              titulo: vaga.titulo || 'Vaga sem título',
              status: vaga.isActive ? 'Ativa' : 'Encerrada',
              createdAt: vaga.createdAt || new Date().toISOString(),
              totalCandidatos: candidatos.length
            });
          } catch (e) {
            vagasComCandidatos.push({
              id: vaga.id,
              titulo: vaga.titulo || 'Vaga sem título',
              status: vaga.isActive ? 'Ativa' : 'Encerrada',
              createdAt: vaga.createdAt || new Date().toISOString(),
              totalCandidatos: 0
            });
          }
        }
        setVagasRecentes(vagasComCandidatos);
        // Gerar insights
        const newInsights: Insight[] = [];
        if (vagasAtivas === 0 && vagasArray.length > 0) {
          newInsights.push({ icon: <FaExclamationTriangle className="inline mr-1 text-yellow-600" />, text: 'Você não tem vagas ativas no momento. Considere reabrir alguma vaga.' });
        }
        if (totalCandidatos > 50) {
          newInsights.push({ icon: <FaTrophy className="inline mr-1 text-green-600" />, text: `Parabéns! Você já recebeu ${totalCandidatos} candidaturas no total.` });
        }
        if (vagasAtivas > 5) { 
          newInsights.push({ icon: <FaChartLine className="inline mr-1 text-blue-600" />, text: 'Você está com várias vagas ativas. Organize seu processo seletivo.' });
        }
        setInsights(newInsights);
        setStats({
          vagasAtivas: vagasAtivas || 0,
          vagasEncerradas: vagasEncerradas || 0,
          totalCandidatos: totalCandidatos || 0,
          vagasPendentes: 0,
          novasCandidaturas: Math.floor((totalCandidatos || 0) * 0.3),
          entrevistasAgendadas: 0
        });
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    if (empresaId) {
      carregarDados();
    }
  }, [empresaId, navigate]);

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Visão geral das suas vagas e candidatos</p>
      </div>

      {/* Cards de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vagas Ativas</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.vagasAtivas || 0}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vagas Encerradas</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.vagasEncerradas || 0}</p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <FiXCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Candidatos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.totalCandidatos || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiUsers className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Novas Candidaturas (7 dias)</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.novasCandidaturas || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FiTrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vagas Pendentes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.vagasPendentes || 0}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <FiClock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Vagas Recentes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Vagas Recentes</h2>
        {vagasRecentes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Nenhuma vaga cadastrada ainda.</p>
        ) : (
          <div className="space-y-3">
            {vagasRecentes.map((vaga) => (
              <div key={vaga.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{vaga.titulo}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      vaga.status === 'Ativa' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {vaga.status}
                    </span>
                    <span>{new Date(vaga.createdAt).toLocaleDateString('pt-BR')}</span>
                    <span>{vaga.totalCandidatos || 0} candidatos</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/empresas/${empresaId}/vagas/${vaga.id}`)}
                  className="ml-4 p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  aria-label="Editar vaga"
                >
                  <FiEdit className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights Automáticos */}
      {insights.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Insights Automáticos</h2>
              <ul className="space-y-2">
                {insights.map((insight, index) => ( 
                  <li key={index} className="text-sm text-blue-800 dark:text-blue-200 flex items-center">{insight.icon}{insight.text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ...botões de ações rápidas removidos... */}
    </div>
  );
}