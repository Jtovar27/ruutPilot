import { Layers } from "lucide-react"

const links = [
  { label: "Demo", href: "/demo" },
  { label: "Free audit", href: "/audit" },
  { label: "Pilot offer", href: "/#pilot" },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#08090a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-xl bg-emerald-300 text-zinc-950">
                <Layers className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm font-semibold text-white">RuutPilot</span>
            </div>
            <p className="text-xs text-zinc-500">
              Revenue command center for small service businesses.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-2 py-1 text-sm text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:ring-2 focus-visible:ring-white/20"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">&copy; 2026 RuutPilot</p>
          <p className="text-xs text-zinc-600">
            Built by RuutDev for validation pilots.
          </p>
        </div>
      </div>
    </footer>
  )
}
