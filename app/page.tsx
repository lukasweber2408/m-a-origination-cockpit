import Link from "next/link";
import {
  deals,
  getTargets,
  getBuyers,
  getWatchlisted,
} from "@/lib/data";
import {
  dealStatusConfig,
  companyStatusConfig,
  priorityConfig,
  formatCurrency,
  formatMultiple,
} from "@/lib/utils";
import {
  Target,
  Users,
  Briefcase,
  Bookmark,
  Activity,
  ArrowRight,
} from "lucide-react";
import Badge from "@/components/Badge";
import ScoreBar from "@/components/ScoreBar";

export default function Dashboard() {
  const targets = getTargets();
  const buyers = getBuyers();
  const watchlisted = getWatchlisted();
  const activeDeals = deals.filter(
    (d) => d.status !== "closed_won" && d.status !== "closed_lost"
  );
  const closedWon = deals.filter((d) => d.status === "closed_won");
  const highPriority = deals.filter(
    (d) =>
      d.priority === "high" &&
      d.status !== "closed_won" &&
      d.status !== "closed_lost"
  );

  const totalEV = activeDeals.reduce((sum, d) => sum + (d.estimatedEV ?? 0), 0);

  const stats = [
    {
      label: "Active Targets",
      value: targets.filter((t) => t.status !== "passed").length,
      icon: Target,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      href: "/targets",
    },
    {
      label: "Buyers / Investors",
      value: buyers.length,
      icon: Users,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      href: "/buyers",
    },
    {
      label: "Active Deals",
      value: activeDeals.length,
      icon: Briefcase,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      href: "/deals",
    },
    {
      label: "Watchlisted",
      value: watchlisted.length,
      icon: Bookmark,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      href: "/watchlist",
    },
  ];

  const stages = [
    { status: "screening", label: "Screening" },
    { status: "first_contact", label: "First Contact" },
    { status: "nda_signed", label: "NDA Signed" },
    { status: "loi_submitted", label: "LOI Submitted" },
    { status: "due_diligence", label: "Due Diligence" },
    { status: "negotiation", label: "Negotiation" },
  ];

  const pipelineData = stages.map((s) => ({
    ...s,
    count: deals.filter((d) => d.status === s.status).length,
    ev: deals
      .filter((d) => d.status === s.status)
      .reduce((sum, d) => sum + (d.estimatedEV ?? 0), 0),
  }));

  const maxCount = Math.max(...pipelineData.map((s) => s.count), 1);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-white">
          Origination Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Overview of your M&A pipeline —{" "}
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-4 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 font-medium">
                {s.label}
              </span>
              <div
                className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}
              >
                <s.icon size={15} className={s.color} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{s.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Pipeline funnel */}
        <div className="lg:col-span-2 bg-[#111827] border border-[#1e2a3a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Deal Pipeline
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Active deals · Total EV {formatCurrency(totalEV)}
              </p>
            </div>
            <Activity size={15} className="text-slate-600" />
          </div>
          <div className="space-y-2.5">
            {pipelineData.map((stage) => {
              const cfg =
                dealStatusConfig[
                  stage.status as keyof typeof dealStatusConfig
                ];
              return (
                <div key={stage.status} className="flex items-center gap-3">
                  <div className="w-28 text-xs text-slate-400 shrink-0">
                    {stage.label}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#1e2a3a] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cfg.bg} transition-all`}
                        style={{
                          width: `${(stage.count / maxCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 w-4 text-right tabular-nums">
                      {stage.count}
                    </span>
                    <span className="text-xs text-slate-600 w-16 text-right tabular-nums">
                      {stage.ev > 0 ? formatCurrency(stage.ev) : "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-[#1e2a3a] flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {closedWon.length} closed won
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              {deals.filter((d) => d.status === "closed_lost").length} closed
              lost
            </span>
          </div>
        </div>

        {/* High priority deals */}
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">
              High Priority Deals
            </h2>
            <Link
              href="/deals"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              All <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-4">
            {highPriority.slice(0, 4).map((deal) => {
              const statusCfg = dealStatusConfig[deal.status];
              return (
                <Link key={deal.id} href={`/deals/${deal.id}`} className="block group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                        {deal.name}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {deal.sector}
                      </div>
                    </div>
                    <Badge
                      label={statusCfg.label}
                      color={statusCfg.color}
                      bg={statusCfg.bg}
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                    <span>EV {formatCurrency(deal.estimatedEV)}</span>
                    <span>{formatMultiple(deal.evEbitdaMultiple)} EBITDA</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top targets */}
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Top Targets</h2>
            <Link
              href="/targets"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              All targets <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-3">
            {targets
              .sort((a, b) => b.priorityScore - a.priorityScore)
              .slice(0, 5)
              .map((co) => {
                const statusCfg = companyStatusConfig[co.status];
                return (
                  <Link
                    key={co.id}
                    href={`/companies/${co.id}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                          {co.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {co.sector} · {co.hq}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          label={statusCfg.label}
                          color={statusCfg.color}
                          bg={statusCfg.bg}
                        />
                        <ScoreBar score={co.priorityScore} />
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>

        {/* Recent deals */}
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">
              Recently Updated
            </h2>
            <Link
              href="/deals"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              All deals <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-3">
            {deals
              .sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
              .slice(0, 5)
              .map((deal) => {
                const statusCfg = dealStatusConfig[deal.status];
                const pCfg = priorityConfig[deal.priority];
                return (
                  <Link
                    key={deal.id}
                    href={`/deals/${deal.id}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                          {deal.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {deal.sector} · Updated {deal.updatedAt}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] ${pCfg.color}`}>
                          {pCfg.label}
                        </span>
                        <Badge
                          label={statusCfg.label}
                          color={statusCfg.color}
                          bg={statusCfg.bg}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
