import {
  DevelopmentTimelineData,
  FinalBriefData,
  FinalBriefSections,
  JudgeCriteriaData,
  ProblemDiscoveryOutput,
  ProductDesignData,
  Project,
  SolutionGeneratorData,
  TechnicalArchitectureData,
  ThemeAnalysisOutput,
} from "@/types/project";
import { MASTER_AI_SYSTEM_PROMPT } from "./system-prompt";

export async function callExternalLLMJson<T>(
  prompt: string,
  aiConfig?: { provider?: string; apiKey?: string; model?: string }
): Promise<{ data: T; providerMode: "GEMINI_LIVE" | "OPENAI_LIVE" } | null> {
  const geminiKey =
    (aiConfig?.provider !== "openai" && aiConfig?.apiKey?.startsWith("AIza")
      ? aiConfig.apiKey
      : undefined) || process.env.GEMINI_API_KEY;

  const openaiKey =
    (aiConfig?.apiKey?.startsWith("sk-") ? aiConfig.apiKey : undefined) ||
    process.env.OPENAI_API_KEY;

  if (aiConfig?.provider === "local") {
    return null;
  }

  if (geminiKey) {
    try {
      const model = aiConfig?.model || "gemini-2.5-flash";
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: MASTER_AI_SYSTEM_PROMPT }],
            },
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.3,
            },
          }),
          signal: AbortSignal.timeout(15000),
        }
      );
      if (res.ok) {
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            data: JSON.parse(text) as T,
            providerMode: "GEMINI_LIVE",
          };
        }
      }
    } catch {
      // Fallback to strategist engine if network/key fails
    }
  }

  if (openaiKey) {
    try {
      const model =
        aiConfig?.model && !aiConfig.model.startsWith("gemini")
          ? aiConfig.model
          : "gpt-4o-mini";
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: MASTER_AI_SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const json = await res.json();
        const text = json.choices?.[0]?.message?.content;
        if (text) {
          return {
            data: JSON.parse(text) as T,
            providerMode: "OPENAI_LIVE",
          };
        }
      }
    } catch {
      // Fallback
    }
  }

  return null;
}

// STEP 1 GENERATOR
export function generateStep1ThemeAnalysis(
  project: Project
): ThemeAnalysisOutput {
  const c = project.step1_competition;
  const compName = c.name || "Target Hackathon";
  const theme = c.theme || "AI-Powered Digital Transformation";
  const domain = c.domain || "Enterprise & Public Service Technology";
  const tech = c.targetTechnology || "Next.js, TypeScript, Cloud AI API, PostgreSQL";

  return {
    themeBreakdown: `For ${compName}, the theme "${theme}" in the ${domain} sector requires teams to move beyond superficial chat wrappers and deliver a measurable workflow intervention. Judges will evaluate how effectively ${tech} solves a high-friction operational bottleneck with verifiable accuracy and clear user value.`,
    relevantIndustries: [
      {
        name: `${domain} — Frontline Operations`,
        relevanceWhy: `High daily transaction and decision volume directly impacted by "${theme}".`,
      },
      {
        name: "Compliance, Triage & Decision Support",
        relevanceWhy:
          "Organizations struggle to cross-reference complex rules and unstructured inputs under time pressure.",
      },
      {
        name: "Data-Driven Public & Commercial Services",
        relevanceWhy:
          "Provides immediate measurable KPIs (time saved, error reduction) that resonate with competition judges.",
      },
    ],
    mainChallenges: [
      `Bridging unstructured real-world inputs with deterministic accuracy in ${domain}.`,
      "Preventing AI hallucination through strict source/protocol grounding and human-in-the-loop review.",
      "Delivering a frictionless, sub-60-second workflow that works reliably during a live 3-minute demo.",
    ],
    technologyOpportunities: [
      {
        tech,
        opportunityWhy: `Directly aligns with ${compName}'s technical rubric while enabling rapid full-stack prototyping.`,
      },
      {
        tech: "Structured JSON Schema & Grounded Retrieval (RAG)",
        opportunityWhy:
          "Transforms unpredictable generative outputs into auditable, citation-backed action cards.",
      },
    ],
    potentialProblemAreas: [
      {
        area: `Manual Verification & Documentation Bottlenecks in ${domain}`,
        relevanceWhy:
          "Practitioners lose 20–40% of their shift manually compiling, validating, and formatting routine cases.",
      },
      {
        area: "Delayed Escalation of High-Risk Edge Cases",
        relevanceWhy:
          "Critical anomalies are missed when frontline staff rely on static PDFs or fragmented spreadsheets.",
      },
    ],
    judgeFocusAreas: [
      `Clear alignment with "${theme}" and demonstrable necessity of ${tech}.`,
      "Empirical problem validation backed by real academic or institutional citations.",
      "Working end-to-end MVP prototype rather than slideware promises.",
    ],
    recommendedInnovationDirections: [
      {
        title: `Protocol-Grounded ${domain} Copilot`,
        description: `Ingest multimodal/unstructured field inputs, cross-verify against authoritative ${domain} standards, and generate one-click action packets.`,
        whyRelevant: `Maximizes both Innovation and Impact criteria for ${compName}.`,
      },
      {
        title: "Automated Anomaly & Risk Triage Engine",
        description:
          "Real-time prioritization queue that flags high-risk cases with explainable reasoning and audit trails.",
        whyRelevant:
          "Demonstrates strong technical depth and immediate operational ROI.",
      },
    ],
  };
}

