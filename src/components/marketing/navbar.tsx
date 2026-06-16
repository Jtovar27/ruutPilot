"use client"

import Link from "next/link"
import { ClipboardCheck, Layers, Sparkles } from "lucide-react"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3">
      <div className="mx-auto max-w-7xl">
        <div className="ruut-glass flex h-14 items-center justify-between rounded-2xl border border-white/[0.10] px-3 backdrop-blur-2xl sm:px-4">
          <Link href="/" className="group flex items-center gap-2 rounded-xl focus-visible:ring-2 focus-visible:ring-emerald-200">
            <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-300 text-zinc-950 shadow-lg shadow-emerald-300/20 transition-transform group-hover:-translate-y-0.5">
              <Layers className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-white">
              RuutPilot
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/demo"
              className="hidden items-center rounded-xl px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:ring-2 focus-visible:ring-white/20 sm:inline-flex"
            >
              Demo
            </Link>
            <Link
              href="/#radar"
              className="hidden items-center rounded-xl px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:ring-2 focus-visible:ring-white/20 sm:inline-flex"
            >
              Revenue Radar
            </Link>
            <Link
              href="/#pilot"
              className="hidden items-center rounded-xl px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:ring-2 focus-visible:ring-white/20 md:inline-flex"
            >
              Pilot Offer
            </Link>
            <span className="hidden h-8 items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 text-xs font-semibold text-emerald-100 lg:inline-flex">
              <Sparkles className="h-3.5 w-3.5" />
              Validation MVP
            </span>
            <Link
              href="/audit"
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-emerald-300 px-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-300/15 transition-all hover:-translate-y-0.5 hover:bg-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-200 sm:px-4"
            >
              <ClipboardCheck className="h-4 w-4" />
              Free Audit
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
