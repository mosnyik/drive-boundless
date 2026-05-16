"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { VehicleFleet, type Vehicle } from "@/components/vehicle-fleet"
import { RentalForm } from "@/components/rental-form"
import { Footer } from "@/components/footer"

interface HomePageClientProps {
  vehicles: Vehicle[]
}

export function HomePageClient({ vehicles }: HomePageClientProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setTimeout(() => {
      document.getElementById("rent")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <VehicleFleet vehicles={vehicles} onSelectVehicle={handleSelectVehicle} />
        <RentalForm selectedVehicle={selectedVehicle} />
      </main>
      <Footer />
    </>
  )
}
