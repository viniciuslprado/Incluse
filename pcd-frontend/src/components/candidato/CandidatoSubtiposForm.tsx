import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { SubtipoDeficiencia } from "../../types";

type Props = {
  candidatoId: number;
  onUpdated?: () => void;
};

export default function CandidatoSubtiposForm({ candidatoId, onUpdated }: Props) {
  const [subtipos, setSubtipos] = useState<SubtipoDeficiencia[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    api.listarSubtipos().then(setSubtipos).catch((e) => setErro(e.message));
  }, []);

  function toggle(id: number) {
    setSelecionados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleSalvar() {
    setErro(null);
    if (!selecionados.length) {
      setErro("Selecione pelo menos um subtipo.");
      return;
    }
    setLoading(true);
    try {
      await api.vincularSubtiposACandidato(candidatoId, selecionados);
      setOk(true);
      onUpdated?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErro(msg || "Erro ao vincular subtipos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card space-y-3" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="label">Selecione seus subtipos</label>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {subtipos.map((s) => (
            <label key={s.id} className="flex items-center space-x-2">
              <input type="checkbox" checked={selecionados.includes(s.id)} onChange={() => toggle(s.id)} />
              <span>{s.nome}</span>
            </label>
          ))}
        </div>
      </div>

      {erro && <p className="error">{erro}</p>}

      <div className="flex justify-end">
        <button disabled={loading} onClick={handleSalvar} className="btn btn-primary">
          {loading ? "Salvando..." : "Vincular subtipos"}
        </button>
      </div>

      {ok && <p className="text-sm text-green-600">✅ Subtipos vinculados com sucesso</p>}
    </form>
  );
}
