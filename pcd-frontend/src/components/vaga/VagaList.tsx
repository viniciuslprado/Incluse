import { Link, useParams } from "react-router-dom";
import type { Vaga } from "../../types";

type Props = {
  vagas: Vaga[];
};

export default function VagaList({ vagas }: Props) {
  const { id: empresaId } = useParams();

  if (!vagas?.length) {
    return <div className="card text-gray-500">Nenhuma vaga cadastrada ainda.</div>;
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Vagas cadastradas</h3>
      <ul className="divide-y">
        {vagas.map((v) => (
          <li key={v.id} className="py-2 flex items-center justify-between">
            <div>
              <p className="font-medium">{v.descricao}</p>
              <p className="text-sm text-gray-500">Escolaridade: {v.escolaridade}</p>
            </div>
            <Link
              to={`/empresa/${empresaId}/vagas/${v.id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              Gerenciar
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
