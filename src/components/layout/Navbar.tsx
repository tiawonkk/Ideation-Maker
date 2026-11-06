"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./AppProvider";
import {
  Sparkles,
  LayoutDashboard,
  Settings,
  ArrowRight,
  Sun,
  Moon,
  Download,
  Check,
  Edit2,
  Scale,
} from "lucide-react";

export function Navbar() {
  const {
    theme,
    toggleTheme,
    lang,
    setLang,
    t,
    user,
    setIsSettingsOpen,
    aiConfig,
    workspaceHeader,
  } = useApp();
  const pathname = usePathname();
  const isWorkspace = pathname?.startsWith("/projects/");

  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  const hasLiveKey = Boolean(aiConfig.apiKey && aiConfig.provider !== "local");

  const startEditTitle = () => {
    if (!workspaceHeader) return;
    setTempTitle(workspaceHeader.projectTitle);
    setEditingTitle(true);
  };

  const commitTitle = () => {
    if (workspaceHeader?.onUpdateTitle && tempTitle.trim()) {
      workspaceHeader.onUpdateTitle(tempTitle.trim());
    }
    setEditingTitle(false);
  };

  const initials = (user?.name || "Christian Immanuel Valerio")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 h-16 w-full glass-panel border-t-0 border-x-0 rounded-none no-print">
      <div className="mx-auto flex h-full max-w-[1920px] items-center justify-between px-4 sm:px-6">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-600 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_4px_12px_rgba(79,70,229,0.35)]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold tracking-tight">
                IdeationMaker
              </span>
              <span className="ml-1.5 rounded-md bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-300 border border-indigo-500/25">
                AI V1.0
              </span>
            </div>
          </Link>

          {/* CONTEXT-AWARE: WORKSPACE BREADCRUMB vs MARKETING NAV */}
          {isWorkspace && workspaceHeader ? (
            <div className="flex items-center gap-2 text-xs min-w-0 pl-2 border-l border-slate-300/70 dark:border-white/10">
              <Link
                href="/dashboard"
                className="font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition shrink-0"
              >
                Dashboard
              </Link>
              <span className="text-slate-400 dark:text-slate-600">/</span>

              {/* Editable Project Title Badge */}
              {editingTitle ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitTitle();
                      if (e.key === "Escape") setEditingTitle(false);
                    }}
                    autoFocus
                    className="rounded-lg border border-indigo-500 bg-white/90 dark:bg-black/60 px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={commitTitle}
                    className="rounded-lg bg-indigo-600 p-1 text-white hover:bg-indigo-500"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startEditTitle}
                  title="Click to rename project"
                  className="group flex items-center gap-1.5 rounded-lg bg-slate-200/60 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] px-2.5 py-1 font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[160px] sm:max-w-[260px] transition"
                >
                  <span className="truncate">{workspaceHeader.projectTitle}</span>
                  <Edit2 className="h-3 w-3 shrink-0 opacity-40 group-hover:opacity-100 text-indigo-500" />
                </button>
              )}

              {/* Autosave Status Pill with Timestamp */}
              <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 shrink-0">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    workspaceHeader.saving
                      ? "animate-ping bg-amber-400"
                      : "bg-emerald-500"
                  }`}
                />
                <span>
                  {workspaceHeader.saving
                    ? "Autosaving..."
                    : `Saved ${workspaceHeader.lastSavedAt}`}
                </span>
              </div>
            </div>
          ) : (
            <nav className="hidden items-center gap-5 md:flex pl-4">
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                  pathname?.startsWith("/dashboard")
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                {t.nav.dashboard}
              </Link>
              <Link
                href="/#how-it-works"
                className="text-xs font-medium text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                {t.nav.howItWorks}
              </Link>
              <Link
                href="/#features"
                className="text-xs font-medium text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                {t.nav.features}
              </Link>
              <Link
                href="/#sample-brief"
                className="text-xs font-medium text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                {t.nav.sampleBrief}
              </Link>
            </nav>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Mobile Judge Score Drawer Button (Only on <lg inside Workspace) */}
          {isWorkspace && workspaceHeader?.onOpenMobileJudgeDrawer && (
            <button
              type="button"
              onClick={workspaceHeader.onOpenMobileJudgeDrawer}
              className="lg:hidden btn-glass-secondary px-2.5 py-1.5"
              title="Open Judge Score Engine"
            >
              <Scale className="h-3.5 w-3.5 text-indigo-500" />
              <span className="font-bold">
                {(workspaceHeader.overallScore ?? 0).toFixed(0)}
              </span>
            </button>
          )}

          {/* 1. Segmented Language Switcher Toggle: ID | EN */}
          <div className="flex items-center rounded-xl border border-slate-300/80 dark:border-white/[0.1] bg-slate-200/60 dark:bg-black/30 p-0.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setLang("id")}
              className={`rounded-lg px-2 py-1 transition-all ${
                lang === "id"
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-600 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              ID
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-lg px-2 py-1 transition-all ${
                lang === "en"
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-600 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          {/* 2. Theme Toggle Button (Apple-style Sun / Moon) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-glass-secondary p-2"
            title={
              theme === "dark"
                ? "Switch to Apple Light Frosted Glass Mode"
                : "Switch to Apple Dark Glass Mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600" />
            )}
          </button>

          {/* 3. AI Engine Config Button */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="btn-glass-secondary px-3 py-1.5"
            title="Configure LLM Provider & API Keys"
          >
            <Settings className="h-3.5 w-3.5 text-indigo-500 dark:text-violet-400" />
            <span className="hidden md:inline">{t.nav.aiSettings}</span>
            <span
              className={`h-2 w-2 rounded-full ${
                hasLiveKey
                  ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"
                  : "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]"
              }`}
            />
          </button>

          {/* 4. Quick Export PDF Button (When inside Project Workspace) */}
          {isWorkspace && workspaceHeader && (
            <Link
              href={`/projects/${workspaceHeader.projectId}/brief`}
              onClick={() => {
                if (
                  pathname?.endsWith("/brief") &&
                  workspaceHeader.onQuickExportPdf
                ) {
                  workspaceHeader.onQuickExportPdf();
                }
              }}
              className="btn-glass-secondary px-3 py-1.5"
              title="Quick Export A4 PDF Brief"
            >
              <Download className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Export PDF</span>
            </Link>
          )}

          {/* 5. User Profile Pill */}
          <Link
            href="/auth"
            className="flex items-center gap-2 rounded-xl border border-slate-200/90 dark:border-white/[0.1] bg-white/80 dark:bg-white/[0.05] hover:bg-white dark:hover:bg-white/[0.1] px-2.5 py-1 text-xs font-semibold transition"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white shadow-sm">
              {initials}
            </span>
            <span className="hidden xl:inline max-w-[165px] truncate">
              {user ? user.name : "Christian Immanuel Valerio"}
            </span>
          </Link>

          {/* Marketing CTA (ONLY shown outside Workspace) */}
          {!isWorkspace && (
            <Link href="/dashboard" className="btn-apple-primary text-xs py-2 px-4">
              <span>{t.nav.startBuilding}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
