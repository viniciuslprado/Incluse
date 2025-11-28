import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import type { TipoComSubtipos, Barreira } from '../../types';
import { PasswordInput } from '../../components/PasswordInput';
import { formatPhone, unformatPhone } from '../../utils/formatters';

export default function CadastroCandidatoPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    escolaridade: '',
  });

  const [fileCurriculo, setFileCurriculo] = useState<File | null>(null);
  const [fileLaudo, setFileLaudo] = useState<File | null>(null);

  const [checkboxes, setCheckboxes] = useState({
    declaracaoPCD: false,
    politicaPrivacidade: false,
  });

  const [tiposDeficiencia, setTiposDeficiencia] = useState<TipoComSubtipos[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [duplicateCpf, setDuplicateCpf] = useState<string | null>(null);
  const [_loadingTipos, setLoadingTipos] = useState(true);

  // Real-time validation states
  const [cpfWarning, setCpfWarning] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [checkingCpf, setCheckingCpf] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 specific
  const [selectedTipoId, setSelectedTipoId] = useState<number | null>(null);
  const [selectedSubtipoId, setSelectedSubtipoId] = useState<number | null>(null);
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [selectedBarreiras, setSelectedBarreiras] = useState<number[]>([]);

  // Carregar tipos de deficiência
  useEffect(() => {
    async function carregarTipos() {
      try {
        const tipos = await api.listarTiposComSubtipos();
        setTiposDeficiencia(tipos);
      } catch (error) {
        console.error('Erro ao carregar tipos:', error);
      } finally {
        setLoadingTipos(false);
      }
    }
    carregarTipos();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep2 = () => {
    if (!formData.escolaridade?.trim()) return 'Escolaridade é obrigatória.';
    return null;
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCheckboxes(prev => ({ ...prev, [name]: checked }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };



  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
    setCpfWarning(null);
  };

  const handleCPFBlur = async () => {
    const cpfOnly = formData.cpf.replace(/\D/g, '');
    if (cpfOnly.length !== 11) return;
    setCheckingCpf(true);
    try {
      const exists = await api.checkCpfExists(cpfOnly);
      if (exists) {
        setCpfWarning('Já existe uma conta cadastrada com este CPF.');
      } else {
        setCpfWarning(null);
      }
    } catch (err) {
      console.error('Erro ao verificar CPF:', err);
    } finally {
      setCheckingCpf(false);
    }
  };

  const handleEmailBlur = async () => {
    const email = formData.email.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setCheckingEmail(true);
    try {
      const exists = await api.checkCandidatoEmailExists(email);
      if (exists) {
        setEmailWarning('Já existe uma conta cadastrada com este e-mail.');
      } else {
        setEmailWarning(null);
      }
    } catch (err) {
      console.error('Erro ao verificar e-mail:', err);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const unformatted = unformatPhone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: unformatted }));
  };

  const formatFileSize = (size?: number) => {
    if (!size) return '';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleCurriculoChange = (f?: File | null) => {
    setFileCurriculo(f ?? null);
  };

  const handleLaudoChange = (f?: File | null) => {
    setFileLaudo(f ?? null);
  };

  const navigate = useNavigate();

  // Validações do Passo 1
  const validateStep1 = () => {
    setErro(null);
    if (!formData.nomeCompleto.trim()) return 'Nome completo é obrigatório.';
    if (formData.cpf.replace(/\D/g, '').length !== 11) return 'CPF deve ter 11 dígitos.';
    if (!formData.telefone.trim()) return 'Telefone é obrigatório.';
    if (!formData.email.trim()) return 'E-mail é obrigatório.';
    // simple email regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'E-mail inválido.';
    if (formData.senha.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
    if (formData.senha !== formData.confirmarSenha) return 'As senhas não conferem.';
    if (!checkboxes.declaracaoPCD) return 'Você deve declarar que é uma pessoa com deficiência.';
    if (!checkboxes.politicaPrivacidade) return 'Você deve concordar com a política de privacidade.';
    return null;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateStep1();
    if (v) {
      setErro(v);
      return;
    }
    setErro(null);
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateStep2();
    if (v) {
      setErro(v);
      return;
    }
    setErro(null);
    setStep(3);
  };

  // quando subtipo for selecionado, buscar barreiras
  useEffect(() => {
    async function carregarBarreiras() {
      setBarreiras([]);
      setSelectedBarreiras([]);
      if (!selectedSubtipoId) return;
      try {
        const b = await api.listarBarreirasPorSubtipo(selectedSubtipoId);
        setBarreiras(b ?? []);
      } catch (err) {
        console.error('Erro ao carregar barreiras:', err);
      }
    }
    carregarBarreiras();
  }, [selectedSubtipoId]);

  const toggleBarreira = (id: number) => {
    setSelectedBarreiras(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  // Finalizar cadastro: cria candidato e vincula subtipo/barreiras
  const handleFinalSubmit = async () => {
    setErro(null);
    if (!selectedSubtipoId) {
      setErro('Selecione um subtipo de deficiência.');
      return;
    }
    if (!Array.isArray(selectedBarreiras) || selectedBarreiras.length === 0) {
      setErro('Selecione pelo menos uma barreira.');
      return;
    }
    setLoading(true);
    try {
      // build FormData to include optional files
      const fd = new FormData();
      fd.append('nome', formData.nomeCompleto.trim());
      fd.append('cpf', formData.cpf);
      fd.append('telefone', formData.telefone);
      fd.append('email', formData.email);
      fd.append('escolaridade', formData.escolaridade);
      fd.append('senha', formData.senha);
      if (fileCurriculo) fd.append('file', fileCurriculo);
      if (fileLaudo) fd.append('laudo', fileLaudo);

      // debug: log FormData entries to browser console to inspect what will be sent
      for (const entry of Array.from(fd.entries())) {
        console.debug('[CadastroCandidato] formData entry:', entry[0], entry[1]);
      }

      const created: any = await api.registerCandidatoWithFiles(fd);
      const candidatoId = created?.id;
      if (!candidatoId) throw new Error('Resposta inválida do servidor');
      // vincular subtipo
      await api.vincularSubtiposACandidato(candidatoId, [selectedSubtipoId]);
      // vincular barreiras (se houver)
      if (selectedBarreiras.length > 0) {
        await api.vincularBarreirasACandidato(candidatoId, selectedSubtipoId, selectedBarreiras);
      }
      // redirect to candidate dashboard
      navigate(`/candidato/${candidatoId}`);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      setErro(msg || 'Erro ao finalizar cadastro.');
      // detect duplicate CPF message and show options
      if (typeof msg === 'string' && msg.includes('CPF já cadastrado')) {
        setDuplicateCpf(formData.cpf);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Cadastro de Candidato</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">Fazer login</Link>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow rounded-lg">
          {/* Progress indicator for multi-step form */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Etapa {step}/3</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{step}/3</div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded overflow-hidden">
              <div aria-hidden style={{ width: `${Math.round((step / 3) * 100)}%` }} className="h-2 bg-blue-600 dark:bg-blue-400 transition-all duration-300" />
            </div>
          </div>
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-6">
              {/* Nome Completo */}
              <div>
                <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo *</label>
                <input type="text" name="nomeCompleto" id="nomeCompleto" required value={formData.nomeCompleto} onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" placeholder="Seu nome completo" disabled={loading} />
              </div>

              {/* CPF */}
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300">CPF *</label>
                <input type="text" name="cpf" id="cpf" required value={formData.cpf} onChange={handleCPFChange} onBlur={handleCPFBlur} maxLength={14}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" placeholder="000.000.000-00" disabled={loading} />
                {checkingCpf && <p className="mt-1 text-xs text-gray-500">Verificando...</p>}
                {cpfWarning && (
                  <div className="mt-1">
                    <p className="text-sm text-red-600 dark:text-red-400">{cpfWarning}</p>
                    <Link to="/login" state={{ identifier: formData.cpf }} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Fazer login</Link>
                  </div>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone/Celular *</label>
                <input type="tel" name="telefone" id="telefone" required value={formatPhone(formData.telefone)} onChange={handleTelefoneChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" placeholder="+55 (DD) 9XXXX-XXXX" disabled={loading} />
              </div>

              {/* E-mail */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail *</label>
                <input type="email" name="email" id="email" required value={formData.email} onChange={handleInputChange} onBlur={handleEmailBlur}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" placeholder="seu@email.com" disabled={loading} />
                {checkingEmail && <p className="mt-1 text-xs text-gray-500">Verificando...</p>}
                {emailWarning && (
                  <div className="mt-1">
                    <p className="text-sm text-red-600 dark:text-red-400">{emailWarning}</p>
                    <Link to="/login" state={{ identifier: formData.email }} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Fazer login</Link>
                  </div>
                )}
              </div>

              {/* Senha */}
              <PasswordInput
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                label="Senha *"
                placeholder="Mínimo 6 caracteres"
                required
                autoComplete="new-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100"
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              {/* Confirmar Senha */}
              <PasswordInput
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleInputChange}
                label="Confirmar Senha *"
                placeholder="Digite a senha novamente"
                required
                autoComplete="new-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100"
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              {/* Declarações obrigatórias */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="declaracaoPCD" name="declaracaoPCD" type="checkbox" checked={checkboxes.declaracaoPCD} onChange={handleCheckboxChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700" disabled={loading} />
                  </div>
                  <div className="ml-3 text-sm"><label htmlFor="declaracaoPCD" className="text-gray-700 dark:text-gray-300">Declaro que sou uma pessoa com deficiência ou reabilitado pelo INSS nos termos da legislação brasileira. *</label></div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="politicaPrivacidade" name="politicaPrivacidade" type="checkbox" checked={checkboxes.politicaPrivacidade} onChange={handleCheckboxChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700" disabled={loading} />
                  </div>
                  <div className="ml-3 text-sm"><label htmlFor="politicaPrivacidade" className="text-gray-700 dark:text-gray-300">Declaro que li e concordo com a{' '}<Link to="/politica-privacidade" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank">política de privacidade</Link>. *</label></div>
                </div>
              </div>

              {erro && (<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"><div className="flex items-center"><div className="flex-shrink-0"><svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg></div><div className="ml-3"><p className="text-sm text-red-700 dark:text-red-300">{erro}</p></div></div></div>)}

              {/* If CPF duplicate detected, show recovery options */}
              {duplicateCpf && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">Já existe um cadastro com o CPF <strong>{duplicateCpf}</strong>.</p>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <button type="button" onClick={() => { setDuplicateCpf(null); navigate('/recuperar-senha', { state: { identifier: duplicateCpf } }); }} className="py-2 px-3 bg-blue-600 text-white rounded">Recuperar senha / Entrar</button>
                    <button type="button" onClick={() => navigate('/login', { state: { identifier: duplicateCpf } })} className="py-2 px-3 border rounded">Ir para login</button>
                    <a className="py-2 px-3 border rounded text-sm" href={`mailto:suporte@incluse.local?subject=Duplicidade%20CPF%20${encodeURIComponent(duplicateCpf)}`}>Contatar suporte</a>
                    <button type="button" onClick={() => setDuplicateCpf(null)} className="py-2 px-3 text-sm">Fechar</button>
                  </div>
                </div>
              )}

              {/* (Step 1 ends here) */}

              <div className="flex justify-between">
                <button type="button" onClick={() => navigate('/')} className="py-2 px-4 text-sm text-gray-700 dark:text-gray-200">Cancelar</button>
                <button type="submit" disabled={loading} className="py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50">Continuar</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-6">
              <div>
                <label htmlFor="escolaridade" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Escolaridade *</label>
                <select name="escolaridade" id="escolaridade" value={formData.escolaridade} onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100">
                  <option value="">Selecione...</option>
                  <option value="Ensino Fundamental Incompleto">Ensino Fundamental Incompleto</option>
                  <option value="Ensino Fundamental Completo">Ensino Fundamental Completo</option>
                  <option value="Ensino Médio Incompleto">Ensino Médio Incompleto</option>
                  <option value="Ensino Médio Completo">Ensino Médio Completo</option>
                  <option value="Ensino Superior Incompleto">Ensino Superior Incompleto</option>
                  <option value="Ensino Superior Completo">Ensino Superior Completo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currículo (PDF) - opcional</label>
                <div className="mt-1 flex items-center gap-3">
                  <input id="curriculo" type="file" accept="application/pdf" className="sr-only" onChange={(e) => handleCurriculoChange(e.target.files?.[0] ?? null)} />
                  <label htmlFor="curriculo" className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                    <svg className="h-5 w-5 text-gray-600 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16v-4a4 4 0 014-4h2a4 4 0 014 4v4M7 8h10"></path></svg>
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">Selecionar currículo (PDF)</span>
                  </label>
                  {fileCurriculo ? (
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-700 dark:text-gray-200">{fileCurriculo.name} <span className="text-xs text-gray-500">({formatFileSize(fileCurriculo.size)})</span></div>
                      <button type="button" onClick={() => handleCurriculoChange(null)} className="text-sm text-red-600 hover:underline">Remover</button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Opcional • PDF até 5MB</div>
                  )}
                </div>
              </div>

              {erro && (<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"><div className="flex items-center"><div className="flex-shrink-0"><svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg></div><div className="ml-3"><p className="text-sm text-red-700 dark:text-red-300">{erro}</p></div></div></div>)}

              <div className="flex justify-between">
                <button onClick={() => navigate('/')} type="button" className="py-2 px-4 text-sm bg-red-600 text-white rounded hover:bg-red-700">Cancelar</button>
                <div className="space-x-2">
                  <button type="button" onClick={() => setStep(1)} className="py-2 px-4 text-sm border border-gray-300 rounded hover:bg-gray-50">Voltar</button>
                  <button type="submit" disabled={loading} className="py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700">Continuar</button>
                </div>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Deficiência *</label>
                <select value={selectedTipoId ?? ''} onChange={(e) => setSelectedTipoId(e.target.value ? Number(e.target.value) : null)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md">
                  <option value="">Selecione...</option>
                  {tiposDeficiencia.map(t => (<option key={t.id} value={t.id}>{t.nome}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subtipo de Deficiência *</label>
                <select value={selectedSubtipoId ?? ''} onChange={(e) => setSelectedSubtipoId(e.target.value ? Number(e.target.value) : null)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md" disabled={!selectedTipoId}>
                  <option value="">Selecione...</option>
                  {tiposDeficiencia.filter(t => t.id === selectedTipoId).flatMap(t => t.subtipos ?? []).map(s => (<option key={s.id} value={s.id}>{s.nome}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Barreiras (marque as que se aplicam) *</label>
                <div className="mt-2 space-y-2 max-h-40 overflow-auto">
                  {barreiras.length === 0 && <p className="text-sm text-gray-500">Selecione um subtipo para carregar barreiras.</p>}
                  {barreiras.map(b => (
                    <div key={b.id} className="flex items-center">
                      <input id={`b-${b.id}`} type="checkbox" checked={selectedBarreiras.includes(b.id)} onChange={() => toggleBarreira(b.id)} className="h-4 w-4" />
                      <label htmlFor={`b-${b.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">{b.descricao}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Laudo (PDF) - opcional</label>
                <div className="mt-1 flex items-center gap-3">
                  <input id="laudo" type="file" accept="application/pdf" className="sr-only" onChange={(e) => handleLaudoChange(e.target.files?.[0] ?? null)} />
                  <label htmlFor="laudo" className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                    <svg className="h-5 w-5 text-gray-600 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16v-4a4 4 0 014-4h2a4 4 0 014 4v4M7 8h10"></path></svg>
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">Selecionar laudo (PDF)</span>
                  </label>
                  {fileLaudo ? (
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-700 dark:text-gray-200">{fileLaudo.name} <span className="text-xs text-gray-500">({formatFileSize(fileLaudo.size)})</span></div>
                      <button type="button" onClick={() => handleLaudoChange(null)} className="text-sm text-red-600 hover:underline">Remover</button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Opcional • PDF até 5MB</div>
                  )}
                </div>
              </div>

              {erro && (<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"><div className="flex items-center"><div className="flex-shrink-0"><svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg></div><div className="ml-3"><p className="text-sm text-red-700 dark:text-red-300">{erro}</p></div></div></div>)}

              <div className="flex justify-between">
                <button onClick={() => navigate('/')} className="py-2 px-4 text-sm bg-red-600 text-white rounded hover:bg-red-700">Cancelar</button>
                <div className="space-x-2">
                  <button onClick={() => setStep(2)} className="py-2 px-4 text-sm border border-gray-300 rounded hover:bg-gray-50">Voltar</button>
                  <button onClick={handleFinalSubmit} disabled={loading} className="py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700">Concluir cadastro</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 