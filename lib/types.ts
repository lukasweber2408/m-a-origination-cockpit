export type CompanyType = "target" | "buyer" | "investor";

export type DealStatus =
  | "screening"
  | "first_contact"
  | "nda_signed"
  | "loi_submitted"
  | "due_diligence"
  | "negotiation"
  | "closed_won"
  | "closed_lost"
  | "on_hold";

export type CompanyStatus =
  | "active"
  | "watchlist"
  | "passed"
  | "outreach_pending"
  | "in_discussion";

export type Priority = "high" | "medium" | "low";

export type ConfidenceLevel = "confirmed" | "likely" | "rumor" | "speculative";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  companyId: string;
  isPrimary: boolean;
}

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  sector: string;
  subsector?: string;
  hq: string;
  country: string;
  revenue?: number; // in $M
  ebitda?: number; // in $M
  employees?: number;
  website?: string;
  status: CompanyStatus;
  priority: Priority;
  priorityScore: number; // 1-100
  description?: string;
  notes?: string;
  tags: string[]; // tag IDs
  contacts: string[]; // contact IDs
  watchlisted: boolean;
  createdAt: string;
  updatedAt: string;
  ownershipType?: string; // e.g. "PE-backed", "Family-owned", "Public"
  founded?: number;
  source?: string;
}

export interface Deal {
  id: string;
  name: string;
  targetId: string;
  buyerId?: string;
  status: DealStatus;
  priority: Priority;
  priorityScore: number; // 1-100
  evRevMultiple?: number;
  evEbitdaMultiple?: number;
  estimatedEV?: number; // in $M
  estimatedRevenue?: number; // in $M
  estimatedEbitda?: number; // in $M
  sector: string;
  dealType: string; // "acquisition", "merger", "minority stake", etc.
  notes?: string;
  source?: string;
  confidence: ConfidenceLevel;
  watchlisted: boolean;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}
