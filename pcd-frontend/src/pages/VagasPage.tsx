import { useEffect, useState } from "react";
import CustomSelect from "../components/common/CustomSelect";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import type { Vaga, TipoDeficiencia, Acessibilidade, Empresa } from "../types";
// import Loading from "../components/Loading";
import ResponsiveCardList from "../components/common/ResponsiveCardList";

interface VagaPublica extends Vaga {
  empresa: Empresa;
}

interface Filtros {
  escolaridade: string;
  tipoDeficiencia: string;
  acessibilidade: string;
  empresa: string;
}

function FiltrosPanel({ 
  filtros, 
  setFiltros, 
  tipos, 
  acessibilidades, 
  empresas 
}: {
  filtros: Filtros;
  setFiltros: (filtros: Filtros) => void;
  tipos: TipoDeficiencia[];
  acessibilidades: Acessibilidade[];
  empresas: Empresa[];
}) {
  const escolaridades = [
    'Ensino Fundamental Completo',
    'Ensino Fundamental Incompleto',
    'Ensino Médio Completo',
    'Ensino Médio Incompleto',
    'Ensino Superior Completo',
    'Ensino Superior Incompleto',
    'Técnico',
    'Pós-graduação',
    'Mestrado',
    'Doutorado'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Filtrar Vagas
      </h3>
      <div className="space-y-4">
        {/* Filtro por Escolaridade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Escolaridade
          </label>
          <CustomSelect
            value={filtros.escolaridade}
            onChange={val => setFiltros({ ...filtros, escolaridade: val })}
            options={[
              { value: '', label: 'Todas' },
              ...escolaridades.map(esc => ({ value: esc, label: esc }))
            ]}
            placeholder="Todas"
            className="w-full"
          />
        </div>

        {/* Filtro por Tipo de Deficiência */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Deficiência
          </label>
          <CustomSelect
            value={filtros.tipoDeficiencia}
            onChange={val => setFiltros({ ...filtros, tipoDeficiencia: val })}
            options={[
              { value: '', label: 'Todos' },
              ...tipos.map(tipo => ({ value: String(tipo.id), label: tipo.nome }))
            ]}
            placeholder="Todos"
            className="w-full"
          />
        </div>

        {/* Filtro por Acessibilidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Acessibilidade
          </label>
          <CustomSelect
            value={filtros.acessibilidade}
            onChange={val => setFiltros({ ...filtros, acessibilidade: val })}
            options={[
              { value: '', label: 'Todas' },
              ...acessibilidades.map(acess => ({ value: String(acess.id), label: acess.descricao }))
            ]}
            placeholder="Todas"
            className="w-full"
          />
        </div>

        {/* Filtro por Empresa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Empresa
          </label>
          <CustomSelect
            value={filtros.empresa}
            onChange={val => setFiltros({ ...filtros, empresa: val })}
            options={[
              { value: '', label: 'Todas' },
              ...empresas.map(empresa => ({ value: String(empresa.id), label: empresa.nome }))
            ]}
            placeholder="Todas"
            className="w-full"
          />
        </div>

        {/* Botão limpar filtros */}
        <button
          onClick={() => setFiltros({ escolaridade: "", tipoDeficiencia: "", acessibilidade: "", empresa: "" })}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  );
}

function VagaCard({ vaga }: { vaga: VagaPublica }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const handleVerDetalhes = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login');
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-incluse-primary/5 to-incluse-secondary/5 p-6 pb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {vaga.titulo || vaga.descricao}
        </h3>
        <p className="text-incluse-primary font-semibold text-lg">
          {vaga.empresa.nome}
        </p>
      </div>

      {/* Conteúdo */}
      <div className="p-6 pt-4">
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Escolaridade */}
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="w-10 h-10 bg-incluse-accent/10 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-incluse-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">ESCOLARIDADE</p>
              <p className="text-gray-900 dark:text-gray-100 font-semibold">{vaga.escolaridade}</p>
            </div>
          </div>

          {/* Localização */}
          {(vaga.cidade || vaga.estado) && (
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-10 h-10 bg-incluse-secondary/10 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-incluse-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">LOCALIZAÇÃO</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">
                  {vaga.cidade && vaga.estado ? `${vaga.cidade}, ${vaga.estado}` : vaga.cidade || vaga.estado}
                </p>
              </div>
            </div>
          )}

          {/* Email da empresa */}
          {vaga.empresa.email && (
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-10 h-10 bg-incluse-primary/10 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-incluse-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">CONTATO</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">{vaga.empresa.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Botão de ação */}
        <Link
          to={`/vaga/${vaga.id}`}
          onClick={handleVerDetalhes}
          className="block w-full bg-gradient-to-r from-incluse-primary to-incluse-accent hover:from-incluse-primary-dark hover:to-incluse-accent-dark text-white text-center font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-incluse-primary focus:ring-offset-2"
        >
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Ver Detalhes da Vaga
          </div>
        </Link>
      </div>
    </div>
  );
}


export default function VagasPage() {
  const [vagas, setVagas] = useState<VagaPublica[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<Filtros>({
    escolaridade: "",
    tipoDeficiencia: "",
    acessibilidade: "",
    empresa: ""
  });

  // Estados para os dados dos filtros
  const [tipos, setTipos] = useState<TipoDeficiencia[]>([]);
  const [acessibilidades, setAcessibilidades] = useState<Acessibilidade[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  // Move hooks to top level
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarDados() {
      try {
        // Carregar dados para filtros
        const [tiposData, acessibilidadesData, empresasData] = await Promise.all([
          api.listarTiposPublicos(),
          api.listarAcessibilidadesPublicas(),
          api.listarEmpresas()
        ]);

        setTipos(tiposData);
        setAcessibilidades(acessibilidadesData);
        setEmpresas(empresasData);

        // Carregar vagas de todas as empresas
        const vagasAll = await api.listarVagasPublicas();
        const todasVagas: VagaPublica[] = vagasAll.map((vaga: Vaga & { empresa: Empresa }) => ({
          ...vaga,
          empresa: vaga.empresa
        }));
        setVagas(todasVagas);
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  // Filtrar vagas
  const vagasFiltradas = vagas.filter(vaga => {
    if (filtros.escolaridade && vaga.escolaridade !== filtros.escolaridade) return false;
    if (filtros.empresa && vaga.empresa.id.toString() !== filtros.empresa) return false;
    // TODO: Implementar filtros por tipo de deficiência e acessibilidade quando tivermos essas relações
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-6 text-center text-gray-500">Carregando vagas...</div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Erro ao carregar dados</h3>
              <div className="mt-1">
                <p className="text-sm text-red-700 dark:text-red-300">{erro}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Oportunidades de Trabalho
        </h1>
        <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Encontre vagas inclusivas em empresas comprometidas com a diversidade.
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Painel de Filtros */}
        <div className="lg:col-span-1">
          <FiltrosPanel 
            filtros={filtros}
            setFiltros={setFiltros}
            tipos={tipos}
            acessibilidades={acessibilidades}
            empresas={empresas}
          />
        </div>

        {/* Lista de Vagas */}
        <div className="lg:col-span-3 mt-8 lg:mt-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {vagasFiltradas.length} {vagasFiltradas.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
            </h2>
          </div>

          {vagasFiltradas.length > 0 ? (
            <>
              {/* Desktop list */}
              <div className="hidden md:block space-y-4">
                {vagasFiltradas.map((vaga) => (
                  <VagaCard key={vaga.id} vaga={vaga} />
                ))}
              </div>
              {/* Mobile cards */}
              <div className="md:hidden">
                <ResponsiveCardList
                  items={vagasFiltradas.map((vaga) => {
                    // Define a stable handler for each vaga
                    const handleVerDetalhes = (e: React.MouseEvent) => {
                      if (!isAuthenticated) {
                        e.preventDefault();
                        navigate('/login');
                      }
                    };
                    return {
                      id: vaga.id,
                      title: vaga.titulo || vaga.descricao,
                      subtitle: vaga.empresa?.nome,
                      meta: [
                        { label: 'Escolaridade', value: vaga.escolaridade },
                        ...(vaga.cidade || vaga.estado ? [{ label: 'Localização', value: vaga.cidade && vaga.estado ? `${vaga.cidade}, ${vaga.estado}` : (vaga.cidade || vaga.estado) }] : []),
                        ...(vaga.empresa?.email ? [{ label: 'Contato', value: vaga.empresa.email }] : []),
                      ],
                      actions: [
                        {
                          label: 'Ver detalhes da vaga',
                          to: `/vaga/${vaga.id}`,
                          variant: 'blue',
                          full: true,
                          onClick: handleVerDetalhes,
                        },
                      ],
                    };
                  })}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                Nenhuma vaga encontrada
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Tente ajustar os filtros para encontrar mais oportunidades.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}