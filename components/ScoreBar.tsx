import { cn } from "@/lib/utils";

export default function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 75
      ? "bg-emerald-500"
      : score >= 50
      ? "bg-amber-500"
      : score >= 25
      ? "bg-orange-500"
      : "bg-red-600";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 tabular-nums">{score}</span>
    </div>
  );
}
