"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
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
  ShieldAlert,
  Sparkles,
  Info,
} from "lucide-react";

const SIDEBAR_MODULES = [
  { step: 0, label: "Project Overview" },
  { step: 1, label: "1. Theme Analyzer" },
  { step: 2, label: "2. Judge Criteria" },
  { step: 3, label: "3. Problem Discovery" },
  { step: 4, label: "4. Evidence Validation" },
  { step: 5, label: "5. Solution Generator" },
  { step: 6, label: "6. Product Design" },
  { step: 7, label: "7. Technical Architecture" },
  { step: 8, label: "8. Development Timeline" },
  { step: 9, label: "9. Competition Deliverables" },
  { step: 10, label: "10. Final Brief" },
];

export default function ProjectWorkspacePage() {
  const params = useParams<{ id: string }>();
  const { showToast, aiConfig, setWorkspaceHeader } = useApp();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [generatingStep, setGeneratingStep] = useState<number | null>(null);
  const [mobileJudgeOpen, setMobileJudgeOpen] = useState(false);

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
    return () => {
      setWorkspaceHeader(null);
    };
  }, [fetchProject, setWorkspaceHeader]);

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
            showToast("Draft saved & Judge Score updated", "success");
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

  const saveRef = useRef(saveProjectUpdates);
  saveRef.current = saveProjectUpdates;
  const projectRef = useRef(project);
  projectRef.current = project;

  // Sync Workspace Topbar state strictly on primitive changes
  const projId = project?.id;
  const projTitle = project?.title;
  const projLastEdited = project?.lastEditedAt;
  const projScore = project?.judgeScore?.overallScore ?? 0;

  useEffect(() => {
    if (!projId || !projTitle) return;
    const timeStr = projLastEdited
      ? new Date(projLastEdited).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Just now";
    setWorkspaceHeader({
      projectId: projId,
      projectTitle: projTitle,
      saving,
      lastSavedAt: timeStr,
      overallScore: projScore,
      onUpdateTitle: (newTitle: string) => {
        if (projectRef.current) {
          saveRef.current(
            { ...projectRef.current, title: newTitle },
            "Project Renamed"
          );
        }
      },
      onOpenMobileJudgeDrawer: () => setMobileJudgeOpen(true),
    });
  }, [projId, projTitle, projLastEdited, projScore, saving, setWorkspaceHeader]);

  const handleGenerateModule = async (
    stepNumber: number,
    customPayload?: Record<string, unknown>
  ) => {
    if (!project) return;
    const targetStep = stepNumber > 0 ? stepNumber : 1;
    setGeneratingStep(targetStep);
    try {
      const saved = await saveProjectUpdates(
        project,
        `Pre-generation save (Step ${targetStep})`,
        true
      );
      const currentProj = saved || project;

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: currentProj.id,
          stepNumber: targetStep,
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
          `Step ${targetStep} generated (${data.providerMode})`,
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
        <div className="h-96 animate-pulse rounded-2xl glass-panel" />
      </div>
    );
  }

  if (authError || !project) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="glass-panel rounded-3xl p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-500">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-bold">
            Workspace Access Restricted
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {authError}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/dashboard" className="btn-apple-primary text-xs">
              Back to Dashboard
            </Link>
            <Link href="/auth" className="btn-glass-secondary">
              Switch Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4-State Step Status Evaluator: Completed | Active | Draft | Not Started
  const getStepState = (
    step: number
  ): "completed" | "draft" | "not_started" => {
    switch (step) {
      case 0:
        return project.title ? "completed" : "draft";
      case 1:
        if (project.step1_competition?.analysis) return "completed";
        if (project.step1_competition?.name || project.step1_competition?.theme)
          return "draft";
        return "not_started";
      case 2:
        if (project.step2_judgeCriteria?.overallInterpretation)
          return "completed";
        if (project.step2_judgeCriteria?.criteria?.length) return "draft";
        return "not_started";
      case 3:
        if (project.step3_problemDiscovery?.analysis?.problemStatement)
          return "completed";
        if (project.step3_problemDiscovery?.whoExperiences) return "draft";
        return "not_started";
      case 4:
        if ((project.step4_evidenceValidation?.evidenceItems?.length || 0) >= 1)
          return "completed";
        if (project.step4_evidenceValidation?.searchQuery) return "draft";
        return "not_started";
      case 5:
        if (project.step5_solutionGenerator?.selectedSolutionId)
          return "completed";
        if ((project.step5_solutionGenerator?.alternatives?.length || 0) > 0)
          return "draft";
        return "not_started";
      case 6:
        if ((project.step6_productDesign?.features?.length || 0) > 0)
          return "completed";
        if (project.step6_productDesign?.productIdentity?.applicationName)
          return "draft";
        return "not_started";
      case 7:
        if (
          project.step7_technicalArchitecture?.systemArchitecture?.frontend &&
          project.step7_technicalArchitecture?.mermaidSystemDiagram
        )
          return "completed";
        if (project.step7_technicalArchitecture?.systemArchitecture?.frontend)
          return "draft";
        return "not_started";
      case 8:
        if ((project.step8_developmentTimeline?.milestones?.length || 0) > 0)
          return "completed";
        return "not_started";
      case 9:
        if (
          project.step9_deliverables?.items?.some((d) => d.completed)
        )
          return "completed";
        if ((project.step9_deliverables?.items?.length || 0) > 0)
          return "draft";
        return "not_started";
      case 10:
        if (project.step10_finalBrief?.sections?.section1_executiveSummary)
          return "completed";
        return "not_started";
      default:
        return "not_started";
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* ==================================================================== */}
      {/* COLUMN 1: LEFT SIDEBAR (w-72 shrink-0 h-full overflow-y-auto)        */}
      {/* ==================================================================== */}
      <aside className="hidden lg:flex w-72 shrink-0 h-full flex-col justify-between overflow-y-auto glass-panel border-r border-t-0 border-l-0 border-b-0 rounded-none p-4 pb-10 no-print">
        <div>
          {/* Sidebar Header */}
          <div className="mb-4 border-b border-slate-200/70 dark:border-white/10 pb-4 space-y-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>

            {/* Overall Completion Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">
                  Overall Progress
                </span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-300">
                  {project.completionPercentage}% Complete
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${project.completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* 10-Step Navigation List with 4 Visual States */}
          <nav className="space-y-1.5">
            {SIDEBAR_MODULES.map((mod) => {
              const isActive = activeStep === mod.step;
              const state = getStepState(mod.step);

              return (
                <button
                  key={mod.step}
                  type="button"
                  onClick={() => setActiveStep(mod.step)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600/90 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_4px_14px_rgba(79,70,229,0.35)] ring-1 ring-indigo-400/50"
                      : "text-slate-700 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isActive && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-white shadow-[0_0_8px_#fff]" />
                    )}
                    <span className="truncate">{mod.label}</span>
                  </div>

                  {/* 4 Visual State Indicators */}
                  {state === "completed" ? (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    </span>
                  ) : state === "draft" ? (
                    <span
                      title="In Progress / Draft"
                      className="flex h-4 w-4 items-center justify-center"
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          isActive ? "bg-amber-300" : "bg-amber-400"
                        }`}
                      />
                    </span>
                  ) : (
                    <Circle
                      className={`h-3.5 w-3.5 shrink-0 ${
                        isActive ? "opacity-60" : "opacity-25"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom PDF Shortcut inside Sidebar (with pb-10 clearance) */}
        <div className="mt-6 border-t border-slate-200/70 dark:border-white/10 pt-4">
          <Link
            href={`/projects/${project.id}/brief`}
            className="btn-apple-primary w-full text-xs"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Full A4 Brief & Export PDF</span>
          </Link>
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* COLUMN 2: CENTER MAIN WORKSPACE (flex-1 h-full flex flex-col)        */}
      {/* ==================================================================== */}
      <div className="flex-1 h-full flex flex-col overflow-hidden min-w-0">
        {/* Mobile Step Dropdown (Only on <lg) */}
        <div className="lg:hidden shrink-0 border-b border-slate-200/70 dark:border-white/10 px-4 py-2.5 glass-panel rounded-none flex items-center justify-between gap-2 no-print">
          <select
            value={activeStep}
            onChange={(e) => setActiveStep(Number(e.target.value))}
            className="flex-1 text-xs font-bold glass-input py-1.5 px-3"
          >
            {SIDEBAR_MODULES.map((m) => (
              <option
                key={m.step}
                value={m.step}
                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
              >
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {/* MODULE 0: PROJECT OVERVIEW */}
          {activeStep === 0 && (
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/70 dark:border-white/10 pb-4">
                  <div>
                    <span className="rounded-lg bg-indigo-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-300 border border-indigo-500/25">
                      WORKSPACE OVERVIEW
                    </span>
                    <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">
                      Project Overview & Cover Page Metadata
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Configure your team identity and inspect completion status
                      across all 10 strategic modules.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold">
                      Project Working Title
                    </label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) =>
                        setProject({ ...project, title: e.target.value })
                      }
                      className="mt-1.5 w-full text-sm glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold">
                      Project Tagline
                    </label>
                    <input
                      type="text"
                      value={project.tagline}
                      onChange={(e) =>
                        setProject({ ...project, tagline: e.target.value })
                      }
                      className="mt-1.5 w-full text-sm glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={project.teamName}
                      onChange={(e) =>
                        setProject({ ...project, teamName: e.target.value })
                      }
                      className="mt-1.5 w-full text-sm glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold">
                      Prepared By (Lead Author)
                    </label>
                    <input
                      type="text"
                      value={project.preparedBy}
                      onChange={(e) =>
                        setProject({ ...project, preparedBy: e.target.value })
                      }
                      className="mt-1.5 w-full text-sm glass-input"
                    />
                  </div>
                </div>
              </div>

              {/* 10-Step Status Overview Cards */}
              <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-5">
                {SIDEBAR_MODULES.slice(1).map((mod) => {
                  const st = getStepState(mod.step);
                  return (
                    <button
                      key={mod.step}
                      type="button"
                      onClick={() => setActiveStep(mod.step)}
                      className="glass-card flex flex-col justify-between rounded-2xl p-4 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                          STEP {mod.step}
                        </span>
                        {st === "completed" ? (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-300">
                            Completed
                          </span>
                        ) : st === "draft" ? (
                          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-300">
                            In Progress
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-200/70 dark:bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            Not Started
                          </span>
                        )}
                      </div>
                      <div className="mt-2.5 text-xs font-bold">
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

          {/* STEP 10: FINAL BRIEF & SPLIT A4 PDF PREVIEW */}
          {activeStep === 10 && (
            <FinalBriefWorkspaceStep
              project={project}
              setProject={setProject}
              onSave={saveProjectUpdates}
              onGenerate={handleGenerateModule}
              generatingStep={generatingStep}
            />
          )}
        </div>

        {/* ================================================================== */}
        {/* STICKY BOTTOM ACTION BAR (h-16 shrink-0 glass-panel border-t)      */}
        {/* ================================================================== */}
        <div className="h-16 shrink-0 glass-panel border-t border-x-0 border-b-0 rounded-none px-4 sm:px-8 flex items-center justify-between z-10 no-print">
          {/* Left: Previous Step */}
          <button
            type="button"
            disabled={activeStep <= 0}
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            className="btn-glass-secondary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Previous Step</span>
          </button>

          {/* Center: Save Draft + Step Indicator */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                saveProjectUpdates(project, `Saved Draft (Step ${activeStep})`)
              }
              disabled={saving}
              className="btn-glass-secondary"
            >
              <Save className="h-3.5 w-3.5 text-indigo-500" />
              <span>{saving ? "Saving..." : "Save Draft"}</span>
            </button>

            <span className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-slate-200/70 dark:bg-white/[0.06] px-3 py-1.5 font-mono text-xs font-bold">
              <Info className="h-3.5 w-3.5 text-indigo-500" />
              <span>Step {activeStep} of 10</span>
            </span>
          </div>

          {/* Right: Generate with AI + Next Step */}
          <div className="flex items-center gap-2.5">
            {activeStep >= 1 && activeStep <= 10 && (
              <button
                type="button"
                onClick={() => handleGenerateModule(activeStep)}
                disabled={generatingStep === activeStep}
                className="btn-apple-primary text-xs py-2 px-4"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  {generatingStep === activeStep
                    ? "Generating..."
                    : "Generate with AI"}
                </span>
              </button>
            )}

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
                className="btn-glass-secondary font-bold"
              >
                <span>Next Step</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Link
                href={`/projects/${project.id}/brief`}
                className="btn-glass-secondary font-bold text-emerald-600 dark:text-emerald-400"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Full PDF View</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* COLUMN 3: RIGHT STICKY PANEL — JUDGE SCORE ENGINE                    */}
      {/* ==================================================================== */}
      <JudgeScorePanel
        project={project}
        activeStep={activeStep}
        onJumpToStep={(step) => setActiveStep(step)}
        onRecalculate={async () => {
          await saveProjectUpdates(project, "Manual Score Recalculation");
        }}
        mobileOpen={mobileJudgeOpen}
        setMobileOpen={setMobileJudgeOpen}
      />
    </div>
  );
}
