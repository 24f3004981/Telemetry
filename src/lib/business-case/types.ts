export type ComputeIntensity = "low" | "medium" | "high";

export type ConfidenceLevel = "High" | "Medium" | "Preliminary";

export type SourceType =
  | "User input"
  | "Calculated"
  | "Vendor-claimed"
  | "Assumption"
  | "Requires IOMETE validation";

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
  growthRatePercent: number; // e.g. 15 for 15%
}

export interface EngineAssumptions {
  iometeEnterprisePricePerVcpuPerYear: number; // Default: $500
  iometeEnterpriseAnnualMinimumUsd: number;    // Default: $100,000
  businessCriticalAnnualMinimumUsd: number;    // Default: $250,000
  vcpuPerTbLow: number;                        // Default: 0.35
  vcpuPerTbMedium: number;                     // Default: 0.70
  vcpuPerTbHigh: number;                       // Default: 1.20
  infrastructureCostRetentionPercent: number;  // Default: 65%
  currentPlatformGrowthRatePercent: number;    // Default: 12%
  evaluationPeriodMonths: number;              // Default: 3
}

export interface CaseAssumptionItem {
  id: string;
  label: string;
  value: number;
  unit: string;
  sourceType: SourceType;
  sourceNote: string;
}

export interface CaseOutput {
  version: number;
  recommendedDeployment: string;
  recommendedPlan: "Enterprise" | "Business Critical";
  sovereigntyScore: number; // 0 - 100
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
  confidenceLevel: ConfidenceLevel;
  assumptionsUsed: CaseAssumptionItem[];
  risksAndUnknowns: string[];
}
