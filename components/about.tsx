import { Car, Check, Clock, Shield, Users } from "lucide-react"

export function About() {
  const perks = [
    "Flat weekly or monthly rate",
    "Unlimited miles",
    "Maintenance handled by us",
    "Fast help if something breaks",
  ]

  const stats = [
    {
      icon: Car,
      value: "50+",
      label: "Economy Vehicles",
      description: "Practical rental options"
    },
    {
      icon: Users,
      value: "2,500+",
      label: "Happy Customers",
      description: "And counting"
    },
    {
      icon: Shield,
      value: "10+",
      label: "Years Experience",
      description: "Trusted since 2014"
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Support",
      description: "Always available"
    },
  ]

  return (
    <section id="about" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <p className="text-sm uppercase tracking-[0.2em] text-accent mb-4">
            Why We&apos;re Here
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] mb-8 text-balance">
            Built for people who
            <br />
            <span className="italic">need to keep moving</span>
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>
              Your car&apos;s in the shop? Rentals cost too much. Borrowing a friend&apos;s car
              isn&apos;t working? We built Drive Boundless for people who can&apos;t afford to be
              without a car.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-foreground">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-accent" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <p>
              We&apos;re local to Gwinnett County. We keep it simple. We keep you moving. No
              credit games. No corporate runaround. Just the car you need to handle your business.
            </p>
            <p className="font-medium text-foreground">
              Drive Boundless - Your work depends on it. So do we.
            </p>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group relative"
            >
              <div className="absolute inset-0 bg-accent/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
              <div className="relative p-8 lg:p-10">
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <stat.icon className="w-5 h-5 text-accent" />
                  </div>
                </div>
                <p className="font-serif text-4xl lg:text-5xl font-medium text-foreground mb-2">
                  {stat.value}
                </p>
                <p className="text-foreground font-medium mb-1">
                  {stat.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </div>
              {/* Subtle border */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 pt-16 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-muted-foreground text-center md:text-left">
              Serving Lawrenceville, Gwinnett County, metro Atlanta, and customers across Georgia
            </p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i}
                    className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center"
                  >
                    <span className="text-xs font-medium text-muted-foreground">
                      {String.fromCharCode(64 + i)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <div className="flex items-center gap-1 text-accent">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">5.0 average rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
