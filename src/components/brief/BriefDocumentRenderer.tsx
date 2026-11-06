"use client";

import React, { useState } from "react";
import { FinalBriefSections, Project } from "@/types/project";
import { compileStep10FinalBrief } from "@/lib/ai/generators";
import { MermaidDiagram } from "@/components/workspace/MermaidDiagram";
import {
  Printer,
  RefreshCw,
  Edit3,
  Check,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Download,
  Columns,
  FileText,
  Info,
  ChevronDown,
  ChevronUp,
  Copy,
} from "lucide-react";

export const BRIEF_SECTION_META: {
  key: keyof FinalBriefSections;
  numberLabel: string;
  title: string;
}[] = [
  {
    key: "section1_executiveSummary",
    numberLabel: "Section 1",
    title: "Executive Summary",
  },
  {
    key: "section2_problemValidation",
    numberLabel: "Section 2",
    title: "Problem Validation",
  },
  {
    key: "section3_marketOpportunity",
    numberLabel: "Section 3",
    title: "Market Opportunity",
  },
  {
    key: "section4_solutionOverview",
    numberLabel: "Section 4",
    title: "Solution Overview",
  },
  {
    key: "section5_productFeaturesMvp",
    numberLabel: "Section 5",
    title: "Product Features and MVP Scope",
  },
  {
    key: "section6_userJourneyFlow",
    numberLabel: "Section 6",
    title: "User Journey and User Flow",
  },
  {
    key: "section7_systemArchitecture",
    numberLabel: "Section 7",
    title: "System Architecture",
  },
  {
    key: "section8_technologyStack",
    numberLabel: "Section 8",
    title: "Technology Stack",
  },
  {
    key: "section9_developmentTimeline",
    numberLabel: "Section 9",
    title: "Development Timeline",
  },
  {
    key: "section10_competitionDeliverables",
    numberLabel: "Section 10",
    title: "Competition Deliverables",
  },
  {
    key: "section11_riskAnalysis",
    numberLabel: "Section 11",
    title: "Risk Analysis",
  },
  {
    key: "section12_judgeAlignmentScore",
    numberLabel: "Section 12",
    title: "Judge Alignment Score",
  },
  {
    key: "section13_winningStrategy",
    numberLabel: "Section 13",
    title: "Winning Strategy",
  },
  {
    key: "appendix_references",
    numberLabel: "Appendix A",
    title: "Research References",
  },
  {
    key: "appendix_statistics",
    numberLabel: "Appendix B",
    title: "Supporting Statistics",
  },
  {
    key: "appendix_technicalNotes",
    numberLabel: "Appendix C",
    title: "Additional Technical Notes",
  },
  {
    key: "appendix_glossary",
    numberLabel: "Appendix D",
    title: "Glossary",
  },
];

export function auditMissingBriefItems(project: Project): string[] {
  const warnings: string[] = [];
  if (!project.step1_competition?.name || !project.step1_competition?.theme) {
    warnings.push("Step 1: Competition Name or Theme is missing.");
  }
  if (!project.step3_problemDiscovery?.analysis?.problemStatement) {
    warnings.push(
      "Step 3: Structured Problem Statement has not been generated."
    );
  }
  if ((project.step4_evidenceValidation?.evidenceItems?.length || 0) === 0) {
    warnings.push(
      "Step 4: No verifiable research citations attached (Evidence Validation is mandatory)."
    );
  }
  if (!project.step5_solutionGenerator?.selectedSolutionId) {
    warnings.push(
      "Step 5: No winning solution alternative has been selected."
    );
  }
  if ((project.step6_productDesign?.features?.length || 0) === 0) {
    warnings.push(
      "Step 6: Product MVP features & MoSCoW prioritization are missing."
    );
  }
  if (!project.step7_technicalArchitecture?.systemArchitecture?.frontend) {
    warnings.push("Step 7: System Architecture & Tech Stack are incomplete.");
  }
  if ((project.step8_developmentTimeline?.milestones?.length || 0) === 0) {
    warnings.push("Step 8: Development Timeline milestones are missing.");
  }
  return warnings;
}

interface BriefDocumentRendererProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  onSave: (
    updates: Partial<Project>,
    triggerLabel?: string,
    silent?: boolean
  ) => Promise<Project | null>;
  onRegenerateSection: (sectionKey?: keyof FinalBriefSections) => Promise<void>;
  isGenerating?: boolean;
}

