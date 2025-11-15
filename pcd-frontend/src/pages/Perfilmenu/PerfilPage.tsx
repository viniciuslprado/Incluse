import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../components/ui/Toast';
// section components imported below
import MeuPerfil from './meuperfil';
import Acessibilidade from './Acessibilidade';
import Endereco from './Endereco';
import Profissional from './Profissional';

type Candidato = any;

export default function PerfilPage() {
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
  const [curriculoName, setCurriculoName] = useState<string | null>(null);
  const [curriculoDate, setCurriculoDate] = useState<string | null>(null);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const idStr = window.location.pathname.split('/')[2];
    const id = Number(idStr);
    if (!id) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const c = await api.getCandidato(id).catch(() => null);
        const local = localStorage.getItem(`candidate_profile_${id}`);
        const overrides = local ? JSON.parse(local) : {};
        const merged = { ...(c || {}), ...overrides };
        if (mounted) {
          setCandidato(merged);
          setForm({
            nome: merged.nome ?? '',
            nomeSocial: merged.nomeSocial ?? merged.nomeSocial ?? '',
            username: merged.username ?? merged.username ?? '',
            email: merged.email ?? '',
            telefone: merged.telefone ?? '',
            cpf: merged.cpf ?? '',
            rua: merged.rua ?? merged.endereco ?? '',
            bairro: merged.bairro ?? '',
            cidade: merged.cidade ?? '',
            estado: merged.estado ?? '',
            cep: merged.cep ?? '',
            escolaridade: merged.escolaridade ?? '',
            curso: merged.curso ?? '',
            sobre: merged.sobre ?? '',
          });
        }
        // load candidate subtipos (if backend available)
        try {
          const subs = await api.listarSubtiposCandidato(id).catch(() => []);
          // prefer local overrides when available
          const localSubsRaw = localStorage.getItem(`candidate_subtipos_${id}`);
          const localBarreirasRaw = localStorage.getItem(`candidate_barreiras_${id}`);
          const localSubs = localSubsRaw ? JSON.parse(localSubsRaw) : null;
          const localBar = localBarreirasRaw ? JSON.parse(localBarreirasRaw) : null;
          if (mounted) {
            // normalize localSubs: they might be stored as array of ids or as full objects
            let normalizedSubs: any[] | null = null;
            if (localSubs) {
              if (Array.isArray(localSubs) && localSubs.length && typeof localSubs[0] === 'number') {
                // localSubs is array of ids -> map to objects using fetched list `subs` or full list
                const all = (await api.listarSubtipos().catch(() => subs || [])) || subs || [];
                normalizedSubs = localSubs.map((idNum: number) => all.find((a: any) => a.id === idNum)).filter(Boolean);
              } else if (Array.isArray(localSubs)) {
                normalizedSubs = localSubs; // assume array of objects
              }
            }
            const chosenSubs = normalizedSubs ?? (subs || []);
            setCandidateSubtipos(chosenSubs);
            // if candidate has no linked subtipos, try to fetch all subtipos so UI shows options
            if ((!chosenSubs || chosenSubs.length === 0)) {
              const all = await api.listarSubtipos().catch(() => []);
              if (all && all.length) setCandidateSubtipos(all);
            }
            // attempt to fetch barriers per subtipo (for better UX when backend provides them)
            try {
              const list = chosenSubs && chosenSubs.length ? chosenSubs : (await api.listarSubtipos().catch(() => []));
              const map: Record<number, any[]> = {};
              await Promise.all((list || []).map(async (s: any) => {
                try {
                  const b = await api.listarBarreirasPorSubtipo(s.id).catch(() => []);
                  map[s.id] = b || [];
                } catch {
                  map[s.id] = [];
                }
              }));
              setBarreirasBySubtipo(map);
            } catch {
              // ignore
            }
            if (localBar) setCandidateBarreiras(localBar);
          }
        } catch (err) {
          // ignore, but keep subs as empty
          if (mounted) setCandidateSubtipos([]);
        }
        const av = localStorage.getItem(`candidate_avatar_${id}`) || merged.fotoUrl || null;
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
            if (sp?.curriculo) {
              setCurriculoName(sp.curriculo.name || null);
              setCurriculoDate(sp.curriculo.date ? new Date(sp.curriculo.date).toLocaleDateString() : null);
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
    return /.+@.+\..+/.test(e);
  }

  async function handleSave() {
    const idStr = window.location.pathname.split('/')[2];
    const id = Number(idStr);
    if (!id) return;
    // basic validation (required fields)
    const newErrors: Record<string,string> = {};
    // accept either full name or social name as valid
    if ((!form.nome || String(form.nome).trim().length < 2) && (!form.nomeSocial || String(form.nomeSocial).trim().length < 2)) newErrors.nome = 'Informe o Nome completo ou Nome Social.';
    if (!form.email || !validateEmail(form.email)) newErrors.email = 'Email inválido.';
    if (!form.telefone || String(form.telefone).trim().length < 8) newErrors.telefone = 'Telefone é obrigatório.';
    // cpf comes from cadastro
    if (!form.cpf) newErrors.cpf = 'CPF não encontrado no cadastro.';
    // require at least one subtipo
    if (!candidateSubtipos || candidateSubtipos.length === 0) newErrors.subtipos = 'Selecione pelo menos um tipo de deficiência.';
    // escolaridade required
    if (!form.escolaridade || String(form.escolaridade).trim().length === 0) newErrors.escolaridade = 'Escolaridade é obrigatória.';
    // if ensino superior, require curso
    if (form.escolaridade && /superior/i.test(String(form.escolaridade)) && (!form.curso || String(form.curso).trim().length === 0)) newErrors.curso = 'Informe o curso (ensino superior).';
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

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      // show first message
      const first = Object.values(newErrors)[0];
      return addToast({ type: 'error', title: 'Validação', message: first });
    }

    setSaving(true);
    try {
      // Save avatar local
      if (avatarPreview) localStorage.setItem(`candidate_avatar_${id}`, avatarPreview);
      // Save profile overrides locally for now
      // include subtipos and barreiras in saved profile
      const profileToSave = { ...form, subtipos: candidateSubtipos, barreiras: candidateBarreiras };
      localStorage.setItem(`candidate_profile_${id}`, JSON.stringify(profileToSave));
      // also separate entries for ease of access
      if (candidateSubtipos) localStorage.setItem(`candidate_subtipos_${id}`, JSON.stringify(candidateSubtipos));
      if (candidateBarreiras) localStorage.setItem(`candidate_barreiras_${id}`, JSON.stringify(candidateBarreiras));
      if (form.username) localStorage.setItem(`candidate_username_${id}`, String(form.username));
      // Optionally, dispatch event
      window.dispatchEvent(new CustomEvent('candidateProfileChanged', { detail: { id, data: form } }));
      setTimeout(() => {
        setSaving(false);
        addToast({ type: 'success', title: 'Salvo', message: 'Alterações salvas com sucesso.' });
      }, 600);
    } catch (e) {
      setSaving(false);
      addToast({ type: 'error', title: 'Erro', message: 'Não foi possível salvar.' });
    }
  }

  // removed password reset: candidates do not edit password here

  // file handlers for laudo (medical report) and curriculo
  function handleLaudoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setLaudoName(f.name);
    setLaudoSize(f.size);
    // save file name to local profile preview only
    const idStr = window.location.pathname.split('/')[2];
    const id = Number(idStr);
    if (id) {
      const existing = localStorage.getItem(`candidate_profile_${id}`);
      const parsed = existing ? JSON.parse(existing) : {};
      parsed.laudo = { name: f.name, size: f.size };
      localStorage.setItem(`candidate_profile_${id}`, JSON.stringify(parsed));
      setSavedStatus('Alterações salvas');
      setTimeout(() => setSavedStatus(null), 1200);
    }
  }

  function removeLaudo() {
    setLaudoName(null);
    setLaudoSize(null);
    const idStr = window.location.pathname.split('/')[2];
    const id = Number(idStr);
    if (id) {
      const existing = localStorage.getItem(`candidate_profile_${id}`);
      const parsed = existing ? JSON.parse(existing) : {};
      delete parsed.laudo;
      localStorage.setItem(`candidate_profile_${id}`, JSON.stringify(parsed));
    }
    addToast({ type: 'success', title: 'Laudo', message: 'Laudo removido.' });
  }

  function handleCurriculoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setCurriculoName(f.name);
    setCurriculoDate(new Date().toLocaleDateString());
    const idStr = window.location.pathname.split('/')[2];
    const id = Number(idStr);
    if (id) {
      const existing = localStorage.getItem(`candidate_profile_${id}`);
      const parsed = existing ? JSON.parse(existing) : {};
      parsed.curriculo = { name: f.name, date: new Date().toISOString() };
      localStorage.setItem(`candidate_profile_${id}`, JSON.stringify(parsed));
      setSavedStatus('Alterações salvas');
      setTimeout(() => setSavedStatus(null), 1200);
    }
  }

  function removeCurriculo() {
    setCurriculoName(null);
    setCurriculoDate(null);
    const idStr = window.location.pathname.split('/')[2];
    const id = Number(idStr);
    if (id) {
      const existing = localStorage.getItem(`candidate_profile_${id}`);
      const parsed = existing ? JSON.parse(existing) : {};
      delete parsed.curriculo;
      localStorage.setItem(`candidate_profile_${id}`, JSON.stringify(parsed));
    }
    addToast({ type: 'success', title: 'Currículo', message: 'Currículo removido.' });
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
    ];
    total += checks.length;
    checks.forEach(c => {
      if (c.key === 'nomeOrSocial') {
        if ((form.nome && String(form.nome).trim().length) || (form.nomeSocial && String(form.nomeSocial).trim().length)) filled++;
      } else if (form[c.key] && String(form[c.key]).trim().length) filled++;
    });
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
    // curriculo
    total += 1; if (curriculoName) filled++;
    const pct = Math.round((filled / total) * 100);
    return pct;
  }

  // autosave (debounced) — save profile overrides locally and show small status
  useEffect(() => {
    const timer = setTimeout(() => {
      const idStr = window.location.pathname.split('/')[2];
      const id = Number(idStr);
      if (!id) return;
      try {
        const profileToSave = { ...form, subtipos: candidateSubtipos, barreiras: candidateBarreiras, laudo: laudoName ? { name: laudoName, size: laudoSize } : undefined, curriculo: curriculoName ? { name: curriculoName, date: curriculoDate } : undefined };
        localStorage.setItem(`candidate_profile_${id}`, JSON.stringify(profileToSave));
        setSavedStatus('Alterações salvas');
        setTimeout(() => setSavedStatus(null), 1000);
      } catch (e) {
        // ignore
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [form, candidateSubtipos, candidateBarreiras, laudoName, laudoSize, curriculoName, curriculoDate]);

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
                    <button onClick={(e) => { e.preventDefault(); scrollToSection('dados-pessoais'); }} className="px-3 py-2 rounded bg-sky-50 text-sm">Meu Perfil</button>
                    <button onClick={(e) => { e.preventDefault(); scrollToSection('acessibilidade'); }} className="px-3 py-2 rounded text-sm">Acessibilidade</button>
                    <button onClick={(e) => { e.preventDefault(); scrollToSection('endereco'); }} className="px-3 py-2 rounded text-sm">Endereço</button>
                    <button onClick={(e) => { e.preventDefault(); scrollToSection('profissional'); }} className="px-3 py-2 rounded text-sm">Informações Profissionais</button>
                  </nav>
                </div>
                <h2 id="perfil" className="text-2xl font-semibold">Meu Perfil</h2>
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

              <Acessibilidade
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

              <Endereco form={form} handleInput={handleInput} />

              <Profissional
                form={form}
                handleInput={handleInput}
                curriculoName={curriculoName}
                curriculoDate={curriculoDate}
                handleCurriculoChange={handleCurriculoChange}
                removeCurriculo={removeCurriculo}
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

