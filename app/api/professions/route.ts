import { NextResponse } from "next/server"

// Lista de profesiones de respaldo en caso de que la API externa falle
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

export async function GET() {
  try {
    // Intentamos obtener datos de la API externa
    const response = await fetch("https://api.chances.com.ar:4101/api/professions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Agregamos un timeout para evitar esperas largas
      },
      // Agregamos un timeout de 5 segundos
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`)
      // Si la API externa falla, usamos los datos de respaldo
      return NextResponse.json(fallbackProfessions)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching professions:", error)
    // Si hay cualquier error, usamos los datos de respaldo
    return NextResponse.json(fallbackProfessions)
  }
}
