import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif'
});
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://driveboundless.com'),
  title: {
    default: 'Drive Boundless Auto Solutions | Luxury Car Rentals in Lawrenceville, GA',
    template: '%s | Drive Boundless Auto Solutions',
  },
  description: 'Drive Boundless Auto Solutions provides premium and luxury car rentals in Lawrenceville, Gwinnett County, and metro Atlanta with a curated fleet, flexible booking, and professional service.',
  keywords: [
    'luxury car rental Lawrenceville GA',
    'premium car rental Gwinnett County',
    'Atlanta luxury car rental',
    'executive car rental Georgia',
    'Drive Boundless Auto Solutions',
    'Turchese Solutions LLC',
    'car rental Lawrenceville GA',
  ],
  applicationName: 'Drive Boundless Auto Solutions',
  authors: [{ name: 'Drive Boundless Auto Solutions' }],
  creator: 'Drive Boundless Auto Solutions',
  publisher: 'Drive Boundless Auto Solutions',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Drive Boundless Auto Solutions | Luxury Car Rentals in Lawrenceville, GA',
    description: 'Premium vehicle rentals for business travel, special occasions, and everyday driving across Lawrenceville, Gwinnett County, and metro Atlanta.',
    url: '/',
    siteName: 'Drive Boundless Auto Solutions',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Premium rental vehicles from Drive Boundless Auto Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drive Boundless Auto Solutions | Luxury Car Rentals in Lawrenceville, GA',
    description: 'Premium and luxury vehicle rentals serving Lawrenceville, Gwinnett County, and metro Atlanta.',
    images: ['/images/hero-bg.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" richColors closeButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
