import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { FiAlertCircle, FiSave, FiX } from 'react-icons/fi';

interface VagaData {
  id: number;
  titulo?: string;
  tipoContratacao?: string;
  modeloTrabalho?: string;
  area?: string;
  cidade?: string;
  estado?: string;
  escolaridade?: string;
  status?: string;
  exigeMudanca?: boolean;
  exigeViagens?: boolean;
  descricaoVaga?: {
    resumo?: string;
    atividades?: string;
    jornada?: string;
    salarioMin?: number;
    salarioMax?: number;
  };
  requisitos?: {
    formacao?: string;
    experiencia?: string;
    competencias?: string;
    habilidadesTecnicas?: string;
  };
  beneficios?: Array<{ id: number; descricao: string; vagaId: number }>;
  acessibilidades?: Array<{ 
    acessibilidadeId?: number; 
    acessibilidade?: { id: number; descricao: string } 
  }>;
}

export default function EditarVagaPage() {
  const { id, vagaId } = useParams<{ id: string; vagaId: string }>();
  const empresaId = Number(id);
  const navigate = useNavigate();
  
  const [vaga, setVaga] = useState<VagaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  // Estados para campos editáveis
  const [resumo, setResumo] = useState('');
  const [atividades, setAtividades] = useState('');
  const [salarioMin, setSalarioMin] = useState<number | ''>('');
  const [salarioMax, setSalarioMax] = useState<number | ''>('');
  const [jornadaHoras, setJornadaHoras] = useState('');
  const [jornadaPeriodo, setJornadaPeriodo] = useState<'semanal' | 'mensal'>('semanal');
  
  // Estados para listas expansíveis (somente adicionar)
  const [beneficios, setBeneficios] = useState<string[]>([]);
  const [novoBeneficio, setNovoBeneficio] = useState('');
  
  const [habilidadesTecnicas, setHabilidadesTecnicas] = useState<string[]>([]);
  const [novaHabilidade, setNovaHabilidade] = useState('');
  
  const [competencias, setCompetencias] = useState<string[]>([]);
  const [novaCompetencia, setNovaCompetencia] = useState('');
  
  const [acessibilidades, setAcessibilidades] = useState<number[]>([]);
  const [todasAcessibilidades, setTodasAcessibilidades] = useState<Array<{ id: number; descricao: string }>>([]);

  // Valores originais para validação (não podem ser removidos/diminuídos)
  const [salarioMinOriginal, setSalarioMinOriginal] = useState<number>(0);
  const [beneficiosOriginais, setBeneficiosOriginais] = useState<string[]>([]);
  const [habilidadesOriginais, setHabilidadesOriginais] = useState<string[]>([]);
  const [competenciasOriginais, setCompetenciasOriginais] = useState<string[]>([]);
  const [acessibilidadesOriginais, setAcessibilidadesOriginais] = useState<number[]>([]);

  useEffect(() => {
    async function carregarVaga() {
      try {
        const data = await api.obterVaga(Number(vagaId));
        setVaga(data);
        
        // Campos editáveis
        setResumo(data.descricaoVaga?.resumo || '');
        setAtividades(data.descricaoVaga?.atividades || '');
        setSalarioMin(data.descricaoVaga?.salarioMin || '');
        setSalarioMax(data.descricaoVaga?.salarioMax || '');
        
        // Jornada (parse "40h semanais" ou "160h mensais")
                const jornadaStr = data.descricaoVaga?.jornada || '';
                if (jornadaStr) {
                  const match = jornadaStr.match(/(\d+)h\s+(semanais|mensais)/);
                  if (match) {
                    setJornadaHoras(match[1]);
                    setJornadaPeriodo(match[2] === 'semanais' ? 'semanal' : 'mensal');
                  } else {
                    // Caso formato inesperado, mantém tudo em horas semanais por padrão
                    const numMatch = jornadaStr.match(/(\d+)/);
                    if (numMatch) setJornadaHoras(numMatch[1]);
                  }
                }
        
        // Listas expansíveis
        const benefs = data.beneficios?.map(b => b.descricao) || [];
        setBeneficios(benefs);
        setBeneficiosOriginais(benefs);
        
        const habs = data.requisitos?.habilidadesTecnicas 
          ? JSON.parse(data.requisitos.habilidadesTecnicas) 
          : [];
        setHabilidadesTecnicas(habs);
        setHabilidadesOriginais(habs);
        
        const comps = data.requisitos?.competencias 
          ? JSON.parse(data.requisitos.competencias) 
          : [];
        setCompetencias(comps);
        setCompetenciasOriginais(comps);
        
        const acess = data.acessibilidades?.map(a => a.acessibilidadeId).filter((id): id is number => id !== undefined) || [];
        setAcessibilidades(acess);
        setAcessibilidadesOriginais(acess);
        
        setSalarioMinOriginal(data.descricaoVaga?.salarioMin || 0);
        
        // Carregar todas acessibilidades disponíveis
        const todasAcess = await api.listarAcessibilidades();
        setTodasAcessibilidades(todasAcess);
      } catch (error) {
        console.error('Erro ao carregar vaga:', error);
        setErro('Erro ao carregar dados da vaga');
      } finally {
        setLoading(false);
      }
    }

    if (vagaId) {
      carregarVaga();
    }
  }, [vagaId]);

  const handleAdicionarBeneficio = () => {
    if (novoBeneficio.trim()) {
      setBeneficios([...beneficios, novoBeneficio.trim()]);
      setNovoBeneficio('');
    }
  };

  const handleAdicionarHabilidade = () => {
    if (novaHabilidade.trim()) {
      setHabilidadesTecnicas([...habilidadesTecnicas, novaHabilidade.trim()]);
      setNovaHabilidade('');
    }
  };

  const handleAdicionarCompetencia = () => {
    if (novaCompetencia.trim()) {
      setCompetencias([...competencias, novaCompetencia.trim()]);
      setNovaCompetencia('');
    }
  };

  const handleToggleAcessibilidade = (id: number) => {
    if (acessibilidades.includes(id)) {
      // Não permitir remover se estava no original
      if (acessibilidadesOriginais.includes(id)) {
        setErro('Não é permitido remover acessibilidades já existentes');
        setTimeout(() => setErro(null), 3000);
        return;
      }
      setAcessibilidades(acessibilidades.filter(a => a !== id));
    } else {
      setAcessibilidades([...acessibilidades, id]);
    }
  };

  const validarEdicoes = (): boolean => {
    // Validar salário mínimo não pode diminuir
    const novoSalarioMin = Number(salarioMin) || 0;
    if (novoSalarioMin < salarioMinOriginal) {
      setErro(`Salário mínimo não pode ser reduzido. Valor original: R$ ${salarioMinOriginal.toFixed(2)}`);
      return false;
    }

    // Validar que todos benefícios originais ainda existem
    for (const benef of beneficiosOriginais) {
      if (!beneficios.includes(benef)) {
        setErro(`Não é permitido remover benefícios. Faltando: "${benef}"`);
        return false;
      }
    }

    // Validar habilidades técnicas
    for (const hab of habilidadesOriginais) {
      if (!habilidadesTecnicas.includes(hab)) {
        setErro(`Não é permitido remover habilidades técnicas. Faltando: "${hab}"`);
        return false;
      }
    }

    // Validar competências
    for (const comp of competenciasOriginais) {
      if (!competencias.includes(comp)) {
        setErro(`Não é permitido remover competências. Faltando: "${comp}"`);
        return false;
      }
    }

    // Validar acessibilidades
    for (const acess of acessibilidadesOriginais) {
      if (!acessibilidades.includes(acess)) {
        setErro('Não é permitido remover acessibilidades já configuradas');
        return false;
      }
    }

    return true;
  };

  const handleSalvar = async () => {
    setErro(null);
    
    if (!validarEdicoes()) {
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        descricaoVaga: {
          resumo,
          atividades,
          jornada: jornadaHoras ? `${jornadaHoras}h ${jornadaPeriodo === 'semanal' ? 'semanais' : 'mensais'}` : undefined,
          salarioMin: Number(salarioMin) || undefined,
          salarioMax: Number(salarioMax) || undefined,
        },
        requisitos: {
          habilidadesTecnicas: JSON.stringify(habilidadesTecnicas),
          competencias: JSON.stringify(competencias),
        },
        beneficios,
        acessibilidadeIds: acessibilidades,
      };

      await api.atualizarVaga(Number(vagaId), updateData);
      setSucesso(true);
      setTimeout(() => {
        navigate(`/empresa/${empresaId}/vagas`);
      }, 1500);
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      setErro(error.message || 'Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!vaga) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Vaga não encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Editar Vaga</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Campos bloqueados não podem ser alterados após a publicação
        </p>
      </div>

      {erro && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">{erro}</p>
        </div>
      )}

      {sucesso && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-700 dark:text-green-300">✓ Alterações salvas com sucesso!</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Campos Bloqueados */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Informações Fixas (não editáveis)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Cargo</label>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-2 rounded">{vaga.titulo || 'Não especificado'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Área</label>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-2 rounded">{vaga.area || 'Não especificada'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Experiência / Senioridade</label>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-2 rounded">{vaga.requisitos?.experiencia || 'Não especificada'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Localidade</label>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-2 rounded">{vaga.cidade || ''}{vaga.cidade && vaga.estado ? ', ' : ''}{vaga.estado || ''}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tipo de Contrato</label>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-2 rounded">{vaga.tipoContratacao || 'Não especificado'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Formação</label>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-2 rounded">{vaga.requisitos?.formacao || 'Não especificados'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Modelo de Trabalho</label>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-2 rounded">{vaga.modeloTrabalho || 'Não especificado'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Escolaridade Mínima</label>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-2 rounded">{vaga.escolaridade || 'Não especificada'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-2 rounded capitalize">{vaga.status || 'ativa'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Altere o status na lista de gestão de vagas</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Exige Mudança de Cidade</label>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-2 rounded">{vaga.exigeMudanca ? 'Sim' : 'Não'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Exige Viagens Frequentes</label>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-2 rounded">{vaga.exigeViagens ? 'Sim' : 'Não'}</p>
            </div>
          </div>
        </div>

        {/* Campos Editáveis */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Campos Editáveis</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resumo da Função
              </label>
              <textarea
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva brevemente a função..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Atividades Principais
              </label>
              <textarea
                value={atividades}
                onChange={(e) => setAtividades(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                placeholder="Liste as principais atividades..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jornada de Trabalho
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={220}
                  value={jornadaHoras}
                  onChange={(e) => setJornadaHoras(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="40"
                />
                <select
                  value={jornadaPeriodo}
                  onChange={(e) => setJornadaPeriodo(e.target.value as 'semanal' | 'mensal')}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="semanal">horas/semana</option>
                  <option value="mensal">horas/mês</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salário Mínimo (R$)
                  {salarioMinOriginal > 0 && (
                    <span className="text-xs text-gray-500 ml-2">
                      (mínimo: R$ {salarioMinOriginal.toFixed(2)})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  value={salarioMin}
                  onChange={(e) => setSalarioMin(e.target.value ? Number(e.target.value) : '')}
                  min={salarioMinOriginal}
                  step="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 3000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salário Máximo (R$)
                </label>
                <input
                  type="number"
                  value={salarioMax}
                  onChange={(e) => setSalarioMax(e.target.value ? Number(e.target.value) : '')}
                  step="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 5000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Benefícios (somente adicionar) */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Benefícios <span className="text-sm font-normal text-gray-500">(somente adicionar)</span>
          </h2>
          
          <div className="space-y-3 mb-4">
            {beneficios.map((benef, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="flex-1 text-gray-900 dark:text-gray-100">{benef}</span>
                {beneficiosOriginais.includes(benef) && (
                  <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                    Original
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={novoBeneficio}
              onChange={(e) => setNovoBeneficio(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdicionarBeneficio()}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Adicionar novo benefício..."
            />
            <button
              onClick={handleAdicionarBeneficio}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Habilidades Técnicas (somente adicionar) */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Habilidades Técnicas <span className="text-sm font-normal text-gray-500">(somente adicionar)</span>
          </h2>
          
          <div className="space-y-3 mb-4">
            {habilidadesTecnicas.map((hab, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="flex-1 text-gray-900 dark:text-gray-100">{hab}</span>
                {habilidadesOriginais.includes(hab) && (
                  <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                    Original
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={novaHabilidade}
              onChange={(e) => setNovaHabilidade(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdicionarHabilidade()}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Adicionar nova habilidade..."
            />
            <button
              onClick={handleAdicionarHabilidade}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Competências Comportamentais (somente adicionar) */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Competências Comportamentais <span className="text-sm font-normal text-gray-500">(somente adicionar)</span>
          </h2>
          
          <div className="space-y-3 mb-4">
            {competencias.map((comp, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="flex-1 text-gray-900 dark:text-gray-100">{comp}</span>
                {competenciasOriginais.includes(comp) && (
                  <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                    Original
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={novaCompetencia}
              onChange={(e) => setNovaCompetencia(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdicionarCompetencia()}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Adicionar nova competência..."
            />
            <button
              onClick={handleAdicionarCompetencia}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Acessibilidades (somente adicionar) */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Acessibilidades <span className="text-sm font-normal text-gray-500">(somente adicionar)</span>
          </h2>
          
          <div className="space-y-2">
            {todasAcessibilidades.map((acess) => {
              const isSelected = acessibilidades.includes(acess.id);
              const isOriginal = acessibilidadesOriginais.includes(acess.id);
              
              return (
                <label 
                  key={acess.id} 
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                  } ${isOriginal ? 'cursor-not-allowed opacity-75' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleAcessibilidade(acess.id)}
                    disabled={isOriginal}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="flex-1 text-gray-900 dark:text-gray-100">{acess.descricao}</span>
                  {isOriginal && (
                    <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                      Original
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigate(`/empresa/${empresaId}/vagas`)}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <FiX className="w-4 h-4" />
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FiSave className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}
