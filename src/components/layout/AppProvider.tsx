"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language } from "@/types/project";
import { dictionary } from "@/lib/i18n/dictionary";

export type ThemeMode = "dark" | "light";

interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: string;
  preferredLang: Language;
}

interface AIConfig {
  provider: "auto" | "gemini" | "openai" | "local";
  apiKey: string;
  model: string;
}

export interface WorkspaceHeaderState {
  projectId: string;
  projectTitle: string;
  saving: boolean;
  lastSavedAt: string;
  overallScore?: number;
  onUpdateTitle?: (newTitle: string) => void;
  onQuickExportPdf?: () => void;
  onOpenMobileJudgeDrawer?: () => void;
}

interface AppContextType {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  toggleTheme: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  t: (typeof dictionary)["en"];
  user: UserInfo | null;
  availableUsers: { id: string; name: string; email: string; role: string }[];
  refreshUser: () => Promise<void>;
  switchAccount: (userId: string) => Promise<void>;
  aiConfig: AIConfig;
  setAiConfig: (cfg: AIConfig) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (v: boolean) => void;
  workspaceHeader: WorkspaceHeaderState | null;
  setWorkspaceHeader: React.Dispatch<React.SetStateAction<WorkspaceHeaderState | null>>;
  toast: { message: string; type: "success" | "error" | "info" } | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [lang, setLangState] = useState<Language>("en");
  const [user, setUser] = useState<UserInfo | null>(null);
  const [availableUsers, setAvailableUsers] = useState<
    { id: string; name: string; email: string; role: string }[]
  >([]);
  const [aiConfig, setAiConfigState] = useState<AIConfig>({
    provider: "auto",
    apiKey: "",
    model: "gemini-2.5-flash",
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [workspaceHeader, setWorkspaceHeader] =
    useState<WorkspaceHeaderState | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const applyDomTheme = (mode: ThemeMode) => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (mode === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
      }
    }
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    applyDomTheme(mode);
    localStorage.setItem("ideation_theme", mode);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3600);
  };

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setAvailableUsers(data.availableDemoUsers || []);
      }
    } catch {
      // ignore offline
    }
  };

  const switchAccount = async (userId: string) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "switch", userId }),
    });
    if (res.ok) {
      await refreshUser();
      showToast("Switched active workspace account", "info");
    }
  };

  useEffect(() => {
    refreshUser();
    const savedTheme = localStorage.getItem("ideation_theme") as ThemeMode | null;
    if (savedTheme === "dark" || savedTheme === "light") {
      setThemeState(savedTheme);
      applyDomTheme(savedTheme);
    } else {
      applyDomTheme("dark");
    }

    const savedLang = localStorage.getItem("ideation_lang") as Language | null;
    if (savedLang === "en" || savedLang === "id") {
      setLangState(savedLang);
    }
    const savedAi = localStorage.getItem("ideation_ai_config");
    if (savedAi) {
      try {
        setAiConfigState(JSON.parse(savedAi));
      } catch {
        // ignore
      }
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem("ideation_lang", l);
  };

  const setAiConfig = (cfg: AIConfig) => {
    setAiConfigState(cfg);
    localStorage.setItem("ideation_ai_config", JSON.stringify(cfg));
    showToast("AI Engine configuration saved", "success");
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        lang,
        setLang,
        t: dictionary[lang],
        user,
        availableUsers,
        refreshUser,
        switchAccount,
        aiConfig,
        setAiConfig,
        isSettingsOpen,
        setIsSettingsOpen,
        workspaceHeader,
        setWorkspaceHeader,
        toast,
        showToast,
      }}
    >
      {/* AMBIENT MESH BACKGROUND (Dark & Light Apple Glassmorphism) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-500 bg-[#F2F4F8] dark:bg-[#07080E] no-print"
      >
        {/* Orb 1: Indigo / Soft Indigo */}
        <div
          className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full blur-[140px] transition-all duration-700
          bg-[#C7D2FE] opacity-35 dark:bg-[#4F46E5] dark:opacity-20"
        />
        {/* Orb 2: Electric Violet / Lavender */}
        <div
          className="absolute top-1/4 right-[-120px] h-[560px] w-[560px] rounded-full blur-[140px] transition-all duration-700
          bg-[#E9D5FF] opacity-30 dark:bg-[#7C3AED] dark:opacity-15"
        />
        {/* Orb 3: Cyan / Sky Blue */}
        <div
          className="absolute -bottom-36 left-1/3 h-[500px] w-[500px] rounded-full blur-[140px] transition-all duration-700
          bg-[#BAE6FD] opacity-30 dark:bg-[#06B6D4] dark:opacity-15"
        />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col">{children}</div>

      {/* Global Apple Glass Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-semibold shadow-2xl glass-panel no-print">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              toast.type === "error"
                ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                : toast.type === "info"
                ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            }`}
          />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Apple Glass AI Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md no-print">
          <div className="w-full max-w-lg rounded-2xl p-6 glass-panel">
            <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold">
                  AI Strategist Engine Configuration
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configure your LLM provider or use the built-in Deterministic Strategist Engine.
                </p>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-black/5 dark:text-slate-400 dark:hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  AI Provider Mode
                </label>
                <select
                  value={aiConfig.provider}
                  onChange={(e) =>
                    setAiConfigState({
                      ...aiConfig,
                      provider: e.target.value as AIConfig["provider"],
                    })
                  }
                  className="mt-1.5 w-full text-xs glass-input"
                >
                  <option value="auto" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    Auto (Use Live API Key if provided, fallback to Built-in Strategist Engine)
                  </option>
                  <option value="gemini" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    Google Gemini API (Live LLM)
                  </option>
                  <option value="openai" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    OpenAI / OpenRouter Compatible API (Live LLM)
                  </option>
                  <option value="local" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    Built-In Deterministic AI Strategist (Development Mode — No Key Needed)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  API Key (Optional — Passed securely per request)
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy... or sk-..."
                  value={aiConfig.apiKey}
                  onChange={(e) =>
                    setAiConfigState({ ...aiConfig, apiKey: e.target.value })
                  }
                  className="mt-1.5 w-full text-xs glass-input"
                />
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Leave blank to use server `.env` (`GEMINI_API_KEY` / `OPENAI_API_KEY`) or the built-in Context-Aware AI Strategist Engine. Step 4 Research queries live OpenAlex & Crossref APIs directly.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Target Model Name
                </label>
                <input
                  type="text"
                  value={aiConfig.model}
                  onChange={(e) =>
                    setAiConfigState({ ...aiConfig, model: e.target.value })
                  }
                  placeholder="gemini-2.5-flash"
                  className="mt-1.5 w-full text-xs glass-input"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-200/70 dark:border-white/10 pt-4">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="btn-glass-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setAiConfig(aiConfig);
                  setIsSettingsOpen(false);
                }}
                className="btn-apple-primary text-xs"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
}
