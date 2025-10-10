import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Acessibilidade } from "../../types";
import AcessibilidadeForm from "../../components/admin/AcessibilidadeForm";
import VincularAcessibilidadeForm from "../../components/admin/VincularAcessibilidadeForm";
import AcessibilidadeList from "../../components/admin/AcessibilidadeList";

export default function AcessibilidadesPage() {
  const [acessibilidades, setAcessibilidades] = useState<Acessibilidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    setErro(null);
    setLoading(true);
    try {
      const data = await api.listarAcessibilidades();
      setAcessibilidades(data);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar acessibilidades");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="container-page space-y-6 py-8">
      <header>
        <h1 className="text-2xl font-bold">Acessibilidades</h1>
        <p className="text-gray-600">
          Crie e gerencie as acessibilidades do sistema.
        </p>
      </header>

      <AcessibilidadeForm onCreated={carregar} />
      
      <VincularAcessibilidadeForm onLinked={carregar} />

      {loading ? (
        <div className="card">Carregando...</div>
      ) : erro ? (
        <div className="card text-red-600">{erro}</div>
      ) : (
        <AcessibilidadeList acessibilidades={acessibilidades} />
      )}
    </div>
  );
}
