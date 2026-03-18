import { notFound } from "next/navigation";
import Link from "next/link";
import { getDealById, getCompanyById, getTagsByIds } from "@/lib/data";
import {
  dealStatusConfig,
  priorityConfig,
  confidenceConfig,
  formatCurrency,
  formatMultiple,
} from "@/lib/utils";
import Badge from "@/components/Badge";
import ScoreBar from "@/components/ScoreBar";
import { ArrowLeft, Bookmark, TrendingUp, Building2, Tag, Calendar } from "lucide-react";

const DEAL_STAGES = [
  "screening",
  "first_contact",
  "nda_signed",
  "loi_submitted",
  "due_diligence",
  "negotiation",
  "closed_won",
];

export default function DealPage({ params }: { params: { id: string } }) {
  const deal = getDealById(params.id);
  if (!deal) notFound();

  const target = getCompanyById(deal.targetId);
  const buyer = deal.buyerId ? getCompanyById(deal.buyerId) : undefined;
  const tags = getTagsByIds(deal.tags);
  const statusCfg = dealStatusConfig[deal.status];
  const pCfg = priorityConfig[deal.priority];
  const confCfg = confidenceConfig[deal.confidence];

  const stageIndex = DEAL_STAGES.indexOf(deal.status);
  const isClosed =
    deal.status === "closed_won" ||
    deal.status === "closed_lost" ||
    deal.status === "on_hold";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back */}
      <Link
        href="/deals"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-5 transition-colors"
      >
        <ArrowLeft size={12} />
        All Deals
      </Link>

      {/* Header */}
      <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-6 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-semibold text-white">{deal.name}</h1>
              {deal.watchlisted && (
                <Bookmark size={14} className="text-amber-400 fill-amber-400 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Badge label={statusCfg.label} color={statusCfg.color} bg={statusCfg.bg} />
              <Badge label={deal.dealType} color="text-slate-300" bg="bg-slate-700" />
              <span className={`text-xs ${confCfg.color}`}>
                {confCfg.label} confidence
              </span>
              {tags.map((t) => (
                <span
                  key={t.id}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: t.color + "40", border: `1px solid ${t.color}60` }}
                >
                  {t.name}
                </span>
              ))}
            </div>
            <div className="text-sm text-slate-500">
              {deal.sector} · Source: {deal.source ?? "Unknown"}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-slate-500 mb-1">Priority Score</div>
            <div className="text-3xl font-bold text-white mb-1">{deal.priorityScore}</div>
            <div className={`text-xs flex items-center justify-end gap-1.5 ${pCfg.color}`}>
              <span className={`w-2 h-2 rounded-full ${pCfg.dot}`} />
              {pCfg.label} Priority
            </div>
          </div>
        </div>

        {/* Pipeline progress */}
        {!isClosed && (
          <div className="mt-5 pt-5 border-t border-[#1e2a3a]">
            <div className="text-xs text-slate-500 mb-3">Deal Stage</div>
            <div className="flex items-center gap-0">
              {DEAL_STAGES.filter((s) => s !== "closed_won").map((stage, i) => {
                const sCfg = dealStatusConfig[stage as keyof typeof dealStatusConfig];
                const isActive = stage === deal.status;
                const isPast = i < stageIndex;
                return (
                  <div key={stage} className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-2.5 h-2.5 rounded-full border-2 shrink-0 ${
                          isActive
                            ? "border-blue-400 bg-blue-400"
                            : isPast
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-slate-700 bg-transparent"
                        }`}
                      />
                      <div className={`text-[9px] mt-1 text-center whitespace-nowrap ${isActive ? "text-blue-400" : isPast ? "text-emerald-500" : "text-slate-600"}`}>
                        {sCfg.label}
                      </div>
                    </div>
                    {i < DEAL_STAGES.filter((s) => s !== "closed_won").length - 1 && (
                      <div className={`h-px flex-1 mx-1 ${isPast ? "bg-emerald-700" : "bg-[#1e2a3a]"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {isClosed && (
          <div className={`mt-4 pt-4 border-t border-[#1e2a3a] text-sm font-medium ${deal.status === "closed_won" ? "text-emerald-400" : "text-red-400"}`}>
            {deal.status === "closed_won"
              ? `Deal closed successfully${deal.closedAt ? ` on ${deal.closedAt}` : ""}`
              : deal.status === "closed_lost"
              ? `Deal closed (lost)${deal.closedAt ? ` on ${deal.closedAt}` : ""}`
              : "Deal on hold"}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Parties */}
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Deal Parties</h2>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-slate-500 mb-1.5">Target</div>
              {target ? (
                <Link href={`/companies/${target.id}`} className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/30 border border-blue-800/50 flex items-center justify-center">
                    <Building2 size={13} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200 group-hover:text-blue-300 transition-colors">
                      {target.name}
                    </div>
                    <div className="text-xs text-slate-500">{target.sector} · {target.hq}</div>
                  </div>
                </Link>
              ) : (
                <span className="text-slate-500 text-sm">Unknown target</span>
              )}
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1.5">Buyer / Investor</div>
              {buyer ? (
                <Link href={`/companies/${buyer.id}`} className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg bg-violet-900/30 border border-violet-800/50 flex items-center justify-center">
                    <Building2 size={13} className="text-violet-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200 group-hover:text-blue-300 transition-colors">
                      {buyer.name}
                    </div>
                    <div className="text-xs text-slate-500">{buyer.sector} · {buyer.hq}</div>
                  </div>
                </Link>
              ) : (
                <span className="text-slate-500 text-sm">Not assigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Financials */}
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Deal Metrics</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div className="col-span-2">
              <div className="text-xs text-slate-500 mb-0.5">Enterprise Value (Est.)</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(deal.estimatedEV)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Revenue (Est.)</div>
              <div className="text-base font-semibold text-slate-200">{formatCurrency(deal.estimatedRevenue)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-0.5">EBITDA (Est.)</div>
              <div className="text-base font-semibold text-slate-200">{formatCurrency(deal.estimatedEbitda)}</div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={12} className="text-slate-500" />
              <div>
                <div className="text-xs text-slate-500">EV / Revenue</div>
                <div className="text-sm font-semibold text-slate-200">{formatMultiple(deal.evRevMultiple)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={12} className="text-slate-500" />
              <div>
                <div className="text-xs text-slate-500">EV / EBITDA</div>
                <div className="text-sm font-semibold text-slate-200">{formatMultiple(deal.evEbitdaMultiple)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {deal.notes && (
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5 mb-4">
          <h2 className="text-sm font-semibold text-white mb-2">Notes</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{deal.notes}</p>
        </div>
      )}

      {/* Meta */}
      <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Record Info</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-slate-500 mb-1 flex items-center gap-1"><Calendar size={11} /> Created</div>
            <div className="text-slate-300">{deal.createdAt}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1 flex items-center gap-1"><Calendar size={11} /> Updated</div>
            <div className="text-slate-300">{deal.updatedAt}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1 flex items-center gap-1"><Tag size={11} /> Source</div>
            <div className="text-slate-300">{deal.source ?? "—"}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Confidence</div>
            <div className={confCfg.color}>{confCfg.label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
