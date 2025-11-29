import { useEffect, useState } from "react";
import { useParams, Outlet, NavLink, useNavigate, useLocation, Navigate } from "react-router-dom";
import { api } from "../../lib/api";
import type { Empresa } from "../../types";
import { FiHome, FiUsers, FiSettings, FiFileText, FiMenu, FiPlusCircle, FiList, FiLogOut } from "react-icons/fi";

export default function EmpresaPage() {
  const { id } = useParams();
  const empresaId = Number(id || 0);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Checagem de permissão ANTES de renderizar qualquer coisa
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  if (!token) return <Navigate to="/login" replace />;
  if (userType !== 'empresa') return <div className="container-page py-8 text-red-600">Acesso negado. Esta área é exclusiva para empresas.</div>;
  if (Number(userId) !== empresaId) return <div className="container-page py-8 text-red-600">Acesso negado. Você não tem permissão para acessar esta empresa.</div>;

  useEffect(() => {
    async function carregar() {
      setErro(null);
      try {
        if (!id) return;
        const data = await api.buscarEmpresa(Number(id));
        setEmpresa(data);
      } catch (error: any) {
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          localStorage.removeItem('userId');
          setErro("Usuário não autorizado ou sessão expirada. Faça login novamente.");
          setTimeout(() => navigate('/login', { replace: true }), 2000);
          return;
        }
        setErro("Erro ao carregar dados da empresa");
      }
    }
    carregar();
  }, [id, navigate]);

  // Redirecionar para dashboard se estiver na rota raiz da empresa
  useEffect(() => {
    if (location.pathname === `/empresa/${empresaId}`) {
      navigate(`/empresa/${empresaId}/dashboard`, { replace: true });
    }
  }, [location.pathname, empresaId, navigate]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    navigate('/');
  }

  if (erro) {
    return <div className="container-page py-8 text-red-600">{erro}</div>;
  }

  if (!empresa) {
    return <div className="container-page py-8">Carregando...</div>;
  }

  const nome = empresa?.nome ?? 'Empresa';

  const menuItems = [
    { to: `/empresa/${empresaId}/dashboard`, icon: FiHome, label: 'Dashboard' },
    { to: `/empresa/${empresaId}/anunciar`, icon: FiPlusCircle, label: 'Anunciar Vaga' },
    { to: `/empresa/${empresaId}/gestao-vagas`, icon: FiList, label: 'Gestão de Vagas' },
    { to: `/empresa/${empresaId}/candidatos`, icon: FiUsers, label: 'Candidatos' },
    { to: `/empresa/${empresaId}/dados`, icon: FiFileText, label: 'Dados da Empresa' },
    { to: `/empresa/${empresaId}/configuracoes`, icon: FiSettings, label: 'Configurações' },
  ];

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex max-w-[1600px] mx-auto">
        {/* Drawer (mobile) */}
        {isDrawerOpen && (
          <div className="md:hidden fixed inset-0 bg-black/40 z-50" onClick={() => setIsDrawerOpen(false)}>
            <div className="w-72 bg-white dark:bg-gray-900 h-full p-3" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">Menu</div>
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsDrawerOpen(false)}
                      className={({isActive}) => 
                        `flex items-center gap-2 px-3 py-2 rounded ${
                          isActive 
                            ? 'bg-blue-50 dark:bg-blue-900/30 font-semibold text-blue-700 dark:text-blue-400' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
              <div className="mt-4 border-t pt-3">
                <button 
                  onClick={() => { setIsDrawerOpen(false); handleLogout(); }} 
                  className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <FiLogOut className="w-5 h-5" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}

        <aside className="hidden md:flex md:flex-col md:w-64 md:min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ml-2">
          <div className="p-4 sticky top-0">
            <div className="mb-4 flex items-center gap-3">
              <div>
                <img src="/vite.svg" alt="Logo" className="w-20 h-20 rounded-full object-cover border" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Olá,</div>
                <div className="text-lg font-semibold">{nome}</div>
              </div>
            </div>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({isActive}) => 
                      `flex items-center gap-2 px-3 py-2 rounded ${
                        isActive 
                          ? 'bg-blue-50 dark:bg-blue-900/30 font-semibold text-blue-700 dark:text-blue-400' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
            <div className="mt-4 border-t pt-3">
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <FiLogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          {/* Botão de menu para mobile */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden fixed bottom-4 right-4 z-40 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            aria-label="Abrir menu"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
