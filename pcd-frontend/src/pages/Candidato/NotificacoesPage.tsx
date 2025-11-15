import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../lib/localStorage';
import { useToast } from '../../components/ui/Toast';
import { FiBell, FiExternalLink } from 'react-icons/fi';

type Notificacao = { id: string | number; title?: string; message?: string; read?: boolean; link?: string; createdAt?: string };

export default function NotificacoesPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const [items, setItems] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    if (!candidatoId) return;
    setLoading(true);
    const raw = getNotifications(candidatoId) as any[];
    const normalized = (raw || []).map(n => ({ id: n.id, title: n.title ?? n.title ?? 'Notificação', message: n.message ?? n.body ?? '', read: Boolean(n.read), link: n.link, createdAt: n.createdAt || n.date }));
    setItems(normalized);
    setLoading(false);
  }, [candidatoId]);

  function openNotification(n: Notificacao) {
    if (!candidatoId) return;
    if (!n.read) {
      const ok = markNotificationRead(candidatoId, n.id);
      if (ok) setItems(prev => prev.map(p => p.id === n.id ? { ...p, read: true } : p));
    }
    if (n.link) {
      if (n.link.startsWith('/')) navigate(n.link);
      else window.open(n.link, '_blank');
    }
  }

  function handleMarkAll() {
    if (!candidatoId) return;
    const ok = markAllNotificationsRead(candidatoId);
    if (ok) {
      setItems(prev => prev.map(p => ({ ...p, read: true })));
      addToast({ type: 'success', title: 'Notificações', message: 'Todas as notificações foram marcadas como lidas.' });
    } else {
      addToast({ type: 'error', title: 'Erro', message: 'Não foi possível marcar todas como lidas.' });
    }
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiBell className="w-6 h-6 text-sky-600" />
          <h2 className="text-2xl font-semibold">Notificações</h2>
        </div>
        <div>
          <button onClick={handleMarkAll} className="px-3 py-1 rounded bg-sky-50 text-sky-700 hover:bg-sky-100">Marcar todas como lidas</button>
        </div>
      </header>

      {loading ? (
        <p>Carregando notificações...</p>
      ) : items.length === 0 ? (
        <div className="text-gray-600">Nenhuma notificação.</div>
      ) : (
        <ul className="space-y-2">
          {items.map(item => (
            <li key={String(item.id)} className={`border rounded p-3 flex items-start gap-3 ${item.read ? 'bg-white' : 'bg-sky-50 border-sky-200'}`}>
              <div className="pt-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.read ? 'bg-gray-100 text-gray-600' : 'bg-sky-600 text-white'}`}>
                  <FiBell />
                </div>
              </div>
              <div className="flex-1">
                <button onClick={() => openNotification(item)} className="text-left w-full">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className={`font-semibold ${item.read ? 'text-gray-800' : 'text-gray-900'}`}>{item.title}</div>
                      <div className="text-sm text-gray-600 truncate max-w-xl mt-1">{item.message}</div>
                    </div>
                    {item.link && (
                      <div className="ml-2 text-gray-400" aria-hidden>
                        <FiExternalLink />
                      </div>
                    )}
                  </div>
                </button>
                <div className="text-xs text-gray-400 mt-2">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
