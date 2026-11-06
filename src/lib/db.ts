import fs from "fs";
import path from "path";
import {
  DeliverableItem,
  Project,
  User,
} from "@/types/project";
import {
  calculateCompletionPercentage,
  calculateJudgeScore,
  DEFAULT_JUDGE_CRITERIA,
} from "@/lib/scoring/judge-engine";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "ideation-maker-db.json");

export interface DatabaseSchema {
  users: User[];
  projects: Project[];
}

export const DEFAULT_DELIVERABLES: DeliverableItem[] = [
  // Mandatory Deliverables
  {
    id: "deliv-1",
    title: "Pitch Deck (Problem, Validation, Demo, Architecture, Roadmap)",
    category: "MANDATORY",
    responsibleRole: "Product Manager / Hustler",
    deadline: "H-12 Hours before submission",
    completed: false,
  },
  {
    id: "deliv-2",
    title: "Working Demo (Deployed Live URL & Fallback Local Build)",
    category: "MANDATORY",
    responsibleRole: "Full-Stack / Frontend Lead",
    deadline: "H-6 Hours before submission",
    completed: false,
  },
  {
    id: "deliv-3",
    title: "Source Code (Clean, Modular, Documented)",
    category: "MANDATORY",
    responsibleRole: "Engineering Team",
    deadline: "H-4 Hours before submission",
    completed: false,
  },
  {
    id: "deliv-4",
    title: "GitHub Repository (Public/Judge Access + Setup README)",
    category: "MANDATORY",
    responsibleRole: "Software Architect",
    deadline: "H-4 Hours before submission",
    completed: false,
  },
  {
    id: "deliv-5",
    title: "System Architecture Diagram (Mermaid / High-Res Export)",
    category: "MANDATORY",
    responsibleRole: "Software Architect",
    deadline: "H-18 Hours before submission",
    completed: false,
  },
  {
    id: "deliv-6",
    title: "Problem Validation Report (With Verifiable Citations)",
    category: "MANDATORY",
    responsibleRole: "Product Manager / Researcher",
    deadline: "Day 1 Milestone",
    completed: false,
  },
  // Recommended Deliverables
  {
    id: "deliv-7",
    title: "Business Model Canvas / Sustainability Plan",
    category: "RECOMMENDED",
    responsibleRole: "Business Analyst",
    deadline: "H-24 Hours before submission",
    completed: false,
  },
  {
    id: "deliv-8",
    title: "Product Roadmap (MVP vs Post-Hackathon Scale)",
    category: "RECOMMENDED",
    responsibleRole: "Product Manager",
    deadline: "H-16 Hours before submission",
    completed: false,
  },
  {
    id: "deliv-9",
    title: "3-Minute Demo Video (Narrated Walkthrough)",
    category: "RECOMMENDED",
    responsibleRole: "Product Manager / Designer",
    deadline: "H-3 Hours before submission",
    completed: false,
  },
  {
    id: "deliv-10",
    title: "User Journey & Flow Diagram",
    category: "RECOMMENDED",
    responsibleRole: "UI/UX Designer",
    deadline: "Day 1 Milestone",
    completed: false,
  },
  {
    id: "deliv-11",
    title: "Interactive Wireframes / High-Fidelity UI",
    category: "RECOMMENDED",
    responsibleRole: "UI/UX Designer",
    deadline: "Day 1 Milestone",
    completed: false,
  },
  {
    id: "deliv-12",
    title: "Technical & API Documentation",
    category: "RECOMMENDED",
    responsibleRole: "Backend / AI Engineer",
    deadline: "H-6 Hours before submission",
    completed: false,
  },
  {
    id: "deliv-13",
    title: "Testing & QA Verification Log",
    category: "RECOMMENDED",
    responsibleRole: "QA / Full-Stack Engineer",
    deadline: "H-4 Hours before submission",
    completed: false,
  },
];

