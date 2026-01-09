import React, { useState, useRef, useEffect } from 'react';
import { FunnelStep, StepType } from '../types';
import { 
  GripVertical, ChevronDown, ChevronRight, 
  Target, Share2, FileText, Layout, Mail, 
  MessageSquare, Phone, Video, Users, MousePointer,
  Edit2, Check, FolderOpen
} from 'lucide-react';

interface Props {
  steps: FunnelStep[];
  onReorder: (startIndex: number, endIndex: number) => void;
  onUpdateStep: (id: string, updates: Partial<FunnelStep>) => void;
  onRenameGroup: (oldName: string, newName: string) => void;
  onSelect: (id: string) => void;
  hoveredStepId: string | null;
}

const FunnelNavigator: React.FC<Props> = ({ steps, onReorder, onUpdateStep, onRenameGroup, onSelect, hoveredStepId }) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  
  // Drag state
  const dragSourceIndex = useRef<number | null>(null);
  const dragTargetIndex = useRef<number | null>(null);
  const dragTargetGroup = useRef<string | null>(null);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingGroup && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingGroup]);

  const toggleGroup = (group: string) => {
    if (editingGroup) return;
    setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const startEditing = (e: React.MouseEvent, groupName: string) => {
    e.stopPropagation();
    setEditingGroup(groupName);
    setEditValue(groupName === 'Ungrouped' ? '' : groupName);
  };

  const saveGroupRename = () => {
    if (editingGroup !== null) {
      const cleanName = editValue.trim();
      const oldName = editingGroup;
      
      // If name changed, trigger update
      if (cleanName !== (oldName === 'Ungrouped' ? '' : oldName)) {
         onRenameGroup(oldName, cleanName || 'Ungrouped');
      }
      setEditingGroup(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveGroupRename();
    if (e.key === 'Escape') setEditingGroup(null);
  };

  const handleGroupClick = (e: React.MouseEvent) => {
      // Prevent bubble up if clicking input
      e.stopPropagation();
  };

  // Helper: Group steps while preserving their original indices for DnD
  const groupedSteps = React.useMemo(() => {
    const groups: Record<string, { step: FunnelStep; index: number }[]> = {};
    const order: string[] = [];

    steps.forEach((step, index) => {
      const groupName = step.groupName || 'Ungrouped';
      if (!groups[groupName]) {
        groups[groupName] = [];
        order.push(groupName);
      }
      groups[groupName].push({ step, index });
    });

    return { groups, order };
  }, [steps]);

  // DRAG HANDLERS

  const onDragStart = (e: React.DragEvent, index: number) => {
    dragSourceIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
    const el = e.target as HTMLElement;
    el.style.opacity = '0.5';
  };

  const onDragEnd = (e: React.DragEvent) => {
    const el = e.target as HTMLElement;
    el.style.opacity = '1';

    const sourceIdx = dragSourceIndex.current;
    
    // Handle Drop on Group Header
    if (sourceIdx !== null && dragTargetGroup.current !== null) {
        const step = steps[sourceIdx];
        const targetGroup = dragTargetGroup.current === 'Ungrouped' ? '' : dragTargetGroup.current;
        
        if (step.groupName !== targetGroup) {
            onUpdateStep(step.id, { groupName: targetGroup });
        }
    }
    // Handle Reorder / Drop on Step
    else if (sourceIdx !== null && dragTargetIndex.current !== null && sourceIdx !== dragTargetIndex.current) {
        const targetIdx = dragTargetIndex.current;
        
        // Reorder first
        onReorder(sourceIdx, targetIdx);

        // Then check if we need to adopt the group of the target
        const targetStep = steps[targetIdx];
        const sourceStep = steps[sourceIdx];
        const targetGroupName = targetStep.groupName || '';
        
        // Only update group if different
        if (sourceStep.groupName !== targetGroupName) {
            onUpdateStep(sourceStep.id, { groupName: targetGroupName });
        }
    }

    // Reset
    dragSourceIndex.current = null;
    dragTargetIndex.current = null;
    dragTargetGroup.current = null;
    
    // Clear highlights
    document.querySelectorAll('.drag-over-item').forEach(el => el.classList.remove('drag-over-item'));
    document.querySelectorAll('.drag-over-group').forEach(el => el.classList.remove('drag-over-group'));
  };

  const onDragEnterStep = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragTargetIndex.current = index;
    dragTargetGroup.current = null;
    
    // Visual feedback
    const target = (e.currentTarget as HTMLElement);
    document.querySelectorAll('.drag-over-item').forEach(el => el !== target && el.classList.remove('drag-over-item'));
    document.querySelectorAll('.drag-over-group').forEach(el => el.classList.remove('drag-over-group'));
    target.classList.add('drag-over-item');
  };
  
  const onDragEnterGroup = (e: React.DragEvent, groupName: string) => {
    e.preventDefault();
    dragTargetGroup.current = groupName;
    dragTargetIndex.current = null;

    // Visual feedback
    const target = (e.currentTarget as HTMLElement);
    document.querySelectorAll('.drag-over-item').forEach(el => el.classList.remove('drag-over-item'));
    document.querySelectorAll('.drag-over-group').forEach(el => el !== target && el.classList.remove('drag-over-group'));
    target.classList.add('drag-over-group');
  };

  const getStepIcon = (type: StepType) => {
    const size = 12;
    switch (type) {
      case StepType.EMAIL: return <Mail size={size} className="text-amber-400" />;
      case StepType.SMS: return <MessageSquare size={size} className="text-amber-400" />;
      case StepType.BOT: return <MessageSquare size={size} className="text-amber-400" />;
      case StepType.CALL: return <Phone size={size} className="text-purple-400" />;
      case StepType.WEBINAR: return <Video size={size} className="text-purple-400" />;
      case StepType.CONTENT: return <FileText size={size} className="text-blue-400" />;
      case StepType.SOCIAL: return <Share2 size={size} className="text-blue-400" />;
      case StepType.AD: return <Target size={size} className="text-blue-400" />;
      case StepType.SURVEY: return <FileText size={size} className="text-purple-400" />;
      case StepType.APPLICATION: return <FileText size={size} className="text-purple-400" />;
      case StepType.TRAFFIC: return <Users size={size} className="text-blue-400" />;
      case StepType.SALES: 
      case StepType.CHECKOUT:
      case StepType.UPSELL: return <Layout size={size} className="text-emerald-400" />;
      default: return <MousePointer size={size} className="text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2 pb-20">
      <style>{`
        .drag-over-item { background: rgba(99, 102, 241, 0.2) !important; border-left: 2px solid #6366f1; }
        .drag-over-group { background: rgba(255, 255, 255, 0.1) !important; outline: 1px dashed rgba(255,255,255,0.3); }
      `}</style>
      
      {groupedSteps.order.map((groupName) => {
        const isCollapsed = collapsedGroups[groupName];
        const isEditing = editingGroup === groupName;
        
        return (
          <div key={groupName} className="bg-slate-900/40 rounded-lg overflow-hidden border border-white/5">
            {/* Group Header */}
            <div 
              onClick={() => toggleGroup(groupName)}
              onDragEnter={(e) => onDragEnterGroup(e, groupName)}
              onDragOver={(e) => e.preventDefault()}
              className="group/header flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border-b border-transparent hover:border-white/5"
            >
              {isCollapsed ? <ChevronRight size={12} className="text-slate-500"/> : <ChevronDown size={12} className="text-slate-500"/>}
              
              {isEditing ? (
                 <div className="flex-1 flex items-center gap-2" onClick={handleGroupClick}>
                    <input
                        ref={editInputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={saveGroupRename}
                        className="flex-1 bg-slate-950 border border-indigo-500/50 rounded px-1.5 py-0.5 text-[10px] text-white focus:outline-none"
                        placeholder="Group Name"
                    />
                    <button onClick={saveGroupRename} className="text-emerald-400 hover:text-emerald-300"><Check size={12}/></button>
                 </div>
              ) : (
                 <>
                    <FolderOpen size={10} className="text-slate-600 group-hover/header:text-indigo-400 transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none flex-1 truncate">
                        {groupName}
                    </span>
                    <button 
                        onClick={(e) => startEditing(e, groupName)}
                        className="opacity-0 group-hover/header:opacity-100 p-1 hover:bg-white/10 rounded text-slate-500 hover:text-white transition-all"
                        title="Rename Group"
                    >
                        <Edit2 size={10} />
                    </button>
                    <span className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-full">
                        {groupedSteps.groups[groupName].length}
                    </span>
                 </>
              )}
            </div>

            {/* Steps List */}
            {!isCollapsed && (
              <div className="flex flex-col">
                {groupedSteps.groups[groupName].map(({ step, index }) => (
                  <div
                    key={step.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, index)}
                    onDragEnter={(e) => onDragEnterStep(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnd={onDragEnd}
                    onClick={() => onSelect(step.id)}
                    className={`
                      relative flex items-center gap-2 px-3 py-2 border-t border-white/5 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors group/item
                      ${hoveredStepId === step.id ? 'bg-indigo-500/10 border-indigo-500/30' : ''}
                    `}
                  >
                    <div className="text-slate-600 group-hover/item:text-slate-400 cursor-grab">
                      <GripVertical size={12} />
                    </div>
                    <div className="p-1 rounded bg-slate-950 border border-white/10">
                      {getStepIcon(step.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-medium truncate ${hoveredStepId === step.id ? 'text-indigo-200' : 'text-slate-300'}`}>
                        {step.name}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-[9px] text-slate-600 truncate">{step.type}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FunnelNavigator;