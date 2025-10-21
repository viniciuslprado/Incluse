import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Vagas', href: '/vagas' },
    { name: 'Empresas', href: '/empresas' },
    { name: 'FAQ', href: '/faq' }
  ];

  return (
    <nav id="navigation" className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50" role="navigation" aria-label="Navegação principal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-incluse-text dark:text-incluse-text-dark">
                Incluse
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-incluse-text dark:text-incluse-text-dark hover:text-incluse-primary dark:hover:text-incluse-accent px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-incluse-accent focus:ring-offset-2 rounded"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/login"
              className="text-incluse-text dark:text-incluse-text-dark hover:text-incluse-primary dark:hover:text-incluse-accent px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-incluse-accent focus:ring-offset-2 rounded"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-incluse-primary to-incluse-secondary hover:from-incluse-primary-dark hover:to-incluse-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-incluse-accent shadow-sm hover:shadow-md transition-all duration-200 min-h-[44px]"
            >
              Cadastrar-se
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-incluse-text dark:text-incluse-text-dark hover:text-incluse-primary dark:hover:text-incluse-accent p-2 rounded focus:outline-none focus:ring-2 focus:ring-incluse-accent focus:ring-offset-2 transition-colors duration-200 min-h-[44px] min-w-[44px]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Abrir menu principal</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-incluse-secondary dark:bg-incluse-secondary-dark border-t border-incluse-primary/20 dark:border-incluse-accent/20">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-incluse-text dark:text-incluse-text-dark hover:text-incluse-primary dark:hover:text-incluse-accent hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center px-3 py-2 text-base font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-incluse-accent focus:ring-offset-2 min-h-[44px]"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-incluse-primary/20 dark:border-incluse-accent/20 pt-3 mt-3">
              <Link
                to="/login"
                className="text-incluse-text dark:text-incluse-text-dark hover:text-incluse-primary dark:hover:text-incluse-accent hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center px-3 py-2 text-base font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-incluse-accent focus:ring-offset-2 min-h-[44px]"
                onClick={() => setIsMenuOpen(false)}
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="bg-incluse-primary hover:bg-incluse-primary-dark text-white flex items-center px-3 py-2 text-base font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-incluse-accent focus:ring-offset-2 min-h-[44px] mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Cadastrar-se
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}