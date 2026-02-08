"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
      onClick={() => void signOut()}
    >
      Sign out
    </button>
  );
}