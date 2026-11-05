"use client";

import React, { useState } from "react";
import { Project } from "@/types/project";
import {
  Scale,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronUp,
  History,
  CheckCircle2,
  X,
} from "lucide-react";

interface JudgeScorePanelProps {
  project: Project;
  onJumpToStep?: (step: number) => void;
}

export function JudgeScorePanel({
  project,
  onJumpToStep,
}: JudgeScorePanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const score = project.judgeScore;

  const scoreColor =
    score.overallScore >= 80
      ? "text-emerald-400"
      : score.overallScore >= 60
      ? "text-indigo-400"
      : "text-amber-400";

  const panelContent = (
    <div className="flex flex-col space-y-5">
      {/* Header */}
      <div className="border-b border-white/10 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Judge Score Engine
            </h3>
          </div>
          <span className="rounded bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
            Live Weighted
          </span>
        </div>
        <p className="mt-1 text-[11px] font-medium text-indigo-300">
          AI Estimated Competition Readiness Score
        </p>
      </div>

      {/* Overall Score Card */}
      <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-[#16192b] to-[#0f111c] p-4 shadow-inner">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">
              Overall Potential Score
            </div>
            <div className={`mt-1 text-3xl font-extrabold ${scoreColor}`}>
              {score.overallScore.toFixed(2)}
              <span className="text-xs font-normal text-slate-400"> / 100</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">
              Completion
            </div>
            <div className="mt-1 text-sm font-bold text-white">
              {project.completionPercentage}%
            </div>
          </div>
        </div>

        {/* Weakest Category Highlight */}
        <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-[#090a0f]/70 px-3 py-2 text-xs">
          <span className="text-slate-400">Weakest Category:</span>
          <span className="font-semibold text-amber-300">
            {score.weakestCategory}
          </span>
        </div>
      </div>

      {/* Confidence / Insufficient Data Warning */}
      {score.confidenceWarning && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] leading-relaxed text-amber-200">
          <div className="flex items-center gap-1.5 font-semibold text-amber-300">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>Confidence & Data Notice</span>
          </div>
          <p className="mt-1">{score.confidenceWarning}</p>
        </div>
      )}

      {/* Weighted Category Breakdown */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>Category Breakdown</span>
          <span>Score × Weight</span>
        </div>

        <div className="mt-2.5 space-y-2.5">
          {score.categories.map((cat) => {
            const isExpanded = expandedCat === cat.category;
            const barColor =
              cat.rawScore >= 80
                ? "bg-emerald-500"
                : cat.rawScore >= 60
                ? "bg-indigo-500"
                : "bg-amber-500";

            return (
              <div
                key={cat.category}
                className="rounded-xl border border-white/10 bg-[#090a0f] p-3 transition hover:border-white/20"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedCat(isExpanded ? null : cat.category)
                  }
                  className="flex w-full items-center justify-between text-left"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white">
                        {cat.category}
                      </span>
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400">
                        {cat.weight}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-xs font-bold text-white">
                        {cat.rawScore}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {" "}
                        ({cat.weightedScore.toFixed(1)} pts)
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    )}
                  </div>
                </button>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-300`}
                    style={{ width: `${cat.rawScore}%` }}
                  />
                </div>

                <div className="mt-2 text-[11px] leading-relaxed text-slate-400">
                  {isExpanded
                    ? cat.reasoning
                    : `${cat.reasoning.slice(0, 85)}${
                        cat.reasoning.length > 85 ? "..." : ""
                      }`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Improvement Suggestions */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Actionable Improvements</span>
        </div>
        {score.improvementSuggestions.length === 0 ? (
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
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
                  className="rounded-lg border border-white/10 bg-[#090a0f] p-2.5 text-[11px] text-slate-300"
                >
                  <div>• {sug}</div>
                  {targetStep && onJumpToStep && (
                    <button
                      type="button"
                      onClick={() => {
                        onJumpToStep(targetStep);
                        setMobileOpen(false);
                      }}
                      className="mt-1.5 text-[10px] font-semibold text-indigo-400 hover:underline"
                    >
                      Go to Step {targetStep} →
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Score History */}
      {project.scoreHistory && project.scoreHistory.length > 0 && (
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <History className="h-3.5 w-3.5" />
            <span>Score History</span>
          </div>
          <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {[...project.scoreHistory]
              .reverse()
              .slice(0, 6)
              .map((entry, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded bg-[#090a0f] px-2.5 py-1.5 text-[11px]"
                >
                  <span className="truncate text-slate-400 max-w-[160px]">
                    {entry.trigger}
                  </span>
                  <span className="font-mono font-semibold text-indigo-300">
                    {entry.overallScore.toFixed(1)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="border-t border-white/10 pt-3 text-[10px] text-slate-500">
        Disclaimer: This is an AI-estimated readiness score based on documented
        project evidence and criteria alignment, not an official competition
        verdict.
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Right Panel */}
      <aside className="hidden xl:block w-80 shrink-0 border-l border-white/10 bg-[#11131c] p-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto no-print">
        {panelContent}
      </aside>

      {/* Mobile / Tablet Floating Drawer Trigger */}
      <div className="xl:hidden fixed bottom-5 left-5 z-40 no-print">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 rounded-full border border-indigo-500/40 bg-[#131626] px-4 py-2.5 text-xs font-bold text-white shadow-2xl"
        >
          <TrendingUp className="h-4 w-4 text-indigo-400" />
          <span>Judge Score: {score.overallScore.toFixed(1)}/100</span>
        </button>
      </div>

      {/* Mobile Collapsible Drawer */}
      {mobileOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm no-print">
          <div className="h-full w-full max-w-sm overflow-y-auto border-l border-white/10 bg-[#11131c] p-5 shadow-2xl">
            <div className="mb-3 flex justify-end">
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-white/10 p-1.5 text-slate-400 hover:text-white"
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
