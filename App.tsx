import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { 
  FunnelStep, 
  StepType, 
  INITIAL_FUNNEL, 
  ChartDataPoint
} from './types';
import FunnelStepCard from './components/FunnelStepCard';
import StatsPanel from './components/StatsPanel';
import Charts from './components/Charts';
import StepToolbox from './components/StepToolbox';
import UrlPreviewModal from './components/UrlPreviewModal';
import ToastContainer, { ToastMessage } from './components/Toast';
import FunnelNavigator from './components/FunnelNavigator';
import { 
  Layout, RefreshCw, Trash2, ChevronDown, 
  Undo, Redo, Plus, Save, FolderOpen, X, MousePointer2,
  Zap, Rocket, Target, Mail, BarChart2, ListTree
} from 'lucide-react';

// LAYOUT CONSTANTS
const LAYOUT = {
  CARD_WIDTH: 288,
  GAP: 96,
  PADDING_LEFT: 80,
  PADDING_Y: 80, 
};

const TEMPLATES: Record<string, FunnelStep[]> = {
  'empty': [],
  'sales-page': [
    { id: '1', type: StepType.AD, name: 'Facebook Ad', conversionRate: 100, productPrice: 0, trafficVolume: 3000, cpc: 1.5, cpl: 0, cpa: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, nextSteps: ['2'], groupName: 'Acquisition' },
    { id: '2', type: StepType.SALES, name: 'Long Form Sales Page', conversionRate: 3, productPrice: 197, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['3', '4'], variantWeights: {'3': 30, '4': 70}, groupName: 'Acquisition' },
    { id: '3', type: StepType.CHECKOUT, name: 'Checkout', conversionRate: 65, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['5'], groupName: 'Conversion' },
    { id: '4', type: StepType.UPSELL, name: 'One-Time Offer', conversionRate: 20, productPrice: 47, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['5'], groupName: 'Conversion' },
    { id: '5', type: StepType.THANK_YOU, name: 'Order Confirmation', conversionRate: 0, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: [] }
  ],
  'webinar': [
    { id: '1', type: StepType.AD, name: 'LinkedIn Ads', conversionRate: 100, productPrice: 0, trafficVolume: 1000, cpc: 4.5, cpl: 0, cpa: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, nextSteps: ['2'], groupName: 'Sources' },
    { id: '2', type: StepType.LANDING, name: 'Registration Page', conversionRate: 25, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['3'], groupName: 'Registration' },
    { id: '3', type: StepType.EMAIL, name: 'Reminder Sequence', conversionRate: 100, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['4'], groupName: 'Nurture' },
    { id: '4', type: StepType.WEBINAR, name: 'Live Webinar', conversionRate: 40, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['5'], groupName: 'Event' },
    { id: '5', type: StepType.SALES, name: 'Webinar Pitch', conversionRate: 10, productPrice: 997, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['6'], groupName: 'Sales' },
    { id: '6', type: StepType.CHECKOUT, name: 'Checkout', conversionRate: 70, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: [], groupName: 'Sales' },
  ],
  'application': [
    { id: '1', type: StepType.AD, name: 'Targeted Ads', conversionRate: 100, productPrice: 0, trafficVolume: 2000, cpc: 2.0, cpl: 0, cpa: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, nextSteps: ['2'] },
    { id: '2', type: StepType.CONTENT, name: 'Case Study Video', conversionRate: 10, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['3'] },
    { id: '3', type: StepType.APPLICATION, name: 'Application Form', conversionRate: 25, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['4'] },
    { id: '4', type: StepType.CALL, name: 'Consultation Call', conversionRate: 30, productPrice: 3000, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['5'] },
    { id: '5', type: StepType.THANK_YOU, name: 'Onboarding', conversionRate: 0, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: [] },
  ],
  'book-funnel': [
    { id: '1', type: StepType.SOCIAL, name: 'Organic Social', conversionRate: 100, productPrice: 0, trafficVolume: 5000, cpc: 0, cpl: 0, cpa: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, nextSteps: ['2'] },
    { id: '2', type: StepType.SALES, name: 'Free+Shipping Book', conversionRate: 5, productPrice: 7.95, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['3', '4'] },
    { id: '3', type: StepType.CHECKOUT, name: 'Checkout', conversionRate: 80, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['6'] },
    { id: '4', type: StepType.UPSELL, name: 'Audiobook Bump', conversionRate: 30, productPrice: 27, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['6'] },
    { id: '5', type: StepType.UPSELL, name: 'Masterclass', conversionRate: 10, productPrice: 97, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['6'] },
    { id: '6', type: StepType.THANK_YOU, name: 'Access Page', conversionRate: 0, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: [] },
  ],
  'email-marketing': [
    { id: '1', type: StepType.TRAFFIC, name: 'Blog Traffic', conversionRate: 100, productPrice: 0, trafficVolume: 10000, cpc: 0, cpl: 0, cpa: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, nextSteps: ['2'] },
    { id: '2', type: StepType.OPTIN, name: 'Lead Magnet Popup', conversionRate: 3, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['3'] },
    { id: '3', type: StepType.EMAIL, name: 'Welcome Email', conversionRate: 40, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['4'] },
    { id: '4', type: StepType.EMAIL, name: 'Value Email 1', conversionRate: 30, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['5'] },
    { id: '5', type: StepType.EMAIL, name: 'Offer Email', conversionRate: 5, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['6'] },
    { id: '6', type: StepType.SALES, name: 'Sales Page', conversionRate: 8, productPrice: 49, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: [] },
  ],
  'survey': [
    { id: '1', type: StepType.AD, name: 'Quiz Ad', conversionRate: 100, productPrice: 0, trafficVolume: 2500, cpc: 0.8, cpl: 0, cpa: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, nextSteps: ['2'] },
    { id: '2', type: StepType.SURVEY, name: 'Segmentation Quiz', conversionRate: 60, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['3'] },
    { id: '3', type: StepType.OPTIN, name: 'Get Results Optin', conversionRate: 50, productPrice: 0, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: ['4'] },
    { id: '4', type: StepType.SALES, name: 'Customized Offer', conversionRate: 12, productPrice: 37, visitorsIn: 0, visitorsOut: 0, revenue: 0, cost: 0, cpa: 0, nextSteps: [] },
  ]
};

