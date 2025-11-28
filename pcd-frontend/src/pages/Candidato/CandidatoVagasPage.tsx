import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CandidatoVagasPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/candidato/${id}/minhas-candidaturas`, { replace: true });
  }, [id, navigate]);

  return (
    <div className="p-6">
      <div>Redirecionando...</div>
    </div>
  );
}