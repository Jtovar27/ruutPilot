import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";

export default function CTA3D() {
  return (
    <section className="relative overflow-hidden bg-[#0b0c0e] py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="ruut-gradient-border ruut-aurora-slab rounded-3xl border border-white/[0.08] p-6 shadow-2xl shadow-black/40 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-black/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                <ClipboardCheck className="h-3.5 w-3.5" />
                Free audit, no software login required
              </div>
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-white md:text-4xl">
                See where revenue is slipping before you build more software.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
                Start with a clear operations diagnosis for your spa: missed
                leads, slow quotes, missing deposits, unpaid invoices,
                follow-up gaps, and review opportunities.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/audit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-200"
              >
                Request free audit
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/[0.12] bg-black/20 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Explore demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
