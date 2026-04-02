import { SectorType } from "@/lib/schema";

interface Props {
  sector: SectorType;
  size?: "sm" | "xs";
}

const sectorConfig: Record<SectorType, { color: string; bg: string; dot: string }> = {
  Banking: {
    color: "text-blue-300",
    bg: "bg-blue-500/10 border-blue-500/30",
    dot: "bg-blue-400",
  },
  Payments: {
    color: "text-amber-300",
    bg: "bg-amber-500/10 border-amber-500/30",
    dot: "bg-amber-400",
  },
  "Asset Management": {
    color: "text-violet-300",
    bg: "bg-violet-500/10 border-violet-500/30",
    dot: "bg-violet-400",
  },
  "Wealth Management": {
    color: "text-teal-300",
    bg: "bg-teal-500/10 border-teal-500/30",
    dot: "bg-teal-400",
  },
};

export default function SectorBadge({ sector, size = "sm" }: Props) {
  const { color, bg, dot } = sectorConfig[sector];
  const textSize = size === "xs" ? "text-[10px]" : "text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded border ${textSize} font-medium ${color} ${bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
      {sector}
    </span>
  );
}
