import { useEffect, useState, useCallback } from "react";
import { useParams, NavLink } from "react-router-dom";
import { api } from "../../lib/api";
import { useToast } from "../../components/ui/Toast";
import type { Vaga } from "../../types";

export default function CandidatoVagasPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const { addToast } = useToast();

  const carregar = useCallback(async () => {
    setErro(null);
    setLoading(true);
    try {
      const data = await api.listarVagasCompativeis(candidatoId);
      setVagas(data || []);
      // carregar vagas salvas para este candidato (se houver)
      try {
        const s = await api.listarVagasSalvas(candidatoId);
        setSaved((s || []).map((x: any) => x.id));
      } catch {
        // ignora
      }
    } catch (err: any) {
      setErro(err?.message ?? "Erro ao carregar vagas compatíveis");
    } finally {
      setLoading(false);
    }
  }, [candidatoId]);

  useEffect(() => {
    if (!Number.isInteger(candidatoId) || candidatoId <= 0) return;
    carregar();
  }, [candidatoId, carregar]);

  if (loading) return <div className="p-6">Carregando vagas...</div>;
  if (erro) return <div className="p-6 text-red-700">{erro}</div>;

  return (
    <div className="p-6">
      <header>
        <nav className="space-x-4 mb-4">
          <NavLink
            to={`/candidato/${candidatoId}`}
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "hover:underline text-blue-600"
            }
          >
            Subtipos e Barreiras
          </NavLink>
          <NavLink
            to={`/candidato/${candidatoId}/vagas`}
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "hover:underline text-blue-600"
            }
          >
            Minhas Vagas
          </NavLink>
        </nav>

        <h1 className="text-2xl font-bold">Vagas Compatíveis</h1>
        <p className="text-gray-600">
          Veja as vagas que atendem às suas necessidades de acessibilidade.
        </p>
      </header>

      <div className="card space-y-3 mt-6">
        <h3 className="text-lg font-semibold mb-3">Vagas encontradas</h3>
        {vagas.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma vaga compatível encontrada.</p>
        ) : (
          <ul className="divide-y">
            {vagas.map((v) => {
              const anyV = v as any;
              const compatibility = typeof anyV.compatibility === 'number' ? Math.round(anyV.compatibility * 100) : undefined;
              const breakdowns = anyV.subtipoBreakdowns as any[] | undefined;
              return (
                <li key={v.id} className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{v.titulo ?? v.descricao}</p>
                      <p className="text-sm text-gray-500">Empresa: {v.empresa?.nome ?? "—"}</p>
                      <p className="text-sm text-gray-500">Escolaridade: {v.escolaridade}</p>
                    </div>
                    <div className="text-right">
                      {typeof compatibility === 'number' ? (
                        <div className="text-lg font-semibold text-green-600">{compatibility}%</div>
                      ) : (
                        <div className="text-sm text-gray-500">—</div>
                      )}
                    </div>
                  </div>

                    <div className="mt-3 flex gap-2">
                      {saved.includes(v.id) ? (
                        <button
                          className="px-3 py-1 border rounded text-sm"
                            onClick={async () => {
                            try {
                              await api.removerVagaSalva(candidatoId, v.id);
                              setSaved((s) => s.filter((x) => x !== v.id));
                              addToast({ type: 'success', message: 'Vaga removida das salvas' });
                            } catch (e:any) {
                              addToast({ type: 'error', message: e?.message ?? 'Erro' });
                            }
                          }}
                        >
                          Remover salva
                        </button>
                      ) : (
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                          onClick={async () => {
                            try {
                              await api.salvarVaga(candidatoId, v.id);
                              setSaved((s) => [...s, v.id]);
                              addToast({ type: 'success', message: 'Vaga salva' });
                            } catch (e:any) {
                              addToast({ type: 'error', message: e?.message ?? 'Erro' });
                            }
                          }}
                        >
                          Salvar vaga
                        </button>
                      )}

                      <button
                        className="px-3 py-1 border rounded text-sm"
                        onClick={async () => {
                          try {
                            await api.candidatarVaga(v.id, candidatoId);
                            addToast({ type: 'success', message: 'Candidatura enviada' });
                          } catch (e:any) {
                            addToast({ type: 'error', message: e?.message ?? 'Erro ao candidatar' });
                          }
                        }}
                      >
                        Candidatar
                      </button>
                    </div>

                  {breakdowns && breakdowns.length > 0 && (
                    <div className="mt-2 text-sm text-gray-700">
                      <div className="font-medium">Detalhes por subtipo:</div>
                      <ul className="mt-1 space-y-2">
                        {breakdowns.map((b) => (
                          <li key={b.subtipoId} className="pl-2">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold">{b.subtipoNome}</div>
                              <div>{Math.round((b.percent ?? 0) * 100)}%</div>
                            </div>
                            {b.uncoveredBarreiras && b.uncoveredBarreiras.length > 0 && (
                              <div className="text-xs text-red-600">Barreiras não atendidas: {b.uncoveredBarreiras.map((x: any) => x.descricao).join(', ')}</div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
