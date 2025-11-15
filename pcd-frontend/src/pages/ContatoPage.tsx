import React, { useState } from 'react';
// Navbar is rendered globally by `App.tsx`
import Footer from '../components/Footer';

export default function ContatoPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de envio — implementar endpoint real quando disponível
    setStatus('Mensagem enviada. Retornaremos em breve.');
    setNome(''); setEmail(''); setMensagem('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Contato</h1>
        <p className="mb-6 text-gray-600">Use este formulário para entrar em contato conosco sobre dúvidas, suporte ou parcerias.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nome</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Mensagem</label>
            <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} className="mt-1 block w-full p-2 border rounded" rows={6} />
          </div>
          {status && <div className="text-green-600">{status}</div>}
          <div>
            <button className="px-4 py-2 bg-incluse-primary text-white rounded">Enviar</button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
