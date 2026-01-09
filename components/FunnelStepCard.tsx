import React from 'react';
import { FunnelStep, StepType } from '../types';
import { 
  Trash2, Copy, HelpCircle, MoreHorizontal,
  Mail, MessageSquare, Phone, Video, FileText, Share2, Target, Users, MousePointer,
  ArrowRight, Link as LinkIcon, ExternalLink, Eye, GitBranch, GitMerge, XCircle, Layers, Split, ArrowLeft
} from 'lucide-react';

interface Props {
  step: FunnelStep;
  allSteps: FunnelStep[];
  index: number;
  onUpdate: (id: string, updates: Partial<FunnelStep>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onPreview: (url: string) => void;
  onHover: (id: string | null) => void;
  isLast: boolean;
  isFirst: boolean;
}

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover/field:block w-56 p-2 bg-slate-900/95 backdrop-blur text-xs text-slate-200 rounded-lg border border-slate-700 shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200 text-center">
    {text}
    <div className="absolute top-full left-1/2 -ml-1.5 border-4 border-transparent border-t-slate-700" />
  </div>
);

const FunnelStepCard: React.FC<Props> = ({ step, allSteps, index, onUpdate, onDelete, onDuplicate, onMove, onPreview, onHover, isLast, isFirst }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleNumberChange = (field: keyof FunnelStep, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      onUpdate(step.id, { [field]: num });
    }
  };

  const handleConnect = (targetId: string) => {
    if (!targetId || targetId === step.id) return;
    const currentNext = step.nextSteps || [];
    if (!currentNext.includes(targetId)) {
        onUpdate(step.id, { nextSteps: [...currentNext, targetId] });
    }
  };

  const handleDisconnect = (targetId: string) => {
    const currentNext = step.nextSteps || [];
    const currentWeights = { ...step.variantWeights };
    delete currentWeights[targetId];
    
    onUpdate(step.id, { 
        nextSteps: currentNext.filter(id => id !== targetId),
        variantWeights: currentWeights
    });
  };

  const handleWeightChange = (targetId: string, value: string) => {
      const num = parseFloat(value);
      if(!isNaN(num)) {
          onUpdate(step.id, {
              variantWeights: {
                  ...step.variantWeights,
                  [targetId]: num
              }
          });
      }
  };

  const incomingConnections = allSteps.filter(s => s.nextSteps && s.nextSteps.includes(step.id));

  const getStepIcon = (type: StepType) => {
    switch (type) {
      case StepType.EMAIL: return <Mail size={14} />;
      case StepType.SMS: return <MessageSquare size={14} />;
      case StepType.BOT: return <MessageSquare size={14} />;
      case StepType.CALL: return <Phone size={14} />;
      case StepType.WEBINAR: return <Video size={14} />;
      case StepType.CONTENT: return <FileText size={14} />;
      case StepType.SOCIAL: return <Share2 size={14} />;
      case StepType.AD: return <Target size={14} />;
      case StepType.SURVEY: return <FileText size={14} />;
      case StepType.APPLICATION: return <FileText size={14} />;
      case StepType.TRAFFIC: return <Users size={14} />;
      default: return <MousePointer size={14} />;
    }
  };

  const getColors = (type: StepType) => {
    switch (type) {
      case StepType.TRAFFIC: 
      case StepType.AD:
      case StepType.SOCIAL:
      case StepType.AFFILIATE:
        return {
          border: 'border-blue-500/30 group-hover:border-blue-500/60',
          glow: 'shadow-blue-500/10 hover:shadow-blue-500/20',
          text: 'text-blue-400',
          bg: 'from-blue-500/20 to-blue-600/5',
          iconBg: 'bg-blue-500/20 text-blue-300'
        };
      case StepType.SALES: 
      case StepType.UPSELL:
      case StepType.DOWNSELL:
      case StepType.CHECKOUT:
        return {
          border: 'border-emerald-500/30 group-hover:border-emerald-500/60',
          glow: 'shadow-emerald-500/10 hover:shadow-emerald-500/20',
          text: 'text-emerald-400',
          bg: 'from-emerald-500/20 to-emerald-600/5',
          iconBg: 'bg-emerald-500/20 text-emerald-300'
        };
      case StepType.EMAIL:
      case StepType.SMS:
      case StepType.BOT:
        return {
          border: 'border-amber-500/30 group-hover:border-amber-500/60',
          glow: 'shadow-amber-500/10 hover:shadow-amber-500/20',
          text: 'text-amber-400',
          bg: 'from-amber-500/20 to-amber-600/5',
          iconBg: 'bg-amber-500/20 text-amber-300'
        };
      case StepType.WEBINAR:
      case StepType.CALL:
      case StepType.APPLICATION:
      case StepType.SURVEY:
        return {
          border: 'border-purple-500/30 group-hover:border-purple-500/60',
          glow: 'shadow-purple-500/10 hover:shadow-purple-500/20',
          text: 'text-purple-400',
          bg: 'from-purple-500/20 to-purple-600/5',
          iconBg: 'bg-purple-500/20 text-purple-300'
        };
      default: return {
          border: 'border-slate-500/30 group-hover:border-slate-500/60',
          glow: 'shadow-slate-500/10 hover:shadow-slate-500/20',
          text: 'text-slate-400',
          bg: 'from-slate-500/20 to-slate-600/5',
          iconBg: 'bg-slate-500/20 text-slate-300'
      };
    }
  };

  const styles = getColors(step.type);
  const isSource = [StepType.TRAFFIC, StepType.AD, StepType.SOCIAL, StepType.CONTENT, StepType.AFFILIATE].includes(step.type);

  return (
    <div 
        className="relative group shrink-0 w-72 flex items-center justify-center z-10"
        onMouseEnter={() => onHover(step.id)}
        onMouseLeave={() => onHover(null)}
    >
      
      {/* Visual Connection Ports (Decorations only) */}
       {incomingConnections.length > 0 && (
         <div className="absolute -left-1.5 w-3 h-3 bg-indigo-400 rounded-full border-2 border-slate-900 shadow-sm z-20 group-hover:scale-125 transition-transform" title={`${incomingConnections.length} Inputs`}></div>
       )}
       {(step.nextSteps?.length || 0) > 0 && (
         <div className="absolute -right-1.5 w-3 h-3 bg-indigo-400 rounded-full border-2 border-slate-900 shadow-sm z-20 group-hover:scale-125 transition-transform" title={`${step.nextSteps?.length} Outputs`}></div>
       )}

      <div className={`
        w-full
        bg-slate-900/90 backdrop-blur-md 
        rounded-2xl border ${styles.border} 
        shadow-lg ${styles.glow} 
        transition-all duration-300 
        flex flex-col overflow-hidden
      `}>
        
        {/* Header */}
        <div className={`px-4 py-3 flex items-center justify-between bg-gradient-to-r ${styles.bg} border-b border-white/5`}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${styles.iconBg}`}>
               {getStepIcon(step.type)}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${styles.text}`}>
              {step.type.replace('_', ' ')}
            </span>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
             {!isFirst && (
                <button onClick={() => onMove(index, 'up')} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors" title="Move Left"><ArrowLeft size={12} /></button>
             )}
             {!isLast && (
                <button onClick={() => onMove(index, 'down')} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors" title="Move Right"><ArrowRight size={12} /></button>
             )}
             <div className="w-px h-3 bg-white/10 mx-1"></div>
             <button onClick={() => onDuplicate(step.id)} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors" title="Duplicate"><Copy size={12} /></button>
             <button onClick={() => onDelete(step.id)} className="p-1.5 hover:bg-red-500/20 rounded-md text-slate-400 hover:text-red-400 transition-colors" title="Delete"><Trash2 size={12} /></button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <input 
            type="text" 
            value={step.name}
            onChange={(e) => onUpdate(step.id, { name: e.target.value })}
            className="block w-full bg-transparent text-sm font-semibold text-slate-100 placeholder-slate-600 border-none focus:ring-0 p-0 hover:text-white transition-colors"
            placeholder="Step Name"
          />

          <div className="grid grid-cols-2 gap-3">
             {/* Key Metrics */}
             {isSource ? (
                <div className="space-y-1 relative group/field">
                  <label className="text-[10px] uppercase tracking-wide text-slate-500 font-medium flex items-center gap-1">Volume <HelpCircle size={10}/></label>
                  <Tooltip text="Monthly Traffic Volume: The total number of visitors or impressions entering the funnel (Default: 1000)." />
                  <div className="relative">
                    <input
                      type="number"
                      value={step.trafficVolume}
                      onChange={(e) => handleNumberChange('trafficVolume', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-2.5 py-1.5 text-xs text-blue-200 focus:border-blue-500/50 focus:bg-slate-900 focus:outline-none transition-all font-mono"
                    />
                  </div>
                </div>
             ) : (
                <div className="space-y-1 relative group/field">
                  <label className="text-[10px] uppercase tracking-wide text-slate-500 font-medium flex items-center gap-1">Conv. % <HelpCircle size={10}/></label>
                  <Tooltip text="Conversion Rate Percentage: The % of visitors who move to the next step." />
                  <div className="relative">
                    <input
                      type="number"
                      value={step.conversionRate}
                      onChange={(e) => handleNumberChange('conversionRate', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-2.5 py-1.5 text-xs text-emerald-200 focus:border-emerald-500/50 focus:bg-slate-900 focus:outline-none transition-all font-mono"
                    />
                    <span className="absolute right-2 top-1.5 text-slate-600 text-xs pointer-events-none">%</span>
                  </div>
                </div>
             )}
             
             {isSource ? (
                <div className="space-y-1 relative group/field">
                  <label className="text-[10px] uppercase tracking-wide text-slate-500 font-medium flex items-center gap-1">CPC <HelpCircle size={10}/></label>
                  <Tooltip text="Cost Per Click: The average cost you pay for each visitor from this traffic source." />
                  <div className="relative">
                    <span className="absolute left-2 top-1.5 text-slate-600 text-xs pointer-events-none">$</span>
                    <input
                      type="number"
                      value={step.cpc}
                      step="0.01"
                      onChange={(e) => handleNumberChange('cpc', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg pl-5 pr-2 py-1.5 text-xs text-red-200 focus:border-red-500/50 focus:bg-slate-900 focus:outline-none transition-all font-mono"
                    />
                  </div>
                </div>
             ) : (
                <div className="space-y-1 relative group/field">
                   <label className="text-[10px] uppercase tracking-wide text-slate-500 font-medium flex items-center gap-1">Price <HelpCircle size={10}/></label>
                   <Tooltip text="Product Price: Revenue generated per conversion at this step." />
                   <div className="relative">
                     <span className="absolute left-2 top-1.5 text-slate-600 text-xs pointer-events-none">$</span>
                     <input
                       type="number"
                       value={step.productPrice}
                       onChange={(e) => handleNumberChange('productPrice', e.target.value)}
                       className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg pl-5 pr-2 py-1.5 text-xs text-amber-200 focus:border-amber-500/50 focus:bg-slate-900 focus:outline-none transition-all font-mono"
                       disabled={step.type === StepType.THANK_YOU}
                     />
                   </div>
                </div>
             )}
          </div>

          {/* Toggle Expand */}
          <button 
             onClick={() => setIsExpanded(!isExpanded)}
             className="w-full flex items-center justify-center py-1 text-slate-600 hover:text-slate-400 transition-colors"
          >
             <MoreHorizontal size={16} />
          </button>

          {/* Detailed Stats */}
          {isExpanded && (
             <div className="pt-2 border-t border-slate-800/50 space-y-3 animate-in slide-in-from-top-2 duration-200">
                
                {/* CONNECTIONS UI */}
                <div className="p-3 bg-slate-950/30 rounded-lg border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                        <GitBranch size={12} className="text-indigo-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Flow Connections</span>
                    </div>

                    {/* Output Connections */}
                    <div className="space-y-2">
                        <div className="text-[10px] text-slate-400 font-medium">Connects To (Outputs):</div>
                        {(!step.nextSteps || step.nextSteps.length === 0) && (
                            <div className="text-[10px] text-slate-600 italic pl-1">No output connections.</div>
                        )}
                        <div className="space-y-2">
                            {step.nextSteps?.map(nextId => {
                                const target = allSteps.find(s => s.id === nextId);
                                if (!target) return null;
                                
                                const isConditional = (step.nextSteps?.length || 0) > 1;
                                const weight = step.variantWeights?.[nextId] ?? (100 / (step.nextSteps?.length || 1));

                                return (
                                    <div key={nextId} className="flex flex-col gap-1 bg-slate-900/50 border border-white/5 rounded p-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-[10px] text-indigo-200">
                                                <span className="truncate max-w-[120px] font-medium">{target.name}</span>
                                            </div>
                                            <button onClick={() => handleDisconnect(nextId)} className="text-slate-500 hover:text-red-400"><XCircle size={10} /></button>
                                        </div>
                                        
                                        {/* Conditional Exits (Weight Input) */}
                                        {isConditional && (
                                            <div className="flex items-center gap-2 mt-1 relative group/field">
                                                <Split size={10} className="text-slate-500"/>
                                                <div className="flex items-center gap-1 bg-slate-950 rounded px-1.5 border border-slate-700">
                                                    <input 
                                                        type="number" 
                                                        value={Math.round(weight)}
                                                        onChange={(e) => handleWeightChange(nextId, e.target.value)}
                                                        className="w-8 bg-transparent text-[10px] text-right focus:outline-none font-mono"
                                                    />
                                                    <span className="text-[10px] text-slate-500">%</span>
                                                </div>
                                                <span className="text-[10px] text-slate-500">probability</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="relative pt-1">
                            <select 
                                onChange={(e) => {
                                    handleConnect(e.target.value);
                                    e.target.value = '';
                                }}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-[10px] text-slate-300 focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
                            >
                                <option value="">+ Connect to Step...</option>
                                {allSteps
                                    .filter(s => s.id !== step.id && !step.nextSteps?.includes(s.id))
                                    .map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    {/* Input Indicators */}
                    {incomingConnections.length > 0 && (
                        <div className="pt-2 border-t border-slate-800/50 space-y-1">
                            <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><GitMerge size={10}/> Incoming from:</div>
                            <div className="flex flex-wrap gap-1">
                                {incomingConnections.map(inc => (
                                    <span key={inc.id} className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                        {inc.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-px bg-slate-800/50 my-2"></div>

                {/* Grouping */}
                <div className="p-2.5 bg-slate-950/50 rounded-lg border border-slate-800 space-y-2">
                   <div className="flex items-center justify-between">
                       <label className="text-[10px] uppercase tracking-wide text-slate-400 font-bold flex items-center gap-1.5">
                          <Layers size={10} className="text-slate-400"/> 
                          Group
                       </label>
                   </div>
                   <input
                     type="text"
                     value={step.groupName || ''}
                     onChange={(e) => onUpdate(step.id, { groupName: e.target.value })}
                     className="w-full bg-slate-900 border border-slate-700/70 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder-slate-700"
                     placeholder="e.g. Acquisition Phase"
                   />
                </div>

                <div className="h-px bg-slate-800/50 my-2"></div>

                {/* URL Input */}
                <div className="p-2.5 bg-slate-950/50 rounded-lg border border-slate-800 space-y-2">
                   <div className="flex items-center justify-between">
                       <label className="text-[10px] uppercase tracking-wide text-slate-400 font-bold flex items-center gap-1.5">
                          <LinkIcon size={10} className="text-indigo-400"/> 
                          {isSource ? "Destination URL" : "Page URL"}
                       </label>
                       {step.url && (
                          <div className="flex items-center gap-2">
                             <button
                               onClick={() => onPreview(step.url!)}
                               className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline transition-colors"
                             >
                               <Eye size={10} /> Preview
                             </button>
                             <div className="w-px h-3 bg-slate-700"></div>
                             <a 
                               href={step.url.startsWith('http') ? step.url : `https://${step.url}`} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline transition-colors"
                             >
                                 Open <ExternalLink size={10} />
                             </a>
                          </div>
                       )}
                   </div>
                   <input
                     type="text"
                     value={step.url || ''}
                     onChange={(e) => onUpdate(step.id, { url: e.target.value })}
                     className="w-full bg-slate-900 border border-slate-700/70 rounded px-2.5 py-1.5 text-xs text-indigo-200 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all font-mono placeholder-slate-700"
                     placeholder="https://example.com/..."
                   />
                </div>

                <div className="h-px bg-slate-800/50 my-2"></div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Visitors In</span>
                        <span className="font-mono text-slate-300">{Math.round(step.visitorsIn).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Visitors Out</span>
                        <span className="font-mono text-slate-300">{Math.round(step.visitorsOut).toLocaleString()}</span>
                    </div>
                    {step.revenue > 0 && (
                        <div className="flex justify-between items-center text-xs text-emerald-500/80">
                            <span>Revenue</span>
                            <span className="font-mono font-bold">${Math.round(step.revenue).toLocaleString()}</span>
                        </div>
                    )}
                    {step.cost > 0 && (
                        <div className="flex justify-between items-center text-xs text-red-500/80">
                            <span>Cost</span>
                            <span className="font-mono font-bold">-${Math.round(step.cost).toLocaleString()}</span>
                        </div>
                    )}
                    
                    {/* CPL for Sources */}
                    {isSource && (
                        <div className="pt-2 mt-2 border-t border-slate-800/50 relative group/field">
                             <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase tracking-wide text-slate-500 font-medium">CPL ($)</label>
                                <input
                                  type="number"
                                  value={step.cpl || 0}
                                  step="0.01"
                                  onChange={(e) => handleNumberChange('cpl', e.target.value)}
                                  className="w-20 bg-slate-950/50 border border-slate-700/50 rounded px-2 py-1 text-xs text-orange-200 focus:border-orange-500/50 focus:outline-none text-right font-mono"
                                />
                             </div>
                             <Tooltip text="Cost Per Lead: Additional fixed cost per acquired lead/contact." />
                        </div>
                    )}

                    {/* CPA Field - For all steps */}
                    <div className="pt-2 mt-2 border-t border-slate-800/50 relative group/field">
                         <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase tracking-wide text-slate-500 font-medium">CPA ($)</label>
                            <div className="relative">
                                <span className="absolute left-2 top-1.5 text-slate-600 text-xs pointer-events-none">$</span>
                                <input
                                  type="number"
                                  value={step.cpa || 0}
                                  step="0.01"
                                  onChange={(e) => handleNumberChange('cpa', e.target.value)}
                                  className="w-24 bg-slate-950/50 border border-slate-700/50 rounded-lg pl-5 pr-2 py-1 text-xs text-rose-200 focus:border-rose-500/50 focus:bg-slate-900 focus:outline-none transition-all font-mono text-right"
                                />
                             </div>
                         </div>
                         <Tooltip text="Cost Per Acquisition: Estimated cost to acquire a conversion at this step." />
                    </div>

                </div>
             </div>
          )}

          {/* Quick Stats Footer */}
          {!isExpanded && (
              <div className="flex justify-between items-center pt-2 border-t border-slate-800/50">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                     <Users size={10} />
                     <span className="font-mono">{Math.round(step.visitorsIn).toLocaleString()}</span>
                  </div>
                  <ArrowRight size={10} className="text-slate-700" />
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                     <span className="font-mono">{Math.round(step.visitorsOut).toLocaleString()}</span>
                     <Users size={10} />
                  </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FunnelStepCard;