// STEP 2 GENERATOR
export function generateStep2CriteriaAnalysis(
  project: Project
): JudgeCriteriaData {
  const existing = project.step2_judgeCriteria.criteria;
  const sorted = [...existing].sort((a, b) => b.weight - a.weight);
  const compTheme = project.step1_competition?.theme || "the competition theme";
  const targetTech =
    project.step1_competition?.targetTechnology || "core AI & full-stack stack";

  const enriched = existing.map((crit) => {
    const rank = sorted.findIndex((s) => s.id === crit.id) + 1;
    const lower = crit.name.toLowerCase();

    let interpretation = `Accounts for ${crit.weight}% of the total rubric (Priority Rank #${rank}).`;
    let whatJudgesLookFor =
      "Clear evidence of execution, differentiation, and measurable outcomes.";
    let strategicRecommendation =
      "Dedicate proportionate pitch time and live demo proof to this criterion.";
    let mappedCapability = "Core MVP Workflow & Live Demo";

    if (lower.includes("innov") || lower.includes("creativ")) {
      interpretation = `High-leverage criterion (${crit.weight}% weight). Judges penalize generic CRUD or basic prompt wrappers.`;
      whatJudgesLookFor = `Novel application of ${targetTech} to solve a specific bottleneck in "${compTheme}".`;
      strategicRecommendation =
        "Demonstrate your unique multimodal or automated workflow within the first 45 seconds of the pitch.";
      mappedCapability = "Differentiated AI Orchestration & Zero-Friction UX";
    } else if (lower.includes("impact") || lower.includes("value") || lower.includes("market")) {
      interpretation = `Critical validation pillar (${crit.weight}% weight). Claims must be backed by real external research.`;
      whatJudgesLookFor =
        "Quantified pain severity, verifiable citations (Step 4), and measurable time/cost savings.";
      strategicRecommendation =
        "Lead the pitch with your structured Problem Statement and verified OpenAlex/Crossref citations.";
      mappedCapability = "Validated Problem Statement + Measurable ROI Metrics";
    } else if (lower.includes("feasib") || lower.includes("viab") || lower.includes("business")) {
      interpretation = `Execution realism check (${crit.weight}% weight). Judges test whether the MVP can realistically work in the field.`;
      whatJudgesLookFor =
        "Focused MoSCoW MVP scope, human-in-the-loop safety guardrails, and realistic adoption path.";
      strategicRecommendation =
        "Keep Must-Have MVP features focused on 3–4 core capabilities and address edge-case risks explicitly.";
      mappedCapability = "Scoped MoSCoW MVP + Human-in-the-Loop Guardrails";
    } else if (lower.includes("tech") || lower.includes("arch") || lower.includes("code")) {
      interpretation = `Engineering rigor assessment (${crit.weight}% weight). Evaluates architecture soundness and AI depth.`;
      whatJudgesLookFor = `Clean system architecture using ${targetTech}, structured JSON schemas, and resilient error handling.`;
      strategicRecommendation =
        "Include the Mermaid System Architecture diagram and explain latency/hallucination mitigations.";
      mappedCapability = "Typed Full-Stack Architecture + Grounded AI Pipeline";
    } else if (lower.includes("pres") || lower.includes("pitch") || lower.includes("demo")) {
      interpretation = `Storytelling and delivery multiplier (${crit.weight}% weight).`;
      whatJudgesLookFor =
        "Cohesive problem-to-demo narrative, working live prototype, and polished documentation.";
      strategicRecommendation =
        "Walk through one concrete user persona scenario from intake to exported result.";
      mappedCapability = "Persona-Driven Live Demo + A4 Project Brief";
    }

    return {
      ...crit,
      priorityRank: rank,
      interpretation,
      whatJudgesLookFor,
      strategicRecommendation,
      mappedCapability,
    };
  });

  const topTwo = sorted.slice(0, 2);
  const topSum = topTwo.reduce((acc, c) => acc + c.weight, 0);

  return {
    criteria: enriched,
    overallInterpretation: `The top two criteria (${topTwo
      .map((c) => `${c.name}: ${c.weight}%`)
      .join(" & ")}) control ${topSum}% of your total score. Every feature and slide must reinforce these two pillars first.`,
    strategicPriorities: sorted.map(
      (c, i) =>
        `Priority #${i + 1} (${c.name} — ${c.weight}%): Align MVP scope and demo narrative directly with ${c.name}.`
    ),
  };
}

// STEP 3 GENERATOR
export function generateStep3ProblemDiscovery(
  project: Project
): ProblemDiscoveryOutput {
  const p = project.step3_problemDiscovery;
  const domain = project.step1_competition?.domain || "Target Sector";

  const targetUser =
    p.whoExperiences?.trim() ||
    `Frontline practitioners and operators in ${domain}`;
  const difficulty =
    p.biggestDifficulty?.trim() ||
    "manually processing, verifying, and documenting complex cases under strict time pressure";
  const frequency = p.frequency?.trim() || "Daily across routine operational workflows";
  const impact =
    p.impact?.trim() ||
    "significant time delays, administrative overload, and inconsistent decision quality";
  const workarounds =
    p.currentWorkarounds?.trim() ||
    "manual spreadsheets, static PDF manuals, and fragmented messaging apps";
  const whyInsufficient =
    p.whyInsufficient?.trim() ||
    "existing tools are passive, fragmented, and lack automated validation or structured output generation";

  return {
    targetUser,
    userPersona: {
      name: "Alex Pratama (Representative Practitioner Persona)",
      role: `Lead Operations / Frontline Specialist in ${domain}`,
      demographics: `Experienced practitioner handling high-volume ${domain} cases daily`,
      goals: [
        `Complete accurate case assessment and documentation in under 2 minutes`,
        "Eliminate preventable compliance or triage errors during peak hours",
      ],
      frustrations: [
        `Difficulty: ${difficulty}`,
        `Current tools (${workarounds}) fail because ${whyInsufficient}`,
      ],
      quote: `"We spend more time fighting fragmented forms and manuals than solving the actual high-priority cases."`,
    },
    painPoints: [
      `Primary Bottleneck: ${difficulty}`,
      `Operational Impact: ${impact}`,
      `Tooling Gap: ${whyInsufficient}`,
    ],
    currentAlternatives: [
      {
        name: workarounds,
        limitation: whyInsufficient,
      },
      {
        name: "Generic Unstructured AI Chatbots",
        limitation:
          "Prone to hallucination, lacks domain-specific protocol grounding, and does not integrate into structured workflows.",
      },
    ],
    problemSeverity: "Critical",
    problemFrequency: frequency,
    problemStatement: `${targetUser} experiences ${difficulty} because ${whyInsufficient}, resulting in ${impact}.`,
    rootCauseAnalysis: [
      `Information Fragmentation: Critical rules and data live in disconnected ${workarounds}.`,
      `Manual Synthesis Overhead: ${whyInsufficient}.`,
      "Lack of Real-Time Decision Guardrails: No automated verification step at the point of intake.",
    ],
    validationDisclaimer:
      "Transparency Notice: This persona and problem synthesis are derived from structured problem analysis. Do not present this as primary customer interview transcripts without conducting real user interviews.",
  };
}

