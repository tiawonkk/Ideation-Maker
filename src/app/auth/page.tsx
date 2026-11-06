"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/layout/AppProvider";
import { ShieldCheck, UserCheck, UserPlus, LogIn, Lock } from "lucide-react";

export default function AuthPage() {
  const { user, availableUsers, refreshUser, switchAccount, showToast } =
    useApp();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("valerio@ideationmaker.ai");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          name,
          email,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Authentication failed", "error");
      } else {
        await refreshUser();
        showToast(`Signed in as ${data.user.name}`, "success");
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: Sign In / Register Form */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold">
                {mode === "login"
                  ? "Sign In to Workspace"
                  : "Create Team Account"}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Private hackathon projects are isolated per owner account.
              </p>
            </div>
          </div>

          <div className="mt-6 flex rounded-xl border border-slate-300/80 dark:border-white/10 bg-slate-200/60 dark:bg-black/30 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-lg py-2 transition ${
                mode === "login"
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-600 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-lg py-2 transition ${
                mode === "register"
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-600 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold">
                  Full Name / Team Lead
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Christian Immanuel Valerio"
                  className="mt-1.5 w-full text-sm glass-input"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@team.dev"
                className="mt-1.5 w-full text-sm glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full text-sm glass-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-apple-primary w-full py-3 text-xs font-bold"
            >
              {mode === "login" ? (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>{loading ? "Signing In..." : "Sign In"}</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>{loading ? "Creating..." : "Create Account"}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Active Session & Multi-User Authorization Switcher */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <UserCheck className="h-4 w-4" />
              <span>Active Workspace Session</span>
            </div>
            {user ? (
              <div className="mt-3">
                <div className="text-base font-extrabold">{user.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </div>
                <div className="mt-2 inline-block rounded-lg bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-300">
                  Role: {user.role}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-500">Loading session...</p>
            )}
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Instant Account Switcher (Authorization QA)</span>
            </div>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every project is strictly associated with its owner (`userId`).
              Switch between accounts below to verify that private projects
              cannot be accessed by other users.
            </p>
            <div className="mt-4 space-y-2.5">
              {availableUsers.map((u) => {
                const isActive = user?.id === u.id;
                return (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between rounded-2xl p-3.5 ${
                      isActive
                        ? "border-2 border-indigo-500/60 bg-indigo-500/10"
                        : "glass-card"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{u.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {u.email}
                      </div>
                    </div>
                    {isActive ? (
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={async () => {
                          await switchAccount(u.id);
                          router.push("/dashboard");
                        }}
                        className="btn-glass-secondary px-3 py-1.5 text-xs"
                      >
                        Switch
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
