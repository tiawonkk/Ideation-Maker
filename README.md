# Hackathon Brief Generator AI (`Ideation-Maker` V1.0)

**From Hackathon Theme to Winning Project Strategy.**  
*Turn your hackathon theme into a validated, technically feasible, judge-aligned project plan.*

**Product Owner:** Christian Immanuel Valerio  
**Product Version:** V1.0  
**Category:** AI Product Strategist & Hackathon Planning Workspace  

---

## 1. Overview

**Hackathon Brief Generator AI** is a full-stack AI Product Strategist workspace designed for hackathon teams competing in events such as **Microsoft AI Challenge**, **Gemini API Developer Competition**, **AWS Hackathon**, **AI Innovation Competition**, **GEMASTIK**, **PKM-KC**, and **Startup Weekend**.

Unlike generic brainstorming chatbots, this workspace guides teams through a rigorous **10-Step Product Strategy & Technical Planning Workflow**, evaluates readiness continuously via a weighted **Judge Score Engine**, retrieves **real, verifiable academic and institutional research citations** (via OpenAlex & Crossref APIs), and compiles a **13-section + Research Appendix A4 PDF Project Brief**.

---

## 2. Core Features & 10-Step Workflow

1. **Step 1 — Competition Theme Analyzer**: Deconstructs competition themes into industry opportunities, technical angles, potential problem areas, and recommended innovation directions.
2. **Step 2 — Judge Criteria Engine**: Dynamic custom rubric builder with automatic 100% weight validation and strategic priority mapping.
3. **Step 3 — Problem Discovery Engine**: 6-question root-cause discovery producing a target user persona and structured problem statement (`"[Target user] experiences [specific problem] because [root cause], resulting in [measurable impact]."`).
4. **Step 4 — Evidence Validation Engine (Real Citations)**: Live scholarly search integration with **OpenAlex** and **Crossref** academic registries to attach real DOIs, publication dates, organizations, and clickable source URLs—plus an 8-part **Problem Validation Report** that explicitly distinguishes secondary desk research from primary customer interviews.
5. **Step 5 — Solution Generator (3x Alternatives)**: Generates and compares three distinct solution concepts scored for feasibility, complexity, differentiation, and judge alignment.
6. **Step 6 — Product Design & MoSCoW Scope**: Defines Product Identity, Value Proposition, MVP / Core / Future features, MoSCoW prioritization, and a **Mermaid.js User Flow diagram**.
7. **Step 7 — Technical Architecture Generator**: Recommends a full-stack technology table, 9 technical deliverables, risk mitigations, and a **Mermaid.js System Architecture diagram**.
8. **Step 8 — Adaptive Development Timeline**: Generates an execution roadmap tailored to your actual competition duration (e.g., 24 Hours, 48 Hours, 2 Weeks, or 8 Weeks), team size, and roles.
9. **Step 9 — Competition Deliverable Checklist**: Trackable checklist for Mandatory, Recommended, and Custom competition deliverables.
10. **Step 10 — Final Project Brief & Editorial A4 PDF Export**: Compiles the Cover Page, Table of Contents, 13 core sections, and 4-part Appendix into an editable document with section-level regeneration (preserving manual user edits) and print-accurate A4 PDF export.

---

## 3. Sticky Judge Score Engine

Visible throughout the workspace (`AI Estimated Competition Readiness Score`), the Judge Score Engine computes:
$$\text{Overall Score} = \sum (\text{Category Score} \times \text{Category Weight})$$
- Supports default weights (*Innovation 30%, Impact 30%, Feasibility 15%, Technical Excellence 15%, Presentation 10%*) or custom Step 2 criteria.
- Highlights the **Weakest Category**, provides **Actionable Improvement Suggestions**, tracks **Score Progression History**, and surfaces **Confidence / Data Completeness Warnings**.

---

## 4. Architecture & Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend:** Next.js Typed Route Handlers (`/api/auth`, `/api/projects`, `/api/ai/generate`, `/api/research`)
- **Database Schema & Persistence:** 14-Entity Relational Schema (`prisma/schema.prisma`) with atomic JSON/SQLite local persistence (`src/lib/db.ts`) and strict server-side per-owner authorization (`403 Forbidden` on cross-user access)
- **AI Orchestration:** Provider-agnostic AI service supporting **Google Gemini API (`gemini-2.5-flash`)**, **OpenAI API**, and a built-in **Deterministic AI Strategist Engine (`STRATEGIST_DEV_ENGINE`)** for zero-config offline/development execution
- **Research Integration:** Live HTTP integration with **OpenAlex API** and **Crossref API** for traceable citations
- **Bilingual Support:** English (`EN`) and Bahasa Indonesia (`ID`) UI switcher

---

## 5. Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation & Local Development
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### Optional Environment Variables (`.env.local`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ideation_maker"
GEMINI_API_KEY="your-gemini-api-key"
OPENAI_API_KEY="your-openai-api-key"
```
*(You can also configure your API key directly inside the application via the **AI Engine Config** modal in the top navigation bar.)*

### Running Tests & Production Build
```bash
npm test
npm run build
```

---

## 6. Project Structure

```text
├── prisma/
│   └── schema.prisma                # 14-entity relational database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/route.ts        # Session & multi-user account switcher API
│   │   │   ├── projects/            # Project CRUD, duplicate, and step save APIs
│   │   │   ├── ai/generate/route.ts # Structured AI generation & regeneration API
│   │   │   └── research/route.ts    # Live OpenAlex & Crossref research API
│   │   ├── auth/page.tsx            # Sign-in, registration & authorization QA switcher
│   │   ├── dashboard/page.tsx       # Project management dashboard & competition presets
│   │   ├── projects/[id]/
│   │   │   ├── page.tsx             # 10-Step Workspace + Sticky Judge Score Engine
│   │   │   └── brief/page.tsx       # Dedicated Final Brief Editor & A4 PDF Preview
│   │   └── page.tsx                 # Landing Page
│   ├── components/
│   │   ├── brief/                   # A4 Document Renderer & Section Editor
│   │   ├── layout/                  # Navbar & Global AppProvider
│   │   └── workspace/               # Steps 1-10 UI, JudgeScorePanel, MermaidDiagram
│   ├── lib/
│   │   ├── ai/                      # Master System Prompt & Step 1-10 Generators
│   │   ├── research/                # OpenAlex/Crossref Evidence Service
│   │   ├── scoring/                 # Weighted Judge Score Engine
│   │   ├── auth.ts                  # Server-side session & authorization guard
│   │   └── db.ts                    # Persistent repository with pre-seeded sample project
│   └── types/
│       └── project.ts               # End-to-end TypeScript interfaces
└── __tests__/
    └── ideation-maker.test.ts       # Automated Vitest verification suite
```
