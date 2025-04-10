"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Chances. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
            Términos
          </Link>
          <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
            Privacidad
          </Link>
          <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  )
}
