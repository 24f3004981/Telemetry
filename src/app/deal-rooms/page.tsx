"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DealRoom } from "@/lib/db/types";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  PlusCircle,
  Building2,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Plus,
} from "lucide-react";

export default function DealRoomsDashboardPage() {
  const [dealRooms, setDealRooms] = useState<DealRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchRooms = async (reset = false) => {
    try {
      setLoading(true);
      const url = reset ? "/api/deal-rooms?reset=true" : "/api/deal-rooms";
      const res = await fetch(url);
      const data = await res.json();
      if (data.dealRooms) {
        setDealRooms(data.dealRooms);
      }
    } catch (err) {
      console.error("Failed to load deal rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = dealRooms.filter((room) => {
    const query = searchQuery.toLowerCase();
    const matchQuery =
      room.profile.companyName.toLowerCase().includes(query) ||
      room.profile.industry.toLowerCase().includes(query) ||
      room.profile.region.toLowerCase().includes(query) ||
      room.activeCase.recommendedDeployment.toLowerCase().includes(query);

    const matchStatus = statusFilter === "all" || room.status === statusFilter;
    return matchQuery && matchStatus;
  });

  return (
    <div className="flex-1 flex max-w-[1180px] mx-auto w-full px-4 sm:px-6 py-8 gap-8 flex-col lg:flex-row">
      {/* Left Navigation Sidebar */}
      <aside className="w-full lg:w-64 space-y-5 shrink-0">
        <div className="p-5 rounded-2xl bg-surface border border-line space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-3 font-semibold">
              Active Workspace
            </span>
            <span className="w-2 h-2 rounded-full bg-pass" />
          </div>
          <div className="font-display font-semibold text-base text-ink">
            IOMETE Enterprise Sales
          </div>
          <p className="text-[12px] text-ink-2 leading-relaxed">
            Decision rooms, transparent financial projections, and board memos.
          </p>
          <Link
            href="/deal-rooms/new"
            className="w-full btn btn-primary text-xs justify-center py-2"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Create Deal Room</span>
          </Link>
        </div>

        {/* Quick Star Demo Loader */}
        <div className="p-4 rounded-2xl bg-teal-soft/40 border border-teal/20 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-teal">
            <Sparkles className="w-4 h-4 text-saffron" />
            <span>Recommended Presentation</span>
          </div>
          <p className="text-[11px] text-ink-2 leading-relaxed">
            NordBank AG is pre-configured for a smooth 3-minute executive presentation.
          </p>
          <Link
            href="/deal-rooms/deal-nordbank-01"
            className="w-full btn text-xs justify-center font-medium bg-surface hover:bg-sunk"
          >
            Open NordBank Demo →
          </Link>
        </div>

        {/* Reset Fixtures Button */}
        <button
          type="button"
          onClick={() => fetchRooms(true)}
          className="w-full text-xs text-ink-3 hover:text-ink flex items-center justify-center p-2 rounded-xl border border-line bg-surface hover:bg-sunk transition-colors"
        >
          <RotateCcw className="w-3 h-3 mr-1.5" />
          <span>Reset Sample Pipeline</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 space-y-5 w-full">
        {/* Top Controls: Search & Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl text-ink">Enterprise Deal Rooms</h1>
            <p className="text-xs text-ink-3 mt-0.5">
              Active buyer evaluations with deterministic TCO and sovereignty audits.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter company or industry..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-line rounded-xl text-ink placeholder:text-ink-3 focus:outline-none focus:border-teal"
            />
          </div>
        </div>

        {/* Mobile View: High-Touch Cards */}
        <div className="block sm:hidden space-y-3">
          {loading ? (
            <div className="p-8 text-center text-xs text-ink-3 font-mono">
              Loading Deal Rooms...
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="p-8 text-center bg-surface border border-line rounded-2xl space-y-2">
              <p className="text-sm font-semibold text-ink">No Deal Rooms found</p>
              <Link href="/deal-rooms/new" className="btn btn-primary text-xs">
                Create First Room
              </Link>
            </div>
          ) : (
            filteredRooms.map((room) => (
              <div
                key={room.id}
                className="p-4 rounded-2xl bg-surface border border-line shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-base text-ink">
                      {room.profile.companyName}
                    </h3>
                    <p className="text-[11px] text-ink-3">
                      {room.profile.industry} • {room.profile.dataVolumeTb} TB
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-pass-soft text-pass border border-pass/20">
                    {room.activeCase.sovereigntyScore}/100
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-sunk/60 text-xs font-mono flex items-center justify-between">
                  <span className="text-ink-3">3-Yr TCO:</span>
                  <span className="font-bold text-ink">
                    {formatCurrency(room.activeCase.threeYearTotalCost)}
                  </span>
                </div>

                {room.activeCase.projectedThreeYearSavings && (
                  <div className="text-[11px] text-pass font-semibold">
                    ✓ Projected Savings: {formatCurrency(room.activeCase.projectedThreeYearSavings)}
                  </div>
                )}

                <Link
                  href={`/deal-rooms/${room.id}`}
                  className="btn btn-primary w-full justify-center text-xs py-2"
                >
                  <span>Open Decision Room</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Full Data Table */}
        <div className="hidden sm:block bg-surface border border-line rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-sunk/60 border-b border-line text-ink-3 font-semibold uppercase text-[10px] font-mono">
                  <th className="py-3 px-4">Company & Deal</th>
                  <th className="py-3 px-3">Industry</th>
                  <th className="py-3 px-3">Data Scale</th>
                  <th className="py-3 px-3">Deployment Model</th>
                  <th className="py-3 px-3 text-center">Sovereignty</th>
                  <th className="py-3 px-4 text-right">3-Yr Total Cost</th>
                  <th className="py-3 px-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-ink-3 font-mono">
                      Loading Deal Rooms...
                    </td>
                  </tr>
                ) : filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center space-y-2">
                      <p className="text-sm font-semibold text-ink">No Deal Rooms found</p>
                      <Link
                        href="/deal-rooms/new"
                        className="btn btn-primary text-xs mt-2"
                      >
                        Create Deal Room
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => (
                    <tr
                      key={room.id}
                      className="hover:bg-sunk/40 transition-colors group cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <Link href={`/deal-rooms/${room.id}`} className="block">
                          <div className="font-semibold text-ink text-sm group-hover:text-teal transition-colors flex items-center">
                            <Building2 className="w-3.5 h-3.5 mr-1.5 text-teal" />
                            {room.profile.companyName}
                          </div>
                          <div className="text-[11px] text-ink-3 truncate max-w-xs mt-0.5">
                            {room.title}
                          </div>
                        </Link>
                      </td>

                      <td className="py-3.5 px-3 text-ink-2">
                        {room.profile.industry}
                      </td>

                      <td className="py-3.5 px-3 font-mono font-medium text-ink">
                        {room.profile.dataVolumeTb} TB
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-sunk border border-line text-[11px] font-medium text-ink-2">
                          {room.activeCase.recommendedPlan} • {room.profile.preferredDeployment.split(" ")[0]}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-pass-soft text-pass border border-pass/20">
                          <ShieldCheck className="w-3 h-3 mr-1 text-pass" />
                          {room.activeCase.sovereigntyScore}/100
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-bold text-ink text-sm">
                          {formatCurrency(room.activeCase.threeYearTotalCost)}
                        </div>
                        {room.activeCase.projectedThreeYearSavings ? (
                          <div className="text-[10px] font-mono text-pass font-semibold">
                            Save {formatCurrency(room.activeCase.projectedThreeYearSavings)}
                          </div>
                        ) : (
                          <div className="text-[10px] text-ink-3 italic">
                            Baseline required
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <Link
                          href={`/deal-rooms/${room.id}`}
                          className="btn text-xs px-2.5 py-1"
                        >
                          <span>Open</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
