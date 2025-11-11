import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

type UserType = 'candidato' | 'empresa' | 'administrador';

export default function LoginPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('candidato');
  const [identifier, setIdentifier] = useState(''); // email or CPF/CNPJ
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!identifier.trim() || !senha.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }

    // Validação básica: se contém @, considera e-mail; caso contrário CPF/CNPJ dependendo do tipo
    const isEmail = identifier.includes('@');
    if (isEmail) {
      // validação simples de e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        setErro('E-mail inválido.');
        return;
      }
    } else {
      const onlyDigits = identifier.replace(/\D/g, '');
      if (userType === 'candidato' && onlyDigits.length !== 11) {
        setErro('CPF inválido. Deve ter 11 dígitos.');
        return;
      }
      if (userType === 'empresa' && onlyDigits.length !== 14) {
        setErro('CNPJ inválido. Deve ter 14 dígitos.');
        return;
      }
    }

    setLoading(true);
    try {
      // Chamar backend
  const res = await api.login(identifier, senha, userType) as { token?: string; user?: Record<string, unknown>; userType?: string };
      // res expected { token, user, userType }
      const token = res && res.token;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userType', userType);
        // redirecionar para a home (ou dashboard futuro)
        navigate('/');
        return;
      }
      setErro('Erro ao fazer login. Resposta inválida.');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErro(message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeTitle = (type: UserType) => {
    switch (type) {
      case 'candidato': return 'Candidato';
      case 'empresa': return 'Empresa';
      case 'administrador': return 'Administrador';
      default: return 'Usuário';
    }
  };

  const getUserTypeDescription = (type: UserType) => {
    switch (type) {
      case 'candidato': return 'Encontre vagas inclusivas e se candidate';
      case 'empresa': return 'Publique vagas e encontre talentos PCD';
      case 'administrador': return 'Gerencie o sistema Incluse';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          Entrar no Incluse
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Ou{' '}
          <Link
            to="/cadastro"
            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            criar uma nova conta
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Seletor de tipo de usuário */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tipo de acesso
            </label>
            <div className="grid grid-cols-1 gap-3">
              {(['candidato', 'empresa', 'administrador'] as UserType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUserType(type)}
                  className={`relative rounded-lg border p-4 flex flex-col items-center text-center transition-all duration-300 ${
                    userType === type
                      ? 'border-incluse-accent bg-gradient-to-br from-incluse-primary/10 to-incluse-secondary/10 text-incluse-primary shadow-md'
                      : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-incluse-primary/5 hover:border-incluse-primary/30 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    userType === type
                      ? type === 'candidato' ? 'bg-incluse-secondary/20 text-incluse-secondary' : 
                        type === 'empresa' ? 'bg-incluse-primary/20 text-incluse-primary' :
                        'bg-incluse-accent/20 text-incluse-accent'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    {type === 'candidato' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {type === 'empresa' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H9m10 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v10M9 21h2m0 0h2" />
                      </svg>
                    )}
                    {type === 'administrador' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="font-medium">{getUserTypeTitle(type)}</h3>
                  <p className="text-xs mt-1 opacity-75">{getUserTypeDescription(type)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Formulário de login */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {userType === 'candidato' ? 'E-mail ou CPF' : userType === 'empresa' ? 'E-mail Corporativo ou CNPJ' : 'E-mail'}
              </label>
              <div className="mt-1">
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete={userType === 'empresa' ? 'organization' : 'email'}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                  placeholder={userType === 'candidato' ? 'seu@email.com ou 000.000.000-00' : userType === 'empresa' ? 'contato@empresa.com ou 00.000.000/0000-00' : 'seu@email.com'}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Mensagem de erro */}
            {erro && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 dark:text-red-300">{erro}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-incluse-primary to-incluse-accent hover:from-incluse-primary-dark hover:to-incluse-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-incluse-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </>
                ) : (
                  `Entrar como ${getUserTypeTitle(userType)}`
                )}
              </button>
            </div>
            {/* Criar novo usuário (empresa) */}
            {userType === 'empresa' && (
              <div className="mt-4 text-center">
                <Link
                  to="/cadastro/empresa-minima"
                  className="text-sm text-incluse-primary hover:underline"
                >
                  Criar novo usuário (empresa)
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}