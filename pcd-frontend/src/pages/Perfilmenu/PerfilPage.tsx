import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useCandidate } from '../../contexts/CandidateContext';
import { useToast } from '../../components/common/Toast';
// section components imported below
import MeuPerfil from './meuperfil';
import Acessibilidade from './Acessibilidade';
import Endereco from './Endereco';


type Candidato = any;

export default function PerfilPage() {
  const navigate = useNavigate();
  const candCtx = useCandidate();
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  // candidateSubtipos holds array of subtipo objects when available
  const [candidateSubtipos, setCandidateSubtipos] = useState<any[]>([]);
  const [candidateBarreiras, setCandidateBarreiras] = useState<Record<number, { selecionadas: number[]; niveis: Record<number,string> }>>({});
  const [barreirasBySubtipo, setBarreirasBySubtipo] = useState<Record<number, any[]>>({});
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [laudoName, setLaudoName] = useState<string | null>(null);
  const [laudoSize, setLaudoSize] = useState<number | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const idStr = window.location.pathname.split('/')[2];
    const id = Number(idStr);
    if (!id) {
      if (import.meta.env.DEV) console.error('PerfilPage: ID inválido');
      return;
    }
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Verificar se token corresponde ao candidato da URL
        const storedUserId = localStorage.getItem('userId');
        const storedUserType = localStorage.getItem('userType');
        
        // Se não há token ou userId não corresponde, obter novo token
        if (!storedUserId || Number(storedUserId) !== id || storedUserType !== 'candidato') {
          try {
            const devAuth = await api.getDevToken(id);
            localStorage.setItem('token', devAuth.token);
            localStorage.setItem('userType', 'candidato');
            localStorage.setItem('userId', String(id));
          } catch (devErr: any) {
            // Se não conseguir token, candidato não existe - redirecionar
            if (devErr?.status === 404) {
              navigate('/');
              return;
            }
          }
        }
        
        let c: any = null;
        try {
          c = await api.getCandidato(id);
        } catch (err: any) {
          // Se candidato não existe no banco, redirecionar
          if (err?.status === 404) {
            navigate('/');
            return;
          }
        }

        // Se não conseguiu carregar do backend, não continuar
        if (!c) {
          navigate('/');
          return;
        }
        
        // Usar dados do backend como fonte principal
        // localStorage usado apenas para campos de rascunho (ex: sobre, que pode ser editado mas não salvo)
        const local = localStorage.getItem(`candidate_profile_draft_${id}`);
        const draft = local ? JSON.parse(local) : {};
        
        if (mounted) {
          setCandidato(c);
          
          // Carregar áreas de formação disponíveis
          const areasDisponiveis = await api.listarAreasFormacao();
          const areasVinculadas = await api.listarAreasFormacaoCandidato(id);
          
          const formData = {
            nome: c.nome || candCtx.nome || 'Candidato',
            username: c.username ?? draft.username ?? '',
            email: c.email || candCtx.email || '',
            telefone: c.telefone || candCtx.telefone || '',
            cpf: c.cpf || candCtx.cpf || '',
            rua: c.rua ?? draft.rua ?? '',
            bairro: c.bairro ?? draft.bairro ?? '',
            cidade: c.cidade ?? draft.cidade ?? '',
            estado: c.estado ?? draft.estado ?? '',
            cep: c.cep ?? draft.cep ?? '',
            escolaridade: c.escolaridade ?? 'Ensino Médio Completo',
            curso: c.curso ?? draft.curso ?? '',
            sobre: draft.sobre ?? c.sobre ?? '',
            disponibilidadeGeografica: c.disponibilidadeGeografica ?? draft.disponibilidadeGeografica ?? '',
            aceitaMudanca: c.aceitaMudanca ?? draft.aceitaMudanca ?? null,
            aceitaViajar: c.aceitaViajar ?? draft.aceitaViajar ?? null,
            pretensaoSalarialMin: c.pretensaoSalarialMin ?? draft.pretensaoSalarialMin ?? '',
            areasFormacao: areasVinculadas.map((a: any) => a.id),
            areasFormacaoDisponiveis: areasDisponiveis,
          };
          setForm(formData);
        }
        // Carrega subtipos e barreiras diretamente do backend (dados de cadastro inicial)
        if (mounted) {
          try {
            const backendSubtipos = (c?.subtipos || []).map((s: any) => s.subtipo).filter(Boolean);
            
            // Também incluir subtipos que têm barreiras salvas (mesmo que não estejam na lista de subtipos vinculados)
            const barreiraEntries = Array.isArray((c as any)?.barras) ? (c as any).barras : [];
            const subtiposComBarreiras: any[] = [];
            const subtiposIdsJaAdicionados = new Set(backendSubtipos.map((s: any) => s.id));
            
            for (const entry of barreiraEntries) {
              const subtipo = entry?.subtipo;
              if (subtipo && !subtiposIdsJaAdicionados.has(subtipo.id)) {
                subtiposComBarreiras.push(subtipo);
                subtiposIdsJaAdicionados.add(subtipo.id);
              }
            }
            
            const todosSubtipos = [...backendSubtipos, ...subtiposComBarreiras];
            setCandidateSubtipos(todosSubtipos);
            // Mapa de barreiras por subtipo a partir de c.barras
            const barreirasMapIds: Record<number, { selecionadas: number[]; niveis: Record<number,string> }> = {};
            const barreirasBySub: Record<number, any[]> = {};
            for (const entry of barreiraEntries) {
              const subtipoId = entry?.subtipoId || entry?.subtipo?.id;
              const barreira = entry?.barreira;
              if (!subtipoId || !barreira) continue;
              if (!barreirasMapIds[subtipoId]) {
                barreirasMapIds[subtipoId] = { selecionadas: [], niveis: {} };
              }
              barreirasMapIds[subtipoId].selecionadas.push(barreira.id);
              if (!barreirasBySub[subtipoId]) barreirasBySub[subtipoId] = [];
              barreirasBySub[subtipoId].push(barreira);
            }
            setCandidateBarreiras(barreirasMapIds);
            setBarreirasBySubtipo(barreirasBySub);

            // Caso não haja subtipos vinculados ainda (perfil recém-criado), carrega lista completa para seleção
            if (!backendSubtipos.length) {
              try {
                const allSubs = await api.listarSubtipos();
                setCandidateSubtipos(allSubs);
                console.log('PerfilPage: Sem subtipos vinculados, carregando todos para seleção:', allSubs.length);
              } catch (errAll) {
                console.warn('PerfilPage: Erro ao carregar todos os subtipos para seleção:', errAll);
              }
            }
            // Para cada subtipo disponível, se ainda não temos barreirasBySubtipo (ex: sem vínculos) carregamos catálogo de barreiras
            const subsForCatalog = backendSubtipos.length ? backendSubtipos : (c?.subtipos || []).map((s: any) => s.subtipo).filter(Boolean);
            for (const sub of subsForCatalog) {
              if (!sub?.id) continue;
              if (barreirasBySub[sub.id]) continue; // já temos do vínculo
              try {
                const barreirasCat = await api.listarBarreirasPorSubtipo(sub.id);
                setBarreirasBySubtipo(prev => ({ ...prev, [sub.id]: barreirasCat }));
              } catch (eCat) {
                console.warn('PerfilPage: Erro ao carregar catálogo de barreiras para subtipo', sub.id, eCat);
              }
            }
          } catch (err) {
            console.error('PerfilPage: Erro ao processar dados de acessibilidade do backend:', err);
          }
        }
        const av = localStorage.getItem(`candidate_avatar_${id}`) || null;
        if (mounted) setAvatarPreview(av as string | null);
        // initialize laudo/curriculo from saved profile overrides
        try {
          const savedProfileRaw = localStorage.getItem(`candidate_profile_${id}`);
          if (savedProfileRaw) {
            const sp = JSON.parse(savedProfileRaw);
            if (sp?.laudo) {
              setLaudoName(sp.laudo.name || null);
              setLaudoSize(sp.laudo.size || null);
            }
          }
        } catch (e) {
          // ignore
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, []);

  function handleInput<K extends string>(key: K, value: any) {
    setForm((s: any) => ({ ...s, [key]: value }));
    setErrors(e => ({ ...e, [key]: '' }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(String(reader.result || ''));
    reader.readAsDataURL(f);
  }

  function removeAvatar() {
    const idStr = window.location.pathname.split('/')[2];
    const id = Number(idStr);
    if (!id) return;
    localStorage.removeItem(`candidate_avatar_${id}`);
    setAvatarPreview(null);
    addToast({ type: 'success', title: 'Foto', message: 'Foto removida.' });
  }

  function validateEmail(e: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(e);
  }

  function validateCelular(telefone: string) {
    // Remove todos os caracteres não numéricos
    const numbers = telefone.replace(/\D/g, '');
    // Aceita: (DD) XXXXX-XXXX ou (DD) 9XXXX-XXXX (10 ou 11 dígitos)
    // Também aceita DDI: +55DDXXXXXXXXX (12 ou 13 dígitos)
    return (numbers.length === 10 || numbers.length === 11 || numbers.length === 12 || numbers.length === 13);
  }

  // formatCelular não é utilizado; removido para satisfazer noUnusedLocals

  async function handleSave() {
    const idStr = window.location.pathname.split('/')[2];
    const id = Number(idStr);
    if (!id) return;
    // basic validation (required fields)
    const newErrors: Record<string,string> = {};
    // accept either full name or social name as valid
    if (!form.nome || String(form.nome).trim().length < 2) newErrors.nome = 'Informe o Nome completo.';
    if (!form.email || !validateEmail(form.email)) newErrors.email = 'Email inválido. Use o formato: usuario@dominio.com';
    if (!form.telefone || !validateCelular(form.telefone)) newErrors.telefone = 'Celular inválido. Use o formato: (DD) XXXXX-XXXX';
    // cpf comes from cadastro
    if (!form.cpf) newErrors.cpf = 'CPF não encontrado no cadastro.';
    // require at least one subtipo
    if (!candidateSubtipos || candidateSubtipos.length === 0) newErrors.subtipos = 'Selecione pelo menos um tipo de deficiência.';
    // escolaridade required
    if (!form.escolaridade || String(form.escolaridade).trim().length === 0) newErrors.escolaridade = 'Escolaridade é obrigatória.';
    // if ensino superior, require areas formacao
    if (form.escolaridade && /superior/i.test(String(form.escolaridade)) && (!form.areasFormacao || form.areasFormacao.length === 0)) newErrors.curso = 'Selecione pelo menos uma área de formação (ensino superior).';
    // barreiras: ensure at least one selected per subtipo
    if (candidateSubtipos && candidateSubtipos.length > 0) {
      for (const s of candidateSubtipos) {
        const entry = candidateBarreiras?.[s.id];
        if (!entry || !entry.selecionadas || entry.selecionadas.length === 0) {
          newErrors.barreiras = 'Selecione pelo menos uma barreira para cada tipo de deficiência.';
          break;
        }
      }
    }

    // novos campos obrigatórios de perfil completo
    if (!form.cidade || String(form.cidade).trim().length === 0) newErrors.cidade = 'Cidade é obrigatória.';
    if (!form.estado || String(form.estado).trim().length === 0) newErrors.estado = 'Estado é obrigatório.';
    if (!form.disponibilidadeGeografica || String(form.disponibilidadeGeografica).trim().length === 0) newErrors.disponibilidadeGeografica = 'Informe a disponibilidade geográfica.';
    if (form.aceitaMudanca === null || form.aceitaMudanca === undefined) newErrors.aceitaMudanca = 'Informe se aceita mudança.';
    if (form.aceitaViajar === null || form.aceitaViajar === undefined) newErrors.aceitaViajar = 'Informe se aceita viajar.';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      // show first message
      const first = Object.values(newErrors)[0];
      return addToast({ type: 'error', title: 'Validação', message: first });
    }

    setSaving(true);
    try {
      // Debug: verificar token e dados
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      console.log('=== DEBUG SAVE ===');
      console.log('ID da URL:', id);
      console.log('userId localStorage:', userId);
      console.log('Token existe:', !!token);
      console.log('Dados a enviar:', {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        escolaridade: form.escolaridade,
        curso: form.curso,
        cidade: form.cidade,
        estado: form.estado,
        disponibilidadeGeografica: form.disponibilidadeGeografica,
        aceitaMudanca: form.aceitaMudanca,
        aceitaViajar: form.aceitaViajar,
        pretensaoSalarialMin: form.pretensaoSalarialMin ? Number(form.pretensaoSalarialMin) : undefined,
      });
      
      // Salvar dados no backend
      const resultado = await api.atualizarCandidato(id, {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        escolaridade: form.escolaridade,
        curso: form.curso,
        cidade: form.cidade,
        estado: form.estado,
        disponibilidadeGeografica: form.disponibilidadeGeografica,
        aceitaMudanca: form.aceitaMudanca,
        aceitaViajar: form.aceitaViajar,
        pretensaoSalarialMin: form.pretensaoSalarialMin ? Number(form.pretensaoSalarialMin) : undefined,
      });
      console.log('Resultado da atualização:', resultado);
      console.log('Resultado da atualização:', resultado);

      // Salvar áreas de formação
      if (form.areasFormacao && form.areasFormacao.length > 0) {
        console.log('Vinculando áreas de formação:', form.areasFormacao);
        await api.vincularAreasFormacaoCandidato(id, form.areasFormacao);
      }

      // Save avatar local (temporário até implementar upload)
      if (avatarPreview) {
        localStorage.setItem(`candidate_avatar_${id}`, avatarPreview);
      }
      
      // Salvar apenas rascunho de campos não enviados ao backend
      const draft = {
        sobre: form.sobre,
        rua: form.rua,
        bairro: form.bairro,
        cep: form.cep,
      };
      localStorage.setItem(`candidate_profile_draft_${id}`, JSON.stringify(draft));
      
      // Limpar cache antigo
      localStorage.removeItem(`candidate_profile_${id}`);
      
      // Dispatch event
      window.dispatchEvent(new CustomEvent('candidateProfileChanged', { detail: { id, data: form } }));
      setTimeout(() => {
        setSaving(false);
        addToast({ type: 'success', title: 'Salvo', message: 'Alterações salvas com sucesso.' });
        // Atualizar página para garantir dados sincronizados
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }, 600);
    } catch (e: any) {
      console.error('=== ERRO AO SALVAR ===');
      console.error('Erro:', e);
      console.error('Status:', e?.status);
      console.error('Message:', e?.message);
      console.error('Response:', e?.response?.data);
      setSaving(false);
      addToast({ type: 'error', title: 'Erro', message: e?.message || 'Não foi possível salvar.' });
    }
  }

  // removed password reset: candidates do not edit password here

  // file handlers for laudo (medical report) and curriculo
  function handleLaudoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setLaudoName(f.name);
    setLaudoSize(f.size);
    // TODO: Implementar upload de laudo para o backend
  }

  function removeLaudo() {
    setLaudoName(null);
    setLaudoSize(null);
    // TODO: Remover laudo do backend
    addToast({ type: 'success', title: 'Laudo', message: 'Laudo removido.' });
  }

  function computeCompleteness() {
    let total = 0;
    let filled = 0;
    const checks = [
      { key: 'nomeOrSocial', required: true },
      { key: 'cpf', required: true },
      { key: 'email', required: true },
      { key: 'telefone', required: true },
      { key: 'escolaridade', required: true },
      { key: 'cidade', required: true },
      { key: 'estado', required: true },
      { key: 'disponibilidadeGeografica', required: true },
    ];
    total += checks.length;
    checks.forEach(c => {
      if (c.key === 'nomeOrSocial') {
        if (form.nome && String(form.nome).trim().length) filled++;
      } else if (form[c.key] && String(form[c.key]).trim().length) filled++;
    });
    // aceitaMudanca & aceitaViajar (boolean checks)
    total += 2;
    if (form.aceitaMudanca !== null && form.aceitaMudanca !== undefined) filled++;
    if (form.aceitaViajar !== null && form.aceitaViajar !== undefined) filled++;
    // subtipos
    total += 1; if (candidateSubtipos && candidateSubtipos.length) filled++;
    // barreiras
    total += 1; let barriersOk = true; if (candidateSubtipos && candidateSubtipos.length) {
      for (const s of candidateSubtipos) {
        const entry = candidateBarreiras?.[s.id];
        if (!entry || !entry.selecionadas || entry.selecionadas.length === 0) { barriersOk = false; break; }
      }
    } else barriersOk = false;
    if (barriersOk) filled++;
    const pct = Math.round((filled / total) * 100);
    return pct;
  }

  // autosave draft (debounced) — salvar apenas rascunho local de campos não persistidos
  useEffect(() => {
    const timer = setTimeout(() => {
      const idStr = window.location.pathname.split('/')[2];
      const id = Number(idStr);
      if (!id) return;
      try {
        const draft = {
          sobre: form.sobre,
          rua: form.rua,
          bairro: form.bairro,
          cep: form.cep,
        };
        localStorage.setItem(`candidate_profile_draft_${id}`, JSON.stringify(draft));
      } catch (e) {
        // ignore
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [form.sobre, form.rua, form.bairro, form.cep]);

  // helper to smoothly scroll to a section by id
  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (loading) return <div>Carregando perfil...</div>;

  return (
    <div className="space-y-6">
      <section className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <main className="md:col-span-1">
            <div className="bg-white p-8 rounded border space-y-6">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Seu perfil está {computeCompleteness()}% completo</div>
                  <nav className="flex gap-2 overflow-x-auto">
                    <button onClick={(e) => { e.preventDefault(); scrollToSection('dados-pessoais'); }} className="px-3 py-2 rounded bg-sky-50 text-sm">Dados Pessoais</button>
                    <button onClick={(e) => { e.preventDefault(); scrollToSection('endereco'); }} className="px-3 py-2 rounded text-sm">Endereço</button>
                    <button onClick={(e) => { e.preventDefault(); scrollToSection('acessibilidade'); }} className="px-3 py-2 rounded text-sm">Acessibilidade</button>
                  </nav>
                </div>
                <h2 id="perfil" className="text-2xl font-semibold">Perfil</h2>
              </div>

              <MeuPerfil
                avatarPreview={avatarPreview}
                candidato={candidato}
                fileRef={fileRef}
                handleFileChange={handleFileChange}
                removeAvatar={removeAvatar}
                form={form}
                handleInput={handleInput}
                errors={errors}
              />

              <Endereco form={form} handleInput={handleInput} />

              <Acessibilidade
                candidatoId={candidato?.id || candCtx.id || 0}
                candidateSubtipos={candidateSubtipos}
                setCandidateSubtipos={setCandidateSubtipos}
                candidateBarreiras={candidateBarreiras}
                setCandidateBarreiras={setCandidateBarreiras}
                handleLaudoChange={handleLaudoChange}
                laudoName={laudoName}
                laudoSize={laudoSize}
                removeLaudo={removeLaudo}
                barreirasBySubtipo={barreirasBySubtipo}
              />

              <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-sky-600 text-white rounded">{saving ? 'Salvando...' : 'Salvar alterações'}</button>
              </div>
            </div>
          </main>
        </div>
      </section>
      {/* Mobile fixed save button */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white p-3 border-t flex justify-center z-40">
        <button onClick={handleSave} disabled={saving} className="w-full max-w-lg bg-sky-600 text-white py-3 rounded">{saving ? 'Salvando...' : 'Salvar alterações'}</button>
      </div>
    </div>
  );
}

