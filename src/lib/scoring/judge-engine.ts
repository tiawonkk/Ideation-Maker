import {
  CategoryScoreDetail,
  JudgeCriterionItem,
  JudgeScoreSnapshot,
  Project,
} from "@/types/project";

export const DEFAULT_JUDGE_CRITERIA: JudgeCriterionItem[] = [
  {
    id: "crit-innovation",
    name: "Innovation",
    weight: 30,
    description: "Novelty of approach, creative use of target technology, and differentiation from existing tools.",
  },
  {
    id: "crit-impact",
    name: "Impact",
    weight: 30,
    description: "Measurable real-world value, problem severity, market/social scale, and evidence validation.",
  },
  {
    id: "crit-feasibility",
    name: "Feasibility",
    weight: 15,
    description: "Realistic MVP scope, achievable timeline within hackathon deadline, and operational viability.",
  },
  {
    id: "crit-technical",
    name: "Technical Excellence",
    weight: 15,
    description: "Sound system architecture, appropriate tech stack, AI integration depth, and risk mitigation.",
  },
  {
    id: "crit-presentation",
    name: "Presentation",
    weight: 10,
    description: "Clarity of problem statement, completeness of competition deliverables, and pitch readiness.",
  },
];

export function validateCriteriaWeights(criteria: JudgeCriterionItem[]): {
  valid: boolean;
  total: number;
  error?: string;
} {
  if (!criteria || criteria.length === 0) {
    return { valid: false, total: 0, error: "At least one judging criterion is required." };
  }
  const total = Math.round(criteria.reduce((acc, item) => acc + (Number(item.weight) || 0), 0) * 100) / 100;
  if (Math.abs(total - 100) > 0.01) {
    return {
      valid: false,
      total,
      error: `Total weight must equal 100% (currently ${total}%).`,
    };
  }
  return { valid: true, total: 100 };
}

export function calculateCompletionPercentage(project: Partial<Project>): number {
  let completedSteps = 0;

  if (project.step1_competition?.name && project.step1_competition?.theme && project.step1_competition?.analysis) {
    completedSteps += 1;
  }
  if (
    project.step2_judgeCriteria?.criteria?.length &&
    validateCriteriaWeights(project.step2_judgeCriteria.criteria).valid
  ) {
    completedSteps += 1;
  }
  if (project.step3_problemDiscovery?.whoExperiences && project.step3_problemDiscovery?.analysis?.problemStatement) {
    completedSteps += 1;
  }
  if ((project.step4_evidenceValidation?.evidenceItems?.length || 0) > 0) {
    completedSteps += 1;
  }
  if (
    (project.step5_solutionGenerator?.alternatives?.length || 0) >= 3 &&
    project.step5_solutionGenerator?.selectedSolutionId
  ) {
    completedSteps += 1;
  }
  if (
    project.step6_productDesign?.productIdentity?.applicationName &&
    (project.step6_productDesign?.features?.length || 0) > 0
  ) {
    completedSteps += 1;
  }
  if (
    project.step7_technicalArchitecture?.systemArchitecture?.frontend &&
    project.step7_technicalArchitecture?.mermaidSystemDiagram
  ) {
    completedSteps += 1;
  }
  if ((project.step8_developmentTimeline?.milestones?.length || 0) > 0) {
    completedSteps += 1;
  }
  if ((project.step9_deliverables?.items?.length || 0) > 0) {
    completedSteps += 1;
  }
  if (project.step10_finalBrief?.sections?.section1_executiveSummary) {
    completedSteps += 1;
  }

  return Math.min(100, Math.round((completedSteps / 10) * 100));
}

