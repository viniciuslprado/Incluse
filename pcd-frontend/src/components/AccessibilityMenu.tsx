import { useState } from "react";
import { useAccessibility } from "../hooks/useAccessibility";

// Importar tipos do contexto
import type { FontSize, FontFamily, Theme } from "../contexts/AccessibilityContext";

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    settings, 
    setFontSize, 
    setFontFamily, 
    setTheme, 
    toggleTheme, 
    resetSettings 
  } = useAccessibility();

  const fontSizeLabels: Record<FontSize, string> = {
    normal: "Normal",
    large: "Grande", 
    "extra-large": "Extra Grande"
  };

  const fontFamilyLabels: Record<FontFamily, string> = {
    default: "Padrão",
    readable: "Legível",
    serif: "Serif"
  };

  const themeLabels: Record<Theme, string> = {
    light: "Claro",
    dark: "Escuro",
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        id="accessibility-menu"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        title="Menu de Acessibilidade"
        aria-label="Abrir menu de acessibilidade"
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </button>

      {/* Menu de acessibilidade */}
      {isOpen && (
        <div className="fixed right-24 top-1/2 transform -translate-y-1/2 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-80 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Acessibilidade
            </h2>
            <div className="flex items-center space-x-2">
              {/* Botão de alternância rápida de tema */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title={`Alternar para tema ${settings.theme === 'light' ? 'escuro' : 'claro'}`}
              >
                {settings.theme === 'light' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Tamanho da Fonte */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tamanho da Fonte
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(fontSizeLabels) as FontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`p-2 text-left text-sm rounded-md border transition-colors ${
                      settings.fontSize === size
                        ? "bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    {fontSizeLabels[size]}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo de Fonte */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Fonte
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(fontFamilyLabels) as FontFamily[]).map((family) => (
                  <button
                    key={family}
                    onClick={() => setFontFamily(family)}
                    className={`p-2 text-left text-sm rounded-md border transition-colors ${
                      settings.fontFamily === family
                        ? "bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    {fontFamilyLabels[family]}
                  </button>
                ))}
              </div>
            </div>

            {/* Tema */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tema
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(themeLabels) as Theme[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setTheme(theme)}
                    className={`p-2 text-left text-sm rounded-md border transition-colors flex items-center ${
                      settings.theme === theme
                        ? "bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    <div 
                      className={`w-3 h-3 rounded-full mr-2 ${
                        theme === "light" 
                          ? "bg-yellow-400" 
                          : "bg-gray-800"
                      }`}
                    />
                    {themeLabels[theme]}
                  </button>
                ))}
              </div>
            </div>

            {/* Configurações Avançadas removidas */}

            {/* Botão de Reset */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={resetSettings}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                Restaurar Padrões
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para fechar ao clicar fora */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}