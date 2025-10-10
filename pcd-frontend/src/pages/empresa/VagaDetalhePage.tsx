import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import VagaSubtiposForm from "../../components/vaga/VagaSubtiposForm";
import type { Vaga } from "../../types";

export default function VagaDetalhePage() {
  const { id, vagaId } = useParams();
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

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

  useEffect(() => {
    carregar();
  }, [vagaId]);

  return (
    <div className="container-page space-y-6 py-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Detalhes da Vaga #{vagaId}
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

          {/* Aqui entra o formulário de subtipos */}
          <VagaSubtiposForm vagaId={vaga.id} />

          {/* Depois, futuramente, adicionaremos o VagaAcessibilidadesForm */}
        </>
      ) : (
        <div className="card text-gray-500">Vaga não encontrada.</div>
      )}
    </div>
  );
}
