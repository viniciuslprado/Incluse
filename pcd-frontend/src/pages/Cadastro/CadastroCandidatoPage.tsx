import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import type { TipoComSubtipos, Barreira } from '../../types';
import PasswordInput from '../../components/PasswordInput';
import CustomSelect from '../../components/common/CustomSelect';
import { formatPhone, unformatPhone } from '../../utils/formatters';

export default function CadastroCandidatoPage() {
  // Se for edição, pega o id da URL
  const params = useParams();
  const candidatoId = params.id ? Number(params.id) : null;
  // Multi-step form state
  const [step, setStep] = useState(1);

  // Carregar dados do candidato para edição
  useEffect(() => {
    if (!candidatoId) return;
    // ...carregar dados se necessário...
  }, [candidatoId]);
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    escolaridade: '',
    areaFormacao: '',
    cidade: '',
    estado: '',
  });

  const [areasFormacao, setAreasFormacao] = useState<{ id: number, nome: string }[]>([]);
  // Carregar áreas de formação
  useEffect(() => {
    api.listarAreasFormacao().then((areas) => {
      setAreasFormacao(Array.isArray(areas) ? areas : []);
    }).catch((err) => {
      console.error('Erro ao carregar áreas de formação:', err);
    });
  }, []);

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
  // Removed unused showPassword state

  // Step 2 specific
  const [selectedTipoId, setSelectedTipoId] = useState<number | null>(null);
  const [selectedSubtipoId, setSelectedSubtipoId] = useState<number | null>(null);
  const [barreirasPorSubtipo, setBarreirasPorSubtipo] = useState<Record<number, Barreira[]>>({});
  const [selectedBarreiras, setSelectedBarreiras] = useState<number[]>([]);

  // Barreiras do subtipo selecionado para o passo 3
  const barreiras = selectedSubtipoId ? (barreirasPorSubtipo[selectedSubtipoId] ?? []) : [];

  // Carregar tipos de deficiência
  useEffect(() => {
    async function carregarTipos() {
      try {
        const tipos = await api.listarTiposComSubtiposPublico();
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
    const telefoneNumerico = formData.telefone.replace(/\D/g, '');
    if (telefoneNumerico.length < 10 || telefoneNumerico.length > 13) return 'Telefone deve ter entre 10 e 13 dígitos (apenas números, com ou sem DDI).';
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

  // Quando subtipo for selecionado, buscar barreiras desse subtipo
  useEffect(() => {
    async function carregarBarreirasPorSubtipo() {
      if (!selectedSubtipoId) return;
      try {
        const b = await api.listarBarreirasPorSubtipo(selectedSubtipoId);
        if (Array.isArray(b)) {
          setBarreirasPorSubtipo(prev => ({ ...prev, [selectedSubtipoId]: b }));
        }
      } catch (err) {
        console.error('Erro ao carregar barreiras por subtipo:', err);
      }
    }
    if (selectedSubtipoId && !barreirasPorSubtipo[selectedSubtipoId]) {
      carregarBarreirasPorSubtipo();
    }
    // Limpa seleção de barreiras ao trocar subtipo
    setSelectedBarreiras([]);
  }, [selectedSubtipoId]);

  const toggleBarreira = (id: number) => {
    setSelectedBarreiras(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Finalizar cadastro: cria candidato e vincula barreiras
  const handleFinalSubmit = async () => {
    setErro(null);
    if (!selectedTipoId) {
      setErro('Selecione um tipo de deficiência.');
      return;
    }
    // Validação de barreiras removida a pedido do usuário
    setLoading(true);
    try {
      // build FormData to include optional files
      const fd = new FormData();
      fd.append('nome', formData.nomeCompleto.trim());
      fd.append('cpf', formData.cpf);
      // Remove todos os caracteres não numéricos do telefone antes de enviar
      let telefoneNumerico = formData.telefone.replace(/\D/g, '');
      // Corrige bug de duplicação do último dígito (ex: 55168529634522 -> 5516852963452)
      if (telefoneNumerico.length > 13 && telefoneNumerico.slice(-2, -1) === telefoneNumerico.slice(-1)) {
        telefoneNumerico = telefoneNumerico.slice(0, -1);
      }
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[CadastroCandidato] Telefone enviado ao backend:', telefoneNumerico);
      }
      // Validação extra: só permite 10 a 13 dígitos
      if (telefoneNumerico.length < 10 || telefoneNumerico.length > 13) {
        setErro('Telefone deve ter entre 10 e 13 dígitos (apenas números, com ou sem DDI).');
        setLoading(false);
        return;
      }
      fd.append('telefone', telefoneNumerico);
      fd.append('email', formData.email);
      fd.append('escolaridade', formData.escolaridade);
      fd.append('cidade', formData.cidade);
      fd.append('estado', formData.estado);
      fd.append('senha', formData.senha);
      // Enviar campos opcionais se preenchidos
      // Removed non-existent fields 'curso' and 'situacao'
      if (formData.areaFormacao) fd.append('areaFormacao', formData.areaFormacao);
      if (fileCurriculo) fd.append('file', fileCurriculo);
      if (fileLaudo) fd.append('laudo', fileLaudo);

      // debug: log FormData entries to browser console to inspect what will be sent
      if (import.meta.env.DEV) {
        for (const entry of Array.from(fd.entries())) {
          console.debug('[CadastroCandidato] formData entry:', entry[0], entry[1]);
        }
      }

      const created: any = await api.registerCandidatoWithFiles(fd);
      const candidatoId = created?.id;
      if (!candidatoId) throw new Error('Resposta inválida do servidor');
      // vincular barreiras (se houver)
      if (selectedBarreiras.length > 0) {
        // Para cada barreira selecionada, buscar o subtipo correspondente e vincular
        for (const tipo of tiposDeficiencia) {
          if (tipo.id !== selectedTipoId) continue;
          for (const subtipo of tipo.subtipos) {
            // Busca as barreiras desse subtipo
            const barreirasSubtipo = await api.listarBarreirasPorSubtipo(subtipo.id);
            const barreirasSelecionadas = barreirasSubtipo.filter((b: any) => selectedBarreiras.includes(b.id));
            if (barreirasSelecionadas.length > 0) {
              await api.vincularBarreirasACandidato(candidatoId, subtipo.id, barreirasSelecionadas.map((b: any) => b.id));
            }
          }
        }
      }
      // redirect to candidate dashboard
      navigate(`/candidato/${candidatoId}`);
    } catch (err: any) {
      let userMessage = 'Erro ao finalizar cadastro.';
      if (err?.response && err.response.data && (err.response.data.error || err.response.data.message)) {
        userMessage = err.response.data.error || err.response.data.message;
      } else if (err instanceof Error && err.message) {
        userMessage = err.message;
      } else if (typeof err === 'string') {
        userMessage = err;
      }
      setErro(userMessage);
      // detect duplicate CPF message and show options
      if (typeof userMessage === 'string' && userMessage.includes('CPF')) {
        setDuplicateCpf(formData.cpf);
      }
      // Log detalhes técnicos apenas em dev
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('[CadastroCandidato] erro detalhado:', err);
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

              {/* Cidade */}
              <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cidade *</label>
                <input type="text" name="cidade" id="cidade" required value={formData.cidade} onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" placeholder="Sua cidade" disabled={loading} />
              </div>

              {/* Estado */}
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado *</label>
                <input type="text" name="estado" id="estado" required value={formData.estado} onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" placeholder="UF" maxLength={2} disabled={loading} />
              </div>

              {/* E-mail */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail *</label>
                <input type="email" name="email" id="email" required value={formData.email} onChange={handleInputChange} onBlur={handleEmailBlur}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" placeholder="seu@email.com" disabled={loading} />
                {checkingEmail && <p className="mt-1 text-xs text-gray-500">Verificando...</p>}
                {emailWarning && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailWarning}</p>}
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha *</label>
                <PasswordInput name="senha" id="senha" value={formData.senha} onChange={handleInputChange} autoComplete="new-password" />
              </div>

              {/* Confirmar Senha */}
              <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Senha *</label>
                <PasswordInput name="confirmarSenha" id="confirmarSenha" value={formData.confirmarSenha} onChange={handleInputChange} autoComplete="new-password" />
              </div>

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
                <CustomSelect
                  value={formData.escolaridade}
                  onChange={v => setFormData(prev => ({ ...prev, escolaridade: v }))}
                  options={[
                    { value: '', label: 'Selecione...' },
                    { value: 'Ensino Fundamental Incompleto', label: 'Ensino Fundamental Incompleto' },
                    { value: 'Ensino Fundamental Completo', label: 'Ensino Fundamental Completo' },
                    { value: 'Ensino Médio Incompleto', label: 'Ensino Médio Incompleto' },
                    { value: 'Ensino Médio Completo', label: 'Ensino Médio Completo' },
                    { value: 'Ensino Superior Incompleto', label: 'Ensino Superior Incompleto' },
                    { value: 'Ensino Superior Completo', label: 'Ensino Superior Completo' },
                  ]}
                  className="mt-1 block w-full"
                />
              </div>

              <div>
                <label htmlFor="areaFormacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Área de formação *</label>
                <CustomSelect
                  value={formData.areaFormacao}
                  onChange={v => setFormData(prev => ({ ...prev, areaFormacao: v }))}
                  options={[
                    { value: '', label: 'Selecione...' },
                    ...areasFormacao.map(a => ({ value: a.id.toString(), label: a.nome }))
                  ]}
                  className="mt-1 block w-full"
                />
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
            </form>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded text-sm text-yellow-800">
                <strong>Observação:</strong> Caso você possua mais de uma deficiência, é possível adicionar outras na aba <b>Perfil</b> disponível no menu após o cadastro.
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Deficiência *</label>
                <CustomSelect
                  value={selectedTipoId !== null ? selectedTipoId.toString() : ''}
                  onChange={v => setSelectedTipoId(v ? Number(v) : null)}
                  options={[
                    { value: '', label: 'Selecione...' },
                    ...tiposDeficiencia.map(t => ({ value: t.id.toString(), label: t.nome }))
                  ]}
                  className="mt-1 block w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subtipo de Deficiência *</label>
                <CustomSelect
                  value={selectedSubtipoId !== null ? selectedSubtipoId.toString() : ''}
                  onChange={v => setSelectedSubtipoId(v ? Number(v) : null)}
                  options={[
                    { value: '', label: 'Selecione...' },
                    ...tiposDeficiencia.filter(t => t.id === selectedTipoId).flatMap(t => (t.subtipos ?? []).map(s => ({ value: s.id.toString(), label: s.nome })))
                  ]}
                  className="mt-1 block w-full"
                  disabled={!selectedTipoId}
                />
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
 