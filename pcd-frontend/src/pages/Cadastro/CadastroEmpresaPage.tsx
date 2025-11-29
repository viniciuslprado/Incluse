import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import PasswordInput from '../../components/PasswordInput';
import CepInput from '../../components/CepInput';

export default function CadastroEmpresaPage() {
  const [formData, setFormData] = useState({
    nomeContato: '',
    nomeEmpresa: '',
    cnpj: '',
    email: '',
    telefone: '',
    quantidadeFuncionarios: '',
    cargo: '',
    senha: '',
    confirmarSenha: '',
    // Endereço
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const opcoesQuantidadeFuncionarios = [
    { value: '1-10', label: '1 a 10 funcionários' },
    { value: '11-50', label: '11 a 50 funcionários' },
    { value: '51-200', label: '51 a 200 funcionários' },
    { value: '201-1000', label: '201 a 1000 funcionários' },
    { value: '1000+', label: 'Mais de 1000 funcionários' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressFound = (address: { cidade: string; estado: string; bairro: string; logradouro: string; cep: string }) => {
    setFormData(prev => ({
      ...prev,
      cep: address.cep,
      cidade: address.cidade,
      estado: address.estado,
      bairro: address.bairro,
      rua: address.logradouro
    }));
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData(prev => ({ ...prev, cnpj: formatted }));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    // Validações
    if (!formData.nomeContato.trim()) {
      setErro('Nome do contato é obrigatório.');
      return;
    }

    if (!formData.nomeEmpresa.trim()) {
      setErro('Nome da empresa é obrigatório.');
      return;
    }

    if (formData.cnpj.replace(/\D/g, '').length !== 14) {
      setErro('CNPJ deve ter 14 dígitos.');
      return;
    }

    if (!formData.email.trim()) {
      setErro('E-mail é obrigatório.');
      return;
    }

    if (!formData.telefone.trim()) {
      setErro('Telefone é obrigatório.');
      return;
    }

    if (!formData.quantidadeFuncionarios) {
      setErro('Selecione a quantidade de funcionários.');
      return;
    }

    if (!formData.cargo.trim()) {
      setErro('Cargo é obrigatório.');
      return;
    }

    if (formData.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não conferem.');
      return;
    }


    setLoading(true);
    try {
      // Verificação de CNPJ duplicado
      const cnpjLimpo = formData.cnpj.replace(/\D/g, '');
      const cnpjExists = await api.checkCnpjExists(cnpjLimpo);
      if (cnpjExists) {
        setErro('CNPJ já cadastrado.');
        setLoading(false);
        return;
      }
      const payload = {
        nome: formData.nomeEmpresa,
        cnpj: formData.cnpj,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha,
      };
      await api.registerEmpresa(payload);
      navigate('/login');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErro(msg || 'Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Cadastro de Empresa
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
              Fazer login
            </Link>
          </p>
        </div>

  <div className="bg-white dark:bg-transparent py-8 px-6 shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Contato */}
            <div>
              <label htmlFor="nomeContato" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome do Contato *
              </label>
              <input
                type="text"
                name="nomeContato"
                id="nomeContato"
                required
                value={formData.nomeContato}
                onChange={handleInputChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                placeholder="Nome da pessoa responsável"
                disabled={loading}
              />
            </div>

            {/* Nome da Empresa */}
            <div>
              <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome da Empresa *
              </label>
              <input
                type="text"
                name="nomeEmpresa"
                id="nomeEmpresa"
                required
                value={formData.nomeEmpresa}
                onChange={handleInputChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                placeholder="Razão social ou nome fantasia"
                disabled={loading}
              />
            </div>

            {/* CNPJ */}
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                CNPJ *
              </label>
              <input
                type="text"
                name="cnpj"
                id="cnpj"
                required
                value={formData.cnpj}
                onChange={handleCNPJChange}
                maxLength={18}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                placeholder="00.000.000/0000-00"
                disabled={loading}
              />
            </div>

            {/* E-mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                E-mail Corporativo *
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                placeholder="contato@empresa.com"
                disabled={loading}
              />
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Telefone/Celular *
              </label>
              <input
                type="tel"
                name="telefone"
                id="telefone"
                required
                value={formData.telefone}
                onChange={handleTelefoneChange}
                maxLength={15}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                placeholder="(00) 00000-0000"
                disabled={loading}
              />
            </div>

            {/* Quantidade de Funcionários */}
            <div>
              <label htmlFor="quantidadeFuncionarios" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantidade de Funcionários *
              </label>
              <select
                name="quantidadeFuncionarios"
                id="quantidadeFuncionarios"
                required
                value={formData.quantidadeFuncionarios}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                disabled={loading}
              >
                <option value="">Selecione...</option>
                {opcoesQuantidadeFuncionarios.map((opcao) => (
                  <option key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Cargo */}
            <div>
              <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Seu Cargo na Empresa *
              </label>
              <input
                type="text"
                name="cargo"
                id="cargo"
                required
                value={formData.cargo}
                onChange={handleInputChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                placeholder="Ex: Gerente de RH, CEO, Analista de Recrutamento"
                disabled={loading}
              />
            </div>

            {/* Endereço */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Endereço da Empresa (Opcional)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CEP */}
                <div>
                  <CepInput 
                    onAddressFound={handleAddressFound}
                    value={formData.cep}
                    onChange={(value) => setFormData(prev => ({ ...prev, cep: value }))}
                  />
                </div>
                
                <div></div> {/* Espaço vazio */}
                
                {/* Rua */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rua/Logradouro
                  </label>
                  <input
                    type="text"
                    value={formData.rua}
                    onChange={(e) => setFormData(prev => ({ ...prev, rua: e.target.value }))}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                    placeholder="Nome da rua"
                    disabled={loading}
                  />
                </div>
                
                {/* Número */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Número
                  </label>
                  <input
                    type="text"
                    value={formData.numero}
                    onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                    placeholder="123"
                    disabled={loading}
                  />
                </div>
                
                {/* Bairro */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={formData.bairro}
                    onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                    placeholder="Nome do bairro"
                    disabled={loading}
                  />
                </div>
                
                {/* Cidade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                    placeholder="Nome da cidade"
                    disabled={loading}
                  />
                </div>
                
                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={formData.estado}
                    onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                    placeholder="SP, RJ, MG..."
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Senha */}
            <PasswordInput
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
              label="Senha *"
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Confirmar Senha */}
            <PasswordInput
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleInputChange}
              label="Confirmar Senha *"
              placeholder="Digite a senha novamente"
              required
              autoComplete="new-password"
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Card de informações importantes removido conforme solicitado */}

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

            {/* Botão de submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando para análise...
                  </>
                ) : (
                  'Criar Conta Empresa'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/cadastro" 
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ← Voltar para seleção de tipo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}