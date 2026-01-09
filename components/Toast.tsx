import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<Props> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div 
          key={t.id} 
          className="pointer-events-auto bg-[#1e293b] border border-white/10 text-slate-200 pl-4 pr-3 py-3.5 rounded-xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-right-10 fade-in duration-300 w-80 ring-1 ring-black/20"
        >
          <div className="mt-0.5">
            {t.type === 'success' && <CheckCircle size={16} className="text-emerald-400" />}
            {t.type === 'error' && <XCircle size={16} className="text-rose-400" />}
            {t.type === 'info' && <Info size={16} className="text-blue-400" />}
          </div>
          <div className="flex-1">
             <p className="text-xs font-medium leading-relaxed">{t.message}</p>
          </div>
          <button 
            onClick={() => onDismiss(t.id)} 
            className="text-slate-500 hover:text-white transition-colors p-0.5 rounded-md hover:bg-white/10"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;