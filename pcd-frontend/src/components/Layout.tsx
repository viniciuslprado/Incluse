import type { ReactNode } from "react";
import ThemeToggle from "./ThemeToggle";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showThemeToggle?: boolean;
}

export default function Layout({ 
  children, 
  title, 
  subtitle, 
  showThemeToggle = true 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Botão de tema fixo no canto superior direito */}
      {showThemeToggle && (
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
      )}
      
      {/* Cabeçalho da página */}
      {(title || subtitle) && (
        <header className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-6">
            {title && (
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </header>
      )}

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}