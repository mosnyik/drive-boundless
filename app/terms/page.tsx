import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Drive Boundless Auto Solutions — economy car rentals in Lawrenceville, GA, operated by Turchese Solutions LLC.",
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="py-24 lg:py-32 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-accent mb-4">Legal</p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium leading-[1.1] mb-6">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Effective date: May 1, 2026 &bull; Operated by Turchese Solutions LLC d/b/a Drive
              Boundless Auto Solutions
            </p>
          </div>

          <div className="prose prose-neutral max-w-none space-y-10 text-sm leading-relaxed text-foreground">
            <section>
              <p className="text-muted-foreground">
                These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the Drive Boundless
                Auto Solutions website located at{" "}
                <span className="font-medium text-foreground">driveboundless.com</span> and any
                rental services provided by Turchese Solutions LLC d/b/a Drive Boundless Auto
                Solutions (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;). By using this website or submitting a rental application, you
                agree to be bound by these Terms.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">1. Services</h2>
              <p className="text-muted-foreground">
                Drive Boundless Auto Solutions provides short-term economy vehicle rentals in
                Lawrenceville, Gwinnett County, and the greater Atlanta metropolitan area. All
                rentals are subject to vehicle availability, renter eligibility, and approval by the
                Company. Submission of a rental application does not guarantee a reservation.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">2. Renter Eligibility</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You must be at least 23 years old to rent a vehicle.</li>
                <li>All additional authorized drivers must be at least 25 years old.</li>
                <li>
                  You must hold a valid, non-expired driver&rsquo;s license issued by a U.S. state
                  or territory.
                </li>
                <li>
                  You must provide proof of valid personal auto insurance covering the rental
                  vehicle, personal injury, and property damage. Turchese Solutions LLC must be
                  listed as an additional interested party on your policy.
                </li>
                <li>
                  You must complete and sign the Georgia Motor Vehicle Rental Agreement prior to
                  vehicle pickup.
                </li>
              </ul>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">
                3. Rental Agreement & Fees
              </h2>
              <p className="text-muted-foreground mb-4">
                Each rental is governed by a separate Georgia Motor Vehicle Rental Agreement
                presented at the time of booking. Key terms include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  A refundable security deposit of $50 is due at vehicle pickup. The deposit may be
                  forfeited for damage, smoking violations, missed payments, or early termination.
                </li>
                <li>Weekly payments are due by 5:00 PM on the agreed payment day.</li>
                <li>A $50 late fee applies per day for overdue payments. Repossession may occur on Day 2.</li>
                <li>
                  If a vehicle is returned before the rental week ends, the full weekly payment
                  remains due.
                </li>
                <li>
                  A $60 interior cleaning fee applies if the vehicle requires excessive cleaning
                  beyond standard post-rental procedures.
                </li>
                <li>A $300 replacement fee applies if the key or key fob is not returned.</li>
                <li>
                  Renter is responsible for a $1,000 deductible for damage to the vehicle when
                  using Company insurance.
                </li>
                <li>
                  Out-of-state travel is prohibited without prior written approval. Unauthorized
                  out-of-state use may result in the vehicle being reported stolen.
                </li>
              </ul>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">4. Prohibited Uses</h2>
              <p className="text-muted-foreground mb-4">
                The following uses automatically void all liability protections and may terminate
                the rental agreement:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Operating the vehicle by unauthorized drivers</li>
                <li>Using the vehicle for hire (rideshare, taxi, or delivery) without prior approval</li>
                <li>Towing, racing, or off-road driving</li>
                <li>Driving under the influence of alcohol or drugs</li>
                <li>Any illegal activity involving the vehicle</li>
                <li>Reckless or negligent driving</li>
                <li>Failing to report an accident to the Company and law enforcement</li>
                <li>Leaving keys in an unattended vehicle</li>
                <li>Use of a handheld device while driving</li>
                <li>Smoking or vaping inside the vehicle</li>
              </ul>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">
                5. Cancellations & Refunds
              </h2>
              <p className="text-muted-foreground">
                There are no refunds for cancellations once a vehicle has been reserved. If
                mechanical failure occurs due to Company negligence, reasonable efforts will be made
                to extend the rental term or provide a substitute vehicle. Early termination by the
                renter results in forfeiture of the security deposit.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on this website — including text, graphics, logos, and images — is the
                property of Turchese Solutions LLC or its content suppliers. You may not reproduce,
                distribute, or create derivative works without our prior written consent.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">
                7. Disclaimer of Warranties
              </h2>
              <p className="text-muted-foreground">
                This website and its content are provided &ldquo;as is&rdquo; without warranties of
                any kind, express or implied. We do not warrant that the site will be uninterrupted,
                error-free, or free of viruses or other harmful components. Vehicle availability and
                pricing displayed on the site are subject to change without notice.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-muted-foreground">
                To the fullest extent permitted by Georgia law, Turchese Solutions LLC shall not be
                liable for any indirect, incidental, special, consequential, or punitive damages
                arising out of your use of the website or rental services. Our total liability to
                you for any claim shall not exceed the amount you paid for the rental in question.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">9. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless Turchese Solutions LLC, its officers,
                employees, and agents from any claims, damages, losses, and expenses — including
                reasonable attorney&rsquo;s fees — arising out of your use of the vehicle or
                violation of these Terms.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">10. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms are governed by and construed in accordance with the laws of the State
                of Georgia. Any disputes arising under these Terms shall be resolved in the courts
                of Gwinnett County, Georgia.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">11. Changes to These Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to update these Terms at any time. Changes apply only to
                future rentals after notice has been given. Continued use of the website following
                any changes constitutes your acceptance of the revised Terms.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">12. Contact Us</h2>
              <address className="not-italic text-muted-foreground space-y-1">
                <p>Turchese Solutions LLC d/b/a Drive Boundless Auto Solutions</p>
                <p>267 Langley Drive, Suite 1438</p>
                <p>Lawrenceville, GA 30046</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:info@turcheseconsulting.com"
                    className="text-accent hover:underline"
                  >
                    info@turcheseconsulting.com
                  </a>
                </p>
                <p>Phone: +1 929-213-5106</p>
              </address>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link
              href="/"
              className="text-sm text-accent hover:underline"
            >
              &larr; Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
