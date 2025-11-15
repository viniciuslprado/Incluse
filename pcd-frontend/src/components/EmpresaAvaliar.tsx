import { useState } from "react";
import { api } from "../lib/api";

type Props = {
  empresaId: number;
  onSubmitted?: () => void;
};

export default function EmpresaAvaliar({ empresaId, onSubmitted }: Props) {
  const [nota, setNota] = useState<number>(5);
  const [comentario, setComentario] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  async function enviar() {
    setErro(null);
    setSucesso(null);
    setLoading(true);
    try {
      await api.avaliarEmpresa(empresaId, nota, comentario || undefined, anonimo);
      setSucesso("Avaliação enviada. Obrigado!");
      setComentario("");
      setNota(5);
      setAnonimo(false);
      onSubmitted?.();
    } catch (e: any) {
      setErro(e?.message ?? "Erro ao enviar avaliação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded-md bg-white shadow-sm max-w-xl">
      <h3 className="text-lg font-semibold mb-2">Avaliar empresa</h3>

      <div className="mb-3">
        <div className="text-sm text-gray-700 mb-1">Nota</div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={nota === n}
              onClick={() => setNota(n)}
              className={
                "px-3 py-1 rounded-md border " + (nota === n ? "bg-yellow-400 border-yellow-500" : "bg-white")
              }
            >
              {n}★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm text-gray-700 mb-1">Comentário (opcional)</label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="w-full border rounded p-2 text-sm"
          rows={4}
        />
      </div>

      <div className="mb-3 flex items-center gap-2">
        <input id="anon" type="checkbox" checked={anonimo} onChange={(e) => setAnonimo(e.target.checked)} />
        <label htmlFor="anon" className="text-sm text-gray-700">Enviar de forma anônima</label>
      </div>

      {erro && <div className="text-sm text-red-600 mb-2">{erro}</div>}
      {sucesso && <div className="text-sm text-green-600 mb-2">{sucesso}</div>}

      <div className="flex items-center gap-2">
        <button
          onClick={enviar}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar avaliação"}
        </button>
        <button type="button" onClick={() => { setComentario(""); setNota(5); setAnonimo(false); }} className="px-3 py-1 border rounded">
          Limpar
        </button>
      </div>
    </div>
  );
}
