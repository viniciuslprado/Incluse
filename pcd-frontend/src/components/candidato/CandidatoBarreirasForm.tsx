import { useEffect, useState, useRef } from "react";
import { api } from "../../lib/api";
import type { Barreira, SubtipoDeficiencia } from "../../types";

type Props = {
  candidatoId: number;
  subtipo: SubtipoDeficiencia;
  disableActions?: boolean;
  onChange?: (selecionadas: number[], niveis: Record<number, string>) => void;
  initialSelecionadas?: number[];
  initialNiveis?: Record<number, string>;
  barreirasOverride?: Barreira[];
  allBarreiras?: Barreira[]; // todas as barreiras públicas para o subtipo
  autoSync?: boolean; // sincroniza imediatamente os vínculos
};

export default function CandidatoBarreirasForm({ candidatoId, subtipo, disableActions, onChange, initialSelecionadas, initialNiveis, barreirasOverride, allBarreiras, autoSync }: Props) {
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [selecionadas, setSelecionadas] = useState<number[]>([]);
  const [niveis, setNiveis] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const previousStateRef = useRef<string>('');

  // Early return if subtipo is invalid
  if (!subtipo || subtipo.id === undefined || subtipo.id === null) {
    return (
      <div className="card space-y-3">
        <div className="text-sm text-gray-500">Subtipo inválido ou não selecionado.</div>
      </div>
    );
  }

  useEffect(() => {
    // Validação mais rigorosa do subtipo
    if (!subtipo || subtipo.id === undefined || subtipo.id === null) {
      setBarreiras([]);
      return;
    }
    // Se vier todas as barreiras públicas para o subtipo, use-as
    if (allBarreiras && allBarreiras.length) {
      setBarreiras(allBarreiras);
      return;
    }
    // if parent provided barreiras for this subtipo, use them as override
    if (barreirasOverride && barreirasOverride.length) {
      setBarreiras(barreirasOverride);
      return;
    }
    setErro(null);
    // Validar se o ID é um número válido
    const subtipoId = Number(subtipo.id);
    if (isNaN(subtipoId) || subtipoId <= 0) {
      setBarreiras([]);
      return;
    }
    api
      .listarBarreirasPorSubtipo(subtipoId)
      .then((b) => setBarreiras(b))
      .catch(() => {
        setBarreiras([]);
        setErro('Não foi possível carregar as barreiras para este subtipo.');
      });
  }, [subtipo?.id, barreirasOverride, allBarreiras]);

  useEffect(() => {
    if (initialSelecionadas && initialSelecionadas.length && selecionadas.length === 0) {
      setSelecionadas(initialSelecionadas);
    }
    if (initialNiveis && Object.keys(niveis).length === 0) {
      setNiveis(initialNiveis);
    }
  }, []);

  // Notify parent when selection changes (com proteção anti-loop)
  useEffect(() => {
    if (selecionadas.length > 0) {
      const currentState = JSON.stringify({ selecionadas: selecionadas.sort(), niveis });
      if (currentState !== previousStateRef.current) {
        previousStateRef.current = currentState;
        onChange?.(selecionadas, niveis);
      }
    }
  }, [selecionadas, niveis, onChange]);

  async function sync(nextIds: number[]) {
    try {
      await api.vincularBarreirasACandidato(candidatoId, Number(subtipo.id), nextIds);
      setOk(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErro(msg || "Erro ao sincronizar barreiras");
    }
  }

  function toggle(id: number) {
    setSelecionadas((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      
      // Validação: não permitir desmarcar a última barreira
      if (next.length === 0) {
        setErro("Você deve ter pelo menos uma barreira selecionada para este tipo de deficiência.");
        return prev; // mantém seleção anterior
      }
      
      setErro(null);
      if (autoSync && !disableActions) {
        sync(next);
      }
      return next;
    });
  }

  // níveis de barreira podem ser suportados futuramente

  async function handleSalvar() {
    setErro(null);
    if (!selecionadas.length) {
      setErro("Selecione pelo menos uma barreira.");
      return;
    }
    if (!subtipo || !subtipo.id || isNaN(Number(subtipo.id)) || Number(subtipo.id) <= 0) {
      setErro("ID de subtipo inválido.");
      return;
    }
    setLoading(true);
    try {
      if (!disableActions) {
        await sync(selecionadas);
      } else {
        setOk(true);
      }
    } catch (e) {
      // erro tratado em sync
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card space-y-3">
      <div>
        <h4 className="font-semibold">Barreiras para {subtipo.nome}</h4>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {barreiras.length === 0 ? (
            <div className="text-sm text-gray-500">
              {erro ? (
                <div>
                  <div>{erro}</div>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      className="px-2 py-1 border rounded text-sm"
                      onClick={() => {
                        setErro(null);
                        setLoading(true);
                        api
                          .listarBarreirasPorSubtipo(Number(subtipo.id))
                          .then((r) => setBarreiras(r))
                          .catch(() => setErro('Não foi possível carregar as barreiras.'))
                          .finally(() => setLoading(false));
                      }}
                    >
                      Tentar novamente
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 border rounded text-sm"
                      onClick={() => {
                        setErro(null);
                        setLoading(true);
                        api
                          .listarBarreiras()
                          .then((r) => setBarreiras(r))
                          .catch(() => setErro('Não foi possível carregar todas as barreiras.'))
                          .finally(() => setLoading(false));
                      }}
                    >
                      Mostrar todas as barreiras
                    </button>
                  </div>
                </div>
              ) : (
                <div>Não há barreiras cadastradas para este subtipo.</div>
              )}
            </div>
          ) : (
            barreiras.map((b) => (
              <div key={b.id} className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 flex-1">
                  <input type="checkbox" checked={selecionadas.includes(b.id)} onChange={() => toggle(b.id)} />
                  <span>{b.descricao}</span>
                </label>
              </div>
            ))
          )}
        </div>
      </div>

      {/* erro já é exibida dentro do bloco de barreiras com botões de retry; evitar duplicação */}

      {!disableActions && !autoSync ? (
        <div className="flex justify-end">
          <button disabled={loading} onClick={handleSalvar} className="btn btn-primary">
            {loading ? "Salvando..." : "Salvar barreiras"}
          </button>
        </div>
      ) : null}

      {ok && <p className="text-sm text-green-600">✅ Operação concluída</p>}
    </div>
  );
}
