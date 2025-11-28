import { useState } from 'react';
import type { CandidatoCurso } from '../../types';

type Props = {
  curso?: CandidatoCurso;
  onSave: (curso: CandidatoCurso) => void;
  onCancel: () => void;
};

export default function CursoForm({ curso, onSave, onCancel }: Props) {
  const [nome, setNome] = useState(curso?.nome || '');
  const [instituicao, setInstituicao] = useState(curso?.instituicao || '');
  const [cargaHoraria, setCargaHoraria] = useState(curso?.cargaHoraria?.toString() || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!nome.trim()) newErrors.nome = 'Nome do curso é obrigatório';
    if (!instituicao.trim()) newErrors.instituicao = 'Instituição é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: curso?.id,
      nome: nome.trim(),
      instituicao: instituicao.trim(),
      cargaHoraria: cargaHoraria ? parseInt(cargaHoraria) : undefined,
      certificado: curso?.certificado,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded border">
      <h4 className="font-medium">Curso / Certificação</h4>

      <div>
        <label className="block text-sm font-medium mb-1">
          Nome do curso <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Ex: Python para Data Science"
        />
        {errors.nome && <p className="text-sm text-red-600 mt-1">{errors.nome}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Instituição <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={instituicao}
          onChange={(e) => setInstituicao(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Ex: Coursera / Udemy"
        />
        {errors.instituicao && <p className="text-sm text-red-600 mt-1">{errors.instituicao}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Carga horária (opcional)</label>
        <input
          type="number"
          value={cargaHoraria}
          onChange={(e) => setCargaHoraria(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Ex: 40"
          min="0"
        />
        <p className="text-xs text-gray-500 mt-1">Em horas</p>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded">
          Salvar curso
        </button>
      </div>
    </form>
  );
}
