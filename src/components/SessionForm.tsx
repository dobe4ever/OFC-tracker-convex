import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface SessionFormProps {
  currentUser: string;
  onClose: () => void;
}

export function SessionForm({ currentUser, onClose }: SessionFormProps) {
  const [formData, setFormData] = useState({
    rakePercent: 4,
    tableSize: 2,
    startStack: 400,
    endStack: 400,
    handsPlayed: 0,
  });

  const addSession = useMutation(api.poker.addSession);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSession({ ...formData, user: currentUser });
      toast.success("Session recorded");
      onClose();
    } catch (error) {
      toast.error("Failed to save session");
    }
  };

  const handleChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Rake %</label>
          <input type="number" value={formData.rakePercent} onChange={(e) => handleChange("rakePercent", Number(e.target.value))} className="auth-input-field !py-2 !text-sm" min="0" max="100" step="0.1" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Stake</label>
          <select value={formData.tableSize} onChange={(e) => handleChange("tableSize", Number(e.target.value))} className="auth-input-field !py-2 !text-sm appearance-none">
            {[1, 2, 5, 10, 25].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Start Stack</label>
          <input type="number" value={formData.startStack} onChange={(e) => handleChange("startStack", Number(e.target.value))} className="auth-input-field !py-2 !text-sm" min="0" step="any" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">End Stack</label>
          <input type="number" value={formData.endStack} onChange={(e) => handleChange("endStack", Number(e.target.value))} className="auth-input-field !py-2 !text-sm" min="0" step="any" />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hands Played</label>
        <input type="number" value={formData.handsPlayed} onChange={(e) => handleChange("handsPlayed", Number(e.target.value))} className="auth-input-field !py-2 !text-sm" min="0" />
      </div>

      <div className="pt-2 flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50 transition-colors">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm">Save Session</button>
      </div>
    </form>
  );
}