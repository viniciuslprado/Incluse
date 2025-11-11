import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { api } from "../../lib/api";
import VagaSubtiposForm from "../../components/vaga/VagaSubtiposForm";
import VagaAcessibilidadesForm from "../../components/vaga/VagaAcessibilidadesForm";
import type { Vaga } from "../../types";

export default function VagaDetalhePage() {
  const { id, vagaId } = useParams();
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [subtiposSelecionados, setSubtiposSelecionados] = useState<number[]>([]);

  const carregar = useCallback(async () => {
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
  }, [vagaId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <div className="container-page space-y-6 py-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {vaga ? (vaga.titulo || vaga.descricao) : `Detalhes da Vaga #${vagaId}`}
          </h1>
          <p className="text-gray-600">Gerencie os subtipos e acessibilidades desta vaga.</p>
        </div>
        <Link
          to={`/empresa/${id}`}
          className="text-blue-600 hover:underline"
        >
          ← Voltar
        </Link>
      </header>

      {loading ? (
        <div className="card">Carregando...</div>
      ) : erro ? (
        <div className="card text-red-600">{erro}</div>
      ) : vaga ? (
        <>
          <div className="card">
            <h2 className="text-lg font-semibold mb-2">{vaga.descricao}</h2>
            <p className="text-sm text-gray-500">
              Escolaridade: {vaga.escolaridade || "Não informada"}
            </p>
          </div>

          {/* Formulário de subtipos (eleva seleção para este componente) */}
          <VagaSubtiposForm vagaId={vaga.id} onChange={(sel) => setSubtiposSelecionados(sel)} />

          {/* Formulário de acessibilidades - mostra apenas acessibilidades ligadas aos subtipos selecionados */}
          <VagaAcessibilidadesForm vagaId={vaga.id} subtiposSelecionados={subtiposSelecionados} />
        </>
      ) : (
        <div className="card text-gray-500">Vaga não encontrada.</div>
      )}
    </div>
  );
}
