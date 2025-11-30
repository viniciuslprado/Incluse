import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useToast } from '../../components/common/Toast';
import { FiBell, FiExternalLink } from 'react-icons/fi';

// Ajuste o tipo conforme o retorno real da sua API
export type NotificacaoEmpresa = {
  id: number;
  titulo: string;
  mensagem: string;
  lida: boolean;
  vagaId?: number;
  createdAt: string;
};

export default function EmpresaNotificacoesPage() {
  // Supondo que o id da empresa está no localStorage ou contexto
  const empresaId = Number(localStorage.getItem('empresaId'));
  const [items, setItems] = useState<NotificacaoEmpresa[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;
    async function carregar() {
      if (!empresaId) {
        setItems([]);
        setLoading(false);
        return;
      }
      try {
        const data = await api.listarNotificacoesEmpresa(empresaId);
        // Garante que sempre será array, mesmo se vier undefined, null ou estrutura inesperada
        let notificacoes: any[] = [];
        if (Array.isArray(data)) {
          notificacoes = data;
        } else if (data && Array.isArray(data.notificacoes)) {
          notificacoes = data.notificacoes;
        }
        if (mounted) setItems(notificacoes);
      } catch (err: any) {
        console.error('Erro ao carregar notificações:', err);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    carregar();
    return () => { mounted = false };
  }, [empresaId]);

  async function openNotification(n: NotificacaoEmpresa) {
    if (!empresaId) return;
    if (!n.lida) {
      try {
        await api.marcarNotificacaoEmpresaLida(empresaId, n.id);
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
    if (!empresaId) return;
    try {
      await api.marcarTodasNotificacoesEmpresaLidas(empresaId);
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
          <h2 className="text-2xl font-semibold">Notificações da Empresa</h2>
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
