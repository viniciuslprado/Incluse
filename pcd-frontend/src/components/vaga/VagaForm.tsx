import { useState } from "react";
import { api } from "../../lib/api";
type Props = {
  empresaId: number;
  onCreated: () => void; // callback para recarregar lista
};
export default function VagaForm({ empresaId, onCreated }: Props) {
  const [descricao, setDescricao] = useState("");
  const [escolaridade, setEscolaridade] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (!descricao.trim() || !escolaridade.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      await api.criarVaga(empresaId, descricao, escolaridade);
      setDescricao("");
      setEscolaridade("");
      onCreated(); // recarrega lista
    } catch (err: any) {
      setErro(err.message ?? "Erro ao criar vaga");
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <div>
        <label className="label">Descrição da vaga</label>
        <input
          className="input"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex.: Atendimento remoto"
          disabled={loading}
        />
      </div>

      <div>
        <label className="label">Escolaridade</label>
        <select
          className="input"
          value={escolaridade}
          onChange={(e) => setEscolaridade(e.target.value)}
          disabled={loading}
        >
          <option value="">Selecione...</option>
          <option value="Ensino Fundamental Completo">Ensino Fundamental Completo</option>
          <option value="Ensino Fundamental Incompleto">Ensino Fundamental Incompleto</option>
          <option value="Ensino Médio Completo">Ensino Médio Completo</option>
          <option value="Ensino Médio Incompleto">Ensino Médio Incompleto</option>
          <option value="Ensino Superior Completo">Ensino Superior Completo</option>
          <option value="Ensino Superior Completo">Ensino Superior Incompleto</option>
        </select>
      </div>
      {erro && <p className="error">{erro}</p>}
      <div className="flex justify-end">
        <button disabled={loading} className="btn btn-primary">
          {loading ? "Salvando..." : "Criar Vaga"}
        </button>
      </div>
    </form>
  );
}
