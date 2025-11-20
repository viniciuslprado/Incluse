import React, { useState, useEffect } from 'react';
import CandidatoSubtiposForm from '../../components/candidato/CandidatoSubtiposForm';
import CandidatoBarreirasForm from '../../components/candidato/CandidatoBarreirasForm';
import { api } from '../../lib/api';

type Props = {
  candidateSubtipos: any[];
  setCandidateSubtipos: (s: any[]) => void;
  candidateBarreiras: Record<number, { selecionadas: number[]; niveis: Record<number,string> }>;
  setCandidateBarreiras: (b: any) => void;
  handleLaudoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  laudoName: string | null;
  laudoSize: number | null;
  removeLaudo: () => void;
  barreirasBySubtipo?: Record<number, any[]>;
};

export default function Acessibilidade({ candidateSubtipos, setCandidateSubtipos, candidateBarreiras, setCandidateBarreiras, handleLaudoChange, laudoName, laudoSize, removeLaudo, barreirasBySubtipo }: Props) {
  const [openLaudo, setOpenLaudo] = useState(true);
  const [openTipo, setOpenTipo] = useState(true);
  const [openBarreiras, setOpenBarreiras] = useState(true);
  const [tiposComSubtipos, setTiposComSubtipos] = useState<any[]>([]);
  const [selectedTipoIds, setSelectedTipoIds] = useState<number[]>([]);

  useEffect(() => {
    api.listarTiposComSubtipos().then((r) => setTiposComSubtipos(r)).catch(() => setTiposComSubtipos([]));
  }, []);

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
      <h2 className="text-2xl font-semibold">Acessibilidade</h2>
      <div className="bg-white border rounded p-4 space-y-4 shadow-sm">
        {/* 2.1 Laudo Médico */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setOpenLaudo(!openLaudo)} aria-expanded={openLaudo} className="w-8 h-8 flex items-center justify-center rounded border text-sm">
                {openLaudo ? '−' : '+'}
              </button>
              <h4 className="font-medium">Laudo Médico <span className="text-red-600">*</span></h4>
            </div>
            <button type="button" title="Seu laudo é mantido em sigilo e usado somente para avaliar adaptações necessárias." className="text-gray-400 hover:text-gray-600 text-sm">ℹ️</button>
          </div>
          {openLaudo && (
            <div className="mt-3 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Upload PDF/JPG/PNG. O arquivo é privado e usado apenas para verificar necessidades.</p>
              <div className="mt-2 flex items-center gap-3">
                <label htmlFor="laudoFile" className="inline-block px-3 py-1 rounded bg-white border text-sm cursor-pointer">Selecionar arquivo</label>
                <input id="laudoFile" type="file" accept=".pdf,image/*" onChange={handleLaudoChange} className="sr-only" aria-describedby="laudo-help" />
                {laudoName && <div className="text-sm text-gray-700">{laudoName} {laudoSize ? `• ${Math.round(laudoSize/1024)} KB` : ''}</div>}
                {laudoName && <button onClick={removeLaudo} className="text-sm text-red-600">Remover</button>}
              </div>
            </div>
          )}
        </div>

        {/* 2.2 Tipo de Deficiência */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setOpenTipo(!openTipo)} aria-expanded={openTipo} className="w-8 h-8 flex items-center justify-center rounded border text-sm">
                {openTipo ? '−' : '+'}
              </button>
              <h4 className="font-medium">Tipo de deficiência <span className="text-red-600">*</span></h4>
            </div>
            <div className="text-sm text-gray-500">Campo obrigatório</div>
          </div>
          {openTipo && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-2">Selecione os tipos que se aplicam ao seu cadastro.</p>
              {/* Tipos (ex.: Motora, Mental) — selecionar um tipo seleciona seus subtipos */}
              {tiposComSubtipos.length > 0 && (
                <div className="mb-3 space-y-2">
                  {tiposComSubtipos.map((t) => (
                    <label key={t.id} className="flex items-center space-x-2">
                      <input type="checkbox" checked={selectedTipoIds.includes(t.id)} onChange={() => toggleTipo(t.id)} />
                      <span className="font-medium">{t.nome}</span>
                    </label>
                  ))}
                </div>
              )}

              <CandidatoSubtiposForm
                candidatoId={Number(window.location.pathname.split('/')[2])}
                disableActions={true}
                initialSelected={candidateSubtipos?.map((s: any) => (typeof s === 'number' ? s : s.id)) ?? []}
                onChange={(sel) => setCandidateSubtipos(sel)}
              />
            </div>
          )}
        </div>

        {/* 2.3 Barreiras / Necessidades */}
        <div>
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setOpenBarreiras(!openBarreiras)} aria-expanded={openBarreiras} className="w-8 h-8 flex items-center justify-center rounded border text-sm">
                {openBarreiras ? '−' : '+'}
              </button>
              <h4 className="font-medium">Barreiras / Necessidades <span className="text-red-600">*</span></h4>
            </div>
          </div>
          {openBarreiras && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-2">Selecione as barreiras ou necessidades que você enfrenta. Isso ajuda a encontrar vagas e ambientes compatíveis.</p>

              {(!candidateSubtipos || candidateSubtipos.length === 0) && (
                <div className="text-sm text-gray-500">Selecione primeiro o(s) Tipo(s) de deficiência acima para ver as barreiras relacionadas.</div>
              )}

              {candidateSubtipos && candidateSubtipos.length > 0 && (
                <div className="mt-2 space-y-4">
                  {candidateSubtipos.map((s: any) => {
                    const subtipoObj = typeof s === 'number' ? { id: s, nome: `Subtipo ${s}` } : s;
                    return (
                      <CandidatoBarreirasForm
                        key={subtipoObj.id}
                        candidatoId={Number(window.location.pathname.split('/')[2])}
                        subtipo={subtipoObj}
                        disableActions={true}
                        initialSelecionadas={candidateBarreiras?.[subtipoObj.id]?.selecionadas ?? []}
                        initialNiveis={candidateBarreiras?.[subtipoObj.id]?.niveis ?? {}}
                        barreirasOverride={barreirasBySubtipo ? barreirasBySubtipo[subtipoObj.id] : undefined}
                        onChange={(selecionadas, niveis) => {
                          setCandidateBarreiras((prev: any) => ({
                            ...(prev || {}),
                            [subtipoObj.id]: { selecionadas, niveis },
                          }));
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
