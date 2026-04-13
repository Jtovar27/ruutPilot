import { ArrowRight, MapPin, Phone, Mail, MessageCircle, Star, Globe } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background blobs */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sales OS para agencias digitales
            </div>

            {/* H1 */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              Encuentra clientes que necesitan tu servicio —{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                hoy
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-zinc-400 text-lg leading-relaxed">
              RuutPilot extrae leads con telefono, email y WhatsApp de Google Maps, Yelp y directorios en LatAm, Estados Unidos y Europa. Gestiona tu pipeline y cierra mas con IA.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <a
                href="/signup"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium px-6 py-3 rounded-lg shadow-[0_0_24px_rgba(52,211,153,0.15)] hover:shadow-[0_0_32px_rgba(52,211,153,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm"
              >
                Empezar gratis
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 border border-white/10 text-zinc-300 hover:bg-white/5 font-medium px-6 py-3 rounded-lg transition-all duration-200 text-sm"
              >
                Ver como funciona
              </a>
            </div>
            <p className="text-zinc-600 text-xs">Sin tarjeta de credito. Cancela cuando quieras.</p>
          </div>

          {/* Right — product mock card */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="shadow-[0_0_80px_rgba(52,211,153,0.08)] rounded-2xl w-full max-w-sm">
              <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/[0.08] rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Card header */}
                <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs font-medium text-white">Lead Discovery</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/25 text-orange-400 text-xs font-medium">
                    Caliente
                  </span>
                </div>

                {/* Lead 1 — highlighted */}
                <div className="p-4 border-b border-white/[0.06] bg-emerald-500/[0.03] border-l-2 border-l-emerald-500">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Restaurante El Fogon</p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5">
                          <Globe className="h-2.5 w-2.5" />
                          Sin Website
                        </span>
                        <span className="inline-flex items-center text-xs bg-zinc-800 text-zinc-400 border border-white/[0.06] rounded-full px-2 py-0.5">
                          Restaurante
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-zinc-400">4.2 (89)</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span>Av. Insurgentes 420, CDMX</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Phone className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span>+52 55 1234 5678</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Mail className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span>contacto@elfogon.mx</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <MessageCircle className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span>+52 55 1234 5678</span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button className="inline-flex items-center gap-1 text-xs bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 rounded-lg px-3 py-1.5 hover:bg-emerald-500/25 transition-all duration-200">
                      + Al Pipeline
                    </button>
                  </div>
                </div>

                {/* Lead 2 — preview */}
                <div className="p-4 opacity-60">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white">Taller Mecanico Lopez</p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5">
                          <Globe className="h-2.5 w-2.5" />
                          Sin Website
                        </span>
                        <span className="inline-flex items-center text-xs bg-zinc-800 text-zinc-400 border border-white/[0.06] rounded-full px-2 py-0.5">
                          Automotriz
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
                    <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
                    <span>Calle 5 de Mayo 78, Guadalajara</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-zinc-500">75 leads encontrados</span>
                  <span className="text-xs font-medium text-emerald-400">Score: 87</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
