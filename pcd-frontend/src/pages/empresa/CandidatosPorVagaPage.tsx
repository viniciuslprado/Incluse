import { useState, useEffect } from 'react';

// Componente de abas para o modal de currículo
import type { FC } from 'react';
interface ModalTabsProps {
  curriculoPdfUrl: string;
  curriculoBasico: CurriculoBasico | null;
  candidatoNome?: string;
}
const ModalTabs: FC<ModalTabsProps> = ({ curriculoPdfUrl, curriculoBasico, candidatoNome }) => {
  // Só mostra a aba PDF se a URL for não vazia e diferente de null/undefined
  const hasPdf = !!curriculoPdfUrl && curriculoPdfUrl.trim() !== '';
  const hasCurriculo = !!curriculoBasico;
  const [tab, setTab] = useState(hasPdf ? 'pdf' : 'preenchido');
  return (
    <div>
      <div className="flex border-b mb-4">
        {hasPdf && (
          <button
            className={`px-4 py-2 -mb-px border-b-2 font-medium text-sm focus:outline-none transition-colors duration-150 ${tab === 'pdf' ? 'border-green-600 text-green-700 dark:text-green-300' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
            onClick={() => setTab('pdf')}
            type="button"
          >
            PDF Anexado
          </button>
        )}
        {hasCurriculo && (
          <button
            className={`px-4 py-2 -mb-px border-b-2 font-medium text-sm focus:outline-none transition-colors duration-150 ${tab === 'preenchido' ? 'border-purple-600 text-purple-700 dark:text-purple-300' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
            onClick={() => setTab('preenchido')}
            type="button"
          >
            Currículo Preenchido
          </button>
        )}
      </div>
      <div>
        {tab === 'pdf' && hasPdf && (
          <div className="border rounded bg-gray-50 dark:bg-gray-900 p-2 mb-4">
            <PdfViewer pdfUrl={curriculoPdfUrl} candidatoNome={candidatoNome} onClose={() => {}} />
          </div>
        )}
        {tab === 'preenchido' && hasCurriculo && (
          <div className="border rounded bg-gray-50 dark:bg-gray-900 p-2">
            <CurriculoViewer curriculo={curriculoBasico} candidatoNome={candidatoNome} />
          </div>
        )}
      </div>
    </div>
  );
};
import CustomSelect from '../../components/common/CustomSelect';
import { useRef } from 'react';
const STATUS_OPTIONS = [
  { value: 'em_analise', label: 'Em análise', color: 'bg-yellow-500' },
  { value: 'pendente', label: 'Pendente', color: 'bg-blue-500' },
  { value: 'aprovado', label: 'Aprovado', color: 'bg-green-500' },
  { value: 'rejeitado', label: 'Rejeitado', color: 'bg-red-500' },
];

import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import type { CurriculoBasico } from '../../types';
import CurriculoViewer from '../../components/curriculo/CurriculoViewer';
import PdfViewer from '../../components/curriculo/PdfViewer';
import ResponsiveCardList from '../../components/common/ResponsiveCardList';

interface Candidato {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  escolaridade: string;
  curriculo?: string;
  status?: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado';
  subtipos?: any[];
  anotacoes?: string;
  createdAt: string;
  // Campos extras para o perfil completo
  cpf?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  curso?: string;
  sobre?: string;
  aceitaMudanca?: boolean;
  aceitaViajar?: boolean;
  pretensaoSalarialMin?: string;
  areasFormacao?: any[];
  barras?: any[];
  experiencias?: any[];
  formacoes?: any[];
  cursos?: any[];
  competencias?: any[];
  idiomas?: any[];
  laudo?: string;
}

export default function CandidatosPorVagaPage() {
  const { id, vagaId } = useParams<{ id: string; vagaId: string }>();
  const empresaId = Number(id);
  const vagaIdNum = Number(vagaId);
  
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtros, setFiltros] = useState({
    escolaridade: '',
    status: '',
    tipoDeficiencia: ''
  });
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);

  // Busca detalhes completos do candidato (subtipos e barreiras) ao abrir o modal de perfil
  const handleVerPerfil = async (candidato: Candidato) => {
    setLoadingDetalhes(true);
    try {
      const detalhes = await api.getCandidato(candidato.id);
      setSelectedCandidato({ ...candidato, ...detalhes });
      setShowModal(true);
    } catch (error) {
      setSelectedCandidato(candidato); // fallback
      setShowModal(true);
    } finally {
      setLoadingDetalhes(false);
    }
  };
  const [statusMenuOpen, setStatusMenuOpen] = useState<number | null>(null);
  const statusMenuRef = useRef<HTMLDivElement | null>(null);
    // Fecha o menu de status ao clicar fora
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
          setStatusMenuOpen(null);
        }
      }
      if (statusMenuOpen !== null) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [statusMenuOpen]);
  const [showModal, setShowModal] = useState(false);
  const [curriculoBasico, setCurriculoBasico] = useState<CurriculoBasico | null>(null);
  const [curriculoPdfUrl, setCurriculoPdfUrl] = useState<string>('');
  const [showCurriculoModal, setShowCurriculoModal] = useState(false);


