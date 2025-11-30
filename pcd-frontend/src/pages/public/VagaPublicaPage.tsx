import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../components/common/Toast";
import { api } from "../../lib/api";
import type { Vaga } from "../../types";
import { FiArrowLeft, FiMapPin, FiSend } from "react-icons/fi";
import { addCandidatura, isVagaApplied, removeCandidatura } from "../../lib/localStorage";

export default function VagaPublicaPage() {
  const { vagaId } = useParams();
  const navigate = useNavigate();
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const { addToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  // Redireciona para /login se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  // Usa o contexto de autenticação para obter o id do candidato
  const candidatoId = user && user.tipo === 'candidato' ? user.id : null;
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!candidatoId || !vagaId) {
      setApplied(false);
      return;
    }
    setApplied(isVagaApplied(candidatoId, Number(vagaId)));
  }, [candidatoId, vagaId]);

  function handleToggleApply() {
    if (!candidatoId || !user || user.tipo !== 'candidato') {
      addToast({ type: 'error', title: 'Não autenticado', message: 'Você precisa estar logado como candidato para se candidatar.' });
      return;
    }
    if (!vaga) return;
    if (applied) {
      const removed = removeCandidatura(candidatoId, vaga.id);
      if (removed) {
        setApplied(false);
        addToast({ type: 'info', title: 'Candidatura removida', message: 'Você removeu sua candidatura desta vaga.' });
      } else {
        addToast({ type: 'error', title: 'Erro', message: 'Não foi possível remover a candidatura.' });
      }
      return;
    }
    const added = addCandidatura(candidatoId, vaga);
    if (added) {
      setApplied(true);
      addToast({ type: 'success', title: 'Candidatura enviada', message: 'Sua candidatura foi registrada com sucesso!' });
    } else {
      addToast({ type: 'info', title: 'Já registrado', message: 'Você já está candidatado.' });
      setApplied(true);
    }
  }

  useEffect(() => {
    async function carregar() {
      setErro(null);
      setLoading(true);
      try {
        const data = await api.obterVaga(Number(vagaId));
        setVaga(data);
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro ao carregar vaga");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [vagaId]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-8 text-center">
            Carregando vaga...
          </div>
        </div>
      </div>
    );
  }

  if (erro || !vaga) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-8">
            <p className="text-red-600 mb-4">{erro || "Vaga não encontrada"}</p>
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              <FiArrowLeft /> Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline flex items-center gap-2"
          >
            <FiArrowLeft /> Voltar
          </button>
          {candidatoId && (
            <button
              onClick={handleToggleApply}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded transition-colors ${applied ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
            >
              <FiSend />
              <span>{applied ? 'Remover candidatura' : 'Candidatar-se'}</span>
            </button>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 border rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">{vaga.titulo}</h1>
            <p className="text-blue-100 text-lg">{vaga.empresa?.nome}</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-3">
              <FiMapPin className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Localização</p>
                <p className="font-medium">{vaga.cidade && vaga.estado ? `${vaga.cidade}, ${vaga.estado}` : '—'}</p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Descrição</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{vaga.descricao || 'Sem descrição detalhada.'}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Escolaridade Mínima</h2>
              <p className="text-gray-700 dark:text-gray-300">{vaga.escolaridade || 'Não especificada'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
