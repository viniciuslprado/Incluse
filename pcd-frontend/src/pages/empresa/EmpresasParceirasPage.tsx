import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import { api } from '../../lib/api';

interface Empresa {
  id: number;
  nome: string;
  cnpj?: string;
  email?: string;
  createdAt?: string;
  vagasAtivas?: number;
}

export default function EmpresasParceirasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [busca, setBusca] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [, setErro] = useState<string | null>(null);

  // Carregar empresas reais do banco de dados
  useEffect(() => {
    async function carregarEmpresas() {
      try {
        const empresasData = await api.listarEmpresas();
        const vagasPublicas = await api.listarVagasPublicas();

        // Buscar quantidade de vagas ativas para cada empresa usando apenas vagas públicas
        const empresasComVagas = empresasData.map((empresa: Empresa) => {
          const vagasAtivas = Array.isArray(vagasPublicas)
            ? vagasPublicas.filter((v: any) => v.status === 'ativa' && v.empresaId === empresa.id).length
            : 0;
          return { ...empresa, vagasAtivas };
        });

        setEmpresas(empresasComVagas);
      } catch (err) {
        console.error('Erro ao carregar empresas:', err);
        setErro('Erro ao carregar empresas');
      } finally {
        setLoading(false);
      }
    }

    carregarEmpresas();
  }, []);

  const empresasFiltradas = empresas.filter(empresa => {
    const matchBusca = busca === '' || 
      empresa.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (empresa.email && empresa.email.toLowerCase().includes(busca.toLowerCase()));
    
    return matchBusca;
  });

  const totalVagasAtivas = empresasFiltradas.reduce((total, emp) => total + (emp.vagasAtivas || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando empresas parceiras...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Empresas Parceiras
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            Conheça as empresas comprometidas com a inclusão que confiam no Incluse para 
            encontrar talentos únicos e construir ambientes de trabalho verdadeiramente diversos.
          </p>
        
        {/* Estatísticas */}
        <div className="flex flex-wrap justify-center gap-8 mt-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {empresasFiltradas.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Empresas Parceiras</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {totalVagasAtivas}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Vagas Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                100%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Inclusão</div>
            </div>
          </div>
        </div>

        {/* Filtro de Busca */}
        <div className="bg-white dark:bg-transparent rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="max-w-md mx-auto">
            <label htmlFor="busca" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar empresa
            </label>
            <input
              type="text"
              id="busca"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome ou e-mail..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Lista de Empresas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {empresasFiltradas.map((empresa) => (
            <div
              key={empresa.id}
              className="bg-white dark:bg-transparent rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header da Empresa */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {empresa.nome}
                    </h3>
                    {empresa.email && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {empresa.email}
                      </p>
                    )}
                  </div>
                  
                  {empresa.vagasAtivas && empresa.vagasAtivas > 0 && (
                    <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                      {empresa.vagasAtivas} {empresa.vagasAtivas === 1 ? 'vaga ativa' : 'vagas ativas'}
                    </div>
                  )}
                </div>

                {/* Ações */}
                <Link
                  to="/vagas"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Ver Vagas
                </Link>
              </div>
            </div>
          ))}
        </div>

        {empresasFiltradas.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">🏢</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Nenhuma empresa encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tente ajustar a busca para encontrar empresas parceiras.
            </p>
            <button
              onClick={() => setBusca('')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Limpar busca
            </button>
          </div>
        )}

        {/* Call to Action padrão (mesmo estilo do FAQ) */}
        <div className="bg-gradient-to-br from-incluse-primary/10 via-incluse-accent/10 to-incluse-secondary/10 border border-incluse-accent/30 rounded-lg p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-incluse-primary to-incluse-secondary bg-clip-text text-transparent mb-4">
            Sua empresa quer fazer parte?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Junte-se às empresas que estão construindo um futuro mais inclusivo. Cadastre sua empresa e tenha acesso aos melhores talentos PCD do Brasil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cadastro/empresa"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-incluse-primary to-incluse-accent hover:from-incluse-primary-dark hover:to-incluse-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-incluse-primary transition-all duration-300 transform hover:scale-105"
            >
              Cadastrar Empresa
            </Link>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openFaq'))}
              className="inline-flex items-center px-6 py-3 border border-incluse-secondary text-base font-medium rounded-md text-incluse-secondary bg-white hover:bg-incluse-secondary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-incluse-secondary transition-all duration-300 transform hover:scale-105"
            >
              Saiba Mais
            </button>
          </div>
        </div>

        {/* Footer da página */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar à página inicial
            </Link>
            <Link 
              to="/vagas" 
              className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Ver Todas as Vagas
            </Link>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openFaq'))} 
              className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Perguntas Frequentes
            </button>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}