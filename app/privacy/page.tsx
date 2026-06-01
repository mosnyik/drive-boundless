import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Drive Boundless Auto Solutions — how we collect, use, and protect your personal information.",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="py-24 lg:py-32 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-accent mb-4">Legal</p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium leading-[1.1] mb-6">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Effective date: May 1, 2026 &bull; Operated by Turchese Solutions LLC d/b/a Drive
              Boundless Auto Solutions
            </p>
          </div>

          <div className="space-y-10 text-sm leading-relaxed text-foreground">
            <section>
              <p className="text-muted-foreground">
                Turchese Solutions LLC d/b/a Drive Boundless Auto Solutions (&ldquo;we,&rdquo;
                &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard
                information you provide when you visit{" "}
                <span className="font-medium text-foreground">driveboundless.com</span> or submit
                a rental application.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">
                1. Information We Collect
              </h2>
              <p className="text-muted-foreground mb-4">
                We collect information you provide directly when submitting a rental application:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Identity information</strong> — full name,
                  date of birth
                </li>
                <li>
                  <strong className="text-foreground">Contact information</strong> — mailing
                  address, city, state, ZIP code, phone number, email address
                </li>
                <li>
                  <strong className="text-foreground">Driver&rsquo;s license information</strong>{" "}
                  — license number, issuing state, expiration date, and a copy of your license
                  image
                </li>
                <li>
                  <strong className="text-foreground">Insurance information</strong> — insurance
                  carrier name and policy number (optional at submission)
                </li>
                <li>
                  <strong className="text-foreground">Rental details</strong> — selected vehicle,
                  rental purpose, pick-up and return dates/times, mileage preference
                </li>
                <li>
                  <strong className="text-foreground">Additional driver information</strong> —
                  name, license number, and issuing state for any authorized additional drivers
                </li>
                <li>
                  <strong className="text-foreground">Agreement acceptance</strong> — timestamp
                  and acknowledgment of the rental agreement
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We also automatically collect limited technical data when you visit our website,
                such as your IP address, browser type, device type, and pages visited. This data is
                collected by Vercel Analytics and is used solely for site performance monitoring.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To evaluate and process your rental application</li>
                <li>To verify your identity and driver eligibility</li>
                <li>To contact you about your application, reservation, or rental</li>
                <li>To generate and maintain the rental agreement records required by Georgia law</li>
                <li>To process payments and collect amounts owed under the rental agreement</li>
                <li>To comply with applicable legal obligations</li>
                <li>To protect the safety and security of our vehicles and other customers</li>
              </ul>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">
                3. How We Share Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may
                share your information in the following limited circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Service providers</strong> — vendors who
                  assist us in operating our website or business (e.g., email delivery, analytics),
                  under confidentiality obligations
                </li>
                <li>
                  <strong className="text-foreground">Legal requirements</strong> — if required by
                  law, court order, or governmental authority
                </li>
                <li>
                  <strong className="text-foreground">Safety and fraud prevention</strong> — when
                  disclosure is necessary to protect the rights, property, or safety of the Company,
                  our customers, or the public
                </li>
                <li>
                  <strong className="text-foreground">Business transfers</strong> — in connection
                  with a merger, sale, or acquisition of all or part of our business
                </li>
              </ul>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">4. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information for as long as necessary to fulfill the purposes
                described in this policy, to comply with legal obligations (including Georgia motor
                vehicle and business record requirements), resolve disputes, and enforce our
                agreements. Driver&rsquo;s license images and rental agreement records are retained
                for a minimum of three (3) years following the close of the rental.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">5. Data Security</h2>
              <p className="text-muted-foreground">
                We implement reasonable administrative, technical, and physical safeguards to
                protect your personal information against unauthorized access, disclosure,
                alteration, and destruction. However, no method of transmission over the internet
                is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">6. Cookies & Tracking</h2>
              <p className="text-muted-foreground">
                Our website uses Vercel Analytics for anonymous, aggregate traffic analysis. We do
                not use cookies for advertising, behavioral tracking, or cross-site profiling. No
                personal information is stored in cookies on our site.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                You may contact us to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Request access to the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>
                  Request deletion of your information, subject to our legal retention obligations
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, contact us at{" "}
                <a
                  href="mailto:info@turcheseconsulting.com"
                  className="text-accent hover:underline"
                >
                  info@turcheseconsulting.com
                </a>
                . We will respond within a reasonable time and in accordance with applicable law.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">8. Children&rsquo;s Privacy</h2>
              <p className="text-muted-foreground">
                Our services are not directed to individuals under the age of 18. We do not
                knowingly collect personal information from minors. If you believe we have
                inadvertently collected information from a minor, please contact us immediately.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. The revised policy will be
                posted on this page with an updated effective date. Your continued use of our
                website or services after any changes constitutes your acceptance of the updated
                policy.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-medium mb-4">10. Contact Us</h2>
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
            <Link href="/" className="text-sm text-accent hover:underline">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
