import React from 'react';
import { SimulationTotals } from '../types';
import { TrendingUp, DollarSign, Activity, PieChart, ArrowUpRight } from 'lucide-react';

interface Props {
  totals: SimulationTotals;
}

const StatCard: React.FC<{ label: string; value: string; subValue?: string; icon: React.ReactNode; colorClass: string; bgClass: string }> = ({ label, value, subValue, icon, colorClass, bgClass }) => (
  <div className="bg-white/5 rounded-xl p-4 border border-white/5 shadow-lg backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
    <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${bgClass} opacity-10 rounded-bl-3xl -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
    <div className="flex justify-between items-start mb-2">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{label}</p>
        <div className={`p-1.5 rounded-lg bg-slate-950/50 border border-white/5 ${colorClass}`}>
            {icon}
        </div>
    </div>
    <div>
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        {subValue && (
            <div className={`flex items-center gap-1 text-[10px] font-medium mt-1 ${colorClass}`}>
                {subValue} <ArrowUpRight size={10} />
            </div>
        )}
    </div>
  </div>
);

const StatsPanel: React.FC<Props> = ({ totals }) => {
  const profitColor = totals.totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400';
  const profitBg = totals.totalProfit >= 0 ? 'from-emerald-500 to-teal-500' : 'from-rose-500 to-pink-500';
  
  const roasColor = totals.roas >= 2 ? 'text-indigo-400' : (totals.roas >= 1 ? 'text-amber-400' : 'text-rose-400');
  const roasBg = totals.roas >= 2 ? 'from-indigo-500 to-violet-500' : 'from-amber-500 to-orange-500';

  return (
    <div className="grid grid-cols-1 gap-4">
      <StatCard 
        label="Revenue" 
        value={`$${totals.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        icon={<DollarSign size={14} className="text-emerald-400" />}
        colorClass="text-emerald-400"
        bgClass="from-emerald-500 to-teal-500"
      />
      
      <StatCard 
        label="Cost" 
        value={`$${totals.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        icon={<Activity size={14} className="text-rose-400" />}
        colorClass="text-rose-400"
        bgClass="from-rose-500 to-red-500"
      />
      
      <StatCard 
        label="Net Profit" 
        value={`$${totals.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        subValue={totals.totalProfit > 0 ? "Profit" : "Loss"}
        icon={<TrendingUp size={14} className={profitColor} />}
        colorClass={profitColor}
        bgClass={profitBg}
      />

      <StatCard 
        label="ROAS" 
        value={`${totals.roas.toFixed(2)}x`}
        subValue={`$${totals.epa.toFixed(2)} EPA`}
        icon={<PieChart size={14} className={roasColor} />}
        colorClass={roasColor}
        bgClass={roasBg}
      />
    </div>
  );
};

export default StatsPanel;