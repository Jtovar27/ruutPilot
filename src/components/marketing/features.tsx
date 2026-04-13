import { Search, Layers, BarChart3, Target, Mail, Phone } from "lucide-react"

export default function Features() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-14 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
            Funcionalidades
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight">
            Todo lo que necesitas para crecer
          </h2>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            Desde la busqueda de leads hasta el cierre del trato — todo en un solo lugar.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Card 1 — Lead Discovery */}
          <div className="bg-[rgba(255,255,255,0.03)] border border-white/[0.07] rounded-2xl p-6 hover:bg-[rgba(255,255,255,0.06)] hover:border-white/[0.12] transition-all duration-200">
            <div className="bg-emerald-500/10 rounded-lg p-2 w-fit mb-4">
              <Search className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold">Lead Discovery Global</h3>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              Busca en Google Maps, Yelp, Yellow Pages y directorios europeos. Extrae contactos completos automaticamente.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["LatAm", "US", "UK", "Europa"].map((region) => (
                <span key={region} className="text-xs text-zinc-400 border border-white/[0.08] rounded-full px-2.5 py-1 bg-white/[0.03]">
                  {region}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2 — Pipeline CRM */}
          <div className="bg-[rgba(255,255,255,0.03)] border border-white/[0.07] rounded-2xl p-6 hover:bg-[rgba(255,255,255,0.06)] hover:border-white/[0.12] transition-all duration-200">
            <div className="bg-emerald-500/10 rounded-lg p-2 w-fit mb-4">
              <Layers className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold">Pipeline CRM</h3>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              Kanban visual con etapas personalizadas. Arrastra deals entre columnas. Sin hojas de calculo.
            </p>
            <div className="mt-4 flex gap-1.5">
              {["Nuevo", "Contactado", "Propuesta", "Cerrado"].map((stage, i) => (
                <div key={stage} className="flex-1 h-1 rounded-full" style={{ backgroundColor: i === 0 ? "rgb(52 211 153 / 0.6)" : i === 1 ? "rgb(52 211 153 / 0.35)" : i === 2 ? "rgb(52 211 153 / 0.18)" : "rgb(52 211 153 / 0.08)" }} />
              ))}
            </div>
          </div>

          {/* Card 3 — AI Advisor */}
          <div className="bg-[rgba(255,255,255,0.03)] border border-white/[0.07] rounded-2xl p-6 hover:bg-[rgba(255,255,255,0.06)] hover:border-white/[0.12] transition-all duration-200">
            <div className="bg-emerald-500/10 rounded-lg p-2 w-fit mb-4">
              <BarChart3 className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold">AI Advisor</h3>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              Analiza tu pipeline y genera acciones prioritarias para hoy. Basado en tus datos reales.
            </p>
          </div>

          {/* Card 4 — Filtros Avanzados (col-span-2) */}
          <div className="md:col-span-2 bg-[rgba(255,255,255,0.03)] border border-white/[0.07] rounded-2xl p-6 hover:bg-[rgba(255,255,255,0.06)] hover:border-white/[0.12] transition-all duration-200">
            <div className="bg-emerald-500/10 rounded-lg p-2 w-fit mb-4">
              <Target className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold">Filtros Avanzados</h3>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              Encuentra exactamente los leads que puedes cerrar. Combina filtros para maximizar tu conversion.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: "Tiene Email", active: true },
                { label: "Tiene WhatsApp", active: true },
                { label: "Sin Website", active: true },
                { label: "Caliente", active: false },
                { label: "Rating > 4.0", active: false },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-all duration-200 ${
                    chip.active
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "bg-white/[0.03] border-white/[0.08] text-zinc-500"
                  }`}
                >
                  {chip.label}
                </span>
              ))}
            </div>
          </div>

          {/* Card 5 — Email Outreach */}
          <div className="bg-[rgba(255,255,255,0.03)] border border-white/[0.07] rounded-2xl p-6 hover:bg-[rgba(255,255,255,0.06)] hover:border-white/[0.12] transition-all duration-200">
            <div className="bg-emerald-500/10 rounded-lg p-2 w-fit mb-4">
              <Mail className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold">Email Outreach</h3>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              Genera y envia emails con IA. Trackea aperturas y clicks en tiempo real.
            </p>
          </div>

          {/* Card 6 — Call Prep AI (col-span full) */}
          <div className="md:col-span-3 bg-[rgba(255,255,255,0.03)] border border-white/[0.07] rounded-2xl p-6 hover:bg-[rgba(255,255,255,0.06)] hover:border-white/[0.12] transition-all duration-200">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="shrink-0">
                <div className="bg-emerald-500/10 rounded-lg p-2 w-fit mb-4">
                  <Phone className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold">Call Prep AI</h3>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed max-w-md">
                  Briefing completo antes de cada llamada: objeciones esperadas, talking points y preguntas clave generadas por IA segun el negocio del prospecto.
                </p>
              </div>
              <div className="flex-1 grid sm:grid-cols-3 gap-3">
                {[
                  { label: "Objeciones esperadas", desc: "\"No tenemos presupuesto\", \"Ya tenemos quien nos maneje redes\"" },
                  { label: "Talking points", desc: "Menciona que el 80% de sus competidores ya tiene presencia digital" },
                  { label: "Preguntas clave", desc: "¿Han intentado publicidad en Meta o Google antes?" },
                ].map((item) => (
                  <div key={item.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-xs font-medium text-emerald-400 mb-1">{item.label}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
