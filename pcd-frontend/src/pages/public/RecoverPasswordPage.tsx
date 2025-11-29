import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import PasswordInput from '../../components/PasswordInput';

type Step = 'request' | 'reset';

export default function RecoverPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<Step>('request');
  const [identifier, setIdentifier] = useState(''); // email or CPF
  const [token, setToken] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    try {
      const s: any = (location && (location.state as any)) || {};
      if (s.identifier) setIdentifier(String(s.identifier));
      const q = new URLSearchParams(location.search);
      const qId = q.get('identifier');
      const qToken = q.get('token');
      if (qId) setIdentifier(qId);
      if (qToken) {
        setToken(qToken);
        setStep('reset');
      }
    } catch (e) {
      // ignore
    }
  }, [location]);

  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!identifier.trim()) {
      setError('Informe seu e-mail ou CPF.');
      return;
    }
    setLoading(true);
    try {
      await api.requestPasswordReset(identifier.trim());
      setMessage('Se o e-mail/CPF estiver cadastrado, você receberá instruções por e-mail em breve.');
    } catch (err: any) {
      const m = err instanceof Error ? err.message : String(err);
      setError('Não foi possível solicitar a redefinição. Entre em contato com o suporte.');
      console.warn('Password reset API failed:', m);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (!token.trim()) {
      setError('Token inválido.');
      return;
    }
    if (novaSenha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setError('As senhas não conferem.');
      return;
    }

    setLoading(true);
    try {
      // Chamar POST /auth/reset { token, senha }
      await fetch('http://localhost:3000/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, senha: novaSenha })
      }).then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Erro ao redefinir senha');
        }
        return res.json();
      });
      setMessage('Senha redefinida com sucesso! Você já pode fazer login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Token inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          {step === 'request' ? 'Recuperar Senha' : 'Redefinir Senha'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {step === 'request' 
            ? 'Digite seu e-mail ou CPF para receber instruções'
            : 'Digite sua nova senha'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-sm text-green-800 dark:text-green-200">{message}</p>
                </div>
              </div>
              <div className="flex justify-center">
                <Link to="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  Ir para login
                </Link>
              </div>
            </div>
          ) : step === 'request' ? (
            <form onSubmit={handleRequestReset} className="space-y-6">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-mail ou CPF
                </label>
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="seu@email.com ou 000.000.000-00"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="ml-3 text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Link to="/login" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                  Voltar para login
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('reset')}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Já tenho um código de recuperação
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Código de Recuperação
                </label>
                <input
                  id="token"
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cole o código recebido por e-mail"
                  disabled={loading}
                />
              </div>

              <PasswordInput
                id="novaSenha"
                name="novaSenha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                label="Nova Senha"
                placeholder="Mínimo 6 caracteres"
                required
                autoComplete="new-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              <PasswordInput
                id="confirmarSenha"
                name="confirmarSenha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                label="Confirmar Nova Senha"
                placeholder="Digite a senha novamente"
                required
                autoComplete="new-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="ml-3 text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
                >
                  Solicitar novo código
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Redefinindo...' : 'Redefinir Senha'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
