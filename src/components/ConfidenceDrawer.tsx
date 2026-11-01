"use client";

import React from "react";
import { CaseOutput, CaseAssumptionItem } from "@/lib/business-case/types";
import { ProvenanceBadge } from "./ProvenanceBadge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ShieldCheck, History, AlertTriangle, Layers, Info } from "lucide-react";

interface ConfidenceDrawerProps {
  activeCase: CaseOutput;
  caseHistory: CaseOutput[];
  onSelectVersion?: (version: number) => void;
}

export function ConfidenceDrawer({
  activeCase,
  caseHistory,
  onSelectVersion,
}: ConfidenceDrawerProps) {
  return (
    <aside className="w-80 bg-surface border-l border-border flex flex-col h-full overflow-y-auto p-4 space-y-6">
      {/* Drawer Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1.5 text-accent" />
            Confidence & Sources
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            {activeCase.confidenceLevel} Confidence
          </span>
        </div>
        <p className="text-[11px] text-text-muted leading-tight">
          All financial claims derive strictly from deterministic calculations and explicit source labels.
        </p>
      </div>

      {/* Assumptions & Provenance List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-text-secondary border-b border-border pb-1.5">
          <span className="flex items-center">
            <Layers className="w-3.5 h-3.5 mr-1 text-text-muted" />
            Active Assumptions ({activeCase.assumptionsUsed.length})
          </span>
          <span className="text-[10px] text-text-muted">v{activeCase.version}</span>
        </div>

        <div className="space-y-2.5">
          {activeCase.assumptionsUsed.map((item: CaseAssumptionItem) => (
            <div
              key={item.id}
              className="p-2.5 rounded-lg bg-surface-muted/60 border border-border text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-text-primary text-[11px] leading-tight">
                  {item.label}
                </span>
                <ProvenanceBadge type={item.sourceType} showIcon={false} />
              </div>
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-sm font-semibold text-text-primary">
                  {item.unit.includes("$") || item.unit.includes("USD")
                    ? formatCurrency(item.value)
                    : `${formatNumber(item.value)} ${item.unit}`}
                </span>
              </div>
              <p className="text-[10px] text-text-muted leading-snug">
                {item.sourceNote}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Risks & Unknowns */}
      <div className="space-y-2">
        <div className="flex items-center text-xs font-medium text-text-secondary border-b border-border pb-1.5">
          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
          <span>Unknowns & Validations</span>
        </div>
        <div className="space-y-2">
          {activeCase.risksAndUnknowns.map((risk, idx) => (
            <div
              key={idx}
              className="p-2 rounded bg-amber-50/50 border border-amber-200/80 text-[11px] text-amber-900 leading-snug flex items-start space-x-1.5"
            >
              <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>{risk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Version History */}
      <div className="space-y-2 pt-2 border-t border-border">
        <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
          <span className="flex items-center">
            <History className="w-3.5 h-3.5 mr-1 text-text-muted" />
            Decision Versions
          </span>
          <span className="text-[10px] font-mono text-text-muted">
            {caseHistory.length} total
          </span>
        </div>
        <div className="space-y-1.5">
          {caseHistory.map((verCase) => {
            const isCurrent = verCase.version === activeCase.version;
            return (
              <div
                key={verCase.version}
                onClick={() => onSelectVersion && onSelectVersion(verCase.version)}
                className={`p-2 rounded border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  isCurrent
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-medium"
                    : "bg-surface hover:bg-surface-muted border-border text-text-secondary"
                }`}
              >
                <div>
                  <span className="font-mono text-[11px] font-semibold">
                    Version {verCase.version}
                  </span>
                  <div className="text-[10px] text-text-muted font-mono">
                    3-Yr: {formatCurrency(verCase.threeYearTotalCost)}
                  </div>
                </div>
                {isCurrent && (
                  <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-sans uppercase">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
