
import { useState } from 'react';
import CustomSelect from '../common/CustomSelect';
import type { CandidatoCompetencia } from '../../types';

type Props = {
  competencia?: CandidatoCompetencia;
  onSave: (comp: CandidatoCompetencia) => void;
  onCancel: () => void;
};

export default function CompetenciaForm({ competencia, onSave, onCancel }: Props) {
  const [tipo, setTipo] = useState<'Hard skill' | 'Soft skill'>(competencia?.tipo || 'Hard skill');
  const [nome, setNome] = useState(competencia?.nome || '');
  const [nivel, setNivel] = useState<'Básico' | 'Intermediário' | 'Avançado'>(competencia?.nivel || 'Básico');

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!nome.trim()) newErrors.nome = 'Nome da habilidade é obrigatório';
    // setErrors removido, pois não é mais utilizado
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: competencia?.id,
      tipo,
      nome: nome.trim(),
      nivel,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded border">
      <h4 className="font-medium">Competência / Habilidade</h4>

      <div>
        <label className="block text-sm font-medium mb-1">
          Tipo <span className="text-red-600">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={tipo === 'Hard skill'}
              onChange={() => setTipo('Hard skill')}
            />
            <span>Hard skill (técnica)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={tipo === 'Soft skill'}
              onChange={() => setTipo('Soft skill')}
            />
            <span>Soft skill (comportamental)</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Nome da habilidade <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder={tipo === 'Hard skill' ? 'Ex: React, Python, Excel' : 'Ex: Trabalho em equipe, Liderança'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Nível <span className="text-red-600">*</span>
        </label>
        <CustomSelect
          value={nivel}
          onChange={v => setNivel(v as 'Básico' | 'Intermediário' | 'Avançado')}
          options={[
            { value: 'Básico', label: 'Básico' },
            { value: 'Intermediário', label: 'Intermediário' },
            { value: 'Avançado', label: 'Avançado' }
          ]}
          className="w-full"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded">
          Salvar competência
        </button>
      </div>
    </form>
  );
}
