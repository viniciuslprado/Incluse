import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import type { CurriculoBasico } from '../../types';

interface Props {
  candidatoId: number;
  showPdfStatus?: boolean;
  pdfFileName?: string | null;
}

// Componente para empresas visualizarem currículo de um candidato
// Obs: Por enquanto lê o currículo do localStorage (curriculo_basico_<id>)
// Futuro: mover para backend (persistência definitiva) e substituir leitura local.
export default function CurriculoVisualizacao({ candidatoId, showPdfStatus, pdfFileName }: Props) {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [candidato, setCandidato] = useState<any>(null);
  const [curriculo, setCurriculo] = useState<CurriculoBasico | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Carrega dados do candidato (nome, email, cidade, estado, telefone)
        const cand = await api.getCandidato(candidatoId);
        if (!mounted) return;
        setCandidato(cand);
        // Carrega currículo do localStorage
        const raw = localStorage.getItem(`curriculo_basico_${candidatoId}`);
        if (raw) {
          try {
            const parsed: CurriculoBasico = JSON.parse(raw);
            setCurriculo(parsed);
          } catch (e) {
            setCurriculo(null);
          }
        } else {
          setCurriculo(null);
        }
      } catch (e: any) {
        if (!mounted) return;
        setErro(e?.message || 'Erro ao carregar currículo');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [candidatoId]);

  if (loading) return <div className="p-4 text-sm">Carregando currículo...</div>;
  if (erro) return <div className="p-4 text-sm text-red-600">{erro}</div>;
  if (!candidato) return <div className="p-4 text-sm">Candidato não encontrado.</div>;

  const temBasico = !!curriculo;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <section className="bg-white border rounded p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{candidato.nome}</h1>
            <p className="text-sm text-gray-600">{(candidato.cidade || '') + (candidato.estado ? ` / ${candidato.estado}` : '')}</p>
            <p className="text-sm text-gray-600 mt-1">{candidato.email || 'E-mail não informado'} • {candidato.telefone || 'Telefone não informado'}</p>
          </div>
          {showPdfStatus && (
            <div className="text-sm">
              {pdfFileName ? (
                <span className="inline-block px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded">PDF anexado: {pdfFileName}</span>
              ) : (
                <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded">Sem PDF anexado</span>
              )}
            </div>
          )}
        </div>
        {!temBasico && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            Currículo básico não preenchido pelo candidato.
          </div>
        )}
      </section>

      {temBasico && (
        <>
          {/* Experiências */}
          <Section title="Experiências Profissionais" emptyMsg="Nenhuma experiência informada" items={curriculo?.experiencias} render={(e) => (
            <li key={e.id} className="space-y-1">
              <p className="font-medium">{e.cargo} • {e.empresa}</p>
              <p className="text-xs text-gray-600">{e.dataInicio} - {e.atualmenteTrabalha ? 'Atual' : e.dataTermino || '—'}</p>
              {e.descricao && <p className="text-sm">{e.descricao}</p>}
            </li>
          )} />

          {/* Formação */}
          <Section title="Formação Acadêmica" emptyMsg="Nenhuma formação informada" items={curriculo?.formacoes} render={(f) => (
            <li key={f.id} className="space-y-1">
              <p className="font-medium">{f.escolaridade}{f.curso ? ` • ${f.curso}` : ''}</p>
              {f.instituicao && <p className="text-sm">{f.instituicao}</p>}
              {(f.inicio || f.termino) && (
                <p className="text-xs text-gray-600">{f.inicio || '—'} - {f.termino || (f.situacao === 'cursando' ? 'Cursando' : '—')}</p>
              )}
            </li>
          )} />

          {/* Cursos */}
            <Section title="Cursos e Certificações" emptyMsg="Nenhum curso informado" items={curriculo?.cursos} render={(c) => (
            <li key={c.id} className="space-y-1">
              <p className="font-medium">{c.nome}</p>
              <p className="text-sm text-gray-600">{c.instituicao}{c.cargaHoraria ? ` • ${c.cargaHoraria}h` : ''}</p>
            </li>
          )} />

          {/* Competências */}
          <Section title="Competências / Skills" emptyMsg="Nenhuma competência informada" items={curriculo?.competencias} render={(comp) => (
            <li key={comp.id} className="space-y-1">
              <p className="font-medium">{comp.nome}</p>
              <p className="text-xs text-gray-600">{comp.tipo} • {comp.nivel}</p>
            </li>
          )} />

          {/* Idiomas */}
          <Section title="Idiomas" emptyMsg="Nenhum idioma informado" items={curriculo?.idiomas} render={(idioma) => (
            <li key={idioma.id} className="space-y-1">
              <p className="font-medium">{idioma.idioma}</p>
              <p className="text-xs text-gray-600">{idioma.nivel}</p>
            </li>
          )} />
        </>
      )}
    </div>
  );
}

interface SectionProps<T> {
  title: string;
  emptyMsg: string;
  items?: T[];
  render: (item: T) => React.ReactNode;
}

function Section<T extends { id?: number }>({ title, emptyMsg, items, render }: SectionProps<T>) {
  return (
    <section className="bg-white border rounded p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {(!items || items.length === 0) ? (
        <p className="text-sm text-gray-500">{emptyMsg}</p>
      ) : (
        <ul className="space-y-4">
          {items.map(render)}
        </ul>
      )}
    </section>
  );
}
