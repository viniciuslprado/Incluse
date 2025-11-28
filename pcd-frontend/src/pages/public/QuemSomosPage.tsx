// Navbar is rendered globally by `App.tsx`
import Footer from '../components/Footer';

export default function QuemSomosPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Quem Somos</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          A Incluse é uma plataforma dedicada a conectar pessoas com deficiência a vagas de emprego em empresas
          comprometidas com a inclusão. Nosso objetivo é reduzir barreiras e facilitar oportunidades.
        </p>
        <section className="mt-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Nossa missão</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Promover a inclusão profissional por meio de tecnologia acessível, parcerias com empresas e informação.</p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Contato</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Se quiser contribuir com a plataforma ou listar sua empresa, entre em contato pelo e-mail: contato@incluse.local</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
