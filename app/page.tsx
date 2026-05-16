import { HomePageClient } from "@/components/home-page-client"
import { getVehicles } from "@/lib/vehicles"

export default async function Home() {
  const vehicles = await getVehicles()
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "AutoRental"],
        "@id": "https://driveboundless.com/#business",
        name: "Drive Boundless Auto Solutions",
        alternateName: "Turchese Solutions LLC",
        url: "https://driveboundless.com",
        email: "info@turcheseconsulting.com",
        telephone: "+14704030704",
        image: "https://driveboundless.com/images/hero-bg.jpg",
        description:
          "Affordable economy car rentals serving Lawrenceville, Gwinnett County, and metro Atlanta.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "267 Langley Drive, Suite 1438",
          addressLocality: "Lawrenceville",
          addressRegion: "GA",
          postalCode: "30046",
          addressCountry: "US",
        },
        areaServed: [
          "Lawrenceville GA",
          "Gwinnett County GA",
          "Metro Atlanta GA",
          "Georgia",
        ],
        priceRange: "$$",
        makesOffer: {
          "@type": "OfferCatalog",
          name: "Economy car rental fleet",
          itemListElement: vehicles.slice(0, 12).map((vehicle) => ({
            "@type": "Offer",
            name: `${vehicle.year} ${vehicle.make} ${vehicle.model} rental`,
            price: vehicle.pricePerDay,
            priceCurrency: "USD",
            availability: vehicle.available
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            itemOffered: {
              "@type": "Car",
              name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
              manufacturer: vehicle.make,
              model: vehicle.model,
              vehicleModelDate: String(vehicle.year),
              color: vehicle.color,
              seatingCapacity: vehicle.seats,
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://driveboundless.com/#website",
        url: "https://driveboundless.com",
        name: "Drive Boundless Auto Solutions",
        publisher: {
          "@id": "https://driveboundless.com/#business",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePageClient vehicles={vehicles} />
    </>
  )
}
