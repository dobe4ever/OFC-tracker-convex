// import { useQuery } from "convex/react";
// import { api } from "../../convex/_generated/api";
// import { useState } from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, ComposedChart, ReferenceLine } from "recharts";

// export function ProfitLossChart({ selectedUser, selectedTableSize }: { selectedUser: string, selectedTableSize?: number }) {
//   const [period, setPeriod] = useState<"D" | "W" | "M">("D");
  
//   const chartData = useQuery(api.poker.getChartData, {
//     user: selectedUser || undefined,
//     tableSize: selectedTableSize,
//     period,
//   });

//   if (!chartData || chartData.length < 2) {
//     return (
//       <div className="bg-white rounded-xl border border-slate-200 p-6 h-64 flex items-center justify-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
//         Awaiting Data...
//       </div>
//     );
//   }

//   // Add hands data and period change to chart data
//   const enrichedData = chartData.map((d, i) => ({
//     ...d,
//     displayDate: d.date.split('/')[1] + '/' + d.date.split('/')[0],
//     periodChange: i > 0 ? d.profitLoss - chartData[i - 1].profitLoss : 0,
//     hands: d.handsPlayed || 0,
//   }));

//   const CustomTooltip = ({ active, payload }: any) => {
//     if (!active || !payload || !payload[0]) return null;
    
//     const data = payload[0].payload;
//     const totalPL = data.profitLoss;
//     const periodPL = data.periodChange;
    
//     return (
//       <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl border border-slate-700">
//         <div className="text-[10px] text-slate-400 mb-1.5 font-semibold">{data.date}</div>
        
//         <div className="space-y-1">
//           <div className="flex justify-between gap-3 items-center">
//             <span className="text-[10px] text-slate-400">Total:</span>
//             <span className={`text-xs font-bold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//               {totalPL >= 0 ? '+' : ''}{totalPL.toFixed(2)}
//             </span>
//           </div>
          
//           {periodPL !== 0 && (
//             <div className="flex justify-between gap-3 items-center pt-1 border-t border-slate-700">
//               <span className="text-[10px] text-slate-400">Period:</span>
//               <span className={`text-xs font-bold ${periodPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                 {periodPL >= 0 ? '+' : ''}{periodPL.toFixed(2)}
//               </span>
//             </div>
//           )}
          
//           {data.hands > 0 && (
//             <div className="flex justify-between gap-3 items-center">
//               <span className="text-[10px] text-slate-400">Hands:</span>
//               <span className="text-xs font-bold text-blue-400">{data.hands}</span>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//       <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
//         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Profit History</span>
//         <div className="flex bg-slate-100 p-0.5 rounded-md">
//           {(['D', 'W', 'M'] as const).map((p) => (
//             <button
//               key={p}
//               onClick={() => setPeriod(p)}
//               className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all ${
//                 period === p ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
//               }`}
//             >
//               {p}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="p-4">
//         <ResponsiveContainer width="100%" height={240}>
//           <ComposedChart data={enrichedData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
//             <defs>
//               <linearGradient id="colorPL" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
//                 <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
//               </linearGradient>
//             </defs>
            
//             <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            
//             <XAxis 
//               dataKey="displayDate" 
//               tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
//               tickLine={false}
//               axisLine={{ stroke: '#e2e8f0' }}
//               height={40}
//               interval="preserveStartEnd"
//             />
            
//             <YAxis 
//               tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
//               tickLine={false}
//               axisLine={false}
//               width={50}
//               domain={['auto', 'auto']}
//               tickFormatter={(val) => Math.round(val).toString()}
//             />
            
//             <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
//             <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 4" />
            
//             <Bar 
//               dataKey="hands" 
//               fill="#3b82f6" 
//               opacity={0.2} 
//               yAxisId="hands"
//               radius={[4, 4, 0, 0]}
//             />
            
//             <Line 
//               type="monotone" 
//               dataKey="profitLoss" 
//               stroke="#f97316" 
//               strokeWidth={2.5}
//               dot={{ fill: '#fff', stroke: '#f97316', strokeWidth: 2, r: 4 }}
//               activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 3, fill: '#fff' }}
//             />
//           </ComposedChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }



// NEW VERSION WITH RSI STYLE INDICAROR AT THE BOTTOM FOR SHORT TERM PERFORMANCE VS LONG TERM WIN RATE
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, ComposedChart, ReferenceLine } from "recharts";