// STEP 5 GENERATOR
export function generateStep5Solutions(
  project: Project
): SolutionGeneratorData {
  const comp = project.step1_competition;
  const prob = project.step3_problemDiscovery;
  const domain = comp?.domain || "Operations";
  const tech = comp?.targetTechnology || "Next.js, AI API, PostgreSQL";
  const targetUser =
    prob?.analysis?.targetUser ||
    prob?.whoExperiences ||
    `Frontline ${domain} Practitioners`;

  const customTitle =
    project.title &&
    !project.title.toLowerCase().includes("untitled") &&
    !project.title.toLowerCase().includes("new hackathon")
      ? project.title
      : `${domain.split(/[&\s]/)[0] || "Nexus"}Copilot AI`;

  const alt1 = {
    id: "sol-1",
    name: `${customTitle} — Grounded Workflow & Decision Engine`,
    conceptDescription: `An intelligent workspace for ${targetUser} that ingests unstructured case inputs, cross-verifies them against verified ${domain} rules/evidence using ${tech}, and outputs a standardized, audit-ready action packet in under 60 seconds.`,
    targetUser,
    coreFunctionality: [
      "Structured Multimodal / Smart Intake Parser",
      "Citation-Grounded Rule & Risk Verification Engine",
      "One-Click Standardized Action & Report Exporter",
    ],
    innovation: `Combines ${tech} with deterministic JSON schema enforcement and verbatim source grounding rather than open-ended chat.`,
    expectedImpact: `Reduces manual processing time by 70%+ while directly addressing: ${
      prob?.impact || "operational delays and error rates"
    }.`,
    technicalComplexity: "Medium" as const,
    feasibility:
      "High — Scoped cleanly for a hackathon sprint using modern full-stack TypeScript and structured LLM endpoints.",
    feasibilityScore: 91,
    competitiveDifferentiation:
      "Delivers verifiable, citation-pinned outputs and human-in-the-loop sign-off instead of unverified chatbot text.",
    judgeAlignment:
      "Maximizes Innovation (30%) and Impact (30%) while maintaining high Feasibility (15%) and Technical Excellence (15%).",
    judgeAlignmentScore: 93,
    isRecommended: true,
  };

  const alt2 = {
    id: "sol-2",
    name: `Autonomous ${domain} Self-Service Portal`,
    conceptDescription: `A direct-to-end-user self-service portal that automates intake and decisioning without practitioner intervention.`,
    targetUser: `End Customers / Public Citizens in ${domain}`,
    coreFunctionality: [
      "Conversational intake wizard",
      "Automated instant approval/triage engine",
      "Notification webhook triggers",
    ],
    innovation: "Zero-touch autonomous triage for end users.",
    expectedImpact: "High volume scalability across public channels.",
    technicalComplexity: "High" as const,
    feasibility:
      "Moderate — Autonomous decisioning without a human-in-the-loop raises regulatory and hallucination risks.",
    feasibilityScore: 73,
    competitiveDifferentiation: "24/7 self-service accessibility.",
    judgeAlignment:
      "Strong reach, but judges often question safety and liability when removing human oversight.",
    judgeAlignmentScore: 76,
    isRecommended: false,
  };

  const alt3 = {
    id: "sol-3",
    name: `${domain} Analytics & Retrospective Audit Dashboard`,
    conceptDescription:
      "A business intelligence platform that aggregates historical records to visualize bottlenecks and compliance trends.",
    targetUser: `Operations Managers & Executives in ${domain}`,
    coreFunctionality: [
      "CSV / Database batch ingestion",
      "AI-generated weekly executive summaries",
      "KPI anomaly charts",
    ],
    innovation: "Automated retrospective root-cause clustering.",
    expectedImpact: "Improves long-term resource allocation.",
    technicalComplexity: "Low" as const,
    feasibility: "High — Easy to build with standard charting libraries.",
    feasibilityScore: 86,
    competitiveDifferentiation: "Executive-ready analytics reporting.",
    judgeAlignment:
      "Lower Innovation score—judges frequently view retrospective dashboards as less impactful than point-of-action tools.",
    judgeAlignmentScore: 71,
    isRecommended: false,
  };

  return {
    alternatives: [alt1, alt2, alt3],
    comparisonSummary: `Option 1 (${alt1.name}) outperforms Option 2 on safety/feasibility (human-in-the-loop guardrail) and outperforms Option 3 on immediate point-of-action impact and AI innovation depth.`,
    recommendationReasoning: `Select Option 1 (${alt1.name}) because it directly empowers ${targetUser}, solves the core problem statement with verifiable grounding, and provides a compelling 60-second live demo for judges.`,
    selectedSolutionId: "sol-1",
    customizedSolution: alt1,
  };
}

