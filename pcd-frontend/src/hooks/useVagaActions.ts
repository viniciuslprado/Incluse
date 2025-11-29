import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function useFavoritos(candidatoId: number) {
  const [favoritos, setFavoritos] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!candidatoId) {
      setLoading(false);
      return;
    }

    api.listarVagasFavoritas()
      .then((vagas) => {
        setFavoritos(new Set(vagas.map(v => v.id)));
      })
      .catch((err) => {
        console.error('Erro ao carregar favoritos:', err);
      })
      .finally(() => setLoading(false));
  }, [candidatoId]);

  const isFavorited = (vagaId: number) => favoritos.has(vagaId);

  const toggleFavorite = async (vagaId: number) => {
    const wasFavorited = favoritos.has(vagaId);
    
    // Atualização otimista
    setFavoritos(prev => {
      const next = new Set(prev);
      if (wasFavorited) {
        next.delete(vagaId);
      } else {
        next.add(vagaId);
      }
      return next;
    });

    try {
      if (wasFavorited) {
        await api.desfavoritarVaga(vagaId);
      } else {
        await api.favoritarVaga(vagaId);
      }
    } catch (error) {
      // Reverter em caso de erro
      setFavoritos(prev => {
        const next = new Set(prev);
        if (wasFavorited) {
          next.add(vagaId);
        } else {
          next.delete(vagaId);
        }
        return next;
      });
      throw error;
    }
  };

  return { favoritos, isFavorited, toggleFavorite, loading };
}

export function useCandidaturas(candidatoId: number) {
  const [candidaturas, setCandidaturas] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!candidatoId) {
      setLoading(false);
      return;
    }

    api.listarCandidaturas(candidatoId)
      .then((candidaturas: any[]) => {
        setCandidaturas(new Set(candidaturas.map((c: any) => c.vagaId)));
      })
      .catch((err) => {
        console.error('Erro ao carregar candidaturas:', err);
      })
      .finally(() => setLoading(false));
  }, [candidatoId]);

  const isApplied = (vagaId: number) => candidaturas.has(vagaId);

  const apply = async (vagaId: number) => {
    // Atualização otimista
    setCandidaturas(prev => new Set([...prev, vagaId]));

    try {
      await api.candidatarVaga(candidatoId, vagaId);
    } catch (error) {
      // Reverter em caso de erro
      setCandidaturas(prev => {
        const next = new Set(prev);
        next.delete(vagaId);
        return next;
      });
      throw error;
    }
  };

  return { candidaturas, isApplied, apply, loading };
}
