import Link from "next/link";
import {
  Database,
  SlidersHorizontal,
  ClipboardList,
  AlertCircle,
  ArrowRight,
  Building2,
  TrendingUp,
  Users,
} from "lucide-react";
import { targets } from "@/lib/targets";
import { scoreToBand, scoreBandColor } from "@/lib/scoring";
import SectorBadge from "@/components/SectorBadge";
import OriginationScoreBar from "@/components/OriginationScoreBar";
import ReviewStatusBadge from "@/components/ReviewStatusBadge";
import { SectorType } from "@/lib/schema";

const SECTORS: SectorType[] = ["Banking", "Payments", "Asset Management", "Wealth Management"];

export default function Dashboard() {
  const total = targets.length;
  const reviewed = targets.filter((t) => t.reviewStatus === "reviewed").length;
  const needsValidation = targets.filter(
    (t) => t.reviewStatus === "needs_validation" || t.reviewStatus === "low_confidence"
  ).length;
  const flagged = targets.filter((t) => t.reviewStatus === "flagged").length;

  const sectorCounts = SECTORS.map((s) => ({
    sector: s,
    count: targets.filter((t) => t.sector === s).length,
  }));

  const ownershipCounts = Object.entries(
    targets.reduce((acc, t) => {
      acc[t.ownershipType] = (acc[t.ownershipType] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const topTargets = [...targets]
    .sort((a, b) => b.scoring.total - a.scoring.total)
    .slice(0, 8);

  const reviewQueue = targets
    .filter(
      (t) =>
        t.reviewStatus === "needs_validation" ||
        t.reviewStatus === "low_confidence" ||
        t.reviewStatus === "flagged"
    )
    .slice(0, 5);

  const cityCounts = Object.entries(
    targets.reduce((acc, t) => {
      acc[t.hqCity] = (acc[t.hqCity] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-white">
          German FinServ Origination Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Research-backed target universe · Germany · Banking · Payments · Asset Management · Wealth Management
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Targets",
            value: total,
            sub: "in universe",
            href: "/universe",
            icon: Database,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            label: "Reviewed",
            value: reviewed,
            sub: "high confidence",
            href: "/universe",
            icon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Needs Validation",
            value: needsValidation,
            sub: "action required",
            href: "/review",
            icon: ClipboardList,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            label: "Flagged",
            value: flagged,
            sub: "regulatory/ownership",
            href: "/review",
            icon: AlertCircle,
            color: "text-red-400",
            bg: "bg-red-500/10",
          },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-4 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 font-medium">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon size={15} className={s.color} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-600 mt-1">{s.sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Sector breakdown */}
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Target Universe by Sector</h2>
          <div className="space-y-3">
            {sectorCounts.map(({ sector, count }) => (
              <div key={sector} className="flex items-center gap-3">
                <SectorBadge sector={sector} size="xs" />
                <div className="flex-1 h-1.5 bg-[#1e2a3a] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-slate-500 to-slate-400 transition-all"
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 tabular-nums w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-[#1e2a3a]">
            <Link
              href="/universe"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Browse all <ArrowRight size={11} />
            </Link>
          </div>
        </div>

        {/* Ownership breakdown */}
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Ownership Distribution</h2>
          <div className="space-y-2.5">
            {ownershipCounts.map(([ownership, count]) => (
              <div key={ownership} className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 capitalize truncate max-w-[140px]">
                  {ownership.replace(/-/g, " ")}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 h-1.5 bg-[#1e2a3a] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-500 transition-all"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 tabular-nums w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic clustering */}
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">
            <span className="flex items-center gap-2">
              <Building2 size={14} className="text-slate-500" />
              Top Cities
            </span>
          </h2>
          <div className="space-y-2.5">
            {cityCounts.map(([city, count]) => (
              <div key={city} className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 truncate max-w-[140px]">{city}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 h-1.5 bg-[#1e2a3a] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500/50 transition-all"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 tabular-nums w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top priority targets */}
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Top Origination Targets</h2>
            <Link
              href="/universe"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              All <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-3">
            {topTargets.map((t) => {
              const band = scoreToBand(t.scoring.total);
              const bandColor = scoreBandColor(band);
              return (
                <Link key={t.id} href={`/companies/${t.id}`} className="block group">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                        {t.name}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {t.subsector} · {t.hqCity}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <SectorBadge sector={t.sector} size="xs" />
                      <span className={`text-xs font-bold tabular-nums ${bandColor}`}>
                        {t.scoring.total}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Review queue */}
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Review Queue</h2>
            <Link
              href="/review"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              All <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-3">
            {reviewQueue.map((t) => (
              <Link key={t.id} href={`/companies/${t.id}`} className="block group">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-slate-300 group-hover:text-white truncate">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{t.sector}</div>
                  </div>
                  <ReviewStatusBadge status={t.reviewStatus} />
                </div>
              </Link>
            ))}
            {reviewQueue.length === 0 && (
              <p className="text-xs text-slate-600">All records reviewed.</p>
            )}
          </div>

          {/* Quick screens */}
          <div className="mt-5 pt-4 border-t border-[#1e2a3a]">
            <div className="text-xs text-slate-500 mb-2 font-medium">Quick Screens</div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Founder-owned WM", href: "/screening?ownership=founder-owned&sector=Wealth+Management" },
                { label: "PE-backed", href: "/screening?ownership=PE-backed" },
                { label: "Payments targets", href: "/screening?sector=Payments" },
                { label: "Low confidence", href: "/review" },
              ].map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="text-[10px] px-2 py-1 rounded-md bg-[#1e2a3a] text-slate-400 hover:text-slate-200 hover:bg-[#243040] transition-colors"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data disclaimer */}
      <div className="mt-4 flex items-start gap-2 bg-[#0d111c] border border-[#1e2a3a] rounded-lg p-3">
        <AlertCircle size={13} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-500 leading-relaxed">
          All data sourced from public information only (company websites, annual reports, press releases, BaFin-visible data).
          Financial metrics are approximate and unaudited. All entries must be independently verified before use in any
          client engagement or investment process. Last research update: 2026-03-18.
        </p>
      </div>
    </div>
  );
}