// STEP 6 GENERATOR
export function generateStep6ProductDesign(
  project: Project
): ProductDesignData {
  const selected =
    project.step5_solutionGenerator?.customizedSolution ||
    project.step5_solutionGenerator?.alternatives?.find(
      (a) => a.id === project.step5_solutionGenerator?.selectedSolutionId
    ) ||
    project.step5_solutionGenerator?.alternatives?.[0];

  const appName = selected?.name?.split("—")[0]?.trim() || project.title || "NexusCopilot AI";
  const targetUser =
    selected?.targetUser ||
    project.step3_problemDiscovery?.analysis?.targetUser ||
    "Frontline Practitioners";

  return {
    productIdentity: {
      applicationName: appName,
      tagline:
        selected?.conceptDescription?.slice(0, 95) ||
        "Evidence-Grounded AI Workflow & Decision Copilot",
      productVision: `Empower every ${targetUser} with instant, citation-verified intelligence that eliminates administrative bottlenecks.`,
      productMission: `Deliver a fast, auditable, and judge-aligned workflow using ${
        project.step1_competition?.targetTechnology || "modern full-stack AI"
      }.`,
    },
    valueProposition: {
      mainValueProposition:
        selected?.expectedImpact ||
        "Cuts manual case processing and verification time from 20+ minutes to under 60 seconds.",
      uniqueSellingProposition:
        selected?.innovation ||
        "Structured multimodal/smart intake paired with deterministic rule citations and one-click report export.",
      competitiveDifferentiation:
        selected?.competitiveDifferentiation ||
        "Unlike generic chatbots, every recommendation is pinned to verifiable rules with human-in-the-loop sign-off.",
    },
    features: [
      {
        id: "f-mvp-1",
        name: "Smart Structured Case Intake Console",
        description:
          "Rapid input capture (text, structured fields, or document/image upload) with instant field extraction.",
        tier: "MVP",
        moscow: "Must Have",
      },
      {
        id: "f-mvp-2",
        name: "Grounded AI Verification & Risk Scorer",
        description:
          "Evaluates intake data against domain guidelines and outputs a 0–100 priority/risk score with citations.",
        tier: "MVP",
        moscow: "Must Have",
      },
      {
        id: "f-mvp-3",
        name: "One-Click Standardized Action Packet / PDF Export",
        description:
          "Generates a clean, shareable summary report ready for downstream handoff.",
        tier: "MVP",
        moscow: "Must Have",
      },
      {
        id: "f-core-4",
        name: "Human-in-the-Loop Verification & Override Log",
        description:
          "Allows practitioners to inspect, edit, and sign off on AI recommendations before finalization.",
        tier: "CORE",
        moscow: "Should Have",
      },
      {
        id: "f-core-5",
        name: "Historical Case Comparison & Analytics",
        description:
          "Tracks turnaround time improvements and high-frequency bottleneck patterns.",
        tier: "CORE",
        moscow: "Could Have",
      },
      {
        id: "f-fut-6",
        name: "Enterprise ERP / External Webhook Sync",
        description:
          "Bi-directional API integration with legacy institutional systems post-hackathon.",
        tier: "FUTURE",
        moscow: "Won't Have Yet",
      },
    ],
    userExperience: {
      targetUserPersonaSummary: `${targetUser} operating under strict time constraints who need immediate verification and structured outputs.`,
      userJourneyStages: [
        {
          stage: "1. Case Intake",
          action: "User enters or uploads raw case details into the console.",
          outcome: "Key entities and parameters are extracted in <3 seconds.",
        },
        {
          stage: "2. Grounded AI Evaluation",
          action: "Engine cross-checks parameters against domain criteria.",
          outcome: "Risk tier, explanation, and source citations are displayed.",
        },
        {
          stage: "3. Sign-Off & Export",
          action: "User verifies recommendations and clicks Export Action Packet.",
          outcome: "Standardized report is saved and exported as A4 PDF.",
        },
      ],
      userFlowSteps: [
        "Authenticate & Open Workspace",
        "Submit Raw Case Input",
        "AI Structured Extraction & Rule Matching",
        "Inspect Risk Score & Citations",
        "Human-in-the-Loop Sign-Off",
        "Export Standardized Report",
      ],
      mainApplicationScreens: [
        {
          screenName: "Rapid Intake & Extraction View",
          purpose: "Zero-friction input capture with real-time entity parsing.",
          keyInteractions: ["Upload/Paste Case Data", "Load Sample Scenario", "Run AI Analysis"],
        },
        {
          screenName: "Verification & Citation Inspector",
          purpose: "Displays priority score, flagged risks, and verbatim guideline references.",
          keyInteractions: ["Inspect Source Citation", "Adjust Priority Override", "Confirm Sign-Off"],
        },
        {
          screenName: "Action Packet & Export Preview",
          purpose: "Formatted handoff report ready for PDF download or sharing.",
          keyInteractions: ["Edit Summary Fields", "Export PDF", "Save to Audit Log"],
        },
      ],
      mermaidUserFlow: `flowchart LR
    A["User Opens Intake Console"] --> B["Input / Upload Case Data"]
    B --> C["AI Structured Extraction Engine"]
    C --> D["Domain Guideline & Risk Scorer"]
    D --> E{"High-Priority Risk Flagged?"}
    E -- "Yes" --> F["Highlight Escalation & Citations"]
    E -- "No" --> G["Generate Standard Action Summary"]
    F --> H["Practitioner Human-in-the-Loop Sign-Off"]
    G --> H
    H --> I["Export Standardized A4 Action PDF"]`,
    },
  };
}

