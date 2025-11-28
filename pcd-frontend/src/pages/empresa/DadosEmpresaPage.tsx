import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/api';

interface EmpresaData {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone?: string;
  endereco?: string;
  areaAtuacao?: string;
  descricao?: string;
  logo?: string;
}

export default function DadosEmpresaPage() {
  const { id } = useParams<{ id: string }>();
  const empresaId = Number(id);
  const [empresa, setEmpresa] = useState<EmpresaData>({
    id: 0,
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    areaAtuacao: '',
    descricao: '',
    logo: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    async function carregarEmpresa() {
      try {
        const data = await api.getEmpresaPerfil();
        setEmpresa(data);
      } catch (error) {
        setErro('Erro ao carregar dados da empresa');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    carregarEmpresa();
  }, []);

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  // Auto-save com debounce
  useEffect(() => {
    if (!autoSave || !empresa.nome) return;
    
    const timeoutId = setTimeout(async () => {
      try {
        await api.atualizarEmpresaAutenticada(empresa);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Erro no auto-save:', error);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [empresa, autoSave, empresaId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cnpj') {
      setEmpresa(prev => ({ ...prev, [name]: formatCNPJ(value) }));
    } else if (name === 'telefone') {
      setEmpresa(prev => ({ ...prev, [name]: formatTelefone(value) }));
    } else {
      setEmpresa(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErro('Logo deve ter no máximo 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErro('Arquivo deve ser uma imagem');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setEmpresa(prev => ({ ...prev, logo: '' }));
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);
      await api.uploadLogoEmpresaAutenticada(formData);
      setEmpresa(prev => ({ ...prev, logo: logoPreview || '' }));
      setLogoFile(null);
    } catch (error) {
      setErro('Erro ao fazer upload do logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(false);

    // Validações
    if (!empresa.nome.trim()) {
      setErro('Nome da empresa é obrigatório');
      return;
    }

    const cnpjNumbers = empresa.cnpj.replace(/\D/g, '');
    if (cnpjNumbers.length !== 14) {
      setErro('CNPJ deve ter 14 dígitos');
      return;
    }

    if (!empresa.email.trim()) {
      setErro('E-mail é obrigatório');
      return;
    }

    setSaving(true);
    try {
      await api.atualizarEmpresaAutenticada(empresa);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch (error) {
      setErro('Erro ao salvar dados da empresa');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dados da Empresa</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Gerencie as informações do seu perfil empresarial</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo da Empresa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Logo da Empresa
            </label>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                  {logoPreview || empresa.logo ? (
                    <img 
                      src={logoPreview || empresa.logo} 
                      alt="Logo da empresa" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <label htmlFor="logo" className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Selecionar Logo
                  </label>
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="sr-only"
                  />
                  {logoFile && (
                    <button
                      type="button"
                      onClick={handleUploadLogo}
                      disabled={uploadingLogo}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {uploadingLogo ? 'Enviando...' : 'Salvar Logo'}
                    </button>
                  )}
                  {(logoPreview || empresa.logo) && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                    >
                      Remover
                    </button>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG até 2MB. Recomendado: 200x200px
                </p>
              </div>
            </div>
          </div>
          {/* Nome da Empresa */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome da Empresa *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={empresa.nome}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          {/* CNPJ */}
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              CNPJ *
            </label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={empresa.cnpj}
              onChange={handleInputChange}
              maxLength={18}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="00.000.000/0000-00"
              required
            />
          </div>

          {/* E-mail */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              E-mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={empresa.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          {/* Telefone */}
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Telefone
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={empresa.telefone || ''}
              onChange={handleInputChange}
              maxLength={15}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="(00) 00000-0000"
            />
          </div>

          {/* Endereço */}
          <div>
            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Endereço
            </label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              value={empresa.endereco || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Rua, número, bairro, cidade - UF"
            />
          </div>

          {/* Área de Atuação */}
          <div>
            <label htmlFor="areaAtuacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Área de Atuação
            </label>
            <select
              id="areaAtuacao"
              name="areaAtuacao"
              value={empresa.areaAtuacao || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Selecione uma área</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Saúde">Saúde</option>
              <option value="Educação">Educação</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Varejo">Varejo</option>
              <option value="Indústria">Indústria</option>
              <option value="Serviços">Serviços</option>
              <option value="Consultoria">Consultoria</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          {/* Descrição da Empresa */}
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição da Empresa
            </label>
            <textarea
              id="descricao"
              name="descricao"
              rows={4}
              value={empresa.descricao || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Descreva sua empresa, missão, valores e compromisso com a inclusão..."
            />
          </div>

          {/* Mensagens de Erro e Sucesso */}
          {erro && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 dark:text-red-300">{erro}</p>
              </div>
            </div>
          )}

          {sucesso && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-700 dark:text-green-300">Dados salvos com sucesso!</p>
              </div>
            </div>
          )}

          {/* Configurações de Auto-save */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Salvar automaticamente</span>
                </label>
                {lastSaved && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Último salvamento: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {autoSave ? 'Salvamento automático ativado' : 'Lembre-se de salvar suas alterações'}
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}