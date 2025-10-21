import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function CadastroEmpresaMinima() {
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCnpj(formatCNPJ(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!nomeEmpresa.trim() || !email.trim() || !senha.trim() || cnpj.replace(/\D/g, '').length !== 14) {
      setErro('Preencha todos os campos corretamente.');
      return;
    }

    setLoading(true);
    try {
      // TODO: chamar API de cadastro de empresa
      console.log('Cadastro mínima empresa', { nomeEmpresa, cnpj, email, senha });
      await new Promise((r) => setTimeout(r, 1000));
      alert('Cadastro enviado para análise. Verifique seu e-mail.');
      navigate('/login');
    } catch {
      setErro('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Cadastro Rápido - Empresa</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Já tem conta? <Link to="/login" className="text-incluse-primary hover:underline">Fazer login</Link>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Empresa *</label>
              <input
                value={nomeEmpresa}
                onChange={(e) => setNomeEmpresa(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Nome ou razão social"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CNPJ *</label>
              <input
                value={cnpj}
                onChange={handleCNPJChange}
                maxLength={18}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail (usuário) *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="contato@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha *</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {erro && <p className="text-sm text-red-600">{erro}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-incluse-primary text-white rounded-md hover:bg-incluse-primary-dark disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Criar Conta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
