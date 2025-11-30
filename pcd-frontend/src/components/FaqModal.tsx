import { useEffect, useState } from 'react';
import FAQContent from './FAQContent';

export default function FaqModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onOpen(_e: Event) {
      setOpen(true);
    }
    window.addEventListener('openFaq', onOpen as EventListener);
    return () => window.removeEventListener('openFaq', onOpen as EventListener);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full my-8 z-50">
        {/* Botão de fechar dentro do card */}
        <button
          aria-label="Fechar FAQ"
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 z-50 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <span className="text-xl font-bold leading-none" style={{ marginTop: '-2px' }}>×</span>
        </button>
        
        <div className="p-6 pt-12 max-h-[80vh] overflow-y-auto">
          <FAQContent />
        </div>
      </div>
    </div>
  );
}
