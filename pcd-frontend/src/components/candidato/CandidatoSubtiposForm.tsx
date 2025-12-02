import { useEffect, useState, useRef } from "react";
import { api } from "../../lib/api";
import type { SubtipoDeficiencia } from "../../types";

type Props = {
  candidatoId: number;
  onUpdated?: () => void;
  disableActions?: boolean;
  onChange?: (selecionados: SubtipoDeficiencia[]) => void;
  initialSelected?: number[];
  autoSync?: boolean; // se true, sincroniza imediatamente a cada toggle
  allSubtipos: SubtipoDeficiencia[]; // todos os subtipos públicos
};

export default function CandidatoSubtiposForm({ candidatoId, onUpdated, disableActions, onChange, initialSelected, autoSync, allSubtipos }: Props) {
  const [subtipos, setSubtipos] = useState<SubtipoDeficiencia[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const previousSelecionadosRef = useRef<string>('');


  // Sempre exibe todos os subtipos públicos
  useEffect(() => {
    setSubtipos(allSubtipos || []);
  }, [allSubtipos]);

  // Se não receber initialSelected, busca do backend ao montar
  useEffect(() => {
    if ((!initialSelected || initialSelected.length === 0) && candidatoId) {
      api.listarSubtiposCandidato(candidatoId)
        .then((res: any[]) => {
          setSelecionados(res.map((s: any) => s.subtipo?.id || s.id));
        })
        .catch(() => {});
    }
  }, [candidatoId, initialSelected]);

  // Exibe todos os subtipos como lista, sem filtro/pesquisa
  const visiveis = subtipos;

  // Sempre sincroniza seleção com initialSelected, se mudar
  useEffect(() => {
    if (initialSelected && initialSelected.length) {
      setSelecionados(initialSelected);
    }
  }, [JSON.stringify(initialSelected)]);

  // Notify parent when selection changes (evita loops comparando valor anterior)
  useEffect(() => {
    if (selecionados.length > 0 && subtipos.length > 0) {
      const currentKey = selecionados.sort().join(',');
      if (currentKey !== previousSelecionadosRef.current) {
        previousSelecionadosRef.current = currentKey;
        const selectedObjects = subtipos.filter((s) => selecionados.includes(s.id));
        console.log('[CandidatoSubtiposForm] onChange disparado:', selectedObjects);
        onChange?.(selectedObjects);
      }
    }
  }, [selecionados, subtipos, onChange]);

  async function sync(nextIds: number[]) {
    try {
      await api.vincularSubtiposACandidato(candidatoId, nextIds);
      setOk(true);
      onUpdated?.();
      // Após salvar, buscar do backend para garantir consistência
      const atualizados = await api.listarSubtiposCandidato(candidatoId);
      setSelecionados(atualizados.map((s: any) => s.subtipo?.id || s.id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErro(msg || "Erro ao sincronizar subtipos");
    }
  }

  function toggle(id: number) {
    setSelecionados((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      console.log('[CandidatoSubtiposForm] toggle', { id, prev, next });
      // Validação: não permitir desmarcar o último subtipo
      if (next.length === 0) {
        setErro("Você deve ter pelo menos um tipo de deficiência selecionado.");
        return prev; // mantém seleção anterior
      }
      setErro(null);
      if (autoSync && !disableActions) {
        sync(next);
      }
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
        await sync(selecionados);
      } else {
        setOk(true);
      }
    } catch (e) {
      // erro já tratado em sync
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card space-y-3" onSubmit={(e: React.FormEvent) => e.preventDefault()}>
      <div>
        <label className="label">Selecione seus subtipos</label>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {visiveis.length === 0 ? (
            <div className="text-sm text-gray-500">
              {erro ? (
                <div>
                  <div>Não foi possível carregar os subtipos: {erro}</div>
                  <button type="button" className="mt-2 px-2 py-1 border rounded text-sm" onClick={() => { setErro(null); setLoading(true); api.listarSubtiposCandidato(candidatoId).then((r: SubtipoDeficiencia[]) => { setSubtipos(r); setLoading(false); }).catch((e: any) => { setErro(e.message); setLoading(false); }); }}>
                    Tentar novamente
                  </button>
                </div>
              ) : (
                <div>Selecione primeiro o <b>Tipo de Deficiência</b> para ver os subtipos disponíveis.</div>
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

      {!disableActions && !autoSync ? (
        <div className="flex justify-end">
          <button disabled={loading} onClick={handleSalvar} className="btn btn-primary">
            {loading ? "Salvando..." : "Salvar subtipos"}
          </button>
        </div>
      ) : null}

      {ok && <p className="text-sm text-green-600">✅ Operação concluída</p>}
    </form>
  );
}
