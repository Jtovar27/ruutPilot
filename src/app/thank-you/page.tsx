import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Audit Request Received - RuutPilot",
  description:
    "Your RuutPilot revenue leakage audit request has been received.",
};

export default function ThankYouPage() {
  return (
    <main className="ruut-premium-shell min-h-screen overflow-x-hidden text-white">
      <Navbar />
      <section className="relative mx-auto flex max-w-3xl flex-col items-start px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 ruut-grid-surface opacity-20" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300 shadow-xl shadow-emerald-300/10">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="relative mt-6 text-4xl font-semibold tracking-normal text-white">
          Your audit request is in.
        </h1>
        <p className="relative mt-4 text-base leading-8 text-zinc-300">
          RuutDev can now review the lead, quote, booking, payment, follow-up,
          and review gaps you shared. The next step is turning that into a clear
          operations diagnosis and pilot setup path.
        </p>
        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/demo"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 text-sm font-semibold text-zinc-950 shadow-xl shadow-emerald-300/15 transition-all hover:-translate-y-0.5 hover:bg-emerald-200"
          >
            View the demo
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.035] px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/[0.08]"
          >
            Back home
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
