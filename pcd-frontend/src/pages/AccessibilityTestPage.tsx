import { useAccessibility } from "../hooks/useAccessibility";

export default function AccessibilityTestPage() {
  const { 
    settings, 
    setFontSize, 
    setTheme,
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
          </div>
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