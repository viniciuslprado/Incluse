import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { useToast } from "../../components/common/Toast";
import type { Vaga, Empresa } from "../../types";
// import Loading from "../../components/Loading";
import ResponsiveCardList from "../../components/common/ResponsiveCardList";
import VagaModal from "../../components/VagaModal";
import Footer from "../../components/Footer";

type VagaPublica = Vaga & { empresa: Empresa };

function VagaCard({ vaga, onClick }: { vaga: VagaPublica; onClick?: () => void }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-incluse-primary/30">
      {/* Cabeçalho */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-incluse-text dark:text-incluse-text-dark mb-2 line-clamp-2">
          {vaga.titulo || vaga.descricao}
        </h3>
        <p className="text-incluse-primary dark:text-incluse-accent font-semibold text-lg">
          {vaga.empresa.nome}
        </p>
      </div>

      {/* Informações principais */}
      <div className="space-y-3 mb-4">
        {/* Escolaridade */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-incluse-accent/10 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-incluse-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Escolaridade</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{vaga.escolaridade}</p>
          </div>
        </div>

        {/* Localização */}
        {(vaga.cidade || vaga.estado) && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-incluse-secondary/10 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-incluse-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Localização</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {vaga.cidade && vaga.estado ? `${vaga.cidade}, ${vaga.estado}` : vaga.cidade || vaga.estado}
              </p>
            </div>
          </div>
        )}

          {/* Tags e badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-incluse-primary/20 text-incluse-primary">
              CLT
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-incluse-secondary/20 text-incluse-secondary">
              Plano de Saúde
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-incluse-success/20 text-incluse-success">
              Ambiente Inclusivo
            </span>
          </div>
        </div>

      {/* Botão de ação */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={onClick}
          className="w-full bg-gradient-to-r from-incluse-primary to-incluse-accent hover:from-incluse-primary-dark hover:to-incluse-accent-dark text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-incluse-primary focus:ring-offset-2"
        >
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Ver Detalhes da Vaga
          </div>
        </button>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="bg-gradient-to-br from-incluse-primary via-incluse-accent to-incluse-secondary text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
              Incluse
            </h1>
          </div>
          <p className="mt-6 text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Conectamos pessoas com deficiência às melhores oportunidades de trabalho 
            em empresas comprometidas com a <span className="text-green-200 font-semibold">inclusão</span> e diversidade.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/vagas"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-incluse-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white shadow-lg hover:shadow-xl transition-all duration-300 min-h-[52px] transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explorar Vagas
            </Link>
            <Link
              to="/empresa"
              className="inline-flex items-center px-8 py-4 border-2 border-white/50 text-base font-medium rounded-lg text-white hover:bg-white/10 hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white backdrop-blur-sm transition-all duration-300 min-h-[52px] transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Empresas Parceiras
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stats({ onAbrirChat, totalVagas, totalEmpresas }: { onAbrirChat: () => void; totalVagas: number; totalEmpresas: number }) {
  return (
    <div className="bg-incluse-bg-neutral dark:bg-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-incluse-text dark:text-white mb-4">
            Impacto Incluse
          </h2>
          <p className="text-incluse-text-secondary dark:text-gray-300 max-w-2xl mx-auto">
            Números que demonstram nosso compromisso com a inclusão no mercado de trabalho
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/vagas" className="text-center group cursor-pointer block">
            <div className="w-20 h-20 bg-incluse-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V8m8 0V6a2 2 0 00-2-2H10a2 2 0 00-2 2v2" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-incluse-primary dark:text-incluse-accent mb-2">{totalVagas}</div>
            <div className="text-sm font-medium text-incluse-text-secondary dark:text-gray-400">Vagas Ativas</div>
          </Link>
          
          <Link to="/empresa" className="text-center group cursor-pointer block">
            <div className="w-20 h-20 bg-incluse-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-incluse-secondary dark:text-incluse-secondary-dark-mode mb-2">{totalEmpresas}</div>
            <div className="text-sm font-medium text-incluse-text-secondary dark:text-gray-400">Empresas Parceiras</div>
          </Link>
          
          <div className="text-center group">
            <div className="w-20 h-20 bg-incluse-success rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-incluse-success dark:text-green-400 mb-2">100%</div>
            <div className="text-sm font-medium text-incluse-text-secondary dark:text-gray-400">Inclusão</div>
          </div>
          
          <div 
            onClick={onAbrirChat} 
            className="text-center group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-4 transition-all duration-300"
          >
            <div className="w-20 h-20 bg-incluse-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-incluse-accent dark:text-blue-400 mb-2">24/7</div>
            <div className="text-sm font-medium text-incluse-text-secondary dark:text-gray-400">Suporte Disponível</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [vagas, setVagas] = useState<VagaPublica[]>([]);
  const [totalVagas, setTotalVagas] = useState(0);
  const [totalEmpresas, setTotalEmpresas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalVagaId, setModalVagaId] = useState<number | null>(null);

  const { addToast } = useToast();
  const abrirChat = () => {
    addToast({ type: 'info', message: 'Chat de suporte será implementado em breve! Em breve você poderá: • Falar com nossa equipe • Tirar dúvidas • Receber ajuda' });
  };

  useEffect(() => {
    async function carregarDados() {
      try {
        // Carregar empresas
        const empresasData = await api.listarEmpresas();
        setTotalEmpresas(empresasData.length);

        // Carregar vagas de todas as empresas
        const todasVagas: VagaPublica[] = [];
        for (const empresa of empresasData) {
          try {
            const vagasEmpresa = await api.listarVagasPublicas();
            const vagasAtivas = vagasEmpresa.filter((v: any) => v.status === 'ativa');
            const vagasComEmpresa = vagasAtivas.map((vaga: any) => ({
              ...vaga,
              empresa: empresa
            }));
            todasVagas.push(...vagasComEmpresa);
          } catch (error) {
            console.warn(`Erro ao carregar vagas da empresa ${empresa.nome}:`, error);
          }
        }

        setVagas(todasVagas);
        setTotalVagas(todasVagas.length);
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <main id="main-content" role="main">
        <Hero />

      {/* Stats Section */}
      <Stats onAbrirChat={abrirChat} totalVagas={totalVagas} totalEmpresas={totalEmpresas} />

      {/* Como Funciona */}
      <ComoFunciona />

      {/* Vagas em Destaque */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Vagas em Destaque
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Oportunidades selecionadas especialmente para você
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Carregando vagas...</div>
        ) : erro ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Erro ao carregar dados</h3>
                <div className="mt-1">
                  <p className="text-sm text-red-700 dark:text-red-300">{erro}</p>
                </div>
              </div>
            </div>
          </div>
        ) : vagas.length > 0 ? (
          <>
            {/* Desktop grid */}
            <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {vagas.slice(0, 6).map((vaga) => (
                <VagaCard 
                  key={`vaga-${vaga.id}-empresa-${vaga.empresa?.id ?? ''}`}
                  vaga={vaga} 
                  onClick={() => setModalVagaId(vaga.id)}
                />
              ))}
            </div>
            {/* Mobile cards */}
            <div className="md:hidden">
              <ResponsiveCardList
                items={vagas.slice(0, 6).map((vaga) => ({
                  id: `vaga-${vaga.id}-empresa-${vaga.empresa?.id ?? ''}`,
                  title: vaga.titulo || vaga.descricao,
                  subtitle: vaga.empresa?.nome,
                  meta: [
                    { label: 'Escolaridade', value: vaga.escolaridade },
                    ...(vaga.cidade || vaga.estado ? [{ label: 'Localização', value: vaga.cidade && vaga.estado ? `${vaga.cidade}, ${vaga.estado}` : (vaga.cidade || vaga.estado) }] : []),
                  ],
                  actions: [
                    { label: 'Ver detalhes', onClick: () => setModalVagaId(vaga.id), variant: 'blue', full: true },
                  ],
                }))}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma vaga disponível no momento.
            </p>
          </div>
        )}

        {vagas.length > 6 && (
          <div className="text-center mt-8">
            <Link
              to="/vagas"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ver Todas as Vagas
              <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Modal de detalhes da vaga */}
      {modalVagaId && (
        <VagaModal
          vagaId={modalVagaId}
          isOpen={!!modalVagaId}
          onClose={() => setModalVagaId(null)}
        />
      )}

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function ComoFunciona() {
  const steps = [
    { title: '1. Crie uma conta', desc: 'Crie sua conta grátis' },
    { title: '2. Cadastre seu currículo', desc: 'Adicione informações pessoais e profissionais' },
    { title: '3. Busque vagas', desc: 'Encontre vagas compatíveis com seu perfil' },
    { title: '4. Envie seu currículo', desc: 'Candidate-se online e acompanhe o status' },
  ];

  return (
    <section className="bg-white dark:bg-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Como funciona?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Para enviar seu currículo para as vagas é muito simples. Siga estes passos:</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.title} className="p-6 bg-incluse-bg-neutral dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center gap-6">
          <Link to="/cadastro/candidato" className="px-8 py-3 bg-incluse-primary text-white rounded-full">Cadastrar meu currículo</Link>
          <Link to="/cadastro/empresa" className="px-8 py-3 border-2 border-incluse-primary rounded-full">Anunciar vaga gratuitamente</Link>
        </div>
      </div>
    </section>
  );
}