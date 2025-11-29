
import React, { useEffect, useState } from 'react';
// import { api } from '../../../lib/api'; // Removido pois não é usado

type Log = {
  id?: number;
  tipo: string;
  mensagem: string;
  usuario?: string;
  data: string;
};


// LogListResult removido pois não é utilizado

const tipos = [
  { value: '', label: 'Todos os tipos' },
  { value: 'empresas', label: 'Empresas' },
  { value: 'vagas', label: 'Vagas' },
  { value: 'auth', label: 'Auth' },
];

export default function AdminLogs() {
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
  const [logs, setLogs] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [tipo, setTipo] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [selected, setSelected] = useState<Log | null>(null);

  function fetchLogs() {
    setLoading(true);
    setErro(null);
    import('../../../lib/api').then(({ api }) => {
      // @ts-ignore acessar axiosInstance interno
      const axiosInstance = api.__proto__.constructor.prototype.constructor().constructor();
      axiosInstance.get('/admin/logs', { params: { page, limit, tipo: tipo || undefined } })
        .then((res: any) => {
          setLogs(res.data.data || res.data.logs || []);
          setTotal(res.data.pagination?.total || res.data.total || 0);
        })
        .catch((e: any) => setErro(e.message || 'Erro ao carregar logs'))
        .finally(() => setLoading(false));
    });
  }

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [page, tipo]);

  return (
    <div className="p-2 md:p-4">
      <h1 className="text-2xl font-bold mb-6">Logs do Sistema</h1>
      <div className="mb-4">
        <select className="border px-3 py-2 rounded" value={tipo} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setTipo(e.target.value); setPage(1); }}>
          {tipos.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Mensagem</th>
              <th className="px-4 py-2 text-left">Usuário</th>
              <th className="px-4 py-2 text-left">Data</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-6">Carregando...</td></tr>
            ) : erro ? (
              <tr><td colSpan={4} className="text-center text-red-600 py-6">{erro}</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-6">Nenhum log encontrado</td></tr>
            ) : logs.map((log, i) => (
              <tr key={log.id || i} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelected(log)}>
                <td className="px-4 py-2 whitespace-nowrap">{log.tipo}</td>
                <td className="px-4 py-2 whitespace-nowrap">{log.mensagem}</td>
                <td className="px-4 py-2 whitespace-nowrap">{log.usuario || '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap">{log.data ? new Date(log.data).toLocaleString() : '-'}</td>
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

      {/* Modal de detalhes do log */}
      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div>
            <h2 className="text-xl font-bold mb-2">Log de {selected.tipo}</h2>
            <div className="mb-2 text-sm text-gray-700">Usuário: {selected.usuario || '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Data: {selected.data ? new Date(selected.data).toLocaleString() : '-'}</div>
            <div className="mb-2 text-sm text-gray-700">Mensagem:</div>
            <div className="bg-gray-100 rounded p-2 text-sm text-gray-800 whitespace-pre-wrap break-words">{selected.mensagem}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
