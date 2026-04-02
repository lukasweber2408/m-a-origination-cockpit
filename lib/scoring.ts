// ============================================================
// Origination Scoring Logic
// Transparent, editable weighting model.
// NOT an objective truth — an internal prioritization aid only.
// ============================================================

import { OriginationScore, OwnershipType, SizeBucket } from "./schema";

// ── Weights (must sum to 1.00) ───────────────────────────────
const WEIGHTS = {
  strategic_fit: 0.20,
  scale: 0.20,
  ownership_relevance: 0.25,
  succession: 0.20,
  consolidation: 0.15,
} as const;

/**
 * Compute the weighted origination priority score.
 * Input components are 1–10 each. Output total is 1–100.
 */
export function computeOriginationScore(
  components: Omit<OriginationScore, "total">
): OriginationScore {
  const raw =
    components.strategic_fit * WEIGHTS.strategic_fit +
    components.scale * WEIGHTS.scale +
    components.ownership_relevance * WEIGHTS.ownership_relevance +
    components.succession * WEIGHTS.succession +
    components.consolidation * WEIGHTS.consolidation;

  // Scale 1–10 weighted average → 1–100 integer
  const total = Math.round(Math.min(100, Math.max(1, raw * 10)));
  return { ...components, total };
}

// ── Heuristic helpers (not used for all records, reference only) ─

/** Map ownership type to a rough ownership_relevance baseline */
export function ownershipBaselineScore(ownershipType: OwnershipType): number {
  const map: Record<OwnershipType, number> = {
    "founder-owned": 9,
    "partner-owned": 8,
    "family-owned": 8,
    "PE-backed": 8,
    "VC-backed": 7,
    "listed": 4,
    "JV": 5,
    "subsidiary-domestic": 3,
    "subsidiary-foreign": 2,
    "cooperative": 1,
    "public-sector": 1,
    "other": 4,
  };
  return map[ownershipType] ?? 5;
}

/** Map size bucket to a scale score (mid-market sweet spot = 10) */
export function sizeBaselineScore(sizeBucket: SizeBucket): number {
  const map: Record<SizeBucket, number> = {
    nano: 2,
    micro: 4,
    small: 7,
    mid: 9,
    large: 5,
    mega: 1,
  };
  return map[sizeBucket] ?? 5;
}

// ── Score interpretation labels ──────────────────────────────
export type PriorityBand = "Very High" | "High" | "Medium" | "Low" | "Monitor";

export function scoreToBand(total: number): PriorityBand {
  if (total >= 75) return "Very High";
  if (total >= 60) return "High";
  if (total >= 45) return "Medium";
  if (total >= 30) return "Low";
  return "Monitor";
}

export function scoreBandColor(band: PriorityBand): string {
  const map: Record<PriorityBand, string> = {
    "Very High": "text-emerald-400",
    "High": "text-blue-400",
    "Medium": "text-amber-400",
    "Low": "text-slate-400",
    "Monitor": "text-slate-600",
  };
  return map[band];
}

export function scoreBandBg(band: PriorityBand): string {
  const map: Record<PriorityBand, string> = {
    "Very High": "bg-emerald-500/10 border-emerald-500/30",
    "High": "bg-blue-500/10 border-blue-500/30",
    "Medium": "bg-amber-500/10 border-amber-500/30",
    "Low": "bg-slate-700/40 border-slate-600/30",
    "Monitor": "bg-slate-800/40 border-slate-700/30",
  };
  return map[band];
}
