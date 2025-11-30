import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import type { CurriculoBasico } from '../../types';
import CurriculoViewer from '../../components/curriculo/CurriculoViewer';
import PdfViewer from '../../components/curriculo/PdfViewer';

interface CandidatoDetalhes {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  escolaridade: string;
  curriculo?: string;
  cidade?: string;
  estado?: string;
  cpf?: string;
}

export default function VisualizarCandidatoPage() {
  const { candidatoId } = useParams<{ candidatoId: string }>();
  const [candidato, setCandidato] = useState<CandidatoDetalhes | null>(null);
  const [curriculoBasico, setCurriculoBasico] = useState<CurriculoBasico | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'perfil' | 'curriculo'>('perfil');

  useEffect(() => {
    async function carregarDados() {
      if (!candidatoId) return;
      
      try {
        const [candidatoData, curriculoData] = await Promise.all([
          api.getCandidato(Number(candidatoId)),
          api.obterCurriculoBasico(Number(candidatoId))
        ]);
        
        setCandidato(candidatoData);
        setCurriculoBasico(curriculoData);
      } catch (error) {
        console.error('Erro ao carregar dados do candidato:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [candidatoId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!candidato) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Candidato não encontrado</h1>
          <Link to="/empresas" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Voltar para o painel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Link to="/empresas" className="hover:text-blue-600">Painel</Link>
          <span>›</span>
          <span>Candidato</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{candidato.nome}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Visualização completa do perfil</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'perfil'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('curriculo')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'curriculo'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Currículo Básico
          </button>
          {candidato.curriculo && (
            <button
              onClick={() => setShowPdfModal(true)}
              className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
            >
              PDF Currículo
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {activeTab === 'perfil' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Informações Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidato.nome}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidato.email || 'Não informado'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidato.telefone || 'Não informado'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Escolaridade</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidato.escolaridade}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cidade</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidato.cidade || 'Não informado'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidato.estado || 'Não informado'}</p>
              </div>
            </div>

            {candidato.curriculo && (
              <div className="mt-8">
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">Currículo Anexado</h4>
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Visualizar PDF
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'curriculo' && curriculoBasico && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Currículo</h3>
            <CurriculoViewer curriculo={curriculoBasico} candidatoNome={candidato.nome} />
          </div>
        )}
      </div>

      {/* Modal de PDF */}
      {showPdfModal && candidato.curriculo && (
        <PdfViewer 
          pdfUrl={`http://localhost:3000/${candidato.curriculo}`}
          candidatoNome={candidato.nome}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
}