
import { useState, useEffect } from 'react';
import { FaWheelchair } from 'react-icons/fa';
import { FaEarListen, FaEye, FaBrain, FaPuzzlePiece, FaRegCommentDots } from 'react-icons/fa6';
import CustomSelect from '../../components/common/CustomSelect';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { FiAlertCircle, FiSave, FiX } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa';

interface VagaData {
  id?: number;
  titulo: string;
  tipo: string;
  modelo: string;
  cidade: string;
  estado: string;
  areaId: number | '';
  exigeMudanca: boolean;
  exigeViagens: boolean;
  resumo: string;
  atividades: string;
  jornadaHoras: string;
  jornadaPeriodo: string;
  salario: string;
  formacao: string;
  experiencia: string;
  competencias: string[];
  habilidades: string[];
  beneficios: string[];
  etapas: string[];
  recursos: string[];
  adaptacoes: string;
}


export default function EditarVagaPage() {
  const { id, vagaId } = useParams<{ id: string; vagaId: string }>();
  const empresaId = Number(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [areasFormacao, setAreasFormacao] = useState<Array<{ id: number; nome: string }>>([]);
  const [acessibilidadesDisponiveis, setAcessibilidadesDisponiveis] = useState<Array<{ id: number; descricao: string }>>([]);
  const [vagaData, setVagaData] = useState<VagaData | null>(null);

  // Carregar dados da vaga e listas auxiliares
  useEffect(() => {
    async function carregarTudo() {
      try {
        const [vaga, areas, acessibilidades] = await Promise.all([
          api.obterVaga(Number(vagaId)),
          api.listarAreasFormacao(),
          api.listarAcessibilidadesPublicas()
        ]);
        setAreasFormacao(areas);
        setAcessibilidadesDisponiveis(acessibilidades);
        // Função para garantir array de strings
        const toStringArray = (arr: any[]) =>
          Array.isArray(arr)
            ? arr.map((item: any) =>
                typeof item === 'string'
                  ? item
                  : item && typeof item === 'object' && 'descricao' in item
                  ? String(item.descricao)
                  : JSON.stringify(item)
              )
            : [];

        setVagaData({
          id: vaga.id,
          titulo: vaga.titulo || '',
          tipo: vaga.tipo || '',
          modelo: vaga.modelo || '',
          cidade: vaga.cidade || '',
          estado: vaga.estado || '',
          areaId: vaga.areaId || '',
          exigeMudanca: vaga.exigeMudanca || false,
          exigeViagens: vaga.exigeViagens || false,
          resumo: vaga.resumo || '',
          atividades: vaga.atividades || '',
          jornadaHoras: vaga.jornadaHoras || '',
          jornadaPeriodo: vaga.jornadaPeriodo || 'semanal',
          salario: vaga.salario || '',
          formacao: vaga.formacao || '',
          experiencia: vaga.experiencia || '',
          competencias: toStringArray(vaga.competencias),
          habilidades: toStringArray(vaga.habilidades),
          beneficios: toStringArray(vaga.beneficios),
          etapas: toStringArray(vaga.etapas.length ? vaga.etapas : ['Análise de currículo', 'Entrevista']),
          recursos: toStringArray(vaga.recursos),
          adaptacoes: vaga.adaptacoes || ''
        });
      } catch (error: any) {
        setErro('Erro ao carregar dados da vaga.');
      } finally {
        setLoading(false);
      }
    }
    carregarTudo();
  }, [vagaId]);

  const handleInputChange = (field: keyof VagaData, value: any) => {
    if (!vagaData) return;
    setVagaData(prev => prev ? { ...prev, [field]: value } : prev);
  };

  // Always sanitize to only strings
  const addToArray = (field: keyof VagaData, value: string) => {
    if (!vagaData || !value.trim()) return;
    setVagaData(prev => {
      if (!prev) return prev;
      const arr = Array.isArray(prev[field]) ? (prev[field] as any[]).map(v => typeof v === 'string' ? v : (v?.descricao ? String(v.descricao) : JSON.stringify(v))) : [];
      return { ...prev, [field]: [...arr, value.trim()] };
    });
  };

  const removeFromArray = (field: keyof VagaData, index: number) => {
    if (!vagaData) return;
    setVagaData(prev => {
      if (!prev) return prev;
      const arr = Array.isArray(prev[field]) ? (prev[field] as any[]).map(v => typeof v === 'string' ? v : (v?.descricao ? String(v.descricao) : JSON.stringify(v))) : [];
      return { ...prev, [field]: arr.filter((_, i) => i !== index) };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(false);
    if (!vagaData) return;
    // Validação básica
    if (!vagaData.titulo || !vagaData.tipo || !vagaData.modelo || !vagaData.cidade || !vagaData.estado || !vagaData.areaId || !vagaData.formacao || vagaData.recursos.length === 0) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    setSaving(true);
    try {
      await api.criarVagaCompleta({ ...vagaData, empresaId });
      setSucesso(true);
    } catch (error: any) {
      setErro('Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !vagaData) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <>
        <h1 className="text-2xl font-bold mb-6">Editar Vaga</h1>
        {erro && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-center gap-2">
            <FiAlertCircle />
            <span>{erro}</span>
          </div>
        )}
        {sucesso && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded flex items-center gap-2">
            <FaCheck />
            <span>Alterações salvas com sucesso!</span>
          </div>
        )}
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Seção 1 - Dados Básicos */}
          <div className="space-y-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium">Dados Básicos</h3>
            <div>
              <label className="block text-sm font-medium">Título *</label>
              <input type="text" value={vagaData.titulo} onChange={e => handleInputChange('titulo', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium">Tipo de Contrato *</label>
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
                <label className="block text-sm font-medium">Modelo de Trabalho *</label>
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
                <label className="block text-sm font-medium">Cidade *</label>
                <input type="text" value={vagaData.cidade} onChange={e => handleInputChange('cidade', e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Estado (UF) *</label>
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
              <label className="block text-sm font-medium">Área da Vaga *</label>
              <CustomSelect
                value={vagaData.areaId ? String(vagaData.areaId) : ''}
                onChange={val => handleInputChange('areaId', val ? Number(val) : '')}
                options={[
                  { value: '', label: 'Selecione' },
                  ...areasFormacao.map(area => ({ value: String(area.id), label: String(area.nome) }))
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
                    onChange={e => handleInputChange('exigeMudanca', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Exige Mudança de Cidade</span>
                </label>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vagaData.exigeViagens}
                    onChange={e => handleInputChange('exigeViagens', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Exige Viagens Frequentes</span>
                </label>
              </div>
            </div>
          </div>
          {/* Seção 2 - Descrição */}
          <div className="space-y-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium">Descrição da Vaga</h3>
            <div>
              <label className="block text-sm font-medium">Resumo da Função</label>
              <textarea rows={3} value={vagaData.resumo} onChange={e => handleInputChange('resumo', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Atividades Principais</label>
              <textarea rows={4} value={vagaData.atividades} onChange={e => handleInputChange('atividades', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium">Jornada de Trabalho</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="220"
                    value={vagaData.jornadaHoras}
                    onChange={e => handleInputChange('jornadaHoras', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md"
                    placeholder="40"
                  />
                  <select
                    value={vagaData.jornadaPeriodo}
                    onChange={e => handleInputChange('jornadaPeriodo', e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="semanal">horas/semana</option>
                    <option value="mensal">horas/mês</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Faixa Salarial (opcional)</label>
                <input
                  type="text"
                  value={vagaData.salario}
                  onChange={e => {
                    const value = e.target.value;
                    const numeros = value.replace(/\D/g, '');
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
                  className="w-full border rounded px-3 py-2"
                  placeholder="R$ 5.000,00"
                />
              </div>
            </div>
          </div>
          {/* Seção 3 - Requisitos */}
          <div className="space-y-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium">Requisitos</h3>
            <div>
              <label className="block text-sm font-medium">Formação Mínima *</label>
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
              <label className="block text-sm font-medium">Experiência Necessária</label>
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
              <label className="block text-sm font-medium mb-2">Competências Comportamentais</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="competencia-input"
                  placeholder="Ex: Trabalho em equipe"
                  className="flex-1 px-3 py-2 border rounded-md"
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget as HTMLInputElement;
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
                >Adicionar</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {vagaData.competencias.map((comp, idx) => {
                  const compStr = typeof comp === 'string' ? comp : JSON.stringify(comp);
                  return (
                    <span key={compStr + '-' + idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {compStr}
                      <button type="button" onClick={() => removeFromArray('competencias', idx)} className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                    </span>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Habilidades Técnicas</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="habilidade-input"
                  placeholder="Ex: JavaScript, Python, Excel"
                  className="flex-1 px-3 py-2 border rounded-md"
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget as HTMLInputElement;
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
                >Adicionar</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {vagaData.habilidades.map((hab, idx) => {
                  const habStr = typeof hab === 'string' ? hab : JSON.stringify(hab);
                  return (
                    <span key={habStr + '-' + idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      {habStr}
                      <button type="button" onClick={() => removeFromArray('habilidades', idx)} className="ml-2 text-green-600 hover:text-green-800">×</button>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Seção 4 - Benefícios */}
          <div className="space-y-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium">Benefícios</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Selecione os benefícios oferecidos:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {['Vale alimentação', 'Vale transporte', 'Plano de saúde', 'Plano odontológico', 'Gympass', 'Home office', 'Horário flexível', 'Day off aniversário'].map((sug) => (
                  <label key={sug} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vagaData.beneficios.includes(sug)}
                      onChange={e => {
                        if (e.target.checked) {
                          addToArray('beneficios', sug);
                        } else {
                          removeFromArray('beneficios', vagaData.beneficios.indexOf(sug));
                        }
                      }}
                      className="accent-blue-600"
                    />
                    <span className="text-sm">{sug}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  id="beneficio-input"
                  placeholder="Outro benefício..."
                  className="flex-1 px-3 py-2 border rounded-md"
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget as HTMLInputElement;
                      if (input.value && !vagaData.beneficios.includes(input.value)) {
                        addToArray('beneficios', input.value);
                        input.value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('beneficio-input') as HTMLInputElement;
                    if (input.value && !vagaData.beneficios.includes(input.value)) {
                      addToArray('beneficios', input.value);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >Adicionar</button>
              </div>
              <div className="mt-2 space-y-1">
                {vagaData.beneficios.filter(ben => !['Vale alimentação', 'Vale transporte', 'Plano de saúde', 'Plano odontológico', 'Gympass', 'Home office', 'Horário flexível', 'Day off aniversário'].includes(ben)).map((ben, idx) => {
                  const benStr = typeof ben === 'string' ? ben : JSON.stringify(ben);
                  return (
                    <div key={benStr + '-' + idx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => removeFromArray('beneficios', vagaData.beneficios.indexOf(ben))}
                        className="accent-blue-600"
                      />
                      <span className="text-sm">{benStr}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Seção 5 - Processo Seletivo */}
          <div className="space-y-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium">Processo Seletivo</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Selecione as etapas do processo:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {['Análise de currículo', 'Entrevista com RH', 'Teste técnico', 'Entrevista com gestor', 'Dinâmica de grupo', 'Proposta'].map((sug) => (
                  <label key={sug} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vagaData.etapas.includes(sug)}
                      onChange={e => {
                        if (e.target.checked) {
                          addToArray('etapas', sug);
                        } else {
                          removeFromArray('etapas', vagaData.etapas.indexOf(sug));
                        }
                      }}
                      className="accent-blue-600"
                    />
                    <span className="text-sm">{sug}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  id="etapa-input"
                  placeholder="Outra etapa..."
                  className="flex-1 px-3 py-2 border rounded-md"
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget as HTMLInputElement;
                      if (input.value && !vagaData.etapas.includes(input.value)) {
                        addToArray('etapas', input.value);
                        input.value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('etapa-input') as HTMLInputElement;
                    if (input.value && !vagaData.etapas.includes(input.value)) {
                      addToArray('etapas', input.value);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >Adicionar</button>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Etapas Selecionadas</label>
                {vagaData.etapas.length > 0 ? (
                  <ol className="list-decimal ml-6 space-y-2">
                    {vagaData.etapas.map((etapa, idx) => {
                      const etapaStr = typeof etapa === 'string' ? etapa : JSON.stringify(etapa);
                      return (
                        <li key={etapaStr + '-' + idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                          <span className="flex-1 text-sm">{etapaStr}</span>
                          <button type="button" onClick={() => removeFromArray('etapas', idx)} className="text-red-600 hover:text-red-800 text-xs">Remover</button>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <p className="text-sm text-gray-500 italic">Nenhuma etapa selecionada</p>
                )}
              </div>
            </div>
          </div>
          {/* Seção 6 - Acessibilidade */}
          <div className="space-y-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium">Acessibilidade</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Selecione os recursos de acessibilidade disponíveis: *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {acessibilidadesDisponiveis.map((a) => {
                  let Icon = FaWheelchair;
                  const desc = String(a.descricao).toLowerCase();
                  if (desc.includes('auditiva')) Icon = FaEarListen;
                  else if (desc.includes('visual')) Icon = FaEye;
                  else if (desc.includes('intelectual')) Icon = FaBrain;
                  else if (desc.includes('autismo') || desc.includes('tea')) Icon = FaPuzzlePiece;
                  else if (desc.includes('fala')) Icon = FaRegCommentDots;
                  else if (desc.includes('física') || desc.includes('motora')) Icon = FaWheelchair;
                  const descricaoStr = String(a.descricao);
                  // Defensive: always use only string array for recursos
                  const recursosArr = Array.isArray(vagaData.recursos) ? vagaData.recursos.map((r: any) => typeof r === 'string' ? r : (r?.descricao ? String(r.descricao) : JSON.stringify(r))) : [];
                  return (
                    <label key={String(a.id)} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md cursor-pointer">
                      <input
                        type="checkbox"
                        checked={recursosArr.includes(descricaoStr)}
                        onChange={e => {
                          if (e.target.checked) {
                            addToArray('recursos', descricaoStr);
                          } else {
                            removeFromArray('recursos', recursosArr.indexOf(descricaoStr));
                          }
                        }}
                        className="accent-blue-600"
                      />
                      <span className="text-sm flex items-center"><Icon className="inline mr-1" />{descricaoStr}</span>
                    </label>
                  );
                })}
              </div>
              {/* Lista de recursos selecionados, sempre como string */}
              {vagaData.recursos && vagaData.recursos.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs text-gray-500 mb-1">Recursos selecionados:</label>
                  <ul className="list-disc ml-5 text-sm text-gray-700">
                    {vagaData.recursos.map((r: any, idx) => {
                      let rStr = '';
                      if (typeof r === 'string') rStr = r;
                      else if (r && typeof r === 'object' && 'descricao' in r) rStr = String(r.descricao);
                      else rStr = JSON.stringify(r);
                      return <li key={rStr + '-' + idx}>{rStr}</li>;
                    })}
                  </ul>
                </div>
              )}
              <textarea
                value={vagaData.adaptacoes}
                onChange={e => handleInputChange('adaptacoes', e.target.value)}
                className="mt-4 w-full border rounded px-3 py-2"
                placeholder="Descreva quaisquer adaptações específicas que podem ser feitas para candidatos PCD..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={() => navigate(`/empresa/${empresaId}/gestao-vagas`)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <FiX className="w-4 h-4" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <FiSave className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </>
    </div>
  );
}
