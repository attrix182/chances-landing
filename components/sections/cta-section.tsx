"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function CTASection() {
  return (
    <section id="cta" className="py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              ¿Listo para encontrar profesionales?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Descarga nuestra app hoy y comienza a descubrir profesionales cerca de ti.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button size="lg" className="gap-1.5">
              <Download className="h-5 w-5" />
              Descargar para iOS
            </Button>
            <Button size="lg" variant="outline">
              Descargar para Android
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
