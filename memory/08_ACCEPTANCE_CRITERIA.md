# 08 — Acceptance Criteria & Final Quality Bar

## 1. Acceptance Criteria Checklist
Before declaring the application complete, verify each of the following:

- [ ] **1. Deal Room Creation**: User can create a new Deal Room with custom title and workspace binding.
- [ ] **2. Multi-Modal Intake**: User can input prospect context via structured fields, free-form text, or audio capture.
- [ ] **3. ElevenLabs STT Integration**: Audio is sent to `/api/transcribe` and successfully transcribed into editable text.
- [ ] **4. Structured Profile Extraction**: LLM correctly extracts `companyName`, `region`, `dataVolumeTb`, `primaryWorkloads`, `complianceNeeds` into editable inputs.
- [ ] **5. Full Field Editability**: User can alter any extracted field (e.g., changing spend from null to $850k) before triggering case generation.
- [ ] **6. Deterministic Deployment Fit**: Engine outputs deployment model based on strict conditions (Customer Cloud vs On-Prem vs Air-Gapped vs Multi-Region).
- [ ] **7. Transparent Sizing & Math**: vCPU sizing, year 1–3 platform license, and cloud retention costs calculate via pure TypeScript logic.
- [ ] **8. Provenance & Source Labeling**: Every financial metric displays a clear badge (`User input`, `Calculated`, `Assumption`, `Vendor-claimed`, `Requires IOMETE validation`).
- [ ] **9. Assumptions & Sources Drawer**: Visible drawer displaying unit metrics, formulas, and unknowns.
- [ ] **10. Executive Memo Tab**: Formats a formal 1-page C-suite memo with serif headers, conservative language, and zero hallucinated claims.
- [ ] **11. Print & PDF Export**: Clean printable view with print-friendly CSS hiding UI sidebars.
- [ ] **12. Briefing Script Generator**: Produces a tightly constrained 150–190 word script adhering to the 6-part executive structure.
- [ ] **13. ElevenLabs TTS Audio Player**: Plays the 60-second audio stream in the UI with play/pause, scrubbing, and duration display.
- [ ] **14. Tiger Data PostgreSQL Persistence**: Deal Rooms, profiles, assumptions, cases, memos, and scripts persist across page refreshes.
- [ ] **15. Assumption Versioning**: Modifying an assumption and clicking recalculate increments version (`v1` -> `v2`) without overwriting historical audit events.
- [ ] **16. Premium UI Aesthetics**: Calm stone/forest green theme adhering to `ui-ux-pro-max-skill`, dense financial tables, no consumer AI purple gradients.
- [ ] **17. Zero Client-Side Secret Leakage**: All ElevenLabs and OpenAI/Gemini keys remain on the server; none exposed in browser bundle.
- [ ] **18. Flawless Offline Demo Mode**: When `DEMO_MODE=true` or when network fails, NordBank demo runs seamlessly with cached fixtures.

## 2. Final Quality Bar
- **Credibility Test**: If a real Fortune 500 CIO or CFO saw this screen, would they consider it a professional decision tool or an AI gimmick? (Must pass as a serious decision tool).
- **Speed Test**: The complete NordBank journey from fresh load to playing audio briefing must be executable in under 180 seconds.
- **Accuracy Test**: Not a single number is fabricated by the LLM. All calculations are traceable to explicit assumptions.
