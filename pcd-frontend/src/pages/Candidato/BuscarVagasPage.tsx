import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiTrash, FiSearch } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import VagaCardCandidate from '../../components/candidato/VagaCard';
import { useToast } from '../../components/common/Toast';
import { addCandidatura, isVagaApplied, isCompanyFavorited, toggleFavoriteCompany, isVagaFavorited, toggleFavoriteVaga, removeCandidatura } from '../../lib/localStorage';
import PerfilIncompletoAlert from '../../components/candidato/PerfilIncompletoAlert';
import { useCandidate } from '../../contexts/CandidateContext';

type FilterState = {
  query: string;
  cidade?: string;
  empresaId?: number | null;
  tipoContrato?: string;
  experiencia?: string;
  sortBy: 'data' | 'relevancia';
};

export default function BuscarVagasPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const [allVagas, setAllVagas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({ query: '', sortBy: 'relevancia' });
  const [visibleCount, setVisibleCount] = useState(8);
  const cand = useCandidate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        if (candidatoId && candidatoId > 0) {
          const res = await api.listarVagasCompativeis(candidatoId);
          if (mounted) setAllVagas(res || []);
        } else {
          // fallback: try to fetch company 1 vagas as sample
          const res = await api.listarVagas(1).catch(() => []);
          if (mounted) setAllVagas(res || []);
        }
      } catch (e) {
        if (mounted) setAllVagas([]);
      } finally { if (mounted) setLoading(false); }
    }
    load();
    return () => { mounted = false };
  }, [candidatoId]);

  const options = useMemo(() => {
    const cidades = Array.from(new Set(allVagas.map(v=>v.cidade).filter(Boolean)));
    const empresas = Array.from(new Map(allVagas.map(v=>[v.empresa?.id, v.empresa])).values()).filter(Boolean);
    const tipos = Array.from(new Set(allVagas.map(v=>v.tipoContrato || v.escolaridade).filter(Boolean)));
    return { cidades, empresas, tipos };
  }, [allVagas]);

  const selectedEmpresa = useMemo(() => {
    if (!filters.empresaId) return null;
    return options.empresas.find((e:any) => e?.id === filters.empresaId) ?? null;
  }, [filters.empresaId, options.empresas]);
  const [empresaFavoritada, setEmpresaFavoritada] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedEmpresa) {
      setEmpresaFavoritada(false);
      return;
    }
    setEmpresaFavoritada(isCompanyFavorited(candidatoId, selectedEmpresa.id));
  }, [selectedEmpresa, candidatoId]);

  // drag-to-scroll for mobile filter strip
  const stripRef = useRef<HTMLDivElement | null>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!stripRef.current) return;
    isDown.current = true;
    setIsDragging(true);
    startX.current = e.clientX;
    scrollLeft.current = stripRef.current.scrollLeft;
    try { stripRef.current.setPointerCapture?.(e.pointerId); } catch {}
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDown.current || !stripRef.current) return;
    e.preventDefault();
    const x = e.clientX;
    const walk = x - startX.current; // positive when moving right
    stripRef.current.scrollLeft = scrollLeft.current - walk;
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    isDown.current = false;
    setIsDragging(false);
    try { stripRef.current?.releasePointerCapture?.(e.pointerId); } catch {}
  }

  const filtered = useMemo(() => {
    let res = allVagas.slice();
    const q = filters.query.trim().toLowerCase();
    if (q) {
      res = res.filter(v => (v.titulo||v.descricao||'').toLowerCase().includes(q) || (v.empresa?.nome||'').toLowerCase().includes(q));
    }
    if (filters.cidade) res = res.filter(v => v.cidade === filters.cidade);
    if (filters.empresaId) res = res.filter(v => v.empresa?.id === filters.empresaId);
    if (filters.tipoContrato) res = res.filter(v => (v.tipoContrato||v.escolaridade) === filters.tipoContrato);
    if (filters.experiencia) res = res.filter(v => (v.experiencia||'').toString() === filters.experiencia);
    if (filters.sortBy === 'relevancia') {
      res.sort((a,b) => (b.matchPercent||b.compatibility||0) - (a.matchPercent||a.compatibility||0));
    } else {
      res.sort((a,b) => { const da = new Date(a.createdAt||a.dataPublicacao||0).getTime(); const db = new Date(b.createdAt||b.dataPublicacao||0).getTime(); return db - da; });
    }
    return res;
  }, [allVagas, filters]);

  function clearFilters() {
    setFilters({ query: '', sortBy: 'relevancia' });
    setVisibleCount(8);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <aside className="hidden md:block md:col-span-3">
        <div className="p-4 bg-white dark:bg-gray-800 border rounded space-y-4">

          <div>
            <label className="text-sm font-medium">Cidade</label>
            <select value={filters.cidade || ''} onChange={(e)=>setFilters(f=>({...f, cidade: e.target.value || undefined}))} className="mt-2 w-full px-3 py-2 border rounded bg-inherit">
              <option value="">Todas</option>
              {options.cidades.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Empresa</label>
            <select value={filters.empresaId ?? ''} onChange={(e)=>setFilters(f=>({...f, empresaId: e.target.value ? Number(e.target.value) : undefined}))} className="mt-2 w-full px-3 py-2 border rounded bg-inherit">
              <option value="">Todas</option>
              {options.empresas.map((em:any) => <option key={em.id} value={em.id}>{em.nome}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Tipo</label>
            <select value={filters.tipoContrato ?? ''} onChange={(e)=>setFilters(f=>({...f, tipoContrato: e.target.value || undefined}))} className="mt-2 w-full px-3 py-2 border rounded bg-inherit">
              <option value="">Todos</option>
              {options.tipos.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Ordenar por</label>
            <select value={filters.sortBy} onChange={(e)=>setFilters(f=>({...f, sortBy: e.target.value as any}))} className="mt-2 w-full px-3 py-2 border rounded bg-inherit">
              <option value="relevancia">Relevância</option>
              <option value="data">Data de publicação</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button onClick={clearFilters} className="flex-1 px-3 py-2 border rounded">Limpar</button>
          </div>
        </div>
      </aside>

      <main className="col-span-1 md:col-span-9">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Fazer busca</h1>
          <div className="text-sm text-gray-500">{filtered.length} resultados</div>
        </div>
        
        {/* Mobile: compact horizontal filter bar (scrollable) */}
        <div
          ref={stripRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className={`mb-4 md:hidden overflow-x-auto flex gap-3 items-center bg-white dark:bg-gray-800 p-2 rounded ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
        >
          <div className="shrink-0">
            <button aria-label="Limpar filtros" title="Limpar filtros" onClick={clearFilters} className="p-2 border rounded">
              <FiTrash className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <label className="sr-only">Cidade</label>
            <select value={filters.cidade || ''} onChange={(e)=>setFilters(f=>({...f, cidade: e.target.value || undefined}))} className="text-sm px-2 py-1 border rounded bg-inherit">
              <option value="">Todas</option>
              {options.cidades.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="sr-only">Empresa</label>
            <select value={filters.empresaId ?? ''} onChange={(e)=>setFilters(f=>({...f, empresaId: e.target.value ? Number(e.target.value) : undefined}))} className="text-sm px-2 py-1 border rounded bg-inherit">
              <option value="">Todas</option>
              {options.empresas.map((em:any) => <option key={em.id} value={em.id}>{em.nome}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="sr-only">Tipo</label>
            <select value={filters.tipoContrato ?? ''} onChange={(e)=>setFilters(f=>({...f, tipoContrato: e.target.value || undefined}))} className="text-sm px-2 py-1 border rounded bg-inherit">
              <option value="">Todos</option>
              {options.tipos.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="sr-only">Ordenar por</label>
            <select value={filters.sortBy} onChange={(e)=>setFilters(f=>({...f, sortBy: e.target.value as any}))} className="text-sm px-2 py-1 border rounded bg-inherit">
              <option value="relevancia">Relevância</option>
              <option value="data">Data</option>
            </select>
          </div>

          
        </div>

        {/* Mobile collapsible panel removed — horizontal bar used instead */}

        {!cand.perfilCompleto && <PerfilIncompletoAlert candidato={cand} />}

        <div className="mb-4 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setFilters(f => ({ ...f, query: e.target.value }))}
            placeholder="Cargo, habilidades ou empresa"
            className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800"
            aria-label="Buscar vagas"
          />
        </div>

        {filters.empresaId && selectedEmpresa && (
          <div className="mb-4 p-4 rounded bg-white dark:bg-gray-800 border flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Empresa selecionada</div>
              <div className="font-semibold text-lg">{selectedEmpresa.nome}</div>
              <div className="text-sm text-gray-500">{selectedEmpresa.localizacao}</div>
            </div>
            <div>
              <button
                onClick={() => {
                  const now = toggleFavoriteCompany(candidatoId, selectedEmpresa);
                  setEmpresaFavoritada(now);
                  addToast({ type: 'success', title: now ? 'Empresa favoritada' : 'Empresa removida dos favoritos', message: now ? 'A empresa foi adicionada aos seus favoritos.' : 'A empresa foi removida dos seus favoritos.' });
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded bg-yellow-50 text-yellow-800"
              >
                {empresaFavoritada ? 'Desfavoritar' : 'Favoritar'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="p-4 bg-white dark:bg-gray-800 border rounded">Carregando vagas...</div>
          ) : (
            (() => {
              const visibleVagas = filtered.slice(0, visibleCount);
              const grouped = new Map<number | string, any[]>();
              visibleVagas.forEach(v => {
                const eid = v.empresa?.id ?? 'sem-empresa';
                if (!grouped.has(eid)) grouped.set(eid, []);
                grouped.get(eid)!.push(v);
              });

              if (filters.empresaId) {
                const company = selectedEmpresa;
                if (!company) {
                  return (
                    <div className="p-4 bg-white dark:bg-gray-800 border rounded text-center">Esta empresa não participa da Incluse.</div>
                  );
                }

                const companyVagas = filtered.filter(v => v.empresa?.id === company.id).slice(0, visibleCount);
                if (companyVagas.length === 0) {
                  return (
                    <div className="p-4 bg-white dark:bg-gray-800 border rounded text-center">No momento esta empresa não possui vagas.</div>
                  );
                }

                return (
                  <div className="space-y-3">
                    <details className="bg-white dark:bg-gray-800 border rounded">
                      <summary className="px-4 py-3 cursor-pointer flex items-center justify-between">
                        <div className="font-semibold">{company.nome} <span className="text-sm text-gray-500">({companyVagas.length})</span></div>
                        <div className="text-sm text-gray-400">▾</div>
                      </summary>
                      <div className="p-4 space-y-4">
                        {companyVagas.map(v => (
                          <VagaCardCandidate
                            key={v.id}
                            vaga={{ ...v, saved: isVagaFavorited(candidatoId, v.id), applied: isVagaApplied(candidatoId, v.id) }}
                            candidatoId={candidatoId}
                            onView={() => navigate(`/vagas/${v.id}`)}
                            onApply={() => {
                              const already = isVagaApplied(candidatoId, v.id);
                              if (already) {
                                const removed = removeCandidatura(candidatoId, v.id);
                                if (removed) {
                                  addToast({ type: 'info', title: 'Candidatura removida', message: 'Você removeu sua candidatura desta vaga.' });
                                  return true;
                                } else {
                                  addToast({ type: 'error', title: 'Erro', message: 'Não foi possível remover.' });
                                  return false;
                                }
                              }
                              const added = addCandidatura(candidatoId, v);
                              if (!added) { addToast({ type: 'info', title: 'Já candidatado', message: 'Você já está candidatado a esta vaga.' }); return false; }
                              addToast({ type: 'success', title: 'Candidatura enviada', message: 'Sua candidatura foi registrada com sucesso.' });
                              return true;
                            }}
                            onToggleSave={() => {
                              const now = toggleFavoriteVaga(candidatoId, v);
                              addToast({ type: 'success', title: now ? 'Vaga favoritada' : 'Vaga removida dos favoritos', message: now ? 'A vaga foi adicionada aos seus favoritos.' : 'A vaga foi removida dos seus favoritos.' });
                            }}
                            isCompanyFavorited={Boolean(filters.empresaId && v.empresa?.id && (filters.empresaId === v.empresa?.id ? empresaFavoritada : isCompanyFavorited(candidatoId, v.empresa.id)))}
                            onToggleCompanyFavorite={filters.empresaId ? () => {
                              if (!v.empresa) return;
                              const now = toggleFavoriteCompany(candidatoId, v.empresa);
                              if (filters.empresaId === v.empresa?.id) setEmpresaFavoritada(now);
                              addToast({ type: 'success', title: now ? 'Empresa favoritada' : 'Empresa removida dos favoritos', message: now ? 'A empresa foi adicionada aos seus favoritos.' : 'A empresa foi removida dos seus favoritos.' });
                            } : undefined}
                          />
                        ))}
                      </div>
                    </details>
                  </div>
                );
              }

              if (filtered.length === 0) {
                if (filters.query.trim() || filters.cidade || filters.tipoContrato || filters.experiencia) {
                  return (<div className="p-6 bg-white dark:bg-gray-800 border rounded text-center">Não há vagas disponíveis neste filtro.</div>);
                }
                return null;
              }

              return (
                <div className="space-y-3">
                  {Array.from(grouped.entries()).map(([eid, vagas]) => {
                    const empresaObj = options.empresas.find((e:any) => e?.id === eid) ?? null;
                    const title = empresaObj ? empresaObj.nome : 'Empresa';
                    return (
                      <details key={String(eid)} className="bg-white dark:bg-gray-800 border rounded">
                        <summary className="px-4 py-3 cursor-pointer flex items-center justify-between">
                          <div className="font-semibold">{title} <span className="text-sm text-gray-500">({vagas.length})</span></div>
                          <div className="text-sm text-gray-400">▾</div>
                        </summary>
                        <div className="p-4 space-y-4">
                          {vagas.map(v => (
                            <VagaCardCandidate
                              key={v.id}
                              vaga={{ ...v, saved: isVagaFavorited(candidatoId, v.id), applied: isVagaApplied(candidatoId, v.id) }}
                              candidatoId={candidatoId}
                              onView={() => navigate(`/vagas/${v.id}`)}
                              onApply={async () => {
                                try {
                                  // Verificar estado atual no backend
                                  const currentlyApplied = await api.verificarCandidatura(v.id, candidatoId);
                                  
                                  if (currentlyApplied) {
                                    // Remover candidatura
                                    await api.retirarCandidatura(v.id, candidatoId);
                                    addToast({ type: 'info', title: 'Candidatura removida', message: 'Você removeu sua candidatura desta vaga.' });
                                    return true;
                                  } else {
                                    // Garantir token antes de candidatar
                                    let token = localStorage.getItem('token');
                                    if (!token) {
                                      const devAuth = await api.getDevToken(candidatoId);
                                      localStorage.setItem('token', devAuth.token);
                                    }
                                    
                                    // Criar candidatura
                                    console.log('Chamando API candidatarVaga:', v.id, candidatoId);
                                    const result = await api.candidatarVaga(v.id, candidatoId);
                                    console.log('Resultado da API:', result);
                                    addToast({ type: 'success', title: 'Candidatura enviada', message: 'Sua candidatura foi registrada com sucesso.' });
                                    return true;
                                  }
                                } catch (err: any) {
                                  console.error('Erro na candidatura:', err);
                                  addToast({ type: 'error', title: 'Erro', message: err?.message || 'Erro na operação' });
                                  return false;
                                }
                              }}
                              onToggleSave={() => {
                                const now = toggleFavoriteVaga(candidatoId, v);
                                addToast({ type: 'success', title: now ? 'Vaga favoritada' : 'Vaga removida dos favoritos', message: now ? 'A vaga foi adicionada aos seus favoritos.' : 'A vaga foi removida dos seus favoritos.' });
                              }}
                              isCompanyFavorited={Boolean(filters.empresaId && v.empresa?.id && (filters.empresaId === v.empresa?.id ? empresaFavoritada : isCompanyFavorited(candidatoId, v.empresa.id)))}
                              onToggleCompanyFavorite={filters.empresaId ? () => {
                                if (!v.empresa) return;
                                const now = toggleFavoriteCompany(candidatoId, v.empresa);
                                if (filters.empresaId === v.empresa?.id) setEmpresaFavoritada(now);
                                addToast({ type: 'success', title: now ? 'Empresa favoritada' : 'Empresa removida dos favoritos', message: now ? 'A empresa foi adicionada aos seus favoritos.' : 'A empresa foi removida dos seus favoritos.' });
                              } : undefined}
                            />
                          ))}
                        </div>
                      </details>
                    );
                  })}
                </div>
              );
            })()
          )}

          {filtered.length > visibleCount && (
            <div className="text-center">
              <button onClick={() => setVisibleCount(c => c + 8)} className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700">Carregar mais</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
