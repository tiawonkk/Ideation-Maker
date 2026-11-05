"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./AppProvider";
import {
  Sparkles,
  LayoutDashboard,
  Settings,
  Globe,
  UserCheck,
  ArrowRight,
} from "lucide-react";

export function Navbar() {
  const { lang, setLang, t, user, setIsSettingsOpen, aiConfig } = useApp();
  const pathname = usePathname();

  const hasLiveKey = Boolean(aiConfig.apiKey && aiConfig.provider !== "local");

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090a0f]/90 backdrop-blur-md no-print">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white">
                Hackathon Brief Generator
              </span>
              <span className="ml-1.5 rounded bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                AI V1.0
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                pathname?.startsWith("/dashboard")
                  ? "text-indigo-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              {t.nav.dashboard}
            </Link>
            <Link
              href="/#how-it-works"
              className="text-xs font-medium text-slate-400 transition-colors hover:text-white"
            >
              {t.nav.howItWorks}
            </Link>
            <Link
              href="/#features"
              className="text-xs font-medium text-slate-400 transition-colors hover:text-white"
            >
              {t.nav.features}
            </Link>
            <Link
              href="/#sample-brief"
              className="text-xs font-medium text-slate-400 transition-colors hover:text-white"
            >
              {t.nav.sampleBrief}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language Switcher EN / ID */}
          <button
            onClick={() => setLang(lang === "en" ? "id" : "en")}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#11131c] px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-indigo-500/40 hover:text-white"
            title="Switch Language (English / Bahasa Indonesia)"
          >
            <Globe className="h-3.5 w-3.5 text-indigo-400" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* AI Engine Config Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#11131c] px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-indigo-500/40 hover:text-white"
            title="Configure LLM Provider & API Keys"
          >
            <Settings className="h-3.5 w-3.5 text-violet-400" />
            <span className="hidden sm:inline">{t.nav.aiSettings}</span>
            <span
              className={`h-2 w-2 rounded-full ${
                hasLiveKey ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
          </button>

          {/* User Account Link */}
          <Link
            href="/auth"
            className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-[#11131c] px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-indigo-500/40 hover:text-white lg:flex"
          >
            <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="max-w-[140px] truncate">
              {user ? user.name : t.nav.signIn}
            </span>
          </Link>

          {/* Primary CTA */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-indigo-500/30 transition hover:bg-indigo-500"
          >
            <span>{t.nav.startBuilding}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
