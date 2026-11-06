"use client";

import React, { useState } from "react";
import { Project } from "@/types/project";
import {
  Scale,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  History,
  CheckCircle2,
  X,
  RefreshCw,
  Calculator,
} from "lucide-react";

interface JudgeScorePanelProps {
  project: Project;
  activeStep?: number;
  onJumpToStep?: (step: number) => void;
  onRecalculate?: () => Promise<void>;
  mobileOpen?: boolean;
  setMobileOpen?: (v: boolean) => void;
}

const STEP_BOOST_TIPS: Record<number, string[]> = {
  0: [
    "Set a specific, outcome-driven Project Title and Tagline.",
    "Verify Team Name and Author metadata for the PDF Cover Page.",
    "Proceed to Step 1 to analyze your competition theme.",
  ],
  1: [
    "Specify the exact Sponsor/Target Technology stack to boost Technical alignment.",
    "Include competition constraints or regional focus in Additional Context.",
    "Generate the 7-part Theme Breakdown to unlock Innovation points.",
  ],
  2: [
    "Ensure all judging criterion weights sum to exactly 100%.",
    "Map your highest-weighted criteria (e.g., Innovation & Impact) to core MVP features.",
    "Generate the Strategic Rubric Mapping to prioritize your pitch arc.",
  ],
  3: [
    "Quantify the operational delay or cost in Question #4 (Measurable Impact).",
    "Explain clearly why current workarounds fail under real-world pressure.",
    "Use 'Critique My Problem Statement' to sharpen root-cause clarity.",
  ],
  4: [
    "Attach at least 3 verified external citations (OpenAlex / Crossref / WHO).",
    "Prioritize 'Strong Evidence' sources with peer-reviewed DOIs or official stats.",
    "Maintain a clear distinction between desk research and direct user interviews.",
  ],
  5: [
    "Compare all 3 generated alternatives across Feasibility and Judge Alignment.",
    "Select one winning solution concept to lock in your product direction.",
    "Customize the Competitive Differentiation field to stand out from wrappers.",
  ],
  6: [
    "Keep 'Must Have' MVP features focused on 3–5 buildable capabilities.",
    "Move post-hackathon integrations to 'Won't Have Yet' to boost Feasibility.",
    "Verify the Mermaid User Flow covers the end-to-end happy path.",
  ],
  7: [
    "Specify concrete technologies for Frontend, Backend, DB, and AI Integration.",
    "Document latency and hallucination mitigations in Technical Risks.",
    "Ensure the Mermaid System Architecture diagram reflects your data flow.",
  ],
  8: [
    "Match the roadmap duration (24h, 48h, 2w, 8w) to your actual deadline.",
    "Assign clear responsible roles and completion criteria to every milestone.",
    "Check off completed milestones as your team progresses.",
  ],
  9: [
    "Prioritize all 6 Mandatory Deliverables (Deck, Demo, Code, Repo, Architecture, Validation).",
    "Assign owners and submission buffer deadlines (e.g., H-4 Hours).",
    "Check off completed deliverables to raise your Presentation score.",
  ],
  10: [
    "Resolve any flagged warnings in the Pre-Export Completeness Audit.",
    "Review and refine the Executive Summary and Winning Strategy sections.",
    "Preview and export the A4 PDF document for your submission package.",
  ],
};

