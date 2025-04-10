// hooks/useLoadGoogleMapsScript.ts
import { useEffect, useState } from "react"

export function useLoadGoogleMapsScript(apiKey: string): boolean {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if ((window as any).google?.maps?.places) {
      setLoaded(true)
      return
    }

    const scriptId = "google-maps-script"
    if (document.getElementById(scriptId)) return

    const script = document.createElement("script")
    script.id = scriptId
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.onload = () => setLoaded(true)
    document.head.appendChild(script)
  }, [apiKey])

  return loaded
}
