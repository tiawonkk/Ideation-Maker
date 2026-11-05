"use client";

import React, { useState } from "react";
import {
  EvidenceStrength,
  JudgeCriterionItem,
  Project,
  ResearchEvidenceItem,
} from "@/types/project";
import { validateCriteriaWeights } from "@/lib/scoring/judge-engine";
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Search,
  ShieldCheck,
  Award,
  Check,
} from "lucide-react";

interface CoreWorkflowStepsProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  activeStep: number;
  onSave: (
    updates: Partial<Project>,
    triggerLabel?: string,
    silent?: boolean
  ) => Promise<Project | null>;
  onGenerate: (
    stepNumber: number,
    customPayload?: Record<string, unknown>
  ) => Promise<void>;
  generatingStep: number | null;
}

export function CoreWorkflowSteps({
  project,
  setProject,
  activeStep,
  onSave,
  onGenerate,
  generatingStep,
}: CoreWorkflowStepsProps) {
  const [researchLoading, setResearchLoading] = useState(false);
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [newEv, setNewEv] = useState<Partial<ResearchEvidenceItem>>({
    finding: "",
    supportingStatistic: "",
    sourceTitle: "",
    sourceOrganization: "",
    publicationDate: "2024",
    originalSourceUrl: "",
    evidenceType: "Academic Paper",
    relevanceToProblem: "",
    businessOrSocialOpportunity: "",
    evidenceStrength: "Strong Evidence",
  });

  // ============================================================================
  // STEP 1 — COMPETITION THEME ANALYZER
  // ============================================================================
  if (activeStep === 1) {
    const s1 = project.step1_competition;
    const analysis = s1.analysis;

    const updateS1 = (field: keyof typeof s1, value: string) => {
      setProject((prev) =>
        prev
          ? {
              ...prev,
              step1_competition: {
                ...prev.step1_competition,
                [field]: value,
              },
            }
          : prev
      );
    };

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Step 1 of 10
              </span>
              <h2 className="text-xl font-bold text-white">
                Competition Theme Analyzer
              </h2>
              <p className="text-xs text-slate-400">
                Deconstruct your competition theme into industry opportunities,
                technical angles, and judge priorities.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onGenerate(1)}
              disabled={generatingStep === 1}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {generatingStep === 1
                  ? "Analyzing Theme..."
                  : analysis
                  ? "Regenerate Theme Breakdown"
                  : "Analyze Competition Theme"}
              </span>
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Competition Name *
              </label>
              <input
                type="text"
                value={s1.name}
                onChange={(e) => updateS1("name", e.target.value)}
                placeholder="e.g., Gemini API Developer Competition / GEMASTIK"
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Competition Theme *
              </label>
              <input
                type="text"
                value={s1.theme}
                onChange={(e) => updateS1("theme", e.target.value)}
                placeholder="e.g., AI for Social Impact & Accessible Healthcare"
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Competition Domain *
              </label>
              <input
                type="text"
                value={s1.domain}
                onChange={(e) => updateS1("domain", e.target.value)}
                placeholder="e.g., Healthcare, AgriTech, FinTech, Smart City"
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Target Technology *
              </label>
              <input
                type="text"
                value={s1.targetTechnology}
                onChange={(e) => updateS1("targetTechnology", e.target.value)}
                placeholder="e.g., Google Gemini Multimodal API, Next.js, PostgreSQL"
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300">
                Theme Description
              </label>
              <textarea
                rows={2}
                value={s1.description}
                onChange={(e) => updateS1("description", e.target.value)}
                placeholder="Paste the official hackathon prompt or theme description..."
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300">
                Additional Context (Target Geography, Sponsor APIs, Constraints)
              </label>
              <textarea
                rows={2}
                value={s1.additionalContext}
                onChange={(e) => updateS1("additionalContext", e.target.value)}
                placeholder="Any specific constraints, sponsor requirements, or target users..."
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* AI Output Section */}
        {analysis && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-indigo-500/30 bg-[#11131c] p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
                1. Strategic Theme Breakdown
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                {analysis.themeBreakdown}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Relevant Industries */}
              <div className="rounded-2xl border border-white/10 bg-[#11131c] p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  2. Relevant Industries & Why Relevant
                </h4>
                <div className="mt-3 space-y-2.5">
                  {analysis.relevantIndustries.map((ind, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-[#090a0f] p-3 text-xs"
                    >
                      <div className="font-semibold text-white">{ind.name}</div>
                      <div className="mt-1 text-slate-400">
                        <span className="text-indigo-300">Why relevant:</span>{" "}
                        {ind.relevanceWhy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology Opportunities */}
              <div className="rounded-2xl border border-white/10 bg-[#11131c] p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400">
                  4. Technology Opportunities & Why Relevant
                </h4>
                <div className="mt-3 space-y-2.5">
                  {analysis.technologyOpportunities.map((t, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-[#090a0f] p-3 text-xs"
                    >
                      <div className="font-semibold text-white">{t.tech}</div>
                      <div className="mt-1 text-slate-400">
                        <span className="text-violet-300">Why relevant:</span>{" "}
                        {t.opportunityWhy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Challenges & Judge Focus */}
              <div className="rounded-2xl border border-white/10 bg-[#11131c] p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  3. Main Challenges & 6. Judge Focus Areas
                </h4>
                <div className="mt-3 space-y-2 text-xs text-slate-300">
                  <div className="font-semibold text-white">Main Challenges:</div>
                  <ul className="space-y-1 pl-4 list-disc">
                    {analysis.mainChallenges.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                  <div className="pt-2 font-semibold text-white">
                    Judge Focus Areas:
                  </div>
                  <ul className="space-y-1 pl-4 list-disc text-indigo-200">
                    {analysis.judgeFocusAreas.map((j, i) => (
                      <li key={i}>{j}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Potential Problem Areas */}
              <div className="rounded-2xl border border-white/10 bg-[#11131c] p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  5. Potential Problem Areas
                </h4>
                <div className="mt-3 space-y-2.5">
                  {analysis.potentialProblemAreas.map((p, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-[#090a0f] p-3 text-xs"
                    >
                      <div className="font-semibold text-white">{p.area}</div>
                      <div className="mt-1 text-slate-400">
                        {p.relevanceWhy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 7. Recommended Innovation Directions */}
            <div className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                7. Recommended Innovation Directions
              </h4>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {analysis.recommendedInnovationDirections.map((dir, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-indigo-500/25 bg-[#090a0f] p-4 text-xs"
                  >
                    <div className="text-sm font-bold text-white">
                      {dir.title}
                    </div>
                    <p className="mt-1.5 text-slate-300 leading-relaxed">
                      {dir.description}
                    </p>
                    <div className="mt-2 pt-2 border-t border-white/10 text-indigo-300">
                      <strong>Theme Relevance:</strong> {dir.whyRelevant}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // STEP 2 — JUDGE CRITERIA ENGINE
  // ============================================================================
  if (activeStep === 2) {
    const s2 = project.step2_judgeCriteria;
    const validation = validateCriteriaWeights(s2.criteria);

    const updateCriterion = (
      id: string,
      field: keyof JudgeCriterionItem,
      val: string | number
    ) => {
      const updated = s2.criteria.map((c) =>
        c.id === id ? { ...c, [field]: val } : c
      );
      setProject((prev) =>
        prev
          ? {
              ...prev,
              step2_judgeCriteria: {
                ...prev.step2_judgeCriteria,
                criteria: updated,
              },
            }
          : prev
      );
    };

    const addCriterion = () => {
      const newItem: JudgeCriterionItem = {
        id: `crit-${Date.now()}`,
        name: "Custom Criterion",
        weight: 10,
        description: "Custom competition judging dimension",
      };
      setProject((prev) =>
        prev
          ? {
              ...prev,
              step2_judgeCriteria: {
                ...prev.step2_judgeCriteria,
                criteria: [...prev.step2_judgeCriteria.criteria, newItem],
              },
            }
          : prev
      );
    };

    const removeCriterion = (id: string) => {
      if (s2.criteria.length <= 1) return;
      setProject((prev) =>
        prev
          ? {
              ...prev,
              step2_judgeCriteria: {
                ...prev.step2_judgeCriteria,
                criteria: prev.step2_judgeCriteria.criteria.filter(
                  (c) => c.id !== id
                ),
              },
            }
          : prev
      );
    };

    const normalizeTo100 = () => {
      const total = s2.criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
      if (total <= 0) return;
      let running = 0;
      const normalized = s2.criteria.map((c, idx) => {
        if (idx === s2.criteria.length - 1) {
          return { ...c, weight: Math.max(0, Math.round((100 - running) * 10) / 10) };
        }
        const w = Math.round(((Number(c.weight) || 0) / total) * 1000) / 10;
        running += w;
        return { ...c, weight: w };
      });
      setProject((prev) =>
        prev
          ? {
              ...prev,
              step2_judgeCriteria: {
                ...prev.step2_judgeCriteria,
                criteria: normalized,
              },
            }
          : prev
      );
    };

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Step 2 of 10
              </span>
              <h2 className="text-xl font-bold text-white">
                Judge Criteria Engine
              </h2>
              <p className="text-xs text-slate-400">
                Configure custom judging rubric weights (must sum to 100%) and
                map your project capabilities to each criterion.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addCriterion}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/10"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Criterion</span>
              </button>
              <button
                type="button"
                onClick={() => onGenerate(2)}
                disabled={!validation.valid || generatingStep === 2}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  {generatingStep === 2
                    ? "Mapping Criteria..."
                    : "Generate Strategic Rubric Mapping"}
                </span>
              </button>
            </div>
          </div>

          {/* Weight Validation Banner */}
          <div
            className={`mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5 text-xs ${
              validation.valid
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border-amber-500/40 bg-amber-500/10 text-amber-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {validation.valid ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              )}
              <span className="font-semibold">
                Total Rubric Weight: {validation.total}% / 100%
              </span>
              {!validation.valid && <span>— {validation.error}</span>}
            </div>
            {!validation.valid && (
              <button
                type="button"
                onClick={normalizeTo100}
                className="rounded-lg bg-amber-500/20 border border-amber-400/40 px-3 py-1 font-semibold text-amber-200 hover:bg-amber-500/30"
              >
                Auto-Balance to 100%
              </button>
            )}
          </div>

          {/* Criteria List */}
          <div className="mt-5 space-y-3">
            {s2.criteria.map((crit) => (
              <div
                key={crit.id}
                className="rounded-xl border border-white/10 bg-[#090a0f] p-4"
              >
                <div className="grid gap-3 sm:grid-cols-12 items-center">
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400">
                      Criterion Name
                    </label>
                    <input
                      type="text"
                      value={crit.name}
                      onChange={(e) =>
                        updateCriterion(crit.id, "name", e.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#11131c] px-3 py-1.5 text-xs font-semibold text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400">
                      Weight (%)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={crit.weight}
                      onChange={(e) =>
                        updateCriterion(
                          crit.id,
                          "weight",
                          Number(e.target.value)
                        )
                      }
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#11131c] px-3 py-1.5 text-xs font-bold text-indigo-300"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400">
                      Criterion Description
                    </label>
                    <input
                      type="text"
                      value={crit.description}
                      onChange={(e) =>
                        updateCriterion(crit.id, "description", e.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#11131c] px-3 py-1.5 text-xs text-slate-300"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => removeCriterion(crit.id)}
                      disabled={s2.criteria.length <= 1}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* AI Mapped Output for this Criterion */}
                {crit.whatJudgesLookFor && (
                  <div className="mt-3 grid gap-3 border-t border-white/10 pt-3 text-xs sm:grid-cols-3">
                    <div>
                      <span className="font-semibold text-indigo-400">
                        What Judges Look For:
                      </span>
                      <p className="mt-0.5 text-slate-300">
                        {crit.whatJudgesLookFor}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-400">
                        Strategic Recommendation:
                      </span>
                      <p className="mt-0.5 text-slate-300">
                        {crit.strategicRecommendation}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-violet-400">
                        Mapped Project Capability:
                      </span>
                      <p className="mt-0.5 text-slate-300">
                        {crit.mappedCapability}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {s2.overallInterpretation && (
          <div className="rounded-2xl border border-indigo-500/30 bg-[#11131c] p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              AI Strategic Rubric Interpretation & Priority Order
            </h3>
            <p className="mt-2 text-sm text-white">{s2.overallInterpretation}</p>
            {s2.strategicPriorities && (
              <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                {s2.strategicPriorities.map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // STEP 3 — PROBLEM DISCOVERY ENGINE
  // ============================================================================
  if (activeStep === 3) {
    const s3 = project.step3_problemDiscovery;
    const analysis = s3.analysis;

    const updateS3 = (field: keyof typeof s3, value: string) => {
      setProject((prev) =>
        prev
          ? {
              ...prev,
              step3_problemDiscovery: {
                ...prev.step3_problemDiscovery,
                [field]: value,
              },
            }
          : prev
      );
    };

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Step 3 of 10
              </span>
              <h2 className="text-xl font-bold text-white">
                Problem Discovery Engine
              </h2>
              <p className="text-xs text-slate-400">
                Answer the 6 core discovery questions to synthesize a root-cause
                problem statement and target persona.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onGenerate(3)}
              disabled={generatingStep === 3}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {generatingStep === 3
                  ? "Synthesizing Problem..."
                  : "Generate Problem Statement & Persona"}
              </span>
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300">
                1. Who experiences the problem?
              </label>
              <textarea
                rows={2}
                value={s3.whoExperiences}
                onChange={(e) => updateS3("whoExperiences", e.target.value)}
                placeholder="Be specific: e.g., Frontline triage nurses at rural Puskesmas clinics..."
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                2. What is their biggest difficulty?
              </label>
              <textarea
                rows={2}
                value={s3.biggestDifficulty}
                onChange={(e) => updateS3("biggestDifficulty", e.target.value)}
                placeholder="What specific task or decision is slow, error-prone, or painful?"
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                3. How frequently does it happen?
              </label>
              <input
                type="text"
                value={s3.frequency}
                onChange={(e) => updateS3("frequency", e.target.value)}
                placeholder="e.g., Daily — 30 to 60 times per morning shift"
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                4. What is the measurable impact?
              </label>
              <input
                type="text"
                value={s3.impact}
                onChange={(e) => updateS3("impact", e.target.value)}
                placeholder="e.g., 20 minutes wasted per case and delayed emergency referrals"
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                5. What solutions or workarounds do they currently use?
              </label>
              <textarea
                rows={2}
                value={s3.currentWorkarounds}
                onChange={(e) => updateS3("currentWorkarounds", e.target.value)}
                placeholder="e.g., Static 200-page PDF manuals, WhatsApp chats, paper forms"
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                6. Why are existing solutions insufficient?
              </label>
              <textarea
                rows={2}
                value={s3.whyInsufficient}
                onChange={(e) => updateS3("whyInsufficient", e.target.value)}
                placeholder="Why do current tools fail under real-world constraints?"
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* AI Output */}
        {analysis && (
          <div className="space-y-4">
            {/* Structured Problem Statement */}
            <div className="rounded-2xl border border-indigo-500/40 bg-[#11131c] p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Structured Problem Statement (Editable)
                </span>
                <span className="rounded bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-300">
                  Severity: {analysis.problemSeverity}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Format: &ldquo;[Target user] experiences [specific problem]
                because [root cause], resulting in [measurable impact].&rdquo;
              </p>
              <textarea
                rows={3}
                value={analysis.problemStatement}
                onChange={(e) =>
                  setProject((prev) =>
                    prev && prev.step3_problemDiscovery.analysis
                      ? {
                          ...prev,
                          step3_problemDiscovery: {
                            ...prev.step3_problemDiscovery,
                            analysis: {
                              ...prev.step3_problemDiscovery.analysis,
                              problemStatement: e.target.value,
                            },
                          },
                        }
                      : prev
                  )
                }
                className="mt-2 w-full rounded-xl border border-indigo-500/30 bg-[#090a0f] p-3.5 text-sm font-medium text-white"
              />
              <p className="mt-2 text-[11px] text-amber-300">
                {analysis.validationDisclaimer}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Target Persona */}
              <div className="rounded-2xl border border-white/10 bg-[#11131c] p-5 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-indigo-400">
                  Target User Persona
                </h4>
                <div className="mt-3 rounded-xl border border-white/10 bg-[#090a0f] p-4">
                  <div className="text-sm font-bold text-white">
                    {analysis.userPersona.name}
                  </div>
                  <div className="text-indigo-300">
                    {analysis.userPersona.role}
                  </div>
                  <div className="mt-1 text-slate-400">
                    {analysis.userPersona.demographics}
                  </div>
                  <blockquote className="mt-3 border-l-2 border-indigo-500 pl-3 italic text-slate-300">
                    {analysis.userPersona.quote}
                  </blockquote>
                </div>
              </div>

              {/* Root Cause Analysis */}
              <div className="rounded-2xl border border-white/10 bg-[#11131c] p-5 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-emerald-400">
                  Root Cause Analysis & Pain Points
                </h4>
                <ul className="mt-3 space-y-2 text-slate-300">
                  {analysis.rootCauseAnalysis.map((rc, i) => (
                    <li
                      key={i}
                      className="rounded-lg border border-white/10 bg-[#090a0f] p-2.5"
                    >
                      • {rc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // STEP 4 — EVIDENCE VALIDATION ENGINE
  // ============================================================================
  if (activeStep === 4) {
    const s4 = project.step4_evidenceValidation;
    const report = s4.report;

    const handleLiveResearch = async () => {
      setResearchLoading(true);
      try {
        const res = await fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: project.id,
            query: s4.searchQuery,
          }),
        });
        const data = await res.json();
        if (res.ok && data.project) {
          setProject(data.project);
        }
      } finally {
        setResearchLoading(false);
      }
    };

    const handleAddCustomEvidence = async () => {
      if (!newEv.finding || !newEv.sourceTitle || !newEv.originalSourceUrl) {
        return;
      }
      const item: ResearchEvidenceItem = {
        id: `ev-user-${Date.now()}`,
        finding: newEv.finding,
        supportingStatistic:
          newEv.supportingStatistic || "User-verified empirical metric",
        sourceTitle: newEv.sourceTitle,
        sourceOrganization: newEv.sourceOrganization || "Authoritative Source",
        publicationDate: newEv.publicationDate || "2024",
        originalSourceUrl: newEv.originalSourceUrl,
        evidenceType: (newEv.evidenceType as ResearchEvidenceItem["evidenceType"]) || "Academic Paper",
        relevanceToProblem:
          newEv.relevanceToProblem || "Directly validates problem statement.",
        businessOrSocialOpportunity:
          newEv.businessOrSocialOpportunity ||
          "Supports intervention opportunity.",
        evidenceStrength:
          (newEv.evidenceStrength as EvidenceStrength) || "Strong Evidence",
        isVerifiedExternal: true,
        verificationNote: "User-curated verifiable citation.",
      };

      const nextItems = [...s4.evidenceItems, item];
      await onSave(
        {
          step4_evidenceValidation: {
            ...s4,
            evidenceItems: nextItems,
          },
        },
        "Step 4: Added Verifiable Citation"
      );
      setShowAddEvidence(false);
    };

    const removeEvidence = async (id: string) => {
      const nextItems = s4.evidenceItems.filter((e) => e.id !== id);
      await onSave(
        {
          step4_evidenceValidation: {
            ...s4,
            evidenceItems: nextItems,
          },
        },
        "Step 4: Removed Citation"
      );
    };

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Step 4 of 10 • Mandatory Validation Module
              </span>
              <h2 className="text-xl font-bold text-white">
                Evidence Validation Engine (Real Citations)
              </h2>
              <p className="text-xs text-slate-400">
                Queries OpenAlex & Crossref scholarly registries for real,
                verifiable research papers, DOIs, and statistics. Never
                fabricates sources.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddEvidence(!showAddEvidence)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/10"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Custom Citation</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={s4.searchQuery}
              onChange={(e) =>
                setProject((prev) =>
                  prev
                    ? {
                        ...prev,
                        step4_evidenceValidation: {
                          ...prev.step4_evidenceValidation,
                          searchQuery: e.target.value,
                        },
                      }
                    : prev
                )
              }
              placeholder="Enter research topic (e.g., clinical decision support triage rural primary care)..."
              className="flex-1 rounded-xl border border-white/10 bg-[#090a0f] px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleLiveResearch}
              disabled={researchLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              <span>
                {researchLoading
                  ? "Querying Academic Registries..."
                  : "Search Verifiable Research"}
              </span>
            </button>
          </div>

          {/* Add Custom Evidence Form */}
          {showAddEvidence && (
            <div className="mt-4 rounded-xl border border-indigo-500/30 bg-[#090a0f] p-4 space-y-3">
              <div className="text-xs font-bold text-indigo-300">
                Add Custom Verifiable Source Citation
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Source Title *"
                  value={newEv.sourceTitle}
                  onChange={(e) =>
                    setNewEv({ ...newEv, sourceTitle: e.target.value })
                  }
                  className="rounded-lg border border-white/10 bg-[#11131c] px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Source Organization (e.g., WHO, BPS, IEEE) *"
                  value={newEv.sourceOrganization}
                  onChange={(e) =>
                    setNewEv({ ...newEv, sourceOrganization: e.target.value })
                  }
                  className="rounded-lg border border-white/10 bg-[#11131c] px-3 py-2 text-xs text-white"
                />
                <input
                  type="url"
                  placeholder="Original Source URL (https://...) *"
                  value={newEv.originalSourceUrl}
                  onChange={(e) =>
                    setNewEv({ ...newEv, originalSourceUrl: e.target.value })
                  }
                  className="rounded-lg border border-white/10 bg-[#11131c] px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Supporting Statistic / Metric *"
                  value={newEv.supportingStatistic}
                  onChange={(e) =>
                    setNewEv({ ...newEv, supportingStatistic: e.target.value })
                  }
                  className="rounded-lg border border-white/10 bg-[#11131c] px-3 py-2 text-xs text-white"
                />
                <textarea
                  rows={2}
                  placeholder="Key Finding *"
                  value={newEv.finding}
                  onChange={(e) =>
                    setNewEv({ ...newEv, finding: e.target.value })
                  }
                  className="sm:col-span-2 rounded-lg border border-white/10 bg-[#11131c] px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEvidence(false)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCustomEvidence}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white"
                >
                  Save Citation
                </button>
              </div>
            </div>
          )}

          {/* Evidence Cards */}
          <div className="mt-6 space-y-4">
            {s4.evidenceItems.map((ev) => {
              const strengthBadge =
                ev.evidenceStrength === "Strong Evidence"
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : ev.evidenceStrength === "Moderate Evidence"
                  ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                  : "bg-amber-500/15 text-amber-300 border-amber-500/30";

              return (
                <div
                  key={ev.id}
                  className="rounded-xl border border-white/10 bg-[#090a0f] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${strengthBadge}`}
                      >
                        {ev.evidenceStrength}
                      </span>
                      <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-300">
                        {ev.evidenceType}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Traceable Source</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEvidence(ev.id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <h4 className="mt-2.5 text-sm font-bold text-white">
                    {ev.sourceTitle}
                  </h4>
                  <div className="mt-1 text-xs text-indigo-300">
                    {ev.sourceOrganization} • Published: {ev.publicationDate}
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="rounded-lg border border-white/5 bg-[#11131c] p-3">
                      <div className="font-semibold text-slate-400">
                        Research Finding:
                      </div>
                      <p className="mt-1 text-slate-200">{ev.finding}</p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-[#11131c] p-3">
                      <div className="font-semibold text-emerald-400">
                        Supporting Statistic / Record:
                      </div>
                      <p className="mt-1 text-slate-200">
                        {ev.supportingStatistic}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-[#11131c] p-3">
                      <div className="font-semibold text-indigo-400">
                        Relevance to Problem:
                      </div>
                      <p className="mt-1 text-slate-300">
                        {ev.relevanceToProblem}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-[#11131c] p-3">
                      <div className="font-semibold text-violet-400">
                        Business / Social Opportunity:
                      </div>
                      <p className="mt-1 text-slate-300">
                        {ev.businessOrSocialOpportunity}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
                    <a
                      href={ev.originalSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-indigo-400 hover:underline break-all"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      <span>{ev.originalSourceUrl}</span>
                    </a>
                    {ev.verificationNote && (
                      <span className="text-[10px] text-slate-500">
                        {ev.verificationNote}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8-Part Problem Validation Report */}
        {report && (
          <div className="rounded-2xl border border-emerald-500/30 bg-[#11131c] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                Problem Validation Report (8-Part Synthesis)
              </h3>
              <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-300">
                Strength: {report.overallValidationStrength}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 text-xs">
              <div className="rounded-xl border border-white/10 bg-[#090a0f] p-4">
                <div className="font-bold text-white">1. Problem Overview</div>
                <p className="mt-1 text-slate-300">{report.problemOverview}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#090a0f] p-4">
                <div className="font-bold text-white">
                  2. Supporting Evidence Summary
                </div>
                <p className="mt-1 text-slate-300">
                  {report.supportingEvidenceSummary}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#090a0f] p-4">
                <div className="font-bold text-white">
                  3. Statistical Insights
                </div>
                <ul className="mt-1 space-y-1 text-slate-300">
                  {report.statisticalInsights.map((st, i) => (
                    <li key={i}>• {st}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#090a0f] p-4">
                <div className="font-bold text-white">
                  5. Market or Social Impact
                </div>
                <p className="mt-1 text-slate-300">
                  {report.marketOrSocialImpact}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#090a0f] p-4">
                <div className="font-bold text-amber-300">7. Evidence Gaps</div>
                <ul className="mt-1 space-y-1 text-slate-300">
                  {report.evidenceGaps.map((g, i) => (
                    <li key={i}>• {g}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#090a0f] p-4">
                <div className="font-bold text-indigo-300">
                  8. Opportunity Analysis
                </div>
                <p className="mt-1 text-slate-300">
                  {report.opportunityAnalysis}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
              {report.deskVsCustomerDistinction}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // STEP 5 — SOLUTION GENERATOR
  // ============================================================================
  const s5 = project.step5_solutionGenerator;

  const selectSolution = async (solId: string) => {
    const chosen = s5.alternatives.find((a) => a.id === solId);
    if (!chosen) return;
    await onSave(
      {
        step5_solutionGenerator: {
          ...s5,
          selectedSolutionId: solId,
          customizedSolution: chosen,
        },
      },
      `Step 5: Selected Solution "${chosen.name}"`
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Step 5 of 10
            </span>
            <h2 className="text-xl font-bold text-white">
              Solution Generator (3 Strategic Alternatives)
            </h2>
            <p className="text-xs text-slate-400">
              Generate three distinct solution concepts, compare trade-offs, and
              select or customize the winning architecture.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onGenerate(5)}
            disabled={generatingStep === 5}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>
              {generatingStep === 5
                ? "Generating 3 Solutions..."
                : s5.alternatives.length > 0
                ? "Regenerate 3 Alternatives"
                : "Generate 3 Solution Alternatives"}
            </span>
          </button>
        </div>

        {/* AI Recommendation Banner */}
        {s5.recommendationReasoning && (
          <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-indigo-300">
              <Award className="h-4 w-4" />
              <span>AI Strategist Recommendation & Comparison</span>
            </div>
            <p className="mt-1 text-slate-200">{s5.comparisonSummary}</p>
            <p className="mt-1 text-indigo-200 font-medium">
              {s5.recommendationReasoning}
            </p>
          </div>
        )}

        {/* 3 Alternatives Cards */}
        {s5.alternatives.length > 0 && (
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {s5.alternatives.map((alt) => {
              const isSelected = s5.selectedSolutionId === alt.id;
              return (
                <div
                  key={alt.id}
                  className={`flex flex-col justify-between rounded-2xl border p-5 transition ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-500/10"
                      : "border-white/10 bg-[#090a0f]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      {alt.isRecommended ? (
                        <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                          ★ Recommended Winner
                        </span>
                      ) : (
                        <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] text-slate-400">
                          Alternative Option
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-indigo-300">
                        Judge Fit: {alt.judgeAlignmentScore}/100
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-white">
                      {alt.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                      {alt.conceptDescription}
                    </p>

                    <div className="mt-4 space-y-2.5 text-xs border-t border-white/10 pt-3">
                      <div>
                        <span className="font-semibold text-indigo-400">
                          Core Functionality:
                        </span>
                        <ul className="mt-1 space-y-1 pl-4 list-disc text-slate-300">
                          {alt.coreFunctionality.map((f, idx) => (
                            <li key={idx}>{f}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-semibold text-emerald-400">
                          Innovation:
                        </span>{" "}
                        <span className="text-slate-300">{alt.innovation}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-violet-400">
                          Expected Impact:
                        </span>{" "}
                        <span className="text-slate-300">
                          {alt.expectedImpact}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-amber-400">
                          Complexity & Feasibility:
                        </span>{" "}
                        <span className="text-slate-300">
                          [{alt.technicalComplexity}] {alt.feasibility}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-400">
                          Differentiation:
                        </span>{" "}
                        <span className="text-slate-300">
                          {alt.competitiveDifferentiation}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => selectSolution(alt.id)}
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition ${
                      isSelected
                        ? "bg-emerald-600 text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-500"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    <span>
                      {isSelected ? "Selected Solution" : "Select This Solution"}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Customize Selected Solution */}
        {s5.selectedSolutionId && (
          <div className="mt-6 rounded-xl border border-white/10 bg-[#090a0f] p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Customize Selected Solution Strategy
            </h4>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-slate-400">
                  Selected Solution Name
                </label>
                <input
                  type="text"
                  value={
                    s5.customizedSolution?.name ||
                    s5.alternatives.find((a) => a.id === s5.selectedSolutionId)
                      ?.name ||
                    ""
                  }
                  onChange={(e) => {
                    const base =
                      s5.customizedSolution ||
                      s5.alternatives.find(
                        (a) => a.id === s5.selectedSolutionId
                      )!;
                    setProject((prev) =>
                      prev
                        ? {
                            ...prev,
                            step5_solutionGenerator: {
                              ...prev.step5_solutionGenerator,
                              customizedSolution: {
                                ...base,
                                name: e.target.value,
                              },
                            },
                          }
                        : prev
                    );
                  }}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#11131c] px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400">
                  Unique Competitive Differentiation
                </label>
                <input
                  type="text"
                  value={
                    s5.customizedSolution?.competitiveDifferentiation ||
                    s5.alternatives.find((a) => a.id === s5.selectedSolutionId)
                      ?.competitiveDifferentiation ||
                    ""
                  }
                  onChange={(e) => {
                    const base =
                      s5.customizedSolution ||
                      s5.alternatives.find(
                        (a) => a.id === s5.selectedSolutionId
                      )!;
                    setProject((prev) =>
                      prev
                        ? {
                            ...prev,
                            step5_solutionGenerator: {
                              ...prev.step5_solutionGenerator,
                              customizedSolution: {
                                ...base,
                                competitiveDifferentiation: e.target.value,
                              },
                            },
                          }
                        : prev
                    );
                  }}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#11131c] px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
