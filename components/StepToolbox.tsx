import React from 'react';
import { StepType } from '../types';
import { Target, FileText, Mail, MessageSquare, Video, Phone } from 'lucide-react';

interface Props {
  onAddStep: (type: StepType) => void;
  className?: string;
}

const StepToolbox: React.FC<Props> = ({ onAddStep, className }) => {
  const btnClass = "text-xs bg-slate-800/50 hover:bg-slate-700/80 border border-white/5 hover:border-indigo-500/50 px-3 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 text-slate-400 hover:text-white group";
  const iconClass = "text-slate-500 group-hover:text-indigo-400 transition-colors";

  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
       <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Add Workflow Step</h2>
       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* Sources */}
          <div className="col-span-full mb-1 text-[10px] text-indigo-400/80 font-bold uppercase tracking-wider">Sources</div>
          <button onClick={() => onAddStep(StepType.AD)} className={btnClass}><Target size={14} className={iconClass}/> Ads</button>
          <button onClick={() => onAddStep(StepType.SOCIAL)} className={btnClass}><Target size={14} className={iconClass}/> Social</button>
          <button onClick={() => onAddStep(StepType.CONTENT)} className={btnClass}><FileText size={14} className={iconClass}/> Content</button>
          <button onClick={() => onAddStep(StepType.AFFILIATE)} className={btnClass}><Target size={14} className={iconClass}/> Affiliate</button>
          
          {/* Pages */}
          <div className="col-span-full mt-4 mb-1 text-[10px] text-emerald-400/80 font-bold uppercase tracking-wider">Pages</div>
          <button onClick={() => onAddStep(StepType.LANDING)} className={btnClass}><FileText size={14} className={iconClass}/> Landing</button>
          <button onClick={() => onAddStep(StepType.SALES)} className={btnClass}><FileText size={14} className={iconClass}/> Sales</button>
          <button onClick={() => onAddStep(StepType.CHECKOUT)} className={btnClass}><FileText size={14} className={iconClass}/> Checkout</button>
          <button onClick={() => onAddStep(StepType.UPSELL)} className={btnClass}><FileText size={14} className={iconClass}/> Upsell</button>
          <button onClick={() => onAddStep(StepType.THANK_YOU)} className={btnClass}><FileText size={14} className={iconClass}/> Thank You</button>
          
          {/* Engagement */}
          <div className="col-span-full mt-4 mb-1 text-[10px] text-amber-400/80 font-bold uppercase tracking-wider">Engagement</div>
          <button onClick={() => onAddStep(StepType.EMAIL)} className={btnClass}><Mail size={14} className={iconClass}/> Email</button>
          <button onClick={() => onAddStep(StepType.SMS)} className={btnClass}><MessageSquare size={14} className={iconClass}/> SMS</button>
          <button onClick={() => onAddStep(StepType.BOT)} className={btnClass}><MessageSquare size={14} className={iconClass}/> Chatbot</button>
          <button onClick={() => onAddStep(StepType.WEBINAR)} className={btnClass}><Video size={14} className={iconClass}/> Webinar</button>
          <button onClick={() => onAddStep(StepType.CALL)} className={btnClass}><Phone size={14} className={iconClass}/> Call</button>
          <button onClick={() => onAddStep(StepType.APPLICATION)} className={btnClass}><FileText size={14} className={iconClass}/> Apply</button>
       </div>
    </div>
  );
};

export default StepToolbox;