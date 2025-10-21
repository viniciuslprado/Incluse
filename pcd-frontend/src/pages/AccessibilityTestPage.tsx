import { useAccessibility } from "../hooks/useAccessibility";

export default function AccessibilityTestPage() {
  const { 
    settings, 
    setFontSize, 
    setTheme,
    toggleReducedMotion,
    toggleHighContrast,
    toggleFocusIndicators
  } = useAccessibility();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Teste de Acessibilidade - Incluse
        </h1>

        {/* Status das configurações */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Status Atual das Configurações
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Tamanho da Fonte:</strong> {settings.fontSize}
            </div>
            <div>
              <strong>Família da Fonte:</strong> {settings.fontFamily}
            </div>
            <div>
              <strong>Tema:</strong> {settings.theme}
            </div>
            <div>
              <strong>Movimento Reduzido:</strong> {settings.reducedMotion ? '✅' : '❌'}
            </div>
            <div>
              <strong>Alto Contraste:</strong> {settings.highContrast ? '✅' : '❌'}
            </div>
            <div>
              <strong>Focus Indicators:</strong> {settings.focusIndicators ? '✅' : '❌'}
            </div>
            <div>
              <strong>Screen Reader:</strong> {settings.screenReaderOptimized ? '✅' : '❌'}
            </div>
            <div>
              <strong>Classes DOM:</strong> 
              <code className="text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded">
                {typeof document !== 'undefined' ? document.documentElement.className : 'Carregando...'}
              </code>
            </div>
          </div>
        </div>

        {/* Testes de Fonte */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border">
          <h2 className="text-xl font-semibold mb-4">Teste de Tamanho de Fonte</h2>
          <div className="space-y-4">
            <button 
              onClick={() => setFontSize('normal')}
              className="mr-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Normal (16px)
            </button>
            <button 
              onClick={() => setFontSize('large')}
              className="mr-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Grande (18px)
            </button>
            <button 
              onClick={() => setFontSize('extra-large')}
              className="mr-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Extra Grande (20px)
            </button>
          </div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Este texto deve mudar de tamanho quando você clica nos botões acima.
          </p>
        </div>

        {/* Teste de Temas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border">
          <h2 className="text-xl font-semibold mb-4">Teste de Temas</h2>
          <div className="space-y-4">
            <button 
              onClick={() => setTheme('light')}
              className="mr-4 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
            >
              Tema Claro
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className="mr-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              Tema Escuro
            </button>
            <button 
              onClick={() => setTheme('high-contrast')}
              className="mr-4 px-4 py-2 bg-black text-white border-2 border-white rounded"
            >
              Alto Contraste
            </button>
          </div>
        </div>

        {/* Teste de Movimento */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border">
          <h2 className="text-xl font-semibold mb-4">Teste de Movimento</h2>
          <div className="space-y-2 mb-4">
            <button 
              onClick={toggleReducedMotion}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 mr-2"
            >
              Toggle Movimento Reduzido
            </button>
            <button 
              onClick={() => {
                const root = document.documentElement;
                if (root.classList.contains('reduce-motion')) {
                  root.classList.remove('reduce-motion');
                } else {
                  root.classList.add('reduce-motion');
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Forçar Classe CSS
            </button>
          </div>
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto animate-bounce">
            <div className="w-full h-full flex items-center justify-center text-white font-bold">
              🎯
            </div>
          </div>
          <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
            Esta animação deve parar quando "Movimento Reduzido" está ativo
          </p>
        </div>

        {/* Teste de Contraste */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border">
          <h2 className="text-xl font-semibold mb-4">Teste de Alto Contraste</h2>
          <div className="space-y-2 mb-4">
            <button 
              onClick={toggleHighContrast}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
            >
              Toggle Alto Contraste
            </button>
            <button 
              onClick={() => {
                const root = document.documentElement;
                if (root.classList.contains('high-contrast')) {
                  root.classList.remove('high-contrast');
                } else {
                  root.classList.add('high-contrast');
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Forçar Alto Contraste
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">Texto com contraste normal</p>
            <p className="text-gray-500 dark:text-gray-500">Texto com menos contraste</p>
            <p className="text-blue-600 dark:text-blue-400">Link em azul</p>
          </div>
        </div>

        {/* Teste de Focus */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border">
          <h2 className="text-xl font-semibold mb-4">Teste de Indicadores de Foco</h2>
          <div className="space-y-2 mb-4">
            <button 
              onClick={toggleFocusIndicators}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mr-2"
            >
              Toggle Focus Indicators
            </button>
            <button 
              onClick={() => {
                const root = document.documentElement;
                if (root.classList.contains('focus-indicators')) {
                  root.classList.remove('focus-indicators');
                } else {
                  root.classList.add('focus-indicators');
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Forçar Focus Melhorado
            </button>
          </div>
          <div className="space-y-2">
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded mr-2">Botão 1</button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded mr-2">Botão 2</button>
            <input type="text" placeholder="Campo de texto" className="px-3 py-2 border rounded mr-2" />
            <select className="px-3 py-2 border rounded">
              <option>Opção 1</option>
              <option>Opção 2</option>
            </select>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Use Tab para navegar e ver os indicadores de foco
          </p>
        </div>

        {/* Navegação de teste */}
        <div className="text-center">
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Voltar à Página Inicial
          </a>
        </div>
      </div>
    </div>
  );
}