// STEP 7 GENERATOR
export function generateStep7Architecture(
  project: Project
): TechnicalArchitectureData {
  const targetTech =
    project.step1_competition?.targetTechnology ||
    "Next.js, TypeScript, Tailwind CSS, PostgreSQL, Gemini API";

  return {
    systemArchitecture: {
      frontend: "Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS",
      backend: "Next.js Typed API Route Handlers & Server Actions",
      database: "PostgreSQL with Prisma ORM (SQLite local dev compatible)",
      cloudInfrastructure: "Vercel Serverless Deployment + Managed PostgreSQL",
      authentication: "Session / JWT Role-Based Access Control with Owner Isolation",
      storage: "Encrypted Cloud Object Storage for attachments & exports",
      analytics: "PostHog / Structured Telemetry & Latency Logging",
      thirdPartyApis: `OpenAlex & Crossref Research APIs + ${targetTech}`,
      aiIntegration:
        "Provider-Agnostic AI Orchestration Layer (Google Gemini 2.5 Flash / OpenAI) with strict JSON schema validation",
    },
    techStackTable: [
      {
        layer: "Frontend",
        technology: "Next.js 15 + React 19 + Tailwind CSS",
        rationale:
          "Enables rapid, responsive desktop-first workspace UI with zero-config SSR/CSR routing.",
      },
      {
        layer: "Backend",
        technology: "Next.js API Routes (TypeScript)",
        rationale:
          "Eliminates cross-repo deployment overhead during a hackathon while enforcing end-to-end type safety.",
      },
      {
        layer: "Database",
        technology: "PostgreSQL + Prisma ORM",
        rationale:
          "Relational integrity for multi-step project state, citations, and audit history.",
      },
      {
        layer: "AI Engine",
        technology: targetTech,
        rationale:
          "Directly fulfills competition technology alignment with structured JSON outputs.",
      },
      {
        layer: "Document & Diagrams",
        technology: "Mermaid.js + A4 Print CSS Engine",
        rationale:
          "Produces crisp architectural diagrams and publication-grade A4 PDF exports.",
      },
    ],
    deliverables: {
      systemOverview:
        "A modular 3-tier web architecture separating the interactive React client, stateless AI & research orchestration endpoints, and transactional relational persistence.",
      architectureExplanation:
        "Client interactions trigger typed API endpoints that validate user ownership, assemble contextual prompts with verified domain rules, invoke the LLM in structured JSON mode, and persist versioned snapshots.",
      componentResponsibilities: [
        {
          component: "Workspace Client Layer",
          responsibility:
            "Manages multi-step state, autosave triggers, Mermaid rendering, and live Judge Score visualization.",
        },
        {
          component: "AI & Research Orchestrator",
          responsibility:
            "Enforces system prompt discipline, queries external academic APIs, and validates JSON schemas.",
        },
        {
          component: "Persistence & Auth Guard",
          responsibility:
            "Ensures strict per-user project isolation and maintains generation history.",
        },
      ],
      databaseDesign:
        "Normalized relational schema across Users, Projects, Competitions, JudgeCriteria, ProblemStatements, ResearchEvidence, SolutionAlternatives, ProductFeatures, TechnicalArchitectures, Milestones, Deliverables, JudgeScores, and Briefs.",
      apiIntegrationPlan:
        "REST endpoints under `/api/projects`, `/api/ai/generate`, and `/api/research` secured by server-side session verification.",
      aiIntegrationStrategy:
        "Use deterministic JSON schema prompts per workflow module with automatic fallback and explicit mode labeling (`GEMINI_LIVE` vs `STRATEGIST_DEV_ENGINE`).",
      securityConsiderations:
        "Server-side API key handling (never exposed in client bundles), strict project owner authorization checks (`403 Forbidden` on cross-user access), and input sanitization.",
      deploymentStrategy:
        "CI/CD via GitHub main branch deployed to Vercel with managed PostgreSQL environment variables.",
      technicalRisks: [
        {
          risk: "External LLM Latency or Quota Spikes During Live Judging",
          severity: "Medium",
          mitigation:
            "Implement request timeouts, response caching, and deterministic local fallback engine.",
        },
        {
          risk: "Unverified or Hallucinated Citations",
          severity: "High",
          mitigation:
            "Query live OpenAlex and Crossref academic registries directly and store traceable source URLs.",
        },
      ],
    },
    mermaidSystemDiagram: `flowchart TD
    subgraph Client["Frontend Layer (Next.js 15 + React + Tailwind)"]
        UI["Interactive Workspace & Intake Console"]
        PDF["A4 Document Preview & PDF Exporter"]
    end

    subgraph Backend["Server API Layer (Next.js Route Handlers)"]
        AUTH["Owner Authorization Guard"]
        ORCH["Structured AI Orchestrator"]
        RES["Citation & Evidence Verifier"]
    end

    subgraph Infra["External AI & Data Services"]
        LLM["Configurable LLM (Gemini / OpenAI)"]
        OA["OpenAlex & Crossref APIs"]
        DB[("PostgreSQL + Prisma ORM")]
    end

    UI --> AUTH --> ORCH
    UI --> PDF
    ORCH --> LLM
    ORCH --> RES --> OA
    ORCH --> DB`,
  };
}

