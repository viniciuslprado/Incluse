import { NavLink } from "react-router-dom";

export default function SidebarEmpresa({ empresaId }: { empresaId: number }) {
  const base = `/empresas/${empresaId}`;
  const itemClass = (isActive: boolean) =>
    `block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? 'bg-gray-100 dark:bg-gray-800 font-semibold' : ''}`;

  return (
    <aside className="w-64 hidden md:block bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 space-y-2">
        <NavLink to={`${base}/dashboard`} className={({ isActive }) => itemClass(isActive)}>Dashboard</NavLink>
        <NavLink to={`${base}/anunciar`} className={({ isActive }) => itemClass(isActive)}>Anunciar Vaga</NavLink>
        <NavLink to={`${base}/vagas`} className={({ isActive }) => itemClass(isActive)}>Vagas Anunciadas</NavLink>
        <NavLink to={`${base}/candidatos`} className={({ isActive }) => itemClass(isActive)}>Candidatos por Vaga</NavLink>
        <NavLink to={`${base}/minha-conta`} className={({ isActive }) => itemClass(isActive)}>Minha Conta</NavLink>
        <NavLink to={`${base}/dados`} className={({ isActive }) => itemClass(isActive)}>Dados da Empresa</NavLink>
        <NavLink to={`${base}/seguidores`} className={({ isActive }) => itemClass(isActive)}>Quem me Acompanha</NavLink>
        <NavLink to={`${base}/servico`} className={({ isActive }) => itemClass(isActive)}>Serviço Ativo</NavLink>
        <NavLink to={`${base}/seguranca/alterar-senha`} className={({ isActive }) => itemClass(isActive)}>Alterar Senha</NavLink>
        <NavLink to={`${base}/seguranca/excluir`} className={({ isActive }) => itemClass(isActive)}>Excluir Conta</NavLink>
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }} className="w-full text-left block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Sair</button>
      </div>
    </aside>
  );
}
