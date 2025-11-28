type Props = {
  onSelectPDF: () => void;
  onSelectBasico: () => void;
  onClose: () => void;
};

export default function CurriculoEscolhaModal({ onSelectPDF, onSelectBasico, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Currículo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <p className="text-gray-600">Você não possui um currículo cadastrado.</p>

        <div className="space-y-3">
          <button
            onClick={onSelectPDF}
            className="w-full px-4 py-3 border-2 border-sky-600 text-sky-600 rounded-lg font-medium hover:bg-sky-50 transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Enviar PDF
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <button
            onClick={onSelectBasico}
            className="w-full px-4 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Não tenho currículo
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Criar currículo permite que empresas vejam suas qualificações mesmo sem PDF
        </p>
      </div>
    </div>
  );
}
