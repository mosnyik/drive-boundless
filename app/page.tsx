"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { VehicleFleet, type Vehicle } from "@/components/vehicle-fleet"
import { RentalForm } from "@/components/rental-form"
import { Footer } from "@/components/footer"

export default function Home() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    // Smooth scroll to rental form
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
        <VehicleFleet onSelectVehicle={handleSelectVehicle} />
        <RentalForm selectedVehicle={selectedVehicle} />
      </main>
      <Footer />
    </>
  )
}
