import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { api } from '../../lib/api';
import { useCandidate } from '../../contexts/CandidateContext';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

export default function CurriculoEditorPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  
  const cand = useCandidate();
  const [dados, setDados] = useState({
    endereco: '',
    objetivo: '',
    experiencias: '',
    formacao: '',
    habilidades: ''
  });

  useEffect(() => {
    async function carregarDados() {
      try {
        // Obter token se necessário
        let token = localStorage.getItem('token');
        if (!token) {
          try {
            const devAuth = await api.getDevToken(candidatoId);
            localStorage.setItem('token', devAuth.token);
          } catch (devErr) {
            console.warn('Não foi possível obter token:', devErr);
          }
        }
        
        // Dados pessoais já vêm do contexto; apenas manter estado adicional
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        addToast({ type: 'error', title: 'Erro', message: 'Erro ao carregar dados do candidato.' });
      } finally {
        setLoading(false);
      }
    }
    
    carregarDados();
  }, [candidatoId, addToast]);

  function handleSave() {
    // Salvar currículo criado
    const curriculoHtml = gerarCurriculoHtml();
    
    // Salvar no localStorage
    localStorage.setItem(`curriculo_criado_${candidatoId}`, curriculoHtml);
    localStorage.setItem(`curriculo_name_${candidatoId}`, 'Curriculo_Criado.html');
    
    addToast({ type: 'success', title: 'Currículo criado', message: 'Seu currículo foi criado com sucesso!' });
    navigate(`/candidato/${candidatoId}/curriculo`);
  }

  function gerarCurriculoHtml() {
    const nomeExibicao = cand.nome;
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Currículo - ${nomeExibicao}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #2563eb; border-bottom: 2px solid #2563eb; }
        h2 { color: #1e40af; margin-top: 30px; }
        .contato { background: #f3f4f6; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>${nomeExibicao}</h1>
    <div class="contato">
        <p><strong>CPF:</strong> ${cand.cpf}</p>
        <p><strong>Email:</strong> ${cand.email}</p>
        <p><strong>Celular:</strong> ${cand.telefone}</p>
        ${dados.endereco ? `<p><strong>Endereço:</strong> ${dados.endereco}</p>` : ''}
    </div>
    
    ${dados.objetivo ? `<h2>Objetivo</h2><p>${dados.objetivo}</p>` : ''}
    ${dados.experiencias ? `<h2>Experiência Profissional</h2><p>${dados.experiencias}</p>` : ''}
    ${dados.formacao ? `<h2>Formação</h2><p>${dados.formacao}</p>` : ''}
    ${dados.habilidades ? `<h2>Habilidades</h2><p>${dados.habilidades}</p>` : ''}
</body>
</html>`;
  }

  if (loading) {
    return <div className="p-4">Carregando dados...</div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate(`/candidato/${candidatoId}/curriculo`)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Editor de Currículo</h1>
          <p className="text-gray-600">Crie seu currículo preenchendo os campos abaixo</p>
        </div>
      </header>

      <div className="bg-white border rounded p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome Completo *
              <span className="text-xs text-gray-500 block">(ou deixe em branco e preencha Nome Social)</span>
            </label>
            <input
              type="text"
              value={cand.nome}
              readOnly
              className="w-full px-3 py-2 border rounded bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">CPF *</label>
            <input
              type="text"
              value={cand.cpf}
              className="w-full px-3 py-2 border rounded bg-gray-50"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">E-mail *</label>
            <input
              type="email"
              value={cand.email}
              className="w-full px-3 py-2 border rounded bg-gray-50"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Celular *</label>
            <input
              type="tel"
              value={cand.telefone || ''}
              className="w-full px-3 py-2 border rounded bg-gray-50"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Endereço</label>
            <input
              type="text"
              value={dados.endereco}
              onChange={(e) => setDados(prev => ({ ...prev, endereco: e.target.value }))}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cidade, Estado"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Objetivo Profissional</label>
          <textarea
            value={dados.objetivo}
            onChange={(e) => setDados(prev => ({ ...prev, objetivo: e.target.value }))}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Descreva seu objetivo profissional..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Experiência Profissional</label>
          <textarea
            value={dados.experiencias}
            onChange={(e) => setDados(prev => ({ ...prev, experiencias: e.target.value }))}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Liste suas experiências profissionais..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Formação Acadêmica</label>
          <textarea
            value={dados.formacao}
            onChange={(e) => setDados(prev => ({ ...prev, formacao: e.target.value }))}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Descreva sua formação acadêmica..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Habilidades</label>
          <textarea
            value={dados.habilidades}
            onChange={(e) => setDados(prev => ({ ...prev, habilidades: e.target.value }))}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Liste suas principais habilidades..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(`/candidato/${candidatoId}/curriculo`)}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!cand.nome || !cand.email}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <FiSave className="mr-2" />
            Salvar Currículo
          </button>
        </div>
      </div>
    </div>
  );
}