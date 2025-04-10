"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search } from "lucide-react"

interface Profession {
  id: string
  name: string
}

interface SearchFormProps {
  onAddressSelected: (address: string, location: { lat: number; lng: number }) => void
}

export function SearchForm({ onAddressSelected }: SearchFormProps) {
  const [professions, setProfessions] = useState<Profession[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProfession, setSelectedProfession] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const hasInitializedAutocomplete = useRef(false)

  // Check if Google Maps API is loaded - only run once
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (typeof window.google !== "undefined" && window.google.maps && window.google.maps.places) {
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

  // Fetch professions from API - only run once
  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        setLoading(true)

        // Fallback professions
        const fallbackProfessions = [
          { id: "1", name: "Plomero" },
          { id: "2", name: "Electricista" },
          { id: "3", name: "Médico" },
          { id: "4", name: "Abogado" },
          { id: "5", name: "Profesor" },
          { id: "6", name: "Diseñador" },
          { id: "7", name: "Desarrollador" },
          { id: "8", name: "Contador" },
          { id: "9", name: "Arquitecto" },
          { id: "10", name: "Técnico en refrigeración" },
        ]

        try {
          const response = await fetch("/api/professions")

          if (response.ok) {
            const data = await response.json()
            if (Array.isArray(data) && data.length > 0) {
              setProfessions(data)
            } else {
              setProfessions(fallbackProfessions)
            }
          } else {
            setProfessions(fallbackProfessions)
          }
        } catch (error) {
          console.error("Error fetching professions:", error)
          setProfessions(fallbackProfessions)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfessions()
  }, [])

  // Initialize Google Places Autocomplete - only run once when Google is loaded and input is available
  useEffect(() => {
    if (!isGoogleLoaded || !inputRef.current || hasInitializedAutocomplete.current) return

    async function initAutocomplete() {
      try {
        // Load the Places library
        const { Autocomplete } = await window.google.maps.importLibrary("places")

        // Clean up previous autocomplete
        if (autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
        }

        // Create the autocomplete instance
        const autocomplete = new Autocomplete(inputRef.current, {
          types: ["address"],
        })

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace()

          if (!place.geometry || !place.geometry.location) {
            console.warn("No location data available for this place")
            return
          }

          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }

          onAddressSelected(place.formatted_address || inputRef.current?.value || "", location)
        })

        autocompleteRef.current = autocomplete
        hasInitializedAutocomplete.current = true
      } catch (error) {
        console.error("Error initializing Places Autocomplete:", error)
      }
    }

    initAutocomplete()

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }
    }
  }, [isGoogleLoaded, onAddressSelected])

  // Memoize the search handler to prevent recreating on every render
  const handleSearch = useCallback(() => {
    if (!inputRef.current?.value) {
      alert("Por favor ingresa una dirección")
      return
    }

    if (!selectedProfession) {
      alert("Por favor selecciona una profesión")
      return
    }

    // If no place was selected with autocomplete, try to geocode the address
    if (isGoogleLoaded && typeof window.google !== "undefined") {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ address: inputRef.current.value }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          }
          onAddressSelected(results[0].formatted_address, location)
        } else {
          alert("No pudimos encontrar la ubicación. Por favor, intenta con otra dirección.")
        }
      })
    }
  }, [isGoogleLoaded, selectedProfession, onAddressSelected])

  return (
    <Card className="w-full max-w-md mt-4">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Ingresa tu dirección"
                className="border-0 border-b rounded-none focus-visible:ring-0 px-0 focus-visible:border-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Select value={selectedProfession} onValueChange={setSelectedProfession}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una profesión" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>
                    Cargando profesiones...
                  </SelectItem>
                ) : (
                  professions.map((profession) => (
                    <SelectItem key={profession.id} value={profession.id}>
                      {profession.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" size="lg" onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" /> Buscar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
