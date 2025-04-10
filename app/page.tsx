"use client"

import { useEffect, useState } from "react"

import { HeroSection } from "@/components/sections/hero-section"

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
 
      <main>
        {mounted && (
          <>
            <HeroSection />
         
          </>
        )}
      </main>
 
    </div>
  )
}
