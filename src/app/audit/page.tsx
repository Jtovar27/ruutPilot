import type { Metadata } from "next";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import AuditForm from "@/components/audit/audit-form";
import { BadgeDollarSign, MessageSquareText, Star, type LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Revenue Leakage Audit - RuutPilot",
  description:
    "Request a free operations audit for your med or beauty spa and find missed leads, quote follow-up gaps, unpaid invoices, deposit issues, and review opportunities.",
};

const auditSnapshot: Array<{
  icon: LucideIcon;
  label: string;
  value: string;
}> = [
  { icon: MessageSquareText, label: "Leads", value: "8 stale" },
  { icon: BadgeDollarSign, label: "Payments", value: "$1.1k due" },
  { icon: Star, label: "Reviews", value: "3 ready" },
];

export default function AuditPage() {
  return (
    <main className="ruut-premium-shell min-h-screen overflow-x-hidden text-white">
      <Navbar />
      <section className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8 lg:py-20">
        <div className="absolute inset-0 ruut-grid-surface opacity-25" />
        <div className="ruut-reveal relative">
          <p className="text-xs font-semibold uppercase text-emerald-300">
            Free audit
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-normal text-white md:text-5xl">
            Find where your spa is leaking revenue.
          </h1>
          <p className="mt-5 text-base leading-8 text-zinc-300">
            Share how leads, quotes, deposits, bookings, invoices, follow-ups,
            and reviews work today. RuutDev will use this to map the first
            RuutPilot workflow that could recover missed opportunities.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "No software login required.",
              "Built for med spas and beauty spas first.",
              "You get an operations diagnosis before any setup offer.",
            ].map((item) => (
              <div
                key={item}
                className="ruut-gradient-border rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-zinc-300 backdrop-blur-xl"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="ruut-perspective mt-8 hidden lg:block">
            <div className="ruut-card-3d ruut-glass rounded-2xl border border-white/[0.08] p-4 [transform:rotateX(8deg)_rotateY(-8deg)]">
              <div className="grid grid-cols-3 gap-3">
                {auditSnapshot.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl bg-white/[0.04] p-3">
                    <Icon className="h-4 w-4 text-emerald-200" />
                    <p className="mt-3 text-xs text-zinc-500">{label}</p>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <AuditForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
