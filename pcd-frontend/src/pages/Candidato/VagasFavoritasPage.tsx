import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import VagaCardCandidate from '../../components/candidato/VagaCard';
import { addCandidatura, isVagaApplied, getFavoritedVagas, isVagaFavorited, toggleFavoriteVaga, removeCandidatura } from '../../lib/localStorage';
import { useToast } from '../../components/common/Toast';

export default function VagasFavoritasPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const [vagas, setVagas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [sort, setSort] = useState<'recent'|'titulo'|'empresa'>('recent');
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;
    async function carregar() {
      setErro(null);
      try {
        if (!candidatoId) return;
        let token = localStorage.getItem('token');
        if (!token) {
          try {
            const devAuth = await api.getDevToken(candidatoId);
            localStorage.setItem('token', devAuth.token);
            localStorage.setItem('userType', 'candidato');
            localStorage.setItem('userId', String(candidatoId));
          } catch (devErr) {
            console.warn('Não foi possível obter token dev:', devErr);
          }
        }
        const backendFavoritos = await api.listarVagasFavoritas(candidatoId).catch(() => []);
        // Buscar dados completos de cada vaga favorita
        const backendFormatadas = await Promise.all((backendFavoritos || []).map(async (item: any) => {
          try {
            const vagaCompleta: any = await api.obterVaga(item.vaga.id);
            return {
              id: vagaCompleta.id,
              titulo: vagaCompleta.titulo,
              area: vagaCompleta.area,
              modeloTrabalho: vagaCompleta.modeloTrabalho,
              localizacao: vagaCompleta.localizacao,
              cidade: vagaCompleta.cidade,
              estado: vagaCompleta.estado,
              tipoContratacao: vagaCompleta.tipoContratacao,
              tipoContrato: vagaCompleta.tipoContratacao,
              escolaridade: vagaCompleta.escolaridade,
              status: vagaCompleta.status,
              createdAt: vagaCompleta.createdAt,
              empresa: vagaCompleta.empresa,
              favoritedAt: item.createdAt || vagaCompleta.createdAt,
              applied: isVagaApplied(candidatoId, vagaCompleta.id)
            };
          } catch (err) {
            // Fallback para dados básicos se não conseguir buscar
            return {
              id: item.vaga.id,
              titulo: item.vaga.titulo || 'Vaga',
              area: item.vaga.area || '—',
              modeloTrabalho: item.vaga.modeloTrabalho || '—',
              localizacao: item.vaga.localizacao || '—',
              cidade: item.vaga.cidade || '—',
              estado: item.vaga.estado || '—',
              tipoContratacao: item.vaga.tipoContratacao || '—',
              tipoContrato: item.vaga.tipoContratacao || '—',
              escolaridade: item.vaga.escolaridade || '—',
              status: item.vaga.status || 'ativa',
              createdAt: item.vaga.createdAt,
              empresa: { 
                id: item.vaga.empresa?.id,
                nome: item.vaga.empresa?.nome || 'Empresa'
              },
              favoritedAt: item.createdAt || item.vaga.createdAt,
              applied: isVagaApplied(candidatoId, item.vaga.id)
            };
          }
        }));
        const localFavoritos = getFavoritedVagas(candidatoId).map((f: any) => ({
          id: f.id,
          titulo: f.titulo,
          area: f.area,
          modeloTrabalho: f.modeloTrabalho,
          localizacao: f.localizacao,
          cidade: f.cidade,
          estado: f.estado,
          tipoContratacao: f.tipoContratacao,
          tipoContrato: f.tipoContratacao,
          escolaridade: f.escolaridade,
          empresa: { 
            id: f.empresaId,
            nome: f.empresaNome || '—' 
          },
          favoritedAt: f.favoritedAt,
          createdAt: f.favoritedAt,
          applied: isVagaApplied(candidatoId, f.id)
        }));
        const map = new Map<number, any>();
        [...backendFormatadas, ...localFavoritos].forEach(v => { if (!map.has(v.id)) map.set(v.id, v); });
        if (mounted) setVagas(Array.from(map.values()));
      } catch (err: any) {
        // Se o erro for de ID do candidato ausente ou inválido, trata como lista vazia
        if (err?.message?.includes('ID do candidato ausente ou inválido')) {
          if (mounted) setVagas([]);
        } else {
          if (mounted) setErro(err?.message ?? 'Erro ao carregar vagas favoritas');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    carregar();
    return () => { mounted = false };
  }, [candidatoId]);

  const vagasOrdenadas = useMemo(() => {
    const arr = [...vagas];
    switch (sort) {
      case 'titulo':
        return arr.sort((a,b) => (a.titulo||'').localeCompare(b.titulo||''));
      case 'empresa':
        return arr.sort((a,b) => (a.empresa?.nome||'').localeCompare(b.empresa?.nome||''));
      default:
        return arr.sort((a,b) => new Date(b.favoritedAt||b.createdAt).getTime() - new Date(a.favoritedAt||a.createdAt).getTime());
    }
  }, [vagas, sort]);

  function handleBulkRemove() {
    if (!window.confirm('Remover todas as vagas favoritas?')) return;
    localStorage.removeItem(`incluse:saved:${candidatoId}`);
    setVagas([]);
  }

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Vagas Favoritas</h1>
        {vagas.length > 0 && (
          <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
            <label className="text-gray-600 dark:text-gray-400 shrink-0">Ordenar:</label>
            <CustomSelect
              value={sort}
              onChange={v => setSort(v as any)}
              options={[
                { value: 'recent', label: 'Recentes' },
                { value: 'titulo', label: 'Título' },
                { value: 'empresa', label: 'Empresa' },
              ]}
              className="text-xs sm:text-sm"
            />
            <button onClick={handleBulkRemove} className="px-2 sm:px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 border text-xs" title="Remover todas">
              Limpar tudo
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-3 sm:p-4 border rounded bg-white dark:bg-gray-800 text-sm">Carregando...</div>
      ) : erro ? (
        <div className="p-3 sm:p-4 border rounded bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">{erro}</div>
      ) : vagasOrdenadas.length === 0 ? (
        <div className="p-4 sm:p-6 border rounded bg-white dark:bg-gray-800 text-center">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">Nenhuma vaga favoritada.</p>
          <p className="text-xs sm:text-sm text-gray-500">Use o ícone ⭐ nas vagas para favoritar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {vagasOrdenadas.map(v => (
            <VagaCardCandidate
              key={v.id}
              vaga={{ ...v, saved: true, favorited: isVagaFavorited(candidatoId, v.id), applied: isVagaApplied(candidatoId, v.id) }}
              candidatoId={candidatoId}
              onView={() => navigate(`/vagas/${v.id}`)}
              onApply={() => {
                if (v.indisponivel || v.unavailable || v.expired || v.closed) {
                  addToast({ type: 'error', title: 'Vaga indisponível', message: 'Esta vaga não está mais disponível.' });
                  return false;
                }
                const already = isVagaApplied(candidatoId, v.id);
                if (already) {
                  const removed = removeCandidatura(candidatoId, v.id);
                  if (removed) {
                    setVagas(prev => prev.map(x => x.id === v.id ? ({ ...x, applied: false }) : x));
                    addToast({ type: 'info', title: 'Candidatura removida', message: 'Você removeu sua candidatura desta vaga.' });
                    return true;
                  }
                  addToast({ type: 'error', title: 'Erro', message: 'Não foi possível remover.' });
                  return false;
                }
                const added = addCandidatura(candidatoId, v);
                if (!added) { addToast({ type: 'info', title: 'Já candidatado', message: 'Você já está candidatado a esta vaga.' }); return false; }
                setVagas(prev => prev.map(x => x.id === v.id ? ({ ...x, applied: true }) : x));
                addToast({ type: 'success', title: 'Candidatura registrada', message: 'Sua candidatura foi registrada com sucesso.' });
                return true;
              }}
              onToggleSave={async () => {
                const nowFav = toggleFavoriteVaga(candidatoId, v);
                if (!nowFav) {
                  try { await api.desfavoritarVaga(v.id); } catch {}
                  setVagas(prev => prev.filter(x => x.id !== v.id));
                  addToast({ type: 'success', title: 'Removida dos favoritos', message: 'A vaga foi removida dos seus favoritos.' });
                } else {
                  try { await api.favoritarVaga(v.id); } catch {}
                  addToast({ type: 'success', title: 'Vaga favoritada', message: 'A vaga foi adicionada aos seus favoritos.' });
                }
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}