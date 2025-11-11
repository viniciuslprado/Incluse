import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Empresa {
  id: number;
  nome: string;
  logo?: string;
  cnpj: string;
  telefone: string;
  email: string;
  ramo: string;
  localizacao: string;
  vagasAtivas: number;
  descricao: string;
  beneficios: string[];
  acessibilidade: string[];
}

export default function EmpresasParceirasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [filtroRamo, setFiltroRamo] = useState<string>('todos');
  const [filtroLocalizacao, setFiltroLocalizacao] = useState<string>('todas');
  const [busca, setBusca] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Dados de exemplo das empresas parceiras
  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setEmpresas([
        {
          id: 1,
          nome: 'TechCorp Inclusiva',
          cnpj: '12.345.678/0001-90',
          telefone: '(11) 3333-4444',
          email: 'rh@techcorp.com.br',
          ramo: 'Tecnologia',
          localizacao: 'São Paulo - SP',
          vagasAtivas: 8,
          descricao: 'Empresa de tecnologia focada em soluções inclusivas e acessíveis para todos.',
          beneficios: ['Vale alimentação', 'Plano de saúde', 'Flexibilidade de horários', 'Home office'],
          acessibilidade: ['Prédio adaptado', 'Software leitor de tela', 'Intérprete de Libras', 'Mobiliário adaptado']
        },
        {
          id: 2,
          nome: 'Banco Digital Acessível',
          cnpj: '23.456.789/0001-01',
          telefone: '(11) 4444-5555',
          email: 'inclusao@bancodigital.com.br',
          ramo: 'Financeiro',
          localizacao: 'São Paulo - SP',
          vagasAtivas: 12,
          descricao: 'Instituição financeira comprometida com a diversidade e inclusão no ambiente corporativo.',
          beneficios: ['Vale refeição', 'Participação nos lucros', 'Seguro de vida', 'Auxílio educação'],
          acessibilidade: ['Elevador acessível', 'Banheiros adaptados', 'Sinalização em Braille', 'Transporte adaptado']
        },
        {
          id: 3,
          nome: 'EcoLogística Sustentável',
          cnpj: '34.567.890/0001-12',
          telefone: '(21) 5555-6666',
          email: 'pessoas@ecologistica.com.br',
          ramo: 'Logística',
          localizacao: 'Rio de Janeiro - RJ',
          vagasAtivas: 6,
          descricao: 'Empresa de logística que valoriza a sustentabilidade e a inclusão social.',
          beneficios: ['Cesta básica', 'Plano odontológico', 'Vale transporte', 'Ginástica laboral'],
          acessibilidade: ['Rampa de acesso', 'Vagas preferenciais', 'Equipamentos ergonômicos', 'Apoio psicológico']
        },
        {
          id: 4,
          nome: 'HealthCare Plus',
          cnpj: '45.678.901/0001-23',
          telefone: '(31) 6666-7777',
          email: 'rh@healthcareplus.com.br',
          ramo: 'Saúde',
          localizacao: 'Belo Horizonte - MG',
          vagasAtivas: 15,
          descricao: 'Rede de clínicas médicas que promove cuidados inclusivos e acessíveis.',
          beneficios: ['Plano de saúde premium', 'Desconto em medicamentos', 'Auxílio creche', 'Capacitação contínua'],
          acessibilidade: ['Consultórios adaptados', 'Comunicação em Libras', 'Material em Braille', 'Cadeira de rodas disponível']
        },
        {
          id: 5,
          nome: 'Manufatura Inteligente',
          cnpj: '56.789.012/0001-34',
          telefone: '(47) 7777-8888',
          email: 'inclusao@manufatura.com.br',
          ramo: 'Industrial',
          localizacao: 'Joinville - SC',
          vagasAtivas: 10,
          descricao: 'Indústria moderna com foco em automação e inclusão de pessoas com deficiência.',
          beneficios: ['Participação nos resultados', 'Refeitório no local', 'Transporte fretado', 'Uniformes gratuitos'],
          acessibilidade: ['Linha de produção adaptada', 'EPIs especiais', 'Sinalizações visuais', 'Treinamento especializado']
        },
        {
          id: 6,
          nome: 'EduTech Inovação',
          cnpj: '67.890.123/0001-45',
          telefone: '(85) 8888-9999',
          email: 'contato@edutech.com.br',
          ramo: 'Educação',
          localizacao: 'Fortaleza - CE',
          vagasAtivas: 7,
          descricao: 'Empresa de tecnologia educacional que desenvolve soluções inclusivas para aprendizagem.',
          beneficios: ['Bolsas de estudo', 'Plano de carreira', 'Trabalho remoto', 'Cursos gratuitos'],
          acessibilidade: ['Plataforma acessível', 'Conteúdo em múltiplos formatos', 'Suporte especializado', 'Tutores inclusivos']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const ramos = ['todos', ...Array.from(new Set(empresas.map(emp => emp.ramo)))];
  const localizacoes = ['todas', ...Array.from(new Set(empresas.map(emp => emp.localizacao)))];

  const empresasFiltradas = empresas.filter(empresa => {
    const matchRamo = filtroRamo === 'todos' || empresa.ramo === filtroRamo;
    const matchLocalizacao = filtroLocalizacao === 'todas' || empresa.localizacao === filtroLocalizacao;
    const matchBusca = busca === '' || 
      empresa.nome.toLowerCase().includes(busca.toLowerCase()) ||
      empresa.ramo.toLowerCase().includes(busca.toLowerCase()) ||
      empresa.localizacao.toLowerCase().includes(busca.toLowerCase());
    
    return matchRamo && matchLocalizacao && matchBusca;
  });

  const totalVagasAtivas = empresasFiltradas.reduce((total, emp) => total + emp.vagasAtivas, 0);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="flex flex-wrap justify-center gap-8 mt-8">
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
                {ramos.length - 1}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Setores</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
  <div className="bg-white dark:bg-transparent rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div>
              <label htmlFor="busca" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar empresa
              </label>
              <input
                type="text"
                id="busca"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Nome, setor ou localização..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Filtro por Ramo */}
            <div>
              <label htmlFor="ramo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Setor
              </label>
              <select
                id="ramo"
                value={filtroRamo}
                onChange={(e) => setFiltroRamo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                {ramos.map((ramo) => (
                  <option key={ramo} value={ramo}>
                    {ramo === 'todos' ? 'Todos os setores' : ramo}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Localização */}
            <div>
              <label htmlFor="localizacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Localização
              </label>
              <select
                id="localizacao"
                value={filtroLocalizacao}
                onChange={(e) => setFiltroLocalizacao(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                {localizacoes.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === 'todas' ? 'Todas as localidades' : loc}
                  </option>
                ))}
              </select>
            </div>
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
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {empresa.nome}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span className="mr-3">{empresa.ramo}</span>
                          <span>{empresa.localizacao}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {empresa.vagasAtivas > 0 && (
                    <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                      {empresa.vagasAtivas} vagas ativas
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                  {empresa.descricao}
                </p>
              </div>

              {/* Benefícios */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Benefícios Oferecidos
                </h4>
                <div className="flex flex-wrap gap-2">
                  {empresa.beneficios.slice(0, 3).map((beneficio, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                    >
                      {beneficio}
                    </span>
                  ))}
                  {empresa.beneficios.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                      +{empresa.beneficios.length - 3} mais
                    </span>
                  )}
                </div>
              </div>

              {/* Acessibilidade */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Recursos de Acessibilidade
                </h4>
                <div className="flex flex-wrap gap-2">
                  {empresa.acessibilidade.slice(0, 2).map((recurso, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400"
                    >
                      {recurso}
                    </span>
                  ))}
                  {empresa.acessibilidade.length > 2 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                      +{empresa.acessibilidade.length - 2} recursos
                    </span>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/vagas"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver Vagas
                  </Link>
                  <a
                    href={`mailto:${empresa.email}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Contatar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {empresasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">🏢</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Nenhuma empresa encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tente ajustar os filtros para encontrar empresas parceiras.
            </p>
            <button
              onClick={() => {
                setFiltroRamo('todos');
                setFiltroLocalizacao('todas');
                setBusca('');
              }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* Call to Action para empresas */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Sua empresa quer fazer parte?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Junte-se às empresas que estão construindo um futuro mais inclusivo. 
            Cadastre sua empresa e tenha acesso aos melhores talentos PCD do Brasil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cadastro/empresa"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cadastrar Empresa
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Saiba Mais
            </Link>
          </div>
        </div>

        {/* Footer da página */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link 
              to="/" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              ← Voltar à página inicial
            </Link>
            <Link 
              to="/vagas" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Ver Todas as Vagas
            </Link>
            <Link 
              to="/faq" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Perguntas Frequentes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}