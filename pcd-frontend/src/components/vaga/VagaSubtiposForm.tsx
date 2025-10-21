import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { SubtipoDeficiencia, TipoComSubtipos } from "../../types";

type Props = {
  vagaId: number;
};

export default function VagaSubtiposForm({ vagaId }: Props) {
  const [tiposComSubtipos, setTiposComSubtipos] = useState<TipoComSubtipos[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function carregarSubtipos() {
    try {
      const data = await api.listarTiposComSubtipos(); // GET /tipos/com-subtipos
      setTiposComSubtipos(data);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar subtipos");
    }
  }

  async function handleSalvar() {
    setErro(null);
    setOk(false);
    if (!selecionados.length) {
      setErro("Selecione ao menos um subtipo.");
      return;
    }

    setLoading(true);
    try {
      await api.vincularSubtiposAVaga(vagaId, selecionados);
      setOk(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao vincular subtipos");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelecionado(id: number) {
    setSelecionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  useEffect(() => {
    carregarSubtipos();
  }, []);

  return (
    <div className="card space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Definir Perfis de Deficiência para a Vaga
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Selecione os subtipos de deficiência que se adequam a esta vaga. 
          Isso ajudará na busca por candidatos compatíveis.
        </p>
        {selecionados.length > 0 && (
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            {selecionados.length} subtipo(s) selecionado(s)
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
            ✅ Subtipos vinculados com sucesso!
          </p>
        </div>
      )}

      <div className="max-h-60 overflow-y-auto space-y-4">
        {tiposComSubtipos.map((tipo) => (
          <div key={tipo.id} className="border border-gray-200 dark:border-gray-600 rounded p-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              {tipo.nome}
            </h4>
            <div className="space-y-2 ml-2">
              {tipo.subtipos.map((subtipo) => (
                <label key={subtipo.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selecionados.includes(subtipo.id)}
                    onChange={() => toggleSelecionado(subtipo.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {subtipo.nome}
                  </span>
                </label>
              ))}
              {tipo.subtipos.length === 0 && (
                <p className="text-sm text-gray-500 italic">Nenhum subtipo cadastrado</p>
              )}
            </div>
          </div>
        ))}
        
        {tiposComSubtipos.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            Nenhum tipo de deficiência cadastrado
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSalvar}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Salvando..." : "Salvar subtipos"}
        </button>
      </div>
    </div>
  );
}
