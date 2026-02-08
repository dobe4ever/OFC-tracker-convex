import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  pokerSessions: defineTable({
    user: v.string(),
    rakePercent: v.number(),
    tableSize: v.number(),
    startStack: v.number(),
    endStack: v.number(),
    handsPlayed: v.number(),
    profitLoss: v.number(),
    points: v.number(),
    pointsPer100: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["user"])
    .index("by_table_size", ["tableSize"])
    .index("by_created_at", ["createdAt"])
    .index("by_user_and_table_size", ["user", "tableSize"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
