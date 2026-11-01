# AGENTS.md — MULTI-AGENT INSTRUCTIONS & ROLES

This project uses an agentic workflow where multiple agents or subagents may collaborate across frontend development, business-case logic, database migrations, and voice integrations.

## 1. Ground Truth Alignment
- All agents must respect the deterministic boundary:
  - **Financial calculation agent**: Operates ONLY in `src/lib/business-case/engine.ts`. Must never use an LLM to compute numbers.
  - **UI/UX agent**: Adheres strictly to `memory/03_UI_UX_DESIGN_SYSTEM.md` and `ui-ux-pro-max-skill`. Avoids generic purple AI styling.
  - **Integration agent**: Manages server-side Next.js route handlers (`/api/transcribe`, `/api/generate-audio`, `/api/extract-profile`, `/api/generate-memo`). Keys are never sent to the browser.
  - **Database agent**: Manages Drizzle schemas and migrations against Tiger Data PostgreSQL.

## 2. Shared Memory & Context Store (Meko)
- Persistent context, architectural decisions, and session memory are synchronized via Meko MCP server (`https://mcp.mekodata.ai/mcp`).
- When switching agents or resuming across different Google Gemini accounts, reference the project ID: `telemetry-iomete-boardroom`.

## 3. Fallback & Mock Standards
- Every external API (ElevenLabs STT, ElevenLabs TTS, OpenAI / Gemini) MUST provide an instantaneous deterministic fallback mode when `DEMO_MODE=true` or when network errors occur.
- A live pitch to judges must NEVER fail due to rate limits or API latency. Pre-generated audio and pre-extracted JSON fixtures must be bundled with the application.
