"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/components/layout/AppProvider";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Target,
  Cpu,
  FileText,
  Scale,
  Search,
  Sparkles,
  Layers,
  Award,
  BookOpen,
} from "lucide-react";

const TEN_STEPS = [
  {
    num: "01",
    title: "Competition Theme Analyzer",
    desc: "Deconstructs competition themes into industry opportunities, technical angles, and judge focus areas.",
  },
  {
    num: "02",
    title: "Judge Criteria Engine",
    desc: "Dynamic custom scoring criteria validated to 100% weight with strategic priority mapping.",
  },
  {
    num: "03",
    title: "Problem Discovery Engine",
    desc: "Guided 6-question root-cause discovery producing structured problem statements and user personas.",
  },
  {
    num: "04",
    title: "Evidence Validation Engine",
    desc: "Queries live academic & public datasets (OpenAlex, Crossref, WHO) for verifiable citations and URLs.",
  },
  {
    num: "05",
    title: "Solution Generator (3x)",
    desc: "Generates and compares 3 distinct solution concepts scored for feasibility, innovation, and judge fit.",
  },
  {
    num: "06",
    title: "Product Design & MoSCoW",
    desc: "Defines MVP vs Core vs Future features, MoSCoW prioritization, and Mermaid user flow diagrams.",
  },
  {
    num: "07",
    title: "Technical Architecture",
    desc: "Full-stack tech recommendations, 9 technical deliverables, risk analysis, and Mermaid system diagrams.",
  },
  {
    num: "08",
    title: "Development Timeline",
    desc: "Adaptive sprint roadmap tailored to your actual competition deadline, team size, and roles.",
  },
  {
    num: "09",
    title: "Competition Deliverables",
    desc: "Trackable checklist covering mandatory and recommended hackathon submission artifacts.",
  },
  {
    num: "10",
    title: "Final Project Brief & A4 PDF",
    desc: "Compiles all 13 sections + research appendix into an editable, pitch-ready A4 PDF document.",
  },
];

const COMPETITIONS = [
  "Microsoft AI Challenge",
  "Gemini API Developer Competition",
  "AWS Hackathon",
  "AI Innovation Competition",
  "GEMASTIK",
  "PKM-KC",
  "Startup Weekend",
];

