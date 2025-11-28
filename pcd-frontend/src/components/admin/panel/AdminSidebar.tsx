
import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiBriefcase } from 'react-icons/fi';

export default function AdminSidebar() {
  const itemClass = (isActive: boolean) =>
    `block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-base ${isActive ? 'bg-gray-100 dark:bg-gray-800 font-semibold' : ''}`;

  return (
    <aside className="w-64 hidden md:block bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="px-4 pt-6 pb-2">
        <span className="block text-xl font-bold text-gray-800 dark:text-white mb-6">Painel do Administrador</span>
      </div>
      <div className="p-4 pt-0 space-y-2">
        <NavLink to="/admin/dashboard" className={({ isActive }) => itemClass(isActive)}><FiHome />Dashboard</NavLink>
        <NavLink to="/admin/empresas" className={({ isActive }) => itemClass(isActive)}><FiBriefcase />Empresas</NavLink>
        <NavLink to="/admin/candidatos" className={({ isActive }) => itemClass(isActive)}><FiUsers />Candidatos</NavLink>
        <NavLink to="/admin/vagas" className={({ isActive }) => itemClass(isActive)}><FiBriefcase />Vagas</NavLink>
        <hr className="my-2 border-gray-300 dark:border-gray-700" />
        <NavLink to="/admin/tipos" className={({ isActive }) => itemClass(isActive)}>Tipos de Deficiência</NavLink>
        <NavLink to="/admin/subtipos" className={({ isActive }) => itemClass(isActive)}>Subtipos</NavLink>
        <NavLink to="/admin/barreiras" className={({ isActive }) => itemClass(isActive)}>Barreiras</NavLink>
        <NavLink to="/admin/acessibilidades" className={({ isActive }) => itemClass(isActive)}>Acessibilidades</NavLink>
        <NavLink to="/admin/vinculos" className={({ isActive }) => itemClass(isActive)}>Vínculos</NavLink>
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }} className="w-full text-left block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Sair</button>
      </div>
    </aside>
  );
}
