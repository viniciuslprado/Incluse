import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { FiArrowLeft, FiEdit, FiMapPin, FiBriefcase, FiDollarSign, FiBook, FiAward, FiHeart, FiEye } from "react-icons/fi";
import type { Vaga } from "../../types";

export default function VagaDetalhePage() {
  const { id, vagaId } = useParams();
  const navigate = useNavigate();
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      setErro(null);
      setLoading(true);
      try {
        const data = await api.obterVaga(Number(vagaId));
        setVaga(data);
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro ao carregar vaga");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [vagaId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (erro || !vaga) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300">{erro || "Vaga não encontrada"}</p>
        </div>
      </div>
    );
  }

  const beneficios = vaga.beneficios?.map(b => b.descricao) || [];
  const habilidadesTecnicas = vaga.requisitos?.habilidadesTecnicas 
    ? JSON.parse(vaga.requisitos.habilidadesTecnicas) 
    : [];
  const competencias = vaga.requisitos?.competencias 
    ? JSON.parse(vaga.requisitos.competencias) 
    : [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(`/empresa/${id}/gestao-vagas`)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <FiArrowLeft className="w-5 h-5" />
          Voltar
        </button>
        <button
          onClick={() => navigate(`/empresa/${id}/vagas/${vagaId}/editar`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiEdit className="w-4 h-4" />
          Editar Vaga
        </button>
      </div>

      {/* Título da Vaga */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {vaga.titulo || 'Sem título'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <FiMapPin className="w-5 h-5" />
            <span>{vaga.cidade || 'Cidade'}, {vaga.estado || 'Estado'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <FiBriefcase className="w-5 h-5" />
            <span>{vaga.tipoContratacao || 'Não especificado'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <FiBook className="w-5 h-5" />
            <span>{vaga.area || 'Área não especificada'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <FiEye className="w-5 h-5" />
            <span>{vaga.modeloTrabalho || 'Não especificado'}</span>
          </div>
        </div>
      </div>

      {/* Descrição da Vaga */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Sobre a Vaga</h2>
        
        {vaga.descricaoVaga?.resumo && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resumo da Função</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{vaga.descricaoVaga.resumo}</p>
          </div>
        )}

        {vaga.descricaoVaga?.atividades && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Atividades Principais</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{vaga.descricaoVaga.atividades}</p>
          </div>
        )}

        {(vaga.descricaoVaga?.salarioMin || vaga.descricaoVaga?.salarioMax) && (
          <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <FiDollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Faixa Salarial: </span>
              <span className="text-gray-900 dark:text-gray-100">
                {vaga.descricaoVaga.salarioMin ? `R$ ${vaga.descricaoVaga.salarioMin.toFixed(2)}` : 'Não informado'}
                {' '}-{' '}
                {vaga.descricaoVaga.salarioMax ? `R$ ${vaga.descricaoVaga.salarioMax.toFixed(2)}` : 'Não informado'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Requisitos */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Requisitos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Escolaridade Mínima</h3>
            <p className="text-gray-600 dark:text-gray-400">{vaga.escolaridade || 'Não especificada'}</p>
          </div>

          {vaga.requisitos?.experiencia && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Senioridade</h3>
              <p className="text-gray-600 dark:text-gray-400">{vaga.requisitos.experiencia}</p>
            </div>
          )}

          {vaga.requisitos?.formacao && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Formação</h3>
              <p className="text-gray-600 dark:text-gray-400">{vaga.requisitos.formacao}</p>
            </div>
          )}
        </div>

        {habilidadesTecnicas.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <FiAward className="w-4 h-4" />
              Habilidades Técnicas
            </h3>
            <div className="flex flex-wrap gap-2">
              {habilidadesTecnicas.map((hab: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                >
                  {hab}
                </span>
              ))}
            </div>
          </div>
        )}

        {competencias.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <FiHeart className="w-4 h-4" />
              Competências Comportamentais
            </h3>
            <div className="flex flex-wrap gap-2">
              {competencias.map((comp: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Benefícios */}
      {beneficios.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Benefícios</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {beneficios.map((benef: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {benef}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Acessibilidades */}
      {vaga.acessibilidades && vaga.acessibilidades.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Acessibilidades Oferecidas</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {vaga.acessibilidades.map((acess, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {acess.acessibilidade?.descricao}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Perfis de Deficiência */}
      {vaga.subtipos && vaga.subtipos.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Perfis de Deficiência Aceitos</h2>
          <div className="flex flex-wrap gap-2">
            {vaga.subtipos.map((subtipo, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
              >
                {subtipo.nome}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
