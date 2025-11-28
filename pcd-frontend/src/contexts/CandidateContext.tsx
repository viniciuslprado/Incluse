import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

interface CandidateData {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  cidade?: string | null;
  estado?: string | null;
  disponibilidadeGeografica?: string | null;
  aceitaMudanca?: boolean | null;
  aceitaViajar?: boolean | null;
  pretensaoSalarialMin?: number | null;
  loading: boolean;
  refresh: () => Promise<void>;
  perfilCompleto: boolean;
  missingFields: string[];
}

const CandidateContext = createContext<CandidateData | undefined>(undefined);

export function useCandidate() {
  const ctx = useContext(CandidateContext);
  if (!ctx) throw new Error('useCandidate deve ser usado dentro de CandidateProvider');
  return ctx;
}

type Props = { candidatoId: number; children: React.ReactNode };

export function CandidateProvider({ candidatoId, children }: Props) {
  const [state, setState] = useState<any>({ nome: '', cpf: '', email: '' });
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!candidatoId) return;
    setLoading(true);
    try {
      const data: any = await api.getCandidato(candidatoId);
      setState({
        nome: data.nome ?? '',
        cpf: data.cpf ?? '',
        email: data.email ?? '',
        telefone: data.telefone ?? '',
        cidade: data.cidade ?? null,
        estado: data.estado ?? null,
        disponibilidadeGeografica: data.disponibilidadeGeografica ?? null,
        aceitaMudanca: data.aceitaMudanca ?? null,
        aceitaViajar: data.aceitaViajar ?? null,
        pretensaoSalarialMin: data.pretensaoSalarialMin ?? null,
      });
    } catch (e) {
      // ...existing code...
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [candidatoId]);

  const missing: string[] = [];
  if (!state.cidade) missing.push('Cidade onde mora');
  if (!state.estado) missing.push('Estado');
  if (!state.disponibilidadeGeografica) missing.push('Disponibilidade geográfica');
  if (state.aceitaMudanca === null || state.aceitaMudanca === undefined) missing.push('Aceita mudança');
  if (state.aceitaViajar === null || state.aceitaViajar === undefined) missing.push('Aceita viajar');
  const perfilCompleto = missing.length === 0;

  return (
    <CandidateContext.Provider value={{ id: candidatoId, ...state, loading, refresh: load, perfilCompleto, missingFields: missing }}>
      {children}
    </CandidateContext.Provider>
  );
}
