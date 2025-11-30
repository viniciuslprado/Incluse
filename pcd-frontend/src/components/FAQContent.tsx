import { useState } from 'react';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: number;
  pergunta: string;
  resposta: string;
  categoria: 'candidato' | 'empresa' | 'geral';
}

export default function FAQContent() {
  const [filtroCategoria, setFiltroCategoria] = useState<'todos' | 'candidato' | 'empresa' | 'geral'>('todos');
  const [expandido, setExpandido] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    { id: 1, categoria: 'geral', pergunta: 'O que é o Incluse?', resposta: 'O Incluse é uma plataforma inclusiva que conecta pessoas com deficiência (PCD) às melhores oportunidades de trabalho em empresas comprometidas com a diversidade e inclusão.' },
    { id: 2, categoria: 'geral', pergunta: 'Como o Incluse garante a acessibilidade?', resposta: 'Nossa plataforma possui menu de acessibilidade com controle de fonte, tamanho, temas e outros recursos. Todas as vagas são de empresas que se comprometem com ambientes inclusivos.' },
    { id: 3, categoria: 'candidato', pergunta: 'Como me cadastro como candidato?', resposta: 'Clique em "Cadastro" no menu superior, selecione "Candidato", preencha seus dados pessoais, tipo de deficiência e aceite os termos. Seu perfil ficará disponível para empresas parceiras.' },
    { id: 4, categoria: 'candidato', pergunta: 'Preciso comprovar minha deficiência?', resposta: 'No cadastro inicial, você apenas declara que é PCD. A comprovação pode ser solicitada pelas empresas durante o processo seletivo, conforme legislação vigente.' },
    { id: 5, categoria: 'candidato', pergunta: 'Como me candidato a uma vaga?', resposta: 'Navegue pelas vagas disponíveis, clique em "Ver Detalhes" e depois em "Candidatar-se". Você pode filtrar vagas por tipo de deficiência, localização e empresa.' },
    { id: 6, categoria: 'candidato', pergunta: 'Minha deficiência não está na lista. O que faço?', resposta: 'Selecione "Outra" no cadastro e descreva sua deficiência. Nossa equipe analisará e pode incluí-la na lista oficial ou realocá-la em uma categoria existente.' },
    { id: 7, categoria: 'empresa', pergunta: 'Como cadastro minha empresa?', resposta: 'Clique em "Cadastro", selecione "Empresa", preencha os dados corporativos e aguarde até 24h para análise e aprovação da conta.' },
    { id: 8, categoria: 'empresa', pergunta: 'Quanto custa publicar vagas?', resposta: 'O Incluse é gratuito para empresas comprometidas com a inclusão. Nosso objetivo é facilitar a contratação de pessoas com deficiência.' },
    { id: 9, categoria: 'empresa', pergunta: 'Como funciona o processo de seleção?', resposta: 'Você publica a vaga com os requisitos, candidatos se inscrevem, você acessa os perfis através da plataforma e conduz seu processo seletivo normalmente.' },
    { id: 10, categoria: 'empresa', pergunta: 'Que tipo de suporte vocês oferecem?', resposta: 'Oferecemos orientações sobre inclusão no trabalho, adequações de ambiente e boas práticas para contratação de PCDs. Entre em contato conosco!' },
    { id: 11, categoria: 'geral', pergunta: 'Os dados são seguros?', resposta: 'Sim! Seguimos rigorosos protocolos de segurança e nossa política de privacidade está em conformidade com a LGPD (Lei Geral de Proteção de Dados).' },
    { id: 12, categoria: 'geral', pergunta: 'Como entro em contato com o suporte?', resposta: 'Você pode nos contatar através do e-mail suporte@incluse.com.br ou pelo telefone (11) 99999-9999. Respondemos em até 24 horas úteis.' }
  ];

  const faqFiltrados = filtroCategoria === 'todos' ? faqItems : faqItems.filter(item => item.categoria === filtroCategoria);
  const toggleExpansao = (id: number) => setExpandido(expandido === id ? null : id);
  const getCategoriaLabel = (categoria: string) => {
    switch (categoria) {
      case 'candidato': return 'Para Candidatos';
      case 'empresa': return 'Para Empresas';
      case 'geral': return 'Geral';
      default: return 'Todos';
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Perguntas Frequentes</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300">Encontre respostas para as principais dúvidas sobre o Incluse.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {(['todos', 'candidato', 'empresa', 'geral'] as const).map((categoria) => (
            <button
              key={categoria}
              onClick={() => setFiltroCategoria(categoria)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filtroCategoria === categoria ? 'bg-gradient-to-r from-incluse-primary to-incluse-secondary text-white shadow-md' : 'bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-300 hover:bg-incluse-primary/10 border border-gray-300 dark:border-gray-700'}`}
            >
              {getCategoriaLabel(categoria)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {faqFiltrados.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <button onClick={() => toggleExpansao(item.id)} className="w-full px-4 py-3 text-left flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${item.categoria === 'candidato' ? 'bg-incluse-secondary/20 text-incluse-secondary' : item.categoria === 'empresa' ? 'bg-incluse-primary/20 text-incluse-primary' : 'bg-incluse-accent/20 text-incluse-accent'}`}>{getCategoriaLabel(item.categoria)}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{item.pergunta}</h3>
              </div>
              <svg className={`w-5 h-5 text-gray-500 ${expandido === item.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {expandido === item.id && (<div className="px-4 pb-3 border-t border-gray-100"><p className="text-sm text-gray-800 mt-2">{item.resposta}</p></div>)}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:suporte@incluse.com.br" className="px-4 py-2 rounded bg-incluse-primary text-white">Enviar E-mail</a>
          <a href="tel:+5511999999999" className="px-4 py-2 rounded border border-incluse-secondary text-incluse-secondary">(11) 99999-9999</a>
        </div>
        <div className="mt-4 text-sm">
          <Link to="/politica-privacidade" className="underline text-incluse-secondary">Política de Privacidade</Link>
        </div>
      </div>
    </div>
  );
}
