import { useState } from "react";
import { api } from "../../lib/api";

interface VagaFormProps {
  empresaId: number;
  onCreated: () => void;
}

const ESCOLARIDADE_OPTIONS = [
  "Ensino Fundamental Completo",
  "Ensino Fundamental Incompleto", 
  "Ensino Médio Completo",
  "Ensino Médio Incompleto",
  "Ensino Superior Completo",
  "Ensino Superior Incompleto"
];

export default function VagaForm({ empresaId, onCreated }: VagaFormProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [escolaridade, setEscolaridade] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    
    if (!titulo.trim() || !descricao.trim() || !escolaridade.trim() || !cidade.trim() || !estado.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }
    
    setLoading(true);
    try {
      await api.criarVaga(empresaId, titulo, descricao, escolaridade, cidade, estado);
      setTitulo("");
      setDescricao("");
      setEscolaridade("");
      setCidade("");
      setEstado("");
      onCreated();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao criar vaga");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Nova Vaga
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="titulo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Título da vaga
          </label>
          <input
            id="titulo"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex.: Desenvolvedor Frontend React/TypeScript"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label 
            htmlFor="descricao"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Descrição detalhada
          </label>
          <textarea
            id="descricao"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva as responsabilidades, requisitos, benefícios..."
            disabled={loading}
            required
          />
        </div>

        <div>
          <label 
            htmlFor="escolaridade"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Escolaridade
          </label>
          <select
            id="escolaridade"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            value={escolaridade}
            onChange={(e) => setEscolaridade(e.target.value)}
            disabled={loading}
            required
          >
            <option value="">Selecione...</option>
            {ESCOLARIDADE_OPTIONS.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="cidade"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Cidade
            </label>
            <input
              id="cidade"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Ex.: São Paulo"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label 
              htmlFor="estado"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Estado
            </label>
            <input
              id="estado"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              placeholder="Ex.: SP"
              disabled={loading}
              required
            />
          </div>
        </div>

        {erro && (
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
                onClick={() => setErro(null)}
                className="ml-auto bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded text-xs hover:bg-red-200 dark:hover:bg-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </span>
            ) : (
              "Criar Vaga"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
