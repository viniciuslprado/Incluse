import React from "react";

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Termos de Uso</h1>
        <div className="text-gray-700 dark:text-gray-300 space-y-4 text-justify">
          <p>Bem-vindo à Incluse! Ao utilizar nossa plataforma, você concorda com os seguintes termos de uso:</p>
          <ul className="list-disc pl-6">
            <li>Você deve fornecer informações verdadeiras e atualizadas ao se cadastrar.</li>
            <li>É proibido utilizar a plataforma para fins ilícitos ou discriminatórios.</li>
            <li>O uso dos dados segue nossa Política de Privacidade.</li>
            <li>Reservamo-nos o direito de suspender contas que violem estes termos.</li>
            <li>Para dúvidas, entre em contato com nosso suporte.</li>
          </ul>
          <p>Estes termos podem ser atualizados periodicamente. Recomendamos revisá-los regularmente.</p>
        </div>
      </div>
    </div>
  );
}