// Função utilitária para normalizar status vindos do backend ou dados antigos
function normalizaStatus(status: string | undefined): 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado' {
  if (!status) return 'pendente';
  if (status === 'novo') return 'pendente';
  if (status === 'analisado') return 'em_analise';
  if (status === 'reprovado') return 'rejeitado';
  if (['pendente', 'em_analise', 'aprovado', 'rejeitado'].includes(status)) return status as any;
  return 'pendente';
}

  useEffect(() => {
    async function carregarCandidatos() {
      try {
        const data = await api.listarCandidatosPorVaga(vagaIdNum);
        if (Array.isArray(data)) {
          setCandidatos(data.map((c: any) => ({
            ...c,
            status: normalizaStatus(c.status)
          })));
        } else if (data && Array.isArray(data.data)) {
          setCandidatos(data.data.map((c: any) => ({
            ...c,
            status: normalizaStatus(c.status)
          })));
        } else {
          setCandidatos([]);
        }
      } catch (error) {
        setErro('Erro ao carregar candidatos');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (vagaIdNum) {
      carregarCandidatos();
    }
  }, [vagaIdNum]);

  const handleStatusChange = async (candidatoId: number, novoStatus: string) => {
    console.log('[handleStatusChange] chamado para candidatoId:', candidatoId, 'novoStatus:', novoStatus);
    console.log('[handleStatusChange] endpoint POST:', `/vagas/${vagaIdNum}/candidato/${candidatoId}/status`, 'body:', { status: novoStatus });
    try {
      await api.atualizarStatusCandidato(candidatoId, vagaIdNum, novoStatus);
      setCandidatos(prev => prev.map(c => 
        c.id === candidatoId ? { ...c, status: novoStatus as any } : c
      ));
    } catch (error: any) {
      if (error?.response) {
        console.error('Erro ao atualizar status:', error.response.status, error.response.data);
        alert(`Erro ao atualizar status: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else {
        console.error('Erro ao atualizar status:', error);
        alert(`Erro ao atualizar status: ${error?.message || error}`);
      }
    }
  };

  const handleAnotacoes = async (candidatoId: number, anotacoes: string) => {
    try {
      await api.salvarAnotacoesCandidato(candidatoId, vagaIdNum, anotacoes);
      setCandidatos(prev => prev.map(c => 
        c.id === candidatoId ? { ...c, anotacoes } : c
      ));
    } catch (error) {
      console.error('Erro ao salvar anotações:', error);
    }
  };

  // Novo handler: mostra ambos (currículo preenchido e PDF) juntos
  const handleVerCurriculoCompleto = async (candidato: Candidato) => {
    try {
      // Buscar dados completos do candidato para garantir que o campo curriculo esteja atualizado
      let candidatoCompleto: Candidato = candidato;
      try {
        const detalhes = await api.getCandidato(candidato.id);
        candidatoCompleto = { ...candidato, ...detalhes };
      } catch (e) {
        // fallback para o candidato da lista
      }
      let curriculo: CurriculoBasico | null = null;
      try {
        curriculo = await api.obterCurriculoBasico(candidato.id);
      } catch (e) {
        curriculo = null;
      }
      setCurriculoBasico(curriculo);
      let pdfUrl = '';
      if (candidatoCompleto.curriculo && candidatoCompleto.curriculo.trim() !== '') {
        pdfUrl = `http://localhost:3000/${candidatoCompleto.curriculo}`;
        setCurriculoPdfUrl(pdfUrl);
      } else {
        setCurriculoPdfUrl('');
      }
      // Log para debug
      console.log('[handleVerCurriculoCompleto] candidatoCompleto.curriculo:', candidatoCompleto.curriculo);
      console.log('[handleVerCurriculoCompleto] curriculoPdfUrl:', pdfUrl);
      setSelectedCandidato(candidatoCompleto);
      setShowCurriculoModal(true);
    } catch (error) {
      console.error('Erro ao carregar currículo:', error);
    }
  };

  // status badge render moved to ResponsiveCardList via badge mapping

  const candidatosFiltrados = candidatos.filter(candidato => {
    if (filtros.escolaridade && candidato.escolaridade !== filtros.escolaridade) return false;
    if (filtros.status && candidato.status !== filtros.status) return false;
    // Adicionar filtro por tipo de deficiência quando disponível
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Link to={`/empresas/${empresaId}/vagas`} className="hover:text-blue-600">Vagas</Link>
          <span>›</span>
          <span>Candidatos</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Candidatos Inscritos</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Gerencie os candidatos desta vaga</p>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Escolaridade
            </label>
            <CustomSelect
              value={filtros.escolaridade}
              onChange={val => setFiltros(prev => ({ ...prev, escolaridade: val }))}
              options={[
                { value: '', label: 'Todas' },
                { value: 'Ensino Fundamental Completo', label: 'Ensino Fundamental Completo' },
                { value: 'Ensino Médio Completo', label: 'Ensino Médio Completo' },
                { value: 'Ensino Superior Completo', label: 'Ensino Superior Completo' },
              ]}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <CustomSelect
              value={filtros.status}
              onChange={val => setFiltros(prev => ({ ...prev, status: val }))}
              options={[
                { value: '', label: 'Todos' },
                { value: 'pendente', label: 'Pendente' },
                { value: 'em_analise', label: 'Em análise' },
                { value: 'aprovado', label: 'Aprovado' },
                { value: 'rejeitado', label: 'Rejeitado' },
              ]}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo de Deficiência
            </label>
            <CustomSelect
              value={filtros.tipoDeficiencia}
              onChange={val => setFiltros(prev => ({ ...prev, tipoDeficiencia: val }))}
              options={[
                { value: '', label: 'Todos' },
                { value: 'motora', label: 'Deficiência Motora' },
                { value: 'auditiva', label: 'Deficiência Auditiva' },
                { value: 'visual', label: 'Deficiência Visual' },
              ]}
              className="w-full"
            />
          </div>
        </div>
      </div>


      {erro && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700 dark:text-red-300">{erro}</p>
        </div>
      )}

      {!loading && !erro && candidatos.length === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 text-center">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">Sem candidatos</p>
        </div>
      )}

      {/* Lista de Candidatos */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Tabela (desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Candidato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Escolaridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data de Inscrição
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {candidatosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <p className="text-lg font-medium">Nenhum candidato encontrado</p>
                      <p className="mt-1">Não há candidatos inscritos nesta vaga</p>
                    </div>
                  </td>
                </tr>
              ) : (
                candidatosFiltrados.map((candidato) => (
                  <tr key={candidato.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {candidato.nome}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {candidato.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 relative">
                      <div className="flex flex-col items-center relative">
                        <div className="relative">
                          <button
                            type="button"
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${STATUS_OPTIONS.find(opt => opt.value === (candidato.status || 'pendente'))?.color || 'bg-gray-400'}`}
                            onClick={() => setStatusMenuOpen(statusMenuOpen === candidato.id ? null : candidato.id)}
                          >
                            {STATUS_OPTIONS.find(opt => opt.value === (candidato.status || 'pendente'))?.label || 'Status'}
                            <svg className="ml-2 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                          {statusMenuOpen === candidato.id && (
                            <div ref={statusMenuRef} className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 z-20 flex flex-row bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg px-2 py-1">
                              {STATUS_OPTIONS.map(opt => (
                                <button
                                  key={opt.value}
                                  className={`mx-1 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${opt.color} ${opt.value === (candidato.status || 'pendente') ? 'ring-2 ring-blue-400' : ''}`}
                                  style={{ color: 'white', minWidth: 60 }}
                                  onClick={() => {
                                    handleStatusChange(candidato.id, opt.value);
                                    setStatusMenuOpen(null);
                                  }}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {candidato.escolaridade}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(candidato.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex flex-col space-y-1">
                        <div className="space-x-2">
                          <button
                            onClick={() => handleVerPerfil(candidato)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Ver Perfil
                          </button>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleVerCurriculoCompleto(candidato)}
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          >
                            Currículo
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cards (mobile) */}
        <div className="md:hidden">
          <ResponsiveCardList
            emptyMessage="Nenhum candidato encontrado"
            items={candidatosFiltrados.map((candidato) => ({
              id: candidato.id,
              title: candidato.nome,
              subtitle: candidato.email,
              badge: {
                text: STATUS_OPTIONS.find(opt => opt.value === candidato.status)?.label || 'Em análise',
                color: (() => {
                  const cor = STATUS_OPTIONS.find(opt => opt.value === candidato.status)?.color;
                  if (!cor) return 'gray';
                  if (cor.includes('blue')) return 'blue';
                  if (cor.includes('green')) return 'green';
                  if (cor.includes('yellow')) return 'yellow';
                  if (cor.includes('red')) return 'red';
                  if (cor.includes('purple')) return 'purple';
                  return 'gray';
                })(),
                onClick: () => setStatusMenuOpen(statusMenuOpen === candidato.id ? null : candidato.id)
              } as any,
              description: statusMenuOpen === candidato.id
                ? (
                  <div ref={statusMenuRef} className="flex flex-row justify-center mt-2 mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg px-2 py-1 z-20">
                    {STATUS_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        className={`mx-1 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${opt.color} ${opt.value === candidato.status ? 'ring-2 ring-blue-400' : ''}`}
                        style={{ color: 'white', minWidth: 60 }}
                        onClick={() => {
                          console.log('[StatusMenu] clique em status', opt.value, 'para candidato', candidato.id);
                          handleStatusChange(candidato.id, opt.value);
                          setStatusMenuOpen(null);
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )
                : null,
              meta: [
                { label: 'Escolaridade', value: candidato.escolaridade },
                { label: 'Inscrição', value: new Date(candidato.createdAt).toLocaleDateString() },
              ],
              actions: [
                { label: 'Ver Perfil', onClick: () => handleVerPerfil(candidato), variant: 'blue' },
                { label: 'Currículo', onClick: () => handleVerCurriculoCompleto(candidato), variant: 'purple', full: true },
              ],
            }))}
          />
        </div>
      </div>

      {/* Modal de Perfil do Candidato */}
      {showModal && selectedCandidato && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Perfil do Candidato
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loadingDetalhes ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-300">Carregando detalhes...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome e Email sempre exibidos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedCandidato.nome}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedCandidato.email}</p>
                </div>
                {/* Telefone */}
                {selectedCandidato.telefone && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedCandidato.telefone}</p>
                    </div>
                  </>
                )}
                {/* CPF */}
                {selectedCandidato.cpf && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CPF</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedCandidato.cpf}</p>
                  </div>
                )}
                {/* Endereço */}
                {(selectedCandidato.rua || selectedCandidato.numero || selectedCandidato.bairro || selectedCandidato.cidade || selectedCandidato.estado || selectedCandidato.cep) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Endereço</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {[selectedCandidato.rua, selectedCandidato.numero].filter(Boolean).join(' ')}{(selectedCandidato.rua || selectedCandidato.numero) && (selectedCandidato.bairro ? ', ' : '')}{selectedCandidato.bairro}<br />
                      {[selectedCandidato.cidade, selectedCandidato.estado].filter(Boolean).join(' - ')} {selectedCandidato.cep}
                    </p>
                  </div>
                )}
                {/* Escolaridade */}
                {selectedCandidato.escolaridade && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Escolaridade</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedCandidato.escolaridade}</p>
                  </div>
                )}
                {/* Curso */}
                {selectedCandidato.curso && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Curso</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedCandidato.curso}</p>
                  </div>
                )}
                {/* Sobre */}
                {selectedCandidato.sobre && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sobre</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedCandidato.sobre}</p>
                  </div>
                )}
                {/* Aceita Mudança */}
                {selectedCandidato.aceitaMudanca !== undefined && selectedCandidato.aceitaMudanca !== null && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aceita Mudança?</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedCandidato.aceitaMudanca === true ? 'Sim' : 'Não'}</p>
                  </div>
                )}
                {/* Aceita Viajar */}
                {selectedCandidato.aceitaViajar !== undefined && selectedCandidato.aceitaViajar !== null && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aceita Viajar?</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedCandidato.aceitaViajar === true ? 'Sim' : 'Não'}</p>
                  </div>
                )}
                {/* Pretensão Salarial */}
                {selectedCandidato.pretensaoSalarialMin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pretensão Salarial</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedCandidato.pretensaoSalarialMin}</p>
                  </div>
                )}
                {/* Áreas de Formação */}
                {selectedCandidato.areasFormacao && selectedCandidato.areasFormacao.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Áreas de Formação</label>
                    <ul className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {selectedCandidato.areasFormacao.map((a: any, i: number) => (
                        <li key={i}>{a.nome}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Subtipos de Deficiência */}
                {selectedCandidato.subtipos && selectedCandidato.subtipos.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subtipos de Deficiência</label>
                    <ul className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {selectedCandidato.subtipos.map((s: any, i: number) => (
                        <li key={i}>{s.subtipo?.nome || s.nome}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Barreiras */}
                {selectedCandidato.barras && selectedCandidato.barras.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Barreiras</label>
                    <ul className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {selectedCandidato.barras.map((b: any, i: number) => (
                        <li key={i}>{b.barreira?.descricao || b.descricao}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Experiências Profissionais */}
                {selectedCandidato.experiencias && selectedCandidato.experiencias.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experiências Profissionais</label>
                    <ul className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {selectedCandidato.experiencias.map((exp: any, i: number) => (
                        <li key={i} className="mb-2">
                          <strong>{exp.cargo}</strong> em {exp.empresa} ({exp.dataInicio} - {exp.dataTermino || 'Atual'})<br />
                          {exp.descricao}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Formações */}
                {selectedCandidato.formacoes && selectedCandidato.formacoes.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Formações</label>
                    <ul className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {selectedCandidato.formacoes.map((f: any, i: number) => (
                        <li key={i} className="mb-2">
                          <strong>{f.curso}</strong> - {f.instituicao} ({f.escolaridade}, {f.situacao})<br />
                          {f.inicio} - {f.termino || 'Atual'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Cursos */}
                {selectedCandidato.cursos && selectedCandidato.cursos.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cursos</label>
                    <ul className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {selectedCandidato.cursos.map((c: any, i: number) => (
                        <li key={i} className="mb-2">
                          <strong>{c.nome}</strong> - {c.instituicao} ({c.cargaHoraria || '?'}h)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Competências */}
                {selectedCandidato.competencias && selectedCandidato.competencias.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Competências</label>
                    <ul className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {selectedCandidato.competencias.map((comp: any, i: number) => (
                        <li key={i} className="mb-2">
                          <strong>{comp.nome}</strong> - {comp.tipo} ({comp.nivel})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Campo Idiomas removido conforme solicitado */}
                {/* Campos Currículo e Laudo removidos conforme solicitado */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Anotações Internas</label>
                  <textarea
                    rows={3}
                    value={selectedCandidato.anotacoes || ''}
                    onChange={(e) => {
                      const novasAnotacoes = e.target.value;
                      setSelectedCandidato(prev => prev ? { ...prev, anotacoes: novasAnotacoes } : null);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Adicione suas anotações sobre este candidato..."
                  />
                  <div className="flex items-center mt-2 gap-2">
                    <button
                      onClick={() => {
                        if (selectedCandidato) handleAnotacoes(selectedCandidato.id, selectedCandidato.anotacoes || '');
                      }}
                      className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium shadow"
                    >
                      Salvar Anotações
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400">(Obs: Anotações são privadas, apenas sua empresa pode visualizar)</span>
                  </div>
                </div>
              </div>
            </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Currículo Completo (PDF + preenchido) com abas */}
      {showCurriculoModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Currículo - {selectedCandidato?.nome}
              </h3>
              <button
                onClick={() => setShowCurriculoModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Abas */}
            {(curriculoPdfUrl || curriculoBasico) ? (
              <ModalTabs
                curriculoPdfUrl={curriculoPdfUrl}
                curriculoBasico={curriculoBasico}
                candidatoNome={selectedCandidato?.nome}
              />
            ) : (
              <div className="text-gray-500 dark:text-gray-400">Nenhum currículo disponível para este candidato.</div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowCurriculoModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}