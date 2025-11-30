import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VagaCardCandidate from "../../components/candidato/VagaCard";
import { api } from "../../lib/api";
import { useCandidate } from '../../contexts/CandidateContext';
import CustomSelect from '../../components/common/CustomSelect';
import { useToast } from "../../components/common/Toast";
import { addCandidatura, isVagaApplied, isVagaFavorited, toggleFavoriteVaga, removeCandidatura } from '../../lib/localStorage';
import PerfilIncompletoAlert from '../../components/candidato/PerfilIncompletoAlert';

type FilterState = {
  cidade?: string;
  empresaId?: number | null;
  tipoContrato?: string;
  sortBy: 'data' | 'relevancia';
  searchTerm?: string;
};

export default function InicioPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const navigate = useNavigate();
  const cand = useCandidate();
  const [vagas, setVagas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const [filters, setFilters] = useState<FilterState>({ sortBy: 'relevancia' });

  // removed unused drag-strip handlers and state

  useEffect(() => {
    setLoading(true);
    if (!candidatoId || candidatoId <= 0) {
      setVagas([]);
      setLoading(false);
      return;
    }
    // Aqui você pode implementar a lógica de listagem de vagas usando outro endpoint, se necessário.
    setLoading(false);
  }, [candidatoId]);

  const options = useMemo(() => {
    const cidades = Array.from(new Set(vagas.map(v=>v.cidade).filter(Boolean)));
    const empresas = Array.from(new Map(vagas.map(v=>[v.empresa?.id, v.empresa])).values()).filter(Boolean);
    const tipos = Array.from(new Set(vagas.map(v=>v.tipoContrato || v.escolaridade).filter(Boolean)));
    return { cidades, empresas, tipos };
  }, [vagas]);

  const filtered = useMemo(() => {
    let res = vagas.slice();
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      res = res.filter(v => {
        const searchableText = [
          v.titulo,
          v.empresa?.nome,
          v.cidade,
          v.estado,
          v.tipoContratacao,
          v.modeloTrabalho,
          v.localizacao,
          v.area,
          v.escolaridade,
          v.descricaoVaga?.resumo,
          v.descricaoVaga?.atividades,
          v.descricaoVaga?.jornada,
          v.requisitos?.formacao,
          v.requisitos?.experiencia,
          v.requisitos?.competencias,
          v.requisitos?.habilidadesTecnicas,
          ...(v.beneficios || []).map((b: any) => b.descricao),
          ...(v.processos || []).map((p: any) => p.etapa)
        ].filter(Boolean).join(' ').toLowerCase();
        
        return searchableText.includes(term);
      });
    }
    if (filters.cidade) res = res.filter(v => v.cidade === filters.cidade);
    if (filters.empresaId) res = res.filter(v => v.empresa?.id === filters.empresaId);
    if (filters.tipoContrato) res = res.filter(v => (v.tipoContrato||v.escolaridade) === filters.tipoContrato);
    if (filters.sortBy === 'relevancia') {
      res.sort((a,b) => (b.matchPercent||b.compatibility||0) - (a.matchPercent||a.compatibility||0));
    } else {
      res.sort((a,b) => { const da = new Date(a.createdAt||a.dataPublicacao||0).getTime(); const db = new Date(b.createdAt||b.dataPublicacao||0).getTime(); return db - da; });
    }
    return res;
  }, [vagas, filters]);

  function clearFilters() {
    setFilters({ sortBy: 'relevancia', searchTerm: '' });
  }

  async function handleToggleSave(vaga: any) {
    if (!candidatoId) return addToast({ type: 'error', title: 'Erro', message: 'Candidato inválido.' });
    try {
      const isFavorited = isVagaFavorited(candidatoId, vaga.id);
      if (isFavorited) {
        await api.desfavoritarVaga(vaga.id);
        toggleFavoriteVaga(candidatoId, vaga);
        setVagas(prev => prev.map(v => v.id === vaga.id ? { ...v, saved: false } : v));
        addToast({ type: 'success', title: 'Removido', message: 'Vaga removida.' });
      } else {
        await api.favoritarVaga(vaga.id);
        toggleFavoriteVaga(candidatoId, vaga);
        setVagas(prev => prev.map(v => v.id === vaga.id ? { ...v, saved: true } : v));
        addToast({ type: 'success', title: 'Favoritado', message: 'Vaga favoritada!' });
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Erro', message: err?.message ?? 'Erro ao favoritar.' });
    }
  }

  async function handleToggleApply(vaga: any): Promise<boolean> {
    if (!candidatoId) { addToast({ type: 'error', title: 'Erro', message: 'Candidato inválido.' }); return false; }
    const already = isVagaApplied(candidatoId, vaga.id);
    
    if (already) {
      try {
        // await api.retirarCandidatura(vaga.id, candidatoId); // Função não existe mais
        removeCandidatura(candidatoId, vaga.id);
        setVagas(prev => prev.map(v => v.id === vaga.id ? { ...v, applied: false } : v));
        window.dispatchEvent(new CustomEvent('candidaturaCreated'));
        addToast({ type: 'info', title: 'Removido', message: 'Candidatura removida.' });
        return true;
      } catch (err: any) {
        addToast({ type: 'error', title: 'Erro', message: err?.message ?? 'Não foi possível remover.' });
        return false;
      }
    }
    
    try {
      await api.candidatarVaga(vaga.id, candidatoId);
      addCandidatura(candidatoId, vaga);
      setVagas(prev => prev.map(v => v.id === vaga.id ? { ...v, applied: true } : v));
      window.dispatchEvent(new CustomEvent('candidaturaCreated'));
      addToast({ type: 'success', title: 'Sucesso', message: 'Candidatura enviada!' });
      return true;
    } catch (err: any) {
      addToast({ type: 'error', title: 'Erro', message: err?.message ?? 'Erro ao candidatar.' });
      return false;
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Início</h1>
      </div>

      {/* Pesquisa e Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
        {/* Barra de Pesquisa */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Pesquisar vagas compatíveis..."
            value={filters.searchTerm || ''}
            onChange={(e) => setFilters(f => ({ ...f, searchTerm: e.target.value }))}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Filtros Compactos */}
        <div className="flex flex-wrap gap-2 items-center">
          <CustomSelect
            value={filters.sortBy}
            onChange={val => setFilters(f => ({ ...f, sortBy: val as any }))}
            options={[
              { value: 'relevancia', label: 'Relevância' },
              { value: 'data', label: 'Mais recentes' },
            ]}
            className="text-sm w-full"
          />

          <CustomSelect
            value={filters.cidade || ''}
            onChange={val => setFilters(f => ({ ...f, cidade: val || undefined }))}
            options={[
              { value: '', label: 'Todas as cidades' },
              ...options.cidades.map((c: string) => ({ value: c, label: c }))
            ]}
            className="text-sm w-full"
          />

          <CustomSelect
            value={filters.empresaId ?? ''}
            onChange={val => setFilters(f => ({ ...f, empresaId: val ? Number(val) : undefined }))}
            options={[
              { value: '', label: 'Todas as empresas' },
              ...options.empresas.map((em: any) => ({ value: String(em.id), label: em.nome }))
            ]}
            className="text-sm w-full"
          />

          <button 
            onClick={clearFilters} 
            className="text-sm px-3 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>


      {!cand.perfilCompleto && <PerfilIncompletoAlert candidato={cand} />}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            Vagas Recomendadas ({filtered.length})
          </h3>
          <div className="space-y-3 sm:space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-xs sm:text-sm text-gray-500">Carregando...</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center py-8">Nenhuma vaga compatível encontrada</p>
          ) : (
            filtered.map((v: any) => (
              <VagaCardCandidate
                key={v.id}
                vaga={v}
                onView={() => navigate(`/vagas/${v.id}`)}
                onApply={() => handleToggleApply(v)}
                onToggleSave={() => handleToggleSave(v)}
              />
            ))
          )}
          </div>
        </div>
    </div>
  );
}
