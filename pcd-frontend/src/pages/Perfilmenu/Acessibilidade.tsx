
import { useState, useEffect } from 'react';
import { FaWheelchair, FaTag, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import CandidatoSubtiposForm from '../../components/candidato/CandidatoSubtiposForm';
import CandidatoBarreirasForm from '../../components/candidato/CandidatoBarreirasForm';
import { api } from '../../lib/api';

type Props = {
  candidatoId: number;
  candidateSubtipos: any[];
  setCandidateSubtipos: (s: any[]) => void;
  candidateBarreiras: Record<number, { selecionadas: number[]; niveis: Record<number,string> }>;
  setCandidateBarreiras: (b: any) => void;
  barreirasBySubtipo: Record<number, any[]>;
};

// export default function Acessibilidade({ candidatoId, candidateSubtipos, setCandidateSubtipos, candidateBarreiras, setCandidateBarreiras, handleLaudoChange, laudoName, laudoSize, removeLaudo, barreirasBySubtipo }: Props) {
export default function Acessibilidade({ candidatoId, candidateSubtipos, setCandidateSubtipos, candidateBarreiras, setCandidateBarreiras, barreirasBySubtipo }: Props) {
    // Laudo removido
  const [openTipo, setOpenTipo] = useState(true);
  const [openBarreiras, setOpenBarreiras] = useState(true);
  const [tiposComSubtipos, setTiposComSubtipos] = useState<any[]>([]);
  // Map tipoId -> all public barriers for that tipo
  const [allBarreirasByTipo, setAllBarreirasByTipo] = useState<Record<number, any[]>>({});
  const [selectedTipoIds, setSelectedTipoIds] = useState<number[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // Carregar tipos com subtipos (público)
    api.listarTiposComSubtiposPublico()
      .then(async (r) => {
        setTiposComSubtipos(r);
        // Após carregar tipos, identificar quais tipos estão selecionados baseado nos subtipos já passados via props
        if (candidateSubtipos && candidateSubtipos.length > 0) {
          const tiposIds = new Set<number>();
          candidateSubtipos.forEach((subtipo: any) => {
            const subtipoId = typeof subtipo === 'number' ? subtipo : subtipo.id;
            r.forEach((tipo: any) => {
              if (tipo.subtipos?.some((s: any) => s.id === subtipoId)) {
                tiposIds.add(tipo.id);
              }
            });
          });
          setSelectedTipoIds(Array.from(tiposIds));
        }
        setLoadingData(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar tipos com subtipos:', err);
        setTiposComSubtipos([]);
        setLoadingData(false);
      });
  }, []);

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

  function toggleTipo(tipoId: number) {
    const tipo = tiposComSubtipos.find((t) => t.id === tipoId);
    if (!tipo) return;
    const subtipoIdsOfTipo: number[] = (tipo.subtipos || []).map((s: any) => s.id);
    const currentIds = candidateSubtipos?.map((s: any) => (typeof s === 'number' ? s : s.id)) ?? [];

    let newIds: number[];
    if (selectedTipoIds.includes(tipoId)) {
      // uncheck: remove subtipo ids of this tipo
      newIds = currentIds.filter((id) => !subtipoIdsOfTipo.includes(id));
      setSelectedTipoIds((prev) => prev.filter((x) => x !== tipoId));
    } else {
      // check: add subtipo ids
      newIds = Array.from(new Set([...currentIds, ...subtipoIdsOfTipo]));
      setSelectedTipoIds((prev) => [...prev, tipoId]);
    }

    // build selected objects from tiposComSubtipos
    const allSubtipos = tiposComSubtipos.flatMap((t) => t.subtipos || []);
    const selectedObjects = allSubtipos.filter((s: any) => newIds.includes(s.id));
    setCandidateSubtipos(selectedObjects);
  }

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
                  {tiposComSubtipos.map((t) => (
                    <label key={`tipo-${t.id}`} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedTipoIds.includes(t.id)} 
                        onChange={() => toggleTipo(t.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 font-medium text-gray-900">{t.nome}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="border-t pt-4">
                {/* Filtra subtipos apenas dos tipos selecionados */}
                <CandidatoSubtiposForm
                  candidatoId={candidatoId}
                  disableActions={false}
                  autoSync={true}
                  allSubtipos={tiposComSubtipos.filter((tipo: any) => selectedTipoIds.includes(tipo.id)).flatMap((tipo: any) => tipo.subtipos || [])}
                  initialSelected={candidateSubtipos && candidateSubtipos.length > 0
                    ? candidateSubtipos.map((s: any) => (typeof s === 'number' ? s : s.id))
                    : []}
                  onChange={(sel) => setCandidateSubtipos(sel)}
                />
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
                <h4 className="font-semibold text-gray-900">Barreiras e Necessidades <span className="text-red-500">*</span></h4>
                <p className="text-sm text-gray-600">Identifique as adaptações que você precisa no ambiente de trabalho</p>
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
                          subtipo={{ id: tipoObj.id, nome: tipoObj.nome }}
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
