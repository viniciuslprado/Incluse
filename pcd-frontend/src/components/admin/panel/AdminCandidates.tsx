import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import type { Candidato } from '../../../types';

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        {children}
      </div>
    </div>
  );
}

// type CandidatoListResult = {
//   candidatos: (Candidato & { totalCandidaturas?: number })[];
//   total: number;
// };

export default function AdminCandidates() {
  const [candidatos, setCandidatos] = useState<(Candidato & { totalCandidaturas?: number })[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [selected, setSelected] = useState<Candidato & { totalCandidaturas?: number } | null>(null);
  const [candidaturas, setCandidaturas] = useState<any[]>([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  // const [nomeFilter, setNomeFilter] = useState('');
  const [dataFilter, setDataFilter] = useState('');

  function fetchCandidatos() {
    setLoading(true);
    setErro(null);
    api
      .listarCandidatos()
      .then((data) => {
        let candidatosArr = [];
        if (Array.isArray(data)) {
          candidatosArr = data;
        } else if (data && Array.isArray(data.candidatos)) {
          candidatosArr = data.candidatos;
        } else if (data && typeof data === 'object' && Object.keys(data).length === 0) {
          candidatosArr = [];
        } else {
          candidatosArr = [];
        }
        // Filtros locais (mock, pois API não suporta filtros ainda)
        if (statusFilter) candidatosArr = candidatosArr.filter((c: Candidato) => statusFilter === 'ativo' ? c.isActive : !c.isActive);
        // filtro por nome removido
        if (dataFilter) candidatosArr = candidatosArr.filter((c: Candidato) => c.createdAt && new Date(c.createdAt).toISOString().slice(0,10) === dataFilter);
        setCandidatos(candidatosArr);
        setTotal(candidatosArr.length);
      })
      .catch((e) => setErro(e.message || 'Erro ao carregar candidatos'))
      .finally(() => setLoading(false));
  }

  function openModal(candidato: Candidato & { totalCandidaturas?: number }) {
    setSelected(candidato);
    setLoadingModal(true);
    api.listarCandidaturas(candidato.id)
      .then((data) => setCandidaturas(data || []))
      .catch(() => setCandidaturas([]))
      .finally(() => setLoadingModal(false));
  }

  function closeModal() {
    setSelected(null);
    setCandidaturas([]);
  }

  useEffect(() => {
    fetchCandidatos();
    // eslint-disable-next-line
  }, [page, statusFilter, dataFilter]);

  // Contadores
  const ativos = candidatos.filter(c => c.isActive).length;
  const inativos = candidatos.filter(c => !c.isActive).length;

  return (
    <div className="p-2 md:p-4">
      <h1 className="text-2xl font-bold mb-6">Candidatos</h1>
      {/* Contadores */}
      <div className="mb-2 flex flex-wrap gap-4 items-center text-base font-medium">
        <span className="text-green-700">{ativos} ativos</span>
        <span className="text-gray-500">{inativos} desativados</span>
      </div>
      {/* Filtros avançados */}
      <div className="mb-4 flex flex-col md:flex-row gap-4 items-center md:items-end flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-medium text-gray-700">
            <span role="img" aria-label="filtro">🎯</span> Status:
          </span>
          <select className="border rounded px-2 py-1" value={statusFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">Todos</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Desativado</option>
          </select>
        </div>
        {/* Filtro por candidato removido */}
        <input type="date" placeholder="Data de cadastro" className="border rounded px-2 py-1" style={{minWidth:120}} value={dataFilter} onChange={e => { setDataFilter(e.target.value); setPage(1); }} />
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Data de Cadastro</th>
              <th className="px-4 py-2 text-left">Total de Candidaturas</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-6">Carregando...</td></tr>
            ) : erro ? (
              <tr><td colSpan={5} className="text-center text-red-600 py-6">{erro}</td></tr>
            ) : candidatos.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-6">Nenhum candidato encontrado</td></tr>
            ) : candidatos.map((candidato) => (
              <tr key={candidato.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 whitespace-nowrap">{candidato.nome}</td>
                <td className="px-4 py-2 whitespace-nowrap">{candidato.email}</td>
                <td className="px-4 py-2 whitespace-nowrap">{candidato.createdAt ? new Date(candidato.createdAt).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-2 text-center">{candidato.totalCandidaturas ?? (candidato.candidaturas?.length ?? '-')}</td>
                <td className="px-4 py-2">
                  <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm" onClick={() => openModal(candidato)}>Ver perfil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginação estilo ◀ 1 ▶ com info de páginas */}
      <div className="flex flex-col items-center mt-4 gap-1 w-full">
        <div className="text-sm text-gray-700 font-medium mb-1 text-center w-full">
          {`Exibindo ${page}–${Math.ceil(total / limit) || 1} páginas`}
        </div>
        <div className="flex justify-center gap-2 items-center w-full">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50 text-lg"
            aria-label="Página anterior"
          >◀</button>
          <span className="px-2 font-semibold text-lg">{page}</span>
          <button
            disabled={page * limit >= total}
            onClick={() => setPage(page + 1)}
            className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50 text-lg"
            aria-label="Próxima página"
          >▶</button>
        </div>
      </div>

      {/* Modal de detalhes do candidato */}
      <Modal open={!!selected} onClose={closeModal}>
        {selected && (
          <div>
            <h2 className="text-xl font-bold mb-2">{selected.nome}</h2>
            <div className="mb-2 text-sm text-gray-700"><b>Email:</b> {selected.email || '-'}</div>
            <div className="mb-2 text-sm text-gray-700"><b>Telefone:</b> {selected.telefone || '-'}</div>
            <div className="mb-2 text-sm text-gray-700"><b>CPF:</b> {selected.cpf || '-'}</div>
            <div className="mb-2 text-sm text-gray-700"><b>Cidade:</b> {selected.cidade || '-'}</div>
            <div className="mb-2 text-sm text-gray-700"><b>Estado:</b> {selected.estado || '-'}</div>
            <div className="mb-2 text-sm text-gray-700"><b>Escolaridade:</b> {selected.escolaridade || '-'}</div>
            <div className="mb-2 text-sm text-gray-700"><b>Curso:</b> {selected.curso || '-'}</div>
            <div className="mb-2 text-sm text-gray-700"><b>Situação:</b> {selected.situacao || '-'}</div>
            {/* <div className="mb-2 text-sm text-gray-700"><b>Disponibilidade Geográfica:</b> {selected.disponibilidadeGeografica || '-'}</div> */}
            <div className="mb-2 text-sm text-gray-700"><b>Aceita Mudança:</b> {selected.aceitaMudanca ? 'Sim' : 'Não'}</div>
            <div className="mb-2 text-sm text-gray-700"><b>Aceita Viajar:</b> {selected.aceitaViajar ? 'Sim' : 'Não'}</div>
            <div className="mb-2 text-sm text-gray-700"><b>Pretensão Salarial Mínima:</b> {selected.pretensaoSalarialMin || '-'}</div>
            <div className="mb-2 text-sm text-gray-700"><b>Data de cadastro:</b> {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : '-'}</div>
            <div className="mb-2 text-sm text-gray-700"><b>Atualizado em:</b> {selected.updatedAt ? new Date(selected.updatedAt).toLocaleDateString() : '-'}</div>
            <div className="mb-2 text-sm text-gray-700"><b>Status:</b> {selected.isActive ? 'Ativo' : 'Inativo'}</div>
            <div className="mb-2 text-sm text-gray-700"><b>Currículo:</b> {selected.curriculo ? (<a href={selected.curriculo} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver PDF</a>) : '-'}</div>
            <div className="mb-2 text-sm text-gray-700"><b>Laudo:</b> {selected.laudo ? (<a href={selected.laudo} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver Laudo</a>) : '-'}</div>
            {/* Subtipos/Deficiências */}
            {selected.subtipos && selected.subtipos.length > 0 && (
              <div className="mb-2 text-sm text-gray-700"><b>Deficiências/Subtipos:</b> {selected.subtipos.map((s) => s.subtipo?.nome).filter(Boolean).join(', ')}</div>
            )}
            {/* Áreas de formação */}
            {selected.areasFormacao && selected.areasFormacao.length > 0 && (
              <div className="mb-2 text-sm text-gray-700"><b>Áreas de Formação:</b> {selected.areasFormacao.map((a: any) => a.area?.nome || a.nome).filter(Boolean).join(', ')}</div>
            )}
            {/* Experiências */}
            {selected.experiencias && selected.experiencias.length > 0 && (
              <div className="mb-2 text-sm text-gray-700"><b>Experiências:</b>
                <ul className="list-disc ml-5">
                  {selected.experiencias.map((exp, i) => (
                    <li key={i}>{exp.cargo} em {exp.empresa} ({exp.dataInicio} - {exp.dataTermino || 'Atual'})</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Formações */}
            {selected.formacoes && selected.formacoes.length > 0 && (
              <div className="mb-2 text-sm text-gray-700"><b>Formações:</b>
                <ul className="list-disc ml-5">
                  {selected.formacoes.map((f, i) => (
                    <li key={i}>{f.escolaridade} - {f.instituicao} {f.curso ? `(${f.curso})` : ''} {f.anoConclusao ? `- Concluído em ${f.anoConclusao}` : ''}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Cursos */}
            {selected.cursos && selected.cursos.length > 0 && (
              <div className="mb-2 text-sm text-gray-700"><b>Cursos:</b>
                <ul className="list-disc ml-5">
                  {selected.cursos.map((c, i) => (
                    <li key={i}>{c.nome} - {c.instituicao} {c.cargaHoraria ? `(${c.cargaHoraria}h)` : ''}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Competências */}
            {selected.competencias && selected.competencias.length > 0 && (
              <div className="mb-2 text-sm text-gray-700"><b>Competências:</b>
                <ul className="list-disc ml-5">
                  {selected.competencias.map((comp, i) => (
                    <li key={i}>{comp.tipo}: {comp.nome} ({comp.nivel})</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Idiomas */}
            {selected.idiomas && selected.idiomas.length > 0 && (
              <div className="mb-2 text-sm text-gray-700"><b>Idiomas:</b>
                <ul className="list-disc ml-5">
                  {selected.idiomas.map((idioma, i) => (
                    <li key={i}>{idioma.idioma} ({idioma.nivel})</li>
                  ))}
                </ul>
              </div>
            )}
            <h3 className="font-semibold mt-4 mb-2">Candidaturas realizadas</h3>
            {loadingModal ? (
              <div>Carregando candidaturas...</div>
            ) : candidaturas.length === 0 ? (
              <div className="text-gray-500">Nenhuma candidatura encontrada</div>
            ) : (
              <ul className="list-disc pl-5 text-sm">
                {candidaturas.map((c: any) => (
                  <li key={c.id} className="mb-1">
                    {c.vaga?.titulo || 'Vaga'} - {c.status} - {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
