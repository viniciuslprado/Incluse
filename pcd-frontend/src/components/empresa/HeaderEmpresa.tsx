import React from "react";

export default function HeaderEmpresa({ nome }: { nome?: string }) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{nome ?? 'Empresa'}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">Notificações</button>
        <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">Configurações</button>
      </div>
    </header>
  );
}
