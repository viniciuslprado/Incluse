// Navbar is rendered globally by `App.tsx`
import Footer from '../components/Footer';

export default function AcessibilidadePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Acessibilidade</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">Recursos e práticas que garantem que a plataforma seja utilizável por todas as pessoas.</p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
          <li>Suporte a navegação por teclado</li>
          <li>Contraste de cores adequados</li>
          <li>Compatibilidade com leitores de tela</li>
          <li>Marcação semântica e ARIA quando aplicável</li>
        </ul>
      </main>
      <Footer />
    </div>
  );
}
