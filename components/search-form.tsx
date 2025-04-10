"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search } from "lucide-react"
import { useLoadGoogleMapsScript } from "@/hooks/useLoadGoogleMapsScript"

interface Profession {
  id: string
  name: string
}

interface SearchFormProps {
  onAddressSelected: (address: string, location: { lat: number; lng: number }, profession:string) => void
}


const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

export function SearchForm({ onAddressSelected }: SearchFormProps) {
  const [professions, setProfessions] = useState<Profession[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProfession, setSelectedProfession] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const isGoogleLoaded = useLoadGoogleMapsScript(GOOGLE_API_KEY)
  const hasInitializedAutocomplete = useRef(false)
  const [userAddress, setUserAddress] = useState("")

  useEffect(() => {
    if (!isGoogleLoaded || !navigator.geolocation) return
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const geocoder = new window.google.maps.Geocoder()
  
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const formattedAddress = results[0].formatted_address
            setUserAddress(formattedAddress)
  
            if (inputRef.current) {
              inputRef.current.value = formattedAddress
            }
  
            onAddressSelected(formattedAddress, {
              lat: latitude,
              lng: longitude,
            }, "")
    
          } else {
            console.error("No se pudo obtener la dirección")
          }
        })
      },
      (error) => {
        console.error("Error obteniendo la ubicación del usuario:", error)
      }
    )
  }, [isGoogleLoaded, onAddressSelected])
  
  
  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        setLoading(true)

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
          const data = await response.json()
          setProfessions(Array.isArray(data) && data.length ? data : fallbackProfessions)
        } catch {
          setProfessions(fallbackProfessions)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfessions()
  }, [])

  useEffect(() => {
    if (!isGoogleLoaded || !inputRef.current || hasInitializedAutocomplete.current) return

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, {
        types: ["address"],
      })

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace()
        if (!place.geometry || !place.geometry.location) return

        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }

        onAddressSelected(place.formatted_address || inputRef.current?.value || "", location, selectedProfession)
      })

      autocompleteRef.current = autocomplete
      hasInitializedAutocomplete.current = true
    } catch (error) {
      console.error("Error initializing autocomplete:", error)
    }

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }
    }
  }, [isGoogleLoaded, onAddressSelected])

  const handleSearch = useCallback(() => {
    if (!inputRef.current?.value) return alert("Por favor ingresa una dirección")
    if (!selectedProfession) return alert("Por favor selecciona una profesión")

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: inputRef.current.value }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        }
        onAddressSelected(results[0].formatted_address, location, selectedProfession)
      } else {
        alert("No pudimos encontrar la ubicación. Intenta con otra dirección.")
      }
      
    })
  }, [onAddressSelected, selectedProfession])

  return (
    <Card className="w-full max-w-md mt-4">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ingresa tu dirección"
              className="border-0 border-b rounded-none focus-visible:ring-0 px-0 focus-visible:border-primary"
            />
          </div>

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

          <Button className="w-full" size="lg" onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" /> Buscar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
