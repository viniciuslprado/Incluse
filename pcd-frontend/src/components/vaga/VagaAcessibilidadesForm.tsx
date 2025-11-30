
import React, { useState, useCallback } from "react";
import { api } from "../../lib/api";
import type { Acessibilidade } from "../../types";

type Props = {
  vagaId: number;
  subtiposSelecionados?: number[];
};

export default function VagaAcessibilidadesForm({ vagaId }: Props) {
  const [acessibilidades, setAcessibilidades] = useState<Acessibilidade[]>([]);
  const [selecionadas, setSelecionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);


  const carregarAcessibilidades = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const data = await api.listarAcessibilidades();
      setAcessibilidades(data);
    } catch (e: any) {
      setErro("Erro ao carregar acessibilidades");
      setAcessibilidades([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    carregarAcessibilidades();
  }, [carregarAcessibilidades]);

  function toggleSelecionada(id: number) {
    setSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  }

  async function handleSalvar() {
    setLoading(true);
    setErro(null);
    setOk(false);
    try {
      await api.vincularAcessibilidadesAVaga(vagaId, selecionadas);
      setOk(true);
    } catch (e: any) {
      setErro("Erro ao salvar acessibilidades");
    } finally {
      setLoading(false);
    }
  }

  // Remove duplicados por id
  const acessibilidadesUnicas = acessibilidades.filter(
    (item, idx, arr) => arr.findIndex(a => a.id === item.id) === idx
  );
  // Debug: mostrar ids únicos para garantir que não há duplicados
  console.log('Acessibilidades únicas ids:', acessibilidadesUnicas.map((a: Acessibilidade) => a.id));

  return (
    <div className="card space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Definir Acessibilidades da Vaga
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Selecione as acessibilidades que sua empresa oferece para esta vaga.
          Isso aumenta a atratividade para candidatos PCD.
        </p>
        {selecionadas.length > 0 && (
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            {selecionadas.length} acessibilidade(s) selecionada(s)
          </p>
        )}
      </div>

      {erro && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
          <p className="text-red-600 dark:text-red-400 text-sm">{erro}</p>
        </div>
      )}

      {ok && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
          <p className="text-green-600 dark:text-green-400 text-sm">
            ✅ Acessibilidades vinculadas com sucesso!
          </p>
        </div>
      )}

      <div className="max-h-60 overflow-y-auto">
        <div className="grid grid-cols-1 gap-2">

          {acessibilidadesUnicas.map((acessibilidade) => (
            <label
              key={acessibilidade.id}
              className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <input
                type="checkbox"
                checked={selecionadas.includes(acessibilidade.id)}
                onChange={() => toggleSelecionada(acessibilidade.id)}
                className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {acessibilidade.descricao}
                </span>
              </div>
            </label>
          ))}

          {acessibilidades.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Nenhuma acessibilidade cadastrada
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setSelecionadas([])}
          disabled={loading || selecionadas.length === 0}
          className="px-3 py-2 bg-incluse-primary/10 text-incluse-primary rounded-md hover:bg-incluse-primary/20 dark:bg-green-600/80 dark:text-white dark:hover:bg-green-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-incluse-primary dark:focus:ring-green-600 focus:ring-offset-2"
        >
          Limpar seleção
        </button>

        <button
          onClick={handleSalvar}
          disabled={loading || selecionadas.length === 0}
          className="px-4 py-2 bg-incluse-primary text-white rounded-md hover:bg-incluse-primary-dark dark:bg-green-600 dark:hover:bg-green-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-incluse-primary dark:focus:ring-green-600 focus:ring-offset-2"
        >
          {loading ? "Salvando..." : "Salvar acessibilidades"}
        </button>
      </div>
    </div>
  );
}
