import React from 'react';

type Props = {
  form: any;
  handleInput: (key: string, value: any) => void;
};

export default function Endereco({ form, handleInput }: Props) {
  return (
    <section id="endereco" className="space-y-4">
      <h3 className="font-semibold">Endereço</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <input value={form.rua} onChange={e => handleInput('rua', e.target.value)} placeholder="Rua (opcional)" className="p-3 border rounded md:col-span-2" />
        <input value={form.bairro} onChange={e => handleInput('bairro', e.target.value)} placeholder="Bairro (opcional)" className="p-3 border rounded" />
        <input value={form.cidade} onChange={e => handleInput('cidade', e.target.value)} placeholder="Cidade (opcional)" className="p-3 border rounded" />
        <input value={form.cep} onChange={e => handleInput('cep', e.target.value)} placeholder="CEP (opcional)" className="p-3 border rounded" />
      </div>
    </section>
  );
}
