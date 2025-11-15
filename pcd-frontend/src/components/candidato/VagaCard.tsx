import React from 'react';
import type { Vaga } from '../../types';
import { FiEye, FiSend } from 'react-icons/fi';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

type Props = {
  vaga: Vaga | any;
  onView?: () => void;
  onApply?: () => void;
  onToggleSave?: () => void;
  isCompanyFavorited?: boolean;
  onToggleCompanyFavorite?: () => void;
};

export default function VagaCardCandidate({ vaga, onView, onApply, onToggleSave, isCompanyFavorited, onToggleCompanyFavorite }: Props) {
  const match = vaga?.matchPercent ?? vaga?.compatibility ?? 0;
  const isSaved = Boolean(vaga?.salvo || vaga?.isSaved || vaga?.saved);

  return (
    <article className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      {vaga?.saved && (
        <div className="absolute top-3 right-3 inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300" aria-hidden>
          <AiFillStar className="w-3 h-3" />
          <span>Salvo</span>
        </div>
      )}
      {(
        vaga?.indisponivel || vaga?.unavailable || vaga?.expired || vaga?.closed
      ) && (
        <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs font-semibold bg-gray-200 text-gray-700 dark:bg-gray-700/80 dark:text-gray-200" aria-hidden>
          <span>Indisponível</span>
        </div>
      )}
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-sm font-semibold text-gray-600"
          aria-hidden
        >
          {vaga.empresa?.nome?.charAt(0) ?? 'E'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">{vaga.titulo ?? vaga.descricao}</h3>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span>{vaga.empresa?.nome}</span>
              {onToggleCompanyFavorite && (
                <button
                  type="button"
                  onClick={onToggleCompanyFavorite}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={isCompanyFavorited ? 'Desfavoritar empresa' : 'Favoritar empresa'}
                  title={isCompanyFavorited ? 'Desfavoritar' : 'Favoritar'}
                >
                  {isCompanyFavorited ? <AiFillStar className="text-yellow-500 w-4 h-4" aria-hidden /> : <AiOutlineStar className="w-4 h-4" aria-hidden />}
                </button>
              )}
            </div>
            <span aria-hidden>•</span>
            <span>{vaga.cidade ?? '—'}</span>
            <span aria-hidden>•</span>
            <span>{vaga.tipoContrato ?? vaga.escolaridade ?? '—'}</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-28 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" aria-hidden>
                <div style={{ width: `${Math.min(100, Math.max(0, match))}%` }} className="h-2 bg-green-500" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{match}% compatibilidade</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onView}
                className="flex items-center gap-2 px-3 py-1 text-sm rounded bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                aria-label="Ver detalhes da vaga"
              >
                <FiEye aria-hidden />
                <span className="sr-only">Ver detalhes</span>
                <span className="hidden sm:inline">Ver</span>
              </button>

              {vaga?.applied ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded bg-gray-200 text-gray-700" aria-label="Vaga já candidatada">
                  <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Já candidatado</span>
                </div>
              ) : (
                ((vaga?.indisponivel || vaga?.unavailable || vaga?.expired || vaga?.closed) ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded bg-gray-100 text-gray-600">Indisponível</div>
                ) : (
                  <button
                    type="button"
                    onClick={onApply}
                    className="flex items-center gap-2 px-3 py-1 text-sm rounded bg-green-600 text-white"
                    aria-label="Candidatar-se a vaga"
                  >
                    <FiSend aria-hidden />
                    <span className="sr-only">Candidatar-se</span>
                  </button>
                ))
              )}

              <button
                type="button"
                onClick={onToggleSave}
                className="p-2 text-sm rounded border hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-pressed={isSaved}
                aria-label={isSaved ? 'Remover dos salvos' : 'Salvar vaga'}
                title={isSaved ? 'Remover dos salvos' : 'Salvar vaga'}
              >
                {isSaved ? <AiFillStar className="text-yellow-500" aria-hidden /> : <AiOutlineStar aria-hidden />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
