"use client"

import { useRef, useEffect, useState } from "react"

interface GoogleMapProps {
  center: { lat: number; lng: number }
  zoom?: number
  showMarker?: boolean
}

export function GoogleMap({ center, zoom = 15, showMarker = false }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const isInitialized = useRef(false)

  // Check if Google Maps is loaded
  useEffect(() => {
    console.log("Checking if Google Maps is loaded")
    const checkGoogleMapsLoaded = () => {
      if (typeof window !== "undefined" && window.google && window.google.maps) {
        console.log("Google Maps is loaded!")
        setIsGoogleLoaded(true)
        return true
      }
      return false
    }

    if (checkGoogleMapsLoaded()) return

    const intervalId = setInterval(() => {
      if (checkGoogleMapsLoaded()) {
        clearInterval(intervalId)
      }
    }, 300)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!isGoogleLoaded || !mapRef.current || isInitialized.current) return

    console.log("Initializing map")

    async function initMap() {
      try {
        // Load the Maps JavaScript API
        if (typeof window.google === "undefined") {
          console.error("Google Maps API not loaded")
          return
        }
        const { Map } = await window.google.maps.importLibrary("maps")

        console.log("Creating map instance")
        // Create the map instance
        const mapInstance = new Map(mapRef.current, {
          center,
          zoom,
          mapId: "CHANCES_MAP",
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        })

        mapInstanceRef.current = mapInstance
        isInitialized.current = true
        console.log("Map initialized successfully")
      } catch (error) {
        console.error("Error initializing Google Maps:", error)
      }
    }

    initMap()
  }, [isGoogleLoaded, center, zoom])

  // Handle marker creation/update when center changes
  useEffect(() => {
    if (!isGoogleLoaded || !mapInstanceRef.current) return

    // Update map center
    mapInstanceRef.current.setCenter(center)

    // Handle marker
    if (showMarker) {
      const createOrUpdateMarker = async () => {
        try {
          // If marker doesn't exist and we need to show it, create it
          if (!markerRef.current) {
            const { Marker } = await window.google.maps.importLibrary("marker")
            markerRef.current = new Marker({
              position: center,
              map: mapInstanceRef.current,
              title: "Ubicación seleccionada",
            })
          } else {
            // If marker exists, update its position
            markerRef.current.setPosition(center)
          }
        } catch (error) {
          console.error("Error handling marker:", error)
        }
      }

      createOrUpdateMarker()
    } else {
      // If we shouldn't show marker but it exists, remove it
      if (markerRef.current) {
        markerRef.current.setMap(null)
        markerRef.current = null
      }
    }
  }, [center, isGoogleLoaded, showMarker])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
        markerRef.current = null
      }
    }
  }, [])

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      {!isGoogleLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  )
}
