import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import DemoPreview from "@/components/demo/demo-preview";

export const metadata: Metadata = {
  title: "RuutPilot Clickable Demo",
  description:
    "Explore a clickable validation demo of the RuutPilot revenue command center for med and beauty spas.",
};

export default function DemoPage() {
  return (
    <main className="ruut-premium-shell min-h-screen overflow-x-hidden text-white">
      <Navbar />
      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 ruut-grid-surface opacity-20" />
        <div className="ruut-reveal relative mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase text-emerald-300">
            Clickable prototype
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-white md:text-5xl">
            Walk through the lead-to-payment operating loop.
          </h1>
          <p className="mt-5 text-base leading-8 text-zinc-300">
            This prototype uses realistic spa sample data to show how RuutPilot
            can surface revenue leakage and turn it into concrete next actions.
          </p>
          <Link
            href="/audit"
            className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 text-sm font-semibold text-zinc-950 shadow-xl shadow-emerald-300/15 transition-all hover:-translate-y-0.5 hover:bg-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-200"
          >
            Request free audit
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative">
          <DemoPreview />
        </div>
      </section>
      <Footer />
    </main>
  );
}
