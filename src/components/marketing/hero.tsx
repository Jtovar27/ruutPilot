import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CircleDollarSign,
  MessageSquareText,
  Quote,
  Star,
} from "lucide-react";
import Hero3DVisual from "@/components/marketing/hero-3d-visual";

const loop = [
  { icon: MessageSquareText, label: "Lead" },
  { icon: Quote, label: "Quote" },
  { icon: CalendarCheck, label: "Booking" },
  { icon: CircleDollarSign, label: "Payment" },
  { icon: Star, label: "Review" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-10 pt-6 sm:pt-10">
      <div className="absolute inset-0 ruut-grid-surface opacity-35" />
      <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(105deg,rgba(52,211,153,0.16),transparent_34%,rgba(56,189,248,0.08)_62%,transparent)] blur-3xl" />
      <div className="relative mx-auto grid min-h-[calc(100vh-5.5rem)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100 shadow-lg shadow-emerald-300/5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.75)]" />
            Free Revenue Leakage Audit for med and beauty spas
          </div>

          <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl">
            From lead to payment, your spa finally has a system.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
            RuutPilot shows where money is stuck across leads, quotes,
            bookings, deposits, invoices, follow-ups, and reviews, then turns
            those gaps into clear next actions.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/audit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 text-sm font-semibold text-zinc-950 shadow-xl shadow-emerald-300/15 transition-all hover:-translate-y-0.5 hover:bg-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-200"
            >
              Get the free audit
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-5 text-sm font-semibold text-white shadow-xl shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-white/[0.09] focus-visible:ring-2 focus-visible:ring-white/30"
            >
              View clickable demo
            </Link>
          </div>

          <div className="mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-5">
            {loop.map((item) => (
              <div
                key={item.label}
                className="ruut-gradient-border flex h-20 flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3 backdrop-blur-xl"
              >
                <item.icon className="h-4 w-4 text-emerald-300" />
                <span className="text-xs font-medium text-zinc-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[410px] sm:min-h-[470px] lg:min-h-[520px]">
          <Hero3DVisual />
        </div>
      </div>
    </section>
  );
}