function evaluateDimensionRawScore(
  criterionName: string,
  project: Partial<Project>
): {
  rawScore: number;
  reasoning: string;
  completeness: "Complete" | "Partial" | "Insufficient";
  suggestions: string[];
} {
  const lower = criterionName.toLowerCase();
  const suggestions: string[] = [];

  // Map custom or standard criterion names to domain evaluators
  if (lower.includes("innov") || lower.includes("creativ") || lower.includes("novel") || lower.includes("diff")) {
    let score = 20;
    const reasons: string[] = [];
    let completeness: "Complete" | "Partial" | "Insufficient" = "Insufficient";

    if (project.step1_competition?.analysis?.recommendedInnovationDirections?.length) {
      score += 20;
      completeness = "Partial";
      reasons.push("Theme innovation directions identified.");
    } else {
      suggestions.push("Run Step 1 Theme Analyzer to align with competition innovation angles.");
    }

    const selectedSol =
      project.step5_solutionGenerator?.customizedSolution ||
      project.step5_solutionGenerator?.alternatives?.find(
        (a) => a.id === project.step5_solutionGenerator?.selectedSolutionId
      );

    if (selectedSol) {
      score += 30;
      completeness = "Partial";
      reasons.push(`Selected solution "${selectedSol.name}" defines clear innovation & differentiation.`);
    } else {
      suggestions.push("Generate and select a differentiated solution concept in Step 5.");
    }

    if (project.step6_productDesign?.valueProposition?.uniqueSellingProposition) {
      score += 20;
      completeness = "Complete";
      reasons.push("Unique Selling Proposition (USP) and competitive differentiation articulated in Step 6.");
    } else {
      suggestions.push("Complete Step 6 Product Design to sharpen your Unique Selling Proposition.");
    }

    return {
      rawScore: Math.min(96, score),
      reasoning:
        reasons.length > 0
          ? reasons.join(" ")
          : "Insufficient innovation data. Complete Theme Analysis (Step 1) and Solution Selection (Step 5).",
      completeness,
      suggestions,
    };
  }

  if (
    lower.includes("impact") ||
    lower.includes("value") ||
    lower.includes("problem") ||
    lower.includes("market") ||
    lower.includes("social") ||
    lower.includes("business")
  ) {
    let score = 15;
    const reasons: string[] = [];
    let completeness: "Complete" | "Partial" | "Insufficient" = "Insufficient";

    if (project.step3_problemDiscovery?.analysis?.problemStatement) {
      score += 28;
      completeness = "Partial";
      reasons.push("Structured problem statement and root-cause analysis defined.");
    } else {
      suggestions.push("Define a measurable Problem Statement with root causes in Step 3.");
    }

    const evidenceCount = project.step4_evidenceValidation?.evidenceItems?.length || 0;
    const verifiedCount =
      project.step4_evidenceValidation?.evidenceItems?.filter((e) => e.isVerifiedExternal).length || 0;

    if (evidenceCount >= 3) {
      score += 35;
      completeness = "Complete";
      reasons.push(
        `Backed by ${evidenceCount} research citations (${verifiedCount} externally verified sources) in Step 4.`
      );
    } else if (evidenceCount > 0) {
      score += 20;
      completeness = "Partial";
      reasons.push(`Includes ${evidenceCount} research citation(s); add at least 3 sources for stronger validation.`);
      suggestions.push("Add at least 3 verifiable research citations in Step 4 (Evidence Validation Engine).");
    } else {
      suggestions.push("Run Step 4 Evidence Validation Engine to back your problem claim with real citations.");
    }

    if (project.step4_evidenceValidation?.report?.marketOrSocialImpact) {
      score += 14;
    }

    return {
      rawScore: Math.min(96, score),
      reasoning:
        reasons.length > 0
          ? reasons.join(" ")
          : "No validated problem statement or research citations found yet.",
      completeness,
      suggestions,
    };
  }

  if (lower.includes("feasib") || lower.includes("viab") || lower.includes("exec") || lower.includes("scope")) {
    let score = 20;
    const reasons: string[] = [];
    let completeness: "Complete" | "Partial" | "Insufficient" = "Insufficient";

    const mvpFeatures =
      project.step6_productDesign?.features?.filter((f) => f.tier === "MVP" || f.moscow === "Must Have") || [];
    if (mvpFeatures.length > 0 && mvpFeatures.length <= 6) {
      score += 32;
      completeness = "Partial";
      reasons.push(`Well-scoped MVP with ${mvpFeatures.length} essential Must-Have features.`);
    } else if (mvpFeatures.length > 6) {
      score += 20;
      completeness = "Partial";
      reasons.push(`MVP has ${mvpFeatures.length} features, which may be over-scoped for a hackathon.`);
      suggestions.push("Trim MVP Must-Have features in Step 6 to 3–5 core features for realistic delivery.");
    } else {
      suggestions.push("Prioritize MVP features using the MoSCoW framework in Step 6.");
    }

    const milestones = project.step8_developmentTimeline?.milestones || [];
    if (milestones.length > 0) {
      score += 32;
      completeness = "Complete";
      reasons.push(
        `Execution roadmap planned across ${milestones.length} milestones (${project.step8_developmentTimeline?.totalDuration || "configured duration"}).`
      );
    } else {
      suggestions.push("Generate a realistic Development Timeline in Step 8 adapted to your deadline.");
    }

    return {
      rawScore: Math.min(95, score),
      reasoning:
        reasons.length > 0
          ? reasons.join(" ")
          : "MVP scope (Step 6) and Development Timeline (Step 8) have not been defined yet.",
      completeness,
      suggestions,
    };
  }

  if (
    lower.includes("tech") ||
    lower.includes("arch") ||
    lower.includes("eng") ||
    lower.includes("ai") ||
    lower.includes("code")
  ) {
    let score = 18;
    const reasons: string[] = [];
    let completeness: "Complete" | "Partial" | "Insufficient" = "Insufficient";

    if (project.step1_competition?.targetTechnology) {
      score += 12;
      reasons.push(`Target technology specified (${project.step1_competition.targetTechnology}).`);
    }

    const arch = project.step7_technicalArchitecture;
    if (arch?.systemArchitecture?.frontend && arch?.systemArchitecture?.aiIntegration) {
      score += 35;
      completeness = "Partial";
      reasons.push("Full-stack architecture and AI integration strategy defined in Step 7.");
    } else {
      suggestions.push("Generate Technical Architecture & AI Integration Strategy in Step 7.");
    }

    if (arch?.mermaidSystemDiagram && (arch?.deliverables?.technicalRisks?.length || 0) > 0) {
      score += 25;
      completeness = "Complete";
      reasons.push("Includes Mermaid architecture diagram and technical risk mitigations.");
    }

    return {
      rawScore: Math.min(95, score),
      reasoning:
        reasons.length > 0
          ? reasons.join(" ")
          : "Technical architecture and AI strategy have not been configured in Step 7.",
      completeness,
      suggestions,
    };
  }

  // Presentation / Pitch / Deliverables / Custom fallback
  let score = 20;
  const reasons: string[] = [];
  let completeness: "Complete" | "Partial" | "Insufficient" = "Insufficient";

  const deliverables = project.step9_deliverables?.items || [];
  const completedDeliv = deliverables.filter((d) => d.completed).length;
  if (deliverables.length > 0) {
    score += 30 + Math.min(20, Math.round((completedDeliv / deliverables.length) * 20));
    completeness = "Partial";
    reasons.push(
      `Deliverable checklist active (${completedDeliv}/${deliverables.length} items marked ready in Step 9).`
    );
    if (completedDeliv < 3) {
      suggestions.push("Complete and check off mandatory competition deliverables (Pitch Deck, Demo, Repo) in Step 9.");
    }
  } else {
    suggestions.push("Initialize your Competition Deliverables checklist in Step 9.");
  }

  if (project.step10_finalBrief?.sections?.section1_executiveSummary) {
    score += 22;
    completeness = "Complete";
    reasons.push("Final Project Brief compiled and ready for PDF export in Step 10.");
  } else {
    suggestions.push("Compile the Final Project Brief in Step 10 to prepare your pitch document.");
  }

  return {
    rawScore: Math.min(95, score),
    reasoning:
      reasons.length > 0
        ? reasons.join(" ")
        : "Presentation deliverables (Step 9) and Final Brief (Step 10) are incomplete.",
    completeness,
    suggestions,
  };
}

