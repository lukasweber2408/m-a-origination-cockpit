interface Props {
  score: number; // 1-100
  size?: "sm" | "xs";
}

export default function ConfidenceBadge({ score, size = "sm" }: Props) {
  const color =
    score >= 85
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
      : score >= 70
      ? "text-blue-400 bg-blue-500/10 border-blue-500/30"
      : score >= 55
      ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
      : "text-red-400 bg-red-500/10 border-red-500/30";

  const label =
    score >= 85 ? "High" : score >= 70 ? "Medium" : score >= 55 ? "Low" : "Very Low";

  const textSize = size === "xs" ? "text-[10px]" : "text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border ${textSize} font-medium ${color}`}
    >
      <span className="tabular-nums">{score}</span>
      <span className="opacity-70">/ {label}</span>
    </span>
  );
}
