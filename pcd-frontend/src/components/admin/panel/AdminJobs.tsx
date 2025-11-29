import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import type { Vaga } from '../../../types';
import { FiEye, FiEdit2, FiArchive } from 'react-icons/fi';

function StatusBadge({ status }: { status: string }) {
  let color = 'bg-gray-300';
  let dot = 'bg-gray-500';
  let label = status;
  if (status === 'ativa') {
    color = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    dot = 'bg-green-500';
    label = 'Ativa';
  } else if (status === 'pausada') {
    color = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    dot = 'bg-yellow-400';
    label = 'Pausada';
  } else if (status === 'encerrada') {
    color = 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    dot = 'bg-gray-400';
    label = 'Encerrada';
  }
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`}></span>
      {label}
    </span>
  );
}

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

// VagaListResult removido pois não é utilizado

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'ativa', label: 'Ativa' },
  { value: 'pausada', label: 'Pausada' },
  { value: 'encerrada', label: 'Encerrada' },
];

export default function AdminJobs() {
  const [vagas, setVagas] = useState<(Vaga & { empresa?: { nome: string } })[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<Vaga & { empresa?: { nome: string } } | null>(null);
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [loadingModal, setLoadingModal] = useState(false);

  function fetchVagas() {
    setLoading(true);
    setErro(null);
    api
      .listarVagas()
      .then((data) => {
        setVagas(data.vagas || data || []);
        setTotal(data.total || 0);
      })
      .catch((e) => setErro(e.message || 'Erro ao carregar vagas'))
      .finally(() => setLoading(false));
  }

  function openModal(vaga: Vaga & { empresa?: { nome: string } }) {
    setSelected(vaga);
    setLoadingModal(true);
    api.listarCandidatosPorVaga(vaga.id)
      .then((data) => setCandidatos(data || []))
      .catch(() => setCandidatos([]))
      .finally(() => setLoadingModal(false));
  }

  function closeModal() {
    setSelected(null);
    setCandidatos([]);
  }

  useEffect(() => {
    fetchVagas();
    // eslint-disable-next-line
  }, [page, statusFilter]);

  function handleSetStatus(id: number, status: string) {
    import('../../../lib/api').then(({ api }) => {
      // @ts-ignore acessar axiosInstance interno
      const axiosInstance = api.__proto__.constructor.prototype.constructor().constructor();
      axiosInstance.patch(`/admin/vagas/${id}/status`, { status })
        .then(() => fetchVagas())
        .catch((e: any) => alert(e.message || 'Erro ao alterar status da vaga'));
    });
  }

  return (
    <div className="p-0 md:px-2 w-full">
      <div className="mb-8 p-0 md:p-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full min-w-0">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Vagas Cadastradas</h1>
          <div className="mt-2 text-gray-600 dark:text-gray-300 text-lg font-medium flex gap-4 items-center">
            {vagas.length > 0 ? (
              <>
                <span>{vagas.filter(v => v.status === 'ativa').length} ativas</span>
                <span>• {vagas.filter(v => v.status === 'pausada').length} pausadas</span>
                <span>• {vagas.filter(v => v.status === 'encerrada').length} encerradas</span>
              </>
            ) : (
              <span>Nenhuma vaga cadastrada</span>
            )}
          </div>
        </div>
        {/* Espaço para botão de ação futuro, ex: Nova Vaga */}
      </div>
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center md:items-end flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-medium text-gray-700 dark:text-gray-200">
            <span role="img" aria-label="filtro">🎯</span> Status:
          </span>
          <select className="border rounded px-2 py-1" value={statusFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setStatusFilter(e.target.value); setPage(1); }}>
            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        {/* Filtros avançados: Área, Empresa, Data (placeholder para drawer/lateral futuramente) */}
        <div className="flex gap-2 flex-wrap">
          <input type="text" placeholder="Filtrar por área" className="border rounded px-2 py-1" style={{minWidth:120}} disabled />
          <input type="text" placeholder="Filtrar por empresa" className="border rounded px-2 py-1" style={{minWidth:120}} disabled />
          <input type="date" placeholder="Criada em" className="border rounded px-2 py-1" style={{minWidth:120}} disabled />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:bg-gray-800">
        <table className="w-full text-base table-fixed">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-0 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 w-[22%] truncate">Empresa</th>
              <th className="px-0 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 w-[22%] truncate">Título</th>
              <th className="px-0 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 w-[16%] truncate">Área</th>
              <th className="px-0 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 w-[12%] truncate">Status</th>
              <th className="px-0 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 w-[14%] truncate">Criada em</th>
              <th className="px-0 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 w-[14%] truncate">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-lg">Carregando...</td></tr>
            ) : erro ? (
              <tr><td colSpan={6} className="text-center text-red-600 py-10 text-lg">{erro}</td></tr>
            ) : vagas.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-lg">Nenhuma vaga encontrada</td></tr>
            ) : vagas.map((vaga) => (
              <tr key={vaga.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b last:border-b-0">
                <td className="px-0 py-4 truncate max-w-[200px]">{vaga.empresa?.nome || '-'}</td>
                <td className="px-0 py-4 truncate max-w-[200px] font-semibold text-gray-900 dark:text-gray-100">{vaga.titulo}</td>
                <td className="px-0 py-4 truncate max-w-[120px]">{vaga.area ? vaga.area : '-'}</td>
                <td className="px-4 py-4 whitespace-nowrap capitalize"><StatusBadge status={vaga.status ?? ''} /></td>
                <td className="px-4 py-4 whitespace-nowrap">{vaga.createdAt ? new Date(vaga.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '-'}</td>
                <td className="px-4 py-4 flex gap-2 items-center">
                  <button
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Visualizar"
                    onClick={() => openModal(vaga)}
                  >
                    <FiEye className="w-5 h-5 text-blue-600" />
                  </button>
                  <button
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Editar"
                    onClick={() => window.alert('Funcionalidade de edição em breve')}
                  >
                    <FiEdit2 className="w-5 h-5 text-green-600" />
                  </button>
                  {(vaga.status === 'ativa' || vaga.status === 'pausada') && (
                    <button
                      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Arquivar"
                      onClick={() => handleSetStatus(vaga.id, 'encerrada')}
                    >
                      <FiArchive className="w-5 h-5 text-yellow-600" />
                    </button>
                  )}
                  {vaga.status === 'encerrada' && (
                    <button
                      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Reabrir"
                      onClick={() => handleSetStatus(vaga.id, 'ativa')}
                    >
                      <FiArchive className="w-5 h-5 text-green-600" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginação */}
      <div className="flex flex-col items-center justify-center mt-6 gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {total > 0
            ? `Exibindo ${(page - 1) * limit + 1}–${Math.min(page * limit, total)} de ${total} vagas`
            : 'Nenhuma vaga encontrada'}
        </span>
        <div className="flex gap-1 items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium disabled:opacity-50"
          >
            ◀
          </button>
          {/* Números de página (máx 5) */}
          {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1)
            .filter(p =>
              p === 1 ||
              p === Math.ceil(total / limit) ||
              (p >= page - 1 && p <= page + 1)
            )
            .map((p, idx, arr) => (
              <React.Fragment key={p}>
                {idx > 0 && p - arr[idx - 1] > 1 && <span className="px-1">…</span>}
                <button
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded font-medium ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
                  disabled={p === page}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}
          <button
            disabled={page * limit >= total}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium disabled:opacity-50"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Modal de detalhes da vaga */}
      <Modal open={!!selected} onClose={closeModal}>
        {selected && (
          <div>
            <h2 className="text-xl font-bold mb-2">{selected.titulo}</h2>
            <div className="mb-2 text-sm text-gray-700">Empresa: {selected.empresa?.nome || '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Área: {selected.area || '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Status: {selected.status}</div>
            <div className="mb-2 text-sm text-gray-700">Data de criação: {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Descrição: {selected.descricao || '-'}</div>
            <h3 className="font-semibold mt-4 mb-2">Candidatos inscritos</h3>
            {loadingModal ? (
              <div>Carregando candidatos...</div>
            ) : candidatos.length === 0 ? (
              <div className="text-gray-500">Nenhum candidato inscrito</div>
            ) : (
              <ul className="list-disc pl-5 text-sm">
                {candidatos.map((c: any) => (
                  <li key={c.id} className="mb-1">
                    {c.candidato?.nome || 'Candidato'} - {c.status} - {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}
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
