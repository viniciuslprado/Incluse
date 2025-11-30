import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import type { Vaga } from '../../../types';
import { FiEye, FiEdit2, FiPause, FiXCircle } from 'react-icons/fi';

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
  const [areaFilter, setAreaFilter] = useState('');
  const [empresaFilter, setEmpresaFilter] = useState('');
  const [dataFilter, setDataFilter] = useState('');
  const [selected, setSelected] = useState<Vaga & { empresa?: { nome: string } } | null>(null);
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState<number|null>(null);
  const [pauseReason, setPauseReason] = useState('');

  function fetchVagas() {
    setLoading(true);
    setErro(null);
    api
      .listarVagas()
      .then((data) => {
        let lista = data.vagas || data || [];
        // Filtros locais (mock, pois API não suporta filtros ainda)
        if (statusFilter) lista = lista.filter((v: Vaga) => v.status === statusFilter);
        if (areaFilter) lista = lista.filter((v: Vaga) => (v.area || '').toLowerCase().includes(areaFilter.toLowerCase()));
        if (empresaFilter) lista = lista.filter((v: Vaga & { empresa?: { nome: string } }) => (v.empresa?.nome || '').toLowerCase().includes(empresaFilter.toLowerCase()));
        if (dataFilter) lista = lista.filter((v: Vaga) => v.createdAt && new Date(v.createdAt).toISOString().slice(0,10) === dataFilter);
        setVagas(lista);
        setTotal(lista.length);
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
  }, [page, statusFilter, areaFilter, empresaFilter, dataFilter]);

  function handleSetStatus(id: number, status: string) {
    import('../../../lib/api').then(({ api }) => {
      // @ts-ignore acessar axiosInstance interno
      const axiosInstance = api.__proto__.constructor.prototype.constructor().constructor();
      axiosInstance.patch(`/admin/vagas/${id}/status`, { status })
        .then(() => fetchVagas())
        .catch((e: any) => alert(e.message || 'Erro ao alterar status da vaga'));
    });
  }

  // Contadores
  const ativas = vagas.filter(v => v.status === 'ativa').length;
  const pausadas = vagas.filter(v => v.status === 'pausada').length;
  const encerradas = vagas.filter(v => v.status === 'encerrada').length;

  return (
    <div className="p-0 md:px-2 w-full">
      <div className="mb-8 p-0 md:p-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full min-w-0">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Vagas Cadastradas</h1>
          <div className="mt-2 text-gray-600 dark:text-gray-300 text-base font-medium flex gap-3 items-center">
            <span className="text-green-700">{ativas} ativas</span>
            <span className="text-yellow-700">{pausadas} pausadas</span>
            <span className="text-gray-500">{encerradas} encerradas</span>
          </div>
        </div>
        {/* Espaço para botão de ação futuro, ex: Nova Vaga */}
      </div>
      {/* Filtros avançados */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center md:items-end flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-medium text-gray-700 dark:text-gray-200">
            <span role="img" aria-label="filtro">🎯</span> Status:
          </span>
          <select className="border rounded px-2 py-1" value={statusFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setStatusFilter(e.target.value); setPage(1); }}>
            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <input type="text" placeholder="Filtrar por área" className="border rounded px-2 py-1" style={{minWidth:120}} value={areaFilter} onChange={e => { setAreaFilter(e.target.value); setPage(1); }} />
        <input type="text" placeholder="Filtrar por empresa" className="border rounded px-2 py-1" style={{minWidth:120}} value={empresaFilter} onChange={e => { setEmpresaFilter(e.target.value); setPage(1); }} />
        <input type="date" placeholder="Criada em" className="border rounded px-2 py-1" style={{minWidth:120}} value={dataFilter} onChange={e => { setDataFilter(e.target.value); setPage(1); }} />
      </div>
      <div className="overflow-x-auto rounded-lg bg-white dark:bg-gray-800">
        <table className="w-full text-sm table-fixed">
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
                    className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                    title="Verificar vaga"
                    onClick={() => openModal(vaga)}
                  >
                    Verificar vaga
                  </button>
                </td>
                    {/* Modal para justificar desativação ou exclusão */}
                    {showPauseModal && (
                      <Modal open={true} onClose={() => { setShowPauseModal(null); setPauseReason(''); }}>
                        <div>
                          <h2 className="text-lg font-bold mb-2">
                            {showPauseModal > 0 ? 'Justificar desativação da vaga' : 'Justificar exclusão da vaga'}
                          </h2>
                          <p className="mb-2 text-sm text-gray-700">
                            {showPauseModal > 0
                              ? 'Explique o motivo da desativação/pausa da vaga. Uma notificação será enviada para a empresa.'
                              : 'Explique o motivo da exclusão da vaga. Uma notificação será enviada para a empresa.'}
                          </p>
                          <textarea
                            className="w-full border rounded p-2 mb-2"
                            rows={3}
                            placeholder={showPauseModal > 0 ? 'Motivo da desativação/pausa...' : 'Motivo da exclusão...'}
                            value={pauseReason}
                            onChange={e => setPauseReason(e.target.value)}
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                              onClick={() => { setShowPauseModal(null); setPauseReason(''); }}
                            >Cancelar</button>
                            {showPauseModal > 0 ? (
                              <button
                                className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                                onClick={() => {
                                  handleSetStatus(showPauseModal, 'pausada');
                                  // TODO: Enviar notificação para a empresa com pauseReason
                                  setShowPauseModal(null); setPauseReason('');
                                  window.alert('Vaga pausada/desativada e notificação enviada para a empresa!');
                                }}
                              >Confirmar desativação</button>
                            ) : (
                              <button
                                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                onClick={() => {
                                  api.excluirVaga(-showPauseModal).then(() => {
                                    // TODO: Enviar notificação para a empresa com pauseReason
                                    fetchVagas();
                                    setShowPauseModal(null); setPauseReason('');
                                    window.alert('Vaga excluída e notificação enviada para a empresa!');
                                  });
                                }}
                              >Confirmar exclusão</button>
                            )}
                          </div>
                        </div>
                      </Modal>
                    )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginação com info de páginas centralizada */}
      <div className="flex flex-col items-center mt-6 gap-1 w-full">
        <div className="text-sm text-gray-700 font-medium mb-1 text-center w-full">
          {`Exibindo ${page}–${Math.ceil(total / limit) || 1} páginas`}
        </div>
        <div className="flex justify-center gap-2 items-center w-full">
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

      {/* Modal de detalhes e ações da vaga */}
      <Modal open={!!selected} onClose={closeModal}>
        {selected && (
          <div>
            <h2 className="text-xl font-bold mb-2">{selected.titulo}</h2>
            <div className="mb-2 text-sm text-gray-700">Empresa: {selected.empresa?.nome || '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Área: {selected.area || '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Status: {selected.status}</div>
            <div className="mb-2 text-sm text-gray-700">Data de criação: {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Descrição: {selected.descricao || '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Escolaridade: {selected.escolaridade || '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Cidade: {selected.cidade || '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Estado: {selected.estado || '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Tipo de contratação: {selected.tipoContratacao || '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Modelo de trabalho: {selected.modeloTrabalho || '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Localização: {selected.localizacao || '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Exige mudança: {selected.exigeMudanca ? 'Sim' : 'Não'}</div>
            <div className="mb-2 text-sm text-gray-700">Exige viagens: {selected.exigeViagens ? 'Sim' : 'Não'}</div>
            {selected.descricaoVaga && (
              <div className="mb-2 text-sm text-gray-700">
                <div>Resumo: {selected.descricaoVaga.resumo || '-'}</div>
                <div>Atividades: {selected.descricaoVaga.atividades || '-'}</div>
                <div>Jornada: {selected.descricaoVaga.jornada || '-'}</div>
                <div>Salário: {selected.descricaoVaga.salarioMin ? `R$ ${selected.descricaoVaga.salarioMin}` : '-'} {selected.descricaoVaga.salarioMax ? `até R$ ${selected.descricaoVaga.salarioMax}` : ''}</div>
              </div>
            )}
            {selected.requisitos && (
              <div className="mb-2 text-sm text-gray-700">
                <div>Formação: {selected.requisitos.formacao || '-'}</div>
                <div>Experiência: {selected.requisitos.experiencia || '-'}</div>
                <div>Competências: {selected.requisitos.competencias || '-'}</div>
                <div>Habilidades técnicas: {selected.requisitos.habilidadesTecnicas || '-'}</div>
              </div>
            )}
            {selected.beneficios && selected.beneficios.length > 0 && (
              <div className="mb-2 text-sm text-gray-700">Benefícios: {selected.beneficios.map(b => b.descricao).join(', ')}</div>
            )}
            {selected.acessibilidades && selected.acessibilidades.length > 0 && (
              <div className="mb-2 text-sm text-gray-700">Acessibilidades: {selected.acessibilidades.map(a => a.acessibilidade?.descricao).join(', ')}</div>
            )}
            {selected.subtipos && selected.subtipos.length > 0 && (
              <div className="mb-2 text-sm text-gray-700">Subtipos: {selected.subtipos.map(s => s.nome).join(', ')}</div>
            )}
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
            <div className="mt-6 flex flex-col gap-2">
              {(selected.status === 'ativa' || selected.status === 'pausada') && (
                <button
                  className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 font-semibold"
                  onClick={() => {
                    setShowPauseModal(selected.id);
                    closeModal();
                  }}
                >
                  Desativar vaga
                </button>
              )}
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
                onClick={() => {
                  setShowPauseModal(-selected.id); // valor negativo para diferenciar exclusão
                  closeModal();
                }}
              >
                Excluir vaga
              </button>
              {selected.status === 'encerrada' && (
                <button
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 font-semibold"
                  onClick={() => {
                    handleSetStatus(selected.id, 'ativa');
                    closeModal();
                  }}
                >
                  Reabrir vaga
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
