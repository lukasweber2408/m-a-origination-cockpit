// ============================================================
// German Financial Services Origination Database – Core Schema
// All amounts in EUR. Revenue/EBITDA in €M. AUM in €B.
// ============================================================

export type SectorType =
  | "Banking"
  | "Payments"
  | "Asset Management"
  | "Wealth Management";

// ── Banking subsectors ──────────────────────────────────────
export type BankingSubsector =
  | "Universal Bank"
  | "Private Bank"
  | "Regional Bank"
  | "Specialized Bank"
  | "Landesbank"
  | "Savings Bank"
  | "Cooperative Bank"
  | "Consumer Finance"
  | "Captive / Automotive Finance"
  | "Building Society"
  | "Direct Bank"
  | "Securities / Custody / Clearing";

// ── Payments subsectors ─────────────────────────────────────
export type PaymentsSubsector =
  | "Payment Service Provider"
  | "Acquirer"
  | "Issuer Processor"
  | "Embedded Payments / BaaS"
  | "Merchant Solutions"
  | "BNPL / Invoice Finance"
  | "Open Banking / A2A"
  | "Closed-Loop / Campus Payments"
  | "Digital Wallet / E-Money"
  | "B2B Spend Management"
  | "Online Brokerage / Securities Platform";

// ── Asset Management subsectors ─────────────────────────────
export type AssetManagementSubsector =
  | "Independent Asset Manager"
  | "Fund Boutique / KVG"
  | "Insurance Asset Manager"
  | "Institutional Multi-Asset"
  | "Private Debt Manager"
  | "Infrastructure Manager"
  | "Real Estate Asset Manager"
  | "Alternative Asset Manager"
  | "Fund Administration / Master-KVG"
  | "Quantitative / Systematic Manager"
  | "Fixed Income Specialist";

// ── Wealth Management subsectors ────────────────────────────
export type WealthManagementSubsector =
  | "Independent Wealth Manager"
  | "Vermögensverwalter"
  | "Multi-Family Office"
  | "Robo-Advisor / Digital Wealth"
  | "Private Wealth Advisory"
  | "Hybrid Wealth / Asset Management"
  | "IFA / Financial Advisory Network"
  | "IFA Custody Platform";

export type SubsectorType =
  | BankingSubsector
  | PaymentsSubsector
  | AssetManagementSubsector
  | WealthManagementSubsector;

// ── Ownership ───────────────────────────────────────────────
export type OwnershipType =
  | "founder-owned"
  | "partner-owned"
  | "family-owned"
  | "listed"
  | "PE-backed"
  | "VC-backed"
  | "cooperative"
  | "public-sector"
  | "subsidiary-domestic"
  | "subsidiary-foreign"
  | "JV"
  | "other";

// ── Size ────────────────────────────────────────────────────
export type SizeBucket = "nano" | "micro" | "small" | "mid" | "large" | "mega";
// nano  < €10M rev / <€500M AUM
// micro €10-50M rev / €0.5-5B AUM
// small €50-200M rev / €5-20B AUM
// mid   €200M-1B rev / €20-100B AUM
// large €1-10B rev / €100-500B AUM
// mega  >€10B rev / >€500B AUM

// ── Review & confidence ─────────────────────────────────────
export type ReviewStatus =
  | "reviewed"         // data verified, all key fields present
  | "needs_validation" // key fields present but require cross-check
  | "low_confidence"   // limited public data, inferred figures
  | "flagged"          // regulatory issue, ownership change, or known problem
  | "incomplete";      // missing mandatory fields

// ── Origination scoring ─────────────────────────────────────
export interface OriginationScore {
  /** 1-10: fit with typical M&A origination criteria (standalone, right market) */
  strategic_fit: number;
  /** 1-10: size fit for mid-market M&A sweet spot */
  scale: number;
  /** 1-10: ownership conducive to a deal (founder, PE, spin-off potential) */
  ownership_relevance: number;
  /** 1-10: succession or exit catalyst present */
  succession: number;
  /** 1-10: consolidation pressure in segment */
  consolidation: number;
  /** 1-10: derived from confidence_score / 10 */
  info_confidence: number;
  /** 1-100: weighted composite, computed by computeOriginationScore() */
  total: number;
}

// ── Main entity ─────────────────────────────────────────────
export interface CompanyTarget {
  // Identity
  id: string;                  // e.g. "de-b01"
  name: string;
  legalName?: string;          // full legal name if different from trading name
  website: string;
  hqCity: string;
  hqState?: string;            // Bundesland
  country: string;             // "Germany" for all entries in scope
  sector: SectorType;
  subsector: SubsectorType;
  businessModel?: string;      // one-line business model summary
  description: string;         // 1-3 sentence public description

  // Ownership / strategic context
  ownershipType: OwnershipType;
  standaloneOrGroup: "standalone" | "group-member";
  parentCompany?: string;
  strategicRelevance?: string; // why this company matters for origination

  // Size / scale indicators (all approximate, sourced from public data)
  estimatedRevenue?: number;   // €M (FY2022/23 approximate)
  estimatedEbitda?: number;    // €M
  aum?: number;                // €B assets under management (AM/WM only)
  employeeCount?: number;
  sizeBucket: SizeBucket;
  publicOrPrivate: "public" | "private";

  // Regulatory
  regulatoryStatus?: string;
  licenseType?: string;        // BaFin license type where known

  // M&A / origination context
  targetRelevanceNotes?: string;
  successionRelevance?: string;
  consolidationRelevance?: string;
  marketPositionNotes?: string;

  // Research traceability
  primarySourceUrl: string;
  secondarySourceUrl?: string;
  sourceType: string;          // "official website", "annual report", "press release", etc.
  lastReviewed: string;        // ISO date

  // Data quality
  confidenceScore: number;     // 1-100
  reviewStatus: ReviewStatus;
  notes?: string;

  // Scoring
  scoring: OriginationScore;

  // UI / compatibility
  founded?: number;
  watchlisted: boolean;
  tags: string[];
}

// ── Buyer entity (simplified) ────────────────────────────────
export interface BuyerProfile {
  id: string;
  name: string;
  website: string;
  hqCity: string;
  country: string;
  buyerType: "PE" | "Strategic" | "Family Office" | "VC" | "Listed Co";
  sectorFocus: SectorType[];
  subsectorFocus?: string[];
  ticketSizeMin?: number;      // €M EV
  ticketSizeMax?: number;      // €M EV
  geographicFocus: string[];
  description: string;
  strategicRationale?: string;
  aum?: number;                // €B (for PE/VC funds)
  sourceUrl?: string;
  confidenceScore: number;
}

// ── Review queue item ────────────────────────────────────────
export interface ReviewQueueItem {
  company: CompanyTarget;
  issues: string[];
  priority: "high" | "medium" | "low";
}
