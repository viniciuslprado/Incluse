import React from 'react';
import Footer from '../../components/Footer';

export default function ServicoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Serviço Ativo (Plano)</h1>
        <p className="text-gray-600">Informações do plano atual e histórico de pagamentos (placeholder).</p>
      </main>
      <Footer />
    </div>
  );
}
