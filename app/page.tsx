"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { CTASection } from "@/components/sections/cta-section"
import { GoogleMapsLoader } from "@/components/google-maps-loader"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  // Use useEffect to handle client-side mounting
  useEffect(() => {
    setMounted(true)
    console.log("Component mounted")
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <GoogleMapsLoader />
      <Header />
      <main className="flex-1">
        {mounted && (
          <>
            <HeroSection />
            <FeaturesSection />
            <CTASection />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
