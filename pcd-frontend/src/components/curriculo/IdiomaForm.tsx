import { useState } from 'react';
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
        <select
          value={nivel}
          onChange={(e) => setNivel(e.target.value as any)}
          className="w-full border rounded px-3 py-2"
        >
          <optgroup label="CEFR">
            <option value="A1">A1 - Iniciante</option>
            <option value="A2">A2 - Básico</option>
            <option value="B1">B1 - Intermediário</option>
            <option value="B2">B2 - Intermediário-Avançado</option>
            <option value="C1">C1 - Avançado</option>
            <option value="C2">C2 - Proficiência</option>
          </optgroup>
          <optgroup label="Geral">
            <option value="Básico">Básico</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
            <option value="Fluente">Fluente</option>
          </optgroup>
        </select>
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
