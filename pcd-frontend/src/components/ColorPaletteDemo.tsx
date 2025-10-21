// Componente de demonstração da paleta de cores Incluse

export function ColorPaletteDemo() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-incluse-primary dark:text-incluse-primary-dark-mode mb-2">
          Incluse - Paleta Azul + Verde
        </h1>
        <p className="text-incluse-text-secondary dark:text-gray-300">
          Sistema de cores acessível, profissional e inclusivo
        </p>
      </div>

      {/* Cores Principais */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-incluse-primary dark:text-incluse-primary-dark-mode">
          Cores Principais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-incluse-primary p-6 rounded-lg text-white text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-lg font-semibold">Primária</div>
            <div className="text-sm opacity-90">#0057B8</div>
            <div className="text-xs mt-2">Confiança • Profissionalismo</div>
          </div>
          <div className="bg-incluse-secondary p-6 rounded-lg text-white text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-lg font-semibold">Secundária</div>
            <div className="text-sm opacity-90">#2E8B57</div>
            <div className="text-xs mt-2">Inclusão • Acolhimento</div>
          </div>
          <div className="bg-incluse-accent p-6 rounded-lg text-white text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-lg font-semibold">Acento</div>
            <div className="text-sm opacity-90">#2E8BFF</div>
            <div className="text-xs mt-2">Interação • Links</div>
          </div>
          <div className="bg-incluse-success p-6 rounded-lg text-white text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-lg font-semibold">Sucesso</div>
            <div className="text-sm opacity-90">#43A047</div>
            <div className="text-xs mt-2">Positivo • Confirmação</div>
          </div>
        </div>
      </section>

      {/* Fundos */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-incluse-text dark:text-incluse-text-dark">
          Fundos e Superfícies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-incluse-bg-primary border border-incluse-primary/20 p-6 rounded-lg text-center">
            <div className="text-lg font-semibold text-incluse-primary">Fundo Primário</div>
            <div className="text-sm text-incluse-text-secondary">#E6F0FF</div>
            <div className="text-xs mt-2 text-incluse-text-light">Páginas principais • Headers</div>
          </div>
          <div className="bg-incluse-bg-secondary border border-incluse-secondary/20 p-6 rounded-lg text-center">
            <div className="text-lg font-semibold text-incluse-secondary">Fundo Secundário</div>
            <div className="text-sm text-incluse-text-secondary">#E8F5E9</div>
            <div className="text-xs mt-2 text-incluse-text-light">Cards inclusivos • Destaques</div>
          </div>
          <div className="bg-incluse-bg-neutral border border-gray-300 p-6 rounded-lg text-center">
            <div className="text-lg font-semibold text-incluse-text">Fundo Neutro</div>
            <div className="text-sm text-incluse-text-secondary">#F5F5F5</div>
            <div className="text-xs mt-2 text-incluse-text-light">Áreas neutras • Divisórias</div>
          </div>
        </div>
      </section>

      {/* Botões */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-incluse-primary dark:text-incluse-accent">
          Componentes de Interface
        </h2>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-incluse-primary hover:bg-incluse-primary-dark text-white rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-incluse-accent focus:ring-offset-2 min-h-[44px] shadow-sm hover:shadow-md">
              Botão Primário (Azul)
            </button>
            <button className="px-6 py-3 bg-incluse-secondary hover:bg-incluse-secondary-dark text-white rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-incluse-secondary focus:ring-offset-2 min-h-[44px] shadow-sm hover:shadow-md">
              Botão Secundário (Verde)
            </button>
            <button className="px-6 py-3 bg-incluse-accent hover:bg-incluse-accent-dark text-white rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-incluse-accent focus:ring-offset-2 min-h-[44px] shadow-sm hover:shadow-md">
              Botão Acento
            </button>
            <button className="px-6 py-3 bg-incluse-bg-primary text-incluse-primary border-2 border-incluse-primary hover:bg-incluse-primary hover:text-white rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-incluse-accent focus:ring-offset-2 min-h-[44px]">
              Outline Azul
            </button>
            <button className="px-6 py-3 bg-incluse-bg-secondary text-incluse-secondary border-2 border-incluse-secondary hover:bg-incluse-secondary hover:text-white rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-incluse-secondary focus:ring-offset-2 min-h-[44px]">
              Outline Verde
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-incluse-success hover:bg-green-600 text-white rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-incluse-success focus:ring-offset-2 min-h-[44px] text-sm">
              ✓ Confirmar
            </button>
            <button className="px-4 py-2 bg-incluse-error hover:bg-red-800 text-white rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-incluse-error focus:ring-offset-2 min-h-[44px] text-sm">
              ✗ Cancelar
            </button>
            <button className="px-4 py-2 bg-incluse-warning hover:bg-orange-600 text-white rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-incluse-warning focus:ring-offset-2 min-h-[44px] text-sm">
              ⚠ Atenção
            </button>
            <button className="px-4 py-2 bg-incluse-info hover:bg-blue-700 text-white rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-incluse-info focus:ring-offset-2 min-h-[44px] text-sm">
              ℹ Informação
            </button>
          </div>
        </div>
      </section>

      {/* Formulários */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-incluse-text dark:text-incluse-text-dark">
          Elementos de Formulário
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-incluse-text dark:text-incluse-text-dark mb-2">
              Nome Completo
            </label>
            <input 
              type="text" 
              placeholder="Digite seu nome"
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-incluse-text dark:text-incluse-text-dark focus:ring-2 focus:ring-incluse-accent focus:border-incluse-accent transition-all duration-200 min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-incluse-text dark:text-incluse-text-dark mb-2">
              Email
            </label>
            <input 
              type="email" 
              placeholder="seu@email.com"
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-incluse-text dark:text-incluse-text-dark focus:ring-2 focus:ring-incluse-accent focus:border-incluse-accent transition-all duration-200 min-h-[44px]"
            />
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-incluse-text dark:text-incluse-text-dark">
          Cards e Containers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h4 className="text-lg font-semibold text-incluse-primary dark:text-incluse-accent mb-2">
              Vaga de Desenvolvedor
            </h4>
            <p className="text-incluse-text-light dark:text-gray-300 mb-4">
              Oportunidade em empresa inclusiva com foco em acessibilidade.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-incluse-success bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                Remoto
              </span>
              <button className="text-incluse-primary dark:text-incluse-accent hover:text-incluse-primary-dark underline underline-offset-2 focus:ring-2 focus:ring-incluse-accent focus:ring-offset-2 rounded px-1">
                Ver mais
              </button>
            </div>
          </div>
          
          <div className="bg-incluse-secondary dark:bg-incluse-secondary-dark border border-incluse-primary/20 dark:border-incluse-accent/20 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-incluse-primary dark:text-incluse-accent mb-2">
              Card Destacado
            </h4>
            <p className="text-incluse-text dark:text-incluse-text-dark mb-4">
              Informação importante em destaque com cor de fundo diferenciada.
            </p>
            <div className="text-sm text-incluse-warning bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded inline-block">
              Atenção especial
            </div>
          </div>
        </div>
      </section>

      {/* Estados de Mensagem */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-incluse-text dark:text-incluse-text-dark">
          Estados de Mensagem
        </h3>
        <div className="space-y-3">
          <div className="text-incluse-success bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-md border border-green-200 dark:border-green-800">
            ✅ Cadastro realizado com sucesso!
          </div>
          <div className="text-incluse-error bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-md border border-red-200 dark:border-red-800">
            ❌ Erro: Verifique os dados informados.
          </div>
          <div className="text-incluse-warning bg-yellow-50 dark:bg-yellow-900/20 px-4 py-3 rounded-md border border-yellow-200 dark:border-yellow-800">
            ⚠️ Atenção: Complete todos os campos obrigatórios.
          </div>
        </div>
      </section>

      {/* Diretrizes de Uso */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-incluse-text dark:text-incluse-text-dark">
          Diretrizes de Uso - Paleta Azul + Verde
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-incluse-bg-primary p-6 rounded-lg border border-incluse-primary/20">
            <h4 className="text-lg font-semibold text-incluse-primary mb-3">🔵 Azul - Confiança</h4>
            <ul className="space-y-2 text-incluse-text-secondary text-sm">
              <li>• Cabeçalhos e menus principais</li>
              <li>• Botões primários de ação</li>
              <li>• Ícones de navegação</li>
              <li>• Links e elementos interativos</li>
              <li>• Identidade visual corporativa</li>
            </ul>
          </div>
          
          <div className="bg-incluse-bg-secondary p-6 rounded-lg border border-incluse-secondary/20">
            <h4 className="text-lg font-semibold text-incluse-secondary mb-3">🟢 Verde - Inclusão</h4>
            <ul className="space-y-2 text-incluse-text-secondary text-sm">
              <li>• Botões secundários e apoio</li>
              <li>• Mensagens de sucesso</li>
              <li>• Ícones de confirmação</li>
              <li>• Elementos positivos e acolhedores</li>
              <li>• Seções de destaque inclusivas</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Acessibilidade */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-incluse-text dark:text-incluse-text-dark">
          Recursos de Acessibilidade WCAG 2.1 AA
        </h3>
        <div className="bg-incluse-bg-neutral p-6 rounded-lg border border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-incluse-text mb-2">✅ Contraste e Legibilidade</h4>
              <ul className="space-y-1 text-incluse-text-secondary text-sm">
                <li>• Contraste mínimo de 4.5:1</li>
                <li>• Texto escuro sobre fundo claro</li>
                <li>• Tamanhos de fonte acessíveis</li>
                <li>• Espaçamento adequado</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-incluse-text mb-2">🎯 Interação e Navegação</h4>
              <ul className="space-y-1 text-incluse-text-secondary text-sm">
                <li>• Áreas de clique mínimo 44px</li>
                <li>• Foco visível em elementos</li>
                <li>• Ícones + texto (nunca só cor)</li>
                <li>• Suporte a teclado e screen readers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Exemplos Práticos */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-incluse-text dark:text-incluse-text-dark">
          Exemplos de Aplicação
        </h3>
        <div className="space-y-4">
          <div className="bg-incluse-bg-primary p-4 rounded-lg border border-incluse-primary/20">
            <h4 className="text-incluse-primary font-semibold mb-2">💼 Páginas de Login/Cadastro</h4>
            <p className="text-incluse-text-secondary text-sm">Fundo azul claro, botão principal azul, botão secundário verde, mensagens de sucesso em verde vibrante.</p>
          </div>
          <div className="bg-incluse-bg-secondary p-4 rounded-lg border border-incluse-secondary/20">
            <h4 className="text-incluse-secondary font-semibold mb-2">📊 Dashboard e Painéis</h4>
            <p className="text-incluse-text-secondary text-sm">Header azul, cards com fundo verde claro para destacar inclusão, ícones azuis para navegação.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-300">
            <h4 className="text-incluse-text font-semibold mb-2">⚡ Alertas e Notificações</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 bg-incluse-success text-white rounded text-xs">Sucesso Verde</span>
              <span className="px-2 py-1 bg-incluse-error text-white rounded text-xs">Erro Vermelho</span>
              <span className="px-2 py-1 bg-incluse-warning text-white rounded text-xs">Atenção Laranja</span>
              <span className="px-2 py-1 bg-incluse-info text-white rounded text-xs">Info Azul</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}