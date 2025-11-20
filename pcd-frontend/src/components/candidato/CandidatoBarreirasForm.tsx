import { useEffect, useState } from "react";
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
};

export default function CandidatoBarreirasForm({ candidatoId, subtipo, disableActions, onChange, initialSelecionadas, initialNiveis, barreirasOverride }: Props) {
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [selecionadas, setSelecionadas] = useState<number[]>([]);
  const [niveis, setNiveis] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!subtipo || !subtipo.id) {
      setBarreiras([]);
      return;
    }
    // if parent provided barreiras for this subtipo, use them as override
    if (barreirasOverride && barreirasOverride.length) {
      setBarreiras(barreirasOverride);
      return;
    }
    setErro(null);
    api
      .listarBarreirasPorSubtipo(subtipo.id)
      .then((b) => setBarreiras(b))
      .catch((e) => {
        console.error('Erro ao carregar barreiras por subtipo', subtipo.id, e);
        setBarreiras([]);
        setErro('Não foi possível carregar as barreiras para este subtipo.');
      });
  }, [subtipo?.id, barreirasOverride]);

  useEffect(() => {
    if (initialSelecionadas && initialSelecionadas.length) setSelecionadas(initialSelecionadas);
    if (initialNiveis) setNiveis(initialNiveis);
  }, [initialSelecionadas, initialNiveis]);

  // support initial selections passed via props (if parent has saved choices)
  useEffect(() => {
    // noop: parent should set via onChange after mount if needed
  }, []);

  function toggle(id: number) {
    setSelecionadas((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      onChange?.(next, niveis);
      return next;
    });
  }

  function setNivel(barreiraId: number, nivel: string) {
    setNiveis((prev) => {
      const next = { ...prev, [barreiraId]: nivel };
      onChange?.(selecionadas, next);
      return next;
    });
  }

  async function handleSalvar() {
    setErro(null);
    if (!selecionadas.length) {
      setErro("Selecione pelo menos uma barreira.");
      return;
    }
    setLoading(true);
    try {
      // Nota: atualmente o backend aceita apenas a lista de ids.
      // Mantemos os níveis apenas no cliente por enquanto; enviaremos apenas os ids.
      if (!disableActions) {
        await api.vincularBarreirasACandidato(candidatoId, subtipo.id, selecionadas);
        setOk(true);
      } else {
        setOk(true);
      }
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
                          .listarBarreirasPorSubtipo(subtipo.id)
                          .then((r) => setBarreiras(r))
                          .catch((e) => setErro('Não foi possível carregar as barreiras.'))
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
                          .catch((e) => setErro('Não foi possível carregar todas as barreiras.'))
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
                {selecionadas.includes(b.id) && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600">Nível:</label>
                    <select
                      value={niveis[b.id] ?? "Moderado"}
                      onChange={(e) => setNivel(b.id, e.target.value)}
                      className="text-sm border rounded p-1"
                    >
                      <option value="Leve">Leve</option>
                      <option value="Moderado">Moderado</option>
                      <option value="Grave">Grave</option>
                    </select>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* erro já é exibida dentro do bloco de barreiras com botões de retry; evitar duplicação */}

      {!disableActions ? (
        <div className="flex justify-end">
          <button disabled={loading} onClick={handleSalvar} className="btn btn-primary">
            {loading ? "Salvando..." : "Salvar barreiras"}
          </button>
        </div>
      ) : (
        <div className="text-sm text-gray-600">Seleções são salvas localmente no perfil.</div>
      )}

      {ok && <p className="text-sm text-green-600">✅ Operação concluída</p>}
    </div>
  );
}