export function JudgeScorePanel({
  project,
  activeStep = 1,
  onJumpToStep,
  onRecalculate,
  mobileOpen = false,
  setMobileOpen,
}: JudgeScorePanelProps) {
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [recalcLoading, setRecalcLoading] = useState(false);
  const [showFormula, setShowFormula] = useState(false);

  const score = project.judgeScore;
  const overall = Math.min(100, Math.max(0, score.overallScore || 0));

  // Circular SVG Radial Gauge math
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall / 100) * circumference;

  const gaugeGradientId = "appleFitnessGaugeGradient";
  const currentStepTips = STEP_BOOST_TIPS[activeStep] || STEP_BOOST_TIPS[1];

  const handleRecalcClick = async () => {
    if (!onRecalculate) return;
    setRecalcLoading(true);
    try {
      await onRecalculate();
    } finally {
      setRecalcLoading(false);
    }
  };

  const panelContent = (
    <div className="flex flex-col space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider">
              Judge Score Engine
            </h3>
          </div>
          <p className="mt-0.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-300">
            AI Estimated Competition Readiness Score
          </p>
        </div>

        <button
          type="button"
          onClick={handleRecalcClick}
          disabled={recalcLoading}
          className="btn-glass-secondary px-2.5 py-1.5 text-[11px]"
          title="Recalculate weighted readiness score"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 text-indigo-500 ${
              recalcLoading ? "animate-spin" : ""
            }`}
          />
          <span>{recalcLoading ? "Scoring..." : "Recalculate"}</span>
        </button>
      </div>

      {/* Apple Fitness-Style Radial Gauge Card */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center gap-4">
          {/* SVG Circular Gauge */}
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 124 124">
              <defs>
                <linearGradient id={gaugeGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              {/* Background Track Ring */}
              <circle
                cx="62"
                cy="62"
                r={radius}
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-slate-200 dark:text-white/[0.08]"
              />
              {/* Animated Value Ring */}
              <circle
                cx="62"
                cy="62"
                r={radius}
                stroke={`url(#${gaugeGradientId})`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold tracking-tight">
                {overall.toFixed(1)}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                / 100 pts
              </span>
            </div>
          </div>

          {/* Right Summary Metrics */}
          <div className="flex-1 min-w-0 space-y-2.5">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Workspace Completion
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${project.completionPercentage}%` }}
                  />
                </div>
                <span className="text-xs font-bold">
                  {project.completionPercentage}%
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Weakest Area Alert
              </div>
              <div className="truncate text-xs font-extrabold text-amber-900 dark:text-amber-200">
                {score.weakestCategory}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFormula(!showFormula)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <Calculator className="h-3 w-3" />
              <span>
                {showFormula ? "Hide Calculation Formula" : "View Score Math"}
              </span>
            </button>
          </div>
        </div>

        {/* Explicit Calculation Breakdown */}
        {showFormula && (
          <div className="mt-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100/80 dark:bg-black/40 p-3 text-[11px] font-mono space-y-1">
            <div className="font-sans font-bold text-indigo-600 dark:text-indigo-300 mb-1">
              Formula: Overall = Σ (Raw Score × Weight%)
            </div>
            {score.categories.map((c) => (
              <div key={c.category} className="flex justify-between">
                <span className="truncate max-w-[130px]">{c.category}:</span>
                <span>
                  {c.rawScore} × {c.weight}% ={" "}
                  <strong className="text-indigo-600 dark:text-indigo-300">
                    {c.weightedScore.toFixed(2)}
                  </strong>
                </span>
              </div>
            ))}
            <div className="border-t border-slate-300 dark:border-white/10 pt-1 flex justify-between font-bold">
              <span>Total Readiness Score:</span>
              <span>{overall.toFixed(2)} / 100</span>
            </div>
          </div>
        )}
      </div>

      {/* Weakest Area & Current Step Boost Card */}
      <div className="rounded-2xl border border-indigo-500/25 bg-indigo-500/[0.07] p-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          <span>3 Ways to Boost Score in Step {activeStep}</span>
        </div>
        <ul className="mt-2.5 space-y-2 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
          {currentStepTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
                {idx + 1}
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Individual Criterion Progress Bars */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <span>Rubric Criteria</span>
          <span>Raw × Weight = Pts</span>
        </div>

        <div className="mt-2.5 space-y-2.5">
          {score.categories.map((cat) => {
            const isExpanded = expandedCat === cat.category;
            const barColor =
              cat.rawScore >= 80
                ? "from-emerald-500 to-teal-500"
                : cat.rawScore >= 60
                ? "from-indigo-500 to-violet-500"
                : "from-amber-500 to-orange-500";

            return (
              <div key={cat.category} className="glass-card rounded-xl p-3">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedCat(isExpanded ? null : cat.category)
                  }
                  className="flex w-full items-center justify-between text-left"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="truncate text-xs font-bold">
                      {cat.category}
                    </span>
                    <span className="rounded-md bg-slate-200/80 dark:bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                      {cat.weight}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-mono">
                      <strong className="font-bold">{cat.rawScore}</strong>×
                      {cat.weight}% ={" "}
                      <strong className="text-indigo-600 dark:text-indigo-300">
                        {cat.weightedScore.toFixed(1)}
                      </strong>
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    )}
                  </div>
                </button>

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                    style={{ width: `${cat.rawScore}%` }}
                  />
                </div>

                <div className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {isExpanded
                    ? cat.reasoning
                    : `${cat.reasoning.slice(0, 78)}${
                        cat.reasoning.length > 78 ? "..." : ""
                      }`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Actionable Suggestions */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Cross-Project Priorities
        </div>
        {score.improvementSuggestions.length === 0 ? (
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>
              All core strategic modules and research citations are complete!
            </span>
          </div>
        ) : (
          <ul className="mt-2 space-y-2">
            {score.improvementSuggestions.map((sug, i) => {
              const stepMatch = sug.match(/Step (\d+)/i);
              const targetStep = stepMatch ? Number(stepMatch[1]) : null;
              return (
                <li
                  key={i}
                  className="glass-card rounded-xl p-2.5 text-[11px] text-slate-700 dark:text-slate-300"
                >
                  <div>• {sug}</div>
                  {targetStep && onJumpToStep && (
                    <button
                      type="button"
                      onClick={() => {
                        onJumpToStep(targetStep);
                        setMobileOpen?.(false);
                      }}
                      className="mt-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Jump to Step {targetStep} →
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Confidence / Data Completeness Notice */}
      {score.confidenceWarning && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">
          <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>Confidence & Data Notice</span>
          </div>
          <p className="mt-1">{score.confidenceWarning}</p>
        </div>
      )}

      {/* Score Progression History */}
      {project.scoreHistory && project.scoreHistory.length > 0 && (
        <div className="border-t border-slate-200/70 dark:border-white/10 pt-4">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <History className="h-3.5 w-3.5" />
            <span>Score History</span>
          </div>
          <div className="mt-2 space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {[...project.scoreHistory]
              .reverse()
              .slice(0, 5)
              .map((entry, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-slate-200/50 dark:bg-white/[0.04] px-2.5 py-1.5 text-[11px]"
                >
                  <span className="truncate text-slate-600 dark:text-slate-400 max-w-[175px]">
                    {entry.trigger}
                  </span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-300">
                    {entry.overallScore.toFixed(1)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Locked Right Column (NO floating bottom-left badge!) */}
      <aside className="hidden lg:block w-80 xl:w-96 shrink-0 h-full overflow-y-auto glass-panel border-l border-t-0 border-r-0 border-b-0 rounded-none p-5 no-print">
        {panelContent}
      </aside>

      {/* Mobile / Tablet Slide-Over Drawer (Triggered from Topbar) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm no-print">
          <div className="h-full w-full max-w-sm overflow-y-auto glass-panel rounded-none p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                Judge Score Drawer
              </span>
              <button
                onClick={() => setMobileOpen?.(false)}
                className="btn-glass-secondary p-1.5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {panelContent}
          </div>
        </div>
      )}
    </>
  );
}
