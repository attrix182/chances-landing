"use client"

import { useState, useCallback } from "react"
import { Star } from "lucide-react"
import { SearchForm } from "@/components/search-form"
import { GoogleMap } from "@/components/google-map"

export function HeroSection() {
  const [mapCenter, setMapCenter] = useState({ lat: -34.603722, lng: -58.381592 }) // Default to Buenos Aires
  const [showMarker, setShowMarker] = useState(false)

  // Memoize the callback to prevent recreating on every render
  const handleAddressSelected = useCallback((address: string, location: { lat: number; lng: number }) => {
    setMapCenter(location)
    setShowMarker(true) // Show marker only after an address is selected
  }, [])

  return (
    <section className="py-12 md:py-24 lg:py-32 xl:py-12">
      <div className="container md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Encuentra profesionales cerca de ti
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Conecta con los mejores profesionales en tu área y descubre nuevas oportunidades.
              </p>
            </div>
            <SearchForm onAddressSelected={handleAddressSelected} />
            <div className="flex items-center gap-2 text-sm mt-4">
              <div className="flex gap-0.5">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
              </div>
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">4.9/5</span> de más de 1,000 reseñas
              </span>
            </div>
          </div>
          <div className="mx-auto flex w-full h-[400px] md:h-full items-center justify-center lg:max-w-none rounded-xl overflow-hidden border shadow-xl">
            <GoogleMap center={mapCenter} showMarker={showMarker} />
          </div>
        </div>
      </div>
    </section>
  )
}