export function ProfitLossChart({ selectedUser, selectedTableSize }: { selectedUser: string, selectedTableSize?: number }) {
  const [period, setPeriod] = useState<"D" | "W" | "M">("D");
  
  const result = useQuery(api.poker.getChartData, {
    user: selectedUser || undefined,
    tableSize: selectedTableSize,
    period,
  });

  if (!result || !result.chartData || result.chartData.length < 2) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 h- flex items-center justify-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        Awaiting Data...
      </div>
    );
  }

  const { chartData, overallPtsPer100 } = result;

  const enrichedData = chartData.map((d, i) => {
    const periodChange = i > 0 ? d.profitLoss - chartData[i - 1].profitLoss : 0;
    const deviationPercent = overallPtsPer100 !== 0 
      ? ((d.periodPtsPer100 - overallPtsPer100) / overallPtsPer100) * 100 
      : 0;
    
    return {
      ...d,
      displayDate: d.date,
      periodChange,
      hands: d.handsPlayed || 0,
      deviationPercent,
    };
  });

  const PLTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;
    const data = payload[0].payload;
    
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl border border-slate-700">
        <div className="text-[10px] text-slate-400 mb-1.5 font-semibold">{data.date}</div>
        <div className="space-y-1">
          <div className="flex justify-between gap-3 items-center">
            <span className="text-[10px] text-slate-400">Total:</span>
            <span className={`text-xs font-bold ${data.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.profitLoss >= 0 ? '+' : ''}{data.profitLoss.toFixed(2)}
            </span>
          </div>
          {data.periodChange !== 0 && (
            <div className="flex justify-between gap-3 items-center pt-1 border-t border-slate-700">
              <span className="text-[10px] text-slate-400">Period:</span>
              <span className={`text-xs font-bold ${data.periodChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {data.periodChange >= 0 ? '+' : ''}{data.periodChange.toFixed(2)}
              </span>
            </div>
          )}
          {data.hands > 0 && (
            <div className="flex justify-between gap-3 items-center">
              <span className="text-[10px] text-slate-400">Hands:</span>
              <span className="text-xs font-bold text-blue-400">{data.hands}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const DevTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;
    const data = payload[0].payload;
    
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl border border-slate-700">
        <div className="text-[10px] text-slate-400 mb-1.5 font-semibold">{data.date}</div>
        <div className="space-y-1">
          <div className="flex justify-between gap-3 items-center">
            <span className="text-[10px] text-slate-400">Pts/100:</span>
            <span className="text-xs font-bold text-purple-400">
              {data.periodPtsPer100.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between gap-3 items-center pt-1 border-t border-slate-700">
            <span className="text-[10px] text-slate-400">vs Avg:</span>
            <span className={`text-xs font-bold ${data.deviationPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.deviationPercent >= 0 ? '+' : ''}{data.deviationPercent.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between gap-3 items-center">
            <span className="text-[10px] text-slate-400">Expected:</span>
            <span className="text-xs font-bold text-slate-300">
              {overallPtsPer100.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const margin = { top: 5, right: 5, left: 0, bottom: 0 };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Profit History</span>
        <div className="flex bg-slate-100 p-0.5 rounded-md">
          {(['D', 'W', 'M'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all ${
                period === p ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Top Chart - P/L */}
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={enrichedData} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="displayDate" hide />
            <YAxis 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              width={50}
              tickFormatter={(val) => Math.round(val).toString()}
            />
            <Tooltip content={<PLTooltip />} cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 4" />
            <Bar dataKey="hands" fill="#3b82f6" opacity={0.2} yAxisId="hands" radius={[4, 4, 0, 0]} />
            <Line 
              type="monotone" 
              dataKey="profitLoss" 
              stroke="#f97316" 
              strokeWidth={2.5}
              dot={{ fill: '#fff', stroke: '#f97316', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 3, fill: '#fff' }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Bottom Chart - Deviation */}
        <div className="pt-1">
          <ResponsiveContainer width="100%" height={100}>
            <ComposedChart data={enrichedData} margin={margin}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                width={50}
                tickFormatter={(val) => `${val > 0 ? '+' : ''}${val.toFixed(0)}%`}
              />
							
              <Tooltip content={<DevTooltip />} cursor={{ stroke: '#a78bfa', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <ReferenceLine y={0} stroke="#64748b" strokeWidth={2} strokeDasharray="6 6" />
              <Bar dataKey="hands" fill="transparent" opacity={0} />
              <Line 
                type="monotone" 
                dataKey="deviationPercent" 
                stroke="#a78bfa" 
                strokeWidth={2}
                dot={{ fill: '#fff', stroke: '#a78bfa', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: '#a78bfa', strokeWidth: 3, fill: '#fff' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

