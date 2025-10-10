import { useEffect, useState } from "react";
import { useParams, NavLink, Outlet } from "react-router-dom";
import { api } from "../../lib/api";
import type { Empresa } from "../../types";

export default function EmpresaPage() {
  const { id } = useParams();
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
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">
          {empresa.nome} 
        </h1>
        <h3 className="font-bold text-xl">
          
        </h3>
        <nav className="space-x-4">
          <NavLink
            to={`/empresa/${empresa.id}/vagas`}
            className={({ isActive }) =>
              isActive
                ? "font-semibold underline"
                : "hover:underline text-blue-100"
            }
          >
            Minhas Vagas
          </NavLink>
        </nav>
        
      </header>
           
       
     
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
