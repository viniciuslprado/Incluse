import { useEffect, useState } from "react";
import { useParams, Outlet } from "react-router-dom";
import { api } from "../../lib/api";
import type { Empresa } from "../../types";
import SidebarEmpresa from "../../components/empresa/SidebarEmpresa";
import HeaderEmpresa from "../../components/empresa/HeaderEmpresa";

export default function EmpresaPage() {
  const { id } = useParams();
  const empresaId = Number(id || 0);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      setErro(null);
      try {
        if (!id) return;
        const data = await api.buscarEmpresa(Number(id));
        setEmpresa(data);
      } catch {
        setErro("Erro ao carregar dados da empresa");
      }
    }
    carregar();
  }, [id]);

  if (erro) {
    return <div className="container-page py-8 text-red-600">{erro}</div>;
  }

  if (!empresa) {
    return <div className="container-page py-8">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="md:flex">
        <SidebarEmpresa empresaId={empresaId} />
        <div className="flex-1 min-w-0">
          <HeaderEmpresa nome={empresa.nome} />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
