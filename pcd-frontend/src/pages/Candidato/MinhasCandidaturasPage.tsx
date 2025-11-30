import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useToast } from "../../components/common/Toast";
import ConfirmModal from "../../components/common/ConfirmModal";

interface Candidatura {
  id: number;
  status: string;
  createdAt: string;
  vaga: {
    id: number;
    titulo: string;
    empresa: { nome: string };
    modeloTrabalho?: string;
    localizacao?: string;
  };
}

interface Dashboard {
  candidaturasEnviadas: number;
  emAnalise: number;
  preSelecionado: number;
  entrevistaMarcada: number;
}

const statusLabels = {
  pendente: "Candidatura enviada",
  enviada: "Candidatura enviada", 
  em_analise: "Em análise",
  pre_selecionado: "Pré-selecionado",
  entrevista_marcada: "Entrevista marcada",
  nao_selecionado: "Não selecionado"
};

const statusColors = {
  pendente: "bg-blue-100 text-blue-800",
  enviada: "bg-blue-100 text-blue-800",
  em_analise: "bg-yellow-100 text-yellow-800", 
  pre_selecionado: "bg-green-100 text-green-800",
  entrevista_marcada: "bg-purple-100 text-purple-800",
  nao_selecionado: "bg-gray-100 text-gray-600"
};

export default function MinhasCandidaturasPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  // Checa se o usuário está autenticado e é candidato
  const storedUserId = localStorage.getItem('userId');
  const storedUserType = localStorage.getItem('userType');
  const isCandidatoAutenticado = storedUserId && storedUserType === 'candidato' && Number(storedUserId) === candidatoId;
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [candidaturaParaRemover, setCandidaturaParaRemover] = useState<number | null>(null);

  const { addToast } = useToast();

  const carregarDados = async () => {
    if (!isCandidatoAutenticado) {
      addToast({ type: 'error', message: 'Usuário não autenticado. Faça login novamente.' });
      setTimeout(() => window.location.href = '/login', 2000);
      return;
    }
    try {
      setLoading(true);
      const candidaturasData = await api.listarCandidaturas(candidatoId).catch(err => {
        if ((import.meta as any).env?.DEV && err?.status !== 401 && err?.status !== 403) console.error('Erro ao listar candidaturas:', err);
        return [];
      });
      const dashboardData = await api.obterDashboardCandidaturas(candidatoId).catch(err => {
        if ((import.meta as any).env?.DEV && err?.status !== 401 && err?.status !== 403) console.error('Erro ao obter dashboard:', err);
        return { candidaturasEnviadas: 0, emAnalise: 0, preSelecionado: 0, entrevistaMarcada: 0 };
      });
      setCandidaturas(candidaturasData);
      setDashboard(dashboardData);
    } catch (err: any) {
      if ((import.meta as any).env?.DEV) console.error('Erro geral ao carregar dados:', err);
      if (err?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        addToast({ type: 'error', message: 'Usuário não autorizado ou sessão expirada. Faça login novamente.' });
        setTimeout(() => window.location.href = '/login', 2000);
      } else {
        addToast({ type: 'error', message: err?.message ?? 'Erro ao carregar dados' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (candidatoId) {
      carregarDados();
    }
    // Listener para atualizar quando nova candidatura for criada
    const handleCandidaturaCreated = () => {
      carregarDados();
    };
    // Listener para quando a página fica visível novamente
    const handleFocus = () => {
      carregarDados();
    };
    window.addEventListener('candidaturaCreated', handleCandidaturaCreated);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('candidaturaCreated', handleCandidaturaCreated);
      window.removeEventListener('focus', handleFocus);
    };
  }, [candidatoId]);

  const abrirModalConfirmacao = (vagaId: number) => {
    setCandidaturaParaRemover(vagaId);
    setShowConfirmModal(true);
  };

  const confirmarRemocao = async () => {
    if (!candidaturaParaRemover) return;
    try {
      await api.retirarCandidatura(candidaturaParaRemover, candidatoId);
      addToast({ type: 'success', message: 'Candidatura retirada com sucesso' });
      carregarDados();
    } catch (err: any) {
      addToast({ type: 'error', message: err?.message ?? 'Erro ao retirar candidatura' });
    } finally {
      setShowConfirmModal(false);
      setCandidaturaParaRemover(null);
    }
  };

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Minhas Candidaturas</h1>

      {/* Mini-Dashboard */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{dashboard.candidaturasEnviadas}</div>
            <div className="text-sm text-gray-600">Candidaturas enviadas</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-yellow-600">{dashboard.emAnalise}</div>
            <div className="text-sm text-gray-600">Em análise</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{dashboard.preSelecionado}</div>
            <div className="text-sm text-gray-600">Pré-selecionado</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">{dashboard.entrevistaMarcada}</div>
            <div className="text-sm text-gray-600">Entrevista marcada</div>
          </div>
        </div>
      )}

      {/* Lista de Candidaturas */}
      <div className="space-y-4">
        {candidaturas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma candidatura encontrada
          </div>
        ) : (
          candidaturas.map((candidatura) => (
            <div key={candidatura.id} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{candidatura.vaga.titulo}</h3>
                  <p className="text-gray-600">{candidatura.vaga.empresa.nome}</p>
                  <p className="text-sm text-gray-500">
                    {candidatura.vaga.localizacao} • {candidatura.vaga.modeloTrabalho}
                  </p>
                  <p className="text-sm text-gray-500">
                    Candidatura em: {new Date(candidatura.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[candidatura.status as keyof typeof statusColors]}`}>
                    {statusLabels[candidatura.status as keyof typeof statusLabels]}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.open(`/vagas/${candidatura.vaga.id}`, '_blank')}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Ver detalhes
                    </button>
                    <button 
                      onClick={() => abrirModalConfirmacao(candidatura.vaga.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Retirar candidatura
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirmar Remoção"
        message="Tem certeza que deseja retirar esta candidatura?"
        confirmText="Sim, retirar"
        onConfirm={confirmarRemocao}
        onCancel={() => setShowConfirmModal(false)}
        danger
      />
    </div>
  );
}