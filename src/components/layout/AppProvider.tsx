"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language } from "@/types/project";
import { dictionary } from "@/lib/i18n/dictionary";

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

interface AppContextType {
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
  toast: { message: string; type: "success" | "error" | "info" } | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
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
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3800);
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
        toast,
        showToast,
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-lg border border-white/10 bg-[#171a26] px-4 py-3 text-sm font-medium text-white shadow-2xl no-print">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              toast.type === "error"
                ? "bg-red-500"
                : toast.type === "info"
                ? "bg-indigo-400"
                : "bg-emerald-400"
            }`}
          />
          <span>{toast.message}</span>
        </div>
      )}

      {/* AI Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm no-print">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#11131c] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  AI Strategist Engine Configuration
                </h3>
                <p className="text-xs text-slate-400">
                  Configure your LLM provider or use the built-in Deterministic Strategist Engine.
                </p>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400">
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
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="auto">
                    Auto (Use Live API Key if provided, fallback to Built-in Strategist Engine)
                  </option>
                  <option value="gemini">Google Gemini API (Live LLM)</option>
                  <option value="openai">OpenAI / OpenRouter Compatible API (Live LLM)</option>
                  <option value="local">
                    Built-In Deterministic AI Strategist (Development Mode — No Key Needed)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400">
                  API Key (Optional — Never stored in frontend code; passed securely per request)
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy... or sk-..."
                  value={aiConfig.apiKey}
                  onChange={(e) =>
                    setAiConfigState({ ...aiConfig, apiKey: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Leave blank to use server `.env` (`GEMINI_API_KEY` / `OPENAI_API_KEY`) or the built-in Context-Aware AI Strategist Engine. Step 4 Research always queries live public OpenAlex, Crossref, and Wikipedia APIs directly.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400">
                  Target Model Name
                </label>
                <input
                  type="text"
                  value={aiConfig.model}
                  onChange={(e) =>
                    setAiConfigState({ ...aiConfig, model: e.target.value })
                  }
                  placeholder="gemini-2.5-flash"
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setAiConfig(aiConfig);
                  setIsSettingsOpen(false);
                }}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
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
