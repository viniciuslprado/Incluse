import { useState } from 'react';
import CustomSelect from '../common/CustomSelect';
import type { CandidatoIdioma } from '../../types';

type Props = {
  idioma?: CandidatoIdioma;
  onSave: (idioma: CandidatoIdioma) => void;
  onCancel: () => void;
};

export default function IdiomaForm({ idioma, onSave, onCancel }: Props) {
  const [idiomaVal, setIdiomaVal] = useState(idioma?.idioma || '');
  const [nivel, setNivel] = useState<CandidatoIdioma['nivel']>(idioma?.nivel || 'Básico');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!idiomaVal.trim()) newErrors.idioma = 'Idioma é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: idioma?.id,
      idioma: idiomaVal.trim(),
      nivel,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Idioma <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={idiomaVal}
          onChange={e => setIdiomaVal(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Ex: Inglês, Espanhol, Libras"
        />
        {errors.idioma && <p className="text-sm text-red-600 mt-1">{errors.idioma}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Nível <span className="text-red-600">*</span>
        </label>
        <CustomSelect
          value={nivel}
          onChange={(v: string) => setNivel(v as CandidatoIdioma['nivel'])}
          options={[
            { value: 'A1', label: 'A1 - Iniciante' },
            { value: 'A2', label: 'A2 - Básico' },
            { value: 'B1', label: 'B1 - Intermediário' },
            { value: 'B2', label: 'B2 - Intermediário-Avançado' },
            { value: 'C1', label: 'C1 - Avançado' },
            { value: 'C2', label: 'C2 - Proficiência' },
            { value: 'Básico', label: 'Básico' },
            { value: 'Intermediário', label: 'Intermediário' },
            { value: 'Avançado', label: 'Avançado' },
            { value: 'Fluente', label: 'Fluente' },
          ]}
          className="w-full"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded">
          Salvar idioma
        </button>
      </div>
    </form>
  );
}