// STEP 8 GENERATOR
export function generateStep8Timeline(
  project: Project
): DevelopmentTimelineData {
  const current = project.step8_developmentTimeline;
  const duration = current?.totalDuration?.trim() || "48 Hours";
  const roles =
    current?.teamRoles && current.teamRoles.length > 0
      ? current.teamRoles
      : ["Product Manager", "Full-Stack Developer", "AI Engineer", "UI/UX Designer"];

  const isHours = /hour|jam|24|36|48|54|72|weekend|day|hari/i.test(duration);

  const periods = isHours
    ? [
        "Phase 1 (Hours 1–6)",
        "Phase 2 (Hours 7–18)",
        "Phase 3 (Hours 19–30)",
        "Phase 4 (Hours 31–40)",
        "Phase 5 (Hours 41–48)",
      ]
    : [
        "Phase 1 (Period 1 — Discovery & Validation)",
        "Phase 2 (Period 2 — Product & UX Design)",
        "Phase 3 (Period 3 — Core Full-Stack Build)",
        "Phase 4 (Period 4 — AI Integration & Grounding)",
        "Phase 5 (Period 5 — QA, Deployment & Pitch Prep)",
      ];

  return {
    totalDuration: duration,
    teamSize: current?.teamSize || roles.length,
    teamRoles: roles,
    developmentDeadline:
      current?.developmentDeadline ||
      new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
    currentProgress:
      current?.currentProgress || "Strategy & Architecture Locked — Entering Build",
    milestones: [
      {
        id: "ms-1",
        orderIndex: 1,
        periodLabel: periods[0],
        activity: "Problem Validation, Rubric Alignment & Repo Setup",
        objective:
          "Lock down problem statement, verify research citations, and initialize full-stack repository.",
        tasks: [
          "Finalize Step 1–4 validation report and judge criteria mapping",
          "Initialize Next.js + TypeScript + Database schema and deploy staging URL",
        ],
        responsibleRole: roles[0] || "Product Manager",
        expectedOutput: "Validated Brief + Live Staging Skeleton",
        dependencies: "Competition theme & rubric confirmation",
        completionCriteria: "Staging URL live and 3+ citations verified.",
        completed: true,
      },
      {
        id: "ms-2",
        orderIndex: 2,
        periodLabel: periods[1],
        activity: "Core Domain Data Model & UI/UX Workflow Build",
        objective:
          "Build the primary user intake console and interactive state flow.",
        tasks: [
          "Implement responsive intake screen and sample scenario loader",
          "Connect database persistence and user session guard",
        ],
        responsibleRole: roles[1] || "Frontend / Full-Stack Developer",
        expectedOutput: "Interactive Frontend + API Persistence",
        dependencies: "Milestone 1",
        completionCriteria: "User can create and save records end-to-end.",
        completed: false,
      },
      {
        id: "ms-3",
        orderIndex: 3,
        periodLabel: periods[2],
        activity: "AI Orchestration, Structured JSON & Citation Grounding",
        objective:
          "Integrate LLM pipeline with strict JSON schema output and error fallbacks.",
        tasks: [
          "Build structured prompt templates and schema validators",
          "Connect real-time risk/priority scoring and source citations",
        ],
        responsibleRole: roles[2] || roles[1] || "AI Engineer",
        expectedOutput: "Working AI Analysis Endpoint",
        dependencies: "Milestone 2",
        completionCriteria: "AI endpoint returns structured JSON in <5 seconds.",
        completed: false,
      },
      {
        id: "ms-4",
        orderIndex: 4,
        periodLabel: periods[3],
        activity: "End-to-End Integration, Export Engine & Edge-Case QA",
        objective:
          "Connect all modules, verify PDF/report export, and test failure modes.",
        tasks: [
          "Implement A4 PDF export and Mermaid diagram rendering",
          "Test mobile responsiveness, authorization, and empty/error states",
        ],
        responsibleRole: roles[3] || roles[1] || "QA & UX Lead",
        expectedOutput: "Feature-Complete MVP Build",
        dependencies: "Milestone 3",
        completionCriteria: "Zero console/build errors and PDF exports cleanly.",
        completed: false,
      },
      {
        id: "ms-5",
        orderIndex: 5,
        periodLabel: periods[4],
        activity: "Pitch Deck, 3-Minute Demo Video & Submission Packaging",
        objective:
          "Package all mandatory deliverables and rehearse judge Q&A.",
        tasks: [
          "Record 3-minute narrated demo video showcasing core MVP flow",
          "Export Final Project Brief PDF and verify GitHub README instructions",
        ],
        responsibleRole: "All Team Members",
        expectedOutput: "Complete Hackathon Submission Package",
        dependencies: "Milestone 4",
        completionCriteria: "All mandatory deliverables checked off in Step 9.",
        completed: false,
      },
    ],
  };
}

