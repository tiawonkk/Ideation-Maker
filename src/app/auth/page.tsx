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
        <div className="rounded-2xl border border-white/10 bg-[#11131c] p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                {mode === "login"
                  ? "Sign In to Workspace"
                  : "Create Team Account"}
              </h1>
              <p className="text-xs text-slate-400">
                Private hackathon projects are isolated per owner account.
              </p>
            </div>
          </div>

          <div className="mt-6 flex rounded-lg border border-white/10 bg-[#090a0f] p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-md py-2 transition ${
                mode === "login"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-md py-2 transition ${
                mode === "register"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Full Name / Team Lead
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Christian Immanuel Valerio"
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@team.dev"
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
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
          <div className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <UserCheck className="h-4 w-4" />
              <span>Active Workspace Session</span>
            </div>
            {user ? (
              <div className="mt-3">
                <div className="text-base font-bold text-white">{user.name}</div>
                <div className="text-xs text-slate-400">{user.email}</div>
                <div className="mt-2 inline-block rounded bg-indigo-500/15 px-2 py-0.5 text-[11px] font-medium text-indigo-300">
                  Role: {user.role}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-400">Loading session...</p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Instant Account Switcher (Authorization QA)</span>
            </div>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
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
                    className={`flex items-center justify-between rounded-xl border p-3 ${
                      isActive
                        ? "border-indigo-500/50 bg-indigo-500/10"
                        : "border-white/10 bg-[#090a0f]"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {u.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </div>
                    {isActive ? (
                      <span className="rounded bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={async () => {
                          await switchAccount(u.id);
                          router.push("/dashboard");
                        }}
                        className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-600"
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
