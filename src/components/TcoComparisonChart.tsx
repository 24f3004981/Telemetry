"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CaseOutput } from "@/lib/business-case/types";
import { formatCurrency } from "@/lib/utils";

interface TcoComparisonChartProps {
  activeCase: CaseOutput;
  currentAnnualSpend?: number | null;
}

export function TcoComparisonChart({
  activeCase,
  currentAnnualSpend,
}: TcoComparisonChartProps) {
  if (!currentAnnualSpend || !activeCase.estimatedCurrentThreeYearCost) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded-lg p-6 bg-surface-muted/40 text-center">
        <p className="text-xs text-text-secondary font-medium mb-1">
          Current Spend Baseline Required for Comparative TCO Chart
        </p>
        <p className="text-[11px] text-text-muted max-w-sm">
          Enter the customer’s reported current warehouse expenditure to unlock side-by-side 3-year visual comparisons.
        </p>
      </div>
    );
  }

  const curY1 = currentAnnualSpend;
  const curY2 = Math.round(curY1 * 1.12);
  const curY3 = Math.round(curY2 * 1.12);

  const data = [
    {
      name: "Year 1",
      "Current Platform": curY1,
      "IOMETE Total": activeCase.yearOneCost,
      "Annual Savings": Math.max(0, curY1 - activeCase.yearOneCost),
    },
    {
      name: "Year 2",
      "Current Platform": curY2,
      "IOMETE Total": activeCase.yearTwoCost,
      "Annual Savings": Math.max(0, curY2 - activeCase.yearTwoCost),
    },
    {
      name: "Year 3",
      "Current Platform": curY3,
      "IOMETE Total": activeCase.yearThreeCost,
      "Annual Savings": Math.max(0, curY3 - activeCase.yearThreeCost),
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            3-Year TCO Comparison Projection
          </h4>
          <p className="text-[11px] text-text-muted">
            Includes IOMETE license + customer Kubernetes compute vs current baseline (+12% YoY growth)
          </p>
        </div>
        {activeCase.projectedThreeYearSavings && (
          <div className="text-right">
            <span className="text-[10px] text-emerald-800 uppercase font-semibold">
              Projected 3-Year Net Savings
            </span>
            <div className="text-sm font-mono font-bold text-emerald-700">
              +{formatCurrency(activeCase.projectedThreeYearSavings)}
            </div>
          </div>
        )}
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 15, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="#71717A"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#E4E4E1" }}
            />
            <YAxis
              stroke="#71717A"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#E4E4E1" }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value)), ""]}
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E4E4E1",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              iconType="circle"
            />
            <Bar
              dataKey="Current Platform"
              fill="#71717A"
              radius={[4, 4, 0, 0]}
              maxBarSize={45}
            />
            <Bar
              dataKey="IOMETE Total"
              fill="#0F5132"
              radius={[4, 4, 0, 0]}
              maxBarSize={45}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
