// import React from "react";
import { FiFileText } from "react-icons/fi";

export default function AdminLogsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiFileText className="text-2xl text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Logs do Sistema</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Aqui você pode visualizar os logs do sistema para auditoria e acompanhamento de eventos importantes.</p>
        {/* TODO: Integrar com API de logs do backend */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 text-sm text-gray-800 dark:text-gray-200 h-64 overflow-y-auto">
          <p>Exemplo de log: [2025-11-30 12:00] Usuário admin acessou o painel.</p>
          <p>Exemplo de log: [2025-11-30 12:05] Empresa XPTO cadastrada.</p>
          <p>Exemplo de log: [2025-11-30 12:10] Candidato João atualizou currículo.</p>
        </div>
      </div>
    </div>
  );
}
