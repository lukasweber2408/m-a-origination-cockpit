"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Deal } from "@/lib/types";
import {
  dealStatusConfig,
  priorityConfig,
  confidenceConfig,
  formatCurrency,
  formatMultiple,
} from "@/lib/utils";
import Badge from "@/components/Badge";
import ScoreBar from "@/components/ScoreBar";
import SearchBar from "@/components/SearchBar";
import { Download, ChevronUp, ChevronDown, ArrowUpDown, Bookmark } from "lucide-react";
import { getCompanyById } from "@/lib/data";
import { exportDealsToCSV } from "@/lib/csv";

interface DealsTableProps {
  deals: Deal[];
}

type SortField = "name" | "status" | "sector" | "estimatedEV" | "evEbitdaMultiple" | "priorityScore" | "updatedAt";
type SortDir = "asc" | "desc";

export default function DealsTable({ deals }: DealsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [confidenceFilter, setConfidenceFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("priorityScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sectors = useMemo(
    () => ["all", ...Array.from(new Set(deals.map((d) => d.sector))).sort()],
    [deals]
  );

  const filtered = useMemo(() => {
    let rows = deals;
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.sector.toLowerCase().includes(q) ||
          (d.notes ?? "").toLowerCase().includes(q) ||
          (d.source ?? "").toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") rows = rows.filter((d) => d.status === statusFilter);
    if (priorityFilter !== "all") rows = rows.filter((d) => d.priority === priorityFilter);
    if (confidenceFilter !== "all") rows = rows.filter((d) => d.confidence === confidenceFilter);
    if (sectorFilter !== "all") rows = rows.filter((d) => d.sector === sectorFilter);

    return rows.sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;
      if (sortField === "name") { av = a.name; bv = b.name; }
      else if (sortField === "status") { av = a.status; bv = b.status; }
      else if (sortField === "sector") { av = a.sector; bv = b.sector; }
      else if (sortField === "estimatedEV") { av = a.estimatedEV ?? -1; bv = b.estimatedEV ?? -1; }
      else if (sortField === "evEbitdaMultiple") { av = a.evEbitdaMultiple ?? -1; bv = b.evEbitdaMultiple ?? -1; }
      else if (sortField === "priorityScore") { av = a.priorityScore; bv = b.priorityScore; }
      else if (sortField === "updatedAt") { av = a.updatedAt; bv = b.updatedAt; }
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [deals, search, statusFilter, priorityFilter, confidenceFilter, sectorFilter, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown size={11} className="text-slate-600" />;
    return sortDir === "asc" ? <ChevronUp size={11} className="text-blue-400" /> : <ChevronDown size={11} className="text-blue-400" />;
  }

  const selectClass = "bg-[#111827] border border-[#1e2a3a] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500/60";

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search deals…" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
          <option value="all">All statuses</option>
          <option value="screening">Screening</option>
          <option value="first_contact">First Contact</option>
          <option value="nda_signed">NDA Signed</option>
          <option value="loi_submitted">LOI Submitted</option>
          <option value="due_diligence">Due Diligence</option>
          <option value="negotiation">Negotiation</option>
          <option value="closed_won">Closed (Won)</option>
          <option value="closed_lost">Closed (Lost)</option>
          <option value="on_hold">On Hold</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className={selectClass}>
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select value={confidenceFilter} onChange={(e) => setConfidenceFilter(e.target.value)} className={selectClass}>
          <option value="all">All confidence</option>
          <option value="confirmed">Confirmed</option>
          <option value="likely">Likely</option>
          <option value="rumor">Rumor</option>
          <option value="speculative">Speculative</option>
        </select>
        <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} className={selectClass}>
          {sectors.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All sectors" : s}</option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-600">{filtered.length} records</span>
          <button
            onClick={() => exportDealsToCSV(filtered)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] border border-[#1e2a3a] rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition"
          >
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e2a3a] bg-[#0d111c]">
                {[
                  { label: "Deal", field: "name" as SortField },
                  { label: "Target", field: "name" as SortField },
                  { label: "Buyer", field: "name" as SortField },
                  { label: "Status", field: "status" as SortField },
                  { label: "EV", field: "estimatedEV" as SortField },
                  { label: "EV/EBITDA", field: "evEbitdaMultiple" as SortField },
                  { label: "EV/Rev", field: "estimatedEV" as SortField },
                  { label: "Confidence", field: "name" as SortField },
                  { label: "Source", field: "name" as SortField },
                  { label: "Score", field: "priorityScore" as SortField },
                  { label: "Updated", field: "updatedAt" as SortField },
                ].map((col) => (
                  <th
                    key={col.label}
                    onClick={() =>
                      col.label !== "Target" &&
                      col.label !== "Buyer" &&
                      col.label !== "Confidence" &&
                      col.label !== "Source" &&
                      col.label !== "Deal"
                        ? toggleSort(col.field)
                        : undefined
                    }
                    className="text-left px-4 py-3 text-slate-500 font-medium whitespace-nowrap select-none cursor-default"
                  >
                    <span className="flex items-center gap-1">{col.label}</span>
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2a3a]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-10 text-slate-600">
                    No deals match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((deal) => {
                  const statusCfg = dealStatusConfig[deal.status];
                  const confCfg = confidenceConfig[deal.confidence];
                  const target = getCompanyById(deal.targetId);
                  const buyer = deal.buyerId ? getCompanyById(deal.buyerId) : undefined;
                  return (
                    <tr key={deal.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/deals/${deal.id}`} className="font-medium text-slate-200 hover:text-blue-300 transition-colors whitespace-nowrap">
                          {deal.name}
                        </Link>
                        <div className="text-slate-600 mt-0.5">{deal.dealType}</div>
                      </td>
                      <td className="px-4 py-3">
                        {target ? (
                          <Link href={`/companies/${target.id}`} className="text-slate-400 hover:text-blue-300 transition-colors whitespace-nowrap">
                            {target.name}
                          </Link>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {buyer ? (
                          <Link href={`/companies/${buyer.id}`} className="text-slate-400 hover:text-blue-300 transition-colors whitespace-nowrap">
                            {buyer.name}
                          </Link>
                        ) : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge label={statusCfg.label} color={statusCfg.color} bg={statusCfg.bg} />
                      </td>
                      <td className="px-4 py-3 text-slate-300 tabular-nums whitespace-nowrap">{formatCurrency(deal.estimatedEV)}</td>
                      <td className="px-4 py-3 text-slate-300 tabular-nums whitespace-nowrap">{formatMultiple(deal.evEbitdaMultiple)}</td>
                      <td className="px-4 py-3 text-slate-300 tabular-nums whitespace-nowrap">{formatMultiple(deal.evRevMultiple)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`${confCfg.color}`}>{confCfg.label}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{deal.source ?? "—"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <ScoreBar score={deal.priorityScore} />
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap tabular-nums">{deal.updatedAt}</td>
                      <td className="px-4 py-3">
                        {deal.watchlisted && (
                          <Bookmark size={12} className="text-amber-400 fill-amber-400" />
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
