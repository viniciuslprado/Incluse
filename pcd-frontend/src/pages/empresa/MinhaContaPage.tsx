import React from 'react';
import Footer from '../../components/Footer';

export default function MinhaContaPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
        <p className="text-gray-600">Preferências e notificações da empresa (placeholder).</p>
        <div className="mt-4">Notificações: <strong>ON</strong></div>
      </main>
      <Footer />
    </div>
  );
}
