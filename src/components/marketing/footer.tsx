import { Layers } from "lucide-react"

const links = [
  { label: "Precios", href: "#pricing" },
  { label: "Iniciar sesion", href: "/auth/login" },
  { label: "Registrarse", href: "/auth/register" },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#09090b]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-semibold text-white">RuutPilot</span>
            </div>
            <p className="text-xs text-zinc-500">Sales OS para agencias digitales</p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom row */}
        <div className="mt-10 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">&copy; 2025 RuutPilot</p>
          <p className="text-xs text-zinc-600">Hecho para agencias digitales</p>
        </div>
      </div>
    </footer>
  )
}
