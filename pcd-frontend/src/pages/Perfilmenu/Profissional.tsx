import React from 'react';

import type { Candidato } from '../../types';
type Props = {
  form: Partial<Candidato>;
  handleInput: (key: keyof Candidato, value: string) => void;
  curriculoName: string | null;
  curriculoDate: string | null;
  handleCurriculoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeCurriculo: () => void;
};

export default function Profissional({ form, handleInput, curriculoName, curriculoDate, handleCurriculoChange, removeCurriculo }: Props) {
  return (
    <section id="profissional" className="space-y-4">
      <h3 className="font-semibold">Dados profissionais</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <input value={form.escolaridade} onChange={e => handleInput('escolaridade', e.target.value)} placeholder="Escolaridade" className="p-3 border rounded md:col-span-2" />
        {form.escolaridade && /superior/i.test(String(form.escolaridade)) && (
          <input value={form.curso} onChange={e => handleInput('curso', e.target.value)} placeholder="Curso (ensino superior)" className="p-3 border rounded md:col-span-2" />
        )}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Currículo <span className="text-red-600">*</span></label>
          <div className="mt-2 flex items-center gap-3">
            <input id="curriculoFile" type="file" accept=".pdf" onChange={handleCurriculoChange} />
            {curriculoName && <div className="text-sm text-gray-700">{curriculoName}{curriculoDate ? ` • ${curriculoDate}` : ''}</div>}
            {curriculoName && <button onClick={removeCurriculo} className="text-sm text-red-600">Remover</button>}
          </div>
        </div>
      </div>
    </section>
  );
}
