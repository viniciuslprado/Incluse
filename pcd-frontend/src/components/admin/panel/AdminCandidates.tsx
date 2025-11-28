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

type CandidatoListResult = {
  candidatos: (Candidato & { totalCandidaturas?: number })[];
  total: number;
};

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

  function fetchCandidatos() {
    setLoading(true);
    setErro(null);
    api
      .listarCandidatos()
      .then((data) => {
        // Garante que candidatos sempre será um array
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
        setCandidatos(candidatosArr);
        setTotal((data && data.total) || candidatosArr.length || 0);
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
  }, [page]);

  return (
    <div className="p-2 md:p-4">
      <h1 className="text-2xl font-bold mb-6">Candidatos</h1>
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
      {/* Paginação */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
        <span className="text-sm text-gray-600">Total: {total}</span>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Anterior</button>
          <span className="px-2">Página {page}</span>
          <button disabled={page * limit >= total} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Próxima</button>
        </div>
      </div>

      {/* Modal de detalhes do candidato */}
      <Modal open={!!selected} onClose={closeModal}>
        {selected && (
          <div>
            <h2 className="text-xl font-bold mb-2">{selected.nome}</h2>
            <div className="mb-2 text-sm text-gray-700">Email: {selected.email}</div>
            <div className="mb-2 text-sm text-gray-700">Cidade/Estado: {selected.cidade || '-'} / {selected.estado || '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Escolaridade: {selected.escolaridade || '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Data de cadastro: {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Total de candidaturas: {selected.totalCandidaturas ?? (selected.candidaturas?.length ?? '-')}</div>
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
