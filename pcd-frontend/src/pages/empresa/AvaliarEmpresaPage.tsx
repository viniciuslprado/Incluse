import { useParams } from "react-router-dom";
import EmpresaAvaliar from "../../components/EmpresaAvaliar";
import { useState, useEffect } from "react";
import { api } from "../../lib/api";

export default function AvaliarEmpresaPage() {
  const { id } = useParams();
  const empresaId = Number(id);
  const [empresaNome, setEmpresaNome] = useState<string | null>(null);

  useEffect(() => {
    if (!empresaId || empresaId <= 0) return;
    api.buscarEmpresa(empresaId).then((e: any) => setEmpresaNome(e?.nome ?? null)).catch(() => setEmpresaNome(null));
  }, [empresaId]);

  if (!empresaId || empresaId <= 0) return <div className="p-6">Empresa inválida</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Avaliar empresa</h1>
      <p className="text-gray-600 mb-4">Empresa: {empresaNome ?? empresaId}</p>

      <EmpresaAvaliar empresaId={empresaId} />
    </div>
  );
}
