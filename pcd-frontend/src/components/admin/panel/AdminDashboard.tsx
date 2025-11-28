
import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { FiUsers, FiBriefcase, FiCheckCircle, FiXCircle, FiUserCheck, FiBarChart2 } from 'react-icons/fi';

type DashboardStats = {
  empresas: { total: number; ativas: number; inativas: number };
  candidatos: { total: number };
  vagas: {
    total: number;
    ativas: number;
    pausadas: number;
    encerradas: number;
    encerradasSemCandidaturas?: number;
    encerradasComCandidaturas?: number;
    mediaPorEmpresa?: number;
  };
  candidaturas: { total: number };
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);


  useEffect(() => {
    setLoading(true);
    setErro(null);
    api.obterDashboardAdmin()
      .then((data) => setStats(data))
      .catch((e) => setErro(e.message || 'Erro ao carregar dashboard'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      {loading ? (
        <div>Carregando...</div>
      ) : erro ? (
        <div className="text-red-600 font-semibold mb-4">
          {erro.includes('Token') || erro.toLowerCase().includes('autoriz') || erro.toLowerCase().includes('jwt') ? (
            <>
              Token ausente ou inválido. Faça login novamente para acessar o painel administrativo.<br />
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('refreshToken'); window.location.href = '/admin/login'; }}
              >
                Ir para o Login
              </button>
            </>
          ) : erro}
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-700 rounded-xl shadow p-6 flex flex-col items-center">
              <FiCheckCircle className="text-3xl text-green-700 dark:text-green-200 mb-2" />
              <span className="text-gray-700 dark:text-gray-200">Empresas Ativas</span>
              <span className="text-3xl font-extrabold text-green-900 dark:text-green-100">{stats.empresas.ativas}</span>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-300 dark:from-purple-900 dark:to-purple-700 rounded-xl shadow p-6 flex flex-col items-center">
              <FiUsers className="text-3xl text-purple-700 dark:text-purple-200 mb-2" />
              <span className="text-gray-700 dark:text-gray-200">Candidatos</span>
              <span className="text-3xl font-extrabold text-purple-900 dark:text-purple-100">{stats.candidatos.total}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center">
              <FiBriefcase className="text-2xl text-blue-500 dark:text-blue-300 mb-1" />
              <span className="text-gray-500 dark:text-gray-300">Vagas (Total)</span>
              <span className="text-2xl font-bold">{stats.vagas.total}</span>
            </div>
            <div className="bg-green-50 dark:bg-green-900 rounded-xl shadow p-6 flex flex-col items-center">
              <FiCheckCircle className="text-2xl text-green-600 dark:text-green-300 mb-1" />
              <span className="text-gray-500 dark:text-gray-300">Vagas Ativas</span>
              <span className="text-2xl font-bold">{stats.vagas.ativas}</span>
            </div>
            <div className="bg-red-50 dark:bg-red-900 rounded-xl shadow p-6 flex flex-col items-center">
              <FiXCircle className="text-2xl text-red-600 dark:text-red-300 mb-1" />
              <span className="text-gray-500 dark:text-gray-300">Vagas Encerradas</span>
              <span className="text-2xl font-bold">{stats.vagas.encerradas}</span>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900 rounded-xl shadow p-6 flex flex-col items-center">
              <FiUserCheck className="text-2xl text-indigo-600 dark:text-indigo-300 mb-1" />
              <span className="text-gray-500 dark:text-gray-300">Candidaturas</span>
              <span className="text-2xl font-bold">{stats.candidaturas.total}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-red-100 dark:bg-red-900 rounded-xl shadow p-6 flex flex-col items-center">
              <FiXCircle className="text-2xl text-red-700 dark:text-red-300 mb-1" />
              <span className="text-gray-700 dark:text-gray-200">Vagas Encerradas sem Candidaturas</span>
              <span className="text-2xl font-bold">{stats.vagas.encerradasSemCandidaturas ?? '-'}</span>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 rounded-xl shadow p-6 flex flex-col items-center">
              <FiUserCheck className="text-2xl text-orange-700 dark:text-orange-300 mb-1" />
              <span className="text-gray-700 dark:text-gray-200">Vagas Encerradas com Candidaturas</span>
              <span className="text-2xl font-bold">{stats.vagas.encerradasComCandidaturas ?? '-'}</span>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 rounded-xl shadow p-6 flex flex-col items-center">
              <FiBarChart2 className="text-2xl text-blue-700 dark:text-blue-300 mb-1" />
              <span className="text-gray-700 dark:text-gray-200">Média de Vagas por Empresa</span>
              <span className="text-2xl font-bold">{stats.vagas.mediaPorEmpresa ? Math.ceil(stats.vagas.mediaPorEmpresa) : '-'}</span>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
