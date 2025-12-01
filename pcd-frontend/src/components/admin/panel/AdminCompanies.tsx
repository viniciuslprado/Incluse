import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import type { Empresa } from '../../../types';
// import type { Vaga } from '../../../types'; // Removido pois não é usado

// Modal removido pois não é utilizado
// EmpresaListResult removido pois não é utilizado


export default function AdminCompanies() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<string>('');
  // const [nomeFilter, setNomeFilter] = useState<string>('');
  const [dataFilter, setDataFilter] = useState<string>('');
  const [detalheEmpresa, setDetalheEmpresa] = useState<Empresa | null>(null);
  const [loadingDetalhe, setLoadingDetalhe] = useState(false);
  const [erroDetalhe, setErroDetalhe] = useState<string | null>(null);

  function fetchEmpresas() {
    setLoading(true);
    setErro(null);
    api
      .listarEmpresas()
      .then((data) => {
        let lista = data.empresas || [];
        // Filtros locais (mock, pois API não suporta filtros ainda)
        if (statusFilter) lista = lista.filter((e: Empresa) => statusFilter === 'ativa' ? e.isActive : !e.isActive);
        if (areaFilter) lista = lista.filter((e: Empresa) => (e.areaAtuacao || '').toLowerCase().includes(areaFilter.toLowerCase()));
        // filtro por nome removido
        if (dataFilter) lista = lista.filter((e: Empresa) => e.createdAt && new Date(e.createdAt).toISOString().slice(0,10) === dataFilter);
        setEmpresas(lista);
        setTotal(lista.length);
      })
      .catch((e) => setErro(e.message || 'Erro ao carregar empresas'))
      .finally(() => setLoading(false));
  }


  // selected, vagas, loadingModal removidos pois não são utilizados

  useEffect(() => {
    fetchEmpresas();
    // eslint-disable-next-line
  }, [page, statusFilter, areaFilter, dataFilter]);

  // openModal removido pois não é utilizado


  function handleStatusChange(id: number, isActive: boolean) {
    import('../../../lib/api').then(({ api }) => {
      // @ts-ignore acessar axiosInstance interno
      const axiosInstance = api.__proto__.constructor.prototype.constructor().constructor();
      axiosInstance.patch(`/admin/empresas/${id}/status`, { isActive: !isActive })
        .then(() => fetchEmpresas())
        .catch((e: any) => alert(e.message || 'Erro ao alterar status'));
    });
  }

  function handleVerDetalhes(id: number) {
    setLoadingDetalhe(true);
    setErroDetalhe(null);
    api.obterEmpresaAdmin(id)
      .then((empresa) => setDetalheEmpresa(empresa))
      .catch((e) => setErroDetalhe(e.message || 'Erro ao buscar detalhes'))
      .finally(() => setLoadingDetalhe(false));
  }

  // Contadores
  const ativas = empresas.filter(e => e.isActive).length;
  const inativas = empresas.filter(e => !e.isActive).length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Empresas</h1>
      {/* Contadores */}
      <div className="mb-2 flex flex-wrap gap-4 items-center text-base font-medium">
        <span className="text-green-700">{ativas} ativas</span>
        <span className="text-gray-500">{inativas} desativadas</span>
      </div>
      {/* Filtros avançados */}
      <div className="mb-4 flex flex-col md:flex-row gap-4 items-center md:items-end flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-medium text-gray-700">
            <span role="img" aria-label="filtro">🎯</span> Status:
          </span>
          <select className="border rounded px-2 py-1" value={statusFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">Todos</option>
            <option value="ativa">Ativa</option>
            <option value="inativa">Desativada</option>
          </select>
        </div>
        <input type="text" placeholder="Filtrar por área" className="border rounded px-2 py-1" style={{minWidth:120}} value={areaFilter} onChange={e => { setAreaFilter(e.target.value); setPage(1); }} />
        {/* Filtro por empresa removido */}
        <input type="date" placeholder="Data de cadastro" className="border rounded px-2 py-1" style={{minWidth:120}} value={dataFilter} onChange={e => { setDataFilter(e.target.value); setPage(1); }} />
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
                  <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => handleVerDetalhes(empresa.id)}>Ver detalhes</button>
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
      {/* Modal de detalhes da empresa */}
      {detalheEmpresa && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setDetalheEmpresa(null)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Detalhes da Empresa</h2>
            {loadingDetalhe ? (
              <div>Carregando...</div>
            ) : erroDetalhe ? (
              <div className="text-red-600">{erroDetalhe}</div>
            ) : (
              <div className="space-y-2 text-sm max-h-[70vh] overflow-y-auto pr-2">
                <div><b>ID:</b> {detalheEmpresa.id}</div>
                <div><b>Nome:</b> {detalheEmpresa.nome}</div>
                <div><b>Nome do Contato:</b> {detalheEmpresa.nomeContato || '-'}</div>
                <div><b>Email:</b> {detalheEmpresa.email || '-'}</div>
                <div><b>CNPJ:</b> {detalheEmpresa.cnpj || '-'}</div>
                <div><b>Telefone:</b> {detalheEmpresa.telefone || '-'}</div>
                <div><b>Quantidade de Funcionários:</b> {detalheEmpresa.quantidadeFuncionarios || '-'}</div>
                <div><b>Cargo:</b> {detalheEmpresa.cargo || '-'}</div>
                <div><b>Área de Atuação:</b> {detalheEmpresa.areaAtuacao || '-'}</div>
                <div><b>Descrição:</b> {detalheEmpresa.descricao || '-'}</div>
                <div><b>Endereço:</b> {detalheEmpresa.endereco || '-'}</div>
                <div><b>CEP:</b> {detalheEmpresa.cep || '-'}</div>
                <div><b>Rua:</b> {detalheEmpresa.rua || '-'}</div>
                <div><b>Número:</b> {detalheEmpresa.numero || '-'}</div>
                <div><b>Bairro:</b> {detalheEmpresa.bairro || '-'}</div>
                <div><b>Cidade:</b> {detalheEmpresa.cidade || '-'}</div>
                <div><b>Estado:</b> {detalheEmpresa.estado || '-'}</div>
                <div><b>Status:</b> {detalheEmpresa.isActive ? 'Ativa' : 'Inativa'}</div>
                <div><b>Data de Cadastro:</b> {detalheEmpresa.createdAt ? new Date(detalheEmpresa.createdAt).toLocaleString() : '-'}</div>
                <div><b>Atualizada em:</b> {detalheEmpresa.updatedAt ? new Date(detalheEmpresa.updatedAt).toLocaleString() : '-'}</div>
                <div><b>Logo:</b> {detalheEmpresa.logoUrl ? (<a href={detalheEmpresa.logoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver logo</a>) : '-'}</div>
                {/* Avaliações */}
                <div className="mt-4">
                  <b>Avaliações:</b>
                  {Array.isArray((detalheEmpresa as any).avaliacoes) && (detalheEmpresa as any).avaliacoes.length > 0 ? (
                    <ul className="list-disc ml-5 mt-1">
                      {(detalheEmpresa as any).avaliacoes.map((a: any) => (
                        <li key={a.id} className="mb-1">
                          <span className="font-semibold">Nota:</span> {a.nota} | <span className="font-semibold">Comentário:</span> {a.comentario || '-'} | <span className="font-semibold">Anônimo:</span> {a.anonimato ? 'Sim' : 'Não'} | <span className="font-semibold">Data:</span> {a.createdAt ? new Date(a.createdAt).toLocaleString() : '-'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="ml-2">Nenhuma avaliação encontrada.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
