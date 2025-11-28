import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';

interface CandidatoCompleto {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  escolaridade: string;
  curriculo?: string;
  laudo?: string;
  subtipos: Array<{
    id: number;
    nome: string;
    tipo: { nome: string };
  }>;
  barreiras: Array<{
    id: number;
    descricao: string;
  }>;
  createdAt: string;
}

export default function PerfilCandidatoPage() {
  const { id, candidatoId } = useParams<{ id: string; candidatoId: string }>();
  const empresaId = Number(id);
  const candidatoIdNum = Number(candidatoId);
  
  const [candidato, setCandidato] = useState<CandidatoCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarCandidato() {
      try {
        const data = await api.getCandidato(candidatoIdNum);
        setCandidato(data as unknown as CandidatoCompleto);
      } catch (error) {
        setErro('Erro ao carregar dados do candidato');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (candidatoIdNum) {
      carregarCandidato();
    }
  }, [candidatoIdNum]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (erro || !candidato) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-700 dark:text-red-300">{erro || 'Candidato não encontrado'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Link to={`/empresa/${empresaId}/vagas`} className="hover:text-blue-600">Vagas</Link>
          <span>›</span>
          <Link to={`/empresa/${empresaId}/candidatos`} className="hover:text-blue-600">Candidatos</Link>
          <span>›</span>
          <span>{candidato.nome}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Perfil do Candidato</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dados Pessoais */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Dados Pessoais
            </h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nome Completo</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidato.nome}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidato.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Telefone</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidato.telefone || 'Não informado'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Escolaridade</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidato.escolaridade}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Cadastro</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {new Date(candidato.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Informações de Acessibilidade */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Informações de Acessibilidade
            </h3>
            
            {/* Tipos de Deficiência */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Tipos de Deficiência
              </h4>
              {candidato.subtipos && candidato.subtipos.length > 0 ? (
                <div className="space-y-2">
                  {candidato.subtipos.map((subtipo) => (
                    <div key={subtipo.id} className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {subtipo.tipo.nome}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {subtipo.nome}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Não informado</p>
              )}
            </div>

            {/* Barreiras */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Barreiras Enfrentadas
              </h4>
              {candidato.barreiras && candidato.barreiras.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {candidato.barreiras.map((barreira) => (
                    <div key={barreira.id} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {barreira.descricao}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Não informado</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Documentos e Ações */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Documentos
            </h3>
            <div className="space-y-3">
              {candidato.curriculo ? (
                <a
                  href={candidato.curriculo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Currículo
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Clique para baixar
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </a>
              ) : (
                <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Currículo não disponível
                  </p>
                </div>
              )}

              {candidato.laudo ? (
                <a
                  href={candidato.laudo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Laudo Médico
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Documento confidencial
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </a>
              ) : (
                <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Laudo médico não disponível
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Compatibilidade */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Compatibilidade
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Match com a vaga</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-green-600">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Acessibilidade</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">92%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}