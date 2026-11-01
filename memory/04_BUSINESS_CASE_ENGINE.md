# 04 — Business-Case Engine Specification

## 1. Engine Philosophy
The calculation engine is **100% deterministic TypeScript**. The LLM is **strictly forbidden** from doing math, guessing discounts, or hallucinating server costs.
File location: `src/lib/business-case/engine.ts`.

## 2. Core Types (`src/lib/business-case/types.ts`)
```typescript
export type ComputeIntensity = "low" | "medium" | "high";

export interface DealProfile {
  companyName: string;
  industry: string;
  region: string;
  dataResidencyRequirement: string;
  dataVolumeTb: number;
  currentPlatform: string;
  currentAnnualSpendUsd?: number | null;
  preferredDeployment: string;
  primaryWorkloads: string[];
  complianceNeeds: string[];
  dataUserCount?: number | null;
  computeIntensity: ComputeIntensity;
  growthRatePercent: number; // e.g. 15 for 15% YoY
}

export interface EngineAssumptions {
  iometeEnterprisePricePerVcpuPerYear: number; // $500
  iometeEnterpriseAnnualMinimumUsd: number;    // $100,000
  businessCriticalAnnualMinimumUsd: number;    // $250,000
  vcpuPerTbLow: number;                        // 0.35
  vcpuPerTbMedium: number;                     // 0.70
  vcpuPerTbHigh: number;                       // 1.20
  infrastructureCostRetentionPercent: number;  // 65% (customer cloud compute cost retention)
  currentPlatformGrowthRatePercent: number;    // 12% baseline YoY spend inflation
  evaluationPeriodMonths: number;              // 3 months (90 days)
}

export interface CaseOutput {
  version: number;
  recommendedDeployment: string;
  recommendedPlan: "Enterprise" | "Business Critical";
  sovereigntyScore: number;                    // 0 - 100
  sovereigntyRationale: string;
  deploymentRationale: string[];
  estimatedVcpuCount: number;
  yearOneIometeLicense: number;
  yearOneInfraCost: number;
  yearOneCost: number;
  yearTwoCost: number;
  yearThreeCost: number;
  threeYearTotalCost: number;
  estimatedCurrentThreeYearCost: number | null;
  projectedThreeYearSavings: number | null;
  projectedAnnualSavings: number | null;
  paybackMonths: number | null;
  confidenceLevel: "High" | "Medium" | "Preliminary";
  assumptionsUsed: Array<{
    label: string;
    value: number;
    unit: string;
    sourceType: "Calculated" | "Assumption" | "Vendor-claimed" | "User input";
    sourceNote: string;
  }>;
  risksAndUnknowns: string[];
}
```

## 3. Mathematical Formulas
### A. vCPU Sizing
```typescript
let vcpuRatio = assumptions.vcpuPerTbMedium;
if (profile.computeIntensity === "low") vcpuRatio = assumptions.vcpuPerTbLow;
if (profile.computeIntensity === "high") vcpuRatio = assumptions.vcpuPerTbHigh;

const estimatedVcpuCount = Math.max(16, Math.round(profile.dataVolumeTb * vcpuRatio));
```

### B. IOMETE License Calculation
```typescript
const isMultiRegion = profile.complianceNeeds.some(c => c.toLowerCase().includes("multi-region")) 
  || profile.preferredDeployment.toLowerCase().includes("multi-region");

const plan = isMultiRegion ? "Business Critical" : "Enterprise";
const minimumSpend = isMultiRegion 
  ? assumptions.businessCriticalAnnualMinimumUsd 
  : assumptions.iometeEnterpriseAnnualMinimumUsd;

const rawLicenseYear1 = estimatedVcpuCount * assumptions.iometeEnterprisePricePerVcpuPerYear;
const yearOneIometeLicense = Math.max(minimumSpend, rawLicenseYear1);

// Under customer Kubernetes, customer pays their cloud provider directly for compute/storage.
// Retained cloud infrastructure cost is ~65% of vCPU equivalent.
const yearOneInfraCost = rawLicenseYear1 * (assumptions.infrastructureCostRetentionPercent / 100);
const yearOneTotal = yearOneIometeLicense + yearOneInfraCost;

// Compound yearly growth
const growthFactor = 1 + (profile.growthRatePercent / 100);
const yearTwoCost = yearOneTotal * growthFactor;
const yearThreeCost = yearTwoCost * growthFactor;
const threeYearTotalCost = yearOneTotal + yearTwoCost + yearThreeCost;
```

### C. Current Platform Baseline Comparison
```typescript
if (profile.currentAnnualSpendUsd && profile.currentAnnualSpendUsd > 0) {
  const currentY1 = profile.currentAnnualSpendUsd;
  const currentGrowth = 1 + (assumptions.currentPlatformGrowthRatePercent / 100);
  const currentY2 = currentY1 * currentGrowth;
  const currentY3 = currentY2 * currentGrowth;
  const estimatedCurrentThreeYearCost = currentY1 + currentY2 + currentY3;

  const projectedThreeYearSavings = Math.max(0, estimatedCurrentThreeYearCost - threeYearTotalCost);
  const projectedAnnualSavings = projectedThreeYearSavings / 3;

  // Payback calculation (evaluation setup amortization)
  const monthlySavings = (currentY1 - yearOneTotal) / 12;
  const paybackMonths = monthlySavings > 0 
    ? Math.min(36, Math.max(1, Math.round((yearOneIometeLicense * 0.15) / monthlySavings))) 
    : null;
}
```

## 4. Deployment Recommendation Matrix
| Conditions Detected in Profile | Recommended Deployment Model | Rationale |
| :--- | :--- | :--- |
| Strict data residency + customer cloud account preference | **Customer Cloud Account (EKS / GKE / AKS)** | Retains data in customer VPC and S3/GCS/ADLS buckets; eliminates vendor lock-in and complies with sovereignty mandates. |
| On-premises hardware / data center requirement | **On-Premises Kubernetes (OpenShift / Rancher / K8s)** | Meets strict non-cloud internal policies while leveraging modern lakehouse speed. |
| Air-gapped / disconnected network mandate | **Air-Gapped Deployment** | Complete offline isolation with local image registries and zero outbound telemetry requirements. |
| Multi-region analytics across EU + US | **Multi-Region Distributed Deployment** | Requires IOMETE Business Critical plan; cross-region metadata sync with localized compute. |
| Hybrid / edge to cloud synchronization | **Hybrid Kubernetes Deployment** | Balances localized factory/hospital compute with centralized cloud data lake. |
| Standard requirements | **Customer Cloud Account** | Default optimal architecture for cost predictability and infrastructure credit reuse. |

## 5. Sovereignty Scoring Model (0–100 Scale)
- Base score: `50`
- If customer keeps data in own cloud account / object storage: `+20`
- If role-based access control (RBAC) & data masking specified: `+10`
- If audit logging / GDPR compliance specified: `+10`
- If running on dedicated Kubernetes (no shared multi-tenant engine): `+10`
- If data volume > 200TB retained locally without egress penalty: `+10`
- Max capped at `98` (2 points reserved for formal IOMETE security review).
