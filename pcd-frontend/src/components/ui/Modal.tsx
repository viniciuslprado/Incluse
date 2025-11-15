import React from 'react';

export default function Modal({ open, title, children, onClose }: { open: boolean; title?: string; children?: React.ReactNode; onClose?: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative bg-white dark:bg-gray-800 rounded shadow-lg w-full max-w-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Fechar" className="text-gray-600">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
