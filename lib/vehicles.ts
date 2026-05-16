import { sanityFetch } from "@/lib/sanity"
import type { Vehicle } from "@/components/vehicle-fleet"

const vehiclesQuery = `*[_type == "vehicle"] | order(coalesce(orderRank, sortOrder, year) desc) {
  "id": _id,
  make,
  model,
  year,
  "miles": coalesce(miles, mileage, odometer),
  color,
  "pricePerDay": coalesce(pricePerDay, dailyRate, rate),
  "minRentalDays": coalesce(minRentalDays, minimumRentalDays, 1),
  "deliveryFee": coalesce(deliveryFee, 0),
  "pickupTimes": coalesce(pickupTimes, pickupTime, "9 AM - 6 PM"),
  "fuelType": coalesce(fuelType, fuel, "Premium"),
  "seats": coalesce(seats, seatCount, 5),
  "image": coalesce(image.asset->url, mainImage.asset->url, images[0].asset->url),
  "available": coalesce(available, isAvailable, true)
}`

type SanityVehicle = Partial<Vehicle> & {
  id?: string
}

function toNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function toString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback
}

function normalizePickupTimes(value: unknown) {
  return toString(value, "9 AM - 6 PM").replace(/\b(\d{1,2})(?::(\d{2}))?\s*([ap])\.?\s*m\.?\b/gi, (_, hour, minutes, meridiem) => {
    const time = minutes ? `${hour}:${minutes}` : hour

    return `${time} ${String(meridiem).toUpperCase()}M`
  })
}

function normalizeVehicle(vehicle: SanityVehicle): Vehicle | null {
  const make = toString(vehicle.make, "")
  const model = toString(vehicle.model, "")

  if (!vehicle.id || !make || !model) {
    return null
  }

  return {
    id: vehicle.id,
    make,
    model,
    year: toNumber(vehicle.year, new Date().getFullYear()),
    miles: toNumber(vehicle.miles, 0),
    color: toString(vehicle.color, "Not specified"),
    pricePerDay: toNumber(vehicle.pricePerDay, 0),
    minRentalDays: toNumber(vehicle.minRentalDays, 1),
    deliveryFee: toNumber(vehicle.deliveryFee, 0),
    pickupTimes: normalizePickupTimes(vehicle.pickupTimes),
    fuelType: toString(vehicle.fuelType, "Premium"),
    seats: toNumber(vehicle.seats, 5),
    image: typeof vehicle.image === "string" ? vehicle.image : undefined,
    available: vehicle.available !== false,
  }
}

export async function getVehicles() {
  const vehicles = await sanityFetch<SanityVehicle[]>(vehiclesQuery)

  return (vehicles ?? [])
    .map(normalizeVehicle)
    .filter((vehicle): vehicle is Vehicle => vehicle !== null)
}
