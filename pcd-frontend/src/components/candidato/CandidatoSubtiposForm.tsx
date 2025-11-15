import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { SubtipoDeficiencia } from "../../types";

type Props = {
  candidatoId: number;
  onUpdated?: () => void;
  disableActions?: boolean;
  onChange?: (selecionados: SubtipoDeficiencia[]) => void;
  initialSelected?: number[];
};

export default function CandidatoSubtiposForm({ candidatoId, onUpdated, disableActions, onChange, initialSelected }: Props) {
  const [subtipos, setSubtipos] = useState<SubtipoDeficiencia[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    api.listarSubtipos().then(setSubtipos).catch((e) => setErro(e.message));
  }, []);

  const visiveis = subtipos.filter((s) => s.nome.toLowerCase().includes(filtro.toLowerCase()));

  // initialize selection from prop if provided
  useEffect(() => {
    if (initialSelected && initialSelected.length) setSelecionados(initialSelected);
  }, [initialSelected]);

  function toggle(id: number) {
    setSelecionados((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      // pass full subtipo objects to parent
      const selectedObjects = subtipos.filter((s) => next.includes(s.id));
      onChange?.(selectedObjects);
      return next;
    });
  }

  async function handleSalvar() {
    setErro(null);
    if (!selecionados.length) {
      setErro("Selecione pelo menos um subtipo.");
      return;
    }
    setLoading(true);
    try {
      if (!disableActions) {
        await api.vincularSubtiposACandidato(candidatoId, selecionados);
        setOk(true);
        onUpdated?.();
      } else {
        // In readonly/edit-local mode we don't call the API; just mark ok
        setOk(true);
      }
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
        <div className="flex gap-2 items-center mb-2">
          <input placeholder="Filtrar por nome" value={filtro} onChange={(e) => setFiltro(e.target.value)} className="border rounded p-1 text-sm flex-1" />
          <button type="button" className="px-2 py-1 border rounded text-sm" onClick={() => setSelecionados(visiveis.map((s) => s.id))}>
            Selecionar visíveis
          </button>
        </div>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {visiveis.length === 0 ? (
            <div className="text-sm text-gray-500">
              {erro ? (
                <div>
                  <div>Não foi possível carregar os subtipos: {erro}</div>
                  <button type="button" className="mt-2 px-2 py-1 border rounded text-sm" onClick={() => { setErro(null); setLoading(true); api.listarSubtipos().then((r) => { setSubtipos(r); setLoading(false); }).catch((e) => { setErro(e.message); setLoading(false); }); }}>
                    Tentar novamente
                  </button>
                </div>
              ) : (
                <div>Não há subtipos disponíveis no momento.</div>
              )}
            </div>
          ) : (
            visiveis.map((s) => (
              <label key={s.id} className="flex items-center space-x-2">
                <input type="checkbox" checked={selecionados.includes(s.id)} onChange={() => toggle(s.id)} />
                <span>{s.nome}</span>
              </label>
            ))
          )}
        </div>
      </div>

      {erro && <p className="error">{erro}</p>}

      {!disableActions ? (
        <div className="flex justify-end">
          <button disabled={loading} onClick={handleSalvar} className="btn btn-primary">
            {loading ? "Salvando..." : "Vincular subtipos"}
          </button>
        </div>
      ) : (
        <div className="text-sm text-gray-600">Alterações são salvas localmente no perfil.</div>
      )}

      {ok && <p className="text-sm text-green-600">✅ Operação concluída</p>}
    </form>
  );
}
