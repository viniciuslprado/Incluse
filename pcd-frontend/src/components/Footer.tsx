import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t-2 border-incluse-primary">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo e descrição */}
          <div className="xl:col-span-1">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">
                Incluse
              </span>
            </div>
            <p className="mt-4 text-gray-300 text-sm max-w-md">
              Conectamos pessoas com deficiência às melhores oportunidades de trabalho 
              em empresas comprometidas com a inclusão e diversidade.
            </p>
            <div className="flex space-x-6 mt-6">
              {/* Redes Sociais (links de exemplo) */}
              <a 
                href="#" 
                className="text-gray-400 hover:text-incluse-secondary transition-colors duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-incluse-primary transition-colors duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-incluse-accent transition-colors duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.745 3.708 12.447s.49-2.448 1.418-3.323C6.001 8.198 7.152 7.708 8.45 7.708s2.448.49 3.323 1.416c.876.876 1.297 2.025 1.297 3.323s-.42 2.447-1.297 3.323c-.875.807-2.026 1.218-3.324 1.218zm7.718-1.092V9.447h-1.615v6.449h1.615zm-.807-7.336c-.245 0-.49-.098-.637-.245-.147-.147-.245-.392-.245-.637s.098-.49.245-.637c.147-.147.392-.245.637-.245s.49.098.637.245c.147.147.245.392.245.637s-.098.49-.245.637c-.147.147-.392.245-.637.245z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links de navegação */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-incluse-accent tracking-wider uppercase">
                  Navegação
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/" className="text-base text-gray-300 hover:text-incluse-accent transition-colors duration-300">
                      Início
                    </Link>
                  </li>
                  <li>
                    <Link to="/vagas" className="text-base text-gray-300 hover:text-incluse-secondary transition-colors duration-300">
                      Vagas
                    </Link>
                  </li>
                  <li>
                    <Link to="/empresa" className="text-base text-gray-300 hover:text-incluse-primary transition-colors duration-300">
                      Empresas Parceiras
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => window.dispatchEvent(new CustomEvent('openFaq'))} className="text-base text-gray-300 hover:text-incluse-accent transition-colors duration-300 bg-transparent p-0">
                        FAQ
                      </button>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-incluse-secondary tracking-wider uppercase">
                  Para Candidatos
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/cadastro/candidato" className="text-base text-gray-300 hover:text-incluse-secondary transition-colors duration-300">
                      Cadastrar-se
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-base text-gray-300 hover:text-incluse-primary transition-colors duration-300">
                      Fazer Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/vagas" className="text-base text-gray-300 hover:text-incluse-accent transition-colors duration-300">
                      Buscar Vagas
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-incluse-primary tracking-wider uppercase">
                  Para Empresas
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/cadastro/empresa" className="text-base text-gray-300 hover:text-incluse-primary transition-colors duration-300">
                      Cadastrar Empresa
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-base text-gray-300 hover:text-incluse-secondary transition-colors duration-300">
                      Área da Empresa
                    </Link>
                  </li>
                  <li>
                    <Link to="/empresa" className="text-base text-gray-300 hover:text-incluse-primary transition-colors duration-300">
                      Empresas Parceiras
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-incluse-accent tracking-wider uppercase">
                  Suporte
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                      <button onClick={() => window.dispatchEvent(new CustomEvent('openFaq'))} className="text-base text-gray-300 hover:text-incluse-accent transition-colors duration-300 bg-transparent p-0">
                        Perguntas Frequentes
                      </button>
                  </li>
                  <li>
                    <Link to="/contato" className="text-base text-gray-300 hover:text-incluse-secondary transition-colors duration-300">
                      Contato
                    </Link>
                  </li>
                  <li>
                    <Link to="/politica-privacidade" className="text-base text-gray-300 hover:text-incluse-accent transition-colors duration-300">
                      Política de Privacidade
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="md:flex md:items-center md:justify-between">
              <div className="flex space-x-6 md:order-2">
                <Link to="/politica-privacidade" className="text-gray-400 hover:text-incluse-accent text-sm transition-colors duration-300">
                  Política de Privacidade
                </Link>
                  <button onClick={() => window.dispatchEvent(new CustomEvent('openFaq'))} className="text-gray-400 hover:text-incluse-accent text-sm transition-colors duration-300 bg-transparent p-0">
                    FAQ
                  </button>
              </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              © 2025 Incluse. Todos os direitos reservados. Plataforma de inclusão profissional.
            </p>
          </div>
        </div>

        {/* Informações de acessibilidade */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-incluse-accent/30">
          <div className="flex items-center">
            <div className="p-2 bg-incluse-accent rounded-full mr-3 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-300">
              Este site foi desenvolvido seguindo padrões de acessibilidade. Use o menu de acessibilidade no canto da tela para personalizar sua experiência.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}