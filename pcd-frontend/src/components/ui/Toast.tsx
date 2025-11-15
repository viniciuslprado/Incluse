import React, { createContext, useContext, useState, useCallback } from 'react';

type Toast = { id: string; title?: string; message: string; type?: 'success'|'error'|'info' };

type ToastContextValue = { addToast: (t: Omit<Toast,'id'>) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast,'id'>) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2,6);
    const toast: Toast = { id, ...t };
    setToasts(s => [toast, ...s]);
    // auto-remove
    setTimeout(() => setToasts(s => s.filter(x => x.id !== id)), 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`max-w-sm w-full px-4 py-2 rounded shadow-lg text-sm ${t.type==='error'?'bg-red-600 text-white':'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`} role="status">
            {t.title && <div className="font-semibold">{t.title}</div>}
            <div>{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
