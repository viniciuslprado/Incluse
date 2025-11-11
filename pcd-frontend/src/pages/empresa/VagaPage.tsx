import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";
import type { Vaga } from "../../types";
import VagaForm from "../../components/vaga/VagaForm";
import VagaList from "../../components/vaga/VagaList";

export default function VagasPage() {
  const { id } = useParams();
  const empresaId = Number(id);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!empresaId || isNaN(empresaId)) {
      setErro("ID da empresa inválido");
      setLoading(false);
      return;
    }

    setErro(null);
    setLoading(true);
    
    try {
      const data = await api.listarVagas(empresaId);
      setVagas(data);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar vagas");
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (erro) {
    return (
      <div className="space-y-6">
  <div className="bg-white dark:bg-transparent rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Vagas da Empresa
          </h1>
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
              <button
                onClick={carregar}
                className="ml-auto bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded text-sm hover:bg-red-200 dark:hover:bg-red-700"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
  <div className="bg-white dark:bg-transparent rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Gestão de Vagas
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Crie e gerencie as vagas disponíveis para pessoas com deficiência.
        </p>
      </div>

      {/* Formulário de criação */}
      <VagaForm empresaId={empresaId} onCreated={carregar} />

      {/* Lista de vagas */}
      <VagaList vagas={vagas} loading={loading} />
    </div>
  );
}
