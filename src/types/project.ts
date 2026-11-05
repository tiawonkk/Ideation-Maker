export type Language = "en" | "id";

export type ProjectStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "VALIDATED"
  | "READY_FOR_PITCH";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  preferredLang: Language;
  createdAt: string;
}

// STEP 1 — COMPETITION THEME ANALYZER
export interface ThemeAnalysisOutput {
  themeBreakdown: string;
  relevantIndustries: { name: string; relevanceWhy: string }[];
  mainChallenges: string[];
  technologyOpportunities: { tech: string; opportunityWhy: string }[];
  potentialProblemAreas: { area: string; relevanceWhy: string }[];
  judgeFocusAreas: string[];
  recommendedInnovationDirections: {
    title: string;
    description: string;
    whyRelevant: string;
  }[];
}

export interface CompetitionData {
  name: string;
  theme: string;
  description: string;
  domain: string;
  targetTechnology: string;
  additionalContext: string;
  analysis?: ThemeAnalysisOutput;
}

// STEP 2 — JUDGE CRITERIA ENGINE
export interface JudgeCriterionItem {
  id: string;
  name: string;
  weight: number; // 0 - 100
  description: string;
  interpretation?: string;
  whatJudgesLookFor?: string;
  strategicRecommendation?: string;
  priorityRank?: number;
  mappedCapability?: string;
}

export interface JudgeCriteriaData {
  criteria: JudgeCriterionItem[];
  overallInterpretation?: string;
  strategicPriorities?: string[];
}

// STEP 3 — PROBLEM DISCOVERY ENGINE
export interface UserPersona {
  name: string;
  role: string;
  demographics: string;
  goals: string[];
  frustrations: string[];
  quote: string;
}

export interface ProblemDiscoveryOutput {
  targetUser: string;
  userPersona: UserPersona;
  painPoints: string[];
  currentAlternatives: { name: string; limitation: string }[];
  problemSeverity: "Critical" | "High" | "Moderate" | "Low";
  problemFrequency: string;
  problemStatement: string; // "[Target user] experiences [specific problem] because [root cause], resulting in [measurable impact]."
  rootCauseAnalysis: string[];
  validationDisclaimer: string;
}

export interface ProblemDiscoveryData {
  whoExperiences: string;
  biggestDifficulty: string;
  frequency: string;
  impact: string;
  currentWorkarounds: string;
  whyInsufficient: string;
  analysis?: ProblemDiscoveryOutput;
}

// STEP 4 — EVIDENCE VALIDATION ENGINE
export type EvidenceStrength =
  | "Strong Evidence"
  | "Moderate Evidence"
  | "Limited Evidence";

export interface ResearchEvidenceItem {
  id: string;
  finding: string;
  supportingStatistic: string;
  sourceTitle: string;
  sourceOrganization: string;
  publicationDate: string;
  originalSourceUrl: string;
  evidenceType:
    | "Academic Paper"
    | "Government Statistics"
    | "Industry Report"
    | "Official Dataset"
    | "Reputable News"
    | "Market Research";
  relevanceToProblem: string;
  businessOrSocialOpportunity: string;
  evidenceStrength: EvidenceStrength;
  isVerifiedExternal: boolean;
  verificationNote?: string;
}

export interface ProblemValidationReport {
  problemOverview: string;
  supportingEvidenceSummary: string;
  statisticalInsights: string[];
  researchFindingsSummary: string;
  marketOrSocialImpact: string;
  overallValidationStrength: EvidenceStrength;
  evidenceGaps: string[];
  opportunityAnalysis: string;
  deskVsCustomerDistinction: string;
}

export interface EvidenceValidationData {
  searchQuery: string;
  evidenceItems: ResearchEvidenceItem[];
  report?: ProblemValidationReport;
}

// STEP 5 — SOLUTION GENERATOR
export interface SolutionAlternativeItem {
  id: string;
  name: string;
  conceptDescription: string;
  targetUser: string;
  coreFunctionality: string[];
  innovation: string;
  expectedImpact: string;
  technicalComplexity: "Low" | "Medium" | "High";
  feasibility: string;
  feasibilityScore: number; // 0-100
  competitiveDifferentiation: string;
  judgeAlignment: string;
  judgeAlignmentScore: number; // 0-100
  isRecommended: boolean;
}

export interface SolutionGeneratorData {
  alternatives: SolutionAlternativeItem[];
  comparisonSummary: string;
  recommendationReasoning: string;
  selectedSolutionId: string | null;
  customizedSolution?: SolutionAlternativeItem;
}

// STEP 6 — PRODUCT DESIGN GENERATOR
export interface ProductFeatureItem {
  id: string;
  name: string;
  description: string;
  tier: "MVP" | "CORE" | "FUTURE";
  moscow: "Must Have" | "Should Have" | "Could Have" | "Won't Have Yet";
}

export interface ProductDesignData {
  productIdentity: {
    applicationName: string;
    tagline: string;
    productVision: string;
    productMission: string;
  };
  valueProposition: {
    mainValueProposition: string;
    uniqueSellingProposition: string;
    competitiveDifferentiation: string;
  };
  features: ProductFeatureItem[];
  userExperience: {
    targetUserPersonaSummary: string;
    userJourneyStages: { stage: string; action: string; outcome: string }[];
    userFlowSteps: string[];
    mainApplicationScreens: { screenName: string; purpose: string; keyInteractions: string[] }[];
    mermaidUserFlow: string;
  };
}

