import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DealStatus, CompanyStatus, Priority, ConfidenceLevel } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return "—";
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}B`;
  return `$${value.toFixed(1)}M`;
}

export function formatMultiple(value?: number): string {
  if (value === undefined || value === null) return "—";
  return `${value.toFixed(1)}x`;
}

export const dealStatusConfig: Record<
  DealStatus,
  { label: string; color: string; bg: string }
> = {
  screening: { label: "Screening", color: "text-slate-300", bg: "bg-slate-700" },
  first_contact: { label: "First Contact", color: "text-blue-300", bg: "bg-blue-900/50" },
  nda_signed: { label: "NDA Signed", color: "text-cyan-300", bg: "bg-cyan-900/50" },
  loi_submitted: { label: "LOI Submitted", color: "text-violet-300", bg: "bg-violet-900/50" },
  due_diligence: { label: "Due Diligence", color: "text-amber-300", bg: "bg-amber-900/50" },
  negotiation: { label: "Negotiation", color: "text-orange-300", bg: "bg-orange-900/50" },
  closed_won: { label: "Closed (Won)", color: "text-emerald-300", bg: "bg-emerald-900/50" },
  closed_lost: { label: "Closed (Lost)", color: "text-red-400", bg: "bg-red-900/40" },
  on_hold: { label: "On Hold", color: "text-slate-400", bg: "bg-slate-800" },
};

export const companyStatusConfig: Record<
  CompanyStatus,
  { label: string; color: string; bg: string }
> = {
  active: { label: "Active", color: "text-emerald-300", bg: "bg-emerald-900/50" },
  watchlist: { label: "Watchlist", color: "text-amber-300", bg: "bg-amber-900/50" },
  passed: { label: "Passed", color: "text-red-400", bg: "bg-red-900/40" },
  outreach_pending: { label: "Outreach Pending", color: "text-blue-300", bg: "bg-blue-900/50" },
  in_discussion: { label: "In Discussion", color: "text-violet-300", bg: "bg-violet-900/50" },
};

export const priorityConfig: Record<
  Priority,
  { label: string; color: string; dot: string }
> = {
  high: { label: "High", color: "text-red-400", dot: "bg-red-400" },
  medium: { label: "Medium", color: "text-amber-400", dot: "bg-amber-400" },
  low: { label: "Low", color: "text-slate-400", dot: "bg-slate-500" },
};

export const confidenceConfig: Record<
  ConfidenceLevel,
  { label: string; color: string }
> = {
  confirmed: { label: "Confirmed", color: "text-emerald-400" },
  likely: { label: "Likely", color: "text-blue-400" },
  rumor: { label: "Rumor", color: "text-amber-400" },
  speculative: { label: "Speculative", color: "text-slate-400" },
};
