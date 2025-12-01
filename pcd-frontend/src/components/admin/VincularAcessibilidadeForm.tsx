import { useState, useEffect } from "react";
import CustomSelect from '../common/CustomSelect';
import { api } from "../../lib/api";
import type { Barreira, Acessibilidade } from "../../types";

type Props = {
  onLinked: () => void;
};

export default function VincularAcessibilidadeForm({ onLinked }: Props) {
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [acessibilidades, setAcessibilidades] = useState<Acessibilidade[]>([]);
  const [barreiraId, setBarreiraId] = useState<number | null>(null);
  const [acessibilidadeIds, setAcessibilidadeIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carrega dados iniciais
  useEffect(() => {
    async function carregar() {
      try {
        const [barreirasData, acessibilidadesData] = await Promise.all([
          api.listarBarreiras(),
          api.listarAcessibilidadesPublicas()
        ]);
        setBarreiras(barreirasData);
        setAcessibilidades(acessibilidadesData);
      } catch {
        setErro("Erro ao carregar dados");
      }
    }
    carregar();
  }, []);

  const handleAcessibilidadeChange = (id: number, checked: boolean) => {
    if (checked) {
      setAcessibilidadeIds(prev => [...prev, id]);
    } else {
      setAcessibilidadeIds(prev => prev.filter(aId => aId !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!barreiraId) {
      setErro("Selecione uma barreira.");
      return;
    }

    if (acessibilidadeIds.length === 0) {
      setErro("Selecione pelo menos uma acessibilidade.");
      return;
    }

    setLoading(true);
    try {
      await api.vincularAcessibilidadesABarreira(barreiraId, acessibilidadeIds);
      setBarreiraId(null);
      setAcessibilidadeIds([]);
      onLinked();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao vincular acessibilidades");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-lg font-semibold">Vincular Acessibilidades a Barreira</h3>
      
      <div>
        <label className="label">Barreira</label>
        <CustomSelect
          value={barreiraId?.toString() ?? ''}
          onChange={(v: string) => setBarreiraId(v ? Number(v) : null)}
          options={[
            { value: '', label: 'Selecione uma barreira...' },
            ...barreiras.map(b => ({ value: b.id.toString(), label: b.descricao }))
          ]}
          disabled={loading || !barreiras.length}
          className="input"
        />
      </div>
      <div>
        <label className="label">Acessibilidades</label>
        {acessibilidades.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma acessibilidade disponível.</p>
        ) : (
          acessibilidades.map(acessibilidade => (
            <label key={acessibilidade.id} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={acessibilidadeIds.includes(acessibilidade.id)}
                onChange={e => handleAcessibilidadeChange(acessibilidade.id, e.target.checked)}
                disabled={loading}
                className="rounded"
              />
              <span className="text-sm">{acessibilidade.descricao}</span>
            </label>
          ))
        )}
      </div>

      {erro && <p className="error">{erro}</p>}

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={loading || !barreiraId || acessibilidadeIds.length === 0} 
          className="btn btn-primary"
        >
          {loading ? "Vinculando..." : "Vincular Acessibilidades"}
        </button>
      </div>
    </form>
  );
}