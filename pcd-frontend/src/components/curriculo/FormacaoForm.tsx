import { useState } from 'react';
import CustomSelect from '../common/CustomSelect';
import type { CandidatoFormacao, Escolaridade } from '../../types';

type Props = {
  formacao?: CandidatoFormacao;
  onSave: (form: CandidatoFormacao) => void;
  onCancel: () => void;
};

const escolaridades = [
  'Ensino Fundamental Incompleto',
  'Ensino Fundamental Completo',
  'Ensino Médio Incompleto',
  'Ensino Médio Completo',
  'Ensino Superior Incompleto',
  'Ensino Superior Completo',
  'Pós-graduação',
  'Mestrado',
  'Doutorado',
];

export default function FormacaoForm({ formacao, onSave, onCancel }: Props) {
  const [escolaridade, setEscolaridade] = useState<Escolaridade | ''>(formacao?.escolaridade || '');
  const [instituicao, setInstituicao] = useState(formacao?.instituicao || '');
  const [curso, setCurso] = useState(formacao?.curso || '');
    const [situacao, setSituacao] = useState<'concluido' | 'cursando'>(formacao?.situacao || 'concluido');
  const [inicio, setInicio] = useState(formacao?.inicio || '');
  const [termino, setTermino] = useState(formacao?.termino || '');
  const [anoConclusao, setAnoConclusao] = useState(formacao?.anoConclusao || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEnsinoSuperior = escolaridade.includes('Superior') || escolaridade === 'Pós-graduação' || escolaridade === 'Mestrado' || escolaridade === 'Doutorado';

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!escolaridade) newErrors.escolaridade = 'Escolaridade é obrigatória';

    if (isEnsinoSuperior) {
      if (!instituicao.trim()) newErrors.instituicao = 'Instituição é obrigatória';
      if (!curso.trim()) newErrors.curso = 'Curso é obrigatório';
      if (!inicio) newErrors.inicio = 'Data de início é obrigatória';
      if (situacao === 'concluido' && !termino) {
        newErrors.termino = 'Data de término é obrigatória para formação concluída';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (!escolaridade) return; // nunca envie escolaridade inválida
    onSave({
      id: formacao?.id,
      escolaridade,
      instituicao: instituicao.trim() || undefined,
      curso: curso.trim() || undefined,
      situacao: isEnsinoSuperior ? situacao : undefined,
      inicio: inicio || undefined,
      termino: (situacao === 'concluido' ? termino : null) || undefined,
      anoConclusao: anoConclusao || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded border">
      <h4 className="font-medium">Formação Acadêmica</h4>

      <div>
        <label className="block text-sm font-medium mb-1">
          Escolaridade <span className="text-red-600">*</span>
        </label>
        <CustomSelect
          value={escolaridade}
          onChange={(v: string) => setEscolaridade(v as Escolaridade)}
          options={[
            { value: '', label: 'Selecione...' },
            ...escolaridades.map(esc => ({ value: esc, label: esc }))
          ]}
          className="w-full"
        />
        {errors.escolaridade && <p className="text-sm text-red-600 mt-1">{errors.escolaridade}</p>}
      </div>

      {isEnsinoSuperior && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">
              Instituição <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={instituicao}
              onChange={(e) => setInstituicao(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Ex: Universidade Federal"
            />
            {errors.instituicao && <p className="text-sm text-red-600 mt-1">{errors.instituicao}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Curso <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Ex: Ciência da Computação"
            />
            {errors.curso && <p className="text-sm text-red-600 mt-1">{errors.curso}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Situação <span className="text-red-600">*</span>
            </label>
              <CustomSelect
                value={situacao}
                onChange={(v: string) => setSituacao(v as 'concluido' | 'cursando')}
                options={[
                  { value: 'concluido', label: 'Concluído' },
                  { value: 'cursando', label: 'Cursando' }
                ]}
                className="mt-1 block w-full"
              />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Início <span className="text-red-600">*</span>
              </label>
              <input
                type="month"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              {errors.inicio && <p className="text-sm text-red-600 mt-1">{errors.inicio}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Término {situacao === 'concluido' && <span className="text-red-600">*</span>}
              </label>
              <input
                type="month"
                value={termino}
                onChange={(e) => setTermino(e.target.value)}
                disabled={situacao === 'cursando'}
                className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
              />
              {errors.termino && <p className="text-sm text-red-600 mt-1">{errors.termino}</p>}
            </div>
          </div>
        </>
      )}

      {!isEnsinoSuperior && escolaridade && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Instituição (opcional)</label>
            <input
              type="text"
              value={instituicao}
              onChange={(e) => setInstituicao(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Ex: Escola Estadual"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ano de conclusão (opcional)</label>
            <input
              type="number"
              value={anoConclusao}
              onChange={(e) => setAnoConclusao(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Ex: 2020"
              min="1950"
              max="2100"
            />
          </div>
        </>
      )}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded">
          Salvar formação
        </button>
      </div>
    </form>
  );
}
