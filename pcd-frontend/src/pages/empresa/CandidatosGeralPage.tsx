import { useState, useEffect } from 'react';
import CustomSelect from '../../components/common/CustomSelect';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { FiSearch, FiUser, FiCalendar, FiMessageSquare, FiX, FiFileText, FiDownload } from 'react-icons/fi';

interface Candidato {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  dataCandidatura: string;
  vagaId: number;
  vagaTitulo?: string;
  etapa?: string;
  compatibilidade?: number;
  // Campos extras para o perfil completo
    escolaridade?: string;
    subtipos?: any[];
  cpf?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  curso?: string;
  sobre?: string;
  aceitaMudanca?: boolean;
  aceitaViajar?: boolean;
  pretensaoSalarialMin?: string;
  areasFormacao?: any[];
  barras?: any[];
  experiencias?: any[];
  formacoes?: any[];
  cursos?: any[];
  competencias?: any[];
  idiomas?: any[];
  laudo?: string;
}

export default function CandidatosGeralPage() {
  const { id } = useParams<{ id: string }>();
  const empresaId = Number(id);
  const navigate = useNavigate();
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroEtapa, setFiltroEtapa] = useState<string>('todas');
  const [candidatoSelecionado, setCandidatoSelecionado] = useState<Candidato | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);
  // Busca detalhes completos do candidato ao abrir o modal de perfil
  const handleVerPerfil = async (candidato: Candidato) => {
    setLoadingDetalhes(true);
    try {
      const detalhes = await api.getCandidato(candidato.id);
      setCandidatoSelecionado({ ...candidato, ...detalhes });
      setShowModal(true);
    } catch (error) {
      setCandidatoSelecionado(candidato); // fallback
      setShowModal(true);
    } finally {
      setLoadingDetalhes(false);
    }
  };

  useEffect(() => {
    carregarCandidatos();
  }, [empresaId]);

  async function carregarCandidatos() {
    try {
      setLoading(true);
      const vagasResult = await api.listarVagasPorEmpresa(empresaId);
      const vagas = Array.isArray(vagasResult) ? vagasResult : vagasResult?.data || [];

      const todosCandidatos: Candidato[] = [];
      for (const vaga of vagas) {
        try {
          let candidatosVaga = await api.listarCandidatosPorVaga(vaga.id);
          // Corrige caso venha { data: [...] }
          if (candidatosVaga && typeof candidatosVaga === 'object' && 'data' in candidatosVaga && Array.isArray(candidatosVaga.data)) {
            candidatosVaga = candidatosVaga.data;
          }
          if (!Array.isArray(candidatosVaga)) {
            // Se 404 ou erro, apenas ignora esta vaga
            console.warn('Nenhum candidato para a vaga', vaga.id);
            continue;
          }
          const candidatosComVaga = candidatosVaga.map((c: any) => ({
            ...c,
            vagaId: vaga.id,
            vagaTitulo: vaga.titulo || 'Vaga sem título',
            etapa: c.etapa || 'Análise de currículo',
            dataCandidatura: c.dataCandidatura || c.createdAt || new Date().toISOString()
          }));
          todosCandidatos.push(...candidatosComVaga);
        } catch (error) {
          // Se erro 404, ignora a vaga
          if (error && (error as any).response && (error as any).response.status === 404) {
            console.warn(`Vaga ${vaga.id} não encontrada ou sem candidatos.`);
            continue;
          }
          console.error(`Erro ao carregar candidatos da vaga ${vaga.id}:`, error);
        }
      }

      setCandidatos(todosCandidatos);
    } catch (error) {
      console.error('Erro ao carregar candidatos:', error);
      setCandidatos([]); // Garante array vazio para não quebrar hooks
    } finally {
      setLoading(false);
    }
  }


  async function rejeitarCandidato(candidato: Candidato) {
    if (!confirm(`Deseja rejeitar o candidato ${candidato.nome}?`)) return;
    
    try {
      // Implementar lógica de rejeição
      alert(`Candidato ${candidato.nome} rejeitado`);
      carregarCandidatos();
    } catch (error) {
      console.error('Erro ao rejeitar candidato:', error);
    }
  }

  async function exportarCandidatos() {
    try {
      // Implementar lógica de exportação para CSV
      const csv = [
        ['Nome', 'Email', 'Telefone', 'Vaga', 'Etapa', 'Data da Candidatura'].join(','),
        ...candidatosFiltrados.map(c => 
          [c.nome, c.email, c.telefone || '', c.vagaTitulo, c.etapa, new Date(c.dataCandidatura).toLocaleDateString('pt-BR')].join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `candidatos_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (error) {
      console.error('Erro ao exportar candidatos:', error);
    }
  }

  const etapas = ['Análise de currículo', 'Triagem', 'Entrevista', 'Teste prático', 'Aprovado', 'Rejeitado'];

  const candidatosFiltrados = candidatos
    .filter(c => 
      (busca === '' || 
       c.nome.toLowerCase().includes(busca.toLowerCase()) ||
       c.email.toLowerCase().includes(busca.toLowerCase()) ||
       c.vagaTitulo?.toLowerCase().includes(busca.toLowerCase())) &&
      (filtroEtapa === 'todas' || c.etapa === filtroEtapa)
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Candidatos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gerencie todos os candidatos das suas vagas</p>
        </div>
        <button
          onClick={exportarCandidatos}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <FiDownload className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou vaga..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro de Etapa */}
          <div className="w-full md:w-64">
            <CustomSelect
              value={filtroEtapa}
              onChange={val => setFiltroEtapa(val)}
              options={[
                { value: 'todas', label: 'Todas as Etapas' },
                ...etapas.map(etapa => ({ value: etapa, label: etapa }))
              ]}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total de Candidatos</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{candidatos.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Em Análise</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {candidatos.filter(c => c.etapa === 'Análise de currículo').length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Em Entrevista</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {candidatos.filter(c => c.etapa === 'Entrevista').length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Aprovados</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {candidatos.filter(c => c.etapa === 'Aprovado').length}
          </div>
        </div>
      </div>

      {/* Lista de Candidatos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {candidatosFiltrados.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Nenhum candidato encontrado
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {candidatosFiltrados.map((candidato) => (
              <div key={`${candidato.vagaId}-${candidato.id}`} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{candidato.nome}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{candidato.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 ml-13">
                      <span className="flex items-center gap-1">
                        <FiFileText className="w-4 h-4" />
                        {candidato.vagaTitulo}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        {new Date(candidato.dataCandidatura).toLocaleDateString('pt-BR')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        candidato.etapa === 'Aprovado' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        candidato.etapa === 'Rejeitado' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        candidato.etapa === 'Entrevista' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {candidato.etapa}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVerPerfil(candidato)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Ver perfil"
                    >
                      <FiFileText className="w-4 h-4" />
                    </button>
                    {/* Botão de avançar etapa removido */}
                    <button
                      onClick={() => alert('Funcionalidade de mensagem em desenvolvimento')}
                      className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                      title="Enviar mensagem"
                    >
                      <FiMessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => rejeitarCandidato(candidato)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Rejeitar"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Perfil do Candidato */}
      {showModal && candidatoSelecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowModal(false); setCandidatoSelecionado(null); }}>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Perfil do Candidato</h2>
                <button
                  onClick={() => { setShowModal(false); setCandidatoSelecionado(null); }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {loadingDetalhes ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-300">Carregando detalhes...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nome e Email sempre exibidos */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidatoSelecionado.nome}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidatoSelecionado.email}</p>
                    </div>
                    {/* Telefone */}
                    {candidatoSelecionado.telefone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidatoSelecionado.telefone}</p>
                      </div>
                    )}
                    {/* CPF */}
                    {candidatoSelecionado.cpf && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CPF</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidatoSelecionado.cpf}</p>
                      </div>
                    )}
                    {/* Endereço */}
                    {(candidatoSelecionado.rua || candidatoSelecionado.numero || candidatoSelecionado.bairro || candidatoSelecionado.cidade || candidatoSelecionado.estado || candidatoSelecionado.cep) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Endereço</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                          {[candidatoSelecionado.rua, candidatoSelecionado.numero].filter(Boolean).join(' ')}{(candidatoSelecionado.rua || candidatoSelecionado.numero) && (candidatoSelecionado.bairro ? ', ' : '')}{candidatoSelecionado.bairro}<br />
                          {[candidatoSelecionado.cidade, candidatoSelecionado.estado].filter(Boolean).join(' - ')} {candidatoSelecionado.cep}
                        </p>
                      </div>
                    )}
                    {/* Escolaridade */}
                    {candidatoSelecionado.escolaridade && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Escolaridade</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidatoSelecionado.escolaridade}</p>
                      </div>
                    )}
                    {/* Curso */}
                    {candidatoSelecionado.curso && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Curso</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidatoSelecionado.curso}</p>
                      </div>
                    )}
                    {/* Sobre */}
                    {candidatoSelecionado.sobre && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sobre</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidatoSelecionado.sobre}</p>
                      </div>
                    )}
                    {/* Aceita Mudança */}
                    {candidatoSelecionado.aceitaMudanca !== undefined && candidatoSelecionado.aceitaMudanca !== null && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aceita Mudança?</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidatoSelecionado.aceitaMudanca === true ? 'Sim' : 'Não'}</p>
                      </div>
                    )}
                    {/* Aceita Viajar */}
                    {candidatoSelecionado.aceitaViajar !== undefined && candidatoSelecionado.aceitaViajar !== null && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aceita Viajar?</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidatoSelecionado.aceitaViajar === true ? 'Sim' : 'Não'}</p>
                      </div>
                    )}
                    {/* Pretensão Salarial */}
                    {candidatoSelecionado.pretensaoSalarialMin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pretensão Salarial</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{candidatoSelecionado.pretensaoSalarialMin}</p>
                      </div>
                    )}
                    {/* Áreas de Formação */}
                    {candidatoSelecionado.areasFormacao && candidatoSelecionado.areasFormacao.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Áreas de Formação</label>
                        <ul className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                          {candidatoSelecionado.areasFormacao.map((a: any, i: number) => (
                            <li key={i}>{a.nome}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Subtipos de Deficiência */}
                    {candidatoSelecionado.subtipos && candidatoSelecionado.subtipos.length > 0 && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subtipos de Deficiência</label>
                        <ul className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                          {candidatoSelecionado.subtipos.map((s: any, i: number) => (
                            <li key={i}>{s.subtipo?.nome || s.nome}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Barreiras */}
                    {candidatoSelecionado.barras && candidatoSelecionado.barras.length > 0 && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Barreiras</label>
                        <ul className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                          {candidatoSelecionado.barras.map((b: any, i: number) => (
                            <li key={i}>{b.barreira?.descricao || b.descricao}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Experiências Profissionais */}
                    {candidatoSelecionado.experiencias && candidatoSelecionado.experiencias.length > 0 && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experiências Profissionais</label>
                        <ul className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                          {candidatoSelecionado.experiencias.map((exp: any, i: number) => (
                            <li key={i} className="mb-2">
                              <strong>{exp.cargo}</strong> em {exp.empresa} ({exp.dataInicio} - {exp.dataTermino || 'Atual'})<br />
                              {exp.descricao}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Formações */}
                    {candidatoSelecionado.formacoes && candidatoSelecionado.formacoes.length > 0 && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Formações</label>
                        <ul className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                          {candidatoSelecionado.formacoes.map((f: any, i: number) => (
                            <li key={i} className="mb-2">
                              <strong>{f.curso}</strong> - {f.instituicao} ({f.escolaridade}, {f.situacao})<br />
                              {f.inicio} - {f.termino || 'Atual'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Cursos */}
                    {candidatoSelecionado.cursos && candidatoSelecionado.cursos.length > 0 && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cursos</label>
                        <ul className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                          {candidatoSelecionado.cursos.map((c: any, i: number) => (
                            <li key={i} className="mb-2">
                              <strong>{c.nome}</strong> - {c.instituicao} ({c.cargaHoraria || '?'}h)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Competências */}
                    {candidatoSelecionado.competencias && candidatoSelecionado.competencias.length > 0 && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Competências</label>
                        <ul className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                          {candidatoSelecionado.competencias.map((comp: any, i: number) => (
                            <li key={i} className="mb-2">
                              <strong>{comp.nome}</strong> - {comp.tipo} ({comp.nivel})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Campo Idiomas removido conforme solicitado */}
                    {/* Campos Currículo e Laudo removidos conforme solicitado */}
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => { setShowModal(false); setCandidatoSelecionado(null); }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
