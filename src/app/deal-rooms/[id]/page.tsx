"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DealRoom } from "@/lib/db/types";
import { ProvenanceBadge } from "@/components/ProvenanceBadge";
import { AudioBriefingPlayer } from "@/components/AudioBriefingPlayer";
import { ConfidenceDrawer } from "@/components/ConfidenceDrawer";
import { TcoComparisonChart } from "@/components/TcoComparisonChart";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Building2,
  Server,
  ShieldCheck,
  Calculator,
  FileText,
  Volume2,
  Printer,
  Sparkles,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Layers,
  ChevronRight,
  Lock,
  DollarSign,
  Loader2,
  Database,
} from "lucide-react";

export default function BriefingRoomPage() {
  const params = useParams();
  const id = params?.id as string;

  const [dealRoom, setDealRoom] = useState<DealRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "business-case" | "why-iomete" | "executive-memo" | "briefing" | "assumptions" | "profile"
  >("business-case");

  // Editable Assumptions State for interactive sensitivity modeling
  const [editSpend, setEditSpend] = useState<number>(850000);
  const [editGrowth, setEditGrowth] = useState<number>(15);
  const [editIntensity, setEditIntensity] = useState<"low" | "medium" | "high">("medium");
  const [isUpdating, setIsUpdating] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/deal-rooms/${id}`);
      if (!res.ok) throw new Error("Room not found");
      const data = await res.json();
      if (data.dealRoom) {
        setDealRoom(data.dealRoom);
        setEditSpend(data.dealRoom.profile.currentAnnualSpendUsd || 850000);
        setEditGrowth(data.dealRoom.profile.growthRatePercent || 15);
        setEditIntensity(data.dealRoom.profile.computeIntensity || "medium");
      }
    } catch (err) {
      console.error("Error loading deal room:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchRoom();
  }, [id]);

  const handleUpdateAssumptions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealRoom) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/deal-rooms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            currentAnnualSpendUsd: editSpend,
            growthRatePercent: editGrowth,
            computeIntensity: editIntensity,
          },
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setDealRoom(data.dealRoom);
      setActiveTab("business-case");
    } catch (err) {
      console.error("Failed to recalculate:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-teal border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-ink-3">Loading Decision Room...</p>
        </div>
      </div>
    );
  }

  if (!dealRoom) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
        <h2 className="text-lg font-semibold text-ink">Deal Room Not Found</h2>
        <Link
          href="/deal-rooms"
          className="btn btn-primary text-xs"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { profile, activeCase, caseHistory, memo, briefingScript } = dealRoom;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Deal Room Header Bar */}
      <div className="bg-surface border-b border-line px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 no-print shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link
            href="/deal-rooms"
            className="text-xs text-ink-3 hover:text-ink transition-colors flex items-center font-medium"
          >
            ← Deal Rooms
          </Link>
          <span className="text-ink-3">/</span>
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-teal" />
            <span className="font-semibold text-sm text-ink truncate max-w-[140px] sm:max-w-none">
              {profile.companyName}
            </span>
            <span className="text-xs text-ink-3 font-mono hidden sm:inline">
              ({profile.dataVolumeTb} TB • {profile.industry})
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-pass-soft text-pass border border-pass/20 text-xs font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-pass" />
            <span>{activeCase.sovereigntyScore}/100</span>
          </div>

          <Link
            href={`/deal-rooms/${id}/memo`}
            className="btn text-xs font-medium px-3 py-1.5"
          >
            <Printer className="w-3.5 h-3.5 mr-1 text-ink-3" />
            <span>Print Memo</span>
          </Link>
        </div>
      </div>

      {/* Mobile Stage Selector (Horizontal Scrolling Pills) */}
      <div className="lg:hidden border-b border-line bg-surface px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("business-case")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer touch-manipulation ${
            activeTab === "business-case"
              ? "bg-teal text-white shadow-xs font-semibold"
              : "bg-sunk text-ink-2 hover:text-ink"
          }`}
        >
          📊 Business Case
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("why-iomete")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer touch-manipulation ${
            activeTab === "why-iomete"
              ? "bg-saffron text-white shadow-xs font-semibold"
              : "bg-sunk text-ink-2 hover:text-ink"
          }`}
        >
          ✨ Why IOMETE
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("executive-memo")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer touch-manipulation ${
            activeTab === "executive-memo"
              ? "bg-teal text-white shadow-xs font-semibold"
              : "bg-sunk text-ink-2 hover:text-ink"
          }`}
        >
          📄 Board Memo
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("briefing")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer touch-manipulation ${
            activeTab === "briefing"
              ? "bg-teal text-white shadow-xs font-semibold"
              : "bg-sunk text-ink-2 hover:text-ink"
          }`}
        >
          🔊 60s Briefing
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("assumptions")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer touch-manipulation ${
            activeTab === "assumptions"
              ? "bg-teal text-white shadow-xs font-semibold"
              : "bg-sunk text-ink-2 hover:text-ink"
          }`}
        >
          ⚙️ Sensitivity
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer touch-manipulation ${
            activeTab === "profile"
              ? "bg-teal text-white shadow-xs font-semibold"
              : "bg-sunk text-ink-2 hover:text-ink"
          }`}
        >
          🏢 Profile
        </button>
      </div>

      {/* 3-Column Cockpit Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Stage Navigator (Desktop only) */}
        <nav className="hidden lg:flex w-60 bg-surface border-r border-line p-4 flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-3 px-2.5 block mb-2 font-semibold">
              Decision Stages
            </span>

            <button
              type="button"
              onClick={() => setActiveTab("business-case")}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer touch-manipulation ${
                activeTab === "business-case"
                  ? "bg-teal-soft text-teal font-semibold"
                  : "text-ink-2 hover:bg-sunk hover:text-ink"
              }`}
            >
              <Calculator className="w-3.5 h-3.5 mr-2 shrink-0" />
              <span>Business Case</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("why-iomete")}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer touch-manipulation ${
                activeTab === "why-iomete"
                  ? "bg-saffron-soft text-saffron-ink font-semibold border border-saffron/30"
                  : "text-ink-2 hover:bg-sunk hover:text-ink"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 mr-2 shrink-0 text-saffron" />
              <span>Why IOMETE & Battlecard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("executive-memo")}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer touch-manipulation ${
                activeTab === "executive-memo"
                  ? "bg-teal-soft text-teal font-semibold"
                  : "text-ink-2 hover:bg-sunk hover:text-ink"
              }`}
            >
              <FileText className="w-3.5 h-3.5 mr-2 shrink-0" />
              <span>Executive Memo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("briefing")}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer touch-manipulation ${
                activeTab === "briefing"
                  ? "bg-teal-soft text-teal font-semibold"
                  : "text-ink-2 hover:bg-sunk hover:text-ink"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 mr-2 shrink-0" />
              <span>Board Briefing (60s)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("assumptions")}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer touch-manipulation ${
                activeTab === "assumptions"
                  ? "bg-teal-soft text-teal font-semibold"
                  : "text-ink-2 hover:bg-sunk hover:text-ink"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 mr-2 shrink-0" />
              <span>Assumption Sensitivity</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer touch-manipulation ${
                activeTab === "profile"
                  ? "bg-teal-soft text-teal font-semibold"
                  : "text-ink-2 hover:bg-sunk hover:text-ink"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 mr-2 shrink-0" />
              <span>Company Profile</span>
            </button>
          </div>

          {/* Quick Meta Footer */}
          <div className="p-3 rounded-xl bg-sunk/60 border border-line text-[11px] space-y-1 font-mono text-ink-3">
            <div className="flex justify-between">
              <span>Case Version:</span>
              <span className="font-semibold text-ink">v{activeCase.version}</span>
            </div>
            <div className="flex justify-between">
              <span>Sovereignty:</span>
              <span className="font-semibold text-pass">{activeCase.sovereigntyScore}/100</span>
            </div>
            <div className="flex justify-between">
              <span>TCO 3-Yr:</span>
              <span className="font-semibold text-ink">
                {formatCurrency(activeCase.threeYearTotalCost)}
              </span>
            </div>
          </div>
        </nav>

        {/* CENTER COLUMN: Tabbed Canvas (Flex 1) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BUSINESS CASE & TCO */}
          {activeTab === "business-case" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Deployment Recommendation Banner */}
              <div className="p-5 rounded-2xl border border-teal/20 bg-teal-soft/30 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal text-white text-[10px] font-mono uppercase tracking-wider font-semibold">
                      Recommended Deployment Architecture
                    </span>
                    <span className="text-xs font-mono text-teal font-semibold">
                      Tier: IOMETE {activeCase.recommendedPlan}
                    </span>
                  </div>
                  <ProvenanceBadge type="Calculated" />
                </div>

                <h3 className="text-lg font-serif font-bold text-ink">
                  {activeCase.recommendedDeployment}
                </h3>

                <ul className="space-y-1 pt-1">
                  {activeCase.deploymentRationale.map((rat, idx) => (
                    <li key={idx} className="text-xs text-ink-2 flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal shrink-0 mt-0.5" />
                      <span>{rat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3-Year TCO Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-line bg-surface shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-ink-3 font-medium">Year 1 Platform Total</span>
                    <ProvenanceBadge type="Calculated" showIcon={false} />
                  </div>
                  <div className="text-2xl font-mono font-bold text-ink">
                    {formatCurrency(activeCase.yearOneCost)}
                  </div>
                  <p className="text-[10px] text-ink-3">
                    ${formatNumber(activeCase.yearOneIometeLicense)} license + ${formatNumber(activeCase.yearOneInfraCost)} cloud compute
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-line bg-surface shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-ink-3 font-medium">3-Year Cumulative TCO</span>
                    <ProvenanceBadge type="Calculated" showIcon={false} />
                  </div>
                  <div className="text-2xl font-mono font-bold text-ink">
                    {formatCurrency(activeCase.threeYearTotalCost)}
                  </div>
                  <p className="text-[10px] text-ink-3">
                    Includes {profile.growthRatePercent || dealRoom.assumptions.currentPlatformGrowthRatePercent}% YoY data growth
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-line bg-surface shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-ink-3 font-medium">Projected Savings</span>
                    <ProvenanceBadge type="Calculated" showIcon={false} />
                  </div>
                  <div className="text-2xl font-mono font-bold text-pass">
                    {activeCase.projectedThreeYearSavings
                      ? formatCurrency(activeCase.projectedThreeYearSavings)
                      : "Baseline Pending"}
                  </div>
                  <p className="text-[10px] text-pass font-medium">
                    {activeCase.paybackMonths
                      ? `Payback in ~${activeCase.paybackMonths} months`
                      : "Compared against current annual run-rate"}
                  </p>
                </div>
              </div>

              {/* TCO Comparison Chart */}
              <div className="p-5 rounded-2xl border border-line bg-surface shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-ink">
                      3-Year Total Cost of Ownership Comparison
                    </h4>
                    <p className="text-[11px] text-ink-3">
                      IOMETE vs {profile.currentPlatform} over 36 months
                    </p>
                  </div>
                  <ProvenanceBadge type="Calculated" />
                </div>

                <div className="h-64 w-full">
                  <TcoComparisonChart activeCase={activeCase} currentAnnualSpend={profile.currentAnnualSpendUsd} />
                </div>
              </div>

              {/* Sizing & Core Assumptions Summary */}
              <div className="p-5 rounded-2xl border border-line bg-surface shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink">
                    Cluster Sizing & Infrastructure Footprint
                  </h4>
                  <ProvenanceBadge type="Assumption" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-sunk/60 border border-line">
                    <span className="text-[10px] text-ink-3 block">Estimated Compute</span>
                    <span className="text-sm font-bold text-ink">{activeCase.estimatedVcpuCount} vCPUs</span>
                  </div>
                  <div className="p-3 rounded-xl bg-sunk/60 border border-line">
                    <span className="text-[10px] text-ink-3 block">Enterprise Rate</span>
                    <span className="text-sm font-bold text-ink">$500 / vCPU / yr</span>
                  </div>
                  <div className="p-3 rounded-xl bg-sunk/60 border border-line">
                    <span className="text-[10px] text-ink-3 block">Cloud Retention Factor</span>
                    <span className="text-sm font-bold text-ink">65% Compute</span>
                  </div>
                  <div className="p-3 rounded-xl bg-sunk/60 border border-line">
                    <span className="text-[10px] text-ink-3 block">Evaluation Horizon</span>
                    <span className="text-sm font-bold text-ink">90 Days</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHY IOMETE & COMPETITIVE BATTLECARD (Selling the Buyer) */}
          {activeTab === "why-iomete" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Executive Value Header */}
              <div className="p-6 rounded-2xl border border-teal/30 bg-gradient-to-r from-teal-soft/40 via-surface to-surface shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold bg-teal text-white">
                    The Buyer's Justification
                  </span>
                  <span className="text-xs font-mono font-bold text-teal">
                    Sovereignty: {activeCase.sovereigntyScore}/100 • 3-Yr Savings: {formatCurrency(activeCase.projectedThreeYearSavings || 2000000)}
                  </span>
                </div>

                <h3 className="font-display text-2xl text-ink">
                  Why IOMETE is the Strategic Replacement for {profile.currentPlatform}
                </h3>

                <p className="text-xs text-ink-2 leading-relaxed">
                  {profile.companyName} is facing compounding costs and stringent regulatory requirements across {profile.dataVolumeTb} TB of data. IOMETE is the modern, fully-managed Data Lakehouse that deploys directly into your cloud infrastructure, delivering cloud-warehouse performance with complete data sovereignty and up to 70% lower TCO.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-surface border border-teal/20">
                    <span className="text-[10px] uppercase font-mono text-teal font-semibold block">
                      1. Financial Payback
                    </span>
                    <span className="text-sm font-bold text-ink">
                      {activeCase.paybackMonths || 1} Month Payback
                    </span>
                    <p className="text-[10px] text-ink-3 mt-0.5">
                      Recovers platform license cost almost immediately against current run-rate.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface border border-teal/20">
                    <span className="text-[10px] uppercase font-mono text-teal font-semibold block">
                      2. Data Perimeter
                    </span>
                    <span className="text-sm font-bold text-ink">
                      100% In-VPC Execution
                    </span>
                    <p className="text-[10px] text-ink-3 mt-0.5">
                      Compute & object storage remain within {profile.companyName}'s own cloud account.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface border border-teal/20">
                    <span className="text-[10px] uppercase font-mono text-teal font-semibold block">
                      3. Table Standard
                    </span>
                    <span className="text-sm font-bold text-ink">
                      Apache Iceberg Open
                    </span>
                    <p className="text-[10px] text-ink-3 mt-0.5">
                      Zero vendor lock-in. All Parquet data and metadata remain yours forever.
                    </p>
                  </div>
                </div>
              </div>

              {/* Head-to-Head Competitive Battlecard Table */}
              <div className="bg-surface border border-line rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div>
                    <h4 className="font-display text-lg text-ink">
                      Competitive Battlecard: IOMETE vs {profile.currentPlatform}
                    </h4>
                    <p className="text-[11px] text-ink-3">
                      Direct architectural comparison to present to CIO, CFO, and CISO.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-sunk text-ink-2 font-medium">
                    Architecture Audit
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-line text-ink-3 uppercase text-[10px] font-mono">
                        <th className="pb-3 font-semibold">Dimension</th>
                        <th className="pb-3 font-semibold text-teal bg-teal-soft/40 px-3 rounded-t-lg">
                          IOMETE Lakehouse
                        </th>
                        <th className="pb-3 font-semibold px-3">
                          {profile.currentPlatform}
                        </th>
                        <th className="pb-3 font-semibold px-3">
                          Business Impact
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line text-ink-2">
                      <tr>
                        <td className="py-3 font-medium text-ink">Deployment Model</td>
                        <td className="py-3 px-3 bg-teal-soft/20 font-semibold text-teal">
                          Customer Cloud Account (VPC)
                        </td>
                        <td className="py-3 px-3">Multi-Tenant Vendor Cloud</td>
                        <td className="py-3 px-3 text-ink-3">Passes CISO residency review</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium text-ink">Storage Format</td>
                        <td className="py-3 px-3 bg-teal-soft/20 font-semibold text-teal">
                          Apache Iceberg (Open Parquet)
                        </td>
                        <td className="py-3 px-3">Proprietary Closed Storage</td>
                        <td className="py-3 px-3 text-ink-3">No expensive data egress migration</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium text-ink">Compute Markup</td>
                        <td className="py-3 px-3 bg-teal-soft/20 font-semibold text-teal">
                          0% Direct Pass-Through
                        </td>
                        <td className="py-3 px-3">300% - 400% Compute Multiplier</td>
                        <td className="py-3 px-3 text-ink-3">Saves ~70% on underlying cloud</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium text-ink">Licensing Structure</td>
                        <td className="py-3 px-3 bg-teal-soft/20 font-semibold text-teal">
                          Flat Annual Tier (${formatNumber(activeCase.yearOneIometeLicense)}/yr)
                        </td>
                        <td className="py-3 px-3">Per-Credit Surge Burn</td>
                        <td className="py-3 px-3 text-ink-3">CFO gets 100% budget predictability</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium text-ink">Encryption Keys</td>
                        <td className="py-3 px-3 bg-teal-soft/20 font-semibold text-teal">
                          Customer AWS KMS / HSM
                        </td>
                        <td className="py-3 px-3">Vendor Managed / Shared</td>
                        <td className="py-3 px-3 text-ink-3">Satisfies GDPR & BaFin audits</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 90-Day Evaluation Blueprint */}
              <div className="bg-surface border border-line rounded-2xl p-6 shadow-xs space-y-4">
                <div className="border-b border-line pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-lg text-ink">
                      Recommended Next Step: 90-Day Low-Risk POC Blueprint
                    </h4>
                    <p className="text-[11px] text-ink-3">
                      A structured parallel evaluation that validates query performance and sizing with zero disruption.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("executive-memo")}
                    className="inline-flex items-center text-xs font-semibold text-teal hover:underline"
                  >
                    View Executive Memo →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-sunk/60 border border-line space-y-1">
                    <span className="font-mono text-[10px] uppercase text-teal font-semibold block">
                      Phase 1 (Weeks 1-2)
                    </span>
                    <span className="font-semibold text-ink block">
                      VPC Deployment
                    </span>
                    <p className="text-[11px] text-ink-3">
                      Deploy IOMETE via Helm chart into {profile.companyName}'s test Kubernetes environment with customer KMS keys.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-sunk/60 border border-line space-y-1">
                    <span className="font-mono text-[10px] uppercase text-teal font-semibold block">
                      Phase 2 (Weeks 3-6)
                    </span>
                    <span className="font-semibold text-ink block">
                      Workload Benchmark
                    </span>
                    <p className="text-[11px] text-ink-3">
                      Run side-by-side query benchmarks on primary workloads: {profile.primaryWorkloads.slice(0, 2).join(", ")}.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-sunk/60 border border-line space-y-1">
                    <span className="font-mono text-[10px] uppercase text-teal font-semibold block">
                      Phase 3 (Weeks 7-9)
                    </span>
                    <span className="font-semibold text-ink block">
                      Security & CISO Signoff
                    </span>
                    <p className="text-[11px] text-ink-3">
                      Audit RBAC controls, dynamic data masking, and verify zero data egress outside the cloud boundary.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-sunk/60 border border-line space-y-1">
                    <span className="font-mono text-[10px] uppercase text-pass font-semibold block">
                      Phase 4 (Weeks 10-12)
                    </span>
                    <span className="font-semibold text-ink block">
                      Board Approval & Cutover
                    </span>
                    <p className="text-[11px] text-ink-3">
                      Confirm validated TCO numbers with the CFO and present final approval memo to the board.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXECUTIVE APPROVAL MEMO */}
          {activeTab === "executive-memo" && (
            <div className="max-w-3xl mx-auto bg-surface border border-line rounded-2xl p-8 shadow-xs space-y-6">
              <div className="border-b border-line pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal font-semibold">
                    Confidential • Boardroom Decision Brief
                  </span>
                  <h2 className="text-xl font-serif font-bold text-ink mt-1">
                    {memo.title}
                  </h2>
                  <div className="text-xs text-ink-3 font-mono mt-1">
                    Prepared for CIO, CFO, CISO • Date: {new Date().toLocaleDateString()}
                  </div>
                </div>
                <Link
                  href={`/deal-rooms/${id}/memo`}
                  className="btn text-xs font-medium"
                >
                  <Printer className="w-3.5 h-3.5 mr-1 text-ink-3" />
                  Print View
                </Link>
              </div>

              <div className="space-y-5 text-xs text-ink-2 leading-relaxed">
                <div>
                  <h4 className="font-serif font-semibold text-sm text-ink mb-1">
                    1. Executive Summary
                  </h4>
                  <p>{memo.executiveSummary}</p>
                </div>

                <div>
                  <h4 className="font-serif font-semibold text-sm text-ink mb-1">
                    2. Strategic Recommendation
                  </h4>
                  <p>{memo.recommendation}</p>
                </div>

                <div>
                  <h4 className="font-serif font-semibold text-sm text-ink mb-1">
                    3. Financial & Cost Justification
                  </h4>
                  <p>{memo.financialSummary}</p>
                </div>

                <div>
                  <h4 className="font-serif font-semibold text-sm text-ink mb-1">
                    4. Data Sovereignty & Governance Position
                  </h4>
                  <p>{memo.sovereigntyPosition}</p>
                </div>

                <div>
                  <h4 className="font-serif font-semibold text-sm text-ink mb-1">
                    5. Unknowns Requiring 90-Day Validation
                  </h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {memo.risksAndUnknowns.map((risk, idx) => (
                      <li key={idx}>{risk}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-serif font-semibold text-sm text-ink mb-1">
                    6. Recommended Next Steps
                  </h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {memo.nextSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SPOKEN BOARD BRIEFING */}
          {activeTab === "briefing" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-1 mb-6">
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal font-semibold px-2.5 py-0.5 rounded-full bg-teal-soft">
                  Spoken Executive Delivery
                </span>
                <h2 className="font-display text-2xl text-ink mt-1">
                  60-Second Audio Boardroom Briefing
                </h2>
                <p className="text-xs text-ink-3">
                  Tightly constrained executive voice stream powered by ElevenLabs speech synthesis.
                </p>
              </div>

              <AudioBriefingPlayer
                scriptText={briefingScript.scriptText}
                durationSeconds={briefingScript.estimatedDurationSeconds || 58}
                companyName={profile.companyName}
              />
            </div>
          )}

          {/* TAB 5: ASSUMPTION SENSITIVITY MODELING */}
          {activeTab === "assumptions" && (
            <div className="max-w-2xl mx-auto bg-surface border border-line rounded-2xl p-6 shadow-xs space-y-6">
              <div className="border-b border-line pb-3">
                <h3 className="text-sm font-semibold text-ink flex items-center">
                  <Sliders className="w-4 h-4 mr-1.5 text-teal" />
                  Interactive Assumption Modeling & Sensitivity
                </h3>
                <p className="text-[11px] text-ink-3 mt-0.5">
                  Adjust unit parameters to instantly recalculate 3-year TCO and record a new decision version.
                </p>
              </div>

              <form onSubmit={handleUpdateAssumptions} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-ink-2 mb-1">
                    Current Platform Annual Run-Rate ($/year)
                  </label>
                  <input
                    type="number"
                    value={editSpend}
                    onChange={(e) => setEditSpend(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-surface text-ink font-mono focus:outline-none focus:border-teal"
                  />
                  <span className="text-[10px] text-ink-3 mt-0.5 block">
                    Used as the baseline to calculate cumulative net ROI and payback timeline.
                  </span>
                </div>

                <div>
                  <label className="block font-medium text-ink-2 mb-1">
                    Expected YoY Data Growth (%)
                  </label>
                  <input
                    type="number"
                    value={editGrowth}
                    onChange={(e) => setEditGrowth(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-surface text-ink font-mono focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink-2 mb-1">
                    Compute Intensity Profile
                  </label>
                  <select
                    value={editIntensity}
                    onChange={(e) =>
                      setEditIntensity(e.target.value as "low" | "medium" | "high")
                    }
                    className="w-full px-3 py-2 rounded-xl border border-line bg-surface text-ink focus:outline-none focus:border-teal"
                  >
                    <option value="low">Low (Standard SQL / Daily Batch BI)</option>
                    <option value="medium">Medium (Ad-Hoc SQL + Periodic Continuous Pipelines)</option>
                    <option value="high">High (High-Concurrency Real-Time + ML Ingestion)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="btn btn-primary w-full justify-center text-xs font-semibold"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        Recalculating Decision Engine...
                      </>
                    ) : (
                      "Recalculate Business Case & Log Version"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: COMPANY PROFILE SUMMARY */}
          {activeTab === "profile" && (
            <div className="max-w-2xl mx-auto bg-surface border border-line rounded-2xl p-6 shadow-xs space-y-4 text-xs">
              <div className="border-b border-line pb-3">
                <h3 className="text-sm font-semibold text-ink">
                  Company Architecture Profile
                </h3>
                <p className="text-[11px] text-ink-3">
                  Extracted parameters used by the deterministic business case engine.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-sunk/60 border border-line">
                  <span className="text-[10px] text-ink-3 block">Company</span>
                  <span className="font-semibold text-ink">{profile.companyName}</span>
                </div>
                <div className="p-3 rounded-xl bg-sunk/60 border border-line">
                  <span className="text-[10px] text-ink-3 block">Industry</span>
                  <span className="font-semibold text-ink">{profile.industry}</span>
                </div>
                <div className="p-3 rounded-xl bg-sunk/60 border border-line">
                  <span className="text-[10px] text-ink-3 block">Jurisdiction</span>
                  <span className="font-semibold text-ink">{profile.region}</span>
                </div>
                <div className="p-3 rounded-xl bg-sunk/60 border border-line">
                  <span className="text-[10px] text-ink-3 block">Data Volume</span>
                  <span className="font-semibold text-ink font-mono">{profile.dataVolumeTb} TB</span>
                </div>
                <div className="p-3 rounded-xl bg-sunk/60 border border-line">
                  <span className="text-[10px] text-ink-3 block">Current Platform</span>
                  <span className="font-semibold text-ink">{profile.currentPlatform}</span>
                </div>
                <div className="p-3 rounded-xl bg-sunk/60 border border-line">
                  <span className="text-[10px] text-ink-3 block">Current Annual Spend</span>
                  <span className="font-semibold text-ink font-mono">
                    {profile.currentAnnualSpendUsd
                      ? formatCurrency(profile.currentAnnualSpendUsd)
                      : "Not Specified"}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-ink-3 uppercase font-mono block mb-1">
                  Primary Workloads
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.primaryWorkloads.map((w, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-sunk text-ink-2 font-mono text-[11px]"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-ink-3 uppercase font-mono block mb-1">
                  Compliance & Security Needs
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.complianceNeeds.map((c, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-pass-soft text-pass font-mono text-[11px]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Drawer Trigger (Only shown on small screens) */}
          <div className="lg:hidden pt-4 pb-8">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="btn w-full justify-center text-xs font-medium py-2.5"
            >
              {mobileDrawerOpen
                ? "▲ Hide Assumptions & Sources"
                : "▼ View Active Assumptions & Provenance Drawer"}
            </button>
            {mobileDrawerOpen && (
              <div className="mt-3 p-4 rounded-2xl bg-surface border border-line shadow-sm">
                <ConfidenceDrawer
                  activeCase={activeCase}
                  caseHistory={caseHistory}
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Assumptions & Confidence Drawer (Desktop only) */}
        <div className="hidden lg:block w-80 bg-surface border-l border-line p-5 shrink-0 overflow-y-auto no-print">
          <ConfidenceDrawer
            activeCase={activeCase}
            caseHistory={caseHistory}
          />
        </div>
      </div>
    </div>
  );
}
