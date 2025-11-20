import React from 'react';
import Footer from '../../components/Footer';

export default function SeguidoresPage() {
  const seguidores = [] as any[]; // placeholder

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Quem me Acompanha</h1>
        {seguidores.length === 0 ? (
          <div>Nenhum seguidor encontrado.</div>
        ) : (
          seguidores.map((s) => (
            <div key={s.id} className="p-3 border rounded mb-2">
              <div className="font-semibold">{s.nome}</div>
            </div>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
}
