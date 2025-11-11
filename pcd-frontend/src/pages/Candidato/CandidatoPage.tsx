import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";
import type { Candidato, CandidatoSubtipo } from "../../types";
import CandidatoSubtiposForm from "../../components/candidato/CandidatoSubtiposForm";
import CandidatoBarreirasForm from "../../components/candidato/CandidatoBarreirasForm";

export default function CandidatoPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const data = await api.getCandidato(candidatoId);
      setCandidato(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErro(msg || "Erro ao carregar candidato");
    } finally {
      setLoading(false);
    }
  }, [candidatoId]);

  useEffect(() => {
    if (!Number.isInteger(candidatoId) || candidatoId <= 0) return;
    carregar();
  }, [candidatoId, carregar]);

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!candidato) return <div className="p-6">Candidato não encontrado</div>;

  return (
    <div className="p-6">
      {erro && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 mb-4">
          <p className="text-sm text-red-700 dark:text-red-300">{erro}</p>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Perfil de {candidato.nome}</h1>

      <CandidatoSubtiposForm candidatoId={candidatoId} onUpdated={carregar} />

      <div className="mt-6 space-y-4">
        {candidato.subtipos?.map((s: CandidatoSubtipo) => (
          <CandidatoBarreirasForm key={s.subtipoId} candidatoId={candidatoId} subtipo={s.subtipo} />
        ))}
      </div>
    </div>
  );
}
