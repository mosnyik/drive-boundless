import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-2xl font-semibold">
              Drive Boundless
            </Link>
            <p className="mt-4 text-primary-foreground/70 max-w-md leading-relaxed">
              Drive Boundless Auto Solutions - affordable economy car rentals for everyday
              transportation across Lawrenceville, Gwinnett County, and metro Atlanta.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-3 text-primary-foreground/70">
              <li>
                <Link href="#about" className="hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#vehicles" className="hover:text-primary-foreground transition-colors">
                  Our Fleet
                </Link>
              </li>
              <li>
                <Link href="#rent" className="hover:text-primary-foreground transition-colors">
                  Rent Now
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-3 text-primary-foreground/70">
              <li>info@turcheseconsulting.com</li>
              <li>(470) 403-0704</li>
              <li>
                267 Langley Drive
                <br />
                Suite 1438
                <br />
                Lawrenceville, GA 30046
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-primary-foreground/50">
            <p>© {new Date().getFullYear()} Drive Boundless Auto Solutions. All rights reserved.</p>
            <p className="mt-1">
              Developed by Zorex Tech · WhatsApp:{" "}
              <a
                href="https://wa.me/2349076407315"
                className="hover:text-primary-foreground transition-colors"
              >
                +234 907 640 7315
              </a>
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-primary-foreground/50">
            <Link href="/privacy" className="hover:text-primary-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