export function calculateJudgeScore(project: Partial<Project>): JudgeScoreSnapshot {
  const configuredCriteria =
    project.step2_judgeCriteria?.criteria && project.step2_judgeCriteria.criteria.length > 0
      ? project.step2_judgeCriteria.criteria
      : DEFAULT_JUDGE_CRITERIA;

  // Normalize weights if user is mid-edit so math never breaks
  const rawTotalWeight = configuredCriteria.reduce((acc, c) => acc + (Number(c.weight) || 0), 0);
  const weightValidation = validateCriteriaWeights(configuredCriteria);

  const allSuggestions = new Set<string>();
  let insufficientCount = 0;

  const categories: CategoryScoreDetail[] = configuredCriteria.map((crit) => {
    const effectiveWeight =
      rawTotalWeight > 0 ? (Number(crit.weight) / rawTotalWeight) * 100 : 100 / configuredCriteria.length;
    const evalResult = evaluateDimensionRawScore(crit.name, project);

    evalResult.suggestions.forEach((s) => allSuggestions.add(s));
    if (evalResult.completeness === "Insufficient") {
      insufficientCount += 1;
    }

    const weightedScore = Math.round(((evalResult.rawScore * effectiveWeight) / 100) * 100) / 100;

    return {
      category: crit.name,
      weight: Math.round(effectiveWeight * 100) / 100,
      rawScore: evalResult.rawScore,
      weightedScore,
      reasoning: evalResult.reasoning,
      dataCompleteness: evalResult.completeness,
    };
  });

  const overallScore =
    Math.round(categories.reduce((sum, item) => sum + item.weightedScore, 0) * 100) / 100;

  const sortedByRaw = [...categories].sort((a, b) => a.rawScore - b.rawScore);
  const weakestCategory = sortedByRaw[0]?.category || "Innovation";

  const warnings: string[] = [];
  if (!weightValidation.valid) {
    warnings.push(weightValidation.error!);
  }
  if (insufficientCount > 0) {
    warnings.push(
      `${insufficientCount} judging category(s) have insufficient project data. Complete all 10 workflow steps for high-confidence evaluation.`
    );
  }
  if ((project.step4_evidenceValidation?.evidenceItems?.length || 0) === 0) {
    warnings.push("Missing empirical research citations in Step 4 (Evidence Validation Engine).");
  }

  return {
    id: `score-${Date.now()}`,
    timestamp: new Date().toISOString(),
    overallScore,
    categories,
    weakestCategory,
    improvementSuggestions: Array.from(allSuggestions).slice(0, 5),
    confidenceWarning: warnings.length > 0 ? warnings.join(" ") : null,
  };
}
