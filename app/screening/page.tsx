import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import {
  Search,
  Filter,
  TrendingUp,
  Activity,
  AlertCircle,
  Zap,
  Globe,
  BarChart3,
} from "lucide-react";

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
