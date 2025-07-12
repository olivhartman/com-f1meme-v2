import React, { createContext, useContext, useState, useCallback } from "react";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<string>("");
  const [visible, setVisible] = useState(false);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setVisible(true);
    setTimeout(() => setVisible(false), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <div
          className={`fixed top-6 right-6 z-50 min-w-[260px] max-w-xs p-5 rounded-2xl backdrop-blur-xl border shadow-lg flex items-center gap-3 transition-transform duration-500 ease-out
            ${toast.includes('successfully')
              ? 'bg-green-100/90 border-green-200/90 text-green-800 shadow-green-200/40'
              : 'bg-red-100/90 border-red-200/90 text-red-800 shadow-red-200/40'}
            animate-slide-in-tr`}
          style={{animation: 'slide-in-tr 0.5s cubic-bezier(0.4,0,0.2,1)'}}
        >
          <div
            className={`w-3 h-3 rounded-full shadow-lg flex-shrink-0
              ${toast.includes('successfully')
                ? 'bg-gradient-to-r from-green-400 to-emerald-400 shadow-green-400/30'
                : 'bg-gradient-to-r from-red-400 to-pink-400 shadow-red-400/30'}`}
          ></div>
          <span className="font-semibold text-sm">{toast}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}; 