import type { CurriculoBasico } from '../../types';

interface Props {
  curriculo: CurriculoBasico;
  candidatoNome?: string;
}

export default function CurriculoViewer({ curriculo, candidatoNome }: Props) {
  return (
    <div className="space-y-6">
      {/* Experiências */}
      {curriculo.experiencias && curriculo.experiencias.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">Experiências Profissionais</h4>
          <div className="space-y-3">
            {curriculo.experiencias.map((exp, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-600 rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">{exp.cargo}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.empresa}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {exp.dataInicio} - {exp.atualmenteTrabalha ? 'Atual' : exp.dataTermino}
                  </span>
                </div>
                {exp.descricao && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{exp.descricao}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formações */}
      {curriculo.formacoes && curriculo.formacoes.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">Formação Acadêmica</h4>
          <div className="space-y-3">
            {curriculo.formacoes.map((form, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-600 rounded p-3">
                <h5 className="font-medium text-gray-900 dark:text-gray-100">{form.escolaridade}</h5>
                {form.curso && <p className="text-sm text-gray-600 dark:text-gray-400">{form.curso}</p>}
                {form.instituicao && <p className="text-sm text-gray-600 dark:text-gray-400">{form.instituicao}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {form.situacao} {form.anoConclusao && `- ${form.anoConclusao}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cursos */}
      {curriculo.cursos && curriculo.cursos.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">Cursos e Certificações</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {curriculo.cursos.map((curso, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-600 rounded p-3">
                <h5 className="font-medium text-gray-900 dark:text-gray-100">{curso.nome}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{curso.instituicao}</p>
                {curso.cargaHoraria && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{curso.cargaHoraria}h</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competências */}
      {curriculo.competencias && curriculo.competencias.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">Competências</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {curriculo.competencias.map((comp, idx) => (
              <div key={idx} className="flex justify-between items-center border border-gray-200 dark:border-gray-600 rounded p-2">
                <span className="text-sm text-gray-900 dark:text-gray-100">{comp.nome}</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    comp.tipo === 'Hard skill' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {comp.tipo}
                  </span>
                  <span className="text-xs text-gray-500">{comp.nivel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Idiomas */}
      {curriculo.idiomas && curriculo.idiomas.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">Idiomas</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {curriculo.idiomas.map((idioma, idx) => (
              <div key={idx} className="flex justify-between items-center border border-gray-200 dark:border-gray-600 rounded p-2">
                <span className="text-sm text-gray-900 dark:text-gray-100">{idioma.idioma}</span>
                <span className="text-xs text-gray-500">{idioma.nivel}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensagem quando não há dados */}
      {(!curriculo.experiencias || curriculo.experiencias.length === 0) &&
       (!curriculo.formacoes || curriculo.formacoes.length === 0) &&
       (!curriculo.cursos || curriculo.cursos.length === 0) &&
       (!curriculo.competencias || curriculo.competencias.length === 0) &&
       (!curriculo.idiomas || curriculo.idiomas.length === 0) && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {candidatoNome ? `${candidatoNome} ainda não preencheu` : 'Ainda não há'} informações no currículo.
          </p>
        </div>
      )}
    </div>
  );
}