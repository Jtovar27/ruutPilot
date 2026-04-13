import Navbar from "@/components/marketing/navbar"
import Hero from "@/components/marketing/hero"
import Features from "@/components/marketing/features"
import PricingSection from "@/components/marketing/pricing-section"
import Footer from "@/components/marketing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <PricingSection />
      <Footer />
    </main>
  )
}
