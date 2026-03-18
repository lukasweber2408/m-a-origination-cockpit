import { Priority } from "@/lib/types";
import { priorityConfig } from "@/lib/utils";

export default function PriorityDot({ priority }: { priority: Priority }) {
  const cfg = priorityConfig[priority];
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
      <span className={`text-xs ${cfg.color}`}>{cfg.label}</span>
    </div>
  );
}
