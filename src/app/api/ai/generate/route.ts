import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAuthorizedProject, saveAuthorizedProject } from "@/lib/db";
import {
  callExternalLLMJson,
  compileStep10FinalBrief,
  generateStep1ThemeAnalysis,
  generateStep2CriteriaAnalysis,
  generateStep3ProblemDiscovery,
  generateStep5Solutions,
  generateStep6ProductDesign,
  generateStep7Architecture,
  generateStep8Timeline,
} from "@/lib/ai/generators";
import {
  buildProblemValidationReport,
  searchRealAcademicEvidence,
} from "@/lib/research/evidence-service";
import { FinalBriefSections, Project } from "@/types/project";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const body = await req.json();
    const { projectId, stepNumber, aiConfig, customPayload } = body;

    if (!projectId || !stepNumber) {
      return NextResponse.json(
        { error: "projectId and stepNumber are required" },
        { status: 400 }
      );
    }

    const authResult = getAuthorizedProject(projectId, user.id);
    if (authResult.status !== 200 || !authResult.project) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const project = authResult.project;
    let providerMode: "GEMINI_LIVE" | "OPENAI_LIVE" | "STRATEGIST_DEV_ENGINE" =
      "STRATEGIST_DEV_ENGINE";
    const updates: Partial<Project> = {};
    let moduleName = `Step ${stepNumber}`;
    let summary = "Generated structured strategy output.";

    if (stepNumber === 1) {
      moduleName = "Competition Theme Analyzer";
      const fallback = generateStep1ThemeAnalysis(project);
      const llmRes = await callExternalLLMJson<typeof fallback>(
        `Analyze this hackathon theme and return JSON matching keys: themeBreakdown, relevantIndustries[{name,relevanceWhy}], mainChallenges[], technologyOpportunities[{tech,opportunityWhy}], potentialProblemAreas[{area,relevanceWhy}], judgeFocusAreas[], recommendedInnovationDirections[{title,description,whyRelevant}]. Input: ${JSON.stringify(
          project.step1_competition
        )}`,
        aiConfig
      );
      const analysis = llmRes?.data?.themeBreakdown ? llmRes.data : fallback;
      if (llmRes) providerMode = llmRes.providerMode;

      updates.step1_competition = {
        ...project.step1_competition,
        analysis,
      };
      summary = `Analyzed theme "${project.step1_competition.theme}" across 7 strategic dimensions.`;
    } else if (stepNumber === 2) {
      moduleName = "Judge Criteria Engine";
      const criteriaData = generateStep2CriteriaAnalysis(project);
      updates.step2_judgeCriteria = criteriaData;
      summary = `Mapped ${criteriaData.criteria.length} judging criteria (100% weight) to strategic priorities.`;
    } else if (stepNumber === 3) {
      moduleName = "Problem Discovery Engine";
      const fallback = generateStep3ProblemDiscovery(project);
      const llmRes = await callExternalLLMJson<typeof fallback>(
        `Generate structured Problem Discovery JSON matching keys: targetUser, userPersona{name,role,demographics,goals[],frustrations[],quote}, painPoints[], currentAlternatives[{name,limitation}], problemSeverity, problemFrequency, problemStatement ("[Target user] experiences [specific problem] because [root cause], resulting in [measurable impact]."), rootCauseAnalysis[], validationDisclaimer. Do not invent user interviews. Input: ${JSON.stringify(
          project.step3_problemDiscovery
        )}`,
        aiConfig
      );
      const analysis = llmRes?.data?.problemStatement ? llmRes.data : fallback;
      if (llmRes) providerMode = llmRes.providerMode;

      updates.step3_problemDiscovery = {
        ...project.step3_problemDiscovery,
        analysis,
      };
      summary = "Generated structured Problem Statement, Persona, and Root Cause Analysis.";
    } else if (stepNumber === 4) {
      moduleName = "Evidence Validation Engine";
      const query =
        (customPayload?.query as string) ||
        project.step4_evidenceValidation?.searchQuery ||
        `${project.step1_competition?.domain || ""} ${
          project.step3_problemDiscovery?.biggestDifficulty ||
          project.step1_competition?.theme ||
          "digital workflow efficiency"
        }`.trim();

      const newItems = await searchRealAcademicEvidence(
        query,
        project.step3_problemDiscovery?.analysis?.problemStatement
      );
      const existing = project.step4_evidenceValidation?.evidenceItems || [];
      const existingUrls = new Set(existing.map((e) => e.originalSourceUrl));
      const mergedItems = [
        ...existing,
        ...newItems.filter((e) => !existingUrls.has(e.originalSourceUrl)),
      ];
      const report = buildProblemValidationReport(project, mergedItems);

      updates.step4_evidenceValidation = {
        searchQuery: query,
        evidenceItems: mergedItems,
        report,
      };
      summary = `Validated problem with ${mergedItems.length} verifiable research citations and generated 8-part Problem Validation Report.`;
    } else if (stepNumber === 5) {
      moduleName = "Solution Generator";
      const solData = generateStep5Solutions(project);
      updates.step5_solutionGenerator = solData;
      summary = `Generated 3 distinct solution alternatives and selected recommended option "${solData.alternatives[0]?.name}".`;
    } else if (stepNumber === 6) {
      moduleName = "Product Design Generator";
      const prodData = generateStep6ProductDesign(project);
      updates.step6_productDesign = prodData;
      summary = `Generated Product Identity, Value Proposition, ${prodData.features.length} MoSCoW Features, and Mermaid User Flow.`;
    } else if (stepNumber === 7) {
      moduleName = "Technical Architecture Generator";
      const archData = generateStep7Architecture(project);
      updates.step7_technicalArchitecture = archData;
      summary =
        "Generated System Architecture, Tech Stack Table, 9 Technical Deliverables, and Mermaid System Diagram.";
    } else if (stepNumber === 8) {
      moduleName = "Development Timeline Generator";
      const timelineData = generateStep8Timeline(project);
      updates.step8_developmentTimeline = timelineData;
      summary = `Generated ${timelineData.milestones.length} adaptive milestones for duration "${timelineData.totalDuration}".`;
    } else if (stepNumber === 9) {
      moduleName = "Competition Deliverable Generator";
      updates.step9_deliverables = {
        ...project.step9_deliverables,
        competitionSpecificNotes:
          project.step9_deliverables.competitionSpecificNotes ||
          `Prioritize mandatory deliverables for ${
            project.step1_competition?.name || "the competition"
          } and align the 3-minute live demo with your highest-weighted judging criteria.`,
      };
      summary = "Synchronized Competition Deliverable Checklist.";
    } else if (stepNumber === 10) {
      moduleName = "Final Project Brief Generator";
      const regenKey = customPayload?.regenerateSectionKey as
        | keyof FinalBriefSections
        | undefined;
      const briefData = compileStep10FinalBrief(project, regenKey);
      updates.step10_finalBrief = briefData;
      summary = regenKey
        ? `Regenerated section "${regenKey}" while preserving other user edits.`
        : "Compiled all 13 sections + Research Appendix into Final Project Brief.";
    }

    updates.aiHistory = [
      ...(project.aiHistory || []),
      {
        id: `hist-${Date.now()}`,
        stepNumber,
        moduleName,
        providerMode,
        timestamp: new Date().toISOString(),
        summary,
      },
    ];

    const saved = saveAuthorizedProject(
      project.id,
      user.id,
      updates,
      `Step ${stepNumber}: ${moduleName} Generated`
    );

    return NextResponse.json({
      project: saved.project,
      providerMode,
      summary,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI Generation failed" },
      { status: 500 }
    );
  }
}
