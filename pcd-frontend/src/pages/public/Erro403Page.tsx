import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default function Erro403Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <FiAlertTriangle className="mx-auto text-5xl text-yellow-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Acesso Negado</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Você não tem permissão para acessar esta página.</p>
        <a href="/" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Voltar para o início</a>
      </div>
    </div>
  );
}
