import { useState } from "react";

export default function ConfiguracoesPage() {
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(false);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Configurações</h2>
        <div className="text-sm text-gray-500">Gerencie sua conta</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 border rounded p-4">
          <h3 className="font-medium mb-2">Notificações</h3>
          <div className="flex items-center justify-between py-2">
            <div className="text-sm">E-mail</div>
            <input type="checkbox" checked={notifyEmail} onChange={(e)=>setNotifyEmail(e.target.checked)} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="text-sm">Push</div>
            <input type="checkbox" checked={notifyPush} onChange={(e)=>setNotifyPush(e.target.checked)} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border rounded p-4">
          <h3 className="font-medium mb-2">Conta</h3>
          <button className="px-3 py-2 rounded bg-red-600 text-white">Excluir conta</button>
        </div>
      </div>
    </div>
  );
}
