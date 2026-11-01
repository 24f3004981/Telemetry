# Telemetry

> **Turn complex data-platform decisions into board-ready business cases in under 3 minutes.**

Telemetry is an enterprise decision workspace built for solutions architects, sales leaders, and internal enterprise champions. It turns prospective customer discovery notes into a verified IOMETE deployment architecture, deterministic 3-year TCO model, data sovereignty assessment, 1-page executive approval memo, and 60-second spoken board briefing.

---

## 🎯 The Core Problem

Enterprise buying decisions stall at the board level because champions lack the artifacts to answer three questions from the CIO, CFO, and CISO:
1. **CIO:** *"Why should we adopt IOMETE instead of staying on Snowflake, Databricks, or our legacy Hadoop cluster?"*
2. **CFO:** *"What is the true 3-year Total Cost of Ownership, and when is payback achieved?"*
3. **CISO:** *"Will our data ever leave our VPC or Kubernetes perimeter, and how is encryption governed?"*

Telemetry generates the exact, mathematically verifiable assets required to answer all three.

---

## ✨ Key Capabilities

### 1. Discovery Intake & Parameter Extraction
- **Voice Discovery Capture:** Speak customer context directly using ElevenLabs Scribe Speech-to-Text or high-fidelity browser voice capture.
- **Structured Parameter Extraction:** Automatically extracts scale (TB), data residency jurisdiction, current platform spend, workload types, and compliance standards into editable fields.
- **Quick-Start Presets:** Instant pre-configured discovery cases for **NordBank AG** (400 TB • Tier-1 EU Banking), **Helix Manufacturing** (120 TB • IoT Hadoop migration), and **Meridian Health** (260 TB • HIPAA compliance).

### 2. Deterministic Financial & Sizing Engine
- **No LLM Hallucinations in Financials:** Every dollar figure and compute requirement is calculated deterministically via transparent architectural formulas.
- **Cluster Sizing Footprint:** Translates data volume and compute intensity into vCPU requirements ($500/vCPU/yr benchmark).
- **Cumulative 3-Year TCO Comparison:** Visualizes side-by-side annual costs (IOMETE license + customer cloud compute vs current warehouse baseline with compounding growth).
- **Payback & ROI Horizon:** Computes net dollar savings and payback period in months.

### 3. Data Sovereignty & Governance Audit
- **0–100 Sovereignty Scoring:** Evaluates multi-tenant exposure, encryption key ownership (KMS), and cross-border transfer risk.
- **Customer VPC Deployment:** Recommends in-VPC Kubernetes execution so object storage and compute never leave customer boundaries.
- **Open Table Formats:** Native Apache Iceberg on Parquet eliminates vendor lock-in.

### 4. Executive Memo & Spoken Briefing
- **1-Page Board Memo:** Formatted specifically for C-suite decision makers. Includes executive summary, financial justification, risks & unknowns, and 90-day evaluation milestones. Ready for browser Print-to-PDF.
- **60-Second Audio Board Briefing:** Generates concise, spoken briefings using ElevenLabs AI Voice (Turbo v2.5) with full speed controls, waveform visualizer, and instant browser synthesis fallback.
- **Interactive Battlecard Table:** Compares IOMETE against Snowflake, Databricks, and Legacy Hadoop across data perimeter, license predictability, table format openness, and governance.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, React Server Components)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with Munshi-inspired warm alabaster aesthetic
- **Charts:** [Recharts](https://recharts.org/) for responsive 3-year TCO projections
- **Icons:** [Lucide React](https://lucide.dev/)
- **Voice AI:** [ElevenLabs](https://elevenlabs.io/) (STT Scribe & TTS Turbo v2.5) with in-player API key configuration
- **Database:** Enterprise PostgreSQL (Tiger Data compatible) with offline JSON-backed failover store
- **Memory & Context:** [Meko MCP](https://mcp.mekodata.ai/mcp) context integration for multi-agent persistence

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.18+ or 20+
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/24f3004981/IOMETE-project.git
cd IOMETE-project

# Install dependencies
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```

Key environment variables:
```env
# Database (PostgreSQL / Tiger Data)
DATABASE_URL="postgres://..."

# ElevenLabs Voice AI
ELEVENLABS_API_KEY="xi-api-key"
ELEVENLABS_TTS_VOICE_ID="nPczCjzI2devNBz1zQrb"
ELEVENLABS_TTS_MODEL="eleven_turbo_v2_5"

# Optional LLM API for memo drafting
OPENAI_API_KEY=""
GEMINI_API_KEY=""
```

*(Note: Telemetry includes complete deterministic fallbacks and local persistence; it runs out-of-the-box even without external API keys).*

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Mobile & Responsive Experience
Telemetry is designed for high-touch mobile navigation:
- Synchronous audio trigger prevents mobile browser autoplay blocking.
- Horizontal pill navigation allows one-tap switching between decision stages.
- Slide-over provenance drawer inspects assumption sources and sensitivity weights on any screen.

---

## 📄 License
MIT License. Built for the IOMETE Enterprise Ecosystem.
