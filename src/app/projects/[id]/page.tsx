"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/components/layout/AppProvider";
import { Project } from "@/types/project";
import { JudgeScorePanel } from "@/components/workspace/JudgeScorePanel";
import { CoreWorkflowSteps } from "@/components/workspace/CoreWorkflowSteps";
import { ProductPlanningSteps } from "@/components/workspace/ProductPlanningSteps";
import { FinalBriefWorkspaceStep } from "@/components/workspace/FinalBriefWorkspaceStep";
import {
  CheckCircle2,
  Circle,
  FileText,
  Save,
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

const SIDEBAR_MODULES = [
  { step: 0, label: "Project Overview" },
  { step: 1, label: "1. Theme Analyzer" },
  { step: 2, label: "2. Judge Criteria" },
  { step: 3, label: "3. Problem Discovery" },
  { step: 4, label: "4. Problem Validation" },
  { step: 5, label: "5. Solution Generator" },
  { step: 6, label: "6. Product Design" },
  { step: 7, label: "7. Technical Architecture" },
  { step: 8, label: "8. Development Timeline" },
  { step: 9, label: "9. Competition Deliverables" },
  { step: 10, label: "10. Final Brief" },
];

export default function ProjectWorkspacePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast, aiConfig } = useApp();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [generatingStep, setGeneratingStep] = useState<number | null>(null);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`/api/projects/${params.id}`);
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Unable to load project");
      } else {
        setProject(data.project);
        setActiveStep(data.project.currentStep || 1);
      }
    } catch {
      setAuthError("Network error loading project");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const saveProjectUpdates = useCallback(
    async (
      updates: Partial<Project>,
      triggerLabel?: string,
      silent = false
    ): Promise<Project | null> => {
      if (!project) return null;
      setSaving(true);
      try {
        const res = await fetch(`/api/projects/${project.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...updates,
            currentStep: activeStep > 0 ? activeStep : project.currentStep,
            triggerLabel,
          }),
        });
        const data = await res.json();
        if (res.ok && data.project) {
          setProject(data.project);
          if (!silent) {
            showToast("Progress saved & Judge Score recalculated", "success");
          }
          return data.project;
        } else {
          showToast(data.error || "Failed to save changes", "error");
          return null;
        }
      } finally {
        setSaving(false);
      }
    },
    [project, activeStep, showToast]
  );

  const handleGenerateModule = async (
    stepNumber: number,
    customPayload?: Record<string, unknown>
  ) => {
    if (!project) return;
    setGeneratingStep(stepNumber);
    try {
      // First persist current local state
      const saved = await saveProjectUpdates(
        project,
        `Pre-generation save (Step ${stepNumber})`,
        true
      );
      const currentProj = saved || project;

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: currentProj.id,
          stepNumber,
          aiConfig,
          customPayload,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "AI generation failed", "error");
      } else if (data.project) {
        setProject(data.project);
        showToast(
          `Step ${stepNumber} generated (${data.providerMode})`,
          "success"
        );
      }
    } finally {
      setGeneratingStep(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <div className="h-96 animate-pulse rounded-2xl border border-white/10 bg-[#11131c]" />
      </div>
    );
  }

  if (authError || !project) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-white">
          Workspace Access Restricted
        </h1>
        <p className="mt-2 text-sm text-slate-400">{authError}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/auth"
            className="rounded-xl border border-white/15 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5"
          >
            Switch Account
          </Link>
        </div>
      </div>
    );
  }

  const isStepCompleted = (step: number): boolean => {
    switch (step) {
      case 0:
        return Boolean(project.title);
      case 1:
        return Boolean(project.step1_competition?.analysis);
      case 2:
        return Boolean(project.step2_judgeCriteria?.criteria?.length);
      case 3:
        return Boolean(project.step3_problemDiscovery?.analysis?.problemStatement);
      case 4:
        return (project.step4_evidenceValidation?.evidenceItems?.length || 0) > 0;
      case 5:
        return Boolean(project.step5_solutionGenerator?.selectedSolutionId);
      case 6:
        return (project.step6_productDesign?.features?.length || 0) > 0;
      case 7:
        return Boolean(
          project.step7_technicalArchitecture?.systemArchitecture?.frontend
        );
      case 8:
        return (project.step8_developmentTimeline?.milestones?.length || 0) > 0;
      case 9:
        return (project.step9_deliverables?.items?.length || 0) > 0;
      case 10:
        return Boolean(
          project.step10_finalBrief?.sections?.section1_executiveSummary
        );
      default:
        return false;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#090a0f]">
      {/* LEFT SIDEBAR: 10-STEP NAVIGATION */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-white/10 bg-[#11131c] p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto no-print">
        <div>
          <div className="mb-4 border-b border-white/10 pb-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>All Projects</span>
            </Link>
            <h2 className="mt-2 truncate text-sm font-bold text-white">
              {project.title}
            </h2>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Progress: {project.completionPercentage}%</span>
              <span className="text-emerald-400">
                {saving ? "Saving..." : "Autosaved"}
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {SIDEBAR_MODULES.map((mod) => {
              const active = activeStep === mod.step;
              const done = isStepCompleted(mod.step);
              return (
                <button
                  key={mod.step}
                  type="button"
                  onClick={() => setActiveStep(mod.step)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-medium transition ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="truncate">{mod.label}</span>
                  {done ? (
                    <CheckCircle2
                      className={`h-3.5 w-3.5 shrink-0 ${
                        active ? "text-white" : "text-emerald-400"
                      }`}
                    />
                  ) : (
                    <Circle className="h-3.5 w-3.5 shrink-0 opacity-30" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4 space-y-2">
          <Link
            href={`/projects/${project.id}/brief`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2.5 text-xs font-semibold text-white shadow hover:opacity-95"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Open Final Brief & Export PDF</span>
          </Link>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT */}
      <div className="flex-1 min-w-0 px-4 py-6 sm:px-8">
        {/* Top Mobile Step Selector & Save Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#11131c] p-4 no-print">
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-5 w-5 text-indigo-400 lg:hidden" />
            <select
              value={activeStep}
              onChange={(e) => setActiveStep(Number(e.target.value))}
              className="rounded-lg border border-white/15 bg-[#090a0f] px-3 py-1.5 text-xs font-semibold text-white lg:hidden"
            >
              {SIDEBAR_MODULES.map((m) => (
                <option key={m.step} value={m.step}>
                  {m.label}
                </option>
              ))}
            </select>
            <div className="hidden lg:block">
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                {SIDEBAR_MODULES.find((m) => m.step === activeStep)?.label}
              </div>
              <div className="text-xs text-slate-400">
                {project.step1_competition?.name || "Hackathon Project Strategy"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                saveProjectUpdates(project, `Manual Save (Step ${activeStep})`)
              }
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
            >
              <Save className="h-3.5 w-3.5 text-indigo-400" />
              <span>{saving ? "Saving..." : "Save Progress"}</span>
            </button>

            <Link
              href={`/projects/${project.id}/brief`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Preview & Export PDF</span>
            </Link>
          </div>
        </div>

        {/* MODULE 0: PROJECT OVERVIEW */}
        {activeStep === 0 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
              <h2 className="text-lg font-bold text-white">
                Project Overview & Metadata
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Configure your team metadata for the Final Project Brief cover
                page and review overall completion status.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) =>
                      setProject({ ...project, title: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Project Tagline
                  </label>
                  <input
                    type="text"
                    value={project.tagline}
                    onChange={(e) =>
                      setProject({ ...project, tagline: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={project.teamName}
                    onChange={(e) =>
                      setProject({ ...project, teamName: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Prepared By (Lead Author)
                  </label>
                  <input
                    type="text"
                    value={project.preparedBy}
                    onChange={(e) =>
                      setProject({ ...project, preparedBy: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    saveProjectUpdates(project, "Project Overview Updated")
                  }
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  Save Overview
                </button>
              </div>
            </div>

            {/* 10-Step Status Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {SIDEBAR_MODULES.slice(1).map((mod) => {
                const done = isStepCompleted(mod.step);
                return (
                  <button
                    key={mod.step}
                    type="button"
                    onClick={() => setActiveStep(mod.step)}
                    className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#11131c] p-4 text-left hover:border-indigo-500/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-400">
                        STEP {mod.step}
                      </span>
                      {done ? (
                        <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                          Complete
                        </span>
                      ) : (
                        <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-xs font-semibold text-white">
                      {mod.label.replace(/^\d+\.\s*/, "")}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEPS 1 TO 5: CORE WORKFLOW */}
        {activeStep >= 1 && activeStep <= 5 && (
          <CoreWorkflowSteps
            project={project}
            setProject={setProject}
            activeStep={activeStep}
            onSave={saveProjectUpdates}
            onGenerate={handleGenerateModule}
            generatingStep={generatingStep}
          />
        )}

        {/* STEPS 6 TO 9: PRODUCT & TECHNICAL PLANNING */}
        {activeStep >= 6 && activeStep <= 9 && (
          <ProductPlanningSteps
            project={project}
            setProject={setProject}
            activeStep={activeStep}
            onSave={saveProjectUpdates}
            onGenerate={handleGenerateModule}
            generatingStep={generatingStep}
          />
        )}

        {/* STEP 10: FINAL BRIEF WORKSPACE MODULE */}
        {activeStep === 10 && (
          <FinalBriefWorkspaceStep
            project={project}
            setProject={setProject}
            onSave={saveProjectUpdates}
            onGenerate={handleGenerateModule}
            generatingStep={generatingStep}
          />
        )}

        {/* Bottom Step Navigation Bar */}
        <div className="mt-8 flex items-center justify-between rounded-xl border border-white/10 bg-[#11131c] p-4 no-print">
          <button
            type="button"
            disabled={activeStep <= 0}
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 disabled:opacity-40"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Previous Step</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Step {activeStep} of 10</span>
          </div>

          {activeStep < 10 ? (
            <button
              type="button"
              onClick={async () => {
                await saveProjectUpdates(
                  project,
                  `Step ${activeStep} Auto-saved`,
                  true
                );
                setActiveStep((s) => Math.min(10, s + 1));
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              <span>Next Step</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <Link
              href={`/projects/${project.id}/brief`}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Full-Screen Brief & Export PDF</span>
            </Link>
          )}
        </div>
      </div>

      {/* RIGHT STICKY PANEL: JUDGE SCORE ENGINE */}
      <JudgeScorePanel
        project={project}
        onJumpToStep={(step) => setActiveStep(step)}
      />
    </div>
  );
}
