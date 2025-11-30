import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import type { Vaga } from "../types";

export default function CandidatoInicioPage() {
  const { user } = useAuth();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVagas() {
      if (!user || user.tipo !== "candidato") return;
      setLoading(true);
      try {
        const resp = await axios.get(`/candidato/${user.id}/inicio`);
        setVagas(resp.data.vagasRecomendadas || []);
      } catch (e: any) {
        setErro(e.message || "Erro ao buscar vagas");
      } finally {
        setLoading(false);
      }
    }
    fetchVagas();
  }, [user]);

  if (loading) return <div>Carregando vagas recomendadas...</div>;
  if (erro) return <div className="text-red-500">{erro}</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Vagas Recomendadas</h1>
      {vagas.length === 0 ? (
        <div>Nenhuma vaga compatível encontrada.</div>
      ) : (
        <ul className="space-y-4">
          {vagas.map(vaga => (
            <li key={vaga.id} className="border rounded p-4 bg-white shadow">
              <div className="font-semibold text-lg">{vaga.titulo}</div>
              <div className="text-gray-600">{vaga.empresa?.nome}</div>
              <div className="text-gray-500 text-sm">{vaga.cidade} {vaga.estado}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
