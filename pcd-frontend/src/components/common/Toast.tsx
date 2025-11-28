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
      <div aria-live="polite" className="fixed top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50 flex flex-col items-stretch sm:items-center gap-2">
        {toasts.map(t => {
          const getToastStyle = () => {
            switch(t.type) {
              case 'error': return 'bg-red-500 text-white border-red-600';
              case 'info': return 'bg-blue-500 text-white border-blue-600';
              default: return 'bg-green-500 text-white border-green-600';
            }
          };
          
          const getEmoji = () => {
            switch(t.type) {
              case 'error': return '⚠️';
              case 'info': return 'ℹ️';
              default: return '✅';
            }
          };
          
          return (
            <div 
              key={t.id} 
              className={`max-w-sm w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-full shadow-lg text-xs sm:text-sm border-2 ${getToastStyle()}`} 
              role="status"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base opacity-80 shrink-0">{getEmoji()}</span>
                <div className="flex-1 min-w-0">
                  {t.title && <div className="font-medium truncate">{t.title}</div>}
                  <div className={`${t.title ? 'text-xs opacity-90' : ''} line-clamp-2`}>{t.message}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
