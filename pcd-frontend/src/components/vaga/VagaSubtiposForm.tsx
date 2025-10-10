import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { SubtipoDeficiencia } from "../../types";

type Props = {
  vagaId: number;
};

export default function VagaSubtiposForm({ vagaId }: Props) {
  const [subtipos, setSubtipos] = useState<SubtipoDeficiencia[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function carregarSubtipos() {
    try {
      const data = await api.listarSubtipos(); // GET /subtipos
      setSubtipos(data); // se backend retorna agrupado por tipo
    } catch (err: any) {
      setErro(err.message ?? "Erro ao carregar subtipos");
    }
  }

  async function handleSalvar() {
    setErro(null);
    setOk(false);
    if (!selecionados.length) {
      setErro("Selecione ao menos um subtipo.");
      return;
    }

    setLoading(true);
    try {
      await api.vincularSubtiposAVaga(vagaId, selecionados);
      setOk(true);
    } catch (err: any) {
      setErro(err.message ?? "Erro ao vincular subtipos");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelecionado(id: number) {
    setSelecionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  useEffect(() => {
    carregarSubtipos();
  }, []);

  return (
    <div className="card space-y-3">
      <h3 className="text-lg font-semibold">Selecionar subtipos para a vaga</h3>

      {erro && <p className="text-red-600">{erro}</p>}
      {ok && <p className="text-green-600">Subtipos vinculados com sucesso!</p>}

      <div className="max-h-60 overflow-y-auto space-y-2">
        {subtipos.map((s) => (
          <label key={s.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selecionados.includes(s.id)}
              onChange={() => toggleSelecionado(s.id)}
            />
            <span>{s.nome}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSalvar}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Salvando..." : "Salvar subtipos"}
        </button>
      </div>
    </div>
  );
}
