import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface FAQItem {
  id: number;
  pergunta: string;
  resposta: string;
  categoria: 'candidato' | 'empresa' | 'geral';
}

export default function FAQPage() {
  const [filtroCategoria, setFiltroCategoria] = useState<'todos' | 'candidato' | 'empresa' | 'geral'>('todos');
  const [expandido, setExpandido] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    // FAQ Geral
    {
      id: 1,
      categoria: 'geral',
      pergunta: 'O que é o Incluse?',
      resposta: 'O Incluse é uma plataforma inclusiva que conecta pessoas com deficiência (PCD) às melhores oportunidades de trabalho em empresas comprometidas com a diversidade e inclusão.'
    },
    {
      id: 2,
      categoria: 'geral',
      pergunta: 'Como o Incluse garante a acessibilidade?',
      resposta: 'Nossa plataforma possui menu de acessibilidade com controle de fonte, tamanho, temas e outros recursos. Todas as vagas são de empresas que se comprometem com ambientes inclusivos.'
    },
    
    // FAQ Candidatos
    {
      id: 3,
      categoria: 'candidato',
      pergunta: 'Como me cadastro como candidato?',
      resposta: 'Clique em "Cadastro" no menu superior, selecione "Candidato", preencha seus dados pessoais, tipo de deficiência e aceite os termos. Seu perfil ficará disponível para empresas parceiras.'
    },
    {
      id: 4,
      categoria: 'candidato',
      pergunta: 'Preciso comprovar minha deficiência?',
      resposta: 'No cadastro inicial, você apenas declara que é PCD. A comprovação pode ser solicitada pelas empresas durante o processo seletivo, conforme legislação vigente.'
    },
    {
      id: 5,
      categoria: 'candidato',
      pergunta: 'Como me candidato a uma vaga?',
      resposta: 'Navegue pelas vagas disponíveis, clique em "Ver Detalhes" e depois em "Candidatar-se". Você pode filtrar vagas por tipo de deficiência, localização e empresa.'
    },
    {
      id: 6,
      categoria: 'candidato',
      pergunta: 'Minha deficiência não está na lista. O que faço?',
      resposta: 'Selecione "Outra" no cadastro e descreva sua deficiência. Nossa equipe analisará e pode incluí-la na lista oficial ou realocá-la em uma categoria existente.'
    },
    
    // FAQ Empresas
    {
      id: 7,
      categoria: 'empresa',
      pergunta: 'Como cadastro minha empresa?',
      resposta: 'Clique em "Cadastro", selecione "Empresa", preencha os dados corporativos e aguarde até 24h para análise e aprovação da conta.'
    },
    {
      id: 8,
      categoria: 'empresa',
      pergunta: 'Quanto custa publicar vagas?',
      resposta: 'O Incluse é gratuito para empresas comprometidas com a inclusão. Nosso objetivo é facilitar a contratação de pessoas com deficiência.'
    },
    {
      id: 9,
      categoria: 'empresa',
      pergunta: 'Como funciona o processo de seleção?',
      resposta: 'Você publica a vaga com os requisitos, candidatos se inscrevem, você acessa os perfis através da plataforma e conduz seu processo seletivo normalmente.'
    },
    {
      id: 10,
      categoria: 'empresa',
      pergunta: 'Que tipo de suporte vocês oferecem?',
      resposta: 'Oferecemos orientações sobre inclusão no trabalho, adequações de ambiente e boas práticas para contratação de PCDs. Entre em contato conosco!'
    },
    
    // FAQ Mais Geral
    {
      id: 11,
      categoria: 'geral',
      pergunta: 'Os dados são seguros?',
      resposta: 'Sim! Seguimos rigorosos protocolos de segurança e nossa política de privacidade está em conformidade com a LGPD (Lei Geral de Proteção de Dados).'
    },
    {
      id: 12,
      categoria: 'geral',
      pergunta: 'Como entro em contato com o suporte?',
      resposta: 'Você pode nos contatar através do e-mail suporte@incluse.com.br ou pelo telefone (11) 99999-9999. Respondemos em até 24 horas úteis.'
    }
  ];

  const faqFiltrados = filtroCategoria === 'todos' 
    ? faqItems 
    : faqItems.filter(item => item.categoria === filtroCategoria);

  const toggleExpansao = (id: number) => {
    setExpandido(expandido === id ? null : id);
  };

  const getCategoriaLabel = (categoria: string) => {
    switch (categoria) {
      case 'candidato': return 'Para Candidatos';
      case 'empresa': return 'Para Empresas';
      case 'geral': return 'Geral';
      default: return 'Todos';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Perguntas Frequentes
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Encontre respostas para as principais dúvidas sobre o Incluse, nossa plataforma de 
            inclusão profissional para pessoas com deficiência.
          </p>
        </div>

        {/* Filtros */}
  <div className="bg-white dark:bg-transparent rounded-lg shadow-md border border-gray-300 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Filtrar por categoria
          </h2>
          <div className="flex flex-wrap gap-2">
            {(['todos', 'candidato', 'empresa', 'geral'] as const).map((categoria) => (
              <button
                key={categoria}
                onClick={() => setFiltroCategoria(categoria)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filtroCategoria === categoria
                    ? 'bg-gradient-to-r from-incluse-primary to-incluse-secondary text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-incluse-primary/10 hover:border-incluse-secondary/30 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                }`}
              >
                {getCategoriaLabel(categoria)}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de FAQs */}
        <div className="space-y-4 mb-12">
          {faqFiltrados.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md border border-gray-300 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleExpansao(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 ${
                      item.categoria === 'candidato' 
                        ? 'bg-incluse-secondary/20 dark:bg-incluse-secondary/10 text-incluse-secondary-dark dark:text-incluse-secondary'
                        : item.categoria === 'empresa'
                        ? 'bg-incluse-primary/20 dark:bg-incluse-primary/10 text-incluse-primary-dark dark:text-incluse-primary'
                        : 'bg-incluse-accent/20 dark:bg-incluse-accent/10 text-incluse-accent-dark dark:text-incluse-accent'
                    }`}>
                      {getCategoriaLabel(item.categoria)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400/70 via-blue-300/50 to-emerald-400/70 bg-clip-text text-transparent dark:from-blue-200/40 dark:via-blue-100/30 dark:to-emerald-200/40">
                    {item.pergunta}
                  </h3>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 ${
                    expandido === item.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandido === item.id && (
                <div className="px-6 pb-4 border-t border-gray-200 bg-white">
                  <p className="text-gray-800 mt-4 leading-relaxed">{item.resposta}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-incluse-primary/10 via-incluse-accent/10 to-incluse-secondary/10 border border-incluse-accent/30 rounded-lg p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-incluse-primary to-incluse-secondary bg-clip-text text-transparent mb-4">
            Não encontrou sua resposta?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Nossa equipe está pronta para ajudar você com qualquer dúvida sobre inclusão e acessibilidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:suporte@incluse.com.br"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-incluse-primary to-incluse-accent hover:from-incluse-primary-dark hover:to-incluse-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-incluse-primary transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar E-mail
            </a>
            <a
              href="tel:+5511999999999"
              className="inline-flex items-center px-6 py-3 border border-incluse-secondary text-base font-medium rounded-md text-incluse-secondary bg-white dark:bg-transparent hover:bg-incluse-secondary hover:text-white dark:hover:bg-incluse-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-incluse-secondary transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (11) 99999-9999
            </a>
          </div>
        </div>

        {/* Links úteis */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link 
              to="/" 
              className="text-incluse-primary hover:text-incluse-primary-dark font-medium underline transition-colors duration-300"
            >
              ← Voltar à página inicial
            </Link>
            <Link 
              to="/politica-privacidade" 
              className="text-incluse-secondary hover:text-incluse-secondary-dark font-medium underline transition-colors duration-300"
            >
              Política de Privacidade
            </Link>
            <Link 
              to="/vagas" 
              className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium underline"
            >
              Ver Vagas Disponíveis
            </Link>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}