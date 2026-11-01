# 06 — API Contracts & LLM Prompt Specifications

## 1. LLM Function 1: `extractProfile()`
**Endpoint**: `POST /api/extract-profile`
**Input**:
```json
{
  "text": "We are a European bank with around 400 terabytes of analytics data. We have strict EU data-residency requirements. Our current warehouse costs are rising, and we need strong audit controls, role-based access, and data masking. We want to keep data in our own cloud account."
}
```

**System Prompt**:
```
You are an expert enterprise solutions architect for IOMETE.
Your sole job is to extract structured company information from prospect intake notes or spoken transcripts.

CRITICAL RULES:
1. Return VALID JSON ONLY. No markdown conversational intro or outro.
2. Use null for unknown or unmentioned values. NEVER make up or invent numbers, platforms, or company names.
3. If spend is not explicitly stated in the text, currentAnnualSpendUsd MUST be null.
4. Calculate an extraction confidence score between 0.0 and 1.0 based on how many required fields were found.
5. List missing fields that an SE must follow up on.

SCHEMA:
{
  "companyName": string,
  "industry": string,
  "region": string,
  "dataResidencyRequirement": string,
  "dataVolumeTb": number | null,
  "currentPlatform": string,
  "currentAnnualSpendUsd": number | null,
  "preferredDeployment": string,
  "primaryWorkloads": string[],
  "complianceNeeds": string[],
  "dataUserCount": number | null,
  "computeIntensity": "low" | "medium" | "high",
  "confidence": number,
  "missingFields": string[]
}
```

---

## 2. LLM Function 2: `generateMemo()`
**Endpoint**: `POST /api/generate-memo`
**Input**: Validated profile JSON + Deterministic `CaseOutput` + Active Assumptions array.

**System Prompt**:
```
You are the Chief Solutions Architect at IOMETE drafting an executive board approval memo.
Write for a C-suite audience (CIO, CFO, CISO). The tone must be conservative, authoritative, and precise.

CRITICAL BOUNDARIES:
1. NEVER invent any prices, rates, discount percentages, or ROI claims.
2. YOU MUST CITE ONLY the numbers passed in the deterministic input.
3. Every financial statement must use prudent phrasing: "projected," "estimated based on assumptions," "subject to workload benchmarking."
4. Explicitly state the risks and unknowns that require validation during the 90-day evaluation.
5. Return JSON matching the Memo schema.

OUTPUT SCHEMA:
{
  "title": string,
  "executiveSummary": string,
  "recommendation": string,
  "financialSummary": string,
  "sovereigntyPosition": string,
  "risksAndUnknowns": string[],
  "nextSteps": string[]
}
```

---

## 3. Template Function 3: `generateBriefingScript()`
**Endpoint**: `POST /api/generate-briefing`
Produces a tightly constrained 150–190 word script designed for a strict 60-second spoken read.

**Template Structure**:
1. *Company Context* (15 words): Identify client, scale (TB), and regulatory geography.
2. *Recommended Deployment* (25 words): Private Kubernetes in customer cloud/on-prem, retaining object storage.
3. *Why IOMETE Fits* (30 words): Separation of compute and storage, no per-user licensing taxes, lakehouse speed.
4. *Financial Logic* (40 words): Exact 3-year projected TCO vs. current run rate, cloud credit reuse, payback horizon.
5. *Sovereignty & Governance* (35 words): Zero data leaves tenant VPC, full audit compliance, customer key ownership.
6. *Recommended Next Step* (20 words): 90-day evaluation period to benchmark workloads and validate infrastructure sizing.

---

## 4. ElevenLabs Route Handlers
### A. Speech-to-Text (`/api/transcribe`)
- Model: `scribe_v1`
- Input: `multipart/form-data` with `audio/webm` or `audio/wav`.
- Security: Transcribes on server; raw audio is ephemeral and immediately released from memory.
- Fallback: In `DEMO_MODE=true` or on failure, return the NordBank intake transcript:
  > *"We are a European bank with around 400 terabytes of analytics data. We have strict EU data-residency requirements. Our current warehouse costs are rising, and we need strong audit controls, role-based access, and data masking. We want to keep data in our own cloud account."*

### B. Text-to-Speech (`/api/generate-audio`)
- Model: `eleven_turbo_v2_5`
- Voice Profile: Deep, calm, confident, neutral corporate accent (non-robotic, non-enthusiastic).
- Cache: Store generated `.mp3` under `/public/briefings/` or stream directly to prevent redundant API charges.
