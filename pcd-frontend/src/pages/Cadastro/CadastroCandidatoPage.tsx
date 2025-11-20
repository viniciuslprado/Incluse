import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import type { TipoComSubtipos, Barreira } from '../../types';

export default function CadastroCandidatoPage() {
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const [checkboxes, setCheckboxes] = useState({
    declaracaoPCD: false,
    politicaPrivacidade: false,
  });

  const [tiposDeficiencia, setTiposDeficiencia] = useState<TipoComSubtipos[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [loadingTipos, setLoadingTipos] = useState(true);

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCheckboxes(prev => ({ ...prev, [name]: checked }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
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
    setLoading(true);
    try {
      const payload = {
        nome: formData.nomeCompleto,
        cpf: formData.cpf,
        telefone: formData.telefone,
        email: formData.email,
        escolaridade: 'Não informado',
        senha: formData.senha,
      };
      const created: any = await api.registerCandidato(payload);
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
                <input type="text" name="cpf" id="cpf" required value={formData.cpf} onChange={handleCPFChange} maxLength={14}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" placeholder="000.000.000-00" disabled={loading} />
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone/Celular *</label>
                <input type="tel" name="telefone" id="telefone" required value={formData.telefone} onChange={handleTelefoneChange} maxLength={15}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" placeholder="(00) 00000-0000" disabled={loading} />
              </div>

              {/* E-mail */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail *</label>
                <input type="email" name="email" id="email" required value={formData.email} onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" placeholder="seu@email.com" disabled={loading} />
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha *</label>
                <input type="password" name="senha" id="senha" required value={formData.senha} onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" placeholder="Mínimo 6 caracteres" disabled={loading} />
              </div>

              {/* Confirmar Senha */}
              <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Senha *</label>
                <input type="password" name="confirmarSenha" id="confirmarSenha" required value={formData.confirmarSenha} onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" placeholder="Digite a senha novamente" disabled={loading} />
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

              <div className="flex justify-between">
                <button type="button" onClick={() => navigate('/')} className="py-2 px-4 text-sm text-gray-700 dark:text-gray-200">Cancelar</button>
                <button type="submit" disabled={loading} className="py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50">Continuar</button>
              </div>
            </form>
          )}

          {step === 2 && (
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Barreiras (marque as que se aplicam)</label>
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

              {erro && (<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"><div className="flex items-center"><div className="flex-shrink-0"><svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg></div><div className="ml-3"><p className="text-sm text-red-700 dark:text-red-300">{erro}</p></div></div></div>)}

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="py-2 px-4 text-sm text-gray-700 dark:text-gray-200">Voltar</button>
                <div className="space-x-2">
                  <button onClick={() => navigate('/')} className="py-2 px-4 text-sm text-gray-700">Cancelar</button>
                  <button onClick={handleFinalSubmit} disabled={loading} className="py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50">Concluir cadastro</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 