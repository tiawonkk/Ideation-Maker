import { describe, it, expect } from "vitest";
import {
  calculateCompletionPercentage,
  calculateJudgeScore,
  DEFAULT_JUDGE_CRITERIA,
  validateCriteriaWeights,
} from "@/lib/scoring/judge-engine";
import {
  createBlankProject,
  deleteAuthorizedProject,
  duplicateAuthorizedProject,
  getAuthorizedProject,
  readDb,
  saveAuthorizedProject,
  writeDb,
} from "@/lib/db";
import {
  compileStep10FinalBrief,
  generateStep1ThemeAnalysis,
  generateStep2CriteriaAnalysis,
  generateStep3ProblemDiscovery,
  generateStep5Solutions,
  generateStep6ProductDesign,
  generateStep7Architecture,
  generateStep8Timeline,
} from "@/lib/ai/generators";
import { buildProblemValidationReport } from "@/lib/research/evidence-service";

describe("Hackathon Brief Generator AI — Core Engine & Acceptance Tests", () => {
  it("validates judge criteria weights must equal 100%", () => {
    expect(validateCriteriaWeights(DEFAULT_JUDGE_CRITERIA).valid).toBe(true);
    expect(validateCriteriaWeights(DEFAULT_JUDGE_CRITERIA).total).toBe(100);

    const invalid = [
      { id: "1", name: "Innovation", weight: 40, description: "" },
      { id: "2", name: "Impact", weight: 40, description: "" },
    ];
    const res = validateCriteriaWeights(invalid);
    expect(res.valid).toBe(false);
    expect(res.total).toBe(80);
  });

  it("calculates weighted Judge Score accurately and identifies weakest category", () => {
    const proj = createBlankProject("user-test", "Test User", {
      title: "Test Project",
      competitionName: "Gemini API Challenge",
      theme: "AI for Healthcare",
    });

    const score = calculateJudgeScore(proj);
    expect(score.overallScore).toBeGreaterThan(0);
    expect(score.categories.length).toBe(5);

    const sumWeighted =
      Math.round(
        score.categories.reduce((acc, c) => acc + c.weightedScore, 0) * 100
      ) / 100;
    expect(score.overallScore).toBeCloseTo(sumWeighted, 1);
    expect(score.weakestCategory).toBeTruthy();
    expect(score.confidenceWarning).toContain("empirical research citations");
  });

  it("enforces strict server-side authorization so users cannot access other users' private projects", () => {
    const db = readDb();
    const ownerId = db.users[0].id;
    const rivalId = db.users[1].id;

    const newProj = createBlankProject(ownerId, "Owner", {
      title: "Private Stealth Hackathon Project",
    });
    db.projects.unshift(newProj);
    writeDb(db);

    // Owner can read
    const ownerRead = getAuthorizedProject(newProj.id, ownerId);
    expect(ownerRead.status).toBe(200);
    expect(ownerRead.project?.title).toBe("Private Stealth Hackathon Project");

    // Rival user is blocked with 403
    const rivalRead = getAuthorizedProject(newProj.id, rivalId);
    expect(rivalRead.status).toBe(403);

    // Rival user cannot update, duplicate, or delete
    expect(
      saveAuthorizedProject(newProj.id, rivalId, { title: "Hacked" }).status
    ).toBe(403);
    expect(duplicateAuthorizedProject(newProj.id, rivalId).status).toBe(403);
    expect(deleteAuthorizedProject(newProj.id, rivalId).status).toBe(403);

    // Owner can duplicate and delete
    const dup = duplicateAuthorizedProject(newProj.id, ownerId);
    expect(dup.status).toBe(200);
    expect(dup.project?.title).toContain("(Copy)");

    if (dup.project) {
      expect(deleteAuthorizedProject(dup.project.id, ownerId).status).toBe(200);
    }
    expect(deleteAuthorizedProject(newProj.id, ownerId).status).toBe(200);
  });

  it("executes all 10 workflow step generators and preserves user edits in Final Brief", () => {
    const proj = createBlankProject("user-owner-1", "Christian Immanuel Valerio", {
      title: "AgriGuard AI",
      competitionName: "GEMASTIK",
      theme: "Food Security & Smart Agriculture",
      domain: "AgriTech",
      targetTech: "Next.js, Gemini Vision, PostgreSQL",
    });

    // Step 1
    proj.step1_competition.analysis = generateStep1ThemeAnalysis(proj);
    expect(
      proj.step1_competition.analysis.recommendedInnovationDirections.length
    ).toBeGreaterThan(0);

    // Step 2
    proj.step2_judgeCriteria = generateStep2CriteriaAnalysis(proj);
    expect(proj.step2_judgeCriteria.overallInterpretation).toBeTruthy();

    // Step 3
    proj.step3_problemDiscovery.whoExperiences = "Smallholder rice farmers";
    proj.step3_problemDiscovery.biggestDifficulty =
      "identifying early crop blight before harvest loss";
    proj.step3_problemDiscovery.whyInsufficient =
      "manual inspection is slow and laboratory testing is unavailable in rural villages";
    proj.step3_problemDiscovery.impact = "30% preventable crop yield loss";
    proj.step3_problemDiscovery.analysis = generateStep3ProblemDiscovery(proj);
    expect(proj.step3_problemDiscovery.analysis.problemStatement).toContain(
      "experiences"
    );
    expect(proj.step3_problemDiscovery.analysis.problemStatement).toContain(
      "because"
    );
    expect(proj.step3_problemDiscovery.analysis.problemStatement).toContain(
      "resulting in"
    );

    // Step 4
    proj.step4_evidenceValidation.evidenceItems = [
      {
        id: "ev-test-1",
        finding: "Crop pests and diseases account for substantial global yield losses.",
        supportingStatistic: "20% to 40% of global crop production lost to pests annually (FAO).",
        sourceTitle: "Plant Health and Food Security",
        sourceOrganization: "Food and Agriculture Organization (FAO)",
        publicationDate: "2023",
        originalSourceUrl: "https://www.fao.org/plant-health/en",
        evidenceType: "Government Statistics",
        relevanceToProblem: "Validates crop loss scale.",
        businessOrSocialOpportunity: "Early detection saves farmer income.",
        evidenceStrength: "Strong Evidence",
        isVerifiedExternal: true,
      },
    ];
    proj.step4_evidenceValidation.report = buildProblemValidationReport(
      proj,
      proj.step4_evidenceValidation.evidenceItems
    );
    expect(proj.step4_evidenceValidation.report.deskVsCustomerDistinction).toContain(
      "Secondary Desk Research"
    );

    // Step 5
    proj.step5_solutionGenerator = generateStep5Solutions(proj);
    expect(proj.step5_solutionGenerator.alternatives.length).toBe(3);

    // Step 6
    proj.step6_productDesign = generateStep6ProductDesign(proj);
    expect(proj.step6_productDesign.features.length).toBeGreaterThan(0);
    expect(proj.step6_productDesign.userExperience.mermaidUserFlow).toContain(
      "flowchart"
    );

    // Step 7
    proj.step7_technicalArchitecture = generateStep7Architecture(proj);
    expect(proj.step7_technicalArchitecture.mermaidSystemDiagram).toContain(
      "flowchart"
    );

    // Step 8
    proj.step8_developmentTimeline = generateStep8Timeline(proj);
    expect(proj.step8_developmentTimeline.milestones.length).toBe(5);

    // Step 10 & Rule #8 (Preserve user edits)
    proj.step10_finalBrief = compileStep10FinalBrief(proj);
    expect(proj.step10_finalBrief.sections.section1_executiveSummary).toContain(
      "AgriGuard"
    );

    // Simulate user editing section1_executiveSummary
    proj.step10_finalBrief.sections.section1_executiveSummary =
      "CUSTOM USER EDITED EXECUTIVE SUMMARY";
    proj.step10_finalBrief.editedSections.section1_executiveSummary = true;

    // Recompile whole brief -> user edit on section 1 must be preserved!
    const recompiled = compileStep10FinalBrief(proj);
    expect(recompiled.sections.section1_executiveSummary).toBe(
      "CUSTOM USER EDITED EXECUTIVE SUMMARY"
    );

    // Completion percentage should now be 100%
    proj.step10_finalBrief = recompiled;
    expect(calculateCompletionPercentage(proj)).toBe(100);
  });
});