export function BriefDocumentRenderer({
  project,
  setProject,
  onSave,
  onRegenerateSection,
  isGenerating,
}: BriefDocumentRendererProps) {
  const [viewMode, setViewMode] = useState<"split" | "editor" | "a4preview">(
    "split"
  );
  const [editingKey, setEditingKey] = useState<keyof FinalBriefSections | null>(
    null
  );
  const [openInfo, setOpenInfo] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const brief = project.step10_finalBrief || compileStep10FinalBrief(project);
  const missingWarnings = auditMissingBriefItems(project);

  const handleUpdateSectionText = (
    key: keyof FinalBriefSections,
    value: string
  ) => {
    const updatedBrief = {
      ...brief,
      sections: {
        ...brief.sections,
        [key]: value,
      },
      editedSections: {
        ...brief.editedSections,
        [key]: true,
      },
    };
    setProject((prev) =>
      prev ? { ...prev, step10_finalBrief: updatedBrief } : prev
    );
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadPrintableHtml = () => {
    const el = document.getElementById("a4-printable-brief");
    if (!el) return;
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${brief.cover.projectName} — Hackathon Project Brief</title>
<style>
  @page { size: A4 portrait; margin: 16mm; }
  body { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; line-height: 1.55; max-width: 210mm; margin: 0 auto; padding: 12mm; }
  h1, h2, h3, h4 { color: #1e1b4b; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; }
  th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
  th { background: #f1f5f9; }
  a { color: #4338ca; text-decoration: underline; }
  pre { white-space: pre-wrap; background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; }
</style>
</head>
<body>${el.innerHTML}</body>
</html>`;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brief.cover.projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}-brief.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Control Toolbar (Hidden in Print) */}
      <div className="glass-panel rounded-2xl p-6 no-print">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-indigo-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-300 border border-indigo-500/25">
                STEP 10 OF 10
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
            <h2 className="text-xl font-extrabold tracking-tight">
              Final Project Brief & Live A4 PDF Preview
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Edit sections on the left while inspecting your live A4
              Print-Ready PDF sheet on the right.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Segmented Switcher */}
            <div className="flex rounded-xl border border-slate-300/80 dark:border-white/10 bg-slate-200/60 dark:bg-black/30 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                  viewMode === "split"
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-600 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Columns className="h-3.5 w-3.5" />
                <span>Split View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("editor")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                  viewMode === "editor"
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-600 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("a4preview")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                  viewMode === "a4preview"
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-600 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>A4 Sheet</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRegenerateSection(undefined)}
              disabled={isGenerating}
              className="btn-glass-secondary"
              title="Recompile unedited sections from Steps 1–9 while preserving manual user edits"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>
                {isGenerating ? "Compiling..." : "Compile All Sections"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPrintableHtml}
              className="btn-glass-secondary"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download HTML</span>
            </button>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="btn-apple-primary text-xs"
            >
              <Printer className="h-4 w-4" />
              <span>Export to PDF</span>
            </button>
          </div>
        </div>

        {openInfo && (
          <div className="mt-4 rounded-xl border border-indigo-500/25 bg-indigo-500/[0.07] p-3.5 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
            <strong className="text-indigo-600 dark:text-indigo-300">
              AI Strategist Logic:{" "}
            </strong>
            Compiles all 10 workflow steps into a formal 13-section + 4-appendix
            A4 Project Brief. Any section you manually edit is marked{" "}
            <em>User Edited (Preserved)</em> and protected during full brief
            recompilation.
          </div>
        )}

        {/* Completeness Audit Banner */}
        <div className="mt-4">
          {missingWarnings.length === 0 ? (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                Pre-Export Audit Passed: All 10 workflow modules and verifiable
                research citations are complete and ready for A4 PDF export.
              </span>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-200">
              <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  Pre-Export Completeness Audit ({missingWarnings.length}{" "}
                  item(s) flagged):
                </span>
              </div>
              <ul className="mt-1.5 space-y-1 pl-5 list-disc">
                {missingWarnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* SPLIT-SCREEN / EDITOR / A4 PREVIEW CONTAINER */}
      <div
        className={
          viewMode === "split"
            ? "grid gap-6 xl:grid-cols-12 items-start"
            : "space-y-6"
        }
      >
        {/* LEFT PANE: SECTION-BY-SECTION EDITOR */}
        {(viewMode === "split" || viewMode === "editor") && (
          <div
            className={`space-y-4 no-print ${
              viewMode === "split" ? "xl:col-span-5" : ""
            }`}
          >
            {/* Cover Page Metadata Editor */}
            <div className="glass-panel rounded-2xl p-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                [Section Editor] — Cover Page Metadata
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                {(
                  Object.keys(brief.cover) as (keyof typeof brief.cover)[]
                ).map((k) => (
                  <div key={k}>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {k.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type="text"
                      value={brief.cover[k]}
                      onChange={(e) => {
                        const nextBrief = {
                          ...brief,
                          cover: { ...brief.cover, [k]: e.target.value },
                        };
                        setProject((prev) =>
                          prev
                            ? { ...prev, step10_finalBrief: nextBrief }
                            : prev
                        );
                      }}
                      className="mt-1 w-full text-xs glass-input py-1.5 px-2.5"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 13 Sections + 4 Appendix Editors */}
            {BRIEF_SECTION_META.map((sec) => {
              const isEdited = Boolean(brief.editedSections?.[sec.key]);
              const isCurrentEditing = editingKey === sec.key;

              return (
                <div key={sec.key} className="glass-panel rounded-2xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 dark:border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
                        {sec.numberLabel}
                      </span>
                      <h4 className="text-xs font-extrabold">{sec.title}</h4>
                      {isEdited && (
                        <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-300">
                          Edited
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingKey(isCurrentEditing ? null : sec.key)
                        }
                        className="btn-glass-secondary px-2 py-1 text-[10px]"
                      >
                        {isCurrentEditing ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" />
                            <span>Done</span>
                          </>
                        ) : (
                          <>
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onRegenerateSection(sec.key)}
                        disabled={isGenerating}
                        className="btn-glass-secondary px-2 py-1 text-[10px]"
                        title="Regenerate this section"
                      >
                        <RefreshCw className="h-3 w-3 text-indigo-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            brief.sections[sec.key]
                          );
                          setCopiedKey(sec.key);
                          setTimeout(() => setCopiedKey(null), 1500);
                        }}
                        className="btn-glass-secondary px-2 py-1 text-[10px]"
                        title="Copy section text"
                      >
                        {copiedKey === sec.key ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isCurrentEditing ? (
                    <div className="mt-3">
                      <textarea
                        rows={6}
                        value={brief.sections[sec.key]}
                        onChange={(e) =>
                          handleUpdateSectionText(sec.key, e.target.value)
                        }
                        className="w-full text-xs leading-relaxed glass-input"
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            onSave(
                              { step10_finalBrief: brief },
                              `Edited ${sec.numberLabel}: ${sec.title}`
                            );
                            setEditingKey(null);
                          }}
                          className="btn-apple-primary py-1.5 px-3 text-xs"
                        >
                          Save Section Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <pre className="mt-2.5 whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {brief.sections[sec.key]}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* RIGHT PANE: LIVE A4 PRINT-READY PDF PREVIEW */}
        <div
          id="a4-printable-brief"
          className={`a4-document-container mx-auto w-full max-w-[210mm] rounded-2xl border border-slate-300 bg-white p-8 sm:p-10 text-slate-900 shadow-2xl ${
            viewMode === "editor"
              ? "hidden print:block"
              : viewMode === "split"
              ? "xl:col-span-7 block"
              : "block"
          }`}
        >
          {/* COVER PAGE */}
          <div className="border-b-4 border-indigo-900 pb-8 mb-8 print-avoid-break">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-indigo-700">
              <span>HACKATHON PROJECT STRATEGY BRIEF</span>
              <span>A4 EDITORIAL EDITION • V1.0</span>
            </div>

            <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 leading-tight">
              {brief.cover.projectName}
            </h1>
            <p className="mt-2 text-sm sm:text-base font-medium text-indigo-800">
              {brief.cover.projectTagline}
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3.5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Competition Name
                </div>
                <div className="mt-0.5 font-bold text-slate-900">
                  {brief.cover.competitionName}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Competition Theme
                </div>
                <div className="mt-0.5 font-semibold text-slate-900">
                  {brief.cover.competitionTheme}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Team Name
                </div>
                <div className="mt-0.5 font-semibold text-slate-900">
                  {brief.cover.teamName}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Prepared By
                </div>
                <div className="mt-0.5 font-semibold text-slate-900">
                  {brief.cover.preparedBy}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Date Prepared
                </div>
                <div className="mt-0.5 font-semibold text-slate-900">
                  {brief.cover.date}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  AI Estimated Readiness
                </div>
                <div className="mt-0.5 text-sm font-extrabold text-indigo-900">
                  {project.judgeScore.overallScore.toFixed(2)} / 100
                </div>
              </div>
            </div>
          </div>

          {/* TABLE OF CONTENTS */}
          <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-5 print-avoid-break">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
              Table of Contents
            </h2>
            <div className="mt-2.5 grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
              {BRIEF_SECTION_META.map((sec, idx) => (
                <div
                  key={sec.key}
                  className="flex items-center justify-between border-b border-dotted border-slate-300 py-1"
                >
                  <span className="font-medium text-slate-800">
                    <strong>{sec.numberLabel}:</strong> {sec.title}
                  </span>
                  <span className="font-mono text-slate-500">
                    p. {Math.min(12, Math.floor(idx / 2) + 1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTIONS 1 TO 13 + APPENDIX */}
          <div className="space-y-6">
            {BRIEF_SECTION_META.map((sec, idx) => (
              <section
                key={sec.key}
                className="border-b border-slate-200 pb-5 print-avoid-break"
              >
                <div className="flex items-baseline justify-between">
                  <h2 className="text-sm font-extrabold text-indigo-950">
                    <span className="text-indigo-700 mr-1.5">
                      {sec.numberLabel} —
                    </span>
                    {sec.title}
                  </h2>
                  <span className="text-[10px] font-mono text-slate-400">
                    [{idx + 1}/17]
                  </span>
                </div>

                <div className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-slate-800">
                  {brief.sections[sec.key]}
                </div>

                {sec.key === "section6_userJourneyFlow" &&
                  project.step6_productDesign?.userExperience
                    ?.mermaidUserFlow && (
                    <div className="mt-3">
                      <MermaidDiagram
                        chart={
                          project.step6_productDesign.userExperience
                            .mermaidUserFlow
                        }
                        title="User Flow Diagram"
                        printLight={true}
                      />
                    </div>
                  )}

                {sec.key === "section7_systemArchitecture" &&
                  project.step7_technicalArchitecture?.mermaidSystemDiagram && (
                    <div className="mt-3">
                      <MermaidDiagram
                        chart={
                          project.step7_technicalArchitecture
                            .mermaidSystemDiagram
                        }
                        title="System Architecture Diagram"
                        printLight={true}
                      />
                    </div>
                  )}

                {sec.key === "section8_technologyStack" &&
                  (project.step7_technicalArchitecture?.techStackTable
                    ?.length || 0) > 0 && (
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full border-collapse border border-slate-300 text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-900">
                            <th className="border border-slate-300 p-2 text-left">
                              Layer
                            </th>
                            <th className="border border-slate-300 p-2 text-left">
                              Technology
                            </th>
                            <th className="border border-slate-300 p-2 text-left">
                              Rationale
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.step7_technicalArchitecture.techStackTable.map(
                            (row, rIdx) => (
                              <tr key={rIdx}>
                                <td className="border border-slate-300 p-2 font-semibold">
                                  {row.layer}
                                </td>
                                <td className="border border-slate-300 p-2 font-bold text-indigo-900">
                                  {row.technology}
                                </td>
                                <td className="border border-slate-300 p-2">
                                  {row.rationale}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                {sec.key === "section12_judgeAlignmentScore" && (
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-300 text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-900">
                          <th className="border border-slate-300 p-2 text-left">
                            Judging Criterion
                          </th>
                          <th className="border border-slate-300 p-2 text-right">
                            Weight
                          </th>
                          <th className="border border-slate-300 p-2 text-right">
                            Raw Score
                          </th>
                          <th className="border border-slate-300 p-2 text-right">
                            Weighted Points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.judgeScore.categories.map((cat, cIdx) => (
                          <tr key={cIdx}>
                            <td className="border border-slate-300 p-2 font-semibold">
                              {cat.category}
                            </td>
                            <td className="border border-slate-300 p-2 text-right">
                              {cat.weight}%
                            </td>
                            <td className="border border-slate-300 p-2 text-right">
                              {cat.rawScore}/100
                            </td>
                            <td className="border border-slate-300 p-2 text-right font-bold text-indigo-900">
                              {cat.weightedScore.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-indigo-50 font-extrabold text-indigo-950">
                          <td
                            colSpan={3}
                            className="border border-slate-300 p-2 text-right"
                          >
                            AI Estimated Competition Readiness Score:
                          </td>
                          <td className="border border-slate-300 p-2 text-right">
                            {project.judgeScore.overallScore.toFixed(2)} / 100
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {sec.key === "appendix_references" &&
                  (project.step4_evidenceValidation?.evidenceItems?.length ||
                    0) > 0 && (
                    <div className="mt-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
                      <div className="font-bold text-slate-900">
                        Direct Clickable Citation Links:
                      </div>
                      {project.step4_evidenceValidation.evidenceItems.map(
                        (ev, eIdx) => (
                          <div
                            key={ev.id}
                            className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-1.5 last:border-none"
                          >
                            <span className="font-medium text-slate-800">
                              [{eIdx + 1}] {ev.sourceTitle} (
                              {ev.sourceOrganization}, {ev.publicationDate})
                            </span>
                            <a
                              href={ev.originalSourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-indigo-700 underline"
                            >
                              <span>{ev.originalSourceUrl}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </section>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-300 pt-3 text-[10px] text-slate-500">
            <span>
              Generated by Hackathon Brief Generator AI (Ideation-Maker V1.0)
            </span>
            <span>
              {brief.cover.projectName} • {brief.cover.teamName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
