import { Link } from 'react-router-dom';

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          Criar conta no Incluse
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            Fazer login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Escolha o tipo de conta
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selecione a opção que melhor se adequa ao seu perfil
            </p>
          </div>

          <div className="space-y-4">
            {/* Cadastro de Candidato */}
            <Link
              to="/cadastro/candidato"
              className="group relative block p-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Sou Candidato
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Busque vagas inclusivas e se candidate para oportunidades PCD
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                      ♿ Pessoa com Deficiência
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400">
                      🔍 Buscar Vagas
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Cadastro de Empresa */}
            <Link
              to="/cadastro/empresa"
              className="group relative block p-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    Sou Empresa
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Publique vagas inclusivas e encontre talentos PCD para sua equipe
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                      🏢 Recrutamento
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400">
                      📝 Publicar Vagas
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Ao criar uma conta, você concorda com nossa{' '}
              <Link to="/politica-privacidade" className="text-blue-600 dark:text-blue-400 hover:underline">
                Política de Privacidade
              </Link>{' '}
              e{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                Termos de Uso
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}