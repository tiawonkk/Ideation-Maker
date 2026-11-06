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
  HelpCircle,
  Info,
  Copy,
  RefreshCw,
  Edit3,
  ChevronDown,
  ChevronUp,
  Wand2,
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

const STEP1_PRESETS = [
  {
    label: "GEMASTIK",
    name: "GEMASTIK — Divisi Piranti Cerdas & Kota Cerdas",
    theme: "Inovasi AI & Sistem Cerdas untuk Ketahanan Pangan dan Layanan Publik",
    domain: "GovTech, Smart City & Public Healthcare",
    targetTechnology: "Next.js, Computer Vision / Multimodal AI, PostgreSQL, IoT API",
    description:
      "Kompetisi nasional mahasiswa Indonesia untuk menciptakan inovasi digital tervalidasi yang menyelesaikan permasalahan nyata masyarakat dan instansi publik.",
    additionalContext:
      "Wajib menyertakan bukti data resmi (BPS/Kemenkes/Jurnal) dan prototipe fungsional yang dapat didemokan langsung.",
  },
  {
    label: "PKM-KC",
    name: "PKM-KC (Program Kreativitas Mahasiswa — Karsa Cipta)",
    theme: "Purwarupa Sistem Cerdas Berbasis Bukti Ilmiah & Riset Terapan",
    domain: "Applied Engineering, AgriTech & Medical Devices",
    targetTechnology: "Next.js Dashboard, Edge AI Inference, PostgreSQL, REST API",
    description:
      "Penciptaan sistem, desain, atau purwarupa fungsional yang berlandaskan literatur ilmiah terverifikasi dan siap diuji coba.",
    additionalContext:
      "Penilaian menekankan kebaruan ilmiah, kepatuhan format, dan kelayakan teknis.",
  },
  {
    label: "Gemini API Competition",
    name: "Gemini API Developer Competition",
    theme: "AI for Social Impact & Accessible Healthcare",
    domain: "Healthcare & Public Health Informatics",
    targetTechnology: "Google Gemini 2.5 Multimodal API, Next.js 15, TypeScript, PostgreSQL",
    description:
      "Build high-impact applications using multimodal generative AI (audio, vision, long-context text) to solve urgent community challenges.",
    additionalContext:
      "Focus on underserved rural primary care clinics (Puskesmas) where specialist physicians are scarce.",
  },
  {
    label: "Microsoft Imagine Cup",
    name: "Microsoft Imagine Cup — AI Startup Track",
    theme: "Scalable AI Copilot Empowering Frontline Workers",
    domain: "Enterprise SaaS, FinTech & Supply Chain",
    targetTechnology: "Azure OpenAI, Next.js, TypeScript, PostgreSQL, Cloud Functions",
    description:
      "Build an innovative, commercially viable AI startup product that solves a validated industry bottleneck.",
    additionalContext:
      "Judges evaluate responsible AI guardrails, market validation, and clear customer ROI.",
  },
];

const DOMAIN_CHIPS = [
  "Healthcare & Clinical Triage",
  "AgriTech & Food Security",
  "FinTech & Micro-SME Inclusion",
  "EdTech & Adaptive Learning",
  "Smart City & GovTech",
  "Climate & Sustainability",
];

const TECH_CHIPS = [
  "Google Gemini Multimodal API",
  "Next.js 15 + TypeScript",
  "PostgreSQL + Prisma",
  "RAG / Vector Search",
  "PWA Offline Sync",
  "Azure OpenAI",
];

function FieldLabel({
  label,
  tooltip,
  count,
}: {
  label: string;
  tooltip: string;
  count?: number;
}) {
  return (
    <div className="flex items-center justify-between text-xs font-semibold">
      <div className="flex items-center gap-1.5">
        <span>{label}</span>
        <span
          title={tooltip}
          className="inline-flex cursor-help items-center text-slate-400 hover:text-indigo-500"
        >
          <HelpCircle className="h-3.5 w-3.5" />
        </span>
      </div>
      {typeof count === "number" && (
        <span className="font-mono text-[10px] text-slate-400">
          {count} chars
        </span>
      )}
    </div>
  );
}

function ModuleHeaderCard({
  stepNum,
  title,
  subtitle,
  whatItDoes,
  actionButton,
}: {
  stepNum: number;
  title: string;
  subtitle: string;
  whatItDoes: string;
  actionButton?: React.ReactNode;
}) {
  const [openInfo, setOpenInfo] = useState(false);

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-indigo-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-300 border border-indigo-500/25">
              STEP {stepNum} OF 10
            </span>
            <button
              type="button"
              onClick={() => setOpenInfo(!openInfo)}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-200/70 dark:bg-white/[0.06] px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition"
            >
              <Info className="h-3 w-3 text-indigo-500" />
              <span>What does this module do?</span>
              {openInfo ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        {actionButton && <div>{actionButton}</div>}
      </div>

      {openInfo && (
        <div className="mt-4 rounded-xl border border-indigo-500/25 bg-indigo-500/[0.07] p-3.5 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
          <strong className="text-indigo-600 dark:text-indigo-300">
            AI Strategist Logic:{" "}
          </strong>
          {whatItDoes}
        </div>
      )}
    </div>
  );
}

