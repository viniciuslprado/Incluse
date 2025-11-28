import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useToast } from '../../components/common/Toast';
import { FiBell, FiExternalLink } from 'react-icons/fi';

type Notificacao = { id: number; titulo: string; mensagem: string; lida: boolean; vagaId?: number; createdAt: string };

export default function NotificacoesPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const [items, setItems] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;
    async function carregar() {
      if (!candidatoId) return;
      try {
        // Obter token se necessário
        let token = localStorage.getItem('token');
        if (!token) {
          try {
            const devAuth = await api.getDevToken(candidatoId);
            localStorage.setItem('token', devAuth.token);
          } catch (devErr) {
            console.warn('Não foi possível obter token:', devErr);
          }
        }
        
        const data = await api.listarNotificacoes(candidatoId);
        if (mounted) setItems(data.notificacoes || []);
      } catch (err: any) {
        console.error('Erro ao carregar notificações:', err);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    carregar();
    return () => { mounted = false };
  }, [candidatoId]);

  async function openNotification(n: Notificacao) {
    if (!candidatoId) return;
    if (!n.lida) {
      try {
        await api.marcarNotificacaoLida(candidatoId, n.id);
        setItems(prev => prev.map(p => p.id === n.id ? { ...p, lida: true } : p));
      } catch (err) {
        console.error('Erro ao marcar notificação:', err);
      }
    }
    if (n.vagaId) {
      navigate(`/vagas/${n.vagaId}`);
    }
  }

  async function handleMarkAll() {
    if (!candidatoId) return;
    try {
      await api.marcarTodasNotificacoesLidas(candidatoId);
      setItems(prev => prev.map(p => ({ ...p, lida: true })));
      addToast({ type: 'success', title: 'Notificações', message: 'Todas as notificações foram marcadas como lidas.' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Erro', message: err?.message ?? 'Não foi possível marcar todas como lidas.' });
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
            <li key={item.id} className={`border rounded p-3 flex items-start gap-3 ${item.lida ? 'bg-white' : 'bg-sky-50 border-sky-200'}`}>
              <div className="pt-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.lida ? 'bg-gray-100 text-gray-600' : 'bg-sky-600 text-white'}`}>
                  <FiBell />
                </div>
              </div>
              <div className="flex-1">
                <button onClick={() => openNotification(item)} className="text-left w-full">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className={`font-semibold ${item.lida ? 'text-gray-800' : 'text-gray-900'}`}>{item.titulo}</div>
                      <div className="text-sm text-gray-600 truncate max-w-xl mt-1">{item.mensagem}</div>
                    </div>
                    {item.vagaId && (
                      <div className="ml-2 text-gray-400" aria-hidden>
                        <FiExternalLink />
                      </div>
                    )}
                  </div>
                </button>
                <div className="text-xs text-gray-400 mt-2">{new Date(item.createdAt).toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
