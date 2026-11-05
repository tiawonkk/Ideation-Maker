"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/layout/AppProvider";
import { Project } from "@/types/project";
import {
  Plus,
  FolderOpen,
  FileText,
  Copy,
  Trash2,
  Sparkles,
  Clock,
  Scale,
  CheckCircle2,
  Layers,
} from "lucide-react";

const COMPETITION_PRESETS = [
  {
    name: "Gemini API Developer Competition",
    theme: "Multimodal AI for High-Impact Real-World Workflows",
    domain: "Healthcare, Education & Accessibility",
    targetTech: "Google Gemini Multimodal API, Next.js, TypeScript, PostgreSQL",
    description:
      "Build innovative applications leveraging Gemini multimodal reasoning (audio, image, video, text) to solve meaningful human challenges.",
  },
  {
    name: "Microsoft AI Challenge",
    theme: "Enterprise & Public Sector Copilot Innovation",
    domain: "Enterprise Productivity & Cloud AI",
    targetTech: "Azure OpenAI, Next.js, PostgreSQL, Azure App Service",
    description:
      "Design an AI solution that transforms complex organizational workflows with measurable ROI and responsible AI guardrails.",
  },
  {
    name: "GEMASTIK (Divisi Piranti Cerdas / Kota Cerdas)",
    theme: "Inovasi Digital untuk Ketahanan Nasional & Pelayanan Publik",
    domain: "Smart City, Public Service & GovTech Indonesia",
    targetTech: "Next.js, IoT/AI Pipeline, PostgreSQL, Cloud Analytics",
    description:
      "Kembangkan solusi teknologi informasi tervalidasi untuk meningkatkan efisiensi layanan publik dan kesejahteraan masyarakat di Indonesia.",
  },
  {
    name: "PKM-KC (Program Kreativitas Mahasiswa - Karsa Cipta)",
    theme: "Purwarupa Sistem Cerdas Berbasis Riset Ilmiah",
    domain: "Applied Research & Student Innovation",
    targetTech: "AI Vision / NLP, Web Dashboard, Embedded / Cloud API",
    description:
      "Rancang sistem konstruktif berbasis bukti ilmiah (jurnal & data resmi) yang siap diwujudkan menjadi prototipe fungsional.",
  },
  {
    name: "AWS Generative AI Hackathon",
    theme: "Scalable Cloud-Native Agentic Workflows",
    domain: "FinTech, Supply Chain & Developer Tools",
    targetTech: "Amazon Bedrock, Next.js, Serverless API, PostgreSQL",
    description:
      "Build production-grade cloud AI applications using agentic orchestration and verifiable data retrieval.",
  },
  {
    name: "Startup Weekend",
    theme: "54-Hour Validated MVP & Business Model Sprint",
    domain: "B2B SaaS & Consumer Tech",
    targetTech: "Next.js Full-Stack, Stripe/Payments, AI API, PostgreSQL",
    description:
      "Validate a painful customer problem, build a working MVP prototype, and demonstrate clear market viability in one weekend.",
  },
];

