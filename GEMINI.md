# GEMINI PROJECT CONTEXT & INSTRUCTIONS: TELEMETRY (IOMETE BOARDROOM)

> **CRITICAL INSTRUCTION FOR ALL AGENTS & GEMINI SESSIONS:**
> You are working on **Telemetry — IOMETE Boardroom**, a production-quality, hackathon-ready enterprise web application.
> DO NOT ask the user to re-explain the product goals, target audience, stack, business logic, or design rules.
> All ground truth is documented in this context folder. Ingest this file and the `./memory/` pack before answering or generating code.

---

## 1. Executive Summary & Tagline
- **Product Name**: Telemetry — IOMETE Boardroom
- **Tagline**: *"Turn complex data-platform decisions into board-ready business cases."*
- **One-Line Definition**: Telemetry is a premium enterprise decision workspace that helps an IOMETE sales representative, solutions engineer, or internal champion turn a large enterprise's data-platform requirements into a clear IOMETE deployment recommendation, transparent 3-year cost model, sovereignty assessment, 1-page executive approval memo, and 60-second spoken board briefing.
- **Tone & Persona**: Serious B2B financial, governance, and infrastructure planning tool (McKinsey report credibility + Stripe precision + Linear polish + Vercel calm tech). **NOT a generic AI chat app or toy.**

---

## 2. Core Operational Workflow (< 3 Minutes End-to-End)
1. **Open Telemetry**: Land on high-polish workspace dashboard.
2. **Create Deal Room**: Intake via structured form, free text, or live microphone voice recording (ElevenLabs STT).
3. **Structured Profile Extraction**: LLM extracts structured enterprise fields; user reviews and edits.
4. **Adjust Business Assumptions**: Tweak transparent unit metrics (vCPU sizing, growth, baseline spend).
5. **Deterministic Case Generation**: Instant calculation of deployment fit, 3-year TCO, projected savings, and sovereignty score.
6. **Executive Memo Review**: View and print/export a 1-page C-suite memo (prepared for CIO, CFO, CISO, Head of Data).
7. **Audio Board Briefing**: Stream an executive-grade 60-second spoken briefing via ElevenLabs TTS.
8. **Version Control & Persistence**: Tiger Data PostgreSQL persists all Deal Rooms, profiles, assumptions, memos, and audit trails.

---

## 3. Strict Non-Negotiable Product Principles
1. **Accuracy First & Explicit Labeling**:
   - NEVER present generated financial figures as guaranteed facts.
   - EVERY single metric must be clearly tagged with one of:
     - `User input`
     - `Calculated`
     - `Vendor-claimed`
     - `Assumption`
     - `Requires IOMETE validation`
   - Include a visible **Assumptions & Sources** inspection drawer on every screen.
2. **No Hallucinated Claims**:
   - The LLM writes narrative text ONLY. It MUST NEVER invent prices, discounts, compliance certificates, SLA guarantees, or customer references.
   - All commercial and financial claims must derive strictly from deterministic calculations and explicit user inputs.
3. **Calm Enterprise UI / Anti-AI Aesthetics (`ui-ux-pro-max-skill`)**:
   - **PROHIBITED**: Purple/blue AI gradients, neon highlights, cartoonish borders, excessive glassmorphism, floating chat bubbles, emojis in business tables.
   - **REQUIRED**: Deep forest green `#0F5132` primary accent, warm stone neutrals (`#FAFAF9`, `#FFFFFF`, `#E4E4E1`), IBM Plex Serif headers for executive memos, JetBrains Mono for numbers/financial data, Inter for UI text, dense tabular data cards with microcopy and source badges.

---

## 4. Technology Stack Contract
- **Frontend Framework**: Next.js 15+ (App Router, React Server Components where appropriate, TypeScript).
- **Styling & Components**: Tailwind CSS, shadcn/ui, Radix UI primitives, Lucide icons.
- **Data Visualization**: Recharts (clean bar/area 3-year comparison charts).
- **Form Handling**: `react-hook-form` + `zod`.
- **Database & ORM**: Tiger Data PostgreSQL, Drizzle ORM, Drizzle Kit migrations, connection pooling.
- **AI & Speech**:
  - ElevenLabs STT API (`scribe_v1`) for speech-to-text intake.
  - ElevenLabs TTS API (`eleven_turbo_v2_5`) for 60-second executive voice briefing.
  - LLM (Gemini 2.5 Pro / GPT-4.1) strictly for structured JSON extraction and constrained memo drafting.
- **Remote Context & Memory**: Meko MCP (`https://mcp.mekodata.ai/mcp`) via `mcp_config.json`.

---

## 5. Memory Pack Directory Map
Read these files in `./memory/` for granular implementations:
- `01_PRODUCT_OVERVIEW.md` — Product goal, buying friction solved, user journey, audience profiles.
- `02_ARCHITECTURE_AND_STACK.md` — Detailed system architecture, route handlers, directory layout.
- `03_UI_UX_DESIGN_SYSTEM.md` — Complete design tokens, typography, component rules from `ui-ux-pro-max-skill`.
- `04_BUSINESS_CASE_ENGINE.md` — Exact TypeScript mathematical formulas, vCPU sizing, pricing constants, sovereignty logic.
- `05_DATABASE_SCHEMA.md` — Complete PostgreSQL DDL, Drizzle schema, indexes, audit events.
- `06_API_AND_AI_PROMPTS.md` — Extraction prompts, memo generation constraints, ElevenLabs STT/TTS contracts.
- `07_DEMO_SCENARIOS_AND_SCRIPTS.md` — NordBank, Helix Manufacturing, Meridian Health datasets, and 3-minute judge script.
- `08_ACCEPTANCE_CRITERIA.md` — Comprehensive quality checklist for hackathon judging.