interface SavedFunnel {
  name: string;
  date: string;
  steps: FunnelStep[];
}

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 25%)`;
};

type SidebarTab = 'performance' | 'structure';

const App: React.FC = () => {
  const [steps, setSteps] = useState<FunnelStep[]>(INITIAL_FUNNEL);
  const [history, setHistory] = useState<FunnelStep[][]>([]);
  const [future, setFuture] = useState<FunnelStep[][]>([]);
  
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);
  const [showToolbox, setShowToolbox] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('performance');
  
  // UI States
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [hoveredStepId, setHoveredStepId] = useState<string | null>(null);

  const [savedFunnels, setSavedFunnels] = useState<SavedFunnel[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('funnel_saves');
    if (saved) {
      try {
        setSavedFunnels(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved funnels", e);
      }
    }
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // GRAPH-BASED SIMULATION ENGINE
  const simulationResults = useMemo(() => {
    const stepMap = new Map<string, FunnelStep>();
    const processingQueue: string[] = [];

    steps.forEach(step => {
      const mutableStep: FunnelStep = { 
        ...step, 
        visitorsIn: 0, 
        visitorsOut: 0, 
        revenue: 0, 
        cost: 0,
        nextSteps: step.nextSteps || [], 
        variantWeights: step.variantWeights || {}
      };
      stepMap.set(step.id, mutableStep);
    });

    steps.forEach(step => {
        const isSource = [StepType.TRAFFIC, StepType.AD, StepType.SOCIAL, StepType.CONTENT, StepType.AFFILIATE].includes(step.type);
        if (isSource) {
            const mutableStep = stepMap.get(step.id)!;
            mutableStep.visitorsIn = 0; 
            mutableStep.visitorsOut = step.trafficVolume || 0;
            mutableStep.cost = ((step.trafficVolume || 0) * (step.cpc || 0)) + ((step.trafficVolume || 0) * (step.cpl || 0));
            mutableStep.nextSteps.forEach(nextId => {
                if (!processingQueue.includes(nextId)) processingQueue.push(nextId);
            });
        }
    });

    stepMap.forEach(s => {
        if (![StepType.TRAFFIC, StepType.AD, StepType.SOCIAL, StepType.CONTENT, StepType.AFFILIATE].includes(s.type)) {
            s.visitorsIn = 0;
        }
    });

    const PASSES = 5;
    for(let i=0; i<PASSES; i++) {
        const currentOutputs = new Map<string, number>();
        stepMap.forEach((v, k) => {
            currentOutputs.set(k, v.visitorsOut);
        });

        const calculateConnectionWeight = (parentId: string, targetId: string): number => {
            const parent = stepMap.get(parentId);
            if (!parent) return 0;
            
            const nextSteps = parent.nextSteps || [];
            if (!nextSteps.includes(targetId)) return 0;

            const definedWeights: Record<string, number> = parent.variantWeights || {};
            const definedTargets = Object.keys(definedWeights).filter(id => nextSteps.includes(id));
            const undefinedTargets = nextSteps.filter(id => !definedTargets.includes(id));
            
            let totalDefinedPercentage = 0;
            definedTargets.forEach(id => totalDefinedPercentage += definedWeights[id]);

            // Normalization if defined > 100
            let effectiveWeight = 0;
            if (totalDefinedPercentage > 100) {
                 if (definedTargets.includes(targetId)) {
                     effectiveWeight = (definedWeights[targetId] / totalDefinedPercentage) * 100;
                 } else {
                     effectiveWeight = 0;
                 }
            } else {
                if (definedTargets.includes(targetId)) {
                    effectiveWeight = definedWeights[targetId];
                } else if (undefinedTargets.includes(targetId)) {
                    const remainingPercentage = 100 - totalDefinedPercentage;
                    effectiveWeight = remainingPercentage / undefinedTargets.length;
                }
            }
            return effectiveWeight;
        };

        stepMap.forEach((step, stepId) => {
            let totalIn = 0;
            const isSource = [StepType.TRAFFIC, StepType.AD, StepType.SOCIAL, StepType.CONTENT, StepType.AFFILIATE].includes(step.type);
            
            if (!isSource) {
                stepMap.forEach((parent, parentId) => {
                    if (parent.nextSteps.includes(stepId)) {
                        const splitPercentage = calculateConnectionWeight(parentId, stepId);
                        totalIn += (currentOutputs.get(parentId) || 0) * (splitPercentage / 100);
                    }
                });
                
                step.visitorsIn = totalIn;
                const conversions = step.visitorsIn * (step.conversionRate / 100);
                step.visitorsOut = conversions;
                step.revenue = conversions * step.productPrice;
                step.cost = conversions * (step.cpa || 0);
            }
        });
    }

    let totalRev = 0;
    let totalCost = 0;
    let initialTraffic = 0;
    let cumulativeRev = 0;
    const finalSteps: FunnelStep[] = [];
    
    steps.forEach(original => {
        const calculated = stepMap.get(original.id)!;
        totalRev += calculated.revenue;
        totalCost += calculated.cost;
        if ([StepType.TRAFFIC, StepType.AD, StepType.SOCIAL, StepType.CONTENT, StepType.AFFILIATE].includes(calculated.type)) {
            initialTraffic += calculated.trafficVolume || 0;
        }
        cumulativeRev += calculated.revenue;
        (calculated as any).cumulativeRevenue = cumulativeRev;
        finalSteps.push(calculated);
    });

    const totalProfit = totalRev - totalCost;
    const roas = totalCost > 0 ? totalRev / totalCost : 0;
    const epa = initialTraffic > 0 ? totalRev / initialTraffic : 0;
    
    return {
      steps: finalSteps,
      totals: {
        totalRevenue: totalRev,
        totalCost: totalCost,
        totalProfit: totalProfit,
        roas,
        epa,
        conversionRateOverall: 0
      }
    };
  }, [steps]);

  const groupRegions = useMemo(() => {
      const groups: Record<string, {min: number, max: number, name: string}> = {};
      simulationResults.steps.forEach((step, index) => {
          if(step.groupName) {
              if(!groups[step.groupName]) {
                  groups[step.groupName] = { min: index, max: index, name: step.groupName };
              } else {
                  groups[step.groupName].min = Math.min(groups[step.groupName].min, index);
                  groups[step.groupName].max = Math.max(groups[step.groupName].max, index);
              }
          }
      });
      return Object.values(groups);
  }, [simulationResults.steps]);

  const chartData: ChartDataPoint[] = simulationResults.steps.map(s => ({
    name: s.name,
    revenue: s.revenue,
    profit: s.revenue - s.cost,
    cumulativeRevenue: (s as any).cumulativeRevenue
  }));

  const updateStepsWithHistory = (newSteps: FunnelStep[]) => {
    setHistory(prev => [...prev, steps]);
    setFuture([]);
    setSteps(newSteps);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);
    setFuture(prev => [steps, ...prev]);
    setHistory(newHistory);
    setSteps(previous);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setHistory(prev => [...prev, steps]);
    setFuture(newFuture);
    setSteps(next);
  };

  const handleUpdateStep = useCallback((id: string, updates: Partial<FunnelStep>) => {
    const newSteps = steps.map(s => s.id === id ? { ...s, ...updates } : s);
    updateStepsWithHistory(newSteps);
  }, [steps]);

  const handleRenameGroup = useCallback((oldName: string, newName: string) => {
    const newSteps = steps.map(step => {
        const currentGroup = step.groupName || 'Ungrouped';
        if (currentGroup === oldName) {
            // If renaming TO Ungrouped, clear the property
            return { ...step, groupName: newName === 'Ungrouped' ? undefined : newName };
        }
        return step;
    });
    updateStepsWithHistory(newSteps);
    addToast("Group renamed", "info");
  }, [steps]);

  const handleDeleteStep = useCallback((id: string) => {
    const newSteps = steps
        .filter(s => s.id !== id)
        .map(s => ({
            ...s,
            nextSteps: (s.nextSteps || []).filter(nId => nId !== id)
        }));
    updateStepsWithHistory(newSteps);
    addToast("Step deleted", "info");
  }, [steps]);

  const handleDuplicateStep = useCallback((id: string) => {
    const index = steps.findIndex(s => s.id === id);
    if (index === -1) return;
    const original = steps[index];
    const newStep = {
      ...original,
      id: `copy-${Date.now()}`,
      name: `${original.name} (Copy)`,
      nextSteps: [],
      variantWeights: {}
    };
    const newSteps = [...steps];
    newSteps.splice(index + 1, 0, newStep);
    updateStepsWithHistory(newSteps);
    addToast("Step duplicated", "info");
  }, [steps]);

  const handleMoveStep = useCallback((index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    if (direction === 'up' && index > 0) {
      [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
    } else if (direction === 'down' && index < newSteps.length - 1) {
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    }
    updateStepsWithHistory(newSteps);
  }, [steps]);

  // New Drag and Drop Reorder Handler (Array Index based)
  const handleDragReorder = (startIndex: number, endIndex: number) => {
    const result = Array.from(steps);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    updateStepsWithHistory(result);
  };

  // Scroll to Step logic
  const handleScrollToStep = (id: string) => {
    const index = steps.findIndex(s => s.id === id);
    if (index !== -1 && scrollRef.current) {
      const { x } = getStepCoordinates(index);
      // Center the step
      const containerWidth = scrollRef.current.clientWidth;
      const scrollPos = x - (containerWidth / 2) + (LAYOUT.CARD_WIDTH / 2);
      scrollRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
      setHoveredStepId(id);
      setTimeout(() => setHoveredStepId(null), 2000); // Highlight briefly
    }
  };

  const getDefaultName = (type: StepType) => {
    const readable = type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ');
    return `New ${readable}`;
  };

  const handleAddStep = (type: StepType) => {
    const isSource = [StepType.TRAFFIC, StepType.AD, StepType.SOCIAL, StepType.CONTENT, StepType.AFFILIATE].includes(type);
    const newStep: FunnelStep = {
      id: `new-${Date.now()}`,
      type,
      name: getDefaultName(type),
      conversionRate: isSource ? 100 : 10,
      productPrice: 0,
      trafficVolume: isSource ? 1000 : undefined,
      cpc: isSource ? 1.0 : undefined,
      cpl: isSource ? 0 : undefined,
      cpa: 0,
      visitorsIn: 0,
      visitorsOut: 0,
      revenue: 0,
      cost: 0,
      nextSteps: []
    };
    const newSteps = [...steps, newStep];
    updateStepsWithHistory(newSteps);
    setShowToolbox(false);
    addToast(`Added ${getDefaultName(type)}`);
    setTimeout(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' });
        }
    }, 100);
  };

  const loadTemplate = (templateKey: string) => {
    const template = TEMPLATES[templateKey];
    if (template) {
      const freshSteps = template.map((s, idx) => ({
        ...s,
        id: `tpl-${Date.now()}-${idx}`
      }));
      updateStepsWithHistory(freshSteps);
      addToast("Blueprint loaded successfully");
    }
    setShowTemplates(false);
  };

  const handleSaveConfirm = () => {
    if (!saveName.trim()) {
      addToast("Please enter a name", "error");
      return;
    }
    const newSave: SavedFunnel = {
      name: saveName,
      date: new Date().toISOString(),
      steps: steps
    };
    const updatedSaves = [newSave, ...savedFunnels];
    setSavedFunnels(updatedSaves);
    localStorage.setItem('funnel_saves', JSON.stringify(updatedSaves));
    setShowSaveModal(false);
    setSaveName("");
    addToast("Funnel saved to local storage");
  };

  const handleLoadFunnel = (saved: SavedFunnel) => {
    if (window.confirm(`Load "${saved.name}"? Unsaved changes will be lost.`)) {
      const loadedSteps = saved.steps.map(s => ({
          ...s, 
          nextSteps: s.nextSteps || [],
          variantWeights: s.variantWeights || {}
      })); 
      updateStepsWithHistory(loadedSteps);
      setShowSavedList(false);
      addToast(`Loaded "${saved.name}"`);
    }
  };

  const handleDeleteSaved = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (window.confirm("Delete this saved funnel?")) {
      const updated = savedFunnels.filter((_, i) => i !== index);
      setSavedFunnels(updated);
      localStorage.setItem('funnel_saves', JSON.stringify(updated));
      addToast("Saved funnel deleted", "info");
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all steps?")) {
      updateStepsWithHistory([]);
      addToast("Canvas cleared", "info");
    }
  };

  const getStepCoordinates = (index: number) => {
    const x = LAYOUT.PADDING_LEFT + (index * (LAYOUT.CARD_WIDTH + LAYOUT.GAP));
    const inputX = x;
    const outputX = x + LAYOUT.CARD_WIDTH;
    return { x, inputX, outputX };
  };

  const getGradientId = (type: StepType) => {
      switch (type) {
        case StepType.TRAFFIC: 
        case StepType.AD:
        case StepType.SOCIAL:
        case StepType.AFFILIATE: return "grad-blue";
        case StepType.SALES: 
        case StepType.CHECKOUT: return "grad-emerald";
        case StepType.EMAIL: return "grad-amber";
        default: return "grad-indigo";
      }
  };

  const getMarkerId = (type: StepType, isActive: boolean) => {
      if (isActive) return "arrowhead-active";
      switch (type) {
        case StepType.TRAFFIC: 
        case StepType.AD:
        case StepType.SOCIAL:
        case StepType.AFFILIATE: return "arrowhead-blue";
        case StepType.SALES: 
        case StepType.CHECKOUT: return "arrowhead-emerald";
        case StepType.EMAIL: return "arrowhead-amber";
        default: return "arrowhead-indigo";
      }
  };

  const getLineColor = (type: StepType) => {
      switch (type) {
        case StepType.TRAFFIC: 
        case StepType.AD:
        case StepType.SOCIAL:
        case StepType.AFFILIATE: return "#60a5fa"; 
        case StepType.SALES: 
        case StepType.CHECKOUT: return "#34d399";
        case StepType.EMAIL: return "#fbbf24"; 
        default: return "#818cf8"; 
      }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0B1120] text-slate-200 font-sans overflow-hidden">
      
      {/* Header */}
      <header className="h-16 border-b border-white/5 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 z-50 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Layout size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            FunnelFlow <span className="font-light opacity-50">Manager</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-800/50 rounded-lg p-1 border border-white/5 mr-2">
              <button onClick={handleUndo} disabled={history.length === 0} className="p-2 hover:bg-white/5 rounded-md text-slate-400 hover:text-white disabled:opacity-30 transition-colors"><Undo size={16} /></button>
              <div className="w-px h-4 bg-white/10 mx-1"></div>
              <button onClick={handleRedo} disabled={future.length === 0} className="p-2 hover:bg-white/5 rounded-md text-slate-400 hover:text-white disabled:opacity-30 transition-colors"><Redo size={16} /></button>
            </div>
             <button onClick={() => setShowSaveModal(true)} className="flex items-center gap-2 px-3 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 rounded-lg text-xs font-medium transition-all text-indigo-300 hover:text-white"><Save size={14} /> Save</button>
             <div className="relative">
                <button onClick={() => setShowSavedList(!showSavedList)} className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 border border-white/10 rounded-lg text-xs font-medium transition-all text-slate-300 hover:text-white"><FolderOpen size={14} /> Load</button>
                {showSavedList && (
                    <div className="absolute right-0 mt-2 w-80 bg-[#161e31] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto ring-1 ring-black/50">
                       <div className="flex justify-between items-center p-3 border-b border-white/5 bg-white/5">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Funnels</span>
                          <button onClick={() => setShowSavedList(false)}><X size={14} className="text-slate-500 hover:text-white transition-colors"/></button>
                       </div>
                       {savedFunnels.length === 0 ? <div className="p-6 text-center text-slate-500 text-sm">No saved funnels yet.</div> : 
                         savedFunnels.map((save, idx) => (
                           <div key={idx} onClick={() => handleLoadFunnel(save)} className="p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer group flex justify-between items-center transition-colors">
                              <div><div className="text-sm font-medium text-slate-200 group-hover:text-white">{save.name}</div><div className="text-[10px] text-slate-500">{new Date(save.date).toLocaleDateString()} • {save.steps.length} steps</div></div>
                              <button onClick={(e) => handleDeleteSaved(e, idx)} className="p-1.5 hover:bg-red-500/20 text-slate-600 hover:text-red-400 rounded-md transition-colors"><Trash2 size={14} /></button>
                           </div>
                         ))
                       }
                    </div>
                  )}
             </div>
            <div className="relative">
              <button onClick={() => setShowTemplates(!showTemplates)} className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 border border-white/10 rounded-lg text-xs font-medium transition-all text-slate-300 hover:text-white"><RefreshCw size={14} className="text-emerald-400" /><span>Blueprints</span><ChevronDown size={14} /></button>
              {showTemplates && (
                <div className="absolute right-0 mt-2 w-64 bg-[#161e31] border border-white/10 rounded-xl shadow-2xl py-1 z-50 overflow-hidden max-h-96 overflow-y-auto ring-1 ring-black/50">
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Templates</div>
                  <button onClick={() => loadTemplate('sales-page')} className="block w-full text-left px-4 py-2 text-sm hover:bg-white/5 text-slate-300 hover:text-white transition-colors">Sales Page Funnel</button>
                  <button onClick={() => loadTemplate('webinar')} className="block w-full text-left px-4 py-2 text-sm hover:bg-white/5 text-slate-300 hover:text-white transition-colors">Webinar Funnel</button>
                  <button onClick={() => loadTemplate('application')} className="block w-full text-left px-4 py-2 text-sm hover:bg-white/5 text-slate-300 hover:text-white transition-colors">High-Ticket Application</button>
                  <button onClick={() => loadTemplate('book-funnel')} className="block w-full text-left px-4 py-2 text-sm hover:bg-white/5 text-slate-300 hover:text-white transition-colors">Free Book / Shipping</button>
                  <button onClick={() => loadTemplate('email-marketing')} className="block w-full text-left px-4 py-2 text-sm hover:bg-white/5 text-slate-300 hover:text-white transition-colors">Email Sequence</button>
                  <button onClick={() => loadTemplate('survey')} className="block w-full text-left px-4 py-2 text-sm hover:bg-white/5 text-slate-300 hover:text-white transition-colors">Survey / Quiz Funnel</button>
                </div>
              )}
            </div>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <button onClick={handleReset} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Clear All"><Trash2 size={18} /></button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar: Stats & Charts OR Navigator */}
        <div className="w-80 bg-[#0f172a] border-r border-white/5 flex flex-col overflow-y-auto shrink-0 z-30 shadow-2xl transition-all duration-300">
           
           {/* Sidebar Toggle Tabs */}
           <div className="flex items-center p-2 gap-2 border-b border-white/5 bg-slate-900/50">
               <button 
                  onClick={() => setSidebarTab('performance')}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${sidebarTab === 'performance' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
               >
                  <BarChart2 size={14} /> Performance
               </button>
               <button 
                  onClick={() => setSidebarTab('structure')}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${sidebarTab === 'structure' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
               >
                  <ListTree size={14} /> Structure
               </button>
           </div>

           {sidebarTab === 'performance' ? (
               <>
                  <div className="p-5 border-b border-white/5 animate-in fade-in slide-in-from-left-4 duration-300">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Live Performance</h3>
                      <div className="space-y-4">
                          <StatsPanel totals={simulationResults.totals} />
                      </div>
                  </div>
                  <div className="p-5 flex-1 bg-slate-900/30 animate-in fade-in slide-in-from-left-4 duration-300 delay-75">
                      <Charts data={chartData} />
                  </div>
               </>
           ) : (
               <div className="flex-1 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Funnel Structure</h3>
                    <p className="text-[10px] text-slate-500 mb-4">Drag to reorder or move between groups. Click group name to rename.</p>
                    <FunnelNavigator 
                        steps={simulationResults.steps} 
                        onReorder={handleDragReorder}
                        onUpdateStep={handleUpdateStep}
                        onRenameGroup={handleRenameGroup}
                        onSelect={handleScrollToStep}
                        hoveredStepId={hoveredStepId}
                    />
                  </div>
               </div>
           )}
        </div>

        {/* Center: Infinite Canvas (Horizontal Scroll) */}
        <div className="flex-1 relative bg-[#0B1120] overflow-hidden flex flex-col">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-20" 
                 style={{ 
                     backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', 
                     backgroundSize: '24px 24px' 
                 }}>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120] via-transparent to-[#0B1120] pointer-events-none opacity-50"></div>
            
            {steps.length === 0 ? (
                // ZERO STATE HERO
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="text-center space-y-6 p-8 max-w-lg">
                        <div className="inline-flex p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mb-2 ring-1 ring-indigo-500/20 shadow-2xl shadow-indigo-500/20">
                            <Zap size={32} className="text-indigo-400" />
                        </div>
                        <div className="space-y-2">
                           <h2 className="text-2xl font-bold text-white">Start Your Simulation</h2>
                           <p className="text-slate-400 text-sm">Select a blueprint to auto-generate a high-converting funnel strategy or build from scratch.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-4">
                           <button onClick={() => loadTemplate('sales-page')} className="flex items-center justify-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-indigo-500/50 rounded-xl transition-all group">
                               <Rocket size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                               <span className="text-sm font-medium">Sales Page</span>
                           </button>
                           <button onClick={() => loadTemplate('webinar')} className="flex items-center justify-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-indigo-500/50 rounded-xl transition-all group">
                               <Zap size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                               <span className="text-sm font-medium">Webinar</span>
                           </button>
                           <button onClick={() => loadTemplate('application')} className="flex items-center justify-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-indigo-500/50 rounded-xl transition-all group">
                               <Target size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                               <span className="text-sm font-medium">High Ticket</span>
                           </button>
                           <button onClick={() => loadTemplate('email-marketing')} className="flex items-center justify-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-indigo-500/50 rounded-xl transition-all group">
                               <Mail size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                               <span className="text-sm font-medium">Email Seq.</span>
                           </button>
                        </div>
                        <div className="pt-4">
                            <button onClick={() => setShowToolbox(true)} className="text-slate-500 hover:text-white text-xs hover:underline">Start from scratch with a single node</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-x-auto overflow-y-hidden flex items-center px-20 relative cursor-grab active:cursor-grabbing scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
                >
                    <div className="flex items-center gap-24 relative min-w-max py-20">

                    {/* GROUP BACKGROUND LAYER */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        {groupRegions.map((group, idx) => {
                            const { x: startX } = getStepCoordinates(group.min);
                            const { x: endX } = getStepCoordinates(group.max);
                            const width = endX - startX + LAYOUT.CARD_WIDTH;
                            const color = stringToColor(group.name);
                            
                            return (
                                <div 
                                    key={idx}
                                    className="absolute top-0 bottom-0 m-auto h-[600px] border border-white/5 rounded-3xl"
                                    style={{
                                        left: startX - 24,
                                        width: width + 48,
                                        backgroundColor: color,
                                        opacity: 0.15,
                                    }}
                                >
                                    <div className="absolute -top-3 left-4 px-2 py-0.5 bg-slate-800 rounded border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                                        {group.name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* SVG CONNECTIONS LAYER */}
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-0">
                        <defs>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>

                            {/* GRADIENTS */}
                            <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#60a5fa" stopOpacity="1" />
                            </linearGradient>
                            <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
                            </linearGradient>
                            <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#fbbf24" stopOpacity="1" />
                            </linearGradient>
                            <linearGradient id="grad-indigo" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#818cf8" stopOpacity="1" />
                            </linearGradient>

                            {/* MARKERS */}
                            <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff" />
                            </marker>
                            <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
                            </marker>
                            <marker id="arrowhead-emerald" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#34d399" />
                            </marker>
                            <marker id="arrowhead-amber" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24" />
                            </marker>
                            <marker id="arrowhead-indigo" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#818cf8" />
                            </marker>
                        </defs>
                        
                        <style>{`
                            @keyframes flowDash {
                                to { stroke-dashoffset: -20; }
                            }
                        `}</style>

                        {simulationResults.steps.map((sourceStep, sourceIdx) => {
                             return (sourceStep.nextSteps || []).map(targetId => {
                                 const targetIdx = simulationResults.steps.findIndex(s => s.id === targetId);
                                 if (targetIdx === -1) return null;
                                 
                                 const { outputX: startX } = getStepCoordinates(sourceIdx);
                                 const { inputX: endX } = getStepCoordinates(targetIdx);
                                 
                                 const diff = targetIdx - sourceIdx;
                                 const absDiff = Math.abs(diff);
                                 
                                 let d = '';
                                 
                                 if (absDiff === 1 && diff > 0) {
                                     // Direct neighbor forward
                                     d = `M ${startX} 0 C ${startX + 50} 0, ${endX - 50} 0, ${endX} 0`;
                                 } else if (diff > 0) {
                                     // Forward jump (Arc Up)
                                     const height = 40 + (absDiff * 10);
                                     d = `M ${startX} 0 C ${startX + 50} -${height}, ${endX - 50} -${height}, ${endX} 0`;
                                 } else {
                                     // Backward loop (Arc Down)
                                     const height = 150 + (absDiff * 15);
                                     d = `M ${startX} 0 C ${startX + 50} ${height}, ${endX - 50} ${height}, ${endX} 0`;
                                 }
                                 
                                 // Hover Logic
                                 const isHovered = hoveredStepId === sourceStep.id || hoveredStepId === targetId;
                                 const gradId = getGradientId(sourceStep.type);
                                 const markerId = getMarkerId(sourceStep.type, isHovered);
                                 const solidColor = getLineColor(sourceStep.type);

                                 // Calculate connection weight
                                 // We need to fetch the weight from the sourceStep logic
                                 let weight = 0;
                                 // We don't have the full calculation helper here unless we extract it or pass it.
                                 // For visualization, we can approximate or use the stored weights.
                                 // Or re-implement the simple check:
                                 if (sourceStep.variantWeights && sourceStep.variantWeights[targetId] !== undefined) {
                                     weight = sourceStep.variantWeights[targetId];
                                 } else {
                                     // Default evenly distributed
                                     const definedTargets = Object.keys(sourceStep.variantWeights || {});
                                     const totalDefined = definedTargets.reduce((acc, k) => acc + (sourceStep.variantWeights?.[k] || 0), 0);
                                     if (!definedTargets.includes(targetId)) {
                                         const undefinedCount = (sourceStep.nextSteps?.length || 0) - definedTargets.length;
                                         if (undefinedCount > 0) weight = (100 - totalDefined) / undefinedCount;
                                     }
                                 }

                                 return (
                                     <g key={`connection-${sourceStep.id}-${targetId}`}>
                                         {/* Shadow/Glow Line - Active only on hover */}
                                         {isHovered && (
                                            <path 
                                                d={d}
                                                stroke={solidColor}
                                                strokeWidth="6"
                                                fill="none"
                                                strokeOpacity="0.4"
                                                filter="url(#glow)"
                                                className="transition-all duration-300 ease-in-out"
                                                style={{ transform: `translateY(50%)` }} 
                                            />
                                         )}
                                         
                                         {/* 1. Base Gradient Path (Structure) */}
                                         <path 
                                            d={d}
                                            stroke={`url(#${gradId})`}
                                            strokeWidth={isHovered ? 3 : 2}
                                            strokeLinecap="round"
                                            fill="none"
                                            markerEnd={`url(#${markerId})`}
                                            className="transition-all duration-300 ease-in-out"
                                            style={{ transform: `translateY(50%)` }} 
                                         />

                                         {/* 2. Animated Flow Overlay (Movement) */}
                                         <path 
                                            d={d}
                                            stroke={solidColor}
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            fill="none"
                                            strokeOpacity={isHovered ? 0.8 : 0} 
                                            strokeDasharray="10 10"
                                            className="pointer-events-none transition-opacity duration-300"
                                            style={{ 
                                                transform: `translateY(50%)`,
                                                animation: 'flowDash 1s linear infinite',
                                                opacity: isHovered ? 1 : 0.2
                                            }} 
                                         />
                                         
                                         {/* Conditional Weight Label */}
                                         {(sourceStep.nextSteps?.length || 0) > 1 && (
                                            <g style={{ transform: `translateY(50%)` }}>
                                                {/* Calculate midpoint for label */}
                                                <rect 
                                                    x={(startX + endX) / 2 - 14} 
                                                    y={diff > 0 ? (absDiff === 1 ? -10 : -(40 + absDiff*10)/2 - 10) : (150 + absDiff*15)/2 - 10}
                                                    width="28" height="16" rx="4" fill="#1e293b" stroke={solidColor} strokeWidth="1"
                                                />
                                                <text
                                                    x={(startX + endX) / 2} 
                                                    y={diff > 0 ? (absDiff === 1 ? 2 : -(40 + absDiff*10)/2 + 2) : (150 + absDiff*15)/2 + 2}
                                                    textAnchor="middle"
                                                    fontSize="9"
                                                    fill={solidColor}
                                                    fontWeight="bold"
                                                >
                                                    {Math.round(weight)}%
                                                </text>
                                            </g>
                                         )}
                                     </g>
                                 );
                             });
                        })}
                    </svg>

                    {/* RENDER CARDS */}
                    {simulationResults.steps.map((step, index) => (
                            <FunnelStepCard 
                                key={step.id} 
                                step={step} 
                                allSteps={simulationResults.steps}
                                index={index} 
                                onUpdate={handleUpdateStep}
                                onDelete={handleDeleteStep}
                                onDuplicate={handleDuplicateStep}
                                onMove={handleMoveStep}
                                onPreview={setPreviewUrl}
                                onHover={setHoveredStepId}
                                isFirst={index === 0}
                                isLast={index === simulationResults.steps.length - 1}
                            />
                        ))}

                        {/* Add Step Placeholder */}
                        <div className="flex flex-col items-center justify-center shrink-0 z-10">
                            <button 
                                onClick={() => setShowToolbox(true)}
                                className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/10 text-slate-600 hover:text-indigo-400 transition-all flex items-center justify-center group"
                            >
                                <Plus size={24} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <span className="mt-2 text-xs font-medium text-slate-600 uppercase tracking-wide">Add Node</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Toolbox Overlay */}
            {showToolbox && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
                    <div className="relative">
                        <button onClick={() => setShowToolbox(false)} className="absolute -top-12 right-0 p-2 bg-white/10 rounded-full text-slate-300 hover:text-white transition-colors hover:bg-white/20"><X size={20} /></button>
                        <StepToolbox onAddStep={handleAddStep} className="shadow-2xl border-indigo-500/30 bg-[#1e293b] ring-1 ring-white/10 w-[600px] max-w-[90vw]" />
                    </div>
                </div>
            )}
            
            {/* Save Modal */}
            {showSaveModal && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
                    <div className="bg-[#1e293b] w-96 p-6 rounded-xl border border-white/10 shadow-2xl ring-1 ring-black/20">
                        <h3 className="text-lg font-bold text-white mb-1">Save Simulation</h3>
                        <p className="text-sm text-slate-400 mb-4">Give your funnel simulation a memorable name.</p>
                        <input 
                           type="text" 
                           value={saveName}
                           onChange={(e) => setSaveName(e.target.value)}
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white mb-4 focus:border-indigo-500 focus:outline-none"
                           placeholder="e.g. Q4 Webinar Campaign"
                           autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowSaveModal(false)} className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleSaveConfirm} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg font-medium transition-colors">Save Funnel</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* URL Preview Modal */}
            {previewUrl && (
                <UrlPreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
            )}

            {/* Canvas Instructions */}
            {steps.length > 0 && (
                <div className="absolute bottom-6 right-6 pointer-events-none opacity-40 bg-black/40 backdrop-blur p-2 rounded-lg text-[10px] text-slate-300 border border-white/5 flex items-center gap-2">
                    <MousePointer2 size={12}/> Scroll or Drag to Navigate
                </div>
            )}

            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

        </div>
      </div>
    </div>
  );
};

export default App;