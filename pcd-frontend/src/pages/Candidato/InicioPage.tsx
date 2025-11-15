import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VagaList from "../../components/vaga/VagaList";
import VagaCardCandidate from "../../components/candidato/VagaCard";
import { api } from "../../lib/api";
import { useToast } from "../../components/ui/Toast";
import { toggleSaveVaga, isVagaSaved, addCandidatura, isVagaApplied } from '../../lib/localStorage';

export default function InicioPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const navigate = useNavigate();
  const [vagas, setVagas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    if (!candidatoId || candidatoId <= 0) {
      setVagas([]);
      setLoading(false);
      return;
    }
    api.listarVagasCompativeis(candidatoId)
      .then((res: any) => {
        if (!mounted) return;
        const data = (res || []).map((v: any) => ({ ...v, saved: isVagaSaved(candidatoId, v.id), applied: isVagaApplied(candidatoId, v.id) }));
        setVagas(data);
      })
      .catch(() => {
        // fallback vazio
        setVagas([]);
      })
      .finally(() => setLoading(false));
    return () => { mounted = false };
  }, [candidatoId]);

  function handleToggleSave(vaga: any) {
    if (!candidatoId) return addToast({ type: 'error', title: 'Candidato inválido', message: 'Não foi possível identificar o candidato.' });
    const nowSaved = toggleSaveVaga(candidatoId, vaga);
    setVagas(prev => prev.map(v => v.id === vaga.id ? { ...v, saved: nowSaved } : v));
    addToast({ type: 'success', title: nowSaved ? 'Vaga salva' : 'Vaga removida dos salvos', message: nowSaved ? 'A vaga foi adicionada aos seus salvos.' : 'A vaga foi removida dos seus salvos.' });
  }

  function handleApply(vaga: any) {
    if (!candidatoId) return addToast({ type: 'error', title: 'Candidato inválido', message: 'Não foi possível identificar o candidato.' });
    const added = addCandidatura(candidatoId, vaga);
    if (!added) return addToast({ type: 'info', title: 'Você já se candidatou a esta vaga', message: 'Já existe uma candidatura registrada para esta vaga.' });
    setVagas(prev => prev.map(v => v.id === vaga.id ? { ...v, applied: true } : v));
    addToast({ type: 'success', title: 'Candidatura enviada', message: 'Sua candidatura foi registrada localmente.' });
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Início</h2>
        <p className="text-sm text-gray-500">Vagas recomendadas para você</p>
      </header>
      <section className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-white dark:bg-gray-800 border rounded"> 
            <div className="text-sm text-gray-500">Vagas compatíveis</div>
            <div className="text-xl font-semibold">{vagas.length}</div>
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/candidato/${candidatoId}/salvas`)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/candidato/${candidatoId}/salvas`) }}
            className="hidden md:block p-3 bg-white dark:bg-gray-800 border rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-incluse-primary"
            aria-label="Ir para Vagas salvas"
          >
            <div className="text-sm text-gray-500">Vagas salvas</div>
            <div className="text-xl font-semibold">—</div>
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/candidato/${candidatoId}/historico`)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/candidato/${candidatoId}/historico`) }}
            className="p-3 bg-white dark:bg-gray-800 border rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-incluse-primary"
            aria-label="Ir para Currículos enviados"
          >
            <div className="text-sm text-gray-500">Currículos enviados</div>
            <div className="text-xl font-semibold">—</div>
          </div>
          <div className="hidden md:block p-3 bg-white dark:bg-gray-800 border rounded"> 
            <div className="text-sm text-gray-500">Candidaturas em análise</div>
            <div className="text-xl font-semibold">—</div>
          </div>
        </div>

        <div className="pt-2">
          <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="p-4 bg-white dark:bg-gray-800 border rounded">Carregando vagas...</div>
          ) : (
            vagas.map((v: any) => (
              <VagaCardCandidate
                key={v.id}
                vaga={v}
                onView={() => navigate(`/vagas/${v.id}`)}
                onApply={() => handleApply(v)}
                onToggleSave={() => handleToggleSave(v)}
              />
            ))
          )}
          </div>
        </div>
      </section>
    </div>
  );
}
