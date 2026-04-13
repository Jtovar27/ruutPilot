"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Search,
  Mail,
  Kanban,
  BarChart3,
  Brain,
  Phone,
  Layers,
  Settings,
  Zap,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    icon: BarChart3,
    label: "Dashboard",
  },
  {
    href: "/leads",
    icon: Search,
    label: "Lead Discovery",
  },
  {
    href: "/pipeline",
    icon: Kanban,
    label: "Pipeline CRM",
  },
  {
    href: "/email",
    icon: Mail,
    label: "Email Outreach",
  },
  {
    href: "/advisor",
    icon: Brain,
    label: "Business Advisor",
  },
  {
    href: "/callprep",
    icon: Phone,
    label: "Call Prep AI",
  },
];

const CUENTA_ITEMS = [
  {
    href: "/settings",
    icon: Settings,
    label: "Configuracion",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => r.json())
      .then((d) => setPlan(d.plan ?? "free"))
      .catch(() => setPlan("free"));
  }, []);

  const isPaid = plan === "pro" || plan === "agency";

  function NavItem({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
    const isActive = pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
          isActive
            ? "bg-white/[0.08] text-white border-l-2 border-emerald-400 pl-[10px]"
            : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{label}</span>
      </Link>
    );
  }

  return (
    <aside className="w-56 flex flex-col h-screen bg-[#0d0d10] border-r border-white/[0.06] fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-[0_0_16px_rgba(52,211,153,0.12)]">
            <Layers className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm text-white leading-none">RuutPilot</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {/* MENU section */}
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-3 mb-2">Menu</p>
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>

        {/* CUENTA section */}
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-3 mb-2">Cuenta</p>
          {CUENTA_ITEMS.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>
      </nav>

      {/* Plan card at bottom */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        {plan === "agency" ? (
          <Link href="/settings">
            <div className="rounded-xl bg-teal-500/[0.06] border border-teal-500/20 p-3 hover:bg-teal-500/[0.10] transition-all duration-150 cursor-pointer">
              <div className="flex items-center gap-2 mb-1.5">
                <Building2 className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                <span className="text-xs font-semibold text-teal-400">Plan Agency</span>
              </div>
              <p className="text-[11px] text-zinc-500">Gestionar suscripcion →</p>
            </div>
          </Link>
        ) : plan === "pro" ? (
          <Link href="/settings">
            <div className="rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 p-3 hover:bg-emerald-500/[0.10] transition-all duration-150 cursor-pointer">
              <div className="flex items-center gap-2 mb-1.5">
                <Zap className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-emerald-400">Plan Pro</span>
              </div>
              <p className="text-[11px] text-zinc-500">Gestionar suscripcion →</p>
            </div>
          </Link>
        ) : (
          <Link href="/pricing">
            <div className="rounded-xl bg-amber-500/[0.08] border border-amber-500/20 p-3 hover:bg-amber-500/[0.12] transition-all duration-150 cursor-pointer">
              <div className="flex items-center gap-2 mb-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-amber-400">Plan Free</span>
              </div>
              <p className="text-[11px] text-zinc-500">Upgrade a Pro — $29/mes →</p>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}
