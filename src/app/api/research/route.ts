import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAuthorizedProject, saveAuthorizedProject } from "@/lib/db";
import {
  buildProblemValidationReport,
  searchRealAcademicEvidence,
} from "@/lib/research/evidence-service";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const body = await req.json();
    const { projectId, query } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
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
    const effectiveQuery =
      query?.trim() ||
      project.step4_evidenceValidation?.searchQuery ||
      `${project.step1_competition?.domain || ""} ${
        project.step3_problemDiscovery?.biggestDifficulty ||
        project.step1_competition?.theme ||
        "artificial intelligence workflow"
      }`.trim();

    const newEvidence = await searchRealAcademicEvidence(
      effectiveQuery,
      project.step3_problemDiscovery?.analysis?.problemStatement ||
        project.step3_problemDiscovery?.biggestDifficulty
    );

    // Preserve existing user-curated evidence items and append new unique URLs
    const existing = project.step4_evidenceValidation?.evidenceItems || [];
    const existingUrls = new Set(existing.map((e) => e.originalSourceUrl));
    const mergedEvidence = [
      ...existing,
      ...newEvidence.filter((e) => !existingUrls.has(e.originalSourceUrl)),
    ];

    const updatedReport = buildProblemValidationReport(project, mergedEvidence);

    const updatedHistory = [
      ...(project.aiHistory || []),
      {
        id: `hist-${Date.now()}`,
        stepNumber: 4,
        moduleName: "Evidence Validation Engine (Live Research)",
        providerMode: "STRATEGIST_DEV_ENGINE" as const,
        timestamp: new Date().toISOString(),
        summary: `Retrieved ${newEvidence.length} verifiable research sources for query "${effectiveQuery}".`,
      },
    ];

    const saved = saveAuthorizedProject(
      project.id,
      user.id,
      {
        step4_evidenceValidation: {
          searchQuery: effectiveQuery,
          evidenceItems: mergedEvidence,
          report: updatedReport,
        },
        aiHistory: updatedHistory,
      },
      "Step 4: Evidence Research Validated"
    );

    return NextResponse.json({
      project: saved.project,
      addedCount: newEvidence.length,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Research lookup failed" },
      { status: 500 }
    );
  }
}
