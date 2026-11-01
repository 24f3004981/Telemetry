"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AudioBriefingPlayer } from "@/components/AudioBriefingPlayer";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  Server,
  Calculator,
  ArrowRight,
  Sparkles,
  Play,
  CheckCircle2,
  Lock,
  DollarSign,
  FileText,
  Volume2,
  ChevronRight,
  Layers,
  Building2,
  Database,
  KeyRound,
  Check,
  X,
} from "lucide-react";

export default function TelemetryLandingPage() {
  const [selectedScenario, setSelectedScenario] = useState<"nordbank" | "helix" | "meridian">("nordbank");

  const scenarios = {
    nordbank: {
      roomId: "deal-nordbank-01",
      name: "NordBank AG",
      industry: "Tier-1 Retail & Corporate Banking",
      scale: "400 TB • EU Frankfurt",
      currentPlatform: "Legacy Cloud Data Warehouse (Snowflake)",
      friction: "€850,000/yr spend rising rapidly; strict BaFin audit trails and EU GDPR data residency requirements.",
      fix: "Deploy IOMETE Enterprise inside NordBank's AWS Frankfurt VPC. Retain 100% object storage with bank KMS keys.",
      result: "98/100 Sovereignty Score • $2,066,092 Projected 3-Year Savings • Payback in 1 month.",
      recommendedDeployment: "Customer Cloud Account (AWS EKS EU)",
      licenseY1: "$140,000",
      totalY1: "$231,000",
      savingsPct: "73%",
    },
    helix: {
      roomId: "deal-helix-02",
      name: "Helix Manufacturing Corp",
      industry: "Automotive & Industrial IoT",
      scale: "120 TB • North America",
      currentPlatform: "On-Premises Hadoop Cluster (Legacy EOL)",
      friction: "Specialized legacy hardware costs $420,000/yr in maintenance; slow batch processing for factory floor sensors.",
      fix: "Migrate to IOMETE Hybrid Kubernetes deployment. Low-latency edge ingestion with central data lakehouse querying.",
      result: "75/100 Sovereignty Score • $987,687 Projected 3-Year Savings • Zero Hadoop hardware lock-in.",
      recommendedDeployment: "Hybrid Edge-to-Cloud Kubernetes",
      licenseY1: "$100,000",
      totalY1: "$127,300",
      savingsPct: "70%",
    },
    meridian: {
      roomId: "deal-meridian-03",
      name: "Meridian Health Network",
      industry: "Healthcare & Clinical Research",
      scale: "260 TB • US East",
      currentPlatform: "Multi-Cloud Siloed Warehouse (BigQuery + Snowflake)",
      friction: "Fragmented PHI across clouds costs $1.1M/yr; risk of unauthorized data egress violating HIPAA compliance.",
      fix: "Consolidate onto a single IOMETE Private Lakehouse in Meridian's dedicated HIPAA AWS account with dynamic masking.",
      result: "98/100 Sovereignty Score • $2,774,904 Projected 3-Year Savings • Single Iceberg governance catalog.",
      recommendedDeployment: "Customer Cloud Account (AWS HIPAA EKS)",
      licenseY1: "$156,000",
      totalY1: "$257,400",
      savingsPct: "76%",
    },
  };

  const current = scenarios[selectedScenario];

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION (Munshi 2-Column with Phone Device Mockup) */}
      <section className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-10 sm:pt-16 pb-16 grid lg:grid-cols-[1.1fr_.9fr] gap-12 items-center">
        {/* Left Column: Headline & Value Prop */}
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-saffron-soft text-saffron-ink px-3.5 py-1 text-[13px] font-medium border border-saffron/20">
            <Sparkles className="w-3.5 h-3.5 text-saffron" />
            <span>For CIOs, CFOs, CISOs, and enterprise platform buyers</span>
          </p>

          <h1 className="font-display mt-5 text-[42px] sm:text-[58px] leading-[1.03] text-ink tracking-tight">
            Your data platform, justified. In under 3 minutes.
          </h1>

          <p className="mt-5 text-[17px] sm:text-[18px] leading-relaxed text-ink-2 max-w-[540px]">
            Explain your company’s data requirements like you’d brief a solutions architect. Telemetry calculates transparent 3-year TCO, verifies data sovereignty, drafts an executive approval memo, and plays a 60-second board briefing.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/deal-rooms/new" className="btn btn-primary btn-lg">
              <span>Create a Deal Room</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#why-iomete" className="btn btn-lg">
              <span className="grid place-items-center w-6 h-6 rounded-full bg-saffron text-white">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </span>
              <span>Why IOMETE · Compare Platforms</span>
            </a>
          </div>
        </div>

        {/* Right Column: Munshi Device Frame */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute w-[360px] h-[360px] rounded-full bg-saffron-soft/70 blur-3xl -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          <div className="relative w-full max-w-[390px] rounded-[38px] border-[10px] border-ink bg-surface shadow-munshi overflow-hidden">
            <div className="bg-ink px-6 pt-3 pb-2.5 flex items-center justify-between text-white text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pass" />
                <span>TELEMETRY COCKPIT</span>
              </div>
              <span className="text-white/60">LIVE CASE v1.0</span>
            </div>

            <div className="p-5 space-y-4 bg-bg/50">
              <div className="bg-surface rounded-2xl p-4 border border-line shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-ink flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-teal" />
                    NordBank AG
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-teal-soft text-teal font-semibold">
                    Tier-1 Banking
                  </span>
                </div>
                <div className="text-[12px] text-ink-2">
                  400 TB • EU Frankfurt (AWS EKS)
                </div>
                <div className="pt-2 border-t border-line flex items-center justify-between">
                  <span className="text-[11px] text-ink-3">Sovereignty Score</span>
                  <span className="text-sm font-mono font-bold text-pass">
                    98/100 (PASS)
                  </span>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-4 border border-line shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] text-ink-3">
                  <span>3-Year Projected Savings</span>
                  <span className="text-teal font-medium">Deterministic</span>
                </div>
                <div className="font-mono text-2xl font-bold text-ink">
                  $2,066,092
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-line">
                  <span className="text-ink-3">Est. Payback</span>
                  <span className="font-mono font-semibold text-pass">
                    1 Month
                  </span>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-3 border border-line shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-ink-2 font-medium flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-teal" />
                    <span>Executive Briefing</span>
                  </span>
                  <span className="font-mono text-ink-3 text-[10px]">0:58</span>
                </div>
                <div className="flex items-center gap-1 h-5">
                  {[12, 18, 8, 22, 14, 19, 10, 16, 24, 12, 18, 9, 20, 15, 11, 21].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-teal-soft/80 rounded-full"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </div>

              <Link
                href="/deal-rooms/deal-nordbank-01"
                className="w-full btn btn-dark text-xs justify-center font-medium shadow-sm"
              >
                <span>Open Full Decision Room</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION 2: 60-Second Executive Boardroom Audio Briefing */}
      <section id="watch" className="bg-surface border-y border-line py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-[840px] space-y-6 text-center">
          <div>
            <p className="text-[13px] font-mono uppercase tracking-wider text-teal font-semibold">
              Executive Briefing Stream
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink mt-1">
              Hear Telemetry in 60 seconds
            </h2>
            <p className="text-sm text-ink-2 mt-2 max-w-lg mx-auto">
              A real executive briefing synthesized from NordBank’s 400 TB discovery notes. Calm, confident, board-ready tone.
            </p>
          </div>

          <div className="text-left mt-8">
            <AudioBriefingPlayer
              companyName="NordBank AG"
              scriptText="For NordBank, Telemetry recommends an EU private-cloud deployment of IOMETE. The platform would run inside the bank’s own Kubernetes environment, with all four hundred terabytes of analytics data retained in customer-controlled object storage. The financial model assumes predictable platform licensing, reuse of existing cloud commitments, and zero per-user expansion costs. The primary decision factors are strict data sovereignty, auditability, and multi-year cost predictability. Over three years, this model projects net savings exceeding two million dollars with an estimated payback within one month. The recommended next step is a ninety-day evaluation with IOMETE to validate workload sizing and infrastructure assumptions."
              durationSeconds={58}
            />
          </div>
        </div>
      </section>

      {/* 3. SECTION 3: 3-Step Guide ("How Telemetry Works") */}
      <section className="py-20 px-4 sm:px-6 mx-auto max-w-[1180px]">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-14">
          <h2 className="font-display text-3xl sm:text-4xl text-ink">
            How Telemetry creates your board case
          </h2>
          <p className="text-base text-ink-2">
            From raw discovery notes to verified boardroom assets in under three minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-7 rounded-[20px] bg-surface border border-line shadow-card space-y-4">
            <div className="w-10 h-10 rounded-full bg-saffron-soft text-saffron-ink font-mono font-bold flex items-center justify-center text-sm">
              01
            </div>
            <h3 className="font-display text-xl text-ink">Explain the opportunity</h3>
            <p className="text-sm text-ink-2 leading-relaxed">
              Speak into the microphone or paste notes from your customer call. Telemetry extracts data scale (TB), residency rules, current platform, and spend into structured editable inputs.
            </p>
          </div>

          <div className="p-7 rounded-[20px] bg-surface border border-line shadow-card space-y-4">
            <div className="w-10 h-10 rounded-full bg-teal-soft text-teal font-mono font-bold flex items-center justify-center text-sm">
              02
            </div>
            <h3 className="font-display text-xl text-ink">Deterministic sizing & TCO</h3>
            <p className="text-sm text-ink-2 leading-relaxed">
              The deterministic engine calculates vCPU compute ratios, platform minimums, and cloud compute retention with visible formulas. Every number is tagged with explicit provenance.
            </p>
          </div>

          <div className="p-7 rounded-[20px] bg-surface border border-line shadow-card space-y-4">
            <div className="w-10 h-10 rounded-full bg-pass-soft text-pass font-mono font-bold flex items-center justify-center text-sm">
              03
            </div>
            <h3 className="font-display text-xl text-ink">Boardroom memo & briefing</h3>
            <p className="text-sm text-ink-2 leading-relaxed">
              Instantly generate a 1-page executive approval memo for the CIO/CFO and a 60-second spoken board briefing. Print to PDF or listen live with your champion.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SECTION 4: Interactive Scenario Picker */}
      <section className="bg-sunk/60 border-y border-line py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-[1180px] space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              It validates before it reaches the board
            </h2>
            <p className="text-sm text-ink-2">
              Pick a real enterprise scenario to see how Telemetry solves specific buying friction.
            </p>

            <div className="inline-flex rounded-full border border-line bg-surface p-1 text-xs font-medium gap-1 shadow-sm mt-4">
              <button
                type="button"
                onClick={() => setSelectedScenario("nordbank")}
                className={`px-4 py-1.5 rounded-full transition-colors cursor-pointer touch-manipulation ${
                  selectedScenario === "nordbank"
                    ? "bg-ink text-white font-semibold"
                    : "text-ink-2 hover:text-ink"
                }`}
              >
                🏦 NordBank (Bank)
              </button>
              <button
                type="button"
                onClick={() => setSelectedScenario("helix")}
                className={`px-4 py-1.5 rounded-full transition-colors cursor-pointer touch-manipulation ${
                  selectedScenario === "helix"
                    ? "bg-ink text-white font-semibold"
                    : "text-ink-2 hover:text-ink"
                }`}
              >
                ⚙️ Helix (Manufacturing)
              </button>
              <button
                type="button"
                onClick={() => setSelectedScenario("meridian")}
                className={`px-4 py-1.5 rounded-full transition-colors cursor-pointer touch-manipulation ${
                  selectedScenario === "meridian"
                    ? "bg-ink text-white font-semibold"
                    : "text-ink-2 hover:text-ink"
                }`}
              >
                🏥 Meridian (Healthcare)
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-line bg-surface p-6 sm:p-10 shadow-munshi grid lg:grid-cols-[1.2fr_.8fr] gap-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <h3 className="font-display text-2xl text-ink">{current.name}</h3>
                  <p className="text-xs text-ink-3 mt-0.5">{current.industry} • {current.scale}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-teal-soft text-teal font-semibold">
                  {current.recommendedDeployment}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-saffron font-semibold">
                    The Buying Friction
                  </span>
                  <p className="text-sm text-ink-2 mt-1 leading-relaxed">
                    "{current.friction}"
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-teal font-semibold">
                    The IOMETE Architecture Fix
                  </span>
                  <p className="text-sm text-ink-2 mt-1 leading-relaxed">
                    {current.fix}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-sunk/60 border border-line">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-pass font-semibold block mb-1">
                    Board Outcome
                  </span>
                  <p className="text-sm font-medium text-ink">
                    {current.result}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-bg p-6 space-y-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-ink-3 block mb-3 font-semibold">
                  Financial Model Summary
                </span>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-2 border-b border-line">
                    <span className="text-ink-2">Current Platform:</span>
                    <span className="font-semibold text-ink">{current.currentPlatform.split("(")[0]}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-line">
                    <span className="text-ink-2">IOMETE Y1 License:</span>
                    <span className="font-semibold text-teal">{current.licenseY1}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-line">
                    <span className="text-ink-2">Total Y1 Investment:</span>
                    <span className="font-semibold text-ink">{current.totalY1}</span>
                  </div>
                  <div className="flex justify-between py-2 bg-pass-soft/60 px-3 rounded-lg text-pass font-bold">
                    <span>Est. TCO Savings:</span>
                    <span>{current.savingsPct} Lower</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/deal-rooms/${current.roomId}`}
                className="w-full btn btn-primary justify-center font-semibold text-xs"
              >
                <span>Explore Deal Room Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 5: "Why IOMETE: The Enterprise Lakehouse Advantage" (Selling the Buyer) */}
      <section id="why-iomete" className="bg-surface border-b border-line py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-[1180px] space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[12px] font-mono uppercase tracking-wider text-teal font-semibold px-3 py-1 rounded-full bg-teal-soft border border-teal/20">
              The IOMETE Advantage
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-ink leading-tight">
              Why leading enterprises choose IOMETE over legacy warehouses
            </h2>
            <p className="text-base text-ink-2 leading-relaxed">
              IOMETE is the fully-managed modern Data Lakehouse built natively on Apache Iceberg and Apache Spark. It deploys directly inside your cloud account—giving you the ease of Snowflake with complete data sovereignty and up to 70% lower TCO.
            </p>
          </div>

          {/* 4 Pillars of the IOMETE Pitch */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-bg border border-line space-y-3 hover:border-teal transition-colors">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-teal text-white shadow-xs">
                <Lock className="w-5 h-5" />
              </span>
              <h3 className="font-display text-lg text-ink">100% Data Sovereignty</h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                Compute and storage remain inside your dedicated VPC or Kubernetes cluster. Data never leaves your perimeter, and encryption keys stay in your own KMS.
              </p>
              <div className="text-[11px] font-mono text-teal font-medium pt-1">
                ✓ BaFin, GDPR & HIPAA Compliant
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-bg border border-line space-y-3 hover:border-teal transition-colors">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-saffron text-white shadow-xs">
                <DollarSign className="w-5 h-5" />
              </span>
              <h3 className="font-display text-lg text-ink">Up to 70% TCO Savings</h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                Flat, predictable licensing without 300% compute markups or per-credit surge pricing. Reuse your existing cloud commitments (AWS EDP, Azure MACC).
              </p>
              <div className="text-[11px] font-mono text-saffron-ink font-medium pt-1">
                ✓ Payback within 1 to 4 Months
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-bg border border-line space-y-3 hover:border-teal transition-colors">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-pass text-white shadow-xs">
                <Layers className="w-5 h-5" />
              </span>
              <h3 className="font-display text-lg text-ink">Zero Vendor Lock-in</h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                Open Apache Iceberg format. All tables reside in standard Parquet files in your own object storage. You own the metadata, storage, and catalog forever.
              </p>
              <div className="text-[11px] font-mono text-pass font-medium pt-1">
                ✓ Native Apache Iceberg & Spark
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-bg border border-line space-y-3 hover:border-teal transition-colors">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-ink text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h3 className="font-display text-lg text-ink">Enterprise Governance</h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                Fine-grained role-based access control (RBAC), column-level data masking, immutable audit logging, and single-pane catalog management out of the box.
              </p>
              <div className="text-[11px] font-mono text-ink-2 font-medium pt-1">
                ✓ SOC 2 Type II Certified
              </div>
            </div>
          </div>

          {/* Head-to-Head Comparison Battlecard Table */}
          <div className="rounded-2xl border border-line bg-bg p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl text-ink">
                  Head-to-Head: IOMETE vs Legacy Alternatives
                </h3>
                <p className="text-xs text-ink-3">
                  How IOMETE compares directly against Snowflake, Databricks, and Legacy Hadoop.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-teal-soft text-teal border border-teal/20 font-medium">
                Verified Architecture Comparison
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-line text-ink-3 uppercase text-[11px] tracking-wider">
                    <th className="pb-3 font-semibold">Evaluation Criteria</th>
                    <th className="pb-3 font-semibold text-teal bg-teal-soft/40 px-3 rounded-t-lg">
                      IOMETE Lakehouse
                    </th>
                    <th className="pb-3 font-semibold px-3">Snowflake</th>
                    <th className="pb-3 font-semibold px-3">Databricks</th>
                    <th className="pb-3 font-semibold px-3">Legacy Hadoop</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-ink-2">
                  <tr>
                    <td className="py-3 font-medium text-ink">Deployment Location</td>
                    <td className="py-3 px-3 bg-teal-soft/20 font-semibold text-teal">
                      Customer VPC / K8s
                    </td>
                    <td className="py-3 px-3">Vendor Multi-Tenant Cloud</td>
                    <td className="py-3 px-3">Vendor Managed / Hybrid</td>
                    <td className="py-3 px-3">On-Premises Bare Metal</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-ink">Table Storage Format</td>
                    <td className="py-3 px-3 bg-teal-soft/20 font-semibold text-teal">
                      Open Apache Iceberg
                    </td>
                    <td className="py-3 px-3">Proprietary Closed Format</td>
                    <td className="py-3 px-3">Delta Lake (Proprietary Features)</td>
                    <td className="py-3 px-3">Legacy HDFS / MapReduce</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-ink">Compute Pricing Model</td>
                    <td className="py-3 px-3 bg-teal-soft/20 font-semibold text-teal">
                      Flat Annual License
                    </td>
                    <td className="py-3 px-3">Credit Multiplier (300%+ markup)</td>
                    <td className="py-3 px-3">Unpredictable DBU Burn</td>
                    <td className="py-3 px-3">High Fixed Server Maintenance</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-ink">Data Egress & Lock-in</td>
                    <td className="py-3 px-3 bg-teal-soft/20 font-semibold text-teal">
                      Zero Lock-in (Your S3)
                    </td>
                    <td className="py-3 px-3">High Egress Penalties</td>
                    <td className="py-3 px-3">Moderate Platform Lock-in</td>
                    <td className="py-3 px-3">High Legacy Migration Debt</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-ink">Encryption Keys</td>
                    <td className="py-3 px-3 bg-teal-soft/20 font-semibold text-teal">
                      Customer KMS / HSM
                    </td>
                    <td className="py-3 px-3">Vendor Managed (or Enterprise surcharge)</td>
                    <td className="py-3 px-3">Shared Control Plane</td>
                    <td className="py-3 px-3">Self-Managed Local Keys</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-ink">3-Year Projected TCO</td>
                    <td className="py-3 px-3 bg-teal-soft/20 font-bold text-pass">
                      Up to 70% Lower
                    </td>
                    <td className="py-3 px-3 text-red-700">Rapidly Compounding</td>
                    <td className="py-3 px-3 text-amber-700">High Overhead</td>
                    <td className="py-3 px-3 text-red-700">Expiring EOL Support</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* C-Suite Buy-in Quadrant (Selling CIO, CFO, CISO, and Data Lead) */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="font-display text-2xl sm:text-3xl text-ink">
                How Telemetry Sells Every Board Stakeholder
              </h3>
              <p className="text-xs text-ink-3">
                Clear alignment across the four executive buyers who sign off on enterprise data platform purchases.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-line bg-bg space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-teal font-semibold">
                    The Chief Financial Officer (CFO)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-pass-soft text-pass">
                    Cost Certainty
                  </span>
                </div>
                <h4 className="font-display text-lg text-ink">Eliminate Unpredictable Cloud Surges</h4>
                <p className="text-xs text-ink-2 leading-relaxed">
                  CFOs approve IOMETE because the licensing model is flat and predictable. No surprises from runaway queries, no per-seat licenses as data teams scale, and immediate payback in under 4 months by retiring expensive proprietary warehouse markups.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-line bg-bg space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-teal font-semibold">
                    The Chief Information Security Officer (CISO)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-pass-soft text-pass">
                    100% Sovereignty
                  </span>
                </div>
                <h4 className="font-display text-lg text-ink">Zero Data Leaves the Bank or Health Perimeter</h4>
                <p className="text-xs text-ink-2 leading-relaxed">
                  CISOs sign off on IOMETE because it runs entirely inside customer-owned VPCs or private Kubernetes clusters. Customer retains exclusive control over encryption keys (AWS KMS / Azure Key Vault / HSM) and fine-grained RBAC audit logs.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-line bg-bg space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-teal font-semibold">
                    The Chief Information Officer (CIO)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-pass-soft text-pass">
                    Architecture Modernization
                  </span>
                </div>
                <h4 className="font-display text-lg text-ink">Modern Iceberg Lakehouse with Zero Lock-In</h4>
                <p className="text-xs text-ink-2 leading-relaxed">
                  CIOs back IOMETE because it adopts open-source industry standards (Apache Iceberg + Apache Spark). If company strategy shifts in five years, all data remains in standard open Parquet files in customer-controlled object storage.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-line bg-bg space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-teal font-semibold">
                    The VP of Data & Solutions Architect
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-pass-soft text-pass">
                    Performance & Ease
                  </span>
                </div>
                <h4 className="font-display text-lg text-ink">Turnkey Operation & Sub-Second Querying</h4>
                <p className="text-xs text-ink-2 leading-relaxed">
                  Data teams choose IOMETE because it removes the maintenance burden of legacy clusters. Full ANSI SQL support, seamless BI connector compatibility (Tableau, PowerBI), dynamic partition pruning, and auto-scaling compute pools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 6: Enterprise Trust Pillars */}
      <section className="py-20 px-4 sm:px-6 mx-auto max-w-[1180px]">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-14">
          <h2 className="font-display text-3xl sm:text-4xl text-ink">
            Designed for high-trust buying decisions
          </h2>
          <p className="text-base text-ink-2">
            No marketing fluff, no hallucinatory claims. Pure enterprise financial & infrastructure logic.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-teal-soft text-teal font-semibold text-xs">
              01
            </span>
            <h4 className="font-display text-base text-ink">Deterministic TCO</h4>
            <p className="text-xs text-ink-2 leading-relaxed">
              Every financial calculation is performed by deterministic TypeScript logic. Numbers are never guessed by an LLM.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-saffron-soft text-saffron font-semibold text-xs">
              02
            </span>
            <h4 className="font-display text-base text-ink">Labeled Provenance</h4>
            <p className="text-xs text-ink-2 leading-relaxed">
              Every figure is tagged as User input, Calculated, Vendor-claimed, or Assumption for complete auditability.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-pass-soft text-pass font-semibold text-xs">
              03
            </span>
            <h4 className="font-display text-base text-ink">Sovereignty Scoring</h4>
            <p className="text-xs text-ink-2 leading-relaxed">
              Scored from 0 to 100 based on data residency, control plane isolation, KMS key management, and egress.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-line text-ink-2 font-semibold text-xs">
              04
            </span>
            <h4 className="font-display text-base text-ink">Exportable Memo</h4>
            <p className="text-xs text-ink-2 leading-relaxed">
              One-page executive briefing memo formatted for print-to-PDF or browser viewing in boardroom presentations.
            </p>
          </div>
        </div>
      </section>

      {/* 7. SECTION 7: Call to Action */}
      <section className="bg-surface border-t border-line py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-[800px] text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-5xl text-ink leading-tight">
            Your next platform approval starts here.
          </h2>
          <p className="text-base text-ink-2 max-w-lg mx-auto">
            Create a decision room in under three minutes. Speak or type your prospect’s discovery notes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/deal-rooms/new" className="btn btn-primary btn-lg w-full sm:w-auto">
              <span>Create a Deal Room</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/deal-rooms/deal-nordbank-01" className="btn btn-lg w-full sm:w-auto">
              <span>Launch NordBank AG Demo</span>
            </Link>
          </div>

          <p className="text-xs text-ink-3">
            Deterministic Financial Models • Enterprise PostgreSQL • ElevenLabs Voice AI
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line py-8 px-4 sm:px-6 bg-bg text-center no-print">
        <div className="max-w-[1180px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-3">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm text-ink">Telemetry</span>
            <span>· Enterprise Decision Workspace</span>
          </div>
          <p>
            Independent decision-support tool. Financial outputs are estimates based on user assumptions and published IOMETE architecture.
          </p>
        </div>
      </footer>
    </div>
  );
}
