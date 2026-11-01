import React from "react";
import { SourceType } from "@/lib/business-case/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Calculator, Tag, HelpCircle, AlertTriangle } from "lucide-react";

interface ProvenanceBadgeProps {
  type: SourceType;
  className?: string;
  showIcon?: boolean;
}

export function ProvenanceBadge({ type, className, showIcon = true }: ProvenanceBadgeProps) {
  let style = "bg-stone-100 text-stone-700 border-stone-200";
  let icon = <Tag className="w-3 h-3 mr-1" />;

  switch (type) {
    case "Calculated":
      style = "bg-emerald-50 text-emerald-800 border-emerald-200";
      icon = <Calculator className="w-3 h-3 mr-1 text-emerald-700" />;
      break;
    case "User input":
      style = "bg-stone-100 text-stone-800 border-stone-300";
      icon = <CheckCircle2 className="w-3 h-3 mr-1 text-stone-600" />;
      break;
    case "Vendor-claimed":
      style = "bg-blue-50 text-blue-800 border-blue-200";
      icon = <Tag className="w-3 h-3 mr-1 text-blue-700" />;
      break;
    case "Assumption":
      style = "bg-amber-50 text-amber-800 border-amber-200";
      icon = <HelpCircle className="w-3 h-3 mr-1 text-amber-700" />;
      break;
    case "Requires IOMETE validation":
      style = "bg-red-50 text-red-800 border-red-200 font-semibold";
      icon = <AlertTriangle className="w-3 h-3 mr-1 text-red-700" />;
      break;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border uppercase tracking-wider",
        style,
        className
      )}
      title={`Source Provenance: ${type}`}
    >
      {showIcon && icon}
      {type}
    </span>
  );
}
