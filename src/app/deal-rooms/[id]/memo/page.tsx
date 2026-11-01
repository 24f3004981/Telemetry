"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DealRoom } from "@/lib/db/types";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Printer, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function MemoPrintPage() {
  const params = useParams();
  const id = params?.id as string;
  const [dealRoom, setDealRoom] = useState<DealRoom | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/deal-rooms/${id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.dealRoom) setDealRoom(d.dealRoom);
        })
        .catch(console.error);
    }
  }, [id]);

  if (!dealRoom) {
    return (
      <div className="p-12 text-center text-xs font-mono text-text-muted">
        Loading printable executive memo...
      </div>
    );
  }

  const { profile, activeCase, memo } = dealRoom;

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 text-text-primary">
      {/* Floating Action Bar (Hidden during print) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between no-print">
        <Link
          href={`/deal-rooms/${id}`}
          className="inline-flex items-center text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Briefing Room
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4 mr-1.5" />
          Print / Save as PDF
        </button>
      </div>

      {/* The Printable Paper Memo Sheet */}
      <article className="max-w-3xl mx-auto bg-white border border-stone-200 rounded-xl p-10 md:p-12 shadow-sm space-y-6 text-stone-900 font-sans memo-container">
        {/* Memo Header */}
        <header className="border-b-2 border-stone-900 pb-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
              Telemetry Decision Document • Executive Board Memo
            </span>
            <span className="font-mono text-xs text-stone-500">
              Ref: {dealRoom.id}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-stone-950">
            {memo.title}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-3 text-xs font-mono border-t border-stone-200">
            <div>
              <span className="text-stone-500 block text-[10px]">ORGANIZATION:</span>
              <span className="font-semibold">{profile.companyName}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px]">AUDIENCE:</span>
              <span className="font-semibold">CIO, CFO, CISO</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px]">DATE:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px]">SOVEREIGNTY:</span>
              <span className="font-semibold text-emerald-800">
                {activeCase.sovereigntyScore} / 100
              </span>
            </div>
          </div>
        </header>

        {/* Strategic Recommendation Callout */}
        <div className="p-4 rounded-lg bg-stone-50 border-l-4 border-emerald-800 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-900">
            STRATEGIC RECOMMENDATION
          </span>
          <p className="text-xs font-medium text-stone-900 leading-relaxed">
            {memo.recommendation}
          </p>
        </div>

        {/* 1. Executive Summary */}
        <section className="space-y-1.5 text-xs leading-relaxed">
          <h2 className="font-serif font-bold text-sm text-stone-950 uppercase tracking-wide">
            1. Executive Summary
          </h2>
          <p className="text-stone-700">{memo.executiveSummary}</p>
        </section>

        {/* 2. Recommended Deployment Architecture */}
        <section className="space-y-2 text-xs leading-relaxed">
          <h2 className="font-serif font-bold text-sm text-stone-950 uppercase tracking-wide">
            2. Recommended Deployment Architecture
          </h2>
          <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
            <div className="font-semibold text-stone-900">
              {activeCase.recommendedDeployment} (IOMETE {activeCase.recommendedPlan})
            </div>
            <ul className="space-y-1 pt-1 text-stone-600">
              {activeCase.deploymentRationale.map((rat, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-1.5 text-emerald-700 font-bold">•</span>
                  <span>{rat}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. Financial & Economic Case */}
        <section className="space-y-2 text-xs leading-relaxed">
          <h2 className="font-serif font-bold text-sm text-stone-950 uppercase tracking-wide">
            3. Financial Model & 3-Year TCO Summary
          </h2>
          <p className="text-stone-700">{memo.financialSummary}</p>

          <table className="w-full text-left border-collapse font-mono text-[11px] my-2">
            <thead>
              <tr className="border-b border-stone-300 text-stone-600">
                <th className="py-1.5">Metric</th>
                <th className="py-1.5 text-right">Year 1</th>
                <th className="py-1.5 text-right">Year 2</th>
                <th className="py-1.5 text-right">Year 3</th>
                <th className="py-1.5 text-right font-bold">3-Yr Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              <tr>
                <td className="py-1.5">IOMETE Proposed Total</td>
                <td className="py-1.5 text-right">{formatCurrency(activeCase.yearOneCost)}</td>
                <td className="py-1.5 text-right">{formatCurrency(activeCase.yearTwoCost)}</td>
                <td className="py-1.5 text-right">{formatCurrency(activeCase.yearThreeCost)}</td>
                <td className="py-1.5 text-right font-bold text-emerald-900">
                  {formatCurrency(activeCase.threeYearTotalCost)}
                </td>
              </tr>
              {activeCase.estimatedCurrentThreeYearCost && (
                <tr className="text-stone-600">
                  <td className="py-1.5">Current Platform Baseline</td>
                  <td className="py-1.5 text-right">
                    {formatCurrency(profile.currentAnnualSpendUsd)}
                  </td>
                  <td className="py-1.5 text-right">
                    {formatCurrency(Math.round((profile.currentAnnualSpendUsd || 0) * 1.12))}
                  </td>
                  <td className="py-1.5 text-right">
                    {formatCurrency(Math.round((profile.currentAnnualSpendUsd || 0) * 1.12 * 1.12))}
                  </td>
                  <td className="py-1.5 text-right font-bold">
                    {formatCurrency(activeCase.estimatedCurrentThreeYearCost)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* 4. Sovereignty & Governance Position */}
        <section className="space-y-1.5 text-xs leading-relaxed">
          <h2 className="font-serif font-bold text-sm text-stone-950 uppercase tracking-wide">
            4. Sovereignty & Governance Assessment
          </h2>
          <p className="text-stone-700">{memo.sovereigntyPosition}</p>
        </section>

        {/* 5. Unknowns & Evaluation Scope */}
        <section className="space-y-1.5 text-xs leading-relaxed">
          <h2 className="font-serif font-bold text-sm text-stone-950 uppercase tracking-wide">
            5. Key Unknowns Requiring 90-Day Validation
          </h2>
          <ul className="list-disc pl-4 space-y-1 text-stone-700">
            {memo.risksAndUnknowns.map((risk, i) => (
              <li key={i}>{risk}</li>
            ))}
          </ul>
        </section>

        {/* 6. Recommended Next Steps */}
        <section className="space-y-1.5 text-xs leading-relaxed">
          <h2 className="font-serif font-bold text-sm text-stone-950 uppercase tracking-wide">
            6. Next Steps for Procurement & Technical Evaluation
          </h2>
          <ol className="list-decimal pl-4 space-y-1 text-stone-700">
            {memo.nextSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>

        {/* Footer Disclaimer */}
        <footer className="pt-6 border-t border-stone-300 text-[10px] text-stone-500 font-mono leading-relaxed">
          CONFIDENTIAL • Generated by Telemetry Enterprise Decision Workspace.
          All financial figures are estimates derived from stated assumptions and published architectural ratios.
        </footer>
      </article>
    </div>
  );
}
