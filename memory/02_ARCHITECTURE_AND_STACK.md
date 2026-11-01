# 02 — Application Architecture & Tech Stack

## 1. System Topology
```
Browser Client (Next.js 15+ App Router)
├── / (Landing Page & Executive Hero)
├── /deal-rooms (Deal Room Portfolio Dashboard)
├── /deal-rooms/new (Multi-Modal Intake Room: Audio + Freeform + Form)
├── /deal-rooms/[id] (The Briefing Room: 3-Column Cockpit)
│   ├── Left Column: Stage Navigator & Room Meta
│   ├── Center Column: Tabs (Profile | Assumptions | Business Case | Executive Memo | Board Briefing)
│   └── Right Column: "Confidence & Sources" Insight Drawer & Version History
└── /deal-rooms/[id]/memo (Print-Ready 1-Page PDF/HTML View)

Server Boundary (Next.js Server Route Handlers)
├── POST /api/transcribe            --> ElevenLabs STT (Scribe v1)
├── POST /api/extract-profile       --> LLM Structured Extractor (Strict JSON schema)
├── POST /api/generate-case         --> Deterministic Business-Case Engine (Pure TypeScript)
├── POST /api/generate-memo         --> LLM Executive Memo Drafter (Strict narrative rules)
├── POST /api/generate-briefing     --> Template-based 60s script generator
├── POST /api/generate-audio        --> ElevenLabs TTS (Eleven Turbo v2.5)
└── /api/deal-rooms                 --> CRUD & Versioning against Tiger Data PostgreSQL

Data & Persistence Layer
└── Tiger Data PostgreSQL (via Drizzle ORM + Connection Pooling)
    ├── users
    ├── workspaces
    ├── deal_rooms
    ├── company_profiles
    ├── assumptions
    ├── generated_cases
    ├── memo_versions
    ├── briefing_scripts
    └── audit_events
```

## 2. Directory Structure Convention
```
src/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx                        # High-polish landing page
│   ├── deal-rooms/
│   │   ├── page.tsx                        # Dashboard & Deal Room Table
│   │   ├── new/
│   │   │   └── page.tsx                    # Intake UI (Voice / Text / Form)
│   │   └── [id]/
│   │       ├── page.tsx                    # 3-column Briefing Room
│   │       └── memo/
│   │           └── page.tsx                # Print-optimized memo
│   └── api/
│       ├── transcribe/route.ts
│       ├── extract-profile/route.ts
│       ├── generate-case/route.ts
│       ├── generate-memo/route.ts
│       ├── generate-briefing/route.ts
│       ├── generate-audio/route.ts
│       └── deal-rooms/
│           ├── route.ts
│           └── [id]/route.ts
├── components/
│   ├── ui/                                 # shadcn/ui primitives
│   ├── briefing-room/                      # Deal Room specific tabs & widgets
│   ├── memo/                               # Memo document renderer
│   ├── audio/                              # Voice recorder & audio player
│   └── layout/                             # Sidebar, TopNav, RightInsightDrawer
├── lib/
│   ├── business-case/
│   │   ├── engine.ts                       # Pure deterministic calculation engine
│   │   ├── types.ts                        # DealProfile, EngineAssumptions, CaseOutput
│   │   └── constants.ts                    # Pricing tiers & default coefficients
│   ├── db/
│   │   ├── schema.ts                       # Drizzle ORM schema definitions
│   │   ├── index.ts                        # Postgres client / pool
│   │   └── seed.ts                         # NordBank, Helix, Meridian seed data
│   ├── elevenlabs/
│   │   ├── stt.ts                          # STT client & fallback
│   │   └── tts.ts                          # TTS client & fallback
│   └── ai/
│       ├── extract.ts                      # Profile extraction prompt
│       └── memo.ts                         # Executive memo prompt
└── types/
```

## 3. Environment Configuration (`.env.example`)
```bash
DATABASE_URL="postgresql://user:password@host.tigerdata.com:5432/telemetry?sslmode=require"
ELEVENLABS_API_KEY="el_live_..."
ELEVENLABS_STT_MODEL="scribe_v1"
ELEVENLABS_TTS_VOICE_ID="nPczCjzI2devNBz1zQrb" # Calm, confident executive voice
ELEVENLABS_TTS_MODEL="eleven_turbo_v2_5"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4.1" # or GEMINI_API_KEY="AIza..." + GEMINI_MODEL="gemini-2.5-pro"
APP_ENV="development"
DEMO_MODE="true" # Always true for resilient offline presentations
```
