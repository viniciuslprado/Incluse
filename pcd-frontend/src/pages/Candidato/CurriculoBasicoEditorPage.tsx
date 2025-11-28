import { useState } from 'react';
import { useCandidate } from '../../contexts/CandidateContext';
import type {
  CandidatoExperiencia,
  CandidatoFormacao,
  CandidatoCurso,
  CandidatoCompetencia,
  CandidatoIdioma,
} from '../../types';
import ExperienciaForm from '../../components/curriculo/ExperienciaForm';
import FormacaoForm from '../../components/curriculo/FormacaoForm';
import CursoForm from '../../components/curriculo/CursoForm';
import CompetenciaForm from '../../components/curriculo/CompetenciaForm';
import IdiomaForm from '../../components/curriculo/IdiomaForm';
import { useToast } from '../../components/common/Toast';

export default function CurriculoBasicoEditorPage() {
  const candCtx = useCandidate();
  const { addToast } = useToast();

  const [experiencias, setExperiencias] = useState<CandidatoExperiencia[]>([]);
  const [formacoes, setFormacoes] = useState<CandidatoFormacao[]>([]);
  const [cursos, setCursos] = useState<CandidatoCurso[]>([]);
  const [competencias, setCompetencias] = useState<CandidatoCompetencia[]>([]);
  const [idiomas, setIdiomas] = useState<CandidatoIdioma[]>([]);

  const [showExpForm, setShowExpForm] = useState(false);
  const [showFormForm, setShowFormForm] = useState(false);
  const [showCursoForm, setShowCursoForm] = useState(false);
  const [showCompForm, setShowCompForm] = useState(false);
  const [showIdiomaForm, setShowIdiomaForm] = useState(false);

  const [editingExp, setEditingExp] = useState<CandidatoExperiencia | undefined>();
  const [editingForm, setEditingForm] = useState<CandidatoFormacao | undefined>();
  const [editingCurso, setEditingCurso] = useState<CandidatoCurso | undefined>();
  const [editingComp, setEditingComp] = useState<CandidatoCompetencia | undefined>();
  const [editingIdioma, setEditingIdioma] = useState<CandidatoIdioma | undefined>();

  function handleSaveExp(exp: CandidatoExperiencia) {
    if (exp.id) {
      setExperiencias((prev) => prev.map((e) => (e.id === exp.id ? exp : e)));
    } else {
      setExperiencias((prev) => [...prev, { ...exp, id: Date.now() }]);
    }
    setShowExpForm(false);
    setEditingExp(undefined);
  }

  function handleSaveFormacao(form: CandidatoFormacao) {
    if (form.id) {
      setFormacoes((prev) => prev.map((f) => (f.id === form.id ? form : f)));
    } else {
      setFormacoes((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setShowFormForm(false);
    setEditingForm(undefined);
  }

  function handleSaveCurso(curso: CandidatoCurso) {
    if (curso.id) {
      setCursos((prev) => prev.map((c) => (c.id === curso.id ? curso : c)));
    } else {
      setCursos((prev) => [...prev, { ...curso, id: Date.now() }]);
    }
    setShowCursoForm(false);
    setEditingCurso(undefined);
  }

  function handleSaveComp(comp: CandidatoCompetencia) {
    if (comp.id) {
      setCompetencias((prev) => prev.map((c) => (c.id === comp.id ? comp : c)));
    } else {
      setCompetencias((prev) => [...prev, { ...comp, id: Date.now() }]);
    }
    setShowCompForm(false);
    setEditingComp(undefined);
  }

  function handleSaveIdioma(idioma: CandidatoIdioma) {
    if (idioma.id) {
      setIdiomas((prev) => prev.map((i) => (i.id === idioma.id ? idioma : i)));
    } else {
      setIdiomas((prev) => [...prev, { ...idioma, id: Date.now() }]);
    }
    setShowIdiomaForm(false);
    setEditingIdioma(undefined);
  }

  function handleSaveCurriculo() {
    // Salvar no backend ou localStorage
    const curriculo = {
      experiencias,
      formacoes,
      cursos,
      competencias,
      idiomas,
    };
    
    localStorage.setItem(`curriculo_basico_${candCtx.id}`, JSON.stringify(curriculo));
    addToast({ type: 'success', title: 'Currículo salvo', message: 'Seu currículo foi salvo com sucesso!' });
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Criar Currículo</h1>
        <button
          onClick={handleSaveCurriculo}
          className="px-6 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700"
        >
          Salvar currículo
        </button>
      </div>

      {/* Dados Pessoais */}
      <section className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Nome:</span> {candCtx.nome}
          </div>
          <div>
            <span className="font-medium">E-mail:</span> {candCtx.email}
          </div>
          <div>
            <span className="font-medium">Telefone:</span> {candCtx.telefone}
          </div>
          <div>
            <span className="font-medium">CPF:</span> {candCtx.cpf || 'Não informado'}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Estes dados vêm do seu cadastro</p>
      </section>

      {/* Experiências */}
      <section className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Experiências Profissionais</h2>
          <button
            onClick={() => {
              setEditingExp(undefined);
              setShowExpForm(true);
            }}
            className="px-4 py-2 border border-sky-600 text-sky-600 rounded hover:bg-sky-50"
          >
            + Adicionar experiência
          </button>
        </div>

        {showExpForm && (
          <ExperienciaForm
            experiencia={editingExp}
            onSave={handleSaveExp}
            onCancel={() => {
              setShowExpForm(false);
              setEditingExp(undefined);
            }}
          />
        )}

        {experiencias.length === 0 && !showExpForm && (
          <p className="text-sm text-gray-500">Nenhuma experiência adicionada</p>
        )}

        {experiencias.map((exp) => (
          <div key={exp.id} className="p-4 border rounded bg-gray-50">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{exp.cargo}</h4>
                <p className="text-sm text-gray-600">{exp.empresa}</p>
                <p className="text-xs text-gray-500">
                  {exp.dataInicio} - {exp.atualmenteTrabalha ? 'Atual' : exp.dataTermino}
                </p>
                {exp.descricao && <p className="text-sm mt-2">{exp.descricao}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingExp(exp);
                    setShowExpForm(true);
                  }}
                  className="text-blue-600 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => setExperiencias((prev) => prev.filter((e) => e.id !== exp.id))}
                  className="text-red-600 text-sm"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Formações */}
      <section className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Formação Acadêmica</h2>
          <button
            onClick={() => {
              setEditingForm(undefined);
              setShowFormForm(true);
            }}
            className="px-4 py-2 border border-sky-600 text-sky-600 rounded hover:bg-sky-50"
          >
            + Adicionar formação
          </button>
        </div>

        {showFormForm && (
          <FormacaoForm
            formacao={editingForm}
            onSave={handleSaveFormacao}
            onCancel={() => {
              setShowFormForm(false);
              setEditingForm(undefined);
            }}
          />
        )}

        {formacoes.length === 0 && !showFormForm && (
          <p className="text-sm text-gray-500">Nenhuma formação adicionada</p>
        )}

        {formacoes.map((form) => (
          <div key={form.id} className="p-4 border rounded bg-gray-50">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{form.escolaridade}</h4>
                {form.curso && <p className="text-sm text-gray-600">{form.curso}</p>}
                {form.instituicao && <p className="text-sm text-gray-600">{form.instituicao}</p>}
                {form.situacao && <p className="text-xs text-gray-500">{form.situacao}</p>}
                {form.inicio && (
                  <p className="text-xs text-gray-500">
                    {form.inicio} - {form.termino || (form.situacao === 'cursando' ? 'Cursando' : '—')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingForm(form);
                    setShowFormForm(true);
                  }}
                  className="text-blue-600 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => setFormacoes((prev) => prev.filter((f) => f.id !== form.id))}
                  className="text-red-600 text-sm"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Cursos */}
      <section className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cursos e Certificações</h2>
          <button
            onClick={() => {
              setEditingCurso(undefined);
              setShowCursoForm(true);
            }}
            className="px-4 py-2 border border-sky-600 text-sky-600 rounded hover:bg-sky-50"
          >
            + Adicionar curso
          </button>
        </div>

        {showCursoForm && (
          <CursoForm
            curso={editingCurso}
            onSave={handleSaveCurso}
            onCancel={() => {
              setShowCursoForm(false);
              setEditingCurso(undefined);
            }}
          />
        )}

        {cursos.length === 0 && !showCursoForm && (
          <p className="text-sm text-gray-500">Nenhum curso adicionado</p>
        )}

        {cursos.map((curso) => (
          <div key={curso.id} className="p-4 border rounded bg-gray-50">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{curso.nome}</h4>
                <p className="text-sm text-gray-600">{curso.instituicao}</p>
                {curso.cargaHoraria && (
                  <p className="text-xs text-gray-500">{curso.cargaHoraria}h</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCurso(curso);
                    setShowCursoForm(true);
                  }}
                  className="text-blue-600 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => setCursos((prev) => prev.filter((c) => c.id !== curso.id))}
                  className="text-red-600 text-sm"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Competências */}
      <section className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Competências / Habilidades</h2>
          <button
            onClick={() => {
              setEditingComp(undefined);
              setShowCompForm(true);
            }}
            className="px-4 py-2 border border-sky-600 text-sky-600 rounded hover:bg-sky-50"
          >
            + Adicionar competência
          </button>
        </div>

        {showCompForm && (
          <CompetenciaForm
            competencia={editingComp}
            onSave={handleSaveComp}
            onCancel={() => {
              setShowCompForm(false);
              setEditingComp(undefined);
            }}
          />
        )}

        {competencias.length === 0 && !showCompForm && (
          <p className="text-sm text-gray-500">Nenhuma competência adicionada</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {competencias.map((comp) => (
            <div key={comp.id} className="p-4 border rounded bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{comp.nome}</h4>
                  <p className="text-xs text-gray-500">
                    {comp.tipo} • {comp.nivel}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingComp(comp);
                      setShowCompForm(true);
                    }}
                    className="text-blue-600 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setCompetencias((prev) => prev.filter((c) => c.id !== comp.id))}
                    className="text-red-600 text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Idiomas */}
      <section className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Idiomas</h2>
          <button
            onClick={() => {
              setEditingIdioma(undefined);
              setShowIdiomaForm(true);
            }}
            className="px-4 py-2 border border-sky-600 text-sky-600 rounded hover:bg-sky-50"
          >
            + Adicionar idioma
          </button>
        </div>

        {showIdiomaForm && (
          <IdiomaForm
            idioma={editingIdioma}
            onSave={handleSaveIdioma}
            onCancel={() => {
              setShowIdiomaForm(false);
              setEditingIdioma(undefined);
            }}
          />
        )}

        {idiomas.length === 0 && !showIdiomaForm && (
          <p className="text-sm text-gray-500">Nenhum idioma adicionado</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {idiomas.map((idioma) => (
            <div key={idioma.id} className="p-4 border rounded bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{idioma.idioma}</h4>
                  <p className="text-xs text-gray-500">{idioma.nivel}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingIdioma(idioma);
                      setShowIdiomaForm(true);
                    }}
                    className="text-blue-600 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setIdiomas((prev) => prev.filter((i) => i.id !== idioma.id))}
                    className="text-red-600 text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Botão salvar fixo mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
        <button
          onClick={handleSaveCurriculo}
          className="w-full px-6 py-3 bg-sky-600 text-white rounded-lg font-medium"
        >
          Salvar currículo
        </button>
      </div>
    </div>
  );
}
