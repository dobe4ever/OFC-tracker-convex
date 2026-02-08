import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function SessionsTable({ selectedUser, selectedTableSize, onUserChange, onTableSizeChange }: any) {
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sessions = useQuery(api.poker.getFilteredSessions, {
    user: selectedUser || undefined,
    tableSize: selectedTableSize,
  });
  const users = useQuery(api.poker.getUniqueUsers);

  if (!sessions || !users) return <div className="p-8 text-center text-xs text-slate-400">Loading sessions...</div>;

  const sortedSessions = [...sessions].sort((a: any, b: any) => {
    const aV = a[sortField];
    const bV = b[sortField];
    return sortDirection === "asc" ? (aV > bV ? 1 : -1) : (aV < bV ? 1 : -1);
  });

  const Header = ({ label, field }: { label: string, field: string }) => (
    <th 
      className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-50 border-b border-slate-100"
      onClick={() => {
        setSortDirection(sortField === field && sortDirection === "asc" ? "desc" : "asc");
        setSortField(field);
      }}
    >
      <div className="flex items-center gap-1">
        {label}
        <span className="text-[8px] opacity-50">{sortField === field ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}</span>
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-bold">Sessions</h2>
        <div className="flex items-center gap-2">
          <select value={selectedUser} onChange={(e) => onUserChange(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 outline-none focus:ring-1 focus:ring-orange-500">
            <option value="">All Users</option>
            {users.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <select value={selectedTableSize || ""} onChange={(e) => onTableSizeChange(e.target.value ? Number(e.target.value) : undefined)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 outline-none focus:ring-1 focus:ring-orange-500">
            <option value="">All Stakes</option>
            {[1, 2, 5, 10, 25].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-spacing-0">
          <thead>
            <tr className="bg-slate-50/30">
              <Header label="Date" field="createdAt" />
              <Header label="User" field="user" />
              {/* <Header label="Rake" field="rakePercent" /> */}
              <Header label="Stake" field="tableSize" />
              <Header label="Hands" field="handsPlayed" />
              <Header label="Win" field="profitLoss" />
              {/* <Header label="Points" field="points" /> */}
              <Header label="Pts/100" field="pointsPer100" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedSessions.map((s) => (
              <tr key={s._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-3 py-2 text-xs text-slate-500 whitespace-nowrap">{new Date(s.createdAt).toLocaleDateString()}</td>
                <td className="px-3 py-2 text-xs font-medium text-slate-700">{s.user}</td>
                {/* <td className="px-3 py-2 text-xs text-slate-500">{s.rakePercent}%</td> */}
                <td className="px-3 py-2 text-xs text-slate-500">{s.tableSize}</td>
                <td className="px-3 py-2 text-xs text-slate-500">{s.handsPlayed}</td>
                <td className={`px-3 py-2 text-xs font-bold ${s.profitLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {s.profitLoss > 0 ? '+' : ''}{s.profitLoss.toFixed(1)}
                </td>
                {/* <td className={`px-3 py-2 text-xs font-medium ${s.points >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {s.points.toFixed(1)}
                </td> */}
                <td className={`px-3 py-2 text-xs font-medium ${s.pointsPer100 >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {s.pointsPer100.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}