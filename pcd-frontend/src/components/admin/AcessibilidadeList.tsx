import type { Acessibilidade } from "../../types";

type Props = {
  acessibilidades: Acessibilidade[];
};

export default function AcessibilidadeList({ acessibilidades }: Props) {
  if (!acessibilidades.length) {
    return (
      <div className="card text-gray-500">
        Nenhuma acessibilidade cadastrada ainda.
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">
        Acessibilidades Cadastradas ({acessibilidades.length})
      </h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {acessibilidades.map((acessibilidade) => (
          <li key={acessibilidade.id} className="py-3 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {acessibilidade.nome}
              </p>
              {acessibilidade.createdAt && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Criada em: {new Date(acessibilidade.createdAt).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              ID: {acessibilidade.id}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}