"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

export function GoogleMapsLoader() {
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (hasLoaded.current || typeof window === "undefined") return

    console.log("Setting up Google Maps loader")

    // Prevent multiple initialization attempts
    hasLoaded.current = true

    // Define the initialization function
    window.initMap = () => {
      console.log("Google Maps API loaded successfully")
    }

    // Create and add the script
    const script = document.createElement("script")
    script.id = "google-maps-loader"

    // Use a simpler approach to load the API
    script.src =
    `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`
    script.async = true
    script.defer = true

    // Check if script already exists
    if (!document.getElementById("google-maps-loader")) {
      document.head.appendChild(script)
      console.log("Google Maps script added to head")
    }

    // No need for cleanup as we want the script to remain loaded
  }, [])

  return null
}
