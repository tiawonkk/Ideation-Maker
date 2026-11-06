"use client";

import React, { useState } from "react";
import {
  DeliverableItem,
  ProductFeatureItem,
  Project,
} from "@/types/project";
import { MermaidDiagram } from "./MermaidDiagram";
import {
  Sparkles,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Cpu,
  Calendar,
  Layers,
  Info,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";

interface ProductPlanningStepsProps {
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

const DURATION_PRESETS = [
  "24-Hour Hackathon",
  "48-Hour Weekend",
  "2 Weeks",
  "4 Weeks",
  "8 Weeks",
];

const MOSCOW_COLUMNS: ProductFeatureItem["moscow"][] = [
  "Must Have",
  "Should Have",
  "Could Have",
  "Won't Have Yet",
];

function PlanningHeaderCard({
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="btn-glass-secondary px-2 py-1 text-[10px]"
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
  );
}

export function ProductPlanningSteps({
  project,
  setProject,
  activeStep,
  onSave,
  onGenerate,
  generatingStep,
}: ProductPlanningStepsProps) {
  const [newFeatName, setNewFeatName] = useState("");
  const [newFeatDesc, setNewFeatDesc] = useState("");
  const [newFeatTier, setNewFeatTier] = useState<"MVP" | "CORE" | "FUTURE">(
    "MVP"
  );
  const [newFeatMoscow, setNewFeatMoscow] =
    useState<ProductFeatureItem["moscow"]>("Must Have");

  const [newDelivTitle, setNewDelivTitle] = useState("");
  const [newDelivRole, setNewDelivRole] = useState("Product Manager");
  const [newDelivDeadline, setNewDelivDeadline] = useState(
    "H-6 Hours before submission"
  );

  // ============================================================================
  // STEP 6 — PRODUCT DESIGN & MOSCOW KANBAN
  // ============================================================================
  if (activeStep === 6) {
    const s6 = project.step6_productDesign;

    const addFeature = () => {
      if (!newFeatName.trim()) return;
      const item: ProductFeatureItem = {
        id: `feat-${Date.now()}`,
        name: newFeatName.trim(),
        description:
          newFeatDesc.trim() || "Core user-facing capability aligned with MVP.",
        tier: newFeatTier,
        moscow: newFeatMoscow,
      };
      setProject((prev) =>
        prev
          ? {
              ...prev,
              step6_productDesign: {
                ...prev.step6_productDesign,
                features: [...prev.step6_productDesign.features, item],
              },
            }
          : prev
      );
      setNewFeatName("");
      setNewFeatDesc("");
    };

    const updateFeaturePriority = (
      id: string,
      nextMoscow: ProductFeatureItem["moscow"]
    ) => {
      const nextTier: ProductFeatureItem["tier"] =
        nextMoscow === "Must Have"
          ? "MVP"
          : nextMoscow === "Won't Have Yet"
          ? "FUTURE"
          : "CORE";

      setProject((prev) =>
        prev
          ? {
              ...prev,
              step6_productDesign: {
                ...prev.step6_productDesign,
                features: prev.step6_productDesign.features.map((f) =>
                  f.id === id ? { ...f, moscow: nextMoscow, tier: nextTier } : f
                ),
              },
            }
          : prev
      );
    };

    const removeFeature = (id: string) => {
      setProject((prev) =>
        prev
          ? {
              ...prev,
              step6_productDesign: {
                ...prev.step6_productDesign,
                features: prev.step6_productDesign.features.filter(
                  (f) => f.id !== id
                ),
              },
            }
          : prev
      );
    };

    return (
      <div className="space-y-6">
        <PlanningHeaderCard
          stepNum={6}
          title="Product Design, MoSCoW Kanban & User Flow"
          subtitle="Define Product Identity, Value Proposition, interactive MoSCoW feature prioritization, and Mermaid User Flows."
          whatItDoes="Translates your selected solution concept into a structured Product Identity, Unique Selling Proposition, interactive MoSCoW feature matrix (Must Have, Should Have, Could Have, Won't Have Yet), key UI screens, and a Mermaid.js User Flow diagram."
          actionButton={
            <button
              type="button"
              onClick={() => onGenerate(6)}
              disabled={generatingStep === 6}
              className="btn-apple-primary text-xs"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {generatingStep === 6
                  ? "Designing Product..."
                  : "Generate Product Design & Flow"}
              </span>
            </button>
          }
        />

        {/* [USER INPUT PANEL] — PRODUCT IDENTITY & ADD FEATURE */}
        <div className="glass-panel rounded-2xl p-6 space-y-5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            [User Input Panel] — Product Identity & Feature Builder
          </span>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span>Application Name</span>
                <span title="Official brand name of your hackathon product.">
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                </span>
              </div>
              <input
                type="text"
                value={s6.productIdentity.applicationName}
                onChange={(e) =>
                  setProject((prev) =>
                    prev
                      ? {
                          ...prev,
                          step6_productDesign: {
                            ...prev.step6_productDesign,
                            productIdentity: {
                              ...prev.step6_productDesign.productIdentity,
                              applicationName: e.target.value,
                            },
                          },
                        }
                      : prev
                  )
                }
                placeholder="e.g., MedTriage Rural AI"
                className="mt-1.5 w-full text-sm glass-input"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span>Product Tagline</span>
                <span title="One-sentence punchline for your pitch deck cover.">
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                </span>
              </div>
              <input
                type="text"
                value={s6.productIdentity.tagline}
                onChange={(e) =>
                  setProject((prev) =>
                    prev
                      ? {
                          ...prev,
                          step6_productDesign: {
                            ...prev.step6_productDesign,
                            productIdentity: {
                              ...prev.step6_productDesign.productIdentity,
                              tagline: e.target.value,
                            },
                          },
                        }
                      : prev
                  )
                }
                placeholder="e.g., 60-Second Multimodal Clinical Triage Copilot"
                className="mt-1.5 w-full text-sm glass-input"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span>Product Vision</span>
              </div>
              <textarea
                rows={2}
                value={s6.productIdentity.productVision}
                onChange={(e) =>
                  setProject((prev) =>
                    prev
                      ? {
                          ...prev,
                          step6_productDesign: {
                            ...prev.step6_productDesign,
                            productIdentity: {
                              ...prev.step6_productDesign.productIdentity,
                              productVision: e.target.value,
                            },
                          },
                        }
                      : prev
                  )
                }
                className="mt-1.5 w-full text-xs glass-input"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span>Unique Selling Proposition (USP)</span>
              </div>
              <textarea
                rows={2}
                value={s6.valueProposition.uniqueSellingProposition}
                onChange={(e) =>
                  setProject((prev) =>
                    prev
                      ? {
                          ...prev,
                          step6_productDesign: {
                            ...prev.step6_productDesign,
                            valueProposition: {
                              ...prev.step6_productDesign.valueProposition,
                              uniqueSellingProposition: e.target.value,
                            },
                          },
                        }
                      : prev
                  )
                }
                className="mt-1.5 w-full text-xs glass-input"
              />
            </div>
          </div>

          {/* Add New Feature Row */}
          <div className="border-t border-slate-200/70 dark:border-white/10 pt-4">
            <div className="text-xs font-bold mb-2">
              Add Feature to MoSCoW Matrix
            </div>
            <div className="grid gap-2.5 sm:grid-cols-12">
              <input
                type="text"
                placeholder="Feature Name *"
                value={newFeatName}
                onChange={(e) => setNewFeatName(e.target.value)}
                className="sm:col-span-3 text-xs glass-input py-2"
              />
              <input
                type="text"
                placeholder="Feature Description"
                value={newFeatDesc}
                onChange={(e) => setNewFeatDesc(e.target.value)}
                className="sm:col-span-4 text-xs glass-input py-2"
              />
              <select
                value={newFeatTier}
                onChange={(e) =>
                  setNewFeatTier(e.target.value as "MVP" | "CORE" | "FUTURE")
                }
                className="sm:col-span-2 text-xs glass-input py-2"
              >
                <option value="MVP" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">MVP Tier</option>
                <option value="CORE" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Core Tier</option>
                <option value="FUTURE" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Future Tier</option>
              </select>
              <select
                value={newFeatMoscow}
                onChange={(e) =>
                  setNewFeatMoscow(
                    e.target.value as ProductFeatureItem["moscow"]
                  )
                }
                className="sm:col-span-2 text-xs glass-input py-2"
              >
                {MOSCOW_COLUMNS.map((m) => (
                  <option key={m} value={m} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    {m}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addFeature}
                className="sm:col-span-1 btn-apple-primary py-2 px-3"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* [AI GENERATED OUTPUT PANEL] — INTERACTIVE 4-COLUMN MOSCOW KANBAN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              [AI Generated Output Panel] — Interactive MoSCoW Prioritization
              Kanban
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {MOSCOW_COLUMNS.map((col) => {
              const items = s6.features.filter((f) => f.moscow === col);
              const badgeStyle =
                col === "Must Have"
                  ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : col === "Should Have"
                  ? "text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
                  : col === "Could Have"
                  ? "text-amber-600 dark:text-amber-400 border-amber-500/30"
                  : "text-slate-500 border-slate-300/60 dark:border-white/10";

              return (
                <div
                  key={col}
                  className={`glass-panel rounded-2xl p-4 border-t-4 ${badgeStyle}`}
                >
                  <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider">
                    <span>{col}</span>
                    <span className="rounded-full bg-slate-200/80 dark:bg-white/10 px-2 py-0.5 text-[10px]">
                      {items.length}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {items.map((f) => (
                      <div key={f.id} className="glass-card rounded-xl p-3 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold">{f.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(f.id)}
                            className="text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                          {f.description}
                        </p>

                        {/* Interactive Priority Switcher */}
                        <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/70 dark:border-white/10 pt-2">
                          <span className="rounded bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
                            {f.tier}
                          </span>
                          <select
                            value={f.moscow}
                            onChange={(e) =>
                              updateFeaturePriority(
                                f.id,
                                e.target.value as ProductFeatureItem["moscow"]
                              )
                            }
                            className="rounded-lg border border-slate-300 dark:border-white/15 bg-white/80 dark:bg-black/40 px-2 py-0.5 text-[10px] font-semibold"
                          >
                            {MOSCOW_COLUMNS.map((m) => (
                              <option key={m} value={m} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                                Move: {m}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* UX Screens & Mermaid User Flow */}
          {s6.userExperience.mermaidUserFlow && (
            <>
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                  Main Application Screens & Key User Interactions
                </h3>
                <div className="grid gap-4 md:grid-cols-3 text-xs">
                  {s6.userExperience.mainApplicationScreens.map((sc, i) => (
                    <div key={i} className="glass-card rounded-xl p-4">
                      <div className="font-bold text-indigo-600 dark:text-indigo-300">
                        Screen {i + 1}: {sc.screenName}
                      </div>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">
                        {sc.purpose}
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-200/70 dark:border-white/10 text-[11px] text-slate-500">
                        Interactions: {sc.keyInteractions.join(" • ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <MermaidDiagram
                chart={s6.userExperience.mermaidUserFlow}
                title="Step 6: Interactive Mermaid.js User Flow Diagram"
              />
            </>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // STEP 7 — TECHNICAL ARCHITECTURE GENERATOR
  // ============================================================================
  if (activeStep === 7) {
    const s7 = project.step7_technicalArchitecture;

    const updateStackRow = (
      index: number,
      field: "layer" | "technology" | "rationale",
      val: string
    ) => {
      const updated = s7.techStackTable.map((row, i) =>
        i === index ? { ...row, [field]: val } : row
      );
      setProject((prev) =>
        prev
          ? {
              ...prev,
              step7_technicalArchitecture: {
                ...prev.step7_technicalArchitecture,
                techStackTable: updated,
              },
            }
          : prev
      );
    };

    const addStackRow = () => {
      setProject((prev) =>
        prev
          ? {
              ...prev,
              step7_technicalArchitecture: {
                ...prev.step7_technicalArchitecture,
                techStackTable: [
                  ...prev.step7_technicalArchitecture.techStackTable,
                  {
                    layer: "Cloud / Auth",
                    technology: "Vercel + Clerk / NextAuth",
                    rationale: "Zero-config edge deployment and role security.",
                  },
                ],
              },
            }
          : prev
      );
    };

    return (
      <div className="space-y-6">
        <PlanningHeaderCard
          stepNum={7}
          title="Technical Architecture & Editable Tech Stack Matrix"
          subtitle="Configure your 9-layer system architecture, editable Tech Stack justification matrix, and Mermaid.js System Diagram."
          whatItDoes="Recommends a pragmatic full-stack technology table (Frontend, Backend, DB, AI, Cloud, Auth), generates 9 comprehensive technical deliverables including security and risk mitigations, and renders a Mermaid.js System Architecture diagram."
          actionButton={
            <button
              type="button"
              onClick={() => onGenerate(7)}
              disabled={generatingStep === 7}
              className="btn-apple-primary text-xs"
            >
              <Cpu className="h-4 w-4" />
              <span>
                {generatingStep === 7
                  ? "Architecting System..."
                  : "Generate Technical Architecture"}
              </span>
            </button>
          }
        />

        {/* [USER INPUT PANEL] — 9 SYSTEM ARCHITECTURE LAYERS */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            [User Input Panel] — 9-Layer System Architecture Configuration
          </span>

          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            {(
              Object.keys(
                s7.systemArchitecture
              ) as (keyof typeof s7.systemArchitecture)[]
            ).map((key) => (
              <div key={key} className="glass-card rounded-xl p-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  value={s7.systemArchitecture[key]}
                  onChange={(e) =>
                    setProject((prev) =>
                      prev
                        ? {
                            ...prev,
                            step7_technicalArchitecture: {
                              ...prev.step7_technicalArchitecture,
                              systemArchitecture: {
                                ...prev.step7_technicalArchitecture
                                  .systemArchitecture,
                                [key]: e.target.value,
                              },
                            },
                          }
                        : prev
                    )
                  }
                  className="mt-1.5 w-full text-xs glass-input py-1.5 px-2.5"
                />
              </div>
            ))}
          </div>
        </div>

        {/* [AI GENERATED OUTPUT PANEL] — EDITABLE TECH STACK MATRIX TABLE */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 dark:border-white/10 pb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              [AI Generated Output Panel] — Editable Tech Stack Matrix Table
            </span>
            <button
              type="button"
              onClick={addStackRow}
              className="btn-glass-secondary px-2.5 py-1 text-[11px]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Layer Row</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-300/70 dark:border-white/10 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-2.5 w-1/5">Layer</th>
                  <th className="p-2.5 w-2/5">Recommended Technology</th>
                  <th className="p-2.5 w-2/5">Justification / Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-white/10">
                {s7.techStackTable.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.layer}
                        onChange={(e) =>
                          updateStackRow(idx, "layer", e.target.value)
                        }
                        className="w-full text-xs font-bold glass-input py-1.5 px-2.5"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.technology}
                        onChange={(e) =>
                          updateStackRow(idx, "technology", e.target.value)
                        }
                        className="w-full text-xs font-semibold text-indigo-600 dark:text-indigo-300 glass-input py-1.5 px-2.5"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.rationale}
                        onChange={(e) =>
                          updateStackRow(idx, "rationale", e.target.value)
                        }
                        className="w-full text-xs glass-input py-1.5 px-2.5"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 9 Technical Deliverables Grid */}
          {s7.deliverables.systemOverview && (
            <div className="grid gap-4 md:grid-cols-2 pt-3 text-xs">
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-600 dark:text-indigo-300">
                    1. System Overview & 2. Architecture Explanation
                  </span>
                  <CopyButton
                    text={`${s7.deliverables.systemOverview}\n${s7.deliverables.architectureExplanation}`}
                  />
                </div>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  {s7.deliverables.systemOverview}
                </p>
                <p className="mt-1.5 text-slate-500 dark:text-slate-400">
                  {s7.deliverables.architectureExplanation}
                </p>
              </div>

              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    4. Database Design & 5. API Integration Plan
                  </span>
                  <CopyButton
                    text={`${s7.deliverables.databaseDesign}\n${s7.deliverables.apiIntegrationPlan}`}
                  />
                </div>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  {s7.deliverables.databaseDesign}
                </p>
                <p className="mt-1.5 text-slate-500 dark:text-slate-400">
                  {s7.deliverables.apiIntegrationPlan}
                </p>
              </div>

              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-violet-600 dark:text-violet-300">
                    6. AI Integration Strategy & 7. Security
                  </span>
                  <CopyButton
                    text={`${s7.deliverables.aiIntegrationStrategy}\n${s7.deliverables.securityConsiderations}`}
                  />
                </div>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  {s7.deliverables.aiIntegrationStrategy}
                </p>
                <p className="mt-1.5 text-slate-500 dark:text-slate-400">
                  {s7.deliverables.securityConsiderations}
                </p>
              </div>

              <div className="glass-card rounded-xl p-4">
                <div className="font-bold text-amber-600 dark:text-amber-400">
                  8. Deployment & 9. Technical Risk Mitigations
                </div>
                <p className="mt-1.5 text-slate-600 dark:text-slate-300">
                  {s7.deliverables.deploymentStrategy}
                </p>
                <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-300">
                  {s7.deliverables.technicalRisks.map((r, i) => (
                    <li key={i}>
                      • <strong>{r.risk}</strong> ({r.severity}): {r.mitigation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {s7.mermaidSystemDiagram && (
          <MermaidDiagram
            chart={s7.mermaidSystemDiagram}
            title="Step 7: Interactive Mermaid.js System Architecture Diagram"
          />
        )}
      </div>
    );
  }

  // ============================================================================
  // STEP 8 — DEVELOPMENT TIMELINE GENERATOR
  // ============================================================================
  if (activeStep === 8) {
    const s8 = project.step8_developmentTimeline;

    const selectDurationPreset = async (dur: string) => {
      setProject((prev) =>
        prev
          ? {
              ...prev,
              step8_developmentTimeline: {
                ...prev.step8_developmentTimeline,
                totalDuration: dur,
              },
            }
          : prev
      );
      setTimeout(() => {
        onGenerate(8);
      }, 80);
    };

    const toggleMilestone = (id: string) => {
      const updated = s8.milestones.map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      );
      setProject((prev) =>
        prev
          ? {
              ...prev,
              step8_developmentTimeline: {
                ...prev.step8_developmentTimeline,
                milestones: updated,
              },
            }
          : prev
      );
    };

    return (
      <div className="space-y-6">
        <PlanningHeaderCard
          stepNum={8}
          title="Adaptive Development Timeline Generator"
          subtitle="Select your competition sprint duration (24-Hour, 48-Hour Weekend, 2 Weeks, 4 Weeks, or 8 Weeks) to dynamically scale milestones."
          whatItDoes="Adapts your implementation roadmap to your actual competition deadline and team roles—generating concrete objectives, task checklists, dependencies, and completion criteria."
          actionButton={
            <button
              type="button"
              onClick={() => onGenerate(8)}
              disabled={generatingStep === 8}
              className="btn-apple-primary text-xs"
            >
              <Calendar className="h-4 w-4" />
              <span>
                {generatingStep === 8
                  ? "Adapting Timeline..."
                  : "Regenerate Adaptive Roadmap"}
              </span>
            </button>
          }
        />

        {/* [USER INPUT PANEL] — DYNAMIC DURATION SELECTOR */}
        <div className="glass-panel rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              [User Input Panel] — Dynamic Sprint Duration Selector
            </span>
          </div>

          {/* 5 Duration Preset Pills */}
          <div className="flex flex-wrap gap-2">
            {DURATION_PRESETS.map((preset) => {
              const active = s8.totalDuration
                .toLowerCase()
                .includes(preset.split(" ")[0].toLowerCase());
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => selectDurationPreset(preset)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    active
                      ? "btn-apple-primary"
                      : "btn-glass-secondary"
                  }`}
                >
                  {preset}
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-semibold">
                Custom Duration Label
              </label>
              <input
                type="text"
                value={s8.totalDuration}
                onChange={(e) =>
                  setProject((prev) =>
                    prev
                      ? {
                          ...prev,
                          step8_developmentTimeline: {
                            ...prev.step8_developmentTimeline,
                            totalDuration: e.target.value,
                          },
                        }
                      : prev
                  )
                }
                className="mt-1.5 w-full text-xs glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold">Team Size</label>
              <input
                type="number"
                min={1}
                max={12}
                value={s8.teamSize}
                onChange={(e) =>
                  setProject((prev) =>
                    prev
                      ? {
                          ...prev,
                          step8_developmentTimeline: {
                            ...prev.step8_developmentTimeline,
                            teamSize: Number(e.target.value),
                          },
                        }
                      : prev
                  )
                }
                className="mt-1.5 w-full text-xs glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold">
                Submission Deadline
              </label>
              <input
                type="text"
                value={s8.developmentDeadline}
                onChange={(e) =>
                  setProject((prev) =>
                    prev
                      ? {
                          ...prev,
                          step8_developmentTimeline: {
                            ...prev.step8_developmentTimeline,
                            developmentDeadline: e.target.value,
                          },
                        }
                      : prev
                  )
                }
                className="mt-1.5 w-full text-xs glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold">
                Team Roles (comma-separated)
              </label>
              <input
                type="text"
                value={s8.teamRoles.join(", ")}
                onChange={(e) =>
                  setProject((prev) =>
                    prev
                      ? {
                          ...prev,
                          step8_developmentTimeline: {
                            ...prev.step8_developmentTimeline,
                            teamRoles: e.target.value
                              .split(",")
                              .map((r) => r.trim())
                              .filter(Boolean),
                          },
                        }
                      : prev
                  )
                }
                className="mt-1.5 w-full text-xs glass-input"
              />
            </div>
          </div>
        </div>

        {/* [AI GENERATED OUTPUT PANEL] — MILESTONES */}
        <div className="space-y-3">
          <span className="px-1 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            [AI Generated Output Panel] — Execution Roadmap Milestones
          </span>

          {s8.milestones.map((ms) => (
            <div key={ms.id} className="glass-panel rounded-2xl p-5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleMilestone(ms.id)}
                    className="text-indigo-600 dark:text-indigo-400"
                  >
                    {ms.completed ? (
                      <CheckSquare className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                  <span className="rounded-lg bg-indigo-500/15 px-2.5 py-1 font-mono font-bold text-indigo-600 dark:text-indigo-300 border border-indigo-500/25">
                    {ms.periodLabel}
                  </span>
                  <span className="text-sm font-extrabold">{ms.activity}</span>
                </div>
                <span className="rounded-lg bg-slate-200/70 dark:bg-white/10 px-3 py-1 text-[11px] font-semibold">
                  Role: {ms.responsibleRole}
                </span>
              </div>

              <p className="mt-2.5 text-slate-600 dark:text-slate-300">
                <strong>Objective:</strong> {ms.objective}
              </p>

              {ms.tasks && ms.tasks.length > 0 && (
                <ul className="mt-2 space-y-1 pl-4 list-disc text-slate-600 dark:text-slate-300">
                  {ms.tasks.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              )}

              <div className="mt-3 grid gap-2 sm:grid-cols-3 pt-2.5 border-t border-slate-200/70 dark:border-white/10 text-[11px]">
                <div>
                  <strong>Expected Output:</strong> {ms.expectedOutput}
                </div>
                <div>
                  <strong>Dependencies:</strong> {ms.dependencies}
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  <strong>Completion Criteria:</strong> {ms.completionCriteria}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // STEP 9 — COMPETITION DELIVERABLE GENERATOR
  // ============================================================================
  const s9 = project.step9_deliverables;
  const completedCount = s9.items.filter((d) => d.completed).length;
  const pct =
    s9.items.length > 0
      ? Math.round((completedCount / s9.items.length) * 100)
      : 0;

  // Progress Ring SVG math
  const r = 24;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  const toggleDeliverable = (id: string) => {
    const updated = s9.items.map((d) =>
      d.id === id ? { ...d, completed: !d.completed } : d
    );
    setProject((prev) =>
      prev
        ? {
            ...prev,
            step9_deliverables: {
              ...prev.step9_deliverables,
              items: updated,
            },
          }
        : prev
    );
  };

  const addCustomDeliverable = () => {
    if (!newDelivTitle.trim()) return;
    const item: DeliverableItem = {
      id: `deliv-custom-${Date.now()}`,
      title: newDelivTitle.trim(),
      category: "CUSTOM",
      responsibleRole: newDelivRole,
      deadline: newDelivDeadline,
      completed: false,
    };
    setProject((prev) =>
      prev
        ? {
            ...prev,
            step9_deliverables: {
              ...prev.step9_deliverables,
              items: [item, ...prev.step9_deliverables.items],
            },
          }
        : prev
    );
    setNewDelivTitle("");
  };

  const removeDeliverable = (id: string) => {
    setProject((prev) =>
      prev
        ? {
            ...prev,
            step9_deliverables: {
              ...prev.step9_deliverables,
              items: prev.step9_deliverables.items.filter((d) => d.id !== id),
            },
          }
        : prev
    );
  };

  return (
    <div className="space-y-6">
      <PlanningHeaderCard
        stepNum={9}
        title="Competition Deliverables Checklist"
        subtitle="Track Mandatory, Recommended, and Custom competition deliverables with progress ring and role assignments."
        whatItDoes="Organizes your submission package into Mandatory Deliverables (Pitch Deck, Working Demo, Source Code, GitHub Repo, System Architecture, Validation Report) and Recommended Deliverables so nothing is missed before deadline."
        actionButton={
          <div className="flex items-center gap-3 glass-card rounded-2xl px-4 py-2">
            <div className="relative h-14 w-14 flex items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 60 60">
                <circle
                  cx="30"
                  cy="30"
                  r={r}
                  stroke="currentColor"
                  strokeWidth="5"
                  fill="transparent"
                  className="text-slate-200 dark:text-white/10"
                />
                <circle
                  cx="30"
                  cy="30"
                  r={r}
                  stroke="#10B981"
                  strokeWidth="5"
                  strokeDasharray={circ}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-xs font-extrabold">{pct}%</span>
            </div>
            <div>
              <div className="text-xs font-bold">Submission Readiness</div>
              <div className="text-[11px] text-slate-500">
                {completedCount} of {s9.items.length} Completed
              </div>
            </div>
          </div>
        }
      />

      {/* [USER INPUT PANEL] — ADD CUSTOM DELIVERABLE */}
      <div className="glass-panel rounded-2xl p-6 space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          [User Input Panel] — Add Competition-Specific Deliverable
        </span>

        <div className="grid gap-2.5 sm:grid-cols-12">
          <input
            type="text"
            placeholder="Custom Deliverable Title (e.g., PKM-KC Logbook / Sponsor API Proof)..."
            value={newDelivTitle}
            onChange={(e) => setNewDelivTitle(e.target.value)}
            className="sm:col-span-5 text-xs glass-input py-2"
          />
          <input
            type="text"
            placeholder="Assignee Role"
            value={newDelivRole}
            onChange={(e) => setNewDelivRole(e.target.value)}
            className="sm:col-span-3 text-xs glass-input py-2"
          />
          <input
            type="text"
            placeholder="Deadline"
            value={newDelivDeadline}
            onChange={(e) => setNewDelivDeadline(e.target.value)}
            className="sm:col-span-3 text-xs glass-input py-2"
          />
          <button
            type="button"
            onClick={addCustomDeliverable}
            className="sm:col-span-1 btn-apple-primary py-2 px-3"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* DELIVERABLE LISTS: MANDATORY VS RECOMMENDED */}
      <div className="grid gap-6 lg:grid-cols-2">
        {(["MANDATORY", "RECOMMENDED", "CUSTOM"] as const).map((cat) => {
          const items = s9.items.filter((i) => i.category === cat);
          if (items.length === 0) return null;
          return (
            <div
              key={cat}
              className={`glass-panel rounded-2xl p-5 ${
                cat === "CUSTOM" ? "lg:col-span-2" : ""
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  <Layers className="h-4 w-4" />
                  <span>{cat} DELIVERABLES</span>
                </div>
                <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
                  {items.filter((i) => i.completed).length} / {items.length} Done
                </span>
              </div>

              <div className="space-y-2.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-wrap items-center justify-between gap-2 rounded-xl p-3 text-xs transition ${
                      item.completed
                        ? "border border-emerald-500/30 bg-emerald-500/10"
                        : "glass-card"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => toggleDeliverable(item.id)}
                      >
                        {item.completed ? (
                          <CheckSquare className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                      <span
                        className={`font-semibold ${
                          item.completed
                            ? "line-through text-slate-500"
                            : ""
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 font-medium text-indigo-600 dark:text-indigo-300">
                        {item.responsibleRole}
                      </span>
                      <span className="text-slate-500">{item.deadline}</span>
                      <button
                        type="button"
                        onClick={() => removeDeliverable(item.id)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
