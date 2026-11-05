"use client";

import React, { useState } from "react";
import { FinalBriefSections, Project } from "@/types/project";
import { compileStep10FinalBrief } from "@/lib/ai/generators";
import { MermaidDiagram } from "@/components/workspace/MermaidDiagram";
import {
  FileText,
  Printer,
  RefreshCw,
  Edit3,
  Check,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Download,
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
    warnings.push("Step 3: Structured Problem Statement has not been generated.");
  }
  if ((project.step4_evidenceValidation?.evidenceItems?.length || 0) === 0) {
    warnings.push(
      "Step 4: No verifiable research citations attached (Evidence Validation is mandatory)."
    );
  }
  if (!project.step5_solutionGenerator?.selectedSolutionId) {
    warnings.push("Step 5: No winning solution alternative has been selected.");
  }
  if ((project.step6_productDesign?.features?.length || 0) === 0) {
    warnings.push("Step 6: Product MVP features & MoSCoW prioritization are missing.");
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
  const [viewMode, setViewMode] = useState<"editor" | "a4preview">("a4preview");
  const [editingKey, setEditingKey] = useState<keyof FinalBriefSections | null>(
    null
  );

  // Ensure brief exists by compiling on the fly if not yet compiled
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
    setViewMode("a4preview");
    setTimeout(() => {
      window.print();
    }, 150);
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
      <div className="rounded-2xl border border-white/10 bg-[#11131c] p-5 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Step 10 • Final Project Brief & PDF Export Engine
            </span>
            <h2 className="text-xl font-bold text-white">
              {brief.cover.projectName}
            </h2>
            <p className="text-xs text-slate-400">
              Edit individual sections, verify missing evidence, preview A4
              editorial layout, and export to PDF.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Mode Switcher */}
            <div className="flex rounded-xl border border-white/10 bg-[#090a0f] p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode("a4preview")}
                className={`rounded-lg px-3.5 py-1.5 transition ${
                  viewMode === "a4preview"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                A4 PDF Preview
              </button>
              <button
                type="button"
                onClick={() => setViewMode("editor")}
                className={`rounded-lg px-3.5 py-1.5 transition ${
                  viewMode === "editor"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Section-by-Section Editor
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRegenerateSection(undefined)}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 disabled:opacity-50"
              title="Recompiles unedited sections from Steps 1-9 while preserving your manual section edits"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {isGenerating ? "Compiling..." : "Compile / Refresh Brief"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPrintableHtml}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Brief Bundle</span>
            </button>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500"
            >
              <Printer className="h-4 w-4" />
              <span>Export A4 PDF</span>
            </button>
          </div>
        </div>

        {/* Completeness & Missing Evidence Audit Banner */}
        <div className="mt-4">
          {missingWarnings.length === 0 ? (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                Pre-Export Audit Passed: All 10 workflow modules and verifiable
                research citations are complete and ready for pitching.
              </span>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  Pre-Export Completeness Audit ({missingWarnings.length} item(s)
                  flagged):
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

      {/* ==================================================================== */}
      {/* MODE 1: INTERACTIVE SECTION-BY-SECTION EDITOR                        */}
      {/* ==================================================================== */}
      {viewMode === "editor" && (
        <div className="space-y-4 no-print">
          {/* Cover Metadata Editor */}
          <div className="rounded-2xl border border-white/10 bg-[#11131c] p-5">
            <h3 className="text-sm font-bold text-white mb-3">
              Cover Page Metadata
            </h3>
            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              {(
                Object.keys(brief.cover) as (keyof typeof brief.cover)[]
              ).map((k) => (
                <div key={k}>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400">
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
                        prev ? { ...prev, step10_finalBrief: nextBrief } : prev
                      );
                    }}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-1.5 text-xs text-white"
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
              <div
                key={sec.key}
                className="rounded-2xl border border-white/10 bg-[#11131c] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-indigo-500/20 px-2 py-0.5 font-mono text-xs font-bold text-indigo-300">
                      {sec.numberLabel}
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {sec.title}
                    </h4>
                    {isEdited && (
                      <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        User Edited (Preserved)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingKey(isCurrentEditing ? null : sec.key)
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1 text-xs text-slate-200 hover:bg-white/10"
                    >
                      {isCurrentEditing ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Done</span>
                        </>
                      ) : (
                        <>
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Edit Section</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRegenerateSection(sec.key)}
                      disabled={isGenerating}
                      className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-300 hover:bg-indigo-500/20"
                      title="Regenerate only this section from project data"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                </div>

                {isCurrentEditing ? (
                  <div className="mt-3">
                    <textarea
                      rows={7}
                      value={brief.sections[sec.key]}
                      onChange={(e) =>
                        handleUpdateSectionText(sec.key, e.target.value)
                      }
                      className="w-full rounded-xl border border-indigo-500/40 bg-[#090a0f] p-3.5 text-xs leading-relaxed text-white focus:outline-none"
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
                        className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                      >
                        Save Section Edit
                      </button>
                    </div>
                  </div>
                ) : (
                  <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-200">
                    {brief.sections[sec.key]}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 2: EDITORIAL A4 DOCUMENT PREVIEW & PRINT TARGET                 */}
      {/* ==================================================================== */}
      <div
        id="a4-printable-brief"
        className={`a4-document-container mx-auto max-w-[210mm] rounded-xl border border-slate-300 bg-white p-8 sm:p-12 text-slate-900 shadow-2xl ${
          viewMode === "editor" ? "hidden print:block" : "block"
        }`}
      >
        {/* COVER PAGE */}
        <div className="border-b-4 border-indigo-900 pb-10 mb-10 print-avoid-break">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-indigo-700">
            <span>HACKATHON PROJECT STRATEGY BRIEF</span>
            <span>CONFIDENTIAL & PITCH-READY • V1.0</span>
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
            {brief.cover.projectName}
          </h1>
          <p className="mt-3 text-base sm:text-lg font-medium text-indigo-800">
            {brief.cover.projectTagline}
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 text-xs">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Competition Name
              </div>
              <div className="mt-1 font-bold text-slate-900">
                {brief.cover.competitionName}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Competition Theme
              </div>
              <div className="mt-1 font-semibold text-slate-900">
                {brief.cover.competitionTheme}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Team Name
              </div>
              <div className="mt-1 font-semibold text-slate-900">
                {brief.cover.teamName}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Prepared By
              </div>
              <div className="mt-1 font-semibold text-slate-900">
                {brief.cover.preparedBy}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Date Prepared
              </div>
              <div className="mt-1 font-semibold text-slate-900">
                {brief.cover.date}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                AI Estimated Competition Readiness Score
              </div>
              <div className="mt-1 text-base font-extrabold text-indigo-900">
                {project.judgeScore.overallScore.toFixed(2)} / 100
              </div>
            </div>
          </div>
        </div>

        {/* TABLE OF CONTENTS */}
        <div className="mb-10 rounded-xl border border-slate-200 bg-slate-50 p-6 print-avoid-break">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
            Table of Contents
          </h2>
          <div className="mt-3 grid sm:grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
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
        <div className="space-y-8">
          {BRIEF_SECTION_META.map((sec, idx) => (
            <section
              key={sec.key}
              className="border-b border-slate-200 pb-6 print-avoid-break"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-base font-extrabold text-indigo-950">
                  <span className="text-indigo-700 mr-2">
                    {sec.numberLabel} —
                  </span>
                  {sec.title}
                </h2>
                <span className="text-[10px] font-mono text-slate-400">
                  [{idx + 1}/17]
                </span>
              </div>

              <div className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-slate-800">
                {brief.sections[sec.key]}
              </div>

              {/* Embed Mermaid User Flow in Section 6 */}
              {sec.key === "section6_userJourneyFlow" &&
                project.step6_productDesign?.userExperience
                  ?.mermaidUserFlow && (
                  <div className="mt-4">
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

              {/* Embed Mermaid System Architecture in Section 7 */}
              {sec.key === "section7_systemArchitecture" &&
                project.step7_technicalArchitecture?.mermaidSystemDiagram && (
                  <div className="mt-4">
                    <MermaidDiagram
                      chart={
                        project.step7_technicalArchitecture.mermaidSystemDiagram
                      }
                      title="System Architecture Diagram"
                      printLight={true}
                    />
                  </div>
                )}

              {/* Embed Tech Stack Table in Section 8 */}
              {sec.key === "section8_technologyStack" &&
                (project.step7_technicalArchitecture?.techStackTable?.length ||
                  0) > 0 && (
                  <div className="mt-4 overflow-x-auto">
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

              {/* Embed Judge Score Table in Section 12 */}
              {sec.key === "section12_judgeAlignmentScore" && (
                <div className="mt-4 overflow-x-auto">
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

              {/* Clickable Source URLs in Appendix A */}
              {sec.key === "appendix_references" &&
                (project.step4_evidenceValidation?.evidenceItems?.length || 0) >
                  0 && (
                  <div className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
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
                            [{eIdx + 1}] {ev.sourceTitle} ({ev.sourceOrganization}
                            , {ev.publicationDate})
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

        {/* Document Footer */}
        <div className="mt-10 flex items-center justify-between border-t border-slate-300 pt-4 text-[10px] text-slate-500">
          <span>
            Generated by Hackathon Brief Generator AI (Ideation-Maker V1.0)
          </span>
          <span>
            {brief.cover.projectName} • {brief.cover.teamName}
          </span>
        </div>
      </div>
    </div>
  );
}
