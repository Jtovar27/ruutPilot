import { Check, X, ArrowRight } from "lucide-react"

type Feature = {
  text: string
  included: boolean
}

type Plan = {
  name: string
  price: string
  period?: string
  description: string
  badge?: string
  highlighted?: boolean
  features: Feature[]
  cta: string
  ctaHref: string
  ctaStyle: "gradient" | "outline"
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "Gratis",
    description: "Para empezar a prospectar",
    features: [
      { text: "3 busquedas / mes", included: true },
      { text: "10 leads por busqueda", included: true },
      { text: "15 deals en pipeline", included: true },
      { text: "Google Maps", included: true },
      { text: "Sin IA", included: false },
      { text: "Sin email outreach", included: false },
    ],
    cta: "Empezar gratis",
    ctaHref: "/signup",
    ctaStyle: "outline",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mes",
    description: "Para el freelancer activo",
    badge: "MAS POPULAR",
    highlighted: true,
    features: [
      { text: "30 busquedas / mes", included: true },
      { text: "30 leads por busqueda", included: true },
      { text: "Pipeline ilimitado", included: true },
      { text: "Google Maps + Yelp", included: true },
      { text: "AI completo (Advisor + Call Prep)", included: true },
      { text: "300 emails / mes", included: true },
      { text: "Export CSV", included: true },
    ],
    cta: "Empezar con Pro",
    ctaHref: "/signup",
    ctaStyle: "gradient",
  },
  {
    name: "Agency",
    price: "$69",
    period: "/mes",
    description: "Para equipos y agencias",
    features: [
      { text: "Busquedas ilimitadas", included: true },
      { text: "75 leads por busqueda", included: true },
      { text: "Todas las fuentes", included: true },
      { text: "AI ilimitado", included: true },
      { text: "Emails ilimitados", included: true },
      { text: "5 miembros de equipo", included: true },
      { text: "Export masivo", included: true },
    ],
    cta: "Contactar ventas",
    ctaHref: "mailto:ruutdevllc@gmail.com",
    ctaStyle: "outline",
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 lg:py-32 border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
            Precios
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight">
            Planes que crecen contigo
          </h2>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            Empieza gratis. Escala cuando lo necesites.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col gap-6 rounded-2xl border p-6 transition-all duration-200 ${
                plan.highlighted
                  ? "ring-1 ring-emerald-500/50 bg-[rgba(52,211,153,0.05)] border-emerald-500/30"
                  : "border-white/[0.07] bg-[rgba(255,255,255,0.03)]"
              }`}
            >
              {/* Plan name + badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-white">{plan.name}</span>
                {plan.badge && (
                  <span className="text-[10px] font-semibold tracking-widest bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full px-2.5 py-1">
                    {plan.badge}
                  </span>
                )}
              </div>

              {/* Price */}
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-zinc-500">{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 mt-1">{plan.description}</p>
              </div>

              {/* CTA */}
              {plan.ctaStyle === "gradient" ? (
                <a
                  href={plan.ctaHref}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium w-full px-4 py-2.5 rounded-lg shadow-[0_0_24px_rgba(52,211,153,0.15)] hover:shadow-[0_0_32px_rgba(52,211,153,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <a
                  href={plan.ctaHref}
                  className="inline-flex items-center justify-center gap-2 border border-white/10 text-zinc-300 hover:bg-white/5 text-sm font-medium w-full px-4 py-2.5 rounded-lg transition-all duration-200"
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}

              {/* Divider */}
              <div className="h-px bg-white/[0.06]" />

              {/* Features */}
              <ul className="flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-2.5">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-px" />
                    ) : (
                      <X className="h-4 w-4 text-zinc-700 shrink-0 mt-px" />
                    )}
                    <span className={`text-sm ${feature.included ? "text-zinc-300" : "text-zinc-600"}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
