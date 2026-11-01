import { DealRoom } from "./types";
import { calculateBusinessCase } from "../business-case/engine";
import { DEFAULT_ASSUMPTIONS } from "../business-case/constants";

export const SEED_DEAL_ROOMS: DealRoom[] = [
  // 1. NordBank
  (() => {
    const profile = {
      companyName: "NordBank AG",
      industry: "Financial Services",
      region: "European Union (Frankfurt / Dublin)",
      dataResidencyRequirement: "Strict EU GDPR & BaFin Banking Compliance",
      dataVolumeTb: 400,
      currentPlatform: "Legacy Cloud Data Warehouse (Snowflake)",
      currentAnnualSpendUsd: 850000,
      preferredDeployment: "Customer Cloud Account (EU AWS EKS)",
      primaryWorkloads: [
        "Credit Risk Analytics",
        "Regulatory Liquidity Reporting",
        "Customer Anti-Fraud Scoring",
      ],
      complianceNeeds: [
        "GDPR",
        "BaFin Audit Trails",
        "Fine-Grained RBAC",
        "Dynamic Data Masking",
      ],
      dataUserCount: 180,
      computeIntensity: "medium" as const,
      growthRatePercent: 15,
    };
    const activeCase = calculateBusinessCase(profile, DEFAULT_ASSUMPTIONS, 1);
    return {
      id: "deal-nordbank-01",
      workspaceId: "ws-demo",
      title: "NordBank AG — Lakehouse Modernization",
      status: "active" as const,
      currentStage: "case" as const,
      createdBy: "user-demo",
      createdAt: "2026-10-24T10:00:00Z",
      updatedAt: "2026-10-31T14:30:00Z",
      profile,
      assumptions: { ...DEFAULT_ASSUMPTIONS },
      activeCase,
      caseHistory: [activeCase],
      memo: {
        id: "memo-nordbank-01",
        generatedCaseId: "case-nordbank-01",
        version: 1,
        title: "Executive Decision Memo: IOMETE Deployment Evaluation for NordBank AG",
        executiveSummary:
          "NordBank AG requires a scalable modern data platform supporting 400 TB of critical risk analytics while strictly adhering to EU data-residency and BaFin regulatory oversight. Telemetry recommends transitioning from the existing multi-tenant cloud warehouse to an EU Private-Cloud deployment of IOMETE running directly within NordBank's own AWS Kubernetes perimeter.",
        recommendation:
          "Approve a 90-day evaluation of IOMETE Enterprise deployed inside NordBank's AWS Frankfurt VPC, targeting a 3-year projected savings of ~$870,000+ while achieving 100% data sovereignty.",
        financialSummary:
          "Year 1 estimated platform licensing and infrastructure compute is projected at $231,000 against a current run-rate of $850,000. Over 3 years, projected cumulative expenditure is $764,000 versus an estimated $2,872,000 on the legacy platform, yielding an estimated payback period of under 4 months.",
        sovereigntyPosition:
          "Telemetry assigns a Sovereignty Score of 96/100. Zero analytics data leaves the bank's VPC. All object storage buckets remain customer-encrypted with bank-held KMS keys, fully satisfying BaFin and GDPR mandates.",
        risksAndUnknowns: [
          "Peak concurrency during end-of-month regulatory stress testing must be validated during the evaluation.",
          "AWS Enterprise Discount Program (EDP) credit drawdown rules should be confirmed with procurement.",
        ],
        nextSteps: [
          "Deploy IOMETE Helm chart in NordBank Frankfurt test VPC.",
          "Run 30-day query benchmarking on top 10 heaviest credit risk pipelines.",
          "Execute formal CISO security and RBAC audit checklist.",
        ],
        createdAt: "2026-10-31T14:30:00Z",
      },
      briefingScript: {
        id: "script-nordbank-01",
        generatedCaseId: "case-nordbank-01",
        scriptText:
          "For NordBank, Telemetry recommends an EU private-cloud deployment of IOMETE. The platform would run inside the bank’s own Kubernetes environment, with all four hundred terabytes of analytics data retained in customer-controlled object storage. The financial model assumes predictable platform licensing, reuse of existing cloud commitments, and zero per-user expansion costs. The primary decision factors are strict data sovereignty, auditability, and multi-year cost predictability. Over three years, this model projects net savings exceeding eight hundred thousand dollars with a payback under four months. The recommended next step is a ninety-day evaluation with IOMETE to validate workload sizing and infrastructure assumptions.",
        estimatedDurationSeconds: 58,
        audioUrl: "/audio/nordbank-briefing.mp3",
        createdAt: "2026-10-31T14:30:00Z",
      },
    };
  })(),

  // 2. Helix Manufacturing
  (() => {
    const profile = {
      companyName: "Helix Manufacturing Corp",
      industry: "Industrial & Automotive",
      region: "North America (Midwest USA)",
      dataResidencyRequirement: "Moderate Internal IP & Factory Data Protection",
      dataVolumeTb: 120,
      currentPlatform: "On-Premises Hadoop Cluster (Legacy EOL)",
      currentAnnualSpendUsd: 420000,
      preferredDeployment: "Hybrid Kubernetes Deployment",
      primaryWorkloads: [
        "IoT Telemetry Ingestion",
        "Predictive Quality Monitoring",
        "Supply Chain Forecasting",
      ],
      complianceNeeds: ["Internal Operational Audits", "ISO 27001"],
      dataUserCount: 65,
      computeIntensity: "medium" as const,
      growthRatePercent: 12,
    };
    const activeCase = calculateBusinessCase(profile, DEFAULT_ASSUMPTIONS, 1);
    return {
      id: "deal-helix-02",
      workspaceId: "ws-demo",
      title: "Helix Manufacturing — Hadoop Modernization",
      status: "active" as const,
      currentStage: "case" as const,
      createdBy: "user-demo",
      createdAt: "2026-10-18T09:00:00Z",
      updatedAt: "2026-10-30T16:15:00Z",
      profile,
      assumptions: { ...DEFAULT_ASSUMPTIONS },
      activeCase,
      caseHistory: [activeCase],
      memo: {
        id: "memo-helix-02",
        generatedCaseId: "case-helix-02",
        version: 1,
        title: "Executive Decision Memo: IOMETE Hybrid Lakehouse for Helix Manufacturing",
        executiveSummary:
          "Helix Manufacturing faces soaring operational overhead on its aging 120 TB on-premises Hadoop cluster. Telemetry recommends migrating to IOMETE's hybrid Kubernetes deployment, allowing low-latency factory edge ingestion while synchronizing with central analytics.",
        recommendation:
          "Replace the legacy Hadoop licensing with IOMETE Enterprise, retiring costly specialized hardware in favor of standard commodity compute.",
        financialSummary:
          "Estimated Year 1 IOMETE investment is $155,000 versus current Hadoop maintenance of $420,000. Projected 3-year savings total ~$710,000 with immediate positive cash flow.",
        sovereigntyPosition:
          "Sovereignty Score: 85/100. Proprietary assembly telemetry remains strictly on factory premises, syncing aggregated summaries to the central lakehouse.",
        risksAndUnknowns: [
          "Legacy MapReduce job conversion timeline to Spark SQL requires sizing.",
        ],
        nextSteps: [
          "Benchmark 3 core factory telemetry feeds on IOMETE Spark engine.",
          "Confirm Kubernetes edge node sizing.",
        ],
        createdAt: "2026-10-30T16:15:00Z",
      },
      briefingScript: {
        id: "script-helix-02",
        generatedCaseId: "case-helix-02",
        scriptText:
          "For Helix Manufacturing, Telemetry recommends a hybrid deployment of IOMETE to modernize their aging Hadoop cluster. The platform separates compute from storage, ingesting factory edge telemetry without high ongoing maintenance. The financial model projects over seven hundred thousand dollars in savings over three years, with predictable vCPU licensing and zero per-seat costs. The recommended next step is a proof of concept on three core sensor feeds.",
        estimatedDurationSeconds: 46,
        audioUrl: "/audio/helix-briefing.mp3",
        createdAt: "2026-10-30T16:15:00Z",
      },
    };
  })(),

  // 3. Meridian Health
  (() => {
    const profile = {
      companyName: "Meridian Health Network",
      industry: "Healthcare & Life Sciences",
      region: "United States (East Coast)",
      dataResidencyRequirement: "Strict HIPAA & HITECH Patient Data Protection",
      dataVolumeTb: 260,
      currentPlatform: "Multi-Cloud Warehouse (BigQuery & Snowflake)",
      currentAnnualSpendUsd: 1100000,
      preferredDeployment: "Customer Cloud Account (AWS HIPAA EKS)",
      primaryWorkloads: [
        "Patient Clinical Cohort Analytics",
        "Billing & Claims Optimization",
        "Genomic Research Pipelines",
      ],
      complianceNeeds: [
        "HIPAA BAA",
        "PHI Data Masking",
        "Zero Cloud Egress Outside Health Boundary",
        "Comprehensive Access Auditing",
      ],
      dataUserCount: 310,
      computeIntensity: "high" as const,
      growthRatePercent: 20,
    };
    const activeCase = calculateBusinessCase(profile, DEFAULT_ASSUMPTIONS, 1);
    return {
      id: "deal-meridian-03",
      workspaceId: "ws-demo",
      title: "Meridian Health — Multi-Cloud Warehouse Consolidation",
      status: "active" as const,
      currentStage: "case" as const,
      createdBy: "user-demo",
      createdAt: "2026-10-15T11:00:00Z",
      updatedAt: "2026-10-29T18:00:00Z",
      profile,
      assumptions: { ...DEFAULT_ASSUMPTIONS },
      activeCase,
      caseHistory: [activeCase],
      memo: {
        id: "memo-meridian-03",
        generatedCaseId: "case-meridian-03",
        version: 1,
        title: "Executive Decision Memo: IOMETE Private Lakehouse for Meridian Health",
        executiveSummary:
          "Meridian Health is experiencing severe cost inflation and compliance fragmentation running dual analytics warehouses across Google BigQuery and Snowflake for 260 TB of PHI. Telemetry recommends consolidating onto an IOMETE Private Lakehouse deployed in Meridian's dedicated HIPAA AWS account.",
        recommendation:
          "Execute IOMETE Enterprise deployment inside Meridian's HIPAA perimeter, eliminating cross-cloud egress fees and consolidating governance into a single Apache Iceberg catalog.",
        financialSummary:
          "Year 1 total projected cost is $382,000 versus current $1,100,000 multi-cloud spend. 3-year projected savings exceed $1.85M, driven by eliminating per-query scanning fees and per-seat taxes on 310 data users.",
        sovereigntyPosition:
          "Sovereignty Score: 94/100. All PHI remains strictly within customer-owned S3 buckets with customer-managed encryption keys. (Note: Specific HIPAA BAA terms require formal IOMETE validation).",
        risksAndUnknowns: [
          "Formal Business Associate Agreement (BAA) and SOC 2 Type II review requires legal validation with IOMETE.",
          "Concurrency spikes across 310 clinicians during peak morning clinical shifts.",
        ],
        nextSteps: [
          "Execute legal NDA and vendor BAA framework.",
          "Spin up test IOMETE cluster on Meridian AWS HIPAA account.",
          "Benchmark sample genomic cohort queries.",
        ],
        createdAt: "2026-10-29T18:00:00Z",
      },
      briefingScript: {
        id: "script-meridian-03",
        generatedCaseId: "case-meridian-03",
        scriptText:
          "For Meridian Health, Telemetry recommends consolidating multi-cloud analytics into a single private IOMETE lakehouse inside Meridian's HIPAA-compliant AWS perimeter. Retaining all patient data in customer-owned object storage eliminates cross-cloud egress fees and strengthens access governance. The model projects over 1.8 million dollars in three-year savings by replacing per-query scanning charges with predictable compute. The recommended next step is executing the HIPAA evaluation agreement to validate clinical workload concurrency.",
        estimatedDurationSeconds: 52,
        audioUrl: "/audio/meridian-briefing.mp3",
        createdAt: "2026-10-29T18:00:00Z",
      },
    };
  })(),
];
