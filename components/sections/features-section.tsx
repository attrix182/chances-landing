"use client"

import type React from "react"

import { FeatureCard } from "@/components/feature-card"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeaturesSection() {
  const features: Feature[] = [
    {
      icon: <div className="h-6 w-6 text-primary" />,
      title: "Buscar",
      description: "Encuentra profesionales cerca de ti según tus necesidades.",
    },
    {
      icon: <div className="h-6 w-6 text-primary" />,
      title: "Conectar",
      description: "Comunícate directamente con los profesionales que necesitas.",
    },
    {
      icon: <div className="h-6 w-6 text-primary" />,
      title: "Evaluar",
      description: "Lee reseñas y calificaciones de otros usuarios.",
    },
    {
      icon: <div className="h-6 w-6 text-primary" />,
      title: "Agendar",
      description: "Programa citas y servicios directamente desde la app.",
    },
    {
      icon: <div className="h-6 w-6 text-primary" />,
      title: "Compartir",
      description: "Comparte tus experiencias y ayuda a otros a encontrar buenos profesionales.",
    },
    {
      icon: <div className="h-6 w-6 text-primary" />,
      title: "Seguridad",
      description: "Tus datos están protegidos con seguridad de nivel industrial.",
    },
  ]

  return (
    <section id="features" className="bg-muted py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Características
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Todo lo que necesitas para encontrar profesionales
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Nuestra app está diseñada para ayudarte a descubrir profesionales cerca de ti y conectarte con las
              personas adecuadas.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  )
}
