import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { TipoComSubtipos } from '../types';

export default function CadastroCandidatoPage() {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    telefone: '',
    tipoDeficiencia: '',
    outraDeficiencia: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const [checkboxes, setCheckboxes] = useState({
    declaracaoPCD: false,
    politicaPrivacidade: false,
  });

  const [tiposDeficiencia, setTiposDeficiencia] = useState<TipoComSubtipos[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [loadingTipos, setLoadingTipos] = useState(true);

  // Carregar tipos de deficiência
  useEffect(() => {
    async function carregarTipos() {
      try {
        const tipos = await api.listarTiposComSubtipos();
        setTiposDeficiencia(tipos);
      } catch (error) {
        console.error('Erro ao carregar tipos:', error);
      } finally {
        setLoadingTipos(false);
      }
    }
    carregarTipos();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCheckboxes(prev => ({ ...prev, [name]: checked }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    // Validações
    if (!formData.nomeCompleto.trim()) {
      setErro('Nome completo é obrigatório.');
      return;
    }

    if (formData.cpf.replace(/\D/g, '').length !== 11) {
      setErro('CPF deve ter 11 dígitos.');
      return;
    }

    if (!formData.telefone.trim()) {
      setErro('Telefone é obrigatório.');
      return;
    }

    if (!formData.tipoDeficiencia && !formData.outraDeficiencia.trim()) {
      setErro('Selecione ou digite o tipo de deficiência.');
      return;
    }

    if (!formData.email.trim()) {
      setErro('E-mail é obrigatório.');
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

    if (!checkboxes.declaracaoPCD) {
      setErro('Você deve declarar que é uma pessoa com deficiência.');
      return;
    }

    if (!checkboxes.politicaPrivacidade) {
      setErro('Você deve concordar com a política de privacidade.');
      return;
    }

    setLoading(true);
    try {
      // Aqui será implementada a lógica de cadastro
      console.log('Cadastro candidato:', formData, checkboxes);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Cadastro realizado com sucesso! Verifique seu e-mail.');
    } catch (error) {
      setErro('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Cadastro de Candidato
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
              Fazer login
            </Link>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome Completo */}
            <div>
              <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome Completo *
              </label>
              <input
                type="text"
                name="nomeCompleto"
                id="nomeCompleto"
                required
                value={formData.nomeCompleto}
                onChange={handleInputChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                placeholder="Seu nome completo"
                disabled={loading}
              />
            </div>

            {/* CPF */}
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                CPF *
              </label>
              <input
                type="text"
                name="cpf"
                id="cpf"
                required
                value={formData.cpf}
                onChange={handleCPFChange}
                maxLength={14}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                placeholder="000.000.000-00"
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

            {/* Tipo de Deficiência */}
            <div>
              <label htmlFor="tipoDeficiencia" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de Deficiência *
              </label>
              <select
                name="tipoDeficiencia"
                id="tipoDeficiencia"
                value={formData.tipoDeficiencia}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                disabled={loading || loadingTipos}
              >
                <option value="">Selecione...</option>
                {tiposDeficiencia.map((tipo) => (
                  <optgroup key={tipo.id} label={tipo.nome}>
                    {tipo.subtipos?.map((subtipo) => (
                      <option key={subtipo.id} value={subtipo.id}>
                        {subtipo.nome}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value="outra">Outra (especifique abaixo)</option>
              </select>
            </div>

            {/* Campo para "Outra" deficiência */}
            {formData.tipoDeficiencia === 'outra' && (
              <div>
                <label htmlFor="outraDeficiencia" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Especifique sua deficiência *
                </label>
                <input
                  type="text"
                  name="outraDeficiencia"
                  id="outraDeficiencia"
                  value={formData.outraDeficiencia}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                  placeholder="Descreva sua deficiência"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Esta informação será analisada pelos administradores
                </p>
              </div>
            )}

            {/* E-mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                E-mail *
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Senha *
              </label>
              <input
                type="password"
                name="senha"
                id="senha"
                required
                value={formData.senha}
                onChange={handleInputChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar Senha *
              </label>
              <input
                type="password"
                name="confirmarSenha"
                id="confirmarSenha"
                required
                value={formData.confirmarSenha}
                onChange={handleInputChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                placeholder="Digite a senha novamente"
                disabled={loading}
              />
            </div>

            {/* Declarações obrigatórias */}
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="declaracaoPCD"
                    name="declaracaoPCD"
                    type="checkbox"
                    checked={checkboxes.declaracaoPCD}
                    onChange={handleCheckboxChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                    disabled={loading}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="declaracaoPCD" className="text-gray-700 dark:text-gray-300">
                    Declaro que sou uma pessoa com deficiência ou reabilitado pelo INSS nos termos da legislação brasileira. *
                  </label>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="politicaPrivacidade"
                    name="politicaPrivacidade"
                    type="checkbox"
                    checked={checkboxes.politicaPrivacidade}
                    onChange={handleCheckboxChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                    disabled={loading}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="politicaPrivacidade" className="text-gray-700 dark:text-gray-300">
                    Declaro que li e concordo com a{' '}
                    <Link to="/politica-privacidade" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank">
                      política de privacidade
                    </Link>
                    . *
                  </label>
                </div>
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

            {/* Botão de submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Criando conta...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}