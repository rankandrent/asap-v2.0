import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://asap-amatom.com'),
  title: {
    default: 'ASAP-Amatom.com - Official Amatom Parts Catalog | 500,000+ Parts',
    template: '%s | ASAP-Amatom.com'
  },
  description: 'Browse complete catalog of Amatom aerospace and industrial parts. 500,000+ parts across multiple categories including Standoffs, Fasteners, and more.',
  keywords: ['Amatom parts', 'aerospace parts', 'industrial parts', 'standoffs', 'fasteners', 'aviation parts'],
  authors: [{ name: 'ASAP-Amatom.com' }],
  creator: 'ASAP-Amatom.com',
  publisher: 'ASAP-Amatom.com',
  // Canonical URL - Next.js automatically generates per-page canonical
  // You can override it in individual page.tsx files using:
  // export const metadata = { alternates: { canonical: 'your-custom-url' } }
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://asap-amatom.com',
    title: 'ASAP-Amatom.com - Official Amatom Parts Catalog',
    description: 'Browse 500,000+ Amatom aerospace and industrial parts',
    siteName: 'ASAP-Amatom.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASAP-Amatom.com - Official Amatom Parts Catalog',
    description: 'Browse 500,000+ Amatom aerospace and industrial parts',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <noscript>
          <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff3cd', color: '#856404' }}>
            <strong>JavaScript Required:</strong> This website requires JavaScript to be enabled for full functionality. 
            Please enable JavaScript in your browser settings.
          </div>
        </noscript>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}

