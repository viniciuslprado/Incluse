import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Barreira, SubtipoDeficiencia } from "../../types";

type Props = {
  candidatoId: number;
  subtipo: SubtipoDeficiencia;
};

export default function CandidatoBarreirasForm({ candidatoId, subtipo }: Props) {
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [selecionadas, setSelecionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    api
      .listarBarreirasPorSubtipo(subtipo.id)
      .then((b) => setBarreiras(b))
      .catch((e) => setErro(e.message));
  }, [subtipo.id]);

  function toggle(id: number) {
    setSelecionadas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleSalvar() {
    setErro(null);
    if (!selecionadas.length) {
      setErro("Selecione pelo menos uma barreira.");
      return;
    }
    setLoading(true);
    try {
      await api.vincularBarreirasACandidato(candidatoId, subtipo.id, selecionadas);
      setOk(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErro(msg || "Erro ao salvar barreiras");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card space-y-3">
      <div>
        <h4 className="font-semibold">Barreiras para {subtipo.nome}</h4>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {barreiras.map((b) => (
            <label key={b.id} className="flex items-center space-x-2">
              <input type="checkbox" checked={selecionadas.includes(b.id)} onChange={() => toggle(b.id)} />
              <span>{b.descricao}</span>
            </label>
          ))}
        </div>
      </div>

      {erro && <p className="error">{erro}</p>}

      <div className="flex justify-end">
        <button disabled={loading} onClick={handleSalvar} className="btn btn-primary">
          {loading ? "Salvando..." : "Salvar barreiras"}
        </button>
      </div>

      {ok && <p className="text-sm text-green-600">✅ Barreiras vinculadas com sucesso</p>}
    </div>
  );
}
