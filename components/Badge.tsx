import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
  className?: string;
}

export default function Badge({ label, color, bg, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        color ?? "text-slate-300",
        bg ?? "bg-slate-700",
        className
      )}
    >
      {label}
    </span>
  );
}
