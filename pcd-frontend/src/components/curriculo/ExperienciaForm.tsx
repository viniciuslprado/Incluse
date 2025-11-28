import { useState } from 'react';
import type { CandidatoExperiencia } from '../../types';

type Props = {
  experiencia?: CandidatoExperiencia;
  onSave: (exp: CandidatoExperiencia) => void;
  onCancel: () => void;
};

export default function ExperienciaForm({ experiencia, onSave, onCancel }: Props) {
  const [cargo, setCargo] = useState(experiencia?.cargo || '');
  const [empresa, setEmpresa] = useState(experiencia?.empresa || '');
  const [dataInicio, setDataInicio] = useState(experiencia?.dataInicio || '');
  const [dataTermino, setDataTermino] = useState(experiencia?.dataTermino || '');
  const [atualmenteTrabalha, setAtualmenteTrabalha] = useState(experiencia?.atualmenteTrabalha || false);
  const [descricao, setDescricao] = useState(experiencia?.descricao || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    
    if (!cargo.trim()) newErrors.cargo = 'Cargo é obrigatório';
    if (!empresa.trim()) newErrors.empresa = 'Empresa é obrigatória';
    if (!dataInicio) newErrors.dataInicio = 'Data de início é obrigatória';
    if (!atualmenteTrabalha && !dataTermino) {
      newErrors.dataTermino = 'Data de término é obrigatória (ou marque "Atualmente trabalhando")';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: experiencia?.id,
      cargo: cargo.trim(),
      empresa: empresa.trim(),
      dataInicio,
      dataTermino: atualmenteTrabalha ? null : dataTermino,
      atualmenteTrabalha,
      descricao: descricao.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded border">
      <h4 className="font-medium">Experiência Profissional</h4>

      <div>
        <label className="block text-sm font-medium mb-1">
          Cargo <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Ex: Analista de Sistemas"
        />
        {errors.cargo && <p className="text-sm text-red-600 mt-1">{errors.cargo}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Empresa <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Ex: Tech Solutions Ltda"
        />
        {errors.empresa && <p className="text-sm text-red-600 mt-1">{errors.empresa}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Data de início <span className="text-red-600">*</span>
          </label>
          <input
            type="month"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {errors.dataInicio && <p className="text-sm text-red-600 mt-1">{errors.dataInicio}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Data de término {!atualmenteTrabalha && <span className="text-red-600">*</span>}
          </label>
          <input
            type="month"
            value={dataTermino}
            onChange={(e) => setDataTermino(e.target.value)}
            disabled={atualmenteTrabalha}
            className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
          />
          {errors.dataTermino && <p className="text-sm text-red-600 mt-1">{errors.dataTermino}</p>}
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={atualmenteTrabalha}
            onChange={(e) => {
              setAtualmenteTrabalha(e.target.checked);
              if (e.target.checked) setDataTermino('');
            }}
          />
          <span className="text-sm">Atualmente trabalhando</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descrição das atividades (opcional)</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={4}
          placeholder="Descreva suas principais atividades e responsabilidades..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded">
          Salvar experiência
        </button>
      </div>
    </form>
  );
}
