import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Outlet, NavLink } from 'react-router-dom';
import { FiMenu, FiHome, FiUsers, FiBriefcase, FiFileText, FiLogOut } from 'react-icons/fi';

const adminMenuItems = [
  { to: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/admin/empresas', icon: FiBriefcase, label: 'Empresas' },
  { to: '/admin/candidatos', icon: FiUsers, label: 'Candidatos' },
  { to: '/admin/vagas', icon: FiBriefcase, label: 'Vagas' },
  { to: '/admin/gestao-acessibilidade', icon: FiFileText, label: 'Gestão de Acessibilidade' },
  { to: '/admin/logs', icon: FiFileText, label: 'Logs do Sistema' },
];

export default function AdminLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar desktop */}
      <AdminSidebar />

      {/* Drawer mobile */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-[60]" onClick={() => setIsDrawerOpen(false)}>
          <div
            className="w-72 max-w-full bg-white dark:bg-gray-900 h-full flex flex-col p-3 pb-24 fixed left-0 top-0 bottom-0 z-[61]"
            style={{ maxHeight: '100vh', paddingBottom: '5.5rem' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Menu</div>
            </div>
            <nav className="space-y-2 flex-1 overflow-y-auto">
              {adminMenuItems.map((item) => {
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

      {/* Botão menu mobile */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="md:hidden fixed bottom-4 right-4 z-40 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Abrir menu"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      <main className="flex-1 flex flex-col items-center px-4 py-8 md:px-8">
        <div className="w-full max-w-5xl">
          {/* Header removido para visual mais limpo */}
          <div className="">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
