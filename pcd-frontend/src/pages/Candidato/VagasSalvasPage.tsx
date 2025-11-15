import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import VagaCardCandidate from '../../components/candidato/VagaCard';
import type { Vaga } from '../../types';
import { getSavedVagas, getSavedVagasAsVagas, toggleSaveVaga, addCandidatura, isVagaApplied } from '../../lib/localStorage';
import { useToast } from '../../components/ui/Toast';

const toSavedVagas = (items: any[]) => items.map(i => ({ id: i.id, titulo: i.titulo, empresa: { nome: i.empresaNome || i.empresa?.nome } }));

export default function VagasSalvasPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;
    async function carregar() {
      setErro(null);
      try {
        if (!candidatoId) return;
        // try localStorage first
        const local = getSavedVagas(candidatoId);
        if (local && local.length > 0) {
          if (mounted) setVagas(getSavedVagasAsVagas(candidatoId));
        } else {
          const data = await api.listarVagasSalvas(candidatoId).catch(() => []);
          if (mounted) setVagas(data || []);
        }
      } catch (err: any) {
        if (mounted) setErro(err?.message ?? 'Erro ao carregar vagas salvas');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    carregar();
    return () => { mounted = false };
  }, [candidatoId]);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Vagas salvas</h1>
      {loading ? (
        <p>Carregando vagas salvas...</p>
      ) : erro ? (
        <div className="text-red-600">{erro}</div>
      ) : vagas.length === 0 ? (
        <div className="text-gray-600">Nenhuma vaga salva.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {vagas.map((v) => (
            <VagaCardCandidate
              key={v.id}
              vaga={{ ...v, saved: true, applied: isVagaApplied(candidatoId, v.id) }}
              onView={() => navigate(`/vagas/${v.id}`)}
              onApply={() => {
                // check unavailable
                if (v.indisponivel || v.unavailable || v.expired || v.closed) {
                  return addToast({ type: 'error', title: 'Vaga indisponível', message: 'Esta vaga não está mais disponível para candidatura.' });
                }
                const added = addCandidatura(candidatoId, v);
                if (!added) return addToast({ type: 'info', title: 'Você já se candidatou a esta vaga' });
                // mark applied locally
                setVagas(prev => prev.map(x => x.id === v.id ? ({ ...x, applied: true }) : x));
                addToast({ type: 'success', title: 'Candidatura registrada', message: 'Sua candidatura foi registrada localmente.' });
              }}
              onToggleSave={() => {
                toggleSaveVaga(candidatoId, v);
                setVagas(prev => prev.filter(x => x.id !== v.id));
                addToast({ type: 'success', title: 'Vaga removida dos salvos', message: 'A vaga foi removida dos seus salvos.' });
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