export default function DashboardPage() {
  const { t, user, showToast } = useApp();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCompName, setNewCompName] = useState("");
  const [newTheme, setNewTheme] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newTech, setNewTech] = useState("");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, user?.id]);

  const handleCreateProject = async (preset?: (typeof COMPETITION_PRESETS)[0]) => {
    setCreating(true);
    try {
      const payload = preset
        ? {
            title: `${preset.name} Strategy Brief`,
            competitionName: preset.name,
            theme: preset.theme,
            domain: preset.domain,
            targetTech: preset.targetTech,
            description: preset.description,
          }
        : {
            title: newTitle.trim() || "New Hackathon Project Brief",
            competitionName: newCompName.trim(),
            theme: newTheme.trim(),
            domain: newDomain.trim(),
            targetTech: newTech.trim(),
          };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        showToast("Project workspace created!", "success");
        router.push(`/projects/${data.project.id}`);
      } else {
        showToast("Failed to create project", "error");
      }
    } finally {
      setCreating(false);
      setShowCreateModal(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate" }),
    });
    if (res.ok) {
      showToast("Project duplicated successfully", "success");
      fetchProjects();
    } else {
      showToast("Failed to duplicate project", "error");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete project "${title}"? This cannot be undone.`)) {
      return;
    }
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      showToast("Project deleted", "info");
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } else {
      showToast("Failed to delete project", "error");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* WELCOME HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{user ? `Workspace Owner: ${user.name}` : "Workspace"}</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-white">
            {t.dashboard.welcome}
          </h1>
          <p className="mt-1 text-sm text-slate-400">{t.dashboard.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>{t.dashboard.createNew}</span>
          </button>
        </div>
      </div>

      {/* QUICK START PRESETS */}
      <div className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {t.dashboard.quickTemplates}
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COMPETITION_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleCreateProject(preset)}
              disabled={creating}
              className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#11131c] p-4 text-left transition hover:border-indigo-500/50 hover:bg-[#151824]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                    {preset.name}
                  </span>
                  <Plus className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400" />
                </div>
                <div className="mt-1 text-xs font-medium text-white line-clamp-1">
                  {preset.theme}
                </div>
                <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                  {preset.description}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-500">
                Stack: {preset.targetTech}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RECENT PROJECTS GRID */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {t.dashboard.recentProjects} ({projects.length})
          </h2>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-56 animate-pulse rounded-2xl border border-white/10 bg-[#11131c] p-6"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-[#11131c]/60 p-12 text-center">
            <Layers className="mx-auto h-10 w-10 text-indigo-400" />
            <h3 className="mt-3 text-base font-semibold text-white">
              {t.dashboard.noProjects}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Click &ldquo;Create New Project&rdquo; or select a competition
              preset above to launch the 10-step AI workspace.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              <span>{t.dashboard.createNew}</span>
            </button>
          </div>
        ) : (
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            {projects.map((proj) => {
              const statusBadge =
                proj.status === "READY_FOR_PITCH"
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : proj.status === "VALIDATED"
                  ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                  : "bg-amber-500/15 text-amber-300 border-amber-500/30";

              return (
                <div
                  key={proj.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#11131c] p-6 shadow-lg transition hover:border-indigo-500/40"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusBadge}`}
                      >
                        {proj.status.replace(/_/g, " ")}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {t.dashboard.lastEdited}:{" "}
                          {new Date(proj.lastEditedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-white">
                      {proj.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                      {proj.step1_competition?.name
                        ? `${proj.step1_competition.name} — ${proj.step1_competition.theme}`
                        : proj.tagline}
                    </p>

                    {/* Progress & Score Bar */}
                    <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-[#090a0f] p-3.5">
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">
                            {t.dashboard.progress}
                          </span>
                          <span className="font-bold text-white">
                            {proj.completionPercentage}%
                          </span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                            style={{ width: `${proj.completionPercentage}%` }}
                          />
                        </div>
                        <div className="mt-1.5 text-[10px] text-slate-500">
                          Current Step: {proj.currentStep} / 10
                        </div>
                      </div>

                      <div className="border-l border-white/10 pl-4">
                        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-indigo-300">
                          <Scale className="h-3 w-3" />
                          <span>Judge Readiness</span>
                        </div>
                        <div className="mt-1 text-xl font-extrabold text-white">
                          {proj.judgeScore?.overallScore ?? 0}
                          <span className="text-xs font-normal text-slate-400">
                            {" "}
                            / 100
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Weakest: {proj.judgeScore?.weakestCategory || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/projects/${proj.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                      >
                        <FolderOpen className="h-3.5 w-3.5" />
                        <span>{t.dashboard.openWorkspace}</span>
                      </Link>
                      <Link
                        href={`/projects/${proj.id}/brief`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/10"
                      >
                        <FileText className="h-3.5 w-3.5 text-indigo-400" />
                        <span>{t.dashboard.viewBrief}</span>
                      </Link>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDuplicate(proj.id)}
                        className=" inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white"
                        title="Duplicate Project"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">
                          {t.dashboard.duplicate}
                        </span>
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id, proj.title)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-2 text-xs text-red-300 hover:bg-red-500/20"
                        title="Delete Project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE NEW PROJECT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#11131c] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Create New Hackathon Project
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Project Working Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., AgroSense AI — Smart Crop Disease Predictor"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Competition Name
                  </label>
                  <input
                    type="text"
                    value={newCompName}
                    onChange={(e) => setNewCompName(e.target.value)}
                    placeholder="e.g., GEMASTIK / Microsoft AI"
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Competition Domain
                  </label>
                  <input
                    type="text"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="e.g., AgriTech / Healthcare / FinTech"
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Competition Theme
                </label>
                <input
                  type="text"
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  placeholder="e.g., AI for Sustainable Food Security & Climate Resilience"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Target Technology Stack
                </label>
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="e.g., Gemini API, Next.js, PostgreSQL, TensorFlow"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateProject()}
                disabled={creating}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create & Open Workspace"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
