import Link from "next/link";
import { ArrowRight, Check, ClipboardCheck, MonitorCog } from "lucide-react";

const auditSteps = [
  "Map how leads arrive from the website, DMs, calls, and referrals.",
  "Find stale quotes, unpaid invoices, missing deposits, and review gaps.",
  "Show the first RuutPilot workflow that would recover or protect revenue.",
];

const pilotIncludes = [
  "Spa-specific lead-to-payment workflow",
  "Website or landing page lead capture review",
  "Quote, deposit, follow-up, and review process recommendations",
  "Clickable RuutPilot demo using spa sample data",
  "Pilot setup options for early customers",
];

export default function PricingSection() {
  return (
    <section id="pilot" className="relative overflow-hidden bg-[#101014] py-20 lg:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="ruut-reveal">
            <p className="text-xs font-semibold uppercase text-emerald-300">
              Start with validation
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white md:text-4xl">
              Get the audit before the software pitch.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
              The first RuutPilot offer is a free operations audit for med and
              beauty spas. It diagnoses lost revenue from slow follow-up,
              inconsistent quoting, missing deposits, unpaid invoices, and weak
              review systems.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/audit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 text-sm font-semibold text-zinc-950 shadow-xl shadow-emerald-300/15 transition-all hover:-translate-y-0.5 hover:bg-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-200"
              >
                Request free audit
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.035] px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-white/30"
              >
                See product loop
              </Link>
            </div>
          </div>

          <div className="ruut-perspective grid gap-4 md:grid-cols-2">
            <article className="ruut-card-3d ruut-gradient-border rounded-2xl border border-white/[0.08] bg-[#17171c]/88 p-6 backdrop-blur-xl">
              <ClipboardCheck className="h-6 w-6 text-emerald-300" />
              <h3 className="mt-5 text-lg font-semibold text-white">
                Free audit flow
              </h3>
              <ol className="mt-5 space-y-4">
                {auditSteps.map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-3 text-sm leading-6 text-zinc-300"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.06] text-xs font-semibold text-emerald-200">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </article>

            <article className="ruut-card-3d rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl">
              <MonitorCog className="h-6 w-6 text-emerald-200" />
              <h3 className="mt-5 text-lg font-semibold text-white">
                Pilot setup target
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Early pilots can be sold as done-for-you setup after the audit:
                website integration, BOS configuration, templates, and monthly
                support.
              </p>
              <ul className="mt-5 space-y-3">
                {pilotIncludes.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-zinc-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
