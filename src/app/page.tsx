import Navbar from "@/components/marketing/navbar"
import Hero from "@/components/marketing/hero"
import Features from "@/components/marketing/features"
import PricingSection from "@/components/marketing/pricing-section"
import DashboardMockup3D from "@/components/marketing/dashboard-mockup-3d"
import CTA3D from "@/components/marketing/cta-3d"
import Footer from "@/components/marketing/footer"

export default function LandingPage() {
  return (
    <main className="ruut-premium-shell min-h-screen overflow-x-hidden text-white">
      <Navbar />
      <Hero />
      <Features />
      <DashboardMockup3D />
      <PricingSection />
      <CTA3D />
      <Footer />
    </main>
  )
}