function OutputCardActions({
  textToCopy,
  onRegenerate,
  onToggleEdit,
  isEditing,
}: {
  textToCopy: string;
  onRegenerate: () => void;
  onToggleEdit?: () => void;
  isEditing?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center gap-1.5">
      {onToggleEdit && (
        <button
          type="button"
          onClick={onToggleEdit}
          className="btn-glass-secondary px-2 py-1 text-[10px]"
          title="Edit inline"
        >
          <Edit3 className="h-3 w-3" />
          <span>{isEditing ? "Done" : "Edit"}</span>
        </button>
      )}
      <button
        type="button"
        onClick={onRegenerate}
        className="btn-glass-secondary px-2 py-1 text-[10px]"
        title="Regenerate with AI"
      >
        <RefreshCw className="h-3 w-3 text-indigo-500" />
        <span>Regenerate</span>
      </button>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(textToCopy);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        }}
        className="btn-glass-secondary px-2 py-1 text-[10px]"
        title="Copy content"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 text-emerald-500" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
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
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [critiqueNotes, setCritiqueNotes] = useState<string[] | null>(null);

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

    const applyPreset = (preset: (typeof STEP1_PRESETS)[0]) => {
      setProject((prev) =>
        prev
          ? {
              ...prev,
              step1_competition: {
                ...prev.step1_competition,
                name: preset.name,
                theme: preset.theme,
                domain: preset.domain,
                targetTechnology: preset.targetTechnology,
                description: preset.description,
                additionalContext: preset.additionalContext,
              },
            }
          : prev
      );
    };

    return (
      <div className="space-y-6">
        <ModuleHeaderCard
          stepNum={1}
          title="Competition Theme Analyzer"
          subtitle="Deconstruct raw competition themes into high-leverage industry opportunities, technical angles, and judge focus areas."
          whatItDoes="Analyzes your competition name, theme description, and target technology stack to generate 7 structured strategic cards: Theme Breakdown, Relevant Industries, Main Challenges, Tech Opportunities, Problem Areas, Judge Focus Areas, and Recommended Innovation Directions."
          actionButton={
            <button
              type="button"
              onClick={() => onGenerate(1)}
              disabled={generatingStep === 1}
              className="btn-apple-primary text-xs"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {generatingStep === 1
                  ? "Analyzing Theme..."
                  : analysis
                  ? "Regenerate Theme Analysis"
                  : "Generate Theme Analysis"}
              </span>
            </button>
          }
        />

        {/* [USER INPUT PANEL] */}
        <div className="glass-panel rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 dark:border-white/10 pb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              [User Input Panel] — Competition Context
            </span>

            {/* 1-Click Quick-Preset Templates */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-500 mr-1">
                Quick Presets:
              </span>
              {STEP1_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="btn-glass-secondary px-2.5 py-1 text-[11px]"
                >
                  <Wand2 className="h-3 w-3 text-indigo-500" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel
                label="Competition Name *"
                tooltip="Official name of the hackathon or innovation challenge."
                count={s1.name.length}
              />
              <input
                type="text"
                value={s1.name}
                onChange={(e) => updateS1("name", e.target.value)}
                placeholder="e.g., Gemini API Developer Competition / GEMASTIK"
                className="mt-1.5 w-full text-sm glass-input"
              />
            </div>

            <div>
              <FieldLabel
                label="Competition Theme *"
                tooltip="The official track or theme statement provided by organizers."
                count={s1.theme.length}
              />
              <input
                type="text"
                value={s1.theme}
                onChange={(e) => updateS1("theme", e.target.value)}
                placeholder="e.g., AI for Social Impact & Accessible Healthcare"
                className="mt-1.5 w-full text-sm glass-input"
              />
            </div>

            <div>
              <FieldLabel
                label="Competition Domain *"
                tooltip="Target industry or sector for your solution."
                count={s1.domain.length}
              />
              <input
                type="text"
                value={s1.domain}
                onChange={(e) => updateS1("domain", e.target.value)}
                placeholder="e.g., Healthcare, AgriTech, FinTech, Smart City"
                className="mt-1.5 w-full text-sm glass-input"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {DOMAIN_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => updateS1("domain", chip)}
                    className="rounded-lg border border-slate-300/70 dark:border-white/10 bg-white/50 dark:bg-white/[0.04] hover:border-indigo-500 px-2 py-0.5 text-[10px] font-medium transition"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel
                label="Target Technology *"
                tooltip="Required sponsor APIs, AI models, or preferred frameworks."
                count={s1.targetTechnology.length}
              />
              <input
                type="text"
                value={s1.targetTechnology}
                onChange={(e) => updateS1("targetTechnology", e.target.value)}
                placeholder="e.g., Google Gemini Multimodal API, Next.js, PostgreSQL"
                className="mt-1.5 w-full text-sm glass-input"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TECH_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() =>
                      updateS1(
                        "targetTechnology",
                        s1.targetTechnology
                          ? `${s1.targetTechnology}, ${chip}`
                          : chip
                      )
                    }
                    className="rounded-lg border border-slate-300/70 dark:border-white/10 bg-white/50 dark:bg-white/[0.04] hover:border-indigo-500 px-2 py-0.5 text-[10px] font-medium transition"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <FieldLabel
                label="Theme Description"
                tooltip="Detailed prompt, problem brief, or objective from the rulebook."
                count={s1.description.length}
              />
              <textarea
                rows={2}
                value={s1.description}
                onChange={(e) => updateS1("description", e.target.value)}
                placeholder="Paste the official hackathon prompt or theme description..."
                className="mt-1.5 w-full text-sm glass-input"
              />
            </div>

            <div className="sm:col-span-2">
              <FieldLabel
                label="Additional Context & Constraints"
                tooltip="Target geography, user constraints, or special sponsor requirements."
                count={s1.additionalContext.length}
              />
              <textarea
                rows={2}
                value={s1.additionalContext}
                onChange={(e) => updateS1("additionalContext", e.target.value)}
                placeholder="Any specific constraints, sponsor requirements, or target users..."
                className="mt-1.5 w-full text-sm glass-input"
              />
            </div>
          </div>
        </div>

        {/* [AI GENERATED OUTPUT PANEL] — 7 DISTINCT GLASS CARDS */}
        {analysis && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                [AI Generated Output Panel] — 7-Part Strategic Theme Breakdown
              </span>
            </div>

            {/* Card 1: Theme Breakdown */}
            <div className="glass-panel rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 dark:border-white/10 pb-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  1. Theme Breakdown
                </h3>
                <OutputCardActions
                  textToCopy={analysis.themeBreakdown}
                  onRegenerate={() => onGenerate(1)}
                  onToggleEdit={() =>
                    setEditingBlock(
                      editingBlock === "s1-breakdown" ? null : "s1-breakdown"
                    )
                  }
                  isEditing={editingBlock === "s1-breakdown"}
                />
              </div>
              {editingBlock === "s1-breakdown" ? (
                <textarea
                  rows={3}
                  value={analysis.themeBreakdown}
                  onChange={(e) =>
                    setProject((prev) =>
                      prev && prev.step1_competition.analysis
                        ? {
                            ...prev,
                            step1_competition: {
                              ...prev.step1_competition,
                              analysis: {
                                ...prev.step1_competition.analysis,
                                themeBreakdown: e.target.value,
                              },
                            },
                          }
                        : prev
                    )
                  }
                  className="mt-3 w-full text-xs glass-input"
                />
              ) : (
                <p className="mt-3 text-sm leading-relaxed">
                  {analysis.themeBreakdown}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Card 2: Relevant Industries */}
              <div className="glass-panel rounded-2xl p-5">
                <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    2. Relevant Industries
                  </h4>
                  <OutputCardActions
                    textToCopy={analysis.relevantIndustries
                      .map((i) => `${i.name}: ${i.relevanceWhy}`)
                      .join("\n")}
                    onRegenerate={() => onGenerate(1)}
                  />
                </div>
                <div className="mt-3 space-y-2.5">
                  {analysis.relevantIndustries.map((ind, idx) => (
                    <div key={idx} className="glass-card rounded-xl p-3 text-xs">
                      <div className="font-bold">{ind.name}</div>
                      <div className="mt-1 text-slate-600 dark:text-slate-300">
                        <strong className="text-indigo-600 dark:text-indigo-300">
                          Why relevant:{" "}
                        </strong>
                        {ind.relevanceWhy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Main Challenges */}
              <div className="glass-panel rounded-2xl p-5">
                <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    3. Main Challenges
                  </h4>
                  <OutputCardActions
                    textToCopy={analysis.mainChallenges.join("\n")}
                    onRegenerate={() => onGenerate(1)}
                  />
                </div>
                <ul className="mt-3 space-y-2 text-xs">
                  {analysis.mainChallenges.map((c, i) => (
                    <li key={i} className="glass-card rounded-xl p-3">
                      • {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 4: Technology Opportunities */}
              <div className="glass-panel rounded-2xl p-5">
                <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    4. Technology Opportunities
                  </h4>
                  <OutputCardActions
                    textToCopy={analysis.technologyOpportunities
                      .map((t) => `${t.tech}: ${t.opportunityWhy}`)
                      .join("\n")}
                    onRegenerate={() => onGenerate(1)}
                  />
                </div>
                <div className="mt-3 space-y-2.5">
                  {analysis.technologyOpportunities.map((t, idx) => (
                    <div key={idx} className="glass-card rounded-xl p-3 text-xs">
                      <div className="font-bold">{t.tech}</div>
                      <div className="mt-1 text-slate-600 dark:text-slate-300">
                        <strong className="text-violet-600 dark:text-violet-300">
                          Why relevant:{" "}
                        </strong>
                        {t.opportunityWhy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 5: Potential Problem Areas */}
              <div className="glass-panel rounded-2xl p-5">
                <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    5. Potential Problem Areas
                  </h4>
                  <OutputCardActions
                    textToCopy={analysis.potentialProblemAreas
                      .map((p) => `${p.area}: ${p.relevanceWhy}`)
                      .join("\n")}
                    onRegenerate={() => onGenerate(1)}
                  />
                </div>
                <div className="mt-3 space-y-2.5">
                  {analysis.potentialProblemAreas.map((p, idx) => (
                    <div key={idx} className="glass-card rounded-xl p-3 text-xs">
                      <div className="font-bold">{p.area}</div>
                      <div className="mt-1 text-slate-600 dark:text-slate-300">
                        {p.relevanceWhy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 6: Judge Focus Areas */}
            <div className="glass-panel rounded-2xl p-5">
              <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  6. Judge Focus Areas
                </h4>
                <OutputCardActions
                  textToCopy={analysis.judgeFocusAreas.join("\n")}
                  onRegenerate={() => onGenerate(1)}
                />
              </div>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-3 text-xs">
                {analysis.judgeFocusAreas.map((j, i) => (
                  <div key={i} className="glass-card rounded-xl p-3 font-medium">
                    <span className="text-indigo-500 font-bold mr-1.5">
                      #{i + 1}
                    </span>
                    {j}
                  </div>
                ))}
              </div>
            </div>

            {/* Card 7: Recommended Innovation Directions */}
            <div className="glass-panel rounded-2xl p-5">
              <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  7. Recommended Innovation Directions
                </h4>
                <OutputCardActions
                  textToCopy={analysis.recommendedInnovationDirections
                    .map((d) => `${d.title}: ${d.description}`)
                    .join("\n")}
                  onRegenerate={() => onGenerate(1)}
                />
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {analysis.recommendedInnovationDirections.map((dir, idx) => (
                  <div key={idx} className="glass-card rounded-xl p-4 text-xs">
                    <div className="text-sm font-bold">{dir.title}</div>
                    <p className="mt-1.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                      {dir.description}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-200/70 dark:border-white/10 text-indigo-600 dark:text-indigo-300 font-medium">
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
      const total = s2.criteria.reduce(
        (sum, c) => sum + (Number(c.weight) || 0),
        0
      );
      if (total <= 0) return;
      let running = 0;
      const normalized = s2.criteria.map((c, idx) => {
        if (idx === s2.criteria.length - 1) {
          return {
            ...c,
            weight: Math.max(0, Math.round((100 - running) * 10) / 10),
          };
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
        <ModuleHeaderCard
          stepNum={2}
          title="Judge Criteria Engine"
          subtitle="Configure custom judging criteria weights with interactive sliders (must equal 100%) and map project priorities."
          whatItDoes="Validates that your competition rubric sums to 100%, ranks each criterion by score leverage, explains what hackathon judges look for in each category, and maps your project capabilities directly to the rubric."
          actionButton={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addCriterion}
                className="btn-glass-secondary"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Criterion</span>
              </button>
              <button
                type="button"
                onClick={() => onGenerate(2)}
                disabled={!validation.valid || generatingStep === 2}
                className="btn-apple-primary text-xs"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  {generatingStep === 2
                    ? "Mapping Rubric..."
                    : "Map Criteria to Strategy"}
                </span>
              </button>
            </div>
          }
        />

        {/* [USER INPUT PANEL] — SLIDERS + LIVE TOTAL WEIGHT BAR */}
        <div className="glass-panel rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              [User Input Panel] — Judging Rubric & Weight Sliders
            </span>
          </div>

          {/* Live Total Weight Bar */}
          <div
            className={`rounded-2xl border p-4 transition-all ${
              validation.valid
                ? "border-emerald-500/40 bg-emerald-500/10"
                : "border-amber-500/40 bg-amber-500/10"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 font-bold">
                {validation.valid ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                <span>Total Rubric Weight: {validation.total}% / 100%</span>
                {!validation.valid && (
                  <span className="text-rose-500 dark:text-amber-300">
                    ({validation.error})
                  </span>
                )}
              </div>
              {!validation.valid && (
                <button
                  type="button"
                  onClick={normalizeTo100}
                  className="btn-apple-primary py-1.5 px-3 text-xs"
                >
                  Auto-Balance to 100%
                </button>
              )}
            </div>

            <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full bg-slate-300/70 dark:bg-black/40">
              <div
                className={`h-full transition-all duration-300 ${
                  validation.valid
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : validation.total > 100
                    ? "bg-rose-500"
                    : "bg-amber-500"
                }`}
                style={{ width: `${Math.min(100, validation.total)}%` }}
              />
            </div>
          </div>

          {/* Criteria Interactive Sliders */}
          <div className="space-y-3">
            {s2.criteria.map((crit) => (
              <div key={crit.id} className="glass-card rounded-2xl p-4">
                <div className="grid gap-4 sm:grid-cols-12 items-center">
                  <div className="sm:col-span-3">
                    <FieldLabel
                      label="Criterion Name"
                      tooltip="Name of the judging dimension (e.g., Innovation, Impact)."
                    />
                    <input
                      type="text"
                      value={crit.name}
                      onChange={(e) =>
                        updateCriterion(crit.id, "name", e.target.value)
                      }
                      className="mt-1 w-full text-xs font-bold glass-input py-2"
                    />
                  </div>

                  {/* Interactive Weight Slider + Numeric Input */}
                  <div className="sm:col-span-4">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Weight Slider (%)</span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-300">
                        {crit.weight}%
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={crit.weight}
                        onChange={(e) =>
                          updateCriterion(
                            crit.id,
                            "weight",
                            Number(e.target.value)
                          )
                        }
                        className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-300 dark:bg-white/15 accent-indigo-600"
                      />
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={crit.weight}
                        onChange={(e) =>
                          updateCriterion(
                            crit.id,
                            "weight",
                            Number(e.target.value)
                          )
                        }
                        className="w-16 text-center text-xs font-bold glass-input px-2 py-1.5"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <FieldLabel
                      label="Rubric Description"
                      tooltip="What this criterion evaluates."
                    />
                    <input
                      type="text"
                      value={crit.description}
                      onChange={(e) =>
                        updateCriterion(crit.id, "description", e.target.value)
                      }
                      className="mt-1 w-full text-xs glass-input py-2"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => removeCriterion(crit.id)}
                      disabled={s2.criteria.length <= 1}
                      className="rounded-xl p-2 text-slate-400 hover:bg-rose-500/15 hover:text-rose-500 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* [AI GENERATED OUTPUT PANEL] */}
        {s2.overallInterpretation && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                [AI Generated Output Panel] — Strategic Rubric Mapping
              </span>
              <OutputCardActions
                textToCopy={s2.overallInterpretation}
                onRegenerate={() => onGenerate(2)}
              />
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Overall Rubric Synthesis
              </h3>
              <p className="mt-2 text-sm font-medium">
                {s2.overallInterpretation}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {s2.criteria.map((crit) => (
                  <div key={crit.id} className="glass-card rounded-xl p-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm">{crit.name}</span>
                      <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 font-mono font-bold text-indigo-600 dark:text-indigo-300">
                        {crit.weight}%
                      </span>
                    </div>
                    {crit.whatJudgesLookFor && (
                      <div className="mt-2.5 space-y-2 border-t border-slate-200/70 dark:border-white/10 pt-2.5">
                        <div>
                          <strong className="text-indigo-600 dark:text-indigo-300">
                            Judges Look For:{" "}
                          </strong>
                          <span>{crit.whatJudgesLookFor}</span>
                        </div>
                        <div>
                          <strong className="text-emerald-600 dark:text-emerald-400">
                            Strategy:{" "}
                          </strong>
                          <span>{crit.strategicRecommendation}</span>
                        </div>
                        <div>
                          <strong className="text-violet-600 dark:text-violet-300">
                            Mapped Capability:{" "}
                          </strong>
                          <span>{crit.mappedCapability}</span>
                        </div>
                      </div>
                    )}
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

    const runCritiqueProblem = () => {
      const notes: string[] = [];
      if (!s3.whoExperiences || s3.whoExperiences.length < 15) {
        notes.push(
          "Target User is too broad: Specify the exact job role and setting (e.g., 'Frontline triage nurses at rural Puskesmas clinics' instead of 'people' or 'doctors')."
        );
      }
      if (!/\d/.test(s3.impact || "")) {
        notes.push(
          "Impact lacks measurable numbers: Add concrete metrics such as minutes wasted per case, error percentage, or financial cost."
        );
      }
      if (!s3.whyInsufficient || s3.whyInsufficient.length < 20) {
        notes.push(
          "Root Cause depth: Explain specifically why current workarounds (spreadsheets, PDFs, WhatsApp) fail under time pressure."
        );
      }
      if (notes.length === 0) {
        notes.push(
          "Strong specificity! Your inputs clearly define a specific user persona, root cause, and quantified impact."
        );
      }
      setCritiqueNotes(notes);
      onGenerate(3);
    };

    return (
      <div className="space-y-6">
        <ModuleHeaderCard
          stepNum={3}
          title="Problem Discovery Engine"
          subtitle="Answer the 6 guided root-cause questions and run the AI Problem Statement Critique."
          whatItDoes="Guides you through 6 structured discovery questions, critiques vague assumptions, constructs a realistic Target User Persona, and synthesizes the canonical formula: '[Target User] experiences [Specific Problem] because [Root Cause], resulting in [Measurable Impact].'"
          actionButton={
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={runCritiqueProblem}
                disabled={generatingStep === 3}
                className="btn-glass-secondary"
              >
                <Wand2 className="h-3.5 w-3.5 text-amber-500" />
                <span>Critique My Problem Statement</span>
              </button>
              <button
                type="button"
                onClick={() => onGenerate(3)}
                disabled={generatingStep === 3}
                className="btn-apple-primary text-xs"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  {generatingStep === 3
                    ? "Synthesizing..."
                    : "Generate Problem & Persona"}
                </span>
              </button>
            </div>
          }
        />

        {/* AI Critique Banner */}
        {critiqueNotes && (
          <div className="glass-panel rounded-2xl border-l-4 border-l-indigo-500 p-4 text-xs">
            <div className="font-bold text-indigo-600 dark:text-indigo-300">
              AI Mentor Critique & Diagnostic Feedback:
            </div>
            <ul className="mt-1.5 space-y-1 text-slate-700 dark:text-slate-300">
              {critiqueNotes.map((n, i) => (
                <li key={i}>• {n}</li>
              ))}
            </ul>
          </div>
        )}

        {/* [USER INPUT PANEL] — 6 GUIDED QUESTIONS */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            [User Input Panel] — 6-Question Discovery Wizard
          </span>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel
                label="1. Who experiences the problem?"
                tooltip="Name the specific frontline role, demographic, or organization type."
                count={s3.whoExperiences.length}
              />
              <textarea
                rows={2}
                value={s3.whoExperiences}
                onChange={(e) => updateS3("whoExperiences", e.target.value)}
                placeholder="e.g., Frontline triage nurses at rural primary healthcare clinics..."
                className="mt-1.5 w-full text-sm glass-input"
              />
            </div>

            <div>
              <FieldLabel
                label="2. What is their biggest difficulty?"
                tooltip="Describe the exact workflow bottleneck or high-friction task."
                count={s3.biggestDifficulty.length}
              />
              <textarea
                rows={2}
                value={s3.biggestDifficulty}
                onChange={(e) => updateS3("biggestDifficulty", e.target.value)}
                placeholder="What specific task or decision is slow, error-prone, or painful?"
                className="mt-1.5 w-full text-sm glass-input"
              />
            </div>

            <div>
              <FieldLabel
                label="3. How frequently does it happen?"
                tooltip="Daily, per patient encounter, per transaction, or weekly?"
                count={s3.frequency.length}
              />
              <input
                type="text"
                value={s3.frequency}
                onChange={(e) => updateS3("frequency", e.target.value)}
                placeholder="e.g., Daily — 30 to 60 intakes every morning shift"
                className="mt-1.5 w-full text-sm glass-input"
              />
            </div>

            <div>
              <FieldLabel
                label="4. What is the measurable impact?"
                tooltip="Quantify time lost, error rate, cost, or social risk."
                count={s3.impact.length}
              />
              <input
                type="text"
                value={s3.impact}
                onChange={(e) => updateS3("impact", e.target.value)}
                placeholder="e.g., 15–25 minutes wasted per complex referral and delayed emergency care"
                className="mt-1.5 w-full text-sm glass-input"
              />
            </div>

            <div>
              <FieldLabel
                label="5. What workarounds do they currently use?"
                tooltip="Current manual processes, spreadsheets, paper forms, or chat apps."
                count={s3.currentWorkarounds.length}
              />
              <textarea
                rows={2}
                value={s3.currentWorkarounds}
                onChange={(e) => updateS3("currentWorkarounds", e.target.value)}
                placeholder="e.g., Static 200-page PDF manuals, WhatsApp chats, handwritten referral forms"
                className="mt-1.5 w-full text-sm glass-input"
              />
            </div>

            <div>
              <FieldLabel
                label="6. Why are existing solutions insufficient?"
                tooltip="The underlying root cause why current tools fail."
                count={s3.whyInsufficient.length}
              />
              <textarea
                rows={2}
                value={s3.whyInsufficient}
                onChange={(e) => updateS3("whyInsufficient", e.target.value)}
                placeholder="Why do current tools fail under real-world pressure?"
                className="mt-1.5 w-full text-sm glass-input"
              />
            </div>
          </div>
        </div>

        {/* [AI GENERATED OUTPUT PANEL] */}
        {analysis && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                [AI Generated Output Panel] — Structured Problem & Persona
              </span>
            </div>

            {/* Structured Problem Statement Formula Card */}
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Structured Problem Statement Formula
                  </span>
                  <span className="rounded-md bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-300 border border-rose-500/25">
                    Severity: {analysis.problemSeverity}
                  </span>
                </div>
                <OutputCardActions
                  textToCopy={analysis.problemStatement}
                  onRegenerate={() => onGenerate(3)}
                />
              </div>

              <p className="mt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Formula: &ldquo;[Target User] experiences [Specific Problem]
                because [Root Cause], resulting in [Measurable Impact].&rdquo;
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
                className="mt-2.5 w-full text-sm font-medium glass-input"
              />
              <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-300">
                {analysis.validationDisclaimer}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass-panel rounded-2xl p-5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-2.5">
                  <h4 className="font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Target User Persona
                  </h4>
                  <OutputCardActions
                    textToCopy={`${analysis.userPersona.name} - ${analysis.userPersona.role}\n${analysis.userPersona.quote}`}
                    onRegenerate={() => onGenerate(3)}
                  />
                </div>
                <div className="mt-3 glass-card rounded-xl p-4">
                  <div className="text-sm font-bold">
                    {analysis.userPersona.name}
                  </div>
                  <div className="font-medium text-indigo-600 dark:text-indigo-300">
                    {analysis.userPersona.role}
                  </div>
                  <div className="mt-1 text-slate-500 dark:text-slate-400">
                    {analysis.userPersona.demographics}
                  </div>
                  <blockquote className="mt-3 border-l-2 border-indigo-500 pl-3 italic">
                    {analysis.userPersona.quote}
                  </blockquote>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-2.5">
                  <h4 className="font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Root Cause Analysis
                  </h4>
                  <OutputCardActions
                    textToCopy={analysis.rootCauseAnalysis.join("\n")}
                    onRegenerate={() => onGenerate(3)}
                  />
                </div>
                <ul className="mt-3 space-y-2">
                  {analysis.rootCauseAnalysis.map((rc, i) => (
                    <li key={i} className="glass-card rounded-xl p-3">
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

    const generateSmartQuery = () => {
      const domain = project.step1_competition?.domain || "";
      const diff =
        project.step3_problemDiscovery?.biggestDifficulty ||
        project.step1_competition?.theme ||
        "clinical triage decision support";
      const q = `${domain} ${diff}`
        .replace(/[^a-zA-Z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3)
        .slice(0, 7)
        .join(" ");
      setProject((prev) =>
        prev
          ? {
              ...prev,
              step4_evidenceValidation: {
                ...prev.step4_evidenceValidation,
                searchQuery: q,
              },
            }
          : prev
      );
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
        evidenceType:
          (newEv.evidenceType as ResearchEvidenceItem["evidenceType"]) ||
          "Academic Paper",
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
        <ModuleHeaderCard
          stepNum={4}
          title="Evidence Validation Engine (Live Scholarly Research)"
          subtitle="Validate your discovered problem using real academic papers (OpenAlex/Crossref), official statistics, and traceable URLs."
          whatItDoes="Queries live OpenAlex and Crossref academic databases for peer-reviewed papers and DOIs matching your problem space, classifies each source into Strong (Emerald), Moderate (Amber), or Limited (Rose) evidence, and compiles an 8-part Problem Validation Report."
          actionButton={
            <button
              type="button"
              onClick={() => setShowAddEvidence(!showAddEvidence)}
              className="btn-glass-secondary"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Custom Citation</span>
            </button>
          }
        />

        {/* Explicit Distinction Banner: Desk Research vs. Direct User Validation */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-panel rounded-2xl border-l-4 border-l-emerald-500 p-4 text-xs">
            <div className="font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              ✓ Secondary Desk Research (Included Here)
            </div>
            <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
              Academic papers (OpenAlex/Crossref), WHO/government statistics,
              and industry datasets that prove macro-scale problem severity.
            </p>
          </div>
          <div className="glass-panel rounded-2xl border-l-4 border-l-amber-500 p-4 text-xs">
            <div className="font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              ! Direct User Validation (Field Requirement)
            </div>
            <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
              Desk research does NOT replace primary customer interviews or live
              usability testing with target users. Never fabricate interview
              quotes.
            </p>
          </div>
        </div>

        {/* [USER INPUT PANEL] — SEARCH QUERY GENERATOR */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              [User Input Panel] — Scholarly Search Query Generator
            </span>
            <button
              type="button"
              onClick={generateSmartQuery}
              className="btn-glass-secondary px-2.5 py-1 text-[11px]"
            >
              <Wand2 className="h-3 w-3 text-indigo-500" />
              <span>Auto-Generate Query from Step 3</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
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
              placeholder="Enter research query (e.g., clinical decision support triage primary care)..."
              className="flex-1 text-sm glass-input"
            />
            <button
              type="button"
              onClick={handleLiveResearch}
              disabled={researchLoading}
              className="btn-apple-primary text-xs shrink-0"
            >
              <Search className="h-4 w-4" />
              <span>
                {researchLoading
                  ? "Querying OpenAlex & Crossref..."
                  : "Search Verifiable Research"}
              </span>
            </button>
          </div>

          {/* Add Custom Evidence Form */}
          {showAddEvidence && (
            <div className="mt-4 glass-card rounded-2xl p-4 space-y-3">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-300">
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
                  className="text-xs glass-input"
                />
                <input
                  type="text"
                  placeholder="Source Organization (e.g., WHO, BPS, IEEE) *"
                  value={newEv.sourceOrganization}
                  onChange={(e) =>
                    setNewEv({ ...newEv, sourceOrganization: e.target.value })
                  }
                  className="text-xs glass-input"
                />
                <input
                  type="url"
                  placeholder="Original Source URL (https://...) *"
                  value={newEv.originalSourceUrl}
                  onChange={(e) =>
                    setNewEv({ ...newEv, originalSourceUrl: e.target.value })
                  }
                  className="text-xs glass-input"
                />
                <select
                  value={newEv.evidenceStrength}
                  onChange={(e) =>
                    setNewEv({
                      ...newEv,
                      evidenceStrength: e.target.value as EvidenceStrength,
                    })
                  }
                  className="text-xs glass-input"
                >
                  <option value="Strong Evidence" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    Strong Evidence (Emerald)
                  </option>
                  <option value="Moderate Evidence" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    Moderate Evidence (Amber)
                  </option>
                  <option value="Limited Evidence" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    Limited Evidence (Rose)
                  </option>
                </select>
                <input
                  type="text"
                  placeholder="Supporting Statistic / Metric *"
                  value={newEv.supportingStatistic}
                  onChange={(e) =>
                    setNewEv({ ...newEv, supportingStatistic: e.target.value })
                  }
                  className="sm:col-span-2 text-xs glass-input"
                />
                <textarea
                  rows={2}
                  placeholder="Key Finding *"
                  value={newEv.finding}
                  onChange={(e) =>
                    setNewEv({ ...newEv, finding: e.target.value })
                  }
                  className="sm:col-span-2 text-xs glass-input"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEvidence(false)}
                  className="btn-glass-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCustomEvidence}
                  className="btn-apple-primary text-xs py-1.5 px-4"
                >
                  Save Citation
                </button>
              </div>
            </div>
          )}
        </div>

        {/* [AI GENERATED OUTPUT PANEL] — EVIDENCE CARDS & REPORT */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              [AI Generated Output Panel] — Verified Citations (
              {s4.evidenceItems.length})
            </span>
          </div>

          <div className="space-y-3">
            {s4.evidenceItems.map((ev) => {
              // Strong in Emerald, Moderate in Amber, Limited in Rose
              const strengthBadge =
                ev.evidenceStrength === "Strong Evidence"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                  : ev.evidenceStrength === "Moderate Evidence"
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                  : "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30";

              return (
                <div key={ev.id} className="glass-panel rounded-2xl p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${strengthBadge}`}
                      >
                        {ev.evidenceStrength}
                      </span>
                      <span className="rounded-md bg-slate-200/70 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold">
                        {ev.evidenceType}
                      </span>
                      <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
                        Year: {ev.publicationDate}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Verified Source</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <OutputCardActions
                        textToCopy={`${ev.sourceTitle} (${ev.sourceOrganization}, ${ev.publicationDate}) - ${ev.originalSourceUrl}`}
                        onRegenerate={handleLiveResearch}
                      />
                      <button
                        type="button"
                        onClick={() => removeEvidence(ev.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/15 hover:text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h4 className="mt-2.5 text-sm font-bold">{ev.sourceTitle}</h4>
                  <div className="mt-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                    {ev.sourceOrganization}
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="glass-card rounded-xl p-3">
                      <div className="font-bold text-slate-500 dark:text-slate-400">
                        Research Finding:
                      </div>
                      <p className="mt-1">{ev.finding}</p>
                    </div>
                    <div className="glass-card rounded-xl p-3">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">
                        Supporting Statistic:
                      </div>
                      <p className="mt-1">{ev.supportingStatistic}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-200/70 dark:border-white/10 text-xs">
                    <a
                      href={ev.originalSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline break-all"
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

        {/* Problem Validation Report */}
        {report && (
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                8-Part Problem Validation Report
              </h3>
              <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                Overall: {report.overallValidationStrength}
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2 text-xs">
              <div className="glass-card rounded-xl p-3.5">
                <div className="font-bold">1. Problem Overview</div>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  {report.problemOverview}
                </p>
              </div>
              <div className="glass-card rounded-xl p-3.5">
                <div className="font-bold">2. Supporting Evidence Summary</div>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  {report.supportingEvidenceSummary}
                </p>
              </div>
              <div className="glass-card rounded-xl p-3.5">
                <div className="font-bold">3. Statistical Insights</div>
                <ul className="mt-1 space-y-1 text-slate-600 dark:text-slate-300">
                  {report.statisticalInsights.map((st, i) => (
                    <li key={i}>• {st}</li>
                  ))}
                </ul>
              </div>
              <div className="glass-card rounded-xl p-3.5">
                <div className="font-bold text-amber-600 dark:text-amber-400">
                  7. Evidence Gaps & Next Steps
                </div>
                <ul className="mt-1 space-y-1 text-slate-600 dark:text-slate-300">
                  {report.evidenceGaps.map((g, i) => (
                    <li key={i}>• {g}</li>
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
  // STEP 5 — SOLUTION GENERATOR (3-COLUMN COMPARISON MATRIX)
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
      <ModuleHeaderCard
        stepNum={5}
        title="Solution Generator (3-Alternative Comparison Matrix)"
        subtitle="Generate 3 distinct solution architectures, compare them side-by-side across Innovation, Feasibility, Impact, and Complexity, and lock in your winning concept."
        whatItDoes="Synthesizes 3 alternative solutions (Option A, B, and C) from your validated problem statement, evaluates trade-offs against your competition's judging criteria, and recommends the highest-scoring architecture."
        actionButton={
          <button
            type="button"
            onClick={() => onGenerate(5)}
            disabled={generatingStep === 5}
            className="btn-apple-primary text-xs"
          >
            <Sparkles className="h-4 w-4" />
            <span>
              {generatingStep === 5
                ? "Generating 3 Alternatives..."
                : s5.alternatives.length > 0
                ? "Regenerate 3 Solutions"
                : "Generate 3 Solution Alternatives"}
            </span>
          </button>
        }
      />

      {/* AI Recommendation Summary */}
      {s5.recommendationReasoning && (
        <div className="glass-panel rounded-2xl border-l-4 border-l-indigo-500 p-5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-300">
              <Award className="h-4 w-4" />
              <span>AI Product Strategist Recommendation</span>
            </div>
            <OutputCardActions
              textToCopy={`${s5.comparisonSummary}\n${s5.recommendationReasoning}`}
              onRegenerate={() => onGenerate(5)}
            />
          </div>
          <p className="mt-1.5 text-slate-700 dark:text-slate-200">
            {s5.comparisonSummary}
          </p>
          <p className="mt-1 font-semibold text-indigo-600 dark:text-indigo-300">
            {s5.recommendationReasoning}
          </p>
        </div>
      )}

      {/* Side-by-Side 3-Column Comparison Matrix */}
      {s5.alternatives.length > 0 && (
        <div className="space-y-4">
          <span className="px-1 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            [AI Generated Output Panel] — 3-Column Solution Comparison Matrix
          </span>

          <div className="grid gap-5 lg:grid-cols-3">
            {s5.alternatives.map((alt, idx) => {
              const isSelected = s5.selectedSolutionId === alt.id;
              const optionLetter = ["Option A", "Option B", "Option C"][idx] || `Option ${idx + 1}`;

              return (
                <div
                  key={alt.id}
                  className={`flex flex-col justify-between rounded-2xl p-5 transition-all ${
                    isSelected
                      ? "glass-panel ring-2 ring-indigo-500 shadow-[0_8px_30px_rgba(79,70,229,0.25)]"
                      : "glass-card"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-lg bg-indigo-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
                        {optionLetter}
                      </span>
                      {alt.isRecommended && (
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          ★ AI Recommended
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-base font-extrabold">
                      {alt.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {alt.conceptDescription}
                    </p>

                    {/* Comparison Matrix Rows */}
                    <div className="mt-4 space-y-2.5 border-t border-slate-200/70 dark:border-white/10 pt-3 text-xs">
                      <div className="flex items-center justify-between rounded-lg bg-slate-200/50 dark:bg-black/30 px-3 py-1.5">
                        <span className="text-slate-500 dark:text-slate-400">
                          Tech Complexity:
                        </span>
                        <span className="font-bold">
                          {alt.technicalComplexity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-slate-200/50 dark:bg-black/30 px-3 py-1.5">
                        <span className="text-slate-500 dark:text-slate-400">
                          Feasibility Score:
                        </span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {alt.feasibilityScore}/100
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-slate-200/50 dark:bg-black/30 px-3 py-1.5">
                        <span className="text-slate-500 dark:text-slate-400">
                          Judge Alignment:
                        </span>
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-300">
                          {alt.judgeAlignmentScore}/100
                        </span>
                      </div>

                      <div className="pt-1">
                        <strong className="text-indigo-600 dark:text-indigo-300">
                          Innovation:{" "}
                        </strong>
                        <span>{alt.innovation}</span>
                      </div>
                      <div>
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          Expected Impact:{" "}
                        </strong>
                        <span>{alt.expectedImpact}</span>
                      </div>
                      <div>
                        <strong className="text-violet-600 dark:text-violet-300">
                          Core Features:{" "}
                        </strong>
                        <ul className="mt-1 space-y-1 pl-4 list-disc">
                          {alt.coreFunctionality.map((f, fIdx) => (
                            <li key={fIdx}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => selectSolution(alt.id)}
                    className={`mt-5 w-full rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                        : "btn-apple-primary"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    <span>
                      {isSelected
                        ? "Selected as Winning Solution"
                        : "Select as Winning Solution"}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Customize Selected Solution Panel */}
      {s5.selectedSolutionId && (
        <div className="glass-panel rounded-2xl p-6">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            [User Input Panel] — Customize Selected Winning Solution
          </h4>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel
                label="Winning Solution Name"
                tooltip="Customize the product name carried into Steps 6–10."
              />
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
                className="mt-1.5 w-full text-xs glass-input"
              />
            </div>

            <div>
              <FieldLabel
                label="Competitive Differentiation"
                tooltip="Why your solution beats generic AI wrappers."
              />
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
                className="mt-1.5 w-full text-xs glass-input"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
