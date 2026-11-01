import { EngineAssumptions } from "./types";

export const DEFAULT_ASSUMPTIONS: EngineAssumptions = {
  iometeEnterprisePricePerVcpuPerYear: 500,
  iometeEnterpriseAnnualMinimumUsd: 100000,
  businessCriticalAnnualMinimumUsd: 250000,
  vcpuPerTbLow: 0.35,
  vcpuPerTbMedium: 0.70,
  vcpuPerTbHigh: 1.20,
  infrastructureCostRetentionPercent: 65,
  currentPlatformGrowthRatePercent: 12,
  evaluationPeriodMonths: 3,
};
