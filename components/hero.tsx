import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Luxury car fleet"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-primary-foreground/60 mb-6">
          Drive Boundless Auto Solutions
        </p>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium text-primary-foreground leading-[1.1] mb-8 text-balance">
          Your journey,
          <br />
          <span className="italic">boundless</span>
        </h1>

        <p className="max-w-xl mx-auto text-lg text-primary-foreground/70 mb-12 text-pretty">
          Premium vehicle rentals with exceptional service. Whether for business
          or pleasure, we make every mile memorable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-base px-8 py-6"
          >
            <Link href="#vehicles">
              View Fleet
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-base px-8 py-6 border-primary-foreground/20 text-primary hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link href="#rent">Book Now</Link>
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/40">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-primary-foreground/20" />
      </div>
    </section>
  );
}
