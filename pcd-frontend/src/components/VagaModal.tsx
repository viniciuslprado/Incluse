import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Vaga, Empresa } from '../types';

interface VagaModalProps {
  vagaId: number;
  isOpen: boolean;
  onClose: () => void;
}

interface VagaDetalhada extends Vaga {
  empresa: Empresa;
}

export default function VagaModal({ vagaId, isOpen, onClose }: VagaModalProps) {
  const [vaga, setVaga] = useState<VagaDetalhada | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !vagaId) return;

    async function carregarVaga() {
      setLoading(true);
      try {
        const vagaData = await api.obterVaga(vagaId);
        setVaga(vagaData as VagaDetalhada);
      } catch (error) {
        console.error('Erro ao carregar vaga:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarVaga();
  }, [vagaId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {vaga ? (vaga.titulo || vaga.descricao) : 'Detalhes da Vaga'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Carregando...</span>
            </div>
          ) : vaga ? (
            <div className="space-y-6">
              {/* Título e Empresa */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {vaga.titulo || vaga.descricao}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium text-lg">
                  {vaga.empresa.nome}
                </p>
              </div>

              {/* Informações básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Escolaridade</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{vaga.escolaridade}</p>
                </div>

                {(vaga.cidade || vaga.estado) && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Localização</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {vaga.cidade && vaga.estado ? `${vaga.cidade}, ${vaga.estado}` : vaga.cidade || vaga.estado}
                    </p>
                  </div>
                )}
              </div>

              {/* Descrição detalhada */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descrição Completa
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {vaga.descricao}
                  </p>
                </div>
              </div>

              {/* Informações da empresa */}
              {vaga.empresa.email && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H9m10 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v10M9 21h2m0 0h2" />
                    </svg>
                    Informações da Empresa
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Contato:</span> {vaga.empresa.email}
                    </p>
                    {vaga.empresa.cnpj && (
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        <span className="font-medium">CNPJ:</span> {vaga.empresa.cnpj}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Botão de candidatura */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-white bg-gray-100 dark:bg-green-600 rounded-lg hover:bg-gray-200 dark:hover:bg-green-700 transition-colors"
                >
                  Fechar
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-green-600 dark:hover:bg-green-700 transition-colors">
                  Candidatar-se para {vaga.titulo || vaga.descricao}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Erro ao carregar detalhes da vaga.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}