export default function LandingPage() {
  const { t, lang } = useApp();

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl leading-[1.1]">
            From Hackathon Theme to{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
              Winning Project Strategy.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Validate problems, design solutions, align with judges, and generate
            an execution-ready project brief with AI.
          </p>

          {/* Core Product Promise Banner */}
          <div className="mx-auto mt-6 max-w-2xl rounded-2xl px-5 py-3.5 text-xs sm:text-sm glass-panel">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mr-2">
              {t.hero.promiseLabel}:
            </span>
            &ldquo;{t.hero.promiseText}&rdquo;
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard" className="btn-apple-primary text-sm px-7 py-3.5">
              <span>Start Building Your Brief</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="btn-glass-secondary text-sm px-6 py-3.5"
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Target Competitions Bar */}
          <div className="mt-14 pt-8 border-t border-slate-200/70 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              {lang === "id"
                ? "Dirancang untuk Tim Kompetisi & Inovasi"
                : "Engineered for Teams Competing In"}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
              {COMPETITIONS.map((comp) => (
                <span
                  key={comp}
                  className="glass-card rounded-xl px-3.5 py-1.5 text-xs font-semibold"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT VALUE PROPOSITION (6-IN-1 AI STRATEGIST ROLES) */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Not a Generic Chatbot
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold">
              6 Elite Advisory Roles Unified in One Planning Workspace
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Hackathon Brief Generator AI challenges weak assumptions, validates
              evidence with real citations, and aligns every product decision
              with your competition&apos;s judging rubric.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                role: "Product Manager",
                icon: Target,
                desc: "Defines product vision, value proposition, MoSCoW prioritization, and realistic MVP scope.",
              },
              {
                role: "Hackathon Judge",
                icon: Scale,
                desc: "Continuously evaluates your project against weighted criteria via the live Judge Score Engine.",
              },
              {
                role: "Market Research Analyst",
                icon: Search,
                desc: "Retrieves verifiable academic & industry evidence with real DOIs and URLs—never fabricated data.",
              },
              {
                role: "Startup Mentor",
                icon: Award,
                desc: "Challenges weak problem assumptions and differentiates your concept from generic wrappers.",
              },
              {
                role: "Business Analyst",
                icon: BookOpen,
                desc: "Connects root-cause pain points to measurable social or commercial opportunities.",
              },
              {
                role: "Software Architect",
                icon: Cpu,
                desc: "Designs pragmatic full-stack architectures, AI integration schemas, and Mermaid diagrams.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.role}
                  className="glass-panel rounded-2xl p-6 transition hover:scale-[1.01]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold">{item.role}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (10-STEP WORKFLOW) */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Structured Methodology
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold">
                How It Works: The 10-Step Winning Workflow
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Navigate forward and backward freely with persistent autosave and
              live Judge Readiness scoring at every stage.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {TEN_STEPS.map((step) => (
              <div
                key={step.num}
                className="glass-card flex flex-col justify-between rounded-2xl p-5"
              >
                <div>
                  <span className="inline-block rounded-lg bg-indigo-500/15 px-2.5 py-0.5 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    STEP {step.num}
                  </span>
                  <h3 className="mt-3 text-sm font-bold">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Key Capabilities
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold">
              Everything Required to Win Technical & Product Hackathons
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
                <h3 className="text-lg font-bold">
                  Real Evidence Validation Engine (Zero Hallucinations)
                </h3>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Connects directly to OpenAlex, Crossref, and Wikipedia research
                registries to pull verifiable academic papers, publication dates,
                organizations, and clickable source URLs—clearly distinguishing
                desk research from customer interviews.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <Scale className="h-6 w-6 text-indigo-500" />
                <h3 className="text-lg font-bold">
                  Apple Fitness-Style Sticky Judge Score Engine
                </h3>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculates your real-time weighted{" "}
                <strong>AI Estimated Competition Readiness Score</strong> across
                Innovation, Impact, Feasibility, Technical Excellence, and
                Presentation—pinpointing your weakest category and how to fix it.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <Layers className="h-6 w-6 text-violet-500" />
                <h3 className="text-lg font-bold">
                  Mermaid User Flows & System Architecture Diagrams
                </h3>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Automatically generates visual Mermaid flowcharts with
                interactive zoom and code toggles for both UX journeys (Step 6)
                and full-stack technical architectures (Step 7).
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-amber-500" />
                <h3 className="text-lg font-bold">
                  Split-Screen Editorial A4 PDF Export (13 Sections + Appendix)
                </h3>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Compiles your Cover Page, Table of Contents, 13 strategic
                sections, and cited Research Appendix into a print-ready A4 PDF
                document with section-by-section editing and completeness checks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE GENERATED PROJECT BRIEF */}
      <section id="sample-brief" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200/70 dark:border-white/10 pb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Sample Generated Project Brief Included
                </span>
                <h2 className="mt-3 text-2xl font-extrabold">
                  MedTriage Rural AI — Multimodal Clinical Triage Copilot
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Competition: Gemini API Developer Competition • Theme: AI for
                  Social Impact & Accessible Healthcare
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="glass-card rounded-2xl px-4 py-2 text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                    AI Estimated Readiness Score
                  </div>
                  <div className="text-xl font-extrabold">
                    92.4{" "}
                    <span className="text-xs font-normal text-slate-500">
                      / 100
                    </span>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="btn-apple-primary text-xs"
                >
                  <span>Open Planning Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3 text-xs">
              <div className="glass-card rounded-2xl p-4">
                <div className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Structured Problem Statement
                </div>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
                  &ldquo;Frontline triage nurses at rural primary care clinics
                  experience delays and documentation overload when assessing
                  complex patient presentations because clinical guidelines are
                  trapped in static manuals and referral summaries are drafted
                  manually, resulting in 15–25 minute administrative bottlenecks
                  per referral.&rdquo;
                </p>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <div className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Verified Evidence Citations
                </div>
                <ul className="mt-2 space-y-2 text-slate-600 dark:text-slate-300">
                  <li>
                    • <strong>WHO (2023):</strong> 10M projected health worker
                    deficit disproportionately impacting rural primary care.
                  </li>
                  <li>
                    • <strong>BMJ / Crossref (2022):</strong> Structured CDSS
                    improves clinical guideline adherence by 12%–28%.
                  </li>
                  <li>
                    • <strong>PubMed Central (2021):</strong> Standardized SBAR
                    handoffs cut referral omissions by &gt;30%.
                  </li>
                </ul>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <div className="font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  Recommended Architecture & MVP
                </div>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
                  Next.js 15 PWA + Gemini Multimodal (Voice + Vital Chart Photo)
                  + PostgreSQL SOP Grounding + One-Click A4 SBAR Referral Export
                  with mandatory nurse sign-off.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold">
            Ready to Transform Your Hackathon Idea Into a Winning Brief?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Launch the 10-step AI Product Strategist workspace, validate your
            problem with real citations, and export your A4 project brief in
            under 20 minutes.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/dashboard" className="btn-apple-primary text-sm px-7 py-3.5">
              <span>Start Building Your Brief</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="glass-panel border-b-0 border-x-0 rounded-none py-8 text-xs text-slate-500">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Hackathon Brief Generator AI (Ideation-Maker V1.0)
            </span>{" "}
            — Product Owner: Christian Immanuel Valerio
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/dashboard" className="hover:text-indigo-500">
              Dashboard
            </Link>
            <Link href="/auth" className="hover:text-indigo-500">
              Account & Authorization
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
