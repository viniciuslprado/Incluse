import React, { useState } from 'react';
// Navbar is rendered globally by `App.tsx`
import Footer from '../../components/Footer';
import { api } from '../../lib/api';

export default function AnunciarVagaPage() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [escolaridade, setEscolaridade] = useState('Ensino Médio Completo');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSuccess(null);
    setLoading(true);
    try {
      // Placeholder: empresaId should come from logged-in company context
      await api.anunciarVaga({ empresaId: 1, titulo, descricao, escolaridade });
      setSuccess('Vaga anunciada com sucesso (simulação).');
      setTitulo('');
      setDescricao('');
    } catch (err: any) {
      setErro(err?.message ?? 'Erro ao anunciar vaga');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Anunciar Vaga</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Título</label>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Descrição</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} className="mt-1 block w-full p-2 border rounded" rows={6} />
          </div>
          <div>
            <label className="block text-sm font-medium">Escolaridade</label>
            <select value={escolaridade} onChange={(e) => setEscolaridade(e.target.value)} className="mt-1 block w-full p-2 border rounded">
              <option>Ensino Médio Completo</option>
              <option>Ensino Superior Completo</option>
              <option>Ensino Superior Incompleto</option>
            </select>
          </div>
          {erro && <div className="text-red-600">{erro}</div>}
          {success && <div className="text-green-600">{success}</div>}
          <div>
            <button disabled={loading} className="px-4 py-2 bg-incluse-primary text-white rounded">{loading ? 'Enviando...' : 'Anunciar Vaga'}</button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
