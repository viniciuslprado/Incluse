import { useState, useEffect } from 'react';
import { FaRegFileAlt, FaGraduationCap, FaGift, FaClipboardList, FaWheelchair, FaRocket, FaLightbulb } from 'react-icons/fa';
import CustomSelect from '../../components/common/CustomSelect';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

interface VagaData {
  // Seção 1 - Dados básicos
  titulo: string;
  tipo: string;
  modelo: string;
  cidade: string;
  estado: string;
  areaId: number | '';
  exigeMudanca: boolean;
  exigeViagens: boolean;
  
  // Seção 2 - Descrição
  resumo: string;
  atividades: string;
  jornadaHoras: string;
  jornadaPeriodo: string;
  salario: string;
  
  // Seção 3 - Requisitos
  formacao: string;
  experiencia: string;
  competencias: string[];
  habilidades: string[];
  
  // Seção 4 - Benefícios
  beneficios: string[];
  
  // Seção 5 - Processo seletivo
  etapas: string[];
  
  // Seção 6 - Acessibilidade
  barreiras: number[];
  recursos: string[];
  adaptacoes: string;
}

export default function NovaVagaPage() {
  const { id } = useParams<{ id: string }>();
  const empresaId = Number(id);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [areasFormacao, setAreasFormacao] = useState<Array<{ id: number; nome: string }>>([]);
  const [acessibilidadesDisponiveis, setAcessibilidadesDisponiveis] = useState<Array<{ id: number; descricao: string }>>([]);

  // Verificar autenticação ao carregar a página
  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Você precisa estar logado para acessar esta página');
      navigate('/login');
      return;
    }

    if (userType !== 'empresa') {
      alert(`Acesso negado. Esta área é exclusiva para empresas.\n\nVocê está logado como: ${userType}\n\nPor favor, faça logout e login com uma conta de empresa.`);
      navigate('/');
      return;
    }

    if (Number(userId) !== empresaId) {
      alert(`Acesso negado. Você não tem permissão para acessar esta empresa.\n\nSua empresa: ${userId}\nEmpresa solicitada: ${empresaId}`);
      navigate(`/empresa/${userId}/dashboard`);
      return;
    }
  }, [empresaId, navigate]);

  const [vagaData, setVagaData] = useState<VagaData>({
    titulo: '',
    tipo: '',
    modelo: '',
    cidade: '',
    estado: '',
    areaId: '',
    exigeMudanca: false,
    exigeViagens: false,
    resumo: '',
    atividades: '',
    jornadaHoras: '',
    jornadaPeriodo: 'semanal',
    salario: '',
    formacao: '',
    experiencia: '',
    competencias: [],
    habilidades: [],
    beneficios: [],
    etapas: ['Análise de currículo', 'Entrevista'],
    barreiras: [],
    recursos: [],
    adaptacoes: ''
  });

  // Carregar áreas de formação e acessibilidades ao montar o componente
  useEffect(() => {
    async function carregarDados() {
      try {
        const [areas, acessibilidades] = await Promise.all([
          api.listarAreasFormacao(),
          api.listarAcessibilidadesPublicas()
        ]);
        setAreasFormacao(areas);
        setAcessibilidadesDisponiveis(acessibilidades);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
    carregarDados();
  }, []);

  const steps = [
    { id: 1, name: 'Dados Básicos', icon: <FaRegFileAlt /> },
    { id: 2, name: 'Descrição', icon: <FaRegFileAlt /> },
    { id: 3, name: 'Requisitos', icon: <FaGraduationCap /> },
    { id: 4, name: 'Benefícios', icon: <FaGift /> },
    { id: 5, name: 'Processo Seletivo', icon: <FaClipboardList /> },
    { id: 6, name: 'Acessibilidade', icon: <FaWheelchair /> },
    { id: 7, name: 'Publicação', icon: <FaRocket /> }
  ];

  const handleInputChange = (field: keyof VagaData, value: any) => {
    setVagaData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: keyof VagaData, value: string) => {
    if (!value.trim()) return;
    setVagaData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()]
    }));
  };

  const removeFromArray = (field: keyof VagaData, index: number) => {
    setVagaData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


  const handlePublish = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      const userId = localStorage.getItem('userId');
      
      if (!token) {
        setErro('Você precisa estar logado como empresa para criar vagas');
        setSaving(false);
        return;
      }
      
      if (userType !== 'empresa') {
        setErro(`Apenas empresas podem criar vagas. Tipo atual: ${userType}`);
        setSaving(false);
        return;
      }
      
      if (Number(userId) !== empresaId) {
        setErro(`ID da empresa não corresponde. URL: ${empresaId}, Usuário: ${userId}`);
        setSaving(false);
        return;
      }
      
      const localizacao = vagaData.cidade && vagaData.estado 
        ? `${vagaData.cidade} - ${vagaData.estado}` 
        : undefined;
      
      const jornada = vagaData.jornadaHoras 
        ? `${vagaData.jornadaHoras}h ${vagaData.jornadaPeriodo === 'semanal' ? 'semanais' : 'mensais'}`
        : undefined;
      
      // Converter nomes de recursos em IDs
      const acessibilidadeIds = vagaData.recursos
        .map(recursoNome => {
          const acess = acessibilidadesDisponiveis.find(a => a.descricao === recursoNome);
          return acess?.id;
        })
        .filter((id): id is number => id !== undefined);
      
      const payload = {
        empresaId,
        titulo: vagaData.titulo,
        tipoContratacao: vagaData.tipo || undefined,
        modeloTrabalho: vagaData.modelo || undefined,
        localizacao,
        cidade: vagaData.cidade || undefined,
        estado: vagaData.estado || undefined,
        areaId: vagaData.areaId || undefined, // mantido no payload, mas não exibe mensagem
        escolaridade: vagaData.formacao || undefined,
        exigeMudanca: vagaData.exigeMudanca,
        exigeViagens: vagaData.exigeViagens,
        requisitos: {
          formacao: vagaData.formacao || undefined,
          experiencia: vagaData.experiencia || undefined,
          competencias: vagaData.competencias,
          habilidadesTecnicas: vagaData.habilidades
        },
        descricao: {
          resumo: vagaData.resumo || undefined,
          atividades: vagaData.atividades || undefined,
          jornada,
          salarioMin: vagaData.salario ? Number(vagaData.salario.replace(/\D/g, '')) / 100 : undefined
        },
        beneficios: vagaData.beneficios,
        processos: vagaData.etapas.map((etapa, idx) => ({ etapa, ordem: idx + 1 })),
        acessibilidadeIds
      };
      
      console.log('📦 Payload da vaga:', payload);
      
      await api.criarVagaCompleta(payload);
      navigate(`/empresa/${empresaId}/gestao-vagas`);
    } catch (error) {
      console.error('❌ Erro completo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setErro(`Erro ao publicar vaga: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Dados Básicos da Vaga</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Título da Vaga *
              </label>
              <input
                type="text"
                value={vagaData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Ex: Desenvolvedor Frontend Sênior"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tipo de Contrato *
                </label>
                <CustomSelect
                  value={vagaData.tipo}
                  onChange={val => handleInputChange('tipo', val)}
                  options={[
                    { value: '', label: 'Selecione' },
                    { value: 'CLT', label: 'CLT' },
                    { value: 'PJ', label: 'PJ' },
                    { value: 'Estágio', label: 'Estágio' },
                    { value: 'Temporário', label: 'Temporário' },
                    { value: 'Freelancer', label: 'Freelancer' },
                  ]}
                  placeholder="Selecione"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Modelo de Trabalho *
                </label>
                <CustomSelect
                  value={vagaData.modelo}
                  onChange={val => handleInputChange('modelo', val)}
                  options={[
                    { value: '', label: 'Selecione' },
                    { value: 'Presencial', label: 'Presencial' },
                    { value: 'Remoto', label: 'Remoto' },
                    { value: 'Híbrido', label: 'Híbrido' },
                  ]}
                  placeholder="Selecione"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={vagaData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Ex: São Paulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estado (UF) *
                </label>
                <CustomSelect
                  value={vagaData.estado}
                  onChange={val => handleInputChange('estado', val)}
                  options={[
                    { value: '', label: 'Selecione' },
                    { value: 'AC', label: 'AC' },
                    { value: 'AL', label: 'AL' },
                    { value: 'AP', label: 'AP' },
                    { value: 'AM', label: 'AM' },
                    { value: 'BA', label: 'BA' },
                    { value: 'CE', label: 'CE' },
                    { value: 'DF', label: 'DF' },
                    { value: 'ES', label: 'ES' },
                    { value: 'GO', label: 'GO' },
                    { value: 'MA', label: 'MA' },
                    { value: 'MT', label: 'MT' },
                    { value: 'MS', label: 'MS' },
                    { value: 'MG', label: 'MG' },
                    { value: 'PA', label: 'PA' },
                    { value: 'PB', label: 'PB' },
                    { value: 'PR', label: 'PR' },
                    { value: 'PE', label: 'PE' },
                    { value: 'PI', label: 'PI' },
                    { value: 'RJ', label: 'RJ' },
                    { value: 'RN', label: 'RN' },
                    { value: 'RS', label: 'RS' },
                    { value: 'RO', label: 'RO' },
                    { value: 'RR', label: 'RR' },
                    { value: 'SC', label: 'SC' },
                    { value: 'SP', label: 'SP' },
                    { value: 'SE', label: 'SE' },
                    { value: 'TO', label: 'TO' },
                  ]}
                  placeholder="Selecione"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Área da Vaga *
              </label>
              <CustomSelect
                value={vagaData.areaId ? String(vagaData.areaId) : ''}
                onChange={val => handleInputChange('areaId', val ? Number(val) : '')}
                options={[
                  { value: '', label: 'Selecione' },
                  ...areasFormacao.map(area => ({ value: String(area.id), label: area.nome }))
                ]}
                placeholder="Selecione"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vagaData.exigeMudanca}
                    onChange={(e) => handleInputChange('exigeMudanca', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exige Mudança de Cidade
                  </span>
                </label>
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vagaData.exigeViagens}
                    onChange={(e) => handleInputChange('exigeViagens', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exige Viagens Frequentes
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Descrição da Vaga</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Resumo da Função
              </label>
              <textarea
                rows={3}
                value={vagaData.resumo}
                onChange={(e) => handleInputChange('resumo', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Descreva brevemente a função..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Atividades Principais
              </label>
              <textarea
                rows={4}
                value={vagaData.atividades}
                onChange={(e) => handleInputChange('atividades', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Liste as principais atividades que serão realizadas..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Jornada de Trabalho
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="220"
                    value={vagaData.jornadaHoras}
                    onChange={(e) => handleInputChange('jornadaHoras', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="40"
                  />
                  <select
                    value={vagaData.jornadaPeriodo}
                    onChange={(e) => handleInputChange('jornadaPeriodo', e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="semanal">horas/semana</option>
                    <option value="mensal">horas/mês</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Faixa Salarial (opcional)
                </label>
                <input
                  type="text"
                  value={vagaData.salario}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Remove tudo que não é número
                    const numeros = value.replace(/\D/g, '');
                    // Formata como moeda brasileira
                    if (numeros) {
                      const valorFormatado = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 2
                      }).format(Number(numeros) / 100);
                      handleInputChange('salario', valorFormatado);
                    } else {
                      handleInputChange('salario', '');
                    }
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="R$ 5.000,00"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Requisitos</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Formação Mínima *
              </label>
              <CustomSelect
                value={vagaData.formacao}
                onChange={val => handleInputChange('formacao', val)}
                options={[
                  { value: '', label: 'Selecione' },
                  { value: 'Ensino Fundamental Completo', label: 'Ensino Fundamental Completo' },
                  { value: 'Ensino Fundamental Incompleto', label: 'Ensino Fundamental Incompleto' },
                  { value: 'Ensino Médio Completo', label: 'Ensino Médio Completo' },
                  { value: 'Ensino Médio Incompleto', label: 'Ensino Médio Incompleto' },
                  { value: 'Ensino Superior Completo', label: 'Ensino Superior Completo' },
                  { value: 'Ensino Superior Incompleto', label: 'Ensino Superior Incompleto' },
                  { value: 'Técnico', label: 'Técnico' },
                  { value: 'Pós-graduação', label: 'Pós-graduação' },
                  { value: 'Mestrado', label: 'Mestrado' },
                  { value: 'Doutorado', label: 'Doutorado' },
                ]}
                placeholder="Selecione"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Experiência Necessária
              </label>
              <CustomSelect
                value={vagaData.experiencia}
                onChange={val => handleInputChange('experiencia', val)}
                options={[
                  { value: '', label: 'Selecione' },
                  { value: 'Sem experiência', label: 'Sem experiência' },
                  { value: '1 ano', label: '1 ano' },
                  { value: '2 anos', label: '2 anos' },
                  { value: '3 anos', label: '3 anos' },
                  { value: '5 anos', label: '5 anos' },
                  { value: 'Mais de 5 anos', label: 'Mais de 5 anos' },
                ]}
                placeholder="Selecione"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Competências Comportamentais
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="competencia-input"
                  placeholder="Ex: Trabalho em equipe"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      addToArray('competencias', input.value);
                      input.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('competencia-input') as HTMLInputElement;
                    addToArray('competencias', input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {vagaData.competencias.map((comp, idx) => (
                  <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {comp}
                    <button
                      type="button"
                      onClick={() => removeFromArray('competencias', idx)}
                      className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Habilidades Técnicas
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="habilidade-input"
                  placeholder="Ex: JavaScript, Python, Excel"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      addToArray('habilidades', input.value);
                      input.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('habilidade-input') as HTMLInputElement;
                    addToArray('habilidades', input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {vagaData.habilidades.map((hab, idx) => (
                  <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    {hab}
                    <button
                      type="button"
                      onClick={() => removeFromArray('habilidades', idx)}
                      className="ml-2 text-green-600 dark:text-green-300 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Benefícios</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Liste os benefícios oferecidos pela empresa
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adicionar Benefícios
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="beneficio-input"
                  placeholder="Ex: Vale alimentação, Plano de saúde"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      addToArray('beneficios', input.value);
                      input.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('beneficio-input') as HTMLInputElement;
                    addToArray('beneficios', input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {vagaData.beneficios.map((ben, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <span className="text-sm text-gray-900 dark:text-gray-100">{ben}</span>
                    <button
                      type="button"
                      onClick={() => removeFromArray('beneficios', idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remover
                    </button>
                  </div>
                ))}
                {vagaData.beneficios.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">Nenhum benefício adicionado ainda</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2"><FaLightbulb className="inline mr-1" /> Sugestões de Benefícios</h4>
              <div className="flex flex-wrap gap-2">
                {['Vale alimentação', 'Vale transporte', 'Plano de saúde', 'Plano odontológico', 'Gympass', 'Home office', 'Horário flexível', 'Day off aniversário'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={e => {
                      if (!vagaData.beneficios.includes(sug)) {
                        addToArray('beneficios', sug);
                      }
                      e.currentTarget.blur();
                    }}
                    className="px-3 py-1 text-xs bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Processo Seletivo</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Defina as etapas do processo seletivo
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Etapas do Processo
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="etapa-input"
                  placeholder="Ex: Entrevista com RH"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      addToArray('etapas', input.value);
                      input.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('etapa-input') as HTMLInputElement;
                    addToArray('etapas', input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {vagaData.etapas.map((etapa, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">{etapa}</span>
                    <button
                      type="button"
                      onClick={() => removeFromArray('etapas', idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2"><FaLightbulb className="inline mr-1" /> Etapas Comuns</h4>
              <div className="flex flex-wrap gap-2">
                {['Análise de currículo', 'Entrevista com RH', 'Teste técnico', 'Entrevista com gestor', 'Dinâmica de grupo', 'Proposta'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={e => {
                      if (!vagaData.etapas.includes(sug)) {
                        addToArray('etapas', sug);
                      }
                      e.currentTarget.blur();
                    }}
                    className="px-3 py-1 text-xs bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Acessibilidade</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Informe sobre recursos de acessibilidade e adaptações disponíveis
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recursos de Acessibilidade Disponíveis *
              </label>
              <div className="space-y-2">
                {vagaData.recursos.map((rec, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <span className="text-sm text-gray-900 dark:text-gray-100"><FaWheelchair className="inline mr-1" />{rec}</span>
                    <button
                      type="button"
                      onClick={() => removeFromArray('recursos', idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remover
                    </button>
                  </div>
                ))}
                {vagaData.recursos.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">Nenhum recurso adicionado ainda</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2"><FaWheelchair className="inline mr-1" /> Recursos Disponíveis</h4>
              <div className="flex flex-wrap gap-2">
                {acessibilidadesDisponiveis.map((acess) => (
                  <button
                    key={acess.id}
                    type="button"
                    onClick={e => {
                      if (!vagaData.recursos.includes(acess.descricao)) {
                        addToArray('recursos', acess.descricao);
                      }
                      e.currentTarget.blur();
                    }}
                    className="px-3 py-1 text-xs bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    + {acess.descricao}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Adaptações e Observações
              </label>
              <textarea
                rows={4}
                value={vagaData.adaptacoes}
                onChange={(e) => handleInputChange('adaptacoes', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Descreva quaisquer adaptações específicas que podem ser feitas para candidatos PCD..."
              />
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                    Compromisso com a Inclusão
                  </h3>
                  <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                    Ao detalhar os recursos de acessibilidade, você demonstra compromisso real com a inclusão e atrai candidatos qualificados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Revisão e Publicação</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Revise todas as informações antes de publicar a vaga
            </p>
            
            {/* Seção 1 - Dados Básicos */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h4 className="font-medium mb-4 text-blue-600 dark:text-blue-400"><FaRegFileAlt className="inline mr-1" /> Dados Básicos</h4>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Título *</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{vagaData.titulo || <span className="text-red-500 italic">Não informado</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo de Contrato *</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{vagaData.tipo || <span className="text-red-500 italic">Não informado</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Modelo de Trabalho *</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{vagaData.modelo || <span className="text-red-500 italic">Não informado</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Cidade *</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{vagaData.cidade || <span className="text-red-500 italic">Não informado</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado (UF) *</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{vagaData.estado || <span className="text-red-500 italic">Não informado</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Área da Vaga *</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{vagaData.area || <span className="text-red-500 italic">Não informado</span>}</dd>
                </div>
              </dl>
            </div>

            {/* Seção 2 - Descrição */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h4 className="font-medium mb-4 text-blue-600 dark:text-blue-400"><FaRegFileAlt className="inline mr-1" /> Descrição</h4>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Resumo da Função</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{vagaData.resumo || <span className="text-gray-400 italic">Não informado</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Atividades Principais</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line">{vagaData.atividades || <span className="text-gray-400 italic">Não informado</span>}</dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Jornada de Trabalho</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {vagaData.jornadaHoras ? `${vagaData.jornadaHoras}h ${vagaData.jornadaPeriodo === 'semanal' ? 'semanais' : 'mensais'}` : <span className="text-gray-400 italic">Não informado</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Faixa Salarial</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{vagaData.salario || <span className="text-gray-400 italic">Não informado</span>}</dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Seção 3 - Requisitos */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h4 className="font-medium mb-4 text-blue-600 dark:text-blue-400"><FaGraduationCap className="inline mr-1" /> Requisitos</h4>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Formação Mínima *</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{vagaData.formacao || <span className="text-red-500 italic">Não informado</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Experiência Necessária</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{vagaData.experiencia || <span className="text-gray-400 italic">Não informado</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Competências Comportamentais</dt>
                  <dd className="mt-1">
                    {vagaData.competencias.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {vagaData.competencias.map((comp, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                            {comp}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Nenhuma competência adicionada</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Habilidades Técnicas</dt>
                  <dd className="mt-1">
                    {vagaData.habilidades.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {vagaData.habilidades.map((hab, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                            {hab}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Nenhuma habilidade adicionada</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Seção 4 - Benefícios */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h4 className="font-medium mb-4 text-blue-600 dark:text-blue-400"><FaGift className="inline mr-1" /> Benefícios</h4>
              {vagaData.beneficios.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {vagaData.beneficios.map((ben, idx) => (
                    <li key={idx} className="text-sm text-gray-900 dark:text-gray-100">{ben}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">Nenhum benefício adicionado</p>
              )}
            </div>

            {/* Seção 5 - Processo Seletivo */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h4 className="font-medium mb-4 text-blue-600 dark:text-blue-400"><FaClipboardList className="inline mr-1" /> Processo Seletivo</h4>
              {vagaData.etapas.length > 0 ? (
                <ol className="space-y-2">
                  {vagaData.etapas.map((etapa, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-medium">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">{etapa}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-gray-400 italic">Nenhuma etapa definida</p>
              )}
            </div>

            {/* Seção 6 - Acessibilidade */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h4 className="font-medium mb-4 text-blue-600 dark:text-blue-400"><FaWheelchair className="inline mr-1" /> Acessibilidade</h4>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Recursos de Acessibilidade *</dt>
                  <dd className="mt-1">
                    {vagaData.recursos.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {vagaData.recursos.map((rec, idx) => (
                          <li key={idx} className="text-sm text-gray-900 dark:text-gray-100"><FaWheelchair className="inline mr-1" />{rec}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-red-500 italic">Nenhum recurso adicionado</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Adaptações e Observações</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line">
                    {vagaData.adaptacoes || <span className="text-gray-400 italic">Não informado</span>}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Antes de publicar
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    Revise todas as informações. Campos obrigatórios (*) devem estar preenchidos. Após a publicação, a vaga ficará visível para candidatos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Nova Vaga</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Crie uma nova vaga seguindo o processo guiado</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 overflow-x-auto">
        <nav aria-label="Progress">
          <ol className="flex items-center gap-2 min-w-max">
            {steps.map((step, stepIdx) => (
              <li key={step.id} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    step.id < currentStep ? 'bg-blue-600' :
                    step.id === currentStep ? 'bg-blue-600 ring-4 ring-blue-200 dark:ring-blue-900' : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    <span className="text-white text-lg">{step.icon}</span>
                  </div>
                  <span className={`text-xs font-medium text-center whitespace-nowrap transition-colors ${
                    step.id <= currentStep ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div className={`h-0.5 w-8 mx-2 transition-colors ${
                    step.id < currentStep ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {renderStep()}

        {erro && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-700 dark:text-red-300">{erro}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <div className="flex space-x-3">

            {currentStep === 7 ? (
              <button
                type="button"
                onClick={handlePublish}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Publicando...' : 'Publicar Vaga'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Próximo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}