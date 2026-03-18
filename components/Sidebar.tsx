"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Users,
  Briefcase,
  Bookmark,
  Search,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/targets", label: "Targets", icon: Target },
  { href: "/buyers", label: "Buyers / Investors", icon: Users },
  { href: "/deals", label: "Deals", icon: Briefcase },
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
  { href: "/screening", label: "Market Screening", icon: TrendingUp },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-[#0d111c] border-r border-[#1e2a3a] h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1e2a3a]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
            <TrendingUp size={14} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white leading-tight">M&A Cockpit</div>
            <div className="text-[10px] text-slate-500 leading-tight">Origination Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-blue-600/20 text-blue-300 font-medium"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <Icon size={15} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#1e2a3a]">
        <div className="text-[10px] text-slate-600">Private use only · MVP v1.0</div>
      </div>
    </aside>
  );
}
