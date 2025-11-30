import { useState, useEffect } from 'react';
import CustomSelect from '../../components/common/CustomSelect';
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
  status?: 'novo' | 'analisado' | 'aprovado' | 'reprovado';
  subtipos?: any[];
  anotacoes?: string;
  createdAt: string;
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
  const [showModal, setShowModal] = useState(false);
  const [curriculoBasico, setCurriculoBasico] = useState<CurriculoBasico | null>(null);
  const [showCurriculoModal, setShowCurriculoModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    async function carregarCandidatos() {
      try {
        const data = await api.listarCandidatosPorVaga(vagaIdNum);
        if (Array.isArray(data)) {
          setCandidatos(data.map((c: any) => ({ ...c, status: c.status || 'novo' })));
        } else if (data && Array.isArray(data.data)) {
          setCandidatos(data.data.map((c: any) => ({ ...c, status: c.status || 'novo' })));
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
    try {
      await api.atualizarStatusCandidato(candidatoId, vagaIdNum, novoStatus);
      setCandidatos(prev => prev.map(c => 
        c.id === candidatoId ? { ...c, status: novoStatus as any } : c
      ));
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
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

  const handleVerCurriculoBasico = async (candidatoId: number) => {
    try {
      const curriculo = await api.obterCurriculoBasico(candidatoId);
      setCurriculoBasico(curriculo);
      setShowCurriculoModal(true);
    } catch (error) {
      console.error('Erro ao carregar currículo:', error);
    }
  };

  const handleVerPdf = (pdfPath: string) => {
    setPdfUrl(`http://localhost:3000/${pdfPath}`);
    setShowPdfModal(true);
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
          <Link to={`/empresa/${empresaId}/vagas`} className="hover:text-blue-600">Vagas</Link>
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
                { value: 'novo', label: 'Novo' },
                { value: 'analisado', label: 'Analisado' },
                { value: 'aprovado', label: 'Aprovado' },
                { value: 'reprovado', label: 'Reprovado' },
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
                    <td className="px-6 py-4">
                      <CustomSelect
                        value={candidato.status || 'novo'}
                        onChange={val => handleStatusChange(candidato.id, val)}
                        options={[
                          { value: 'novo', label: 'Novo' },
                          { value: 'analisado', label: 'Analisado' },
                          { value: 'aprovado', label: 'Aprovado' },
                          { value: 'reprovado', label: 'Reprovado' },
                        ]}
                        className="w-full"
                      />
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
                            onClick={() => {
                              setSelectedCandidato(candidato);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Ver Perfil
                          </button>
                          <Link
                            to={`/empresa/${empresaId}/visualizar-candidato/${candidato.id}`}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            Detalhes
                          </Link>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleVerCurriculoBasico(candidato.id)}
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          >
                            Currículo
                          </button>
                          {candidato.curriculo && (
                            <button
                              onClick={() => handleVerPdf(candidato.curriculo!)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            >
                              PDF Currículo
                            </button>
                          )}
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
              badge: { text: (candidato.status || 'novo').replace(/^./, s => s.toUpperCase()), color: (candidato.status === 'aprovado' ? 'green' : candidato.status === 'reprovado' ? 'red' : candidato.status === 'analisado' ? 'yellow' : 'blue') as any },
              description: (
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Status</label>
                  <CustomSelect
                    value={candidato.status || 'novo'}
                    onChange={val => handleStatusChange(candidato.id, val)}
                    options={[
                      { value: 'novo', label: 'Novo' },
                      { value: 'analisado', label: 'Analisado' },
                      { value: 'aprovado', label: 'Aprovado' },
                      { value: 'reprovado', label: 'Reprovado' },
                    ]}
                    className="w-full"
                  />
                </div>
              ),
              meta: [
                { label: 'Escolaridade', value: candidato.escolaridade },
                { label: 'Inscrição', value: new Date(candidato.createdAt).toLocaleDateString() },
              ],
              actions: [
                { label: 'Ver Perfil', onClick: () => { setSelectedCandidato(candidato); setShowModal(true); }, variant: 'blue' },
                { label: 'Detalhes', to: `/empresa/${empresaId}/visualizar-candidato/${candidato.id}`, variant: 'indigo' },
                { label: 'Currículo', onClick: () => handleVerCurriculoBasico(candidato.id), variant: 'purple', full: true },
                ...(candidato.curriculo ? [{ label: 'PDF Currículo', onClick: () => handleVerPdf(candidato.curriculo!), variant: 'green', full: true }] as any : []),
              ],
            }))}
          />
        </div>
      </div>

      {/* Modal de Perfil do Candidato */}
      {showModal && selectedCandidato && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
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

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedCandidato.nome}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedCandidato.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedCandidato.telefone || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Escolaridade</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedCandidato.escolaridade}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Anotações Internas</label>
                <textarea
                  rows={3}
                  value={selectedCandidato.anotacoes || ''}
                  onChange={(e) => {
                    const novasAnotacoes = e.target.value;
                    setSelectedCandidato(prev => prev ? { ...prev, anotacoes: novasAnotacoes } : null);
                  }}
                  onBlur={(e) => handleAnotacoes(selectedCandidato.id, e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Adicione suas anotações sobre este candidato..."
                />
              </div>
            </div>

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

      {/* Modal de Currículo */}
      {showCurriculoModal && curriculoBasico && (
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

            <CurriculoViewer curriculo={curriculoBasico} candidatoNome={selectedCandidato?.nome} />

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

      {/* Modal de PDF */}
      {showPdfModal && pdfUrl && (
        <PdfViewer 
          pdfUrl={pdfUrl} 
          candidatoNome={selectedCandidato?.nome} 
          onClose={() => setShowPdfModal(false)} 
        />
      )}
    </div>
  );
}