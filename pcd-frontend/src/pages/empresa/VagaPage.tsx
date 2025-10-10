import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";

import type { Vaga } from "../../types";
import VagaForm from "../../components/vaga/VagaForm";
import VagaList from "../../components/vaga/VagaList";

export default function VagasPage() {
  const { id } = useParams(); // id da empresa
  const empresaId = Number(id);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setErro(null);
    setLoading(true);
    try {
      const data = await api.listarVagas(empresaId);
      setVagas(data);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar vagas");
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useEffect(() => {
    console.log(`Empresa ID ${empresaId}`)
    if (!empresaId || isNaN(empresaId))
      return
    carregar();
  }, [empresaId, carregar]);

  return (
    <div className="container-page space-y-6 py-8">
      <header>
        <h1 className="text-2xl font-bold">Vagas da Empresa</h1>
        <p className="text-gray-600">Crie e visualize as vagas cadastradas.</p>
      </header>

      <VagaForm empresaId={empresaId} onCreated={carregar} />

      {loading ? (
        <div className="card">Carregando...</div>
      ) : erro ? (
        <div className="card text-red-600">{erro}</div>
      ) : (
        <VagaList vagas={vagas} />
      )}
    </div>
  );
}
