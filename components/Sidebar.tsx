"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  SlidersHorizontal,
  ClipboardList,
  Users,
  Briefcase,
  Bookmark,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const primaryNav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/universe", label: "Target Universe", icon: Database },
  { href: "/screening", label: "Screening", icon: SlidersHorizontal },
  { href: "/review", label: "Review Queue", icon: ClipboardList },
  { href: "/buyers", label: "Buyer Matching", icon: Users },
];

const secondaryNav = [
  { href: "/deals", label: "Deals (legacy)", icon: Briefcase },
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  const linkClass = (href: string) =>
    cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
      isActive(href)
        ? "bg-blue-600/20 text-blue-300 font-medium"
        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
    );

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-[#0d111c] border-r border-[#1e2a3a] h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1e2a3a]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
            <TrendingUp size={14} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white leading-tight">FS Origination</div>
            <div className="text-[10px] text-slate-500 leading-tight">Germany · FinServ Database</div>
          </div>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <div className="text-[10px] text-slate-600 uppercase tracking-wider px-3 mb-2 font-medium">
          Origination
        </div>
        {primaryNav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={linkClass(href)}>
            <Icon size={15} className="shrink-0" />
            {label}
          </Link>
        ))}

        <div className="text-[10px] text-slate-600 uppercase tracking-wider px-3 mb-2 mt-5 font-medium">
          Secondary
        </div>
        {secondaryNav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={linkClass(href)}>
            <Icon size={15} className="shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#1e2a3a] space-y-2">
        <div className="flex items-center gap-2 text-[10px] text-slate-600">
          <AlertCircle size={10} className="text-amber-500 shrink-0" />
          <span>Public data only · verify before use</span>
        </div>
        <div className="text-[10px] text-slate-700">
          Germany · FS only · last updated 2026-03-18
        </div>
      </div>
    </aside>
  );
}
