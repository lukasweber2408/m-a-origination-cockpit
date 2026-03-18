"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Company } from "@/lib/types";
import {
  companyStatusConfig,
  priorityConfig,
  formatCurrency,
  cn,
} from "@/lib/utils";
import Badge from "@/components/Badge";
import ScoreBar from "@/components/ScoreBar";
import SearchBar from "@/components/SearchBar";
import { Download, ChevronUp, ChevronDown, Bookmark, ArrowUpDown } from "lucide-react";
import { exportCompaniesToCSV } from "@/lib/csv";

interface CompaniesTableProps {
  companies: Company[];
  showType?: boolean;
}

type SortField = "name" | "sector" | "hq" | "revenue" | "ebitda" | "priorityScore" | "status";
type SortDir = "asc" | "desc";

export default function CompaniesTable({ companies, showType = false }: CompaniesTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("priorityScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sectors = useMemo(
    () => ["all", ...Array.from(new Set(companies.map((c) => c.sector))).sort()],
    [companies]
  );

  const filtered = useMemo(() => {
    let rows = companies;
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.sector.toLowerCase().includes(q) ||
          c.hq.toLowerCase().includes(q) ||
          (c.description ?? "").toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") rows = rows.filter((c) => c.status === statusFilter);
    if (priorityFilter !== "all") rows = rows.filter((c) => c.priority === priorityFilter);
    if (sectorFilter !== "all") rows = rows.filter((c) => c.sector === sectorFilter);

    return rows.sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;
      if (sortField === "name") { av = a.name; bv = b.name; }
      else if (sortField === "sector") { av = a.sector; bv = b.sector; }
      else if (sortField === "hq") { av = a.hq; bv = b.hq; }
      else if (sortField === "revenue") { av = a.revenue ?? -1; bv = b.revenue ?? -1; }
      else if (sortField === "ebitda") { av = a.ebitda ?? -1; bv = b.ebitda ?? -1; }
      else if (sortField === "priorityScore") { av = a.priorityScore; bv = b.priorityScore; }
      else if (sortField === "status") { av = a.status; bv = b.status; }
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [companies, search, statusFilter, priorityFilter, sectorFilter, sortField, sortDir]);

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
        <SearchBar value={search} onChange={setSearch} placeholder="Search companies…" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="in_discussion">In Discussion</option>
          <option value="outreach_pending">Outreach Pending</option>
          <option value="watchlist">Watchlist</option>
          <option value="passed">Passed</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className={selectClass}>
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} className={selectClass}>
          {sectors.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All sectors" : s}</option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-600">{filtered.length} records</span>
          <button
            onClick={() => exportCompaniesToCSV(filtered)}
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
                  { label: "Company", field: "name" as SortField },
                  { label: "Sector", field: "sector" as SortField },
                  { label: "HQ", field: "hq" as SortField },
                  { label: "Revenue", field: "revenue" as SortField },
                  { label: "EBITDA", field: "ebitda" as SortField },
                  { label: "Status", field: "status" as SortField },
                  { label: "Priority", field: "priorityScore" as SortField },
                  { label: "Score", field: "priorityScore" as SortField },
                ].map((col) => (
                  <th
                    key={col.label}
                    onClick={() => toggleSort(col.field)}
                    className="text-left px-4 py-3 text-slate-500 font-medium cursor-pointer hover:text-slate-300 whitespace-nowrap select-none"
                  >
                    <span className="flex items-center gap-1">
                      {col.label} <SortIcon field={col.field} />
                    </span>
                  </th>
                ))}
                {showType && (
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Type</th>
                )}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2a3a]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-600">
                    No companies match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((co) => {
                  const statusCfg = companyStatusConfig[co.status];
                  const pCfg = priorityConfig[co.priority];
                  return (
                    <tr key={co.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/companies/${co.id}`} className="hover:text-blue-300 transition-colors">
                          <div className="font-medium text-slate-200">{co.name}</div>
                          {co.description && (
                            <div className="text-slate-600 mt-0.5 max-w-xs truncate">{co.description}</div>
                          )}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{co.sector}</td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{co.hq}, {co.country}</td>
                      <td className="px-4 py-3 text-slate-300 tabular-nums whitespace-nowrap">{formatCurrency(co.revenue)}</td>
                      <td className="px-4 py-3 text-slate-300 tabular-nums whitespace-nowrap">{formatCurrency(co.ebitda)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge label={statusCfg.label} color={statusCfg.color} bg={statusCfg.bg} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />
                          <span className={pCfg.color}>{pCfg.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <ScoreBar score={co.priorityScore} />
                      </td>
                      {showType && (
                        <td className="px-4 py-3 text-slate-500 capitalize">{co.type}</td>
                      )}
                      <td className="px-4 py-3">
                        {co.watchlisted && (
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