function getInitialDb(): DatabaseSchema {
  const defaultUser: User = {
    id: "user-owner-1",
    email: "valerio@ideationmaker.ai",
    name: "Christian Immanuel Valerio",
    passwordHash: "demo1234",
    role: "PRODUCT_OWNER",
    preferredLang: "en",
    createdAt: new Date().toISOString(),
  };

  const secondUser: User = {
    id: "user-other-2",
    email: "rival@hackathon.dev",
    name: "Rival Hackathon Team",
    passwordHash: "demo1234",
    role: "HACKATHON_PARTICIPANT",
    preferredLang: "en",
    createdAt: new Date().toISOString(),
  };

  return {
    users: [defaultUser, secondUser],
    projects: [],
  };
}

export function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDb();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw) as DatabaseSchema;
    if (!parsed.users || !parsed.projects) {
      const initial = getInitialDb();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    return parsed;
  } catch {
    return getInitialDb();
  }
}

export function writeDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function createBlankProject(
  userId: string,
  userName: string,
  preset?: {
    title?: string;
    competitionName?: string;
    theme?: string;
    domain?: string;
    targetTech?: string;
    description?: string;
  }
): Project {
  const id = `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  const newProject: Project = {
    id,
    userId,
    title: preset?.title || "Untitled Hackathon Strategy",
    tagline: "Transforming competition themes into validated, execution-ready project briefs.",
    teamName: "Alpha Innovation Team",
    preparedBy: userName || "Hackathon Team Lead",
    status: "IN_PROGRESS",
    currentStep: 1,
    completionPercentage: 10,
    lastEditedAt: now,
    createdAt: now,
    step1_competition: {
      name: preset?.competitionName || "",
      theme: preset?.theme || "",
      description: preset?.description || "",
      domain: preset?.domain || "",
      targetTechnology: preset?.targetTech || "",
      additionalContext: "",
    },
    step2_judgeCriteria: {
      criteria: DEFAULT_JUDGE_CRITERIA.map((c) => ({ ...c })),
    },
    step3_problemDiscovery: {
      whoExperiences: "",
      biggestDifficulty: "",
      frequency: "",
      impact: "",
      currentWorkarounds: "",
      whyInsufficient: "",
    },
    step4_evidenceValidation: {
      searchQuery: "",
      evidenceItems: [],
    },
    step5_solutionGenerator: {
      alternatives: [],
      comparisonSummary: "",
      recommendationReasoning: "",
      selectedSolutionId: null,
    },
    step6_productDesign: {
      productIdentity: {
        applicationName: "",
        tagline: "",
        productVision: "",
        productMission: "",
      },
      valueProposition: {
        mainValueProposition: "",
        uniqueSellingProposition: "",
        competitiveDifferentiation: "",
      },
      features: [],
      userExperience: {
        targetUserPersonaSummary: "",
        userJourneyStages: [],
        userFlowSteps: [],
        mainApplicationScreens: [],
        mermaidUserFlow: "",
      },
    },
    step7_technicalArchitecture: {
      systemArchitecture: {
        frontend: "",
        backend: "",
        database: "",
        cloudInfrastructure: "",
        authentication: "",
        storage: "",
        analytics: "",
        thirdPartyApis: "",
        aiIntegration: "",
      },
      techStackTable: [],
      deliverables: {
        systemOverview: "",
        architectureExplanation: "",
        componentResponsibilities: [],
        databaseDesign: "",
        apiIntegrationPlan: "",
        aiIntegrationStrategy: "",
        securityConsiderations: "",
        deploymentStrategy: "",
        technicalRisks: [],
      },
      mermaidSystemDiagram: "",
    },
    step8_developmentTimeline: {
      totalDuration: "48 Hours",
      teamSize: 4,
      teamRoles: ["Product Manager", "Frontend Developer", "Backend / AI Engineer", "UI/UX Designer"],
      developmentDeadline: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
      currentProgress: "Ideation & Validation Stage",
      milestones: [],
    },
    step9_deliverables: {
      competitionSpecificNotes: "",
      items: DEFAULT_DELIVERABLES.map((item) => ({ ...item, id: `${item.id}-${Math.random().toString(36).slice(2, 6)}` })),
    },
    judgeScore: {
      id: `score-${Date.now()}`,
      timestamp: now,
      overallScore: 0,
      categories: [],
      weakestCategory: "Impact",
      improvementSuggestions: [],
      confidenceWarning: null,
    },
    scoreHistory: [],
    aiHistory: [],
  };

  newProject.judgeScore = calculateJudgeScore(newProject);
  newProject.completionPercentage = calculateCompletionPercentage(newProject);
  newProject.scoreHistory.push({
    timestamp: now,
    overallScore: newProject.judgeScore.overallScore,
    trigger: "Project Initialized",
  });

  return newProject;
}

// Repository functions with strict user authorization
export function getUserProjects(userId: string): Project[] {
  const db = readDb();
  return db.projects
    .filter((p) => p.userId === userId)
    .sort((a, b) => new Date(b.lastEditedAt).getTime() - new Date(a.lastEditedAt).getTime());
}

export function getAuthorizedProject(projectId: string, userId: string): {
  project?: Project;
  status: 200 | 403 | 404;
  error?: string;
} {
  const db = readDb();
  const project = db.projects.find((p) => p.id === projectId);
  if (!project) {
    return { status: 404, error: "Project not found." };
  }
  if (project.userId !== userId) {
    return {
      status: 403,
      error: "Unauthorized: You do not have permission to access this private project.",
    };
  }
  return { status: 200, project };
}

export function saveAuthorizedProject(
  projectId: string,
  userId: string,
  updates: Partial<Project>,
  triggerLabel?: string
): {
  project?: Project;
  status: 200 | 403 | 404;
  error?: string;
} {
  const db = readDb();
  const index = db.projects.findIndex((p) => p.id === projectId);
  if (index === -1) {
    return { status: 404, error: "Project not found." };
  }
  const existing = db.projects[index];
  if (existing.userId !== userId) {
    return {
      status: 403,
      error: "Unauthorized: Cannot modify another user's private project.",
    };
  }

  const merged: Project = {
    ...existing,
    ...updates,
    id: existing.id,
    userId: existing.userId,
    lastEditedAt: new Date().toISOString(),
  };

  merged.completionPercentage = calculateCompletionPercentage(merged);
  merged.judgeScore = calculateJudgeScore(merged);

  if (merged.completionPercentage === 100) {
    merged.status = "READY_FOR_PITCH";
  } else if ((merged.step4_evidenceValidation?.evidenceItems?.length || 0) > 0) {
    merged.status = "VALIDATED";
  } else {
    merged.status = "IN_PROGRESS";
  }

  const prevLastScore = merged.scoreHistory[merged.scoreHistory.length - 1]?.overallScore;
  if (prevLastScore !== merged.judgeScore.overallScore || triggerLabel) {
    merged.scoreHistory = [
      ...(merged.scoreHistory || []).slice(-14),
      {
        timestamp: new Date().toISOString(),
        overallScore: merged.judgeScore.overallScore,
        trigger: triggerLabel || `Step ${merged.currentStep} Updated`,
      },
    ];
  }

  db.projects[index] = merged;
  writeDb(db);
  return { status: 200, project: merged };
}

export function duplicateAuthorizedProject(
  projectId: string,
  userId: string
): {
  project?: Project;
  status: 200 | 403 | 404;
  error?: string;
} {
  const db = readDb();
  const existing = db.projects.find((p) => p.id === projectId);
  if (!existing) {
    return { status: 404, error: "Project not found." };
  }
  if (existing.userId !== userId) {
    return { status: 403, error: "Unauthorized: Cannot duplicate another user's project." };
  }

  const now = new Date().toISOString();
  const copy: Project = JSON.parse(JSON.stringify(existing));
  copy.id = `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  copy.title = `${existing.title} (Copy)`;
  copy.createdAt = now;
  copy.lastEditedAt = now;

  db.projects.unshift(copy);
  writeDb(db);
  return { status: 200, project: copy };
}

export function deleteAuthorizedProject(
  projectId: string,
  userId: string
): {
  status: 200 | 403 | 404;
  error?: string;
} {
  const db = readDb();
  const existing = db.projects.find((p) => p.id === projectId);
  if (!existing) {
    return { status: 404, error: "Project not found." };
  }
  if (existing.userId !== userId) {
    return { status: 403, error: "Unauthorized: Cannot delete another user's project." };
  }

  db.projects = db.projects.filter((p) => p.id !== projectId);
  writeDb(db);
  return { status: 200 };
}

