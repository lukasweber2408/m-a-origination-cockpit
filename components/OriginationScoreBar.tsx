"use client";

import { OriginationScore } from "@/lib/schema";
import { scoreToBand, scoreBandColor } from "@/lib/scoring";

interface Props {
  scoring: OriginationScore;
  showBreakdown?: boolean;
}

export default function OriginationScoreBar({ scoring, showBreakdown = false }: Props) {
  const band = scoreToBand(scoring.total);
  const bandColor = scoreBandColor(band);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-[#1e2a3a] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
            style={{ width: `${scoring.total}%` }}
          />
        </div>
        <span className={`text-xs font-semibold tabular-nums ${bandColor}`}>
          {scoring.total}
        </span>
      </div>
      {showBreakdown && (
        <div className="grid grid-cols-5 gap-1 mt-2">
          {[
            { label: "Fit", value: scoring.strategic_fit },
            { label: "Scale", value: scoring.scale },
            { label: "Owner.", value: scoring.ownership_relevance },
            { label: "Succ.", value: scoring.succession },
            { label: "Consol.", value: scoring.consolidation },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-[9px] text-slate-600 mb-0.5">{label}</div>
              <div className="text-xs font-semibold text-slate-300">{value}/10</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
