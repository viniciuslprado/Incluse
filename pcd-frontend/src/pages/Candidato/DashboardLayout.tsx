import { NavLink, Outlet, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { CandidateProvider } from "../../contexts/CandidateContext";
import DashboardBottomNav from "../../components/DashboardBottomNav";
import { FiMenu, FiUser, FiHome, FiBookmark, FiBriefcase, FiBell, FiFileText, FiSettings } from 'react-icons/fi';

export default function DashboardLayout() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const [nome, setNome] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!candidatoId || candidatoId <= 0) return;
    api.getCandidato(candidatoId)
      .then((c: any) => setNome(c?.nome ?? null))
      .catch((err: any) => {
        setNome(null);
        // Se candidato não existe, redirecionar para home
        if (err?.status === 404) {
          localStorage.clear();
          navigate('/');
        }
      });
  }, [candidatoId, navigate]);

  useEffect(() => {
    function avatarChanged(e: Event) {
      const ev = e as CustomEvent;
      if (!ev?.detail) return;
      const { id: changedId, data } = ev.detail;
      if (changedId === candidatoId) setAvatarUrl(data || null);
    }
    window.addEventListener('candidateAvatarChanged', avatarChanged as EventListener);
    // load avatar from localStorage
    const av = localStorage.getItem(`candidate_avatar_${candidatoId}`);
    if (av) setAvatarUrl(av);
    return () => { 
      window.removeEventListener('candidateAvatarChanged', avatarChanged as EventListener);
    };
  }, [candidatoId]);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div className="min-h-screen flex flex-col bg-sky-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] mx-auto w-full min-h-0">
        {/* Mobile top bar */}
        <div className="md:hidden w-full mb-1 flex items-center justify-between py-1 px-2">
          <div>
            <div className="text-xs text-gray-600">Olá,</div>
            <div className="font-medium text-sm">{nome ?? `Candidato ${candidatoId}`}</div>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Abrir menu" title="Menu" onClick={() => setIsDrawerOpen(true)} className="p-1 rounded bg-gray-100 dark:bg-gray-800">
              <FiMenu className="w-4 h-4 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        </div>

        {/* Drawer (mobile) */}
        {isDrawerOpen && (
          <div className="md:hidden fixed inset-0 bg-black/40 z-[60]" onClick={() => setIsDrawerOpen(false)}>
            <div
              className="w-72 max-w-full bg-white dark:bg-gray-900 h-full flex flex-col p-3 pb-24 fixed left-0 top-0 bottom-0 z-[61]"
              style={{ maxHeight: '100vh', paddingBottom: '5.5rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4">
                <div className="text-sm text-gray-600">Menu</div>
              </div>
              <nav className="space-y-2 flex-1 overflow-y-auto">
                <NavLink to={`/candidato/${candidatoId}`} end onClick={() => setIsDrawerOpen(false)} className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiHome/> Início</NavLink>
                <NavLink to={`/candidato/${candidatoId}/favoritas`} onClick={() => setIsDrawerOpen(false)} className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiBookmark/> Vagas Favoritas</NavLink>
                <NavLink to={`/candidato/${candidatoId}/minhas-candidaturas`} onClick={() => setIsDrawerOpen(false)} className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiBriefcase/> Minhas Candidaturas</NavLink>
                <NavLink to={`/candidato/${candidatoId}/curriculo`} onClick={() => setIsDrawerOpen(false)} className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiFileText/> Meu Currículo</NavLink>
                <NavLink to={`/candidato/${candidatoId}/perfil`} onClick={() => setIsDrawerOpen(false)} className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiUser/> Perfil</NavLink>
                <NavLink to={`/candidato/${candidatoId}/notificacoes`} onClick={() => setIsDrawerOpen(false)} className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiBell/> Notificações</NavLink>
                <NavLink to={`/candidato/${candidatoId}/faq`} onClick={() => setIsDrawerOpen(false)} className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiFileText/> FAQ</NavLink>
                <NavLink to={`/candidato/${candidatoId}/configuracoes`} onClick={() => setIsDrawerOpen(false)} className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiSettings/> Configurações</NavLink>
              </nav>
              <div className="mt-4 border-t pt-3">
                <button onClick={() => { setIsDrawerOpen(false); handleLogout(); }} className="w-full text-left px-3 py-2 rounded text-sm text-red-600">Sair</button>
              </div>
            </div>
          </div>
        )}

        <aside className="hidden md:flex md:flex-col md:w-64 md:min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ml-2">
          <div className="p-4 sticky top-0">
            <div className="mb-4 flex items-center gap-3">
                <div>
                  <img src={avatarUrl ?? '/vite.svg'} alt="Avatar" className="w-20 h-20 rounded-full object-cover border" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Olá,</div>
                  <div className="text-lg font-semibold">{nome ?? `Candidato ${candidatoId}`}</div>
                </div>
              </div>
            <nav className="space-y-2">
              <NavLink to={`/candidato/${candidatoId}`} end className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiHome/> Início</NavLink>
              <NavLink to={`/candidato/${candidatoId}/favoritas`} className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiBookmark/> Vagas Favoritas</NavLink>
              <NavLink to={`/candidato/${candidatoId}/minhas-candidaturas`} className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiBriefcase/> Minhas Candidaturas</NavLink>
              <NavLink to={`/candidato/${candidatoId}/curriculo`} className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiFileText/> Meu Currículo</NavLink>
              <NavLink to={`/candidato/${candidatoId}/perfil`} className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiUser/> Perfil</NavLink>
              <NavLink to={`/candidato/${candidatoId}/notificacoes`} className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiBell/> Notificações</NavLink>
              <NavLink to={`/candidato/${candidatoId}/faq`} className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiFileText/> FAQ</NavLink>
              <NavLink to={`/candidato/${candidatoId}/configuracoes`} className={({isActive}) => isActive ? 'flex items-center gap-2 px-3 py-2 rounded bg-blue-50 font-semibold' : 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50'}><FiSettings/> Configurações</NavLink>
            </nav>
            <div className="mt-4 border-t pt-3">
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded text-sm text-red-600">Sair</button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-h-0 overflow-auto">
          <div className="p-4 md:p-6 pb-24 md:pb-6">
            <CandidateProvider candidatoId={candidatoId}>
              <Outlet />
            </CandidateProvider>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <DashboardBottomNav />
    </div>
  );
}
