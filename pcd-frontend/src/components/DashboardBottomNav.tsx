import { NavLink, useParams } from "react-router-dom";
import { FiHome, FiBookmark, FiBell, FiUser, FiBriefcase } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { getSavedIds, getNotificationsCount } from '../lib/localStorage';

export default function DashboardBottomNav() {
  const { id } = useParams();
  const cid = id ?? 'me';

  // Versão enxuta: apenas 5 itens principais
  const items = [
    { name: 'Início', to: `/candidato/${cid}/inicio`, icon: <FiHome />, key: 'home' },
    { name: 'Favoritas', to: `/candidato/${cid}/favoritas`, icon: <FiBookmark />, key: 'favoritas' },
    { name: 'Candidaturas', to: `/candidato/${cid}/minhas-candidaturas`, icon: <FiBriefcase />, key: 'candidaturas' },
    { name: 'Notificações', to: `/candidato/${cid}/notificacoes`, icon: <FiBell />, key: 'notificacoes' },
    { name: 'Perfil', to: `/candidato/${cid}/perfil`, icon: <FiUser />, key: 'perfil' },
  ];

  const [savedCount, setSavedCount] = useState<number>(0);
  const [notifCount, setNotifCount] = useState<number>(0);

  useEffect(() => {
    const idNum = Number(cid === 'me' ? 0 : cid);
    setSavedCount(getSavedIds(idNum).length);
    setNotifCount(getNotificationsCount(idNum));

    function onStorage() {
      // recompute counts when storage changes
      setSavedCount(getSavedIds(idNum).length);
      setNotifCount(getNotificationsCount(idNum));
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [cid]);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
      <ul className="flex justify-between max-w-3xl mx-auto px-3 py-2 h-14">
        {items.map((it) => (
          <li key={it.key} className="flex-1 text-center relative">
            <NavLink
              to={it.to}
              aria-label={it.name}
              className={({isActive}) => (isActive ? 'text-incluse-primary font-semibold flex flex-col items-center gap-0 p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-incluse-primary' : 'text-gray-600 flex flex-col items-center gap-0 p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-incluse-primary')}
            >
              {({ isActive }) => (
                <>
                  <div className="text-xl">{it.icon}</div>
                  <div className={isActive ? 'text-xs mt-1' : 'text-[11px] mt-1 opacity-80'}>{it.name}</div>
                </>
              )}
            </NavLink>

            {/* badges */}
            {it.key === 'favoritas' && savedCount > 0 && (
              <span className="absolute -top-0.5 right-6 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-incluse-accent rounded-full">{savedCount}</span>
            )}
            {it.key === 'notificacoes' && notifCount > 0 && (
              <span className="absolute -top-0.5 right-6 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-500 rounded-full">{notifCount}</span>
            )}
          </li>
        ))}
      </ul>
      
    </nav>
  );
}
