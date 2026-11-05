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
  const [newFeatMoscow, setNewFeatMoscow] = useState<
    "Must Have" | "Should Have" | "Could Have" | "Won't Have Yet"
  >("Must Have");

  const [newDelivTitle, setNewDelivTitle] = useState("");
  const [newDelivRole, setNewDelivRole] = useState("Product Manager");
  const [newDelivDeadline, setNewDelivDeadline] = useState(
    "H-6 Hours before submission"
  );

  // ============================================================================
  // STEP 6 — PRODUCT DESIGN GENERATOR
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
        <div className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Step 6 of 10
              </span>
              <h2 className="text-xl font-bold text-white">
                Product Design, MoSCoW Scope & User Flow
              </h2>
              <p className="text-xs text-slate-400">
                Define Product Identity, Value Proposition, MVP/Core/Future
                features, and Mermaid User Flows.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onGenerate(6)}
              disabled={generatingStep === 6}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {generatingStep === 6
                  ? "Generating Product Strategy..."
                  : "Generate Product Design & User Flow"}
              </span>
            </button>
          </div>

          {/* Product Identity & Value Prop */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Application Name
              </label>
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
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Tagline
              </label>
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
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Product Vision
              </label>
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
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Unique Selling Proposition (USP)
              </label>
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
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Feature Planning (MVP / Core / Future + MoSCoW) */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Feature Prioritization (MVP / Core / Future & MoSCoW)
              </h3>
            </div>

            {/* Add Feature Bar */}
            <div className="mt-3 grid gap-2 sm:grid-cols-12 rounded-xl border border-white/10 bg-[#090a0f] p-3">
              <input
                type="text"
                placeholder="Feature Name"
                value={newFeatName}
                onChange={(e) => setNewFeatName(e.target.value)}
                className="sm:col-span-3 rounded-lg border border-white/10 bg-[#11131c] px-3 py-1.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Feature Description"
                value={newFeatDesc}
                onChange={(e) => setNewFeatDesc(e.target.value)}
                className="sm:col-span-4 rounded-lg border border-white/10 bg-[#11131c] px-3 py-1.5 text-xs text-white"
              />
              <select
                value={newFeatTier}
                onChange={(e) =>
                  setNewFeatTier(e.target.value as "MVP" | "CORE" | "FUTURE")
                }
                className="sm:col-span-2 rounded-lg border border-white/10 bg-[#11131c] px-2 py-1.5 text-xs text-white"
              >
                <option value="MVP">MVP Feature</option>
                <option value="CORE">Core Feature</option>
                <option value="FUTURE">Future Feature</option>
              </select>
              <select
                value={newFeatMoscow}
                onChange={(e) =>
                  setNewFeatMoscow(
                    e.target.value as ProductFeatureItem["moscow"]
                  )
                }
                className="sm:col-span-2 rounded-lg border border-white/10 bg-[#11131c] px-2 py-1.5 text-xs text-white"
              >
                <option value="Must Have">Must Have</option>
                <option value="Should Have">Should Have</option>
                <option value="Could Have">Could Have</option>
                <option value="Won't Have Yet">Won&apos;t Have Yet</option>
              </select>
              <button
                type="button"
                onClick={addFeature}
                className="sm:col-span-1 flex items-center justify-center rounded-lg bg-indigo-600 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Feature Columns by Tier */}
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {(["MVP", "CORE", "FUTURE"] as const).map((tier) => {
                const items = s6.features.filter((f) => f.tier === tier);
                const tierColor =
                  tier === "MVP"
                    ? "text-emerald-400 border-emerald-500/30"
                    : tier === "CORE"
                    ? "text-indigo-400 border-indigo-500/30"
                    : "text-slate-400 border-white/10";
                return (
                  <div
                    key={tier}
                    className={`rounded-xl border bg-[#090a0f] p-4 ${tierColor}`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                      <span>{tier} Features</span>
                      <span>{items.length}</span>
                    </div>
                    <div className="mt-3 space-y-2.5">
                      {items.map((f) => (
                        <div
                          key={f.id}
                          className="rounded-lg border border-white/10 bg-[#11131c] p-3 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-white">
                              {f.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFeature(f.id)}
                              className="text-slate-500 hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="mt-1 text-slate-400">{f.description}</p>
                          <span className="mt-2 inline-block rounded bg-white/5 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                            MoSCoW: {f.moscow}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Experience & Mermaid User Flow */}
        {s6.userExperience.mermaidUserFlow && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
              <h3 className="text-sm font-bold text-white mb-4">
                User Journey & Application Screens
              </h3>
              <div className="grid gap-4 md:grid-cols-3 text-xs">
                {s6.userExperience.mainApplicationScreens.map((sc, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-[#090a0f] p-4"
                  >
                    <div className="font-bold text-indigo-300">
                      Screen {i + 1}: {sc.screenName}
                    </div>
                    <p className="mt-1 text-slate-300">{sc.purpose}</p>
                    <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-slate-400">
                      Interactions: {sc.keyInteractions.join(" • ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <MermaidDiagram
              chart={s6.userExperience.mermaidUserFlow}
              title="Step 6: User Experience & Interaction Flow"
            />
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // STEP 7 — TECHNICAL ARCHITECTURE GENERATOR
  // ============================================================================
  if (activeStep === 7) {
    const s7 = project.step7_technicalArchitecture;

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Step 7 of 10
              </span>
              <h2 className="text-xl font-bold text-white">
                Technical Architecture & System Blueprint
              </h2>
              <p className="text-xs text-slate-400">
                Generate full-stack technology recommendations, 9 technical
                deliverables, risk mitigations, and Mermaid architecture
                diagrams.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onGenerate(7)}
              disabled={generatingStep === 7}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              <Cpu className="h-4 w-4" />
              <span>
                {generatingStep === 7
                  ? "Designing Architecture..."
                  : "Generate Technical Architecture"}
              </span>
            </button>
          </div>

          {/* 9 System Architecture Layers */}
          <div className="mt-5 grid gap-3 sm:grid-cols-3 text-xs">
            {(
              Object.keys(
                s7.systemArchitecture
              ) as (keyof typeof s7.systemArchitecture)[]
            ).map((key) => (
              <div
                key={key}
                className="rounded-xl border border-white/10 bg-[#090a0f] p-3.5"
              >
                <label className="block text-[10px] font-bold uppercase tracking-wider text-indigo-400">
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
                  className="mt-1.5 w-full rounded border border-white/10 bg-[#11131c] px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            ))}
          </div>

          {/* Tech Stack Recommendation Table */}
          {s7.techStackTable.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Technology Stack Recommendation Table
              </h3>
              <table className="w-full border-collapse rounded-xl overflow-hidden text-xs">
                <thead>
                  <tr className="bg-[#090a0f] text-left text-slate-400 border-b border-white/10">
                    <th className="p-3">Layer</th>
                    <th className="p-3">Recommended Technology</th>
                    <th className="p-3">Architectural Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-[#090a0f]/50">
                  {s7.techStackTable.map((row, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-semibold text-indigo-300">
                        {row.layer}
                      </td>
                      <td className="p-3 font-bold text-white">
                        {row.technology}
                      </td>
                      <td className="p-3 text-slate-300">{row.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 9 Technical Deliverables */}
          {s7.deliverables.systemOverview && (
            <div className="mt-6 grid gap-4 md:grid-cols-2 text-xs">
              <div className="rounded-xl border border-white/10 bg-[#090a0f] p-4">
                <div className="font-bold text-indigo-400">
                  1. System Overview & 2. Architecture Explanation
                </div>
                <p className="mt-1.5 text-slate-300">
                  {s7.deliverables.systemOverview}
                </p>
                <p className="mt-2 text-slate-400">
                  {s7.deliverables.architectureExplanation}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#090a0f] p-4">
                <div className="font-bold text-emerald-400">
                  4. Database Design & 5. API Integration Plan
                </div>
                <p className="mt-1.5 text-slate-300">
                  {s7.deliverables.databaseDesign}
                </p>
                <p className="mt-2 text-slate-400">
                  {s7.deliverables.apiIntegrationPlan}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#090a0f] p-4">
                <div className="font-bold text-violet-400">
                  6. AI Integration Strategy & 7. Security Considerations
                </div>
                <p className="mt-1.5 text-slate-300">
                  {s7.deliverables.aiIntegrationStrategy}
                </p>
                <p className="mt-2 text-slate-400">
                  {s7.deliverables.securityConsiderations}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#090a0f] p-4">
                <div className="font-bold text-amber-400">
                  8. Deployment Strategy & 9. Technical Risks
                </div>
                <p className="mt-1 text-slate-300">
                  {s7.deliverables.deploymentStrategy}
                </p>
                <ul className="mt-2 space-y-1 text-slate-300">
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
            title="Step 7: Full-Stack System Architecture Diagram"
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
        <div className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Step 8 of 10
              </span>
              <h2 className="text-xl font-bold text-white">
                Adaptive Development Timeline Generator
              </h2>
              <p className="text-xs text-slate-400">
                Tailor your execution roadmap to your exact competition
                duration (e.g., 24 Hours, 48 Hours, 2 Weeks, or 8 Weeks).
              </p>
            </div>
            <button
              type="button"
              onClick={() => onGenerate(8)}
              disabled={generatingStep === 8}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              <Calendar className="h-4 w-4" />
              <span>
                {generatingStep === 8
                  ? "Adapting Roadmap..."
                  : "Generate Adaptive Roadmap"}
              </span>
            </button>
          </div>

          {/* Duration & Team Configuration */}
          <div className="mt-5 grid gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Total Project Duration
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
                placeholder="e.g., 48 Hours / 2 Weeks / 8 Weeks"
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Team Size
              </label>
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
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
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
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
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
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Milestones List */}
          <div className="mt-6 space-y-3">
            {s8.milestones.map((ms) => (
              <div
                key={ms.id}
                className="rounded-xl border border-white/10 bg-[#090a0f] p-4 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => toggleMilestone(ms.id)}
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      {ms.completed ? (
                        <CheckSquare className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                    <span className="rounded bg-indigo-500/20 px-2 py-0.5 font-mono font-bold text-indigo-300">
                      {ms.periodLabel}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {ms.activity}
                    </span>
                  </div>
                  <span className="rounded bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
                    Owner: {ms.responsibleRole}
                  </span>
                </div>

                <p className="mt-2 text-slate-300">
                  <strong>Objective:</strong> {ms.objective}
                </p>

                <div className="mt-2 grid gap-2 sm:grid-cols-3 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                  <div>
                    <strong className="text-slate-300">Expected Output:</strong>{" "}
                    {ms.expectedOutput}
                  </div>
                  <div>
                    <strong className="text-slate-300">Dependencies:</strong>{" "}
                    {ms.dependencies}
                  </div>
                  <div>
                    <strong className="text-emerald-300">
                      Completion Criteria:
                    </strong>{" "}
                    {ms.completionCriteria}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      <div className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Step 9 of 10
            </span>
            <h2 className="text-xl font-bold text-white">
              Competition Deliverable Checklist
            </h2>
            <p className="text-xs text-slate-400">
              Track Mandatory, Recommended, and Custom competition submission
              artifacts with role assignments and deadlines.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-emerald-400">
              Readiness: {completedCount}/{s9.items.length} ({pct}%)
            </div>
            <div className="mt-1 h-2 w-36 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Add Custom Deliverable */}
        <div className="mt-5 grid gap-2 sm:grid-cols-12 rounded-xl border border-white/10 bg-[#090a0f] p-3">
          <input
            type="text"
            placeholder="Add Custom Competition Deliverable (e.g., Ethics Declaration Form)..."
            value={newDelivTitle}
            onChange={(e) => setNewDelivTitle(e.target.value)}
            className="sm:col-span-5 rounded-lg border border-white/10 bg-[#11131c] px-3 py-2 text-xs text-white"
          />
          <input
            type="text"
            placeholder="Responsible Role"
            value={newDelivRole}
            onChange={(e) => setNewDelivRole(e.target.value)}
            className="sm:col-span-3 rounded-lg border border-white/10 bg-[#11131c] px-3 py-2 text-xs text-white"
          />
          <input
            type="text"
            placeholder="Deadline"
            value={newDelivDeadline}
            onChange={(e) => setNewDelivDeadline(e.target.value)}
            className="sm:col-span-3 rounded-lg border border-white/10 bg-[#11131c] px-3 py-2 text-xs text-white"
          />
          <button
            type="button"
            onClick={addCustomDeliverable}
            className="sm:col-span-1 flex items-center justify-center rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Deliverables Grouped by Category */}
        <div className="mt-6 space-y-6">
          {(["CUSTOM", "MANDATORY", "RECOMMENDED"] as const).map((cat) => {
            const items = s9.items.filter((i) => i.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2.5">
                  <Layers className="h-3.5 w-3.5" />
                  <span>{cat} DELIVERABLES</span>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5 text-xs transition ${
                        item.completed
                          ? "border-emerald-500/30 bg-emerald-950/15"
                          : "border-white/10 bg-[#090a0f]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleDeliverable(item.id)}
                        >
                          {item.completed ? (
                            <CheckSquare className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                        <span
                          className={`font-semibold ${
                            item.completed
                              ? "line-through text-slate-400"
                              : "text-white"
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>Role: {item.responsibleRole}</span>
                        <span>•</span>
                        <span>Due: {item.deadline}</span>
                        <button
                          type="button"
                          onClick={() => removeDeliverable(item.id)}
                          className="text-slate-500 hover:text-red-400"
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
    </div>
  );
}
