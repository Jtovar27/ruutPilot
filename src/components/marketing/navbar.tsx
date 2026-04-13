"use client"

import Link from "next/link"
import { Layers } from "lucide-react"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            <span className="font-semibold text-white tracking-tight">
              RuutPilot
            </span>
          </Link>

          {/* Nav links + CTA */}
          <nav className="flex items-center gap-1">
            <a
              href="#features"
              className="hidden sm:inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors px-3 py-2"
            >
              Caracteristicas
            </a>
            <a
              href="#pricing"
              className="hidden sm:inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors px-3 py-2"
            >
              Precios
            </a>
            <a
              href="/login"
              className="hidden sm:inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors px-3 py-2 mr-2"
            >
              Iniciar sesion
            </a>
            <a
              href="/signup"
              className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Empezar gratis
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
