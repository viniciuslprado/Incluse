import React, { useEffect, useState } from 'react';
import FAQContent from './FAQContent';

export default function FaqModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onOpen(e: Event) {
      setOpen(true);
    }
    window.addEventListener('openFaq', onOpen as EventListener);
    return () => window.removeEventListener('openFaq', onOpen as EventListener);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4">
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full overflow-auto max-h-[90vh] z-50 p-6">
        <FAQContent />
      </div>

      {/* Close button fixed in the viewport so it's always accessible */}
      <button
        aria-label="Fechar FAQ"
        onClick={() => setOpen(false)}
        className="absolute top-4 right-4 z-50 bg-white/0 text-gray-600 rounded-full p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-incluse-primary"
      >
        ✕
      </button>
    </div>
  );
}
