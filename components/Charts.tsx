import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartDataPoint } from '../types';

interface Props {
  data: ChartDataPoint[];
}

const Charts: React.FC<Props> = ({ data }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Revenue Accumulation Chart */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/5 shadow-lg backdrop-blur-sm">
        <h3 className="text-slate-500 font-bold mb-4 text-[10px] uppercase tracking-widest">Revenue Growth</h3>
        <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} tick={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '10px', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cum. Rev']}
                />
                <Area type="monotone" dataKey="cumulativeRevenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Step Profitability Chart */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/5 shadow-lg backdrop-blur-sm">
        <h3 className="text-slate-500 font-bold mb-4 text-[10px] uppercase tracking-widest">Step Profitability</h3>
        <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} tick={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                cursor={{fill: '#334155', opacity: 0.2}}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '10px', borderRadius: '8px' }}
                />
                <Bar dataKey="revenue" name="Rev" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Net" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;