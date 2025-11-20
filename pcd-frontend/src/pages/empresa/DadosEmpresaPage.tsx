import React from 'react';
import Footer from '../../components/Footer';

export default function DadosEmpresaPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Dados da Empresa</h1>
        <p className="text-gray-600">Editar perfil da empresa: nome, CNPJ, contato e endereço (placeholder).</p>
        <div className="mt-4">Formulário de edição em breve.</div>
      </main>
      <Footer />
    </div>
  );
}
