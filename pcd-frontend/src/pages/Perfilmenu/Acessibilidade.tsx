import { useState, useEffect, useCallback } from 'react';
import { FaWheelchair, FaTag, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import CandidatoSubtiposForm from '../../components/candidato/CandidatoSubtiposForm';
import CandidatoBarreirasForm from '../../components/candidato/CandidatoBarreirasForm';

import { api } from '../../lib/api';

// export default function Acessibilidade({ candidatoId, ... }: Props) {
export default function Acessibilidade({ candidatoId }: { candidatoId: number }) {
  const [openTipo, setOpenTipo] = useState(true);
  const [openBarreiras, setOpenBarreiras] = useState(true);
  const [tiposComSubtipos, setTiposComSubtipos] = useState<any[]>([]);
  const [allBarreirasByTipo, setAllBarreirasByTipo] = useState<Record<number, any[]>>({});
  const [selectedTipoIds, setSelectedTipoIds] = useState<number[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [candidateSubtipos, setCandidateSubtipos] = useState<any[]>([]);
  const [candidateBarreiras, setCandidateBarreiras] = useState<Record<number, { selecionadas: number[]; niveis: Record<number, string> }>>({});

  // Carregar tipos com subtipos e subtipos do candidato
  const carregarDados = useCallback(async () => {
    setLoadingData(true);
    try {
      const [tipos, subtiposCandidato] = await Promise.all([
        api.listarTiposComSubtiposPublico(),
        api.listarSubtiposCandidato(candidatoId),
      ]);
      setTiposComSubtipos(tipos);
      // Normaliza para sempre ser array de objetos {id, nome, tipoId}
      const normalizados = subtiposCandidato.map((s: any) => {
        if (s.subtipo) return { id: s.subtipo.id, nome: s.subtipo.nome, tipoId: s.subtipo.tipoId };
        return { id: s.id, nome: s.nome, tipoId: s.tipoId };
      });
      setCandidateSubtipos(normalizados);
      // Identificar tipos selecionados
      const tiposIds = new Set<number>();
      normalizados.forEach((subtipo: any) => {
        tipos.forEach((tipo: any) => {
          if (tipo.subtipos?.some((s: any) => s.id === subtipo.id)) {
            tiposIds.add(tipo.id);
          }
        });
      });
      setSelectedTipoIds(Array.from(tiposIds));
    } catch (err) {
      setTiposComSubtipos([]);
      setCandidateSubtipos([]);
    } finally {
      setLoadingData(false);
    }
  }, [candidatoId]);

  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidatoId]);

  // Fetch barriers for selected types
  useEffect(() => {
    if (selectedTipoIds.length === 0) {
      setAllBarreirasByTipo({});
      return;
    }
    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        selectedTipoIds.map(async (tipoId) => {
          try {
            const barreiras = await api.listarBarreirasPorTipo(tipoId);
            return [tipoId, barreiras];
          } catch {
            return [tipoId, []];
          }
        })
      );
      if (!cancelled) {
        const map: Record<number, any[]> = {};
        results.forEach(([tipoId, barreiras]) => {
          map[tipoId] = barreiras;
        });
        setAllBarreirasByTipo(map);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedTipoIds]);

  // Atualizar selectedTipoIds quando candidateSubtipos mudar
  useEffect(() => {
    if (!loadingData && tiposComSubtipos.length > 0 && candidateSubtipos && candidateSubtipos.length > 0) {
      const tiposIds = new Set<number>();
      candidateSubtipos.forEach((subtipo: any) => {
        const subtipoId = typeof subtipo === 'number' ? subtipo : subtipo.id;
        tiposComSubtipos.forEach((tipo: any) => {
          if (tipo.subtipos?.some((s: any) => s.id === subtipoId)) {
            tiposIds.add(tipo.id);
          }
        });
      });
      setSelectedTipoIds(Array.from(tiposIds));
    }
  }, [loadingData, candidateSubtipos, tiposComSubtipos]);



  return (
    <section id="acessibilidade" className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <FaWheelchair className="text-blue-600 text-lg" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Informações de Acessibilidade</h3>
          <p className="text-sm text-gray-600">Essas informações nos ajudam a encontrar oportunidades adequadas para você</p>
        </div>
      </div>

      {loadingData ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Carregando informações de acessibilidade...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">


        {/* Tipo de Deficiência */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaTag className="text-purple-600 text-sm" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Tipo de Deficiência <span className="text-red-500">*</span></h4>
                <p className="text-sm text-gray-600">Selecione os tipos que se aplicam ao seu perfil</p>
              </div>
            </div>
            <button 
              onClick={() => setOpenTipo(!openTipo)} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-expanded={openTipo}
            >
              <svg className={`w-5 h-5 transform transition-transform ${openTipo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {openTipo && (
            <div className="space-y-4">
              {tiposComSubtipos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tiposComSubtipos.map((t) => {
                    // Está marcado se há pelo menos um subtipo desse tipo selecionado
                    const isChecked = candidateSubtipos.some((s: any) => s.tipoId === t.id);
                    return (
                      <label key={`tipo-${t.id}`} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            // Ao marcar, apenas exibe subtipos para seleção, não marca todos
                            if (!isChecked) {
                              setSelectedTipoIds((prev) => Array.from(new Set([...prev, t.id])));
                            } else {
                              // Ao desmarcar, remove todos os subtipos desse tipo
                              const novosSubtipos = candidateSubtipos.filter((s: any) => s.tipoId !== t.id);
                              setCandidateSubtipos(novosSubtipos);
                              setSelectedTipoIds((prev) => prev.filter((id) => id !== t.id));
                              // Atualiza no backend
                              api.vincularSubtiposACandidato(candidatoId, novosSubtipos.map((s: any) => s.id)).catch(() => {});
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 font-medium text-gray-900">{t.nome}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              <div className="border-t pt-4">
                {/* Exibe subtipos para todos os tipos marcados, permitindo múltiplas deficiências */}
                {selectedTipoIds.map((tipoId) => {
                  const tipo = tiposComSubtipos.find((t: any) => t.id === tipoId);
                  if (!tipo) return null;
                  return (
                    <div key={`subtipos-tipo-${tipo.id}`} className="mb-4">
                      <div className="font-semibold mb-2 text-gray-800">{tipo.nome}</div>
                      <CandidatoSubtiposForm
                        candidatoId={candidatoId}
                        disableActions={false}
                        autoSync={true}
                        allSubtipos={tipo.subtipos || []}
                        initialSelected={candidateSubtipos.filter((s: any) => s.tipoId === tipo.id).map((s: any) => s.id)}
                        onChange={(selecionados) => {
                          // Atualiza apenas os subtipos desse tipo
                          const outros = candidateSubtipos.filter((s: any) => s.tipoId !== tipo.id);
                          setCandidateSubtipos([...outros, ...selecionados]);
                          // Atualiza no backend
                          api.vincularSubtiposACandidato(candidatoId, [...outros, ...selecionados].map((s: any) => s.id)).catch(() => {});
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Barreiras / Necessidades (por tipo) */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaShieldAlt className="text-orange-600 text-sm" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Barreiras <span className="text-red-500">*</span></h4>
                <p className="text-sm text-gray-600">Identifique suas barreiras no ambiente de trabalho</p>
              </div>
            </div>
            <button 
              onClick={() => setOpenBarreiras(!openBarreiras)} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-expanded={openBarreiras}
            >
              <svg className={`w-5 h-5 transform transition-transform ${openBarreiras ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {openBarreiras && (
            <div className="space-y-4">
              {selectedTipoIds.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FaExclamationTriangle className="text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Selecione primeiro os tipos de deficiência</p>
                      <p className="text-xs text-yellow-700 mt-1">Para ver as barreiras disponíveis, é necessário selecionar pelo menos um tipo de deficiência acima.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedTipoIds.map((tipoId) => {
                    const tipoObj = tiposComSubtipos.find((t) => t.id === tipoId);
                    if (!tipoObj) return null;
                    return (
                      <div key={`barreira-tipo-${tipoObj.id}`} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          {tipoObj.nome}
                        </h5>
                        <CandidatoBarreirasForm
                          candidatoId={candidatoId}
                          subtipo={{ id: tipoObj.id, nome: tipoObj.nome, tipoId: tipoObj.tipoId }}
                          disableActions={false}
                          autoSync={true}
                          initialSelecionadas={candidateBarreiras?.[tipoObj.id]?.selecionadas ?? []}
                          initialNiveis={candidateBarreiras?.[tipoObj.id]?.niveis ?? {}}
                          allBarreiras={allBarreirasByTipo[tipoObj.id] || []}
                          onChange={(selecionadas, niveis) => {
                            setCandidateBarreiras((prev: any) => ({
                              ...(prev || {}),
                              [tipoObj.id]: { selecionadas, niveis },
                            }));
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      )}
    </section>
  );
}
