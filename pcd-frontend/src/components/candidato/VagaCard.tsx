import { useEffect, useState } from 'react';
import type { Vaga } from '../../types';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useParams } from 'react-router-dom';


type Props = {
  vaga: Vaga | any;
  onView?: () => void;
  onApply?: () => Promise<boolean> | boolean;
  onToggleSave?: () => void;
  isCompanyFavorited?: boolean;
  onToggleCompanyFavorite?: () => void;
  candidatoId?: number;
  showStatus?: boolean;
};

export default function VagaCardCandidate({ vaga, onView, onApply, onToggleSave, isCompanyFavorited: _isCompanyFavorited, onToggleCompanyFavorite: _onToggleCompanyFavorite, candidatoId }: Props) {
  const { id } = useParams();
  const currentCandidatoId = candidatoId || Number(id);
  // Compatibilidade e candidatura agora vêm do backend, não é necessário buscar manualmente.
  
  // Compatibilidade e candidatura já vêm do backend (vaga.matchPercent, vaga.compatibility, vaga.applied, etc.)
  const matchValue = vaga?.matchPercent ?? vaga?.compatibility ?? 0;
  const match = matchValue <= 1 ? matchValue * 100 : matchValue;
  const isSaved = Boolean(vaga?.salvo || vaga?.isSaved || vaga?.saved);
  const applied = vaga?.applied;

  return (
    <article className="relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer">
      {/* Ícone de favorito no canto superior direito */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggleSave && onToggleSave(); }}
        className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={isSaved ? 'Remover dos favoritos' : 'Favoritar vaga'}
      >
        {isSaved ? <AiFillStar className="text-yellow-500 w-5 h-5" /> : <AiOutlineStar className="w-5 h-5 text-gray-400" />}
      </button>



      <div className="flex gap-4" onClick={() => onView && onView()}>
        {/* Logo da empresa */}
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg font-semibold text-gray-600 shrink-0">
          {vaga.empresa?.nome?.charAt(0) ?? 'E'}
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 min-w-0">
          {/* Título da vaga */}
          <div className="flex items-center justify-between mb-2 pr-8">
            <h3 className="text-lg font-semibold text-gray-900">
              {vaga.titulo ?? vaga.descricao ?? 'Vaga'}
            </h3>
            {vaga?.status && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                vaga.status === 'pendente' ? 'bg-blue-100 text-blue-800' :
                vaga.status === 'em_analise' ? 'bg-yellow-100 text-yellow-800' :
                vaga.status === 'pre_selecionado' ? 'bg-green-100 text-green-800' :
                vaga.status === 'entrevista_marcada' ? 'bg-purple-100 text-purple-800' :
                vaga.status === 'nao_selecionado' ? 'bg-gray-100 text-gray-600' :
                'bg-blue-100 text-blue-800'
              }`}>
                {vaga.status === 'pendente' ? 'Pendente' :
                 vaga.status === 'em_analise' ? 'Em Análise' :
                 vaga.status === 'pre_selecionado' ? 'Pré-selecionado' :
                 vaga.status === 'entrevista_marcada' ? 'Entrevista' :
                 vaga.status === 'nao_selecionado' ? 'Dispensado' :
                 vaga.status === 'aprovado' ? 'Aprovado' : vaga.status}
              </span>
            )}
          </div>

          {/* Empresa + localização + escolaridade */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="font-medium">{vaga.empresa?.nome ?? 'Empresa'}</span>
            <span>•</span>
            <span>{vaga.cidade ?? 'Localização'}</span>
            <span>•</span>
            <span>{vaga.escolaridade ?? vaga.tipoContratacao ?? 'Requisitos'}</span>
          </div>

          {/* Barra de compatibilidade */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 max-w-32 bg-gray-200 rounded-full overflow-hidden h-3">
              <div 
                style={{ width: `${Math.min(100, Math.max(0, match))}%` }} 
                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {`${Math.round(match)}% de compatibilidade`}
            </span>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onView && onView(); }}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ver
            </button>

            {!vaga?.indisponivel && !vaga?.unavailable && !vaga?.expired && !vaga?.closed && (
              <button
                type="button"
                onClick={async (e) => { 
                  e.stopPropagation(); 
                  if (onApply) {
                    const success = await onApply();
                    if (success) {
                      // Atualizar estado local após candidatura bem-sucedida
                      setIsApplied(!applied);
                    }
                  }
                }}
                // disabled={checkingApplication}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  applied 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {applied ? 'Remover' : 'Candidatar-se'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
