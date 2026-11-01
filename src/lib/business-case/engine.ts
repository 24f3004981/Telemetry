import { DealProfile, EngineAssumptions, CaseOutput, CaseAssumptionItem } from "./types";
import { DEFAULT_ASSUMPTIONS } from "./constants";

export function calculateBusinessCase(
  profile: DealProfile,
  customAssumptions: Partial<EngineAssumptions> = {},
  version: number = 1
): CaseOutput {
  const assumptions: EngineAssumptions = {
    ...DEFAULT_ASSUMPTIONS,
    ...customAssumptions,
  };

  // 1. Calculate estimated vCPU count based on data volume & compute intensity
  let vcpuRatio = assumptions.vcpuPerTbMedium;
  if (profile.computeIntensity === "low") {
    vcpuRatio = assumptions.vcpuPerTbLow;
  } else if (profile.computeIntensity === "high") {
    vcpuRatio = assumptions.vcpuPerTbHigh;
  }

  const estimatedVcpuCount = Math.max(16, Math.round(profile.dataVolumeTb * vcpuRatio));

  // 2. Determine Deployment Model & Plan Tier
  const isMultiRegion =
    profile.complianceNeeds.some((c) => c.toLowerCase().includes("multi-region")) ||
    profile.preferredDeployment.toLowerCase().includes("multi-region");

  const isOnPrem =
    profile.preferredDeployment.toLowerCase().includes("on-prem") ||
    profile.preferredDeployment.toLowerCase().includes("datacenter") ||
    profile.preferredDeployment.toLowerCase().includes("on-premises");

  const isAirGapped =
    profile.complianceNeeds.some((c) => c.toLowerCase().includes("air-gap")) ||
    profile.preferredDeployment.toLowerCase().includes("air-gap");

  const isHybrid =
    profile.preferredDeployment.toLowerCase().includes("hybrid") ||
    profile.primaryWorkloads.some((w) => w.toLowerCase().includes("edge"));

  let recommendedDeployment = "Customer Cloud Account (AWS/Azure/GCP Kubernetes)";
  let deploymentRationale: string[] = [];

  if (isAirGapped) {
    recommendedDeployment = "Air-Gapped Kubernetes Deployment";
    deploymentRationale = [
      "Strict air-gapped isolation detected. Platform operates disconnected with internal artifact registries.",
      "Zero telemetry leaves customer perimeter.",
      "Recommended plan: IOMETE Enterprise Air-Gapped.",
    ];
  } else if (isOnPrem) {
    recommendedDeployment = "On-Premises Kubernetes (OpenShift / Rancher)";
    deploymentRationale = [
      "Customer mandate for bare-metal or private data center hardware.",
      "Runs on customer-managed Kubernetes infrastructure without public cloud dependencies.",
      "Data stored on local Ceph / MinIO / SAN object storage.",
    ];
  } else if (isMultiRegion) {
    recommendedDeployment = "Multi-Region Distributed Deployment";
    deploymentRationale = [
      "Cross-region analytics and multi-jurisdiction compliance required.",
      "Requires IOMETE Business Critical plan with federated catalog and localized compute pods.",
      "Zero egress cross-border replication policies.",
    ];
  } else if (isHybrid) {
    recommendedDeployment = "Hybrid Edge-to-Cloud Kubernetes";
    deploymentRationale = [
      "Combines localized edge ingestion (factories/facilities) with central analytics warehouse.",
      "Single unified governance pane across on-prem and cloud nodes.",
    ];
  } else {
    deploymentRationale = [
      "Customer retains data in own cloud VPC (AWS S3, Azure ADLS, or Google Cloud Storage).",
      "IOMETE control plane manages compute engines within customer Kubernetes cluster.",
      "Eliminates vendor lock-in and avoids expensive vendor-managed storage markup.",
    ];
  }

  const recommendedPlan: "Enterprise" | "Business Critical" = isMultiRegion
    ? "Business Critical"
    : "Enterprise";

  const minimumLicense = isMultiRegion
    ? assumptions.businessCriticalAnnualMinimumUsd
    : assumptions.iometeEnterpriseAnnualMinimumUsd;

  // 3. Calculate Platform Licensing & Retained Cloud Infrastructure Cost
  const rawLicense = estimatedVcpuCount * assumptions.iometeEnterprisePricePerVcpuPerYear;
  const yearOneIometeLicense = Math.max(minimumLicense, rawLicense);

  // Retained compute cost: under customer-hosted Kubernetes, customer pays their cloud provider
  // for underlying compute instances (assumed ~65% of vCPU license equivalent).
  const yearOneInfraCost = Math.round(
    rawLicense * (assumptions.infrastructureCostRetentionPercent / 100)
  );

  const yearOneTotal = yearOneIometeLicense + yearOneInfraCost;

  // 3-Year Projection with Workload Growth
  const growthRate = (profile.growthRatePercent || 10) / 100;
  const yearTwoCost = Math.round(yearOneTotal * (1 + growthRate));
  const yearThreeCost = Math.round(yearTwoCost * (1 + growthRate));
  const threeYearTotalCost = yearOneTotal + yearTwoCost + yearThreeCost;

  // 4. Comparison Against Current Platform Spend
  let estimatedCurrentThreeYearCost: number | null = null;
  let projectedThreeYearSavings: number | null = null;
  let projectedAnnualSavings: number | null = null;
  let paybackMonths: number | null = null;

  if (profile.currentAnnualSpendUsd && profile.currentAnnualSpendUsd > 0) {
    const curY1 = profile.currentAnnualSpendUsd;
    const curInflation = 1 + (assumptions.currentPlatformGrowthRatePercent / 100);
    const curY2 = curY1 * curInflation;
    const curY3 = curY2 * curInflation;
    estimatedCurrentThreeYearCost = Math.round(curY1 + curY2 + curY3);

    const diff = estimatedCurrentThreeYearCost - threeYearTotalCost;
    projectedThreeYearSavings = diff > 0 ? Math.round(diff) : 0;
    projectedAnnualSavings = Math.round(projectedThreeYearSavings / 3);

    // Payback calculation
    const annualNetSavings = curY1 - yearOneTotal;
    if (annualNetSavings > 0) {
      const monthlySavings = annualNetSavings / 12;
      const onboardingFriction = yearOneIometeLicense * 0.15; // 15% estimated migration buffer
      paybackMonths = Math.min(36, Math.max(1, Math.round(onboardingFriction / monthlySavings)));
    }
  }

  // 5. Sovereignty & Governance Scoring (0 - 100 Scale)
  let sovereigntyScore = 55; // Base score
  const sovereigntyPoints: string[] = [];

  if (profile.preferredDeployment.toLowerCase().includes("cloud") || isOnPrem || isAirGapped) {
    sovereigntyScore += 20;
    sovereigntyPoints.push("Customer maintains 100% control over physical/virtual storage buckets.");
  }

  if (profile.complianceNeeds.some((c) => /gdpr|bafin|hipaa|soc2|iso/i.test(c))) {
    sovereigntyScore += 10;
    sovereigntyPoints.push("Complies with regional auditability and regulatory data retention rules.");
  }

  if (profile.complianceNeeds.some((c) => /rbac|masking|audit/i.test(c))) {
    sovereigntyScore += 10;
    sovereigntyPoints.push("Fine-grained RBAC and automated query audit logging supported.");
  }

  if (profile.dataVolumeTb >= 200) {
    sovereigntyScore += 5;
    sovereigntyPoints.push("High-volume data remains in-situ without vendor egress or replication penalties.");
  }

  sovereigntyScore = Math.min(98, sovereigntyScore); // 2 points held for formal IOMETE security validation

  const sovereigntyRationale =
    sovereigntyPoints.join(" ") ||
    "High sovereignty rating based on tenant-isolated Kubernetes deployment and customer storage ownership.";

  // 6. Assumptions Used List with Provenance
  const assumptionsUsed: CaseAssumptionItem[] = [
    {
      id: "vcpu-sizing",
      label: "Estimated vCPU Footprint",
      value: estimatedVcpuCount,
      unit: "vCPU",
      sourceType: "Calculated",
      sourceNote: `Calculated from ${profile.dataVolumeTb} TB × ${vcpuRatio} vCPU/TB ratio (${profile.computeIntensity} intensity)`,
    },
    {
      id: "license-price",
      label: "IOMETE Enterprise Annual Price per vCPU",
      value: assumptions.iometeEnterprisePricePerVcpuPerYear,
      unit: "$ / vCPU / year",
      sourceType: "Vendor-claimed",
      sourceNote: "Published IOMETE Enterprise list pricing",
    },
    {
      id: "platform-min",
      label: "IOMETE Minimum Annual Commitment",
      value: minimumLicense,
      unit: "USD / year",
      sourceType: "Vendor-claimed",
      sourceNote: `Published ${recommendedPlan} tier baseline minimum`,
    },
    {
      id: "infra-retention",
      label: "Customer Cloud Compute Retention Factor",
      value: assumptions.infrastructureCostRetentionPercent,
      unit: "%",
      sourceType: "Assumption",
      sourceNote: "Customer-paid underlying cloud VM compute and persistent volume cost",
    },
    {
      id: "workload-growth",
      label: "Projected Annual Workload Growth",
      value: profile.growthRatePercent || 10,
      unit: "% / year",
      sourceType: "User input",
      sourceNote: "User specified annual enterprise data expansion rate",
    },
  ];

  if (profile.currentAnnualSpendUsd) {
    assumptionsUsed.push({
      id: "current-spend",
      label: "Current Baseline Warehouse Spend",
      value: profile.currentAnnualSpendUsd,
      unit: "USD / year",
      sourceType: "User input",
      sourceNote: `Reported current platform run rate on ${profile.currentPlatform}`,
    });
  }

  // 7. Risks and Unknowns
  const risksAndUnknowns: string[] = [
    "Workload query concurrency profile requires benchmarking during the 90-day evaluation.",
    "Specific cloud provider infrastructure discounts (e.g. AWS EDP / Azure EA) must be applied to compute retention numbers.",
    profile.complianceNeeds.some((c) => /hipaa/i.test(c))
      ? "HIPAA BAA execution and formal shared responsibility matrix requires IOMETE validation."
      : "Data sovereignty configuration must be signed off by CISO team during evaluation.",
  ];

  const confidenceLevel: "High" | "Medium" | "Preliminary" = profile.currentAnnualSpendUsd
    ? "High"
    : "Medium";

  return {
    version,
    recommendedDeployment,
    recommendedPlan,
    sovereigntyScore,
    sovereigntyRationale,
    deploymentRationale,
    estimatedVcpuCount,
    yearOneIometeLicense,
    yearOneInfraCost,
    yearOneCost: yearOneTotal,
    yearTwoCost,
    yearThreeCost,
    threeYearTotalCost,
    estimatedCurrentThreeYearCost,
    projectedThreeYearSavings,
    projectedAnnualSavings,
    paybackMonths,
    confidenceLevel,
    assumptionsUsed,
    risksAndUnknowns,
  };
}