// STEP 10 FINAL BRIEF COMPILER
export function compileStep10FinalBrief(
  project: Project,
  regenerateSectionKey?: keyof FinalBriefSections
): FinalBriefData {
  const c1 = project.step1_competition;
  const c2 = project.step2_judgeCriteria;
  const c3 = project.step3_problemDiscovery;
  const c4 = project.step4_evidenceValidation;
  const c5 = project.step5_solutionGenerator;
  const c6 = project.step6_productDesign;
  const c7 = project.step7_technicalArchitecture;
  const c8 = project.step8_developmentTimeline;
  const c9 = project.step9_deliverables;

  const selectedSol =
    c5?.customizedSolution ||
    c5?.alternatives?.find((a) => a.id === c5?.selectedSolutionId) ||
    c5?.alternatives?.[0];

  const generatedSections: FinalBriefSections = {
    section1_executiveSummary: `${
      c6?.productIdentity?.applicationName || project.title
    } (${project.tagline}) is an execution-ready hackathon project engineered for ${
      c1?.name || "the competition"
    } under the theme "${c1?.theme || "AI Innovation"}".\n\nProblem: ${
      c3?.analysis?.problemStatement ||
      c3?.biggestDifficulty ||
      "Operational bottlenecks in frontline workflows."
    }\n\nSolution: ${
      selectedSol?.conceptDescription ||
      c6?.valueProposition?.mainValueProposition ||
      "An AI-powered workflow copilot with verifiable grounding."
    }\n\nAI Estimated Competition Readiness Score: ${project.judgeScore.overallScore.toFixed(
      2
    )}/100.`,

    section2_problemValidation: `Structured Problem Statement:\n"${
      c3?.analysis?.problemStatement ||
      "Target users face severe operational delays due to manual processes."
    }"\n\nTarget User Persona: ${
      c3?.analysis?.userPersona?.name || c3?.whoExperiences || "Frontline Practitioner"
    } (${c3?.analysis?.userPersona?.role || "Domain Operator"})\nFrequency: ${
      c3?.analysis?.problemFrequency || c3?.frequency || "Daily"
    } | Severity: ${c3?.analysis?.problemSeverity || "High"}\n\nValidation Strength: ${
      c4?.report?.overallValidationStrength || "Moderate Evidence"
    }\n${
      c4?.report?.supportingEvidenceSummary ||
      "Supported by external academic and institutional citations."
    }\n\nMethodological Note: ${
      c4?.report?.deskVsCustomerDistinction ||
      "Desk research citations are distinguished from primary customer interviews."
    }`,

    section3_marketOpportunity: `Domain & Industry Opportunity (${
      c1?.domain || "Target Sector"
    }):\n${
      c4?.report?.marketOrSocialImpact ||
      "High measurable impact across frontline organizations."
    }\n\n${
      c4?.report?.opportunityAnalysis ||
      "Existing workarounds leave a clear gap for an integrated AI workflow."
    }\n\nRelevant Industries:\n${
      c1?.analysis?.relevantIndustries
        ?.map((ind) => `• ${ind.name}: ${ind.relevanceWhy}`)
        .join("\n") || "• Frontline operations and decision support."
    }`,

    section4_solutionOverview: `Selected Winning Concept: ${
      selectedSol?.name || c6?.productIdentity?.applicationName || project.title
    }\n\nConcept Description:\n${
      selectedSol?.conceptDescription || "Grounded AI decision and workflow copilot."
    }\n\nCore Innovation:\n${
      selectedSol?.innovation || c6?.valueProposition?.uniqueSellingProposition || "Multimodal & citation-grounded execution."
    }\n\nCompetitive Differentiation:\n${
      selectedSol?.competitiveDifferentiation ||
      c6?.valueProposition?.competitiveDifferentiation ||
      "Verifiable outputs with human-in-the-loop sign-off."
    }\n\nWhy Selected Over Alternatives:\n${
      c5?.recommendationReasoning ||
      "Highest combined alignment across Innovation, Impact, and Technical Feasibility."
    }`,

    section5_productFeaturesMvp: `Product Vision: ${
      c6?.productIdentity?.productVision || "Empower frontline practitioners with instant verified intelligence."
    }\nUnique Selling Proposition: ${
      c6?.valueProposition?.uniqueSellingProposition || "60-second grounded workflow."
    }\n\nFeature Prioritization (MoSCoW & MVP Scope):\n${
      c6?.features && c6.features.length > 0
        ? c6.features
            .map(
              (f) =>
                `• [${f.tier} | ${f.moscow}] ${f.name}: ${f.description}`
            )
            .join("\n")
        : "• [MVP | Must Have] Smart Intake Console\n• [MVP | Must Have] Grounded AI Risk & Rule Verifier\n• [MVP | Must Have] One-Click PDF Report Exporter"
    }`,

    section6_userJourneyFlow: `Target Persona Summary:\n${
      c6?.userExperience?.targetUserPersonaSummary ||
      c3?.whoExperiences ||
      "Frontline practitioner."
    }\n\nUser Journey Stages:\n${
      c6?.userExperience?.userJourneyStages
        ?.map((st) => `• ${st.stage}: ${st.action} → Outcome: ${st.outcome}`)
        .join("\n") ||
      "1. Intake → 2. Grounded AI Verification → 3. Human Sign-Off & Export"
    }\n\nMain Application Screens:\n${
      c6?.userExperience?.mainApplicationScreens
        ?.map(
          (sc) =>
            `• ${sc.screenName}: ${sc.purpose} (Interactions: ${sc.keyInteractions.join(
              ", "
            )})`
        )
        .join("\n") || "• Intake Console, Verification Inspector, Export View."
    }`,

    section7_systemArchitecture: `System Overview:\n${
      c7?.deliverables?.systemOverview ||
      "Modular 3-tier full-stack web architecture with structured AI orchestration."
    }\n\nArchitecture Explanation:\n${
      c7?.deliverables?.architectureExplanation ||
      "Stateless API routes enforce authentication, retrieve grounded context, and validate LLM JSON outputs."
    }\n\nDatabase Design:\n${
      c7?.deliverables?.databaseDesign ||
      "Normalized relational schema managed via Prisma ORM."
    }\n\nAI Integration Strategy:\n${
      c7?.deliverables?.aiIntegrationStrategy ||
      "Provider-agnostic structured JSON generation with deterministic fallback."
    }\n\nSecurity & Deployment:\n${
      c7?.deliverables?.securityConsiderations ||
      "Server-side API keys, strict owner authorization, and TLS encryption."
    } | Deployed via ${
      c7?.deliverables?.deploymentStrategy || "Vercel + Managed PostgreSQL"
    }.`,

    section8_technologyStack: `Recommended Technology Stack:\n• Frontend: ${
      c7?.systemArchitecture?.frontend || "Next.js 15, React, TypeScript, Tailwind CSS"
    }\n• Backend: ${
      c7?.systemArchitecture?.backend || "Next.js API Route Handlers"
    }\n• Database: ${
      c7?.systemArchitecture?.database || "PostgreSQL + Prisma ORM"
    }\n• AI Integration: ${
      c7?.systemArchitecture?.aiIntegration || c1?.targetTechnology || "Google Gemini API"
    }\n• Cloud & Auth: ${
      c7?.systemArchitecture?.cloudInfrastructure || "Vercel"
    } / ${c7?.systemArchitecture?.authentication || "Session Auth"}`,

    section9_developmentTimeline: `Total Duration: ${
      c8?.totalDuration || "48 Hours"
    } | Team Size: ${c8?.teamSize || 4} (${
      c8?.teamRoles?.join(", ") || "Cross-functional team"
    }) | Deadline: ${c8?.developmentDeadline || "Upcoming Submission"}\n\nExecution Milestones:\n${
      c8?.milestones && c8.milestones.length > 0
        ? c8.milestones
            .map(
              (m) =>
                `• ${m.periodLabel} — ${m.activity} (${m.responsibleRole}): ${m.objective} [Output: ${m.expectedOutput}]`
            )
            .join("\n")
        : "• Phase 1: Validation & Setup\n• Phase 2: Core MVP Build\n• Phase 3: AI Integration & Pitch Prep"
    }`,

    section10_competitionDeliverables: `Deliverable Readiness Status:\n${
      c9?.items
        ?.map(
          (d) =>
            `• [${d.completed ? "COMPLETED" : "PENDING"}] (${d.category}) ${
              d.title
            } — Owner: ${d.responsibleRole} | Due: ${d.deadline}`
        )
        .join("\n") || "• Pitch Deck, Working Demo, Source Code, Architecture Diagram."
    }`,

    section11_riskAnalysis: `Technical & Execution Risk Mitigation:\n${
      c7?.deliverables?.technicalRisks &&
      c7.deliverables.technicalRisks.length > 0
        ? c7.deliverables.technicalRisks
            .map(
              (r) =>
                `• Risk: ${r.risk} [Severity: ${r.severity}]\n  Mitigation: ${r.mitigation}`
            )
            .join("\n\n")
        : "• Risk: LLM Hallucination → Mitigation: Strict protocol grounding & human sign-off.\n• Risk: Scope Creep → Mitigation: Strict MoSCoW MVP enforcement."
    }\n\nEvidence Gaps to Monitor:\n${
      c4?.report?.evidenceGaps?.map((g) => `• ${g}`).join("\n") ||
      "• Conduct direct field usability testing with target users."
    }`,

    section12_judgeAlignmentScore: `AI Estimated Competition Readiness Score: ${project.judgeScore.overallScore.toFixed(
      2
    )} / 100\nWeakest Category: ${project.judgeScore.weakestCategory}\n\nWeighted Breakdown:\n${project.judgeScore.categories
      .map(
        (cat) =>
          `• ${cat.category} (Weight ${cat.weight}%): Raw Score ${
            cat.rawScore
          }/100 → Weighted ${cat.weightedScore.toFixed(2)} pts\n  Reasoning: ${
            cat.reasoning
          }`
      )
      .join("\n\n")}\n\nRubric Strategic Interpretation:\n${
      c2?.overallInterpretation ||
      "Aligned with competition judging weights."
    }`,

    section13_winningStrategy: `1. Lead With Verifiable Evidence: Open the pitch with the structured problem statement and cite ${
      c4?.evidenceItems?.[0]?.sourceOrganization || "verified research sources"
    } to anchor the Impact score.\n2. Show the Live Workflow Within 45 Seconds: Demonstrate ${
      c6?.productIdentity?.applicationName || project.title
    } processing a real scenario end-to-end rather than spending 2 minutes on static slides.\n3. Emphasize Safety & Feasibility: Highlight the human-in-the-loop verification step and clean ${
      c1?.targetTechnology || "full-stack"
    } architecture.\n4. Address Judge Priorities Directly: ${
      c2?.strategicPriorities?.join(" ") ||
      "Focus on Innovation and measurable Impact."
    }`,

    appendix_references:
      c4?.evidenceItems && c4.evidenceItems.length > 0
        ? c4.evidenceItems
            .map(
              (ev, idx) =>
                `[${idx + 1}] ${ev.sourceTitle} — ${ev.sourceOrganization} (${
                  ev.publicationDate
                }). Type: ${ev.evidenceType}. Strength: ${
                  ev.evidenceStrength
                }.\n    URL: ${ev.originalSourceUrl}`
            )
            .join("\n\n")
        : "No external citations recorded yet. Complete Step 4 (Evidence Validation Engine).",

    appendix_statistics:
      c4?.evidenceItems && c4.evidenceItems.length > 0
        ? c4.evidenceItems
            .map(
              (ev) =>
                `• ${ev.supportingStatistic} (${ev.sourceOrganization}, ${ev.publicationDate})\n  Relevance: ${ev.relevanceToProblem}`
            )
            .join("\n\n")
        : "No statistical insights recorded yet.",

    appendix_technicalNotes: `• Target Competition Stack: ${
      c1?.targetTechnology || "Next.js, TypeScript, PostgreSQL, AI API"
    }\n• API Contract: Deterministic JSON schema enforcement with fallback resiliency.\n• Authorization Model: Strict owner-based isolation per project ID.`,

    appendix_glossary: `• MoSCoW: Must Have, Should Have, Could Have, Won't Have Yet prioritization framework.\n• RAG (Retrieval-Augmented Generation): Grounding AI outputs in verified external documents or protocols.\n• Human-in-the-Loop (HITL): Mandatory practitioner verification step before finalizing critical actions.\n• Desk Research vs. Customer Validation: Secondary literature/statistical evidence vs. primary user interviews.`,
  };

  const existingBrief = project.step10_finalBrief;
  const editedMap = { ...(existingBrief?.editedSections || {}) };
  const mergedSections = { ...generatedSections };

  // Rule #8: Preserve user edits when regenerating content (unless user explicitly regenerates that single section)
  if (existingBrief?.sections) {
    (Object.keys(generatedSections) as (keyof FinalBriefSections)[]).forEach(
      (key) => {
        if (
          editedMap[key] &&
          regenerateSectionKey !== key &&
          existingBrief.sections[key]
        ) {
          mergedSections[key] = existingBrief.sections[key];
        }
      }
    );
  }

  if (regenerateSectionKey) {
    editedMap[regenerateSectionKey] = false;
  }

  return {
    cover: {
      projectName:
        c6?.productIdentity?.applicationName ||
        project.title ||
        "Hackathon Project Brief",
      competitionName:
        c1?.name || existingBrief?.cover?.competitionName || "Hackathon Competition",
      competitionTheme:
        c1?.theme || existingBrief?.cover?.competitionTheme || "Innovation Theme",
      teamName: project.teamName || existingBrief?.cover?.teamName || "Alpha Team",
      preparedBy:
        project.preparedBy ||
        existingBrief?.cover?.preparedBy ||
        "Christian Immanuel Valerio",
      date: new Date().toISOString().slice(0, 10),
      projectTagline:
        c6?.productIdentity?.tagline ||
        project.tagline ||
        "Validated, Judge-Aligned Project Brief",
    },
    sections: mergedSections,
    editedSections: editedMap,
    lastCompiledAt: new Date().toISOString(),
  };
}
