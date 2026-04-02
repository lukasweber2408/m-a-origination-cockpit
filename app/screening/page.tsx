"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { targets } from "@/lib/targets";
import { SectorType, OwnershipType } from "@/lib/schema";
import { scoreToBand, scoreBandColor } from "@/lib/scoring";
import SectorBadge from "@/components/SectorBadge";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import ReviewStatusBadge from "@/components/ReviewStatusBadge";
import SearchBar from "@/components/SearchBar";
import {
  SlidersHorizontal,
  TrendingUp,
  AlertCircle,
  Zap,
} from "lucide-react";

const SAVED_SCREENS = [
  {
    id: "founder-wm",
    label: "Founder-owned Wealth Managers",
    desc: "Independent WM boutiques with succession catalyst",
    sector: "Wealth Management" as SectorType,
    ownership: "founder-owned" as OwnershipType,
  },
  {
    id: "pe-backed",
    label: "PE-backed Targets",
    desc: "PE-owned companies — possible secondary buyout or exit",
    sector: null,
    ownership: "PE-backed" as OwnershipType,
  },
  {
    id: "founder-payments",
    label: "Founder-led Payments",
    desc: "Founder-led payment companies suited to M&A",
    sector: "Payments" as SectorType,
    ownership: "founder-owned" as OwnershipType,
  },
  {
    id: "subscale-am",
    label: "Subscale Asset Managers",
    desc: "Nano/micro AM boutiques under AUM pressure",
    sector: "Asset Management" as SectorType,
    ownership: null,
  },
  {
    id: "pe-payments",
    label: "PE-relevant Payments Platforms",
    desc: "VC/PE-backed payments companies with exit optionality",
    sector: "Payments" as SectorType,
    ownership: "VC-backed" as OwnershipType,
  },
];

