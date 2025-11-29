import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Barreira, SubtipoDeficiencia } from "../../types";
type Props = { onLinked: () => void };
export default function VincularBarreiraForm({ onLinked }: Props) {
    const [subtipos, setSubtipos] = useState<SubtipoDeficiencia[]>([]);
    const [barreiras, setBarreiras] = useState<Barreira[]>([]);
    const [subtipoId, setSubtipoId] = useState<number | "">("");
    const [barreiraIds, setBarreiraIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    useEffect(() => {
        // Aqui você pode definir um ID de deficiência padrão ou buscar todos os subtipos de todas as deficiências
        // Exemplo: buscar subtipos da deficiência 1
        Promise.all([
            api.listarSubtiposPorTipo(1), // Ajuste conforme necessário
            api.listarBarreiras()
        ])
            .then(([subs, bars]) => {
                setSubtipos(subs);
                setBarreiras(bars);
            })
            .catch((e) => setErro(e.message));
    }, []);
    //filtra o id que foi desmarcado
    function toggleBarreira(id: number) {
        setBarreiraIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro(null);

        if (!subtipoId || barreiraIds.length === 0) {
            setErro("Selecione um subtipo e ao menos uma barreira.");
            return;
        }
        setLoading(true);
        try {
            // Aqui você deve implementar a chamada correta para vincular barreiras ao subtipo, conforme sua API backend
            // Exemplo fictício:
            // await api.vincularBarreirasASubtipo(Number(subtipoId), barreiraIds);
            setBarreiraIds([]);
            setSubtipoId("");
            onLinked();
        } catch (e) {
            setErro(e instanceof Error ? e.message : "Erro ao vincular barreiras");
        } finally {
            setLoading(false);
        }
    }
    return (
        <form onSubmit={handleSubmit} className="card space-y-3">
            <div>
                <label className="label">Subtipo</label>
                <select
                    className="input"
                    value={subtipoId}
                    onChange={(e) =>
                        setSubtipoId(e.target.value ? Number(e.target.value) : "")
                    } // transforma em numero 
                    disabled={loading}
                >
                    <option value="">Selecione...</option>
                    {subtipos.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.nome}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="label">Barreiras</label>
                <div className="space-y-2">
                    {barreiras.map((b) => (
                        <label key={b.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={barreiraIds.includes(b.id)}
                                onChange={() => toggleBarreira(b.id)}
                                disabled={loading}
                            />
                            {b.descricao}
                        </label>
                    ))}
                </div>
            </div>
            {erro && <p className="error">{erro}</p>}
            <div className="flex justify-end">
                <button disabled={loading} className="btn btn-primary">
                    {loading ? "Salvando..." : "Vincular barreiras"}
                </button>
            </div>
        </form>
    );
}
