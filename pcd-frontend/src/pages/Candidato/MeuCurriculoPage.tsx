import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';

export default function MeuCurriculoPage() {
  const { id } = useParams();
  const candidatoId = Number(id);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`curriculo_base64_${candidatoId}`);
    if (saved) setPreview(saved);
    const name = localStorage.getItem(`curriculo_name_${candidatoId}`);
    if (name) setFileName(name);
  }, [candidatoId]);

  const { addToast } = useToast();

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
        addToast({ type: 'success', message: 'Currículo salvo localmente (sincronização com backend pendente)' });
      } catch {
        addToast({ type: 'error', message: 'Erro ao salvar currículo localmente' });
      }
    };
    reader.readAsDataURL(f);
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Meu Currículo</h1>
      <p className="text-gray-600 mb-3">Anexe seu currículo (PDF, DOC, DOCX). Atualmente o arquivo é guardado localmente no navegador; integrar ao backend requer endpoint de upload.</p>
      <div className="mb-3">
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} />
      </div>
      {fileName && <div className="text-sm">Arquivo: {fileName}</div>}
      {preview && (
        <div className="mt-4">
          <div className="text-sm text-gray-600">Pré-visualização (apenas quando suportado pelo navegador):</div>
          <iframe src={preview} className="w-full h-96 border mt-2" title="preview" />
        </div>
      )}
    </section>
  );
}
