import { FiAlertTriangle, FiUserCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCandidate } from '../../contexts/CandidateContext';

// Determina campos faltantes considerando perfil completo
function getMissingFields(c: any) {
  if (!c) return [] as string[];
  const missing: string[] = [];
  if (!c.cidade) missing.push('Cidade onde mora');
  if (!c.estado) missing.push('Estado');
  if (!c.disponibilidadeGeografica) missing.push('Disponibilidade geográfica');
  if (c.aceitaMudanca === null || c.aceitaMudanca === undefined) missing.push('Aceita mudança');
  if (c.aceitaViajar === null || c.aceitaViajar === undefined) missing.push('Aceita viajar');
  return missing;
}

export default function PerfilIncompletoAlert({ candidato }: { candidato: any }) {
  const navigate = useNavigate();
  const ctx = (() => { try { return useCandidate(); } catch { return null; } })();
  const base = candidato || ctx;
  const missing = getMissingFields(base);
  if (!missing.length) return null;
  return (
    <div className="border rounded-md p-4 bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 space-y-3" role="alert" aria-live="polite">
      <div className="flex items-start gap-3">
        <FiAlertTriangle className="w-5 h-5 mt-0.5" aria-hidden />
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">Seu perfil está incompleto 📝</h4>
          <p className="text-sm leading-relaxed mb-2">Para recomendarmos vagas e calcular a compatibilidade corretamente, complete as informações obrigatórias abaixo:</p>
          <ul className="text-xs pl-5 list-disc space-y-0.5">
            {missing.map(m => <li key={m}>{m}</li>)}
          </ul>
        </div>
      </div>
      <button
        onClick={() => navigate(`/candidato/${base?.id}/perfil`)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        <FiUserCheck aria-hidden />
        <span>Completar meu Perfil</span>
      </button>
    </div>
  );
}
