import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const addSession = mutation({
  args: {
    user: v.string(),
    rakePercent: v.number(),
    tableSize: v.number(),
    startStack: v.number(),
    endStack: v.number(),
    handsPlayed: v.number(),
  },
  handler: async (ctx, args) => {
    // Calculate profit/loss
    const profitLoss = args.endStack - args.startStack;

    // Calculate points (convert chips to points accounting for rake)
    let points: number;
    if (profitLoss >= 0) {
      // Positive P/L: rake applies
      const rakeMultiplier = args.tableSize * (1 - args.rakePercent / 100);
      points = profitLoss / rakeMultiplier;
    } else {
      // Negative P/L: no rake
      points = profitLoss / args.tableSize;
    }

    // Calculate points per 100
    const pointsPer100 = (points / args.handsPlayed) * 100;

    const sessionId = await ctx.db.insert("pokerSessions", {
      user: args.user,
      rakePercent: args.rakePercent,
      tableSize: args.tableSize,
      startStack: args.startStack,
      endStack: args.endStack,
      handsPlayed: args.handsPlayed,
      profitLoss,
      points,
      pointsPer100,
      createdAt: Date.now(),
    });
    
    return sessionId;
  },
});

export const getAllSessions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pokerSessions").order("desc").collect();
  },
});

export const getFilteredSessions = query({
  args: {
    user: v.optional(v.string()),
    tableSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.user && args.tableSize !== undefined) {
      return await ctx.db
        .query("pokerSessions")
        .withIndex("by_user_and_table_size", (q) => 
          q.eq("user", args.user!).eq("tableSize", args.tableSize!)
        )
        .order("desc")
        .collect();
    } else if (args.user) {
      return await ctx.db
        .query("pokerSessions")
        .withIndex("by_user", (q) => q.eq("user", args.user!))
        .order("desc")
        .collect();
    } else if (args.tableSize !== undefined) {
      return await ctx.db
        .query("pokerSessions")
        .withIndex("by_table_size", (q) => q.eq("tableSize", args.tableSize!))
        .order("desc")
        .collect();
    }
    
    return await ctx.db.query("pokerSessions").order("desc").collect();
  },
});

export const getUniqueUsers = query({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db.query("pokerSessions").collect();
    const users = [...new Set(sessions.map(session => session.user))];
    return users.sort();
  },
});

export const getChartData = query({
  args: { 
    user: v.optional(v.string()), 
    tableSize: v.optional(v.number()),
    period: v.string() // "D", "W", "M"
  },
  handler: async (ctx, args) => {
    let sessions = await ctx.db.query("pokerSessions").order("asc").collect();
    if (args.user) sessions = sessions.filter((s) => s.user === args.user);
    if (args.tableSize) sessions = sessions.filter((s) => s.tableSize === args.tableSize);

    if (sessions.length === 0) return { chartData: [], overallPtsPer100: 0 };

    // Calculate overall pts/100 across all filtered sessions
    const totalPoints = sessions.reduce((sum, s) => sum + s.points, 0);
    const totalHands = sessions.reduce((sum, s) => sum + s.handsPlayed, 0);
    const overallPtsPer100 = totalHands > 0 ? (totalPoints / totalHands) * 100 : 0;

    // Group sessions by period and aggregate profitLoss, handsPlayed, and points
    const grouped = new Map<string, { profitLoss: number; handsPlayed: number; points: number }>();
    
    sessions.forEach(s => {
      const date = new Date(s.createdAt);
      let key: string;
      
      if (args.period === "M") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
      } else if (args.period === "W") {
        const day = date.getDay();
        const diff = date.getDate() - day;
        const startOfWeek = new Date(date.setDate(diff));
        key = startOfWeek.toISOString().split('T')[0];
      } else {
        key = date.toISOString().split('T')[0];
      }
      
      const existing = grouped.get(key) || { profitLoss: 0, handsPlayed: 0, points: 0 };
      grouped.set(key, {
        profitLoss: existing.profitLoss + s.profitLoss,
        handsPlayed: existing.handsPlayed + s.handsPlayed,
        points: existing.points + s.points,
      });
    });

    // Only include periods with actual data (no filling gaps)
    const sortedKeys = Array.from(grouped.keys()).sort();
    let cumulativePL = 0;
    const chartData: Array<{ 
      date: string; 
      fullDate: string; 
      profitLoss: number; 
      handsPlayed: number;
      periodPtsPer100: number;
    }> = [];

    sortedKeys.forEach(key => {
      const data = grouped.get(key)!;
      cumulativePL += data.profitLoss;
      
      const date = new Date(key);
      const displayDate = `${date.getMonth() + 1}/${date.getDate()}`;
      
      // Calculate pts/100 for this specific period
      const periodPtsPer100 = data.handsPlayed > 0 ? (data.points / data.handsPlayed) * 100 : 0;
      
      chartData.push({
        date: displayDate,
        fullDate: key,
        profitLoss: cumulativePL,
        handsPlayed: data.handsPlayed,
        periodPtsPer100: periodPtsPer100,
      });
    });

    return { chartData, overallPtsPer100 };
  },
});