function ScreeningContent() {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState<SectorType | "all">("all");
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipType | "all">("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [publicFilter, setPublicFilter] = useState<"all" | "public" | "private">("all");
  const [reviewFilter, setReviewFilter] = useState("all");
  const [minScore, setMinScore] = useState(0);
  const [activeScreen, setActiveScreen] = useState<string | null>(null);

  const cities = useMemo(
    () => ["all", ...Array.from(new Set(targets.map((t) => t.hqCity))).sort()],
    []
  );

  function applyScreen(s: typeof SAVED_SCREENS[0]) {
    setActiveScreen(s.id);
    setSectorFilter(s.sector ?? "all");
    setOwnershipFilter(s.ownership ?? "all");
    setCityFilter("all");
    setSizeFilter("all");
    setPublicFilter("all");
    setReviewFilter("all");
    setSearch("");
    setMinScore(0);
  }

  function clearFilters() {
    setActiveScreen(null);
    setSectorFilter("all");
    setOwnershipFilter("all");
    setCityFilter("all");
    setSizeFilter("all");
    setPublicFilter("all");
    setReviewFilter("all");
    setSearch("");
    setMinScore(0);
  }

  const filtered = useMemo(() => {
    let rows = [...targets];
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
    if (cityFilter !== "all") rows = rows.filter((t) => t.hqCity === cityFilter);
    if (sizeFilter !== "all") rows = rows.filter((t) => t.sizeBucket === sizeFilter);
    if (publicFilter !== "all") rows = rows.filter((t) => t.publicOrPrivate === publicFilter);
    if (reviewFilter !== "all") rows = rows.filter((t) => t.reviewStatus === reviewFilter);
    if (minScore > 0) rows = rows.filter((t) => t.scoring.total >= minScore);
    return rows.sort((a, b) => b.scoring.total - a.scoring.total);
  }, [search, sectorFilter, ownershipFilter, cityFilter, sizeFilter, publicFilter, reviewFilter, minScore]);

  const sel = "bg-[#111827] border border-[#1e2a3a] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500/60 w-full";

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-white">Screening Workspace</h1>
        <p className="text-slate-500 text-xs mt-1">
          Filter and prioritise the German FinServ target universe · {targets.length} companies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-4">
            <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <SlidersHorizontal size={12} /> Saved Screens
            </div>
            <div className="space-y-1.5">
              {SAVED_SCREENS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => applyScreen(s)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors ${
                    activeScreen === s.id
                      ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <div className="font-medium">{s.label}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={clearFilters} className="mt-3 w-full text-[10px] text-slate-600 hover:text-slate-400 transition-colors">
              Clear all filters
            </button>
          </div>

          <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-4 space-y-3">
            <div className="text-xs font-semibold text-slate-400">Filters</div>
            <div>
              <label className="text-[10px] text-slate-600 block mb-1">Search</label>
              <SearchBar value={search} onChange={setSearch} placeholder="Name, city, subsector…" />
            </div>
            <div>
              <label className="text-[10px] text-slate-600 block mb-1">Sector</label>
              <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value as SectorType | "all")} className={sel}>
                <option value="all">All sectors</option>
                {(["Banking", "Payments", "Asset Management", "Wealth Management"] as SectorType[]).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-600 block mb-1">City</label>
              <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className={sel}>
                {cities.map((c) => <option key={c} value={c}>{c === "all" ? "All cities" : c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-600 block mb-1">Ownership</label>
              <select value={ownershipFilter} onChange={(e) => setOwnershipFilter(e.target.value as OwnershipType | "all")} className={sel}>
                <option value="all">All ownership</option>
                {(["founder-owned","partner-owned","family-owned","listed","PE-backed","VC-backed","cooperative","public-sector","subsidiary-domestic","subsidiary-foreign","JV"] as OwnershipType[]).map((o) => (
                  <option key={o} value={o}>{o.replace(/-/g," ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-600 block mb-1">Size</label>
              <select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)} className={sel}>
                <option value="all">All sizes</option>
                {["nano","micro","small","mid","large","mega"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-600 block mb-1">Public / Private</label>
              <select value={publicFilter} onChange={(e) => setPublicFilter(e.target.value as "all"|"public"|"private")} className={sel}>
                <option value="all">All</option>
                <option value="public">Public (listed)</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-600 block mb-1">Review Status</label>
              <select value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value)} className={sel}>
                <option value="all">All</option>
                <option value="reviewed">Reviewed</option>
                <option value="needs_validation">Needs Validation</option>
                <option value="low_confidence">Low Confidence</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-600 block mb-1">Min Priority Score: {minScore}+</label>
              <input type="range" min={0} max={90} step={5} value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">{filtered.length} companies · by priority score</span>
          </div>
          <div className="space-y-2">
            {filtered.map((t) => {
              const band = scoreToBand(t.scoring.total);
              const bandColor = scoreBandColor(band);
              return (
                <Link key={t.id} href={`/companies/${t.id}`} className="block bg-[#111827] border border-[#1e2a3a] rounded-xl p-4 hover:border-slate-600 transition-colors group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-white">{t.name}</span>
                        <SectorBadge sector={t.sector} size="xs" />
                        <ReviewStatusBadge status={t.reviewStatus} />
                      </div>
                      <div className="text-[11px] text-slate-500">{t.subsector} · {t.hqCity} · {t.ownershipType.replace(/-/g," ")} · {t.sizeBucket}</div>
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">{t.description}</div>
                      {t.targetRelevanceNotes && (
                        <div className="text-[10px] text-slate-600 mt-1 italic">{t.targetRelevanceNotes}</div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-2xl font-bold tabular-nums ${bandColor}`}>{t.scoring.total}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">{band}</div>
                      <div className="mt-1"><ConfidenceBadge score={t.confidenceScore} size="xs" /></div>
                    </div>
                  </div>
                </Link>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-600">No companies match the current filters.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ScreeningContent is used internally below

const SCREENING_CARDS = [
  {
    id: "s1",
    name: "DACH B2B SaaS, €5–30M Revenue",
    description:
      "Systematic scan of German, Austrian and Swiss B2B SaaS companies with ARR between €5M and €30M. Filters: recurring revenue >70%, EBITDA margin >15%, founder-led or PE-backed.",
    sector: "Technology",
    geography: "DACH",
    matchCount: 34,
    newThisWeek: 3,
    status: "active",
    lastRun: "2026-03-17",
    criteria: ["B2B SaaS", "€5–30M Revenue", "Founder-led or PE-backed", "EBITDA >15%"],
  },
  {
    id: "s2",
    name: "European HealthTech Platforms",
    description:
      "Tracking digital health, clinical workflow, and patient engagement platforms across EU. Prioritize companies with hospital network integrations and sticky SaaS contracts.",
    sector: "Healthcare",
    geography: "Europe",
    matchCount: 21,
    newThisWeek: 1,
    status: "active",
    lastRun: "2026-03-15",
    criteria: ["HealthTech / MedTech", "Clinical SaaS", "Hospital integrations", "Series A–B"],
  },
  {
    id: "s3",
    name: "Nordic Logistics Tech, Bootstrapped",
    description:
      "Bootstrapped or family-owned freight and supply chain software companies in Scandinavia and the Baltics. Target EV €10–60M range.",
    sector: "Logistics",
    geography: "Nordics & Baltics",
    matchCount: 12,
    newThisWeek: 0,
    status: "active",
    lastRun: "2026-03-10",
    criteria: ["Freight Tech", "Bootstrapped", "EV €10–60M", "EBITDA profitable"],
  },
  {
    id: "s4",
    name: "CEE FinTech — Payments & Banking",
    description:
      "Central and Eastern European fintech companies focused on B2B payments, embedded finance, or neo-banking infrastructure. Recurring revenue model preferred.",
    sector: "Financial Services",
    geography: "CEE",
    matchCount: 18,
    newThisWeek: 2,
    status: "active",
    lastRun: "2026-03-16",
    criteria: ["Payments / FinTech", "B2B focus", "Recurring revenue", "CEE geography"],
  },
  {
    id: "s5",
    name: "HRTech Buy-and-Build Targets",
    description:
      "Add-on acquisition candidates for existing HRTech platform. Looking for learning & development, workforce analytics, or recruiting automation tools with enterprise clients.",
    sector: "HRTech",
    geography: "Europe",
    matchCount: 9,
    newThisWeek: 1,
    status: "paused",
    lastRun: "2026-02-28",
    criteria: ["HRTech / L&D", "Enterprise clients", "Add-on sizing", "€2–15M Revenue"],
  },
  {
    id: "s6",
    name: "AgriTech & Climate — Pre-exit",
    description:
      "Watchlist for AgriTech and sustainability software companies approaching Series A/B close or early exit conversations. Track for deal flow entry points.",
    sector: "AgriTech",
    geography: "Europe",
    matchCount: 7,
    newThisWeek: 0,
    status: "monitoring",
    lastRun: "2026-03-05",
    criteria: ["AgriTech / Climate", "Pre-exit stage", "IoT + SaaS", "Series A-B"],
  },
];

const MARKET_SIGNALS = [
  {
    title: "PE dry powder at record €280B in Europe",
    source: "Preqin, Q1 2026",
    type: "market",
    impact: "Upward pressure on SaaS multiples — expect 5–7x revenue for quality assets.",
  },
  {
    title: "3 DACH SaaS exits >€50M in last 60 days",
    source: "Dealroom, March 2026",
    type: "activity",
    impact: "Market active. Sellers aware of demand. Expect tighter processes.",
  },
  {
    title: "HealthTech consolidation accelerating in EU",
    source: "EY M&A Monitor, Feb 2026",
    type: "trend",
    impact: "Hospital software bolt-on demand up 35% YoY. Window is open.",
  },
  {
    title: "Rising interest rates compressing LBO returns",
    source: "BCG, Jan 2026",
    type: "risk",
    impact: "Buyer discipline tightening. Higher EBITDA margins increasingly required.",
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "text-emerald-300", bg: "bg-emerald-900/50" },
  paused: { label: "Paused", color: "text-amber-300", bg: "bg-amber-900/50" },
  monitoring: { label: "Monitoring", color: "text-blue-300", bg: "bg-blue-900/50" },
};

const signalTypeConfig: Record<string, { icon: typeof TrendingUp; color: string }> = {
  market: { icon: BarChart3, color: "text-blue-400" },
  activity: { icon: Activity, color: "text-emerald-400" },
  trend: { icon: TrendingUp, color: "text-violet-400" },
  risk: { icon: AlertCircle, color: "text-amber-400" },
};

export default function ScreeningPage() {
  const totalMatches = SCREENING_CARDS.reduce((s, c) => s + c.matchCount, 0);
  const newThisWeek = SCREENING_CARDS.reduce((s, c) => s + c.newThisWeek, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader
        title="Market Screening"
        subtitle="Automated origination screens and market intelligence"
      />

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-900/20 border border-blue-800/40 rounded-xl p-4 mb-6">
        <Zap size={15} className="text-blue-400 shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-medium text-blue-300">Placeholder logic — MVP mode</div>
          <div className="text-xs text-slate-400 mt-0.5">
            These screens are static demo cards. In production, connect to a data provider (e.g.
            Dealroom, Pitchbook, Crunchbase API) or an internal scraping workflow to auto-populate matches.
            The criteria, match counts, and signals below are illustrative.
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-4">
          <div className="text-xs text-slate-500 mb-1.5">Active Screens</div>
          <div className="text-2xl font-bold text-white">{SCREENING_CARDS.filter((c) => c.status === "active").length}</div>
        </div>
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-4">
          <div className="text-xs text-slate-500 mb-1.5">Total Matches</div>
          <div className="text-2xl font-bold text-white">{totalMatches}</div>
        </div>
        <div className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-4">
          <div className="text-xs text-slate-500 mb-1.5">New This Week</div>
          <div className="text-2xl font-bold text-emerald-400">{newThisWeek}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Screen cards */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={13} className="text-slate-500" />
            <span className="text-sm font-semibold text-white">Origination Screens</span>
          </div>
          <div className="space-y-3">
            {SCREENING_CARDS.map((card) => {
              const sCfg = statusConfig[card.status];
              return (
                <div
                  key={card.id}
                  className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-white">{card.name}</span>
                        <Badge label={sCfg.label} color={sCfg.color} bg={sCfg.bg} />
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {card.sector} · {card.geography} · Last run: {card.lastRun}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold text-white">{card.matchCount}</div>
                      <div className="text-[10px] text-slate-500">matches</div>
                      {card.newThisWeek > 0 && (
                        <div className="text-[10px] text-emerald-400">+{card.newThisWeek} new</div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">{card.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {card.criteria.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] text-slate-400 bg-[#1e2a3a] px-2 py-0.5 rounded"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market signals */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe size={13} className="text-slate-500" />
            <span className="text-sm font-semibold text-white">Market Signals</span>
          </div>
          <div className="space-y-3">
            {MARKET_SIGNALS.map((signal, i) => {
              const tCfg = signalTypeConfig[signal.type];
              return (
                <div
                  key={i}
                  className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <tCfg.icon size={12} className={tCfg.color} />
                    <span className="text-xs font-medium text-slate-200">{signal.title}</span>
                  </div>
                  <div className="text-[10px] text-slate-600 mb-2">{signal.source}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{signal.impact}</div>
                </div>
              );
            })}
          </div>

          {/* Add screen placeholder */}
          <div className="mt-3 bg-[#0d111c] border border-dashed border-[#1e2a3a] rounded-xl p-4 text-center">
            <Search size={18} className="text-slate-700 mx-auto mb-2" />
            <div className="text-xs text-slate-600 font-medium">Add a new screen</div>
            <div className="text-[10px] text-slate-700 mt-1">
              Connect to data provider or define manual criteria
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
