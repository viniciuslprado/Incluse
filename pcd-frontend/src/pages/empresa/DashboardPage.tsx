import React from 'react';
import Footer from '../../components/Footer';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard da Empresa</h1>
        <p className="text-gray-600">Indicadores principais e atalhos rápidos (placeholder).</p>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded bg-white">Vagas Anunciadas: <strong>—</strong></div>
          <div className="p-4 border rounded bg-white">Currículos Salvos: <strong>—</strong></div>
          <div className="p-4 border rounded bg-white">Candidatos Recentes: <strong>—</strong></div>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Candidatos Recentes</h2>
          <div className="mt-2">Nenhum candidato encontrado.</div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
