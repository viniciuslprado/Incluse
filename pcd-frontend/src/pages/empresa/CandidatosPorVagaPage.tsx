import React, { useEffect, useState } from 'react';
// Navbar is rendered globally by `App.tsx`
import Footer from '../../components/Footer';
import { api } from '../../lib/api';

export default function CandidatosPorVagaPage() {
  const [vagaId, setVagaId] = useState('1');
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchCandidatos() {
    setLoading(true);
    try {
      const data = await api.listarCandidatosPorVaga(Number(vagaId));
      setCandidatos(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCandidatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Candidatos por Vaga</h1>
        <div className="mb-4">
          <label className="block text-sm">Vaga ID</label>
          <input value={vagaId} onChange={(e) => setVagaId(e.target.value)} className="mt-1 p-2 border rounded" />
          <button onClick={fetchCandidatos} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">Buscar</button>
        </div>

        {loading ? (
          <div>Carregando...</div>
        ) : (
          <div className="space-y-3">
            {candidatos.length === 0 && <div>Nenhum candidato encontrado (simulação).</div>}
            {candidatos.map((c) => (
              <div key={c.id} className="p-3 border rounded">
                <div className="font-semibold">{c.nome}</div>
                <div className="text-sm text-gray-600">{c.email}</div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
