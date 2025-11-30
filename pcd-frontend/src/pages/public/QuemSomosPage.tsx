// Navbar is rendered globally by `App.tsx`

import { FaGlobe, FaHandshake, FaBookOpen, FaLightbulb, FaEnvelope } from 'react-icons/fa6';
import Footer from '../../components/Footer';

export default function QuemSomosPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Quem Somos</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          A <strong>Incluse</strong> é uma plataforma criada para aproximar Pessoas com Deficiência (PCDs) de empresas verdadeiramente comprometidas com a inclusão. Nosso propósito é reduzir barreiras, ampliar o acesso ao mercado de trabalho e fortalecer um ecossistema onde a diversidade não seja apenas um discurso, mas uma prática diária.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          Acreditamos que inclusão é construída com respeito, responsabilidade e oportunidade — e que cada pessoa merece encontrar um ambiente de trabalho onde suas habilidades sejam reconhecidas e valorizadas.
        </p>

        <section className="mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Nossa Missão</h2>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <span className="mt-1 text-blue-600 dark:text-blue-400"><FaGlobe size={28} /></span>
              <div>
                <strong className="block">Tecnologia realmente acessível</strong>
                <span className="text-gray-700 dark:text-gray-300">Criamos ferramentas e experiências digitais pensadas desde o início para diferentes necessidades, garantindo navegação segura, intuitiva e inclusiva.</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-1 text-blue-600 dark:text-blue-400"><FaHandshake size={28} /></span>
              <div>
                <strong className="block">Conexão entre talentos e empresas conscientes</strong>
                <span className="text-gray-700 dark:text-gray-300">Trabalhamos ao lado de organizações que enxergam a diversidade como um valor estratégico, humano e transformador — não como obrigação.</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-1 text-blue-600 dark:text-blue-400"><FaBookOpen size={28} /></span>
              <div>
                <strong className="block">Informação, orientação e boas práticas</strong>
                <span className="text-gray-700 dark:text-gray-300">Produzimos conteúdo de qualidade para apoiar candidatos e empresas, fortalecendo uma cultura de inclusão, empregabilidade e desenvolvimento contínuo.</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-1 text-blue-600 dark:text-blue-400"><FaLightbulb size={28} /></span>
              <div>
                <strong className="block">Impacto social real</strong>
                <span className="text-gray-700 dark:text-gray-300">Nosso objetivo é contribuir para um mercado mais justo, onde oportunidades cheguem a todas as pessoas e onde empresas possam evoluir suas práticas de acessibilidade e inclusão.</span>
              </div>
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Contato</h2>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 leading-relaxed">
            <FaEnvelope className="text-blue-600 dark:text-blue-400" />
            <span>inclusepcd@gmail.com</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Quer apoiar o projeto, enviar sugestões ou cadastrar sua empresa na plataforma? Fale com a gente!</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
