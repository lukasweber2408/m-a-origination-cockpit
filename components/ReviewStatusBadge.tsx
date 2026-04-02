import { ReviewStatus } from "@/lib/schema";

interface Props {
  status: ReviewStatus;
}

const config: Record<ReviewStatus, { label: string; color: string; bg: string }> = {
  reviewed: {
    label: "Reviewed",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
  },
  needs_validation: {
    label: "Needs Validation",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
  },
  low_confidence: {
    label: "Low Confidence",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/30",
  },
  flagged: {
    label: "Flagged",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
  },
  incomplete: {
    label: "Incomplete",
    color: "text-slate-400",
    bg: "bg-slate-500/10 border-slate-500/30",
  },
};

export default function ReviewStatusBadge({ status }: Props) {
  const { label, color, bg } = config[status];
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-medium ${color} ${bg}`}
    >
      {label}
    </span>
  );
}
