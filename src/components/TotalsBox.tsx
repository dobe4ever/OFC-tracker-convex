import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function TotalsBox({ selectedUser, selectedTableSize }: { selectedUser: string, selectedTableSize?: number }) {
  const sessions = useQuery(api.poker.getFilteredSessions, {
    user: selectedUser || undefined,
    tableSize: selectedTableSize,
  });

  if (!sessions) return <div className="h-20 bg-white rounded-xl border border-slate-200 animate-pulse" />;

  const totals = sessions.reduce(
    (acc, s) => ({
      hands: acc.hands + s.handsPlayed,
      profitLoss: acc.profitLoss + s.profitLoss,
      points: acc.points + s.points,
    }),
    { hands: 0, profitLoss: 0, points: 0 }
  );

  const plPer100 = totals.hands > 0 ? (totals.profitLoss / totals.hands) * 100 : 0;
  const pointsPer100 = totals.hands > 0 ? (totals.points / totals.hands) * 100 : 0;

  const stats = [
    { label: "Hands", value: totals.hands.toLocaleString(), color: "text-slate-900" },
    { label: "Win", value: totals.profitLoss.toFixed(0), color: totals.profitLoss >= 0 ? "text-emerald-600" : "text-rose-600" },
    { label: "Win/100", value: plPer100.toFixed(1), color: plPer100 >= 0 ? "text-emerald-600" : "text-rose-600" },
    { label: "Pts/100", value: pointsPer100.toFixed(1), color: pointsPer100 >= 0 ? "text-emerald-600" : "text-rose-600" },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-2 px-4">
      <div className="grid grid-cols-4 gap-2">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{stat.label}</span>
            <span className={`text-base font-bold truncate ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}