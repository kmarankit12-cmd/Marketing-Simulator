import React from 'react';
import { X, ExternalLink, RefreshCw, Lock, ShieldAlert } from 'lucide-react';

interface Props {
  url: string;
  onClose: () => void;
}

const UrlPreviewModal: React.FC<Props> = ({ url, onClose }) => {
  const safeUrl = url.startsWith('http') ? url : `https://${url}`;
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1e293b] w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden ring-1 ring-white/10">
        {/* Browser Toolbar */}
        <div className="h-14 bg-slate-900 border-b border-white/5 flex items-center px-4 gap-4 shrink-0">
          <div className="flex gap-2 group">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50 group-hover:bg-red-500 transition-colors"></button>
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
          </div>
          
          <div className="flex-1 bg-slate-950/50 rounded-lg h-9 border border-white/5 flex items-center px-3 gap-3">
            <Lock size={12} className="text-emerald-500" />
            <span className="text-xs text-slate-300 font-mono truncate flex-1">{safeUrl}</span>
            {loading && <RefreshCw size={12} className="text-indigo-400 animate-spin" />}
          </div>

          <div className="flex items-center gap-1">
            <a 
              href={safeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-medium"
            >
              <ExternalLink size={14} /> Open External
            </a>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Browser Content */}
        <div className="flex-1 bg-white relative">
          <iframe 
            src={safeUrl} 
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            onLoad={() => setLoading(false)}
            onError={() => setError(true)}
          />
          
          {/* Loading Overlay */}
          {loading && (
             <div className="absolute inset-0 bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                   <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
                   <p className="text-xs text-slate-400 font-medium">Loading preview...</p>
                </div>
             </div>
          )}
          
          {/* Proactive Blocked Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
             <div className="bg-slate-900/95 backdrop-blur text-slate-300 text-[10px] px-4 py-2.5 rounded-full border border-white/10 shadow-xl flex items-center gap-3">
                 <ShieldAlert size={14} className="text-amber-400"/>
                 <span>Blank screen? Most modern sites block in-app previews.</span>
                 <div className="h-4 w-px bg-white/10"></div>
                 <a href={safeUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 font-bold pointer-events-auto hover:underline">Open in New Tab</a>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlPreviewModal;