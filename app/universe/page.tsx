"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { targets } from "@/lib/targets";
import { CompanyTarget, SectorType, OwnershipType, SizeBucket } from "@/lib/schema";
import { scoreToBand, scoreBandColor } from "@/lib/scoring";
import SectorBadge from "@/components/SectorBadge";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import ReviewStatusBadge from "@/components/ReviewStatusBadge";
import SearchBar from "@/components/SearchBar";
import { Download, ChevronUp, ChevronDown, ArrowUpDown, ExternalLink } from "lucide-react";

const SECTORS: SectorType[] = ["Banking", "Payments", "Asset Management", "Wealth Management"];
const OWNERSHIPS: OwnershipType[] = [
  "founder-owned", "partner-owned", "family-owned", "listed", "PE-backed", "VC-backed",
  "cooperative", "public-sector", "subsidiary-domestic", "subsidiary-foreign", "JV",
];
const SIZE_BUCKETS: SizeBucket[] = ["nano", "micro", "small", "mid", "large", "mega"];

type SortField = "name" | "sector" | "hqCity" | "score" | "confidence" | "sizeBucket";
type SortDir = "asc" | "desc";

export default function UniversePage() {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState<SectorType | "all">("all");
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipType | "all">("all");
  const [sizeFilter, setSizeFilter] = useState<SizeBucket | "all">("all");
  const [reviewFilter, setReviewFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const subsectors = useMemo(() => {
    const set = new Set(targets.map((t) => t.subsector));
    return ["all", ...Array.from(set).sort()];
  }, []);
  const [subsectorFilter, setSubsectorFilter] = useState("all");

  const filtered = useMemo(() => {
    let rows = targets as CompanyTarget[];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.hqCity.toLowerCase().includes(q) ||
          t.subsector.toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q)
      );
    }
    if (sectorFilter !== "all") rows = rows.filter((t) => t.sector === sectorFilter);
    if (ownershipFilter !== "all") rows = rows.filter((t) => t.ownershipType === ownershipFilter);
    if (sizeFilter !== "all") rows = rows.filter((t) => t.sizeBucket === sizeFilter);
    if (reviewFilter !== "all") rows = rows.filter((t) => t.reviewStatus === reviewFilter);
    if (subsectorFilter !== "all") rows = rows.filter((t) => t.subsector === subsectorFilter);

    return rows.sort((a, b) => {
      let av: number | string = 0, bv: number | string = 0;
      if (sortField === "name") { av = a.name; bv = b.name; }
      else if (sortField === "sector") { av = a.sector; bv = b.sector; }
      else if (sortField === "hqCity") { av = a.hqCity; bv = b.hqCity; }
      else if (sortField === "score") { av = a.scoring.total; bv = b.scoring.total; }
      else if (sortField === "confidence") { av = a.confidenceScore; bv = b.confidenceScore; }
      else if (sortField === "sizeBucket") {
        const order = ["nano", "micro", "small", "mid", "large", "mega"];
        av = order.indexOf(a.sizeBucket); bv = order.indexOf(b.sizeBucket);
      }
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [targets, search, sectorFilter, subsectorFilter, ownershipFilter, sizeFilter, reviewFilter, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown size={11} className="text-slate-600" />;
    return sortDir === "asc" ? <ChevronUp size={11} className="text-blue-400" /> : <ChevronDown size={11} className="text-blue-400" />;
  }

  const selectClass = "bg-[#111827] border border-[#1e2a3a] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500/60";

  function exportCSV() {
    const header = ["id","name","sector","subsector","hqCity","hqState","ownershipType","sizeBucket","publicOrPrivate","aum_B","employees","regulatoryStatus","confidenceScore","reviewStatus","score","primarySourceUrl"].join(",");
    const rows = filtered.map((t) =>
      [t.id, `"${t.name}"`, t.sector, `"${t.subsector}"`, t.hqCity, t.hqState ?? "", t.ownershipType, t.sizeBucket, t.publicOrPrivate, t.aum ?? "", t.employeeCount ?? "", `"${t.regulatoryStatus ?? ""}"`, t.confidenceScore, t.reviewStatus, t.scoring.total, t.primarySourceUrl].join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "german-finserv-targets.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-white">Target Universe</h1>
        <p className="text-slate-500 text-xs mt-1">
          {targets.length} German Financial Services companies · public data only
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search name, city, subsector…" />
        <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value as SectorType | "all")} className={selectClass}>
          <option value="all">All sectors</option>
          {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={subsectorFilter} onChange={(e) => setSubsectorFilter(e.target.value)} className={selectClass}>
          {subsectors.map((s) => <option key={s} value={s}>{s === "all" ? "All subsectors" : s}</option>)}
        </select>
        <select value={ownershipFilter} onChange={(e) => setOwnershipFilter(e.target.value as OwnershipType | "all")} className={selectClass}>
          <option value="all">All ownership</option>
          {OWNERSHIPS.map((o) => <option key={o} value={o}>{o.replace(/-/g, " ")}</option>)}
        </select>
        <select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value as SizeBucket | "all")} className={selectClass}>
          <option value="all">All sizes</option>
          {SIZE_BUCKETS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value)} className={selectClass}>
          <option value="all">All statuses</option>
          <option value="reviewed">Reviewed</option>
          <option value="needs_validation">Needs Validation</option>
          <option value="low_confidence">Low Confidence</option>
          <option value="flagged">Flagged</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-600">{filtered.length} records</span>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] border border-[#1e2a3a] rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition">
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
                  { label: "Subsector", field: undefined },
                  { label: "HQ City", field: "hqCity" as SortField },
                  { label: "Ownership", field: undefined },
                  { label: "Size", field: "sizeBucket" as SortField },
                  { label: "AUM / Rev", field: undefined },
                  { label: "Confidence", field: "confidence" as SortField },
                  { label: "Review", field: undefined },
                  { label: "Score", field: "score" as SortField },
                ].map((col) => (
                  <th
                    key={col.label}
                    onClick={col.field ? () => toggleSort(col.field!) : undefined}
                    className={`text-left px-4 py-3 text-slate-500 font-medium whitespace-nowrap select-none ${col.field ? "cursor-pointer hover:text-slate-300" : ""}`}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.field && <SortIcon field={col.field} />}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-slate-500 font-medium">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2a3a]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-10 text-slate-600">
                    No companies match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const band = scoreToBand(t.scoring.total);
                  const bandColor = scoreBandColor(band);
                  return (
                    <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/companies/${t.id}`} className="hover:text-blue-300 transition-colors">
                          <div className="font-medium text-slate-200 max-w-[200px] truncate">{t.name}</div>
                          <div className="text-slate-600 mt-0.5 max-w-[200px] truncate text-[10px]">{t.description?.slice(0, 70)}{(t.description?.length ?? 0) > 70 ? "…" : ""}</div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <SectorBadge sector={t.sector} size="xs" />
                      </td>
                      <td className="px-4 py-3 text-slate-400 max-w-[160px]">
                        <span className="truncate block">{t.subsector}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{t.hqCity}</td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap capitalize">
                        {t.ownershipType.replace(/-/g, " ")}
                      </td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap capitalize">{t.sizeBucket}</td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap tabular-nums">
                        {t.aum !== undefined
                          ? `€${t.aum >= 100 ? `${Math.round(t.aum)}B AUM` : `${t.aum}B AUM`}`
                          : t.estimatedRevenue !== undefined
                          ? `~€${t.estimatedRevenue >= 1000 ? `${(t.estimatedRevenue / 1000).toFixed(1)}B` : `${t.estimatedRevenue}M`} rev`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <ConfidenceBadge score={t.confidenceScore} size="xs" />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <ReviewStatusBadge status={t.reviewStatus} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold tabular-nums ${bandColor}`}>
                            {t.scoring.total}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <a
                          href={t.primarySourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-blue-400 transition-colors"
                        >
                          <ExternalLink size={12} />
                        </a>
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
