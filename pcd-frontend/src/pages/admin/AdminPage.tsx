import { NavLink, Outlet } from "react-router-dom";
export default function AdminPage() {
  const linkBase =
    "px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition";
  const linkActive = "bg-gray-200 dark:bg-gray-600";
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Topbar simples */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-page py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Admin</h1>
          <nav className="flex gap-2">
            <NavLink
              to="/admin/tipos"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
            >
              Tipos
            </NavLink>
            <NavLink
              to="/admin/subtipos"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
            >
              Subtipos
            </NavLink>
            <NavLink
  to="/admin/barreiras"
  className={({ isActive }) =>
    `${linkBase} ${isActive ? linkActive : ""}`
  }
>
  Barreiras
</NavLink>
            <NavLink
              to="/admin/acessibilidades"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
            >
              Acessibilidades
            </NavLink>

          </nav>
        </div>
      </header>

      {/* Conteúdo das rotas filhas */}
      <main className="container-page py-8">
        <Outlet />
      </main>
    </div>
  );
}
