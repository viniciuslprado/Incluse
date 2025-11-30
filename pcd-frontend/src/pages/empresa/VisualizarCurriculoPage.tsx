import React from "react";
import { FiFileText } from "react-icons/fi";

export default function VisualizarCurriculoPage() {
  // TODO: Integrar com API para buscar dados do currículo do candidato
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiFileText className="text-2xl text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Currículo do Candidato</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Visualize as informações detalhadas do currículo do candidato selecionado.</p>
        <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 text-sm text-gray-800 dark:text-gray-200 h-64 overflow-y-auto">
          <p><strong>Nome:</strong> João da Silva</p>
          <p><strong>Email:</strong> joao@email.com</p>
          <p><strong>Formação:</strong> Ensino Superior Completo</p>
          <p><strong>Experiência:</strong> 2 anos como Analista de Sistemas</p>
          <p><strong>Competências:</strong> React, Node.js, SQL</p>
          {/* Adicione mais campos conforme necessário */}
        </div>
      </div>
    </div>
  );
}
