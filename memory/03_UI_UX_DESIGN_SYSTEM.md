# 03 — UI/UX Design System (`ui-ux-pro-max-skill` Synthesis)

## 1. Design Direction: Serious B2B Enterprise Workspace
Telemetry rejects consumer "AI chat bubble" design and cartoonish SaaS styles. The visual language bridges:
- **Linear**: Micro-interactions, tight visual hierarchy, keyboard-first navigability, crisp borders.
- **Stripe Dashboard**: High data density, unambiguous numerical units, inline provenance tags.
- **McKinsey / BCG Executive Memo**: Editorial serif typography for decision summaries, generous reading measure, print-ready page layouts.
- **Vercel Infrastructure Console**: Calm, dark-slate/warm-stone neutral canvas, absence of flashy gradient noise.

## 2. Color Palette & Semantics (Fintech & Data Infrastructure Vertical)
Derived from the `ui-ux-pro-max-skill` high-trust enterprise palette:

```css
:root {
  /* Canvas & Surfaces */
  --background: #FAFAF9;       /* Stone 50: warm, calming, non-harsh white */
  --surface: #FFFFFF;          /* Pure white card backgrounds */
  --surface-muted: #F4F4F2;    /* Stone 100: table headers, input background */
  --border: #E4E4E1;           /* Stone 200: 1px crisp separation */
  --border-strong: #D4D4D0;

  /* Typography */
  --text-primary: #111110;     /* Stone 950: near-black, high contrast */
  --text-secondary: #52525B;   /* Zinc 600: explanatory labels, subheadings */
  --text-muted: #71717A;       /* Zinc 500: timestamps, metadata, footnotes */

  /* Primary Brand: Deep Forest / Institutional Green */
  --accent: #0F5132;           /* Deep Forest Green: denotes stability, trust, governance */
  --accent-hover: #0B3D26;     /* Darker forest */
  --accent-soft: #E8F3EE;      /* 10% tint for active pill states & badges */
  --accent-foreground: #FFFFFF;

  /* Semantic Alerts */
  --warning: #92400E;          /* Amber 800 */
  --warning-soft: #FEF3C7;     /* Amber 100 */
  --danger: #991B1B;           /* Red 800 */
  --danger-soft: #FEE2E2;      /* Red 100 */
  --info: #1E3A8A;             /* Blue 900 */
  --info-soft: #DBEAFE;        /* Blue 100 */
}
```

## 3. Typography Rules & Font Matchmaker
- **Interface & Form Text**: `Inter` (or system `sans-serif`)
  - Clean, legible at small sizes (11px–14px) in dense data tables.
- **Executive Memo & Board Briefing Headings**: `IBM Plex Serif` or `Source Serif 4`
  - Evokes editorial rigor, financial prospectus authority, and executive polish.
- **Monospace Numbers, vCPU, Dollar Amounts, Identifiers**: `JetBrains Mono`
  - Prevents tabular number jitter, lines up decimal points, distinguishes technical IDs (`uuid`, `deal_nordbank_01`).

| Element | Font Family | Size | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Hero Headline | Sans-Serif | 36px | 600 (Semi-bold) | 1.15 | -0.02em |
| Memo Title | Serif | 28px | 600 (Semi-bold) | 1.2 | -0.01em |
| Section Header | Serif / Sans | 18px–20px | 600 | 1.3 | normal |
| Financial Metric Value | Mono | 24px–32px | 700 (Bold) | 1.0 | -0.02em |
| Body / Form Inputs | Sans-Serif | 14px | 400 (Regular) | 1.5 | normal |
| Table Data / Microcopy | Sans / Mono | 12px–13px | 400 / 500 | 1.4 | +0.01em |
| Provenance Badges | Sans-Serif | 11px | 600 (Caps/Semi) | 1.0 | +0.04em |

## 4. Layout Dimensions & 8px Spacing Grid
- Max layout width: `1440px`.
- Briefing Room 3-column distribution:
  - **Left Rail (Stage Navigator & Deals)**: `260px` fixed.
  - **Center Canvas (Tabbed Briefing Cockpit)**: Flexible `minmax(720px, 1fr)`.
  - **Right Rail (Assumptions, Sources, Version History)**: `320px` fixed.
- Spacing Scale: `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `48px`.
- Radii: Cards `10px–12px`, Buttons `8px`, Badges `4px`.
- Shadows: Soft ambient elevation only (`box-shadow: 0 1px 3px rgba(0,0,0,0.05)`). **No harsh or glowing neon dropshadows.**

## 5. Financial Metric Card Contract (Crucial UI Pattern)
Every numeric card in Telemetry MUST adhere to this exact anatomy:
```
┌────────────────────────────────────────────────────────┐
│ Estimated Annual IOMETE License       [ CALCULATED ]   │
│ $180,000 / year                                        │
│ Formula: 360 vCPU × $500/vCPU/yr (Enterprise tier)     │
│ Source: Published IOMETE Enterprise Pricing            │
│ [ Edit vCPU Assumption ]                               │
└────────────────────────────────────────────────────────┘
```
- Tag pill colors:
  - `[ User Input ]`: Neutral gray badge
  - `[ Calculated ]`: Forest green soft badge
  - `[ Assumption ]`: Amber soft badge
  - `[ Vendor-Claimed ]`: Blue soft badge
  - `[ Requires IOMETE Validation ]`: Warning red/amber outline badge
