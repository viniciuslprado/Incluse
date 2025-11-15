import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { getFavoritedCompanies, toggleFavoriteCompany } from '../../lib/localStorage';
import VagaCardCandidate from '../../components/candidato/VagaCard';
import { useToast } from '../../components/ui/Toast';
import { AiFillStar } from 'react-icons/ai';
import { FiEye } from 'react-icons/fi';

type EmpresaFavEntry = { id: number; nome?: string; favoritedAt: string };

export default function EmpresasFavoritasPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchedVagas, setMatchedVagas] = useState<any[]>([]);
  const [openCompanyId, setOpenCompanyId] = useState<number | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<Record<number, { timer: number; remaining: number }>>({});
  const timers = useRef<Record<number, number>>({});
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;
    async function carregar() {
      setError(null);
      setLoading(true);
      try {
        if (!candidatoId) return;
        const favs: EmpresaFavEntry[] = getFavoritedCompanies(candidatoId);
        // fetch company details in parallel
        const detalhes = await Promise.all(favs.map(async (f) => {
          try {
            const e = await api.buscarEmpresa(f.id).catch(() => null);
            return e ? { ...e, favoritedAt: f.favoritedAt } : { id: f.id, nome: f.nome ?? '—', favoritedAt: f.favoritedAt };
          } catch {
            return { id: f.id, nome: f.nome ?? '—', favoritedAt: f.favoritedAt };
          }
        }));

        // listar vagas compatíveis do candidato (para filtrar por empresa)
        const matched = await api.listarVagasCompativeis(candidatoId).catch(() => []);

        if (mounted) {
          setCompanies(detalhes);
          setMatchedVagas(matched || []);
        }
      } catch (err: any) {
        if (mounted) setError(err?.message ?? 'Erro ao carregar empresas favoritas');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    carregar();
    return () => { mounted = false; Object.values(timers.current).forEach(t => clearTimeout(t)); };
  }, [candidatoId]);

  function vagasDaEmpresa(empId: number) {
    return matchedVagas.filter(v => v.empresa && Number(v.empresa.id) === Number(empId));
  }

  function calcularMediaAvaliacao(empresa: any) {
    const avs = empresa?.avaliacoes ?? [];
    if (!Array.isArray(avs) || avs.length === 0) return null;
    const soma = avs.reduce((s: number, a: any) => s + (a.nota ?? 0), 0);
    return +(soma / avs.length).toFixed(1);
  }

  function iniciarRemocao(emp: any) {
    if (!candidatoId) return;
    // don't start if already pending
    if (pendingRemoval[emp.id]) return;
    const duration = 20; // seconds
    const timeoutId = window.setTimeout(() => {
      // efetivar remoção
      toggleFavoriteCompany(candidatoId, emp);
      setCompanies(prev => prev.filter(c => c.id !== emp.id));
      setPendingRemoval(prev => {
        const copy = { ...prev };
        delete copy[emp.id];
        return copy;
      });
      addToast({ type: 'success', title: 'Empresa removida', message: `${emp.nome ?? 'Empresa'} foi removida dos favoritos.` });
    }, duration * 1000);

    // countdown
    setPendingRemoval(prev => ({ ...prev, [emp.id]: { timer: timeoutId, remaining: duration } }));

    // start interval to update remaining seconds
    const interval = window.setInterval(() => {
      setPendingRemoval(prev => {
        if (!prev[emp.id]) { window.clearInterval(interval); return prev; }
        const rem = prev[emp.id].remaining - 1;
        if (rem <= 0) { window.clearInterval(interval); return prev; }
        return { ...prev, [emp.id]: { ...prev[emp.id], remaining: rem } };
      });
    }, 1000);
    // store to clear on unmount
    timers.current[emp.id] = interval as unknown as number;
    addToast({ type: 'info', title: 'Remoção agendada', message: `${emp.nome ?? 'Empresa'} será removida dos favoritos em ${duration} segundos.`, autoClose: 4000 });
  }

  function cancelarRemocao(empId: number) {
    const entry = pendingRemoval[empId];
    if (!entry) return;
    clearTimeout(entry.timer);
    const interval = timers.current[empId];
    if (interval) clearInterval(interval);
    delete timers.current[empId];
    setPendingRemoval(prev => {
      const copy = { ...prev };
      delete copy[empId];
      return copy;
    });
    addToast({ type: 'success', title: 'Remoção cancelada', message: 'A empresa foi mantida nos seus favoritos.' });
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Empresas Favoritas</h1>
      <p className="text-gray-600 mb-4">Empresas que você marcou como favoritas.</p>

      {loading ? (
        <p>Carregando empresas...</p>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : companies.length === 0 ? (
        <div className="text-gray-600">Você ainda não favoritou nenhuma empresa.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((emp: any) => {
            const vagas = vagasDaEmpresa(emp.id || emp.id);
            const avg = calcularMediaAvaliacao(emp);
            const pending = Boolean(pendingRemoval[emp.id]);
            const remaining = pendingRemoval[emp.id]?.remaining ?? 0;
            return (
              <article key={emp.id} className={`border rounded p-4 bg-white shadow-sm ${pending ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-4">
                  <img src={emp.logo || emp.logoUrl || '/vite.svg'} alt={`${emp.nome} logo`} className="w-16 h-16 object-contain rounded" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold">{emp.nome ?? '—'}</h2>
                      {avg ? (
                        <div className="flex items-center text-sm text-yellow-500" title={`Avaliação média ${avg}`}>
                          <AiFillStar className="mr-1" /> <span className="text-gray-700">{avg}</span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">Sem avaliações</div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{emp.setor ?? emp.sector ?? '—'}</div>
                    <div className="text-sm text-gray-600 mt-2">{vagas.length} vaga{vagas.length !== 1 ? 's' : ''} compatível{vagas.length !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      title="Ver vagas dessa empresa"
                      onClick={() => setOpenCompanyId(openCompanyId === emp.id ? null : emp.id)}
                      className="text-sm text-sky-600 hover:underline flex items-center gap-1"
                    >
                      <FiEye /> <span>Ver vagas</span>
                    </button>
                    {!pending ? (
                      <button
                        onClick={() => iniciarRemocao(emp)}
                        className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100"
                      >
                        Remover dos Favoritos
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button onClick={() => cancelarRemocao(emp.id)} className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Cancelar ({remaining}s)</button>
                      </div>
                    )}
                  </div>
                </div>

                {openCompanyId === emp.id && (
                  <div className="mt-4">
                    {vagas.length === 0 ? (
                      <div className="text-gray-600">Nenhuma vaga compatível encontrada para esta empresa.</div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {vagas.map((v: any) => (
                          <VagaCardCandidate
                            key={v.id}
                            vaga={v}
                            onView={() => navigate(`/vagas/${v.id}`)}
                            onApply={() => {
                              // delegar para VagasSalvasPage padrão: aqui apenas navega para vaga
                              navigate(`/vagas/${v.id}`);
                            }}
                            onToggleSave={() => { /* não altera favoritos de empresa aqui */ }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
