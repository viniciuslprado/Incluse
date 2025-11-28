import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import type { Empresa } from '../../../types';
import type { Vaga } from '../../../types';

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
type EmpresaListResult = {
  empresas: Empresa[];
  total: number;
};

export default function AdminCompanies() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  function fetchEmpresas() {
    setLoading(true);
    setErro(null);
    api
      .listarEmpresas()
      .then((data) => {
        setEmpresas(data.empresas || []);
        setTotal(data.total || 0);
      })
      .catch((e) => setErro(e.message || 'Erro ao carregar empresas'))
      .finally(() => setLoading(false));
  }


  const [selected, setSelected] = useState<Empresa | null>(null);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    fetchEmpresas();
    // eslint-disable-next-line
  }, [page, statusFilter]);

  function openModal(empresa: Empresa) {
    setSelected(empresa);
    setLoadingModal(true);
    api.listarVagas(empresa.id)
      .then((data) => setVagas(data || []))
      .catch(() => setVagas([]))
      .finally(() => setLoadingModal(false));
  }

  function handleStatusChange(id: number, isActive: boolean) {
    api
      .patch(`/admin/empresas/${id}/status`, { isActive: !isActive })
      .then(() => fetchEmpresas())
      .catch((e) => alert(e.message || 'Erro ao alterar status'));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Empresas</h1>
      <div className="mb-4 flex gap-4 items-center">
        <label>Status:
          <select className="ml-2 border rounded px-2 py-1" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">Todos</option>
            <option value="ativa">Ativa</option>
            <option value="inativa">Inativa</option>
          </select>
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">CNPJ</th>
              <th className="px-4 py-2">Data de Cadastro</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-6">Carregando...</td></tr>
            ) : erro ? (
              <tr><td colSpan={5} className="text-center text-red-600 py-6">{erro}</td></tr>
            ) : empresas.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-6">Nenhuma empresa encontrada</td></tr>
            ) : empresas.map((empresa) => (
              <tr key={empresa.id}>
                <td className="px-4 py-2">{empresa.nome}</td>
                <td className="px-4 py-2">{empresa.cnpj}</td>
                <td className="px-4 py-2">{empresa.createdAt ? new Date(empresa.createdAt).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-2">{empresa.isActive ? 'Ativa' : 'Inativa'}</td>
                <td className="px-4 py-2">
                  <button
                    className={`px-2 py-1 rounded mr-2 ${empresa.isActive ? 'bg-yellow-500' : 'bg-green-600'} text-white`}
                    onClick={() => handleStatusChange(empresa.id, !!empresa.isActive)}
                  >
                    {empresa.isActive ? 'Desativar' : 'Ativar'}
                  </button>
                  <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => alert('Ver detalhes em breve')}>Ver detalhes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginação */}
      <div className="flex justify-end mt-4 gap-2">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Anterior</button>
        <span className="px-2">Página {page}</span>
        <button disabled={page * limit >= total} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Próxima</button>
      </div>
    </div>
  );
}
