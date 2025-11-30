import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { api } from '../../lib/api';
import { FiUpload, FiFileText, FiEdit } from 'react-icons/fi';
import { FaLightbulb } from 'react-icons/fa';

export default function MeuCurriculoPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Modal removido: escolha integrada na própria página
  const [hasCurriculoBasico, setHasCurriculoBasico] = useState(false);
  const [confirmDeletePdf, setConfirmDeletePdf] = useState(false);
  const [confirmDeleteBasico, setConfirmDeleteBasico] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();
  // const cand = useCandidate(); // não utilizado aqui


  useEffect(() => {
    async function carregar() {
      if (!candidatoId || isNaN(candidatoId) || candidatoId <= 0) {
        setLoading(false);
        addToast({ type: 'error', title: 'ID inválido', message: 'ID do candidato ausente ou inválido.' });
        return;
      }
      try {
        // Tenta obter currículo do backend (fonte de verdade)
        const data = await api.obterCurriculoBasico(candidatoId);
        const baseUrl = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3000';
        if (data) {
          // Se houver arquivo salvo no backend, usa ele
          if (data.curriculo) {
            const p = String(data.curriculo);
            const absolute = p.startsWith('http')
              ? p
              : `${baseUrl}${p.startsWith('/') ? '' : '/'}${p}`;
            setPreview(absolute);
            const fname = p.split('/').pop() || 'arquivo';
            setFileName(fname);
          } else {
            // Fallback: tenta localStorage (upload local prévio)
            const saved = localStorage.getItem(`curriculo_base64_${candidatoId}`);
            const name = localStorage.getItem(`curriculo_name_${candidatoId}`);
            if (saved) setPreview(saved);
            if (name) setFileName(name);
          }
          // Considera currículo básico preenchido se existir algum dado estruturado
          const hasBasico =
            !!(data.experiencias?.length || data.formacoes?.length || data.cursos?.length || data.competencias?.length || data.idiomas?.length);
          setHasCurriculoBasico(!!hasBasico);
        }
      } catch (err: any) {
        // Se for erro 404, mostra mensagem amigável
        if (err?.status === 404) {
          setPreview(null);
          setFileName(null);
          setHasCurriculoBasico(false);
          addToast({ type: 'info', title: 'Currículo não encontrado', message: 'Você ainda não enviou um currículo PDF.' });
        } else {
          // Se falhar backend, mantém comportamento antigo baseado em localStorage
          const saved = localStorage.getItem(`curriculo_base64_${candidatoId}`);
          const name = localStorage.getItem(`curriculo_name_${candidatoId}`);
          if (saved) setPreview(saved);
          if (name) setFileName(name);
          const curriculoBasico = localStorage.getItem(`curriculo_basico_${candidatoId}`);
          setHasCurriculoBasico(!!curriculoBasico);
          addToast({ type: 'error', title: 'Erro', message: err?.message || 'Erro ao carregar currículo do servidor.' });
        }
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [candidatoId]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      try {
        localStorage.setItem(`curriculo_base64_${candidatoId}`, data);
        localStorage.setItem(`curriculo_name_${candidatoId}`, f.name);
        setPreview(data);
        addToast({ type: 'success', title: 'Currículo anexado', message: 'Currículo salvo com sucesso.' });
      } catch {
        addToast({ type: 'error', title: 'Erro', message: 'Erro ao salvar currículo.' });
      }
    };
    reader.readAsDataURL(f);
  }

  // salvarEscolaridade removido; atualização ocorre por outras ações

  if (loading) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="space-y-6">

      <header>
        <h1 className="text-2xl font-bold mb-2">Meu Currículo</h1>
        <p className="text-gray-600">Gerencie suas informações profissionais e currículo</p>
      </header>

      {/* Status do Currículo */}
      <section className="bg-white border rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Status do Currículo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 border rounded ${fileName ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Currículo PDF</h3>
              {fileName && <span className="text-green-600 text-sm">✓ Anexado</span>}
            </div>
            {fileName ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{fileName}</p>
                <div className="flex gap-2">
                  <label 
                    htmlFor="curriculo-upload"
                    className="inline-flex items-center px-3 py-1.5 text-sm border border-sky-600 text-sky-600 rounded cursor-pointer hover:bg-sky-50"
                  >
                    <FiUpload className="mr-2" />
                    Substituir PDF
                  </label>
                  <button
                    onClick={() => {
                      if (!confirmDeletePdf) {
                        setConfirmDeletePdf(true);
                        addToast({ type: 'info', title: 'Confirmar exclusão', message: 'Clique novamente para confirmar.' });
                        setTimeout(() => setConfirmDeletePdf(false), 3000);
                      } else {
                        localStorage.removeItem(`curriculo_base64_${candidatoId}`);
                        localStorage.removeItem(`curriculo_name_${candidatoId}`);
                        setFileName(null);
                        setPreview(null);
                        setConfirmDeletePdf(false);
                        addToast({ type: 'success', title: 'Excluído', message: 'Currículo PDF removido.' });
                      }
                    }}
                    className={`inline-flex items-center px-3 py-1.5 text-sm border rounded hover:bg-red-50 ${
                      confirmDeletePdf ? 'border-red-700 text-red-700 bg-red-50' : 'border-red-600 text-red-600'
                    }`}
                  >
                    {confirmDeletePdf ? 'Confirmar?' : 'Excluir'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Nenhum PDF anexado</p>
                <label 
                  htmlFor="curriculo-upload"
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-sky-600 text-white rounded cursor-pointer hover:bg-sky-700"
                >
                  <FiUpload className="mr-2" />
                  Enviar PDF
                </label>
              </div>
            )}
          </div>

          <div className={`p-4 border rounded ${hasCurriculoBasico ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Currículo</h3>
              {hasCurriculoBasico && <span className="text-green-600 text-sm">✓ Preenchido</span>}
            </div>
            {hasCurriculoBasico ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Informações cadastradas</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/candidato/${candidatoId}/curriculo/basico`)}
                    className="inline-flex items-center px-3 py-1.5 text-sm border border-sky-600 text-sky-600 rounded hover:bg-sky-50"
                  >
                    <FiEdit className="mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (!confirmDeleteBasico) {
                        setConfirmDeleteBasico(true);
                        addToast({ type: 'info', title: 'Confirmar exclusão', message: 'Clique novamente para confirmar.' });
                        setTimeout(() => setConfirmDeleteBasico(false), 3000);
                      } else {
                        localStorage.removeItem(`curriculo_basico_${candidatoId}`);
                        setHasCurriculoBasico(false);
                        setConfirmDeleteBasico(false);
                        addToast({ type: 'success', title: 'Excluído', message: 'Currículo removido.' });
                      }
                    }}
                    className={`inline-flex items-center px-3 py-1.5 text-sm border rounded hover:bg-red-50 ${
                      confirmDeleteBasico ? 'border-red-700 text-red-700 bg-red-50' : 'border-red-600 text-red-600'
                    }`}
                  >
                    {confirmDeleteBasico ? 'Confirmar?' : 'Excluir'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Não preenchido</p>
                <button
                  onClick={() => navigate(`/candidato/${candidatoId}/curriculo/basico`)}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
                >
                  <FiFileText className="mr-2" />
                  Criar currículo
                </button>
              </div>
            )}
          </div>
        </div>
        <input 
          type="file" 
          accept="application/pdf,.pdf" 
          onChange={handleFile}
          className="hidden"
          id="curriculo-upload"
        />
        {(fileName || hasCurriculoBasico) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <FaLightbulb className="text-yellow-400" /> <strong>Dica:</strong> Você pode ter PDF e Currículo ao mesmo tempo. Empresas verão ambos ao visualizar sua candidatura.
            </p>
          </div>
        )}
      </section>
      {preview && (
        <section className="bg-white border rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Pré-visualização</h2>
            <div className="flex gap-2">
              <a
                href={preview}
                download={fileName || 'arquivo'}
                className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Baixar arquivo
              </a>
            </div>
          </div>
          {
            // Renderiza inline somente se for PDF
            (fileName?.toLowerCase().endsWith('.pdf') || preview.toLowerCase().includes('.pdf')) ? (
              <object
                data={preview}
                type="application/pdf"
                className="w-full h-96 border rounded"
              >
                <div className="p-4 text-sm text-gray-700">
                  Não foi possível exibir o PDF no navegador. 
                  Você pode <a className="text-sky-600 underline" href={preview} download={fileName || 'arquivo'}>baixar o arquivo</a>.
                </div>
              </object>
            ) : (
              <div className="p-4 text-sm text-gray-700 border rounded bg-gray-50">
                O arquivo anexado não é um PDF. Para pré-visualização inline, envie um arquivo .pdf. Você ainda pode <a className="text-sky-600 underline" href={preview} download={fileName || 'arquivo'}>baixar o arquivo</a>.
              </div>
            )
          }
        </section>
      )}
    </div>
  );
}