// STEP 7 — TECHNICAL ARCHITECTURE GENERATOR
export interface TechStackRecommendation {
  layer: string;
  technology: string;
  rationale: string;
}

export interface TechnicalArchitectureData {
  systemArchitecture: {
    frontend: string;
    backend: string;
    database: string;
    cloudInfrastructure: string;
    authentication: string;
    storage: string;
    analytics: string;
    thirdPartyApis: string;
    aiIntegration: string;
  };
  techStackTable: TechStackRecommendation[];
  deliverables: {
    systemOverview: string;
    architectureExplanation: string;
    componentResponsibilities: { component: string; responsibility: string }[];
    databaseDesign: string;
    apiIntegrationPlan: string;
    aiIntegrationStrategy: string;
    securityConsiderations: string;
    deploymentStrategy: string;
    technicalRisks: { risk: string; severity: string; mitigation: string }[];
  };
  mermaidSystemDiagram: string;
}

// STEP 8 — DEVELOPMENT TIMELINE GENERATOR
export interface MilestoneItem {
  id: string;
  orderIndex: number;
  periodLabel: string;
  activity: string;
  objective: string;
  tasks: string[];
  responsibleRole: string;
  expectedOutput: string;
  dependencies: string;
  completionCriteria: string;
  completed: boolean;
}

export interface DevelopmentTimelineData {
  totalDuration: string; // e.g., "48 Hours", "2 Weeks", "8 Weeks"
  teamSize: number;
  teamRoles: string[];
  developmentDeadline: string;
  currentProgress: string;
  milestones: MilestoneItem[];
}

// STEP 9 — COMPETITION DELIVERABLE GENERATOR
export interface DeliverableItem {
  id: string;
  title: string;
  category: "MANDATORY" | "RECOMMENDED" | "CUSTOM";
  responsibleRole: string;
  deadline: string;
  completed: boolean;
  notes?: string;
}

export interface DeliverablesData {
  competitionSpecificNotes: string;
  items: DeliverableItem[];
}

// JUDGE SCORE ENGINE
export interface CategoryScoreDetail {
  category: string;
  weight: number; // percentage e.g. 30
  rawScore: number; // 0-100
  weightedScore: number; // e.g. 25.5
  reasoning: string;
  dataCompleteness: "Complete" | "Partial" | "Insufficient";
}

export interface JudgeScoreSnapshot {
  id: string;
  timestamp: string;
  overallScore: number;
  categories: CategoryScoreDetail[];
  weakestCategory: string;
  improvementSuggestions: string[];
  confidenceWarning: string | null;
}

// STEP 10 — FINAL PROJECT BRIEF
export interface FinalBriefCover {
  projectName: string;
  competitionName: string;
  competitionTheme: string;
  teamName: string;
  preparedBy: string;
  date: string;
  projectTagline: string;
}

export interface FinalBriefSections {
  section1_executiveSummary: string;
  section2_problemValidation: string;
  section3_marketOpportunity: string;
  section4_solutionOverview: string;
  section5_productFeaturesMvp: string;
  section6_userJourneyFlow: string;
  section7_systemArchitecture: string;
  section8_technologyStack: string;
  section9_developmentTimeline: string;
  section10_competitionDeliverables: string;
  section11_riskAnalysis: string;
  section12_judgeAlignmentScore: string;
  section13_winningStrategy: string;
  appendix_references: string;
  appendix_statistics: string;
  appendix_technicalNotes: string;
  appendix_glossary: string;
}

export interface FinalBriefData {
  cover: FinalBriefCover;
  sections: FinalBriefSections;
  editedSections: Partial<Record<keyof FinalBriefSections, boolean>>;
  lastCompiledAt: string;
}

// AI GENERATION HISTORY
export interface AIGenerationHistoryEntry {
  id: string;
  stepNumber: number;
  moduleName: string;
  providerMode: "GEMINI_LIVE" | "OPENAI_LIVE" | "STRATEGIST_DEV_ENGINE";
  timestamp: string;
  summary: string;
}

// COMPLETE PROJECT ENTITY
export interface Project {
  id: string;
  userId: string;
  title: string;
  tagline: string;
  teamName: string;
  preparedBy: string;
  status: ProjectStatus;
  currentStep: number;
  completionPercentage: number;
  lastEditedAt: string;
  createdAt: string;

  step1_competition: CompetitionData;
  step2_judgeCriteria: JudgeCriteriaData;
  step3_problemDiscovery: ProblemDiscoveryData;
  step4_evidenceValidation: EvidenceValidationData;
  step5_solutionGenerator: SolutionGeneratorData;
  step6_productDesign: ProductDesignData;
  step7_technicalArchitecture: TechnicalArchitectureData;
  step8_developmentTimeline: DevelopmentTimelineData;
  step9_deliverables: DeliverablesData;
  step10_finalBrief?: FinalBriefData;

  judgeScore: JudgeScoreSnapshot;
  scoreHistory: { timestamp: string; overallScore: number; trigger: string }[];
  aiHistory: AIGenerationHistoryEntry[];
}
