import { Link } from 'react-router-dom';

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Política de Privacidade
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Última atualização: Janeiro de 2025
          </p>
        </div>

        {/* Conteúdo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 space-y-8">
          
          {/* Introdução */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              1. Introdução
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              O <strong>Incluse</strong> é uma plataforma digital que conecta pessoas com deficiência (PCD) 
              a oportunidades de trabalho em empresas comprometidas com a diversidade e inclusão. 
              Esta Política de Privacidade descreve como coletamos, usamos, compartilhamos e protegemos 
              suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/18).
            </p>
          </section>

          {/* Dados Coletados */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              2. Dados Pessoais Coletados
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  2.1 Dados de Candidatos PCD
                </h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>Nome completo, CPF, data de nascimento</li>
                  <li>Endereço de e-mail e telefone</li>
                  <li>Endereço residencial (CEP, cidade, estado)</li>
                  <li>Tipo de deficiência (informação sensível)</li>
                  <li>Experiência profissional e qualificações</li>
                  <li>Preferências de acessibilidade</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  2.2 Dados de Empresas
                </h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>Razão social e nome fantasia</li>
                  <li>CNPJ e inscrição estadual</li>
                  <li>Dados do representante legal</li>
                  <li>Informações de contato empresarial</li>
                  <li>Descrição das vagas e requisitos</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Finalidade */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              3. Finalidade do Tratamento
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Utilizamos seus dados pessoais para:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Criar e manter seu perfil na plataforma</li>
              <li>Conectar candidatos PCD com vagas adequadas</li>
              <li>Facilitar o processo de recrutamento inclusivo</li>
              <li>Personalizar recursos de acessibilidade</li>
              <li>Enviar comunicações relevantes sobre oportunidades</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Cumprir obrigações legais e regulamentares</li>
            </ul>
          </section>

          {/* Base Legal */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              4. Base Legal
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Dados Sensíveis (Tipo de Deficiência)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Base Legal:</strong> Consentimento explícito (Art. 11, II, 'a' da LGPD) - 
                  Tutela da saúde, em procedimento realizado por profissionais da área da saúde 
                  ou por entidades sanitárias, aplicado ao contexto de inclusão profissional.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para demais dados pessoais, utilizamos as seguintes bases legais:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4 mt-2">
                  <li><strong>Consentimento:</strong> Para comunicações de marketing</li>
                  <li><strong>Execução de contrato:</strong> Para prestação dos serviços</li>
                  <li><strong>Legítimo interesse:</strong> Para melhorias da plataforma</li>
                  <li><strong>Cumprimento de obrigação legal:</strong> Para atender regulamentações</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Compartilhamento */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              5. Compartilhamento de Dados
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Seus dados podem ser compartilhados apenas nas seguintes situações:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Com empresas parceiras, quando você se candidata a uma vaga</li>
              <li>Com prestadores de serviços técnicos (hospedagem, e-mail)</li>
              <li>Por determinação legal ou ordem judicial</li>
              <li>Para proteção dos direitos do Incluse em procedimentos legais</li>
            </ul>
            
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Importante:</strong> Nunca vendemos ou alugamos seus dados pessoais para terceiros.
              </p>
            </div>
          </section>

          {/* Segurança */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              6. Segurança dos Dados
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Implementamos medidas técnicas e organizacionais para proteger seus dados:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Controle de acesso com autenticação multifator</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Backups seguros e plano de recuperação</li>
              <li>Treinamento regular da equipe sobre privacidade</li>
            </ul>
          </section>

          {/* Retenção */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              7. Retenção de Dados
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Mantemos seus dados pelo tempo necessário para as finalidades descritas:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Contas ativas:</strong> Durante a utilização da plataforma</li>
                <li><strong>Contas inativas:</strong> 2 anos após o último acesso</li>
                <li><strong>Dados de candidatura:</strong> 5 anos conforme legislação trabalhista</li>
                <li><strong>Dados fiscais:</strong> 5 anos conforme legislação tributária</li>
              </ul>
            </div>
          </section>

          {/* Direitos do Titular */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              8. Seus Direitos
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Conforme a LGPD, você tem os seguintes direitos sobre seus dados pessoais:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Confirmação e Acesso</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Saber se tratamos seus dados e acessá-los</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Correção</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Atualizar dados incompletos ou incorretos</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Eliminação</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Solicitar exclusão de dados desnecessários</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Portabilidade</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Transferir dados para outro fornecedor</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Oposição</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Opor-se ao tratamento com base no legítimo interesse</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Revogação</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Retirar o consentimento a qualquer momento</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contato DPO */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              9. Encarregado de Dados (DPO)
            </h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, 
                entre em contato com nosso Encarregado de Dados:
              </p>
              <div className="space-y-2">
                <p className="text-gray-900 dark:text-gray-100">
                  <strong>E-mail:</strong> dpo@incluse.com.br
                </p>
                <p className="text-gray-900 dark:text-gray-100">
                  <strong>Telefone:</strong> (11) 99999-9999
                </p>
                <p className="text-gray-900 dark:text-gray-100">
                  <strong>Horário:</strong> Segunda a sexta, 9h às 18h
                </p>
              </div>
            </div>
          </section>

          {/* Alterações */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              10. Alterações na Política
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Esta Política de Privacidade pode ser atualizada periodicamente. 
              Notificaremos sobre mudanças significativas por e-mail ou através da plataforma. 
              Recomendamos revisar esta página regularmente para estar ciente de quaisquer alterações.
            </p>
          </section>

          {/* ANPD */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              11. Autoridade Nacional de Proteção de Dados (ANPD)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Se não ficar satisfeito com nossas respostas, você pode contactar a ANPD através do site 
              <a 
                href="https://www.gov.br/anpd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                www.gov.br/anpd
              </a> 
              ou pelo telefone 0800-607-0745.
            </p>
          </section>
        </div>

        {/* Footer da página */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link 
              to="/" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              ← Voltar à página inicial
            </Link>
            <Link 
              to="/faq" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Perguntas Frequentes
            </Link>
            <Link 
              to="/vagas" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Ver Vagas Disponíveis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}