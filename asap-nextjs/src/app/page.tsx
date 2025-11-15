import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCategories } from '@/lib/queries-server'
import { FileText, Headphones, ShoppingCart, Shield, Truck, Wrench, Clock, Award, Search, Building2, Plane, StarIcon, Quote } from "lucide-react"

// ISR: Revalidate every hour
export const revalidate = 3600

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'ASAP-Amatom.com - Official Amatom Parts Catalog | 500,000+ Parts',
  description: 'Browse complete catalog of Amatom aerospace and industrial parts. 500,000+ parts across multiple categories including Standoffs, Fasteners, and more. Official Amatom manufacturer parts.',
  keywords: 'Amatom parts, aerospace parts, industrial parts, standoffs, fasteners, Amatom catalog, aviation parts, 500000 parts',
  alternates: {
    canonical: 'https://asap-amatom.com/',
  },
  openGraph: {
    title: 'ASAP-Amatom.com - Official Amatom Parts Catalog | 500,000+ Parts',
    description: 'Browse complete catalog of Amatom aerospace and industrial parts. 500,000+ parts.',
    url: 'https://asap-amatom.com/',
    type: 'website',
    images: [
      {
        url: 'https://asap-amatom.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ASAP-Amatom Parts Catalog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASAP-Amatom.com - Official Amatom Parts Catalog',
    description: 'Browse 500,000+ Amatom aerospace and industrial parts',
  },
}

export default async function HomePage() {
  // Fetch categories on the server (cached)
  const categories = await getCategories('Amatom')

  // JSON-LD structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ASAP-Amatom.com",
    "description": "Official Amatom Parts Catalog - 500,000+ aerospace and industrial parts",
    "url": "https://asap-amatom.com",
    "logo": "https://asap-amatom.com/logo.png",
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ASAP-Amatom.com",
    "url": "https://asap-amatom.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://asap-amatom.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, websiteSchema]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />

      {/* Hero Section with Image */}
      <section className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden mb-16 -mt-4">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image 
            src="/image/2.jpeg" 
            alt="ASAP-Amatom Building - Official Amatom Parts Catalog"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-blue-800/75 to-blue-900/85"></div>
          {/* Additional overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-4xl">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 drop-shadow-2xl">
                ASAP-Amatom.com
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl text-blue-100 mb-8 font-medium leading-relaxed animate-fade-in">
              Official Amatom Parts Catalog
              <br />
              <span className="text-lg md:text-xl text-white/90">
                500,000+ Aerospace & Industrial Parts
              </span>
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl animate-fade-in">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">500,000+</div>
                <div className="text-sm md:text-base text-blue-100 font-medium">Parts Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">Amatom</div>
                <div className="text-sm md:text-base text-blue-100 font-medium">Manufacturer</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm md:text-base text-blue-100 font-medium">Catalog Access</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Link
                href="/search"
                className="inline-flex items-center justify-center px-10 py-5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-blue-300/50 hover:scale-110 text-lg transform hover:-translate-y-1"
              >
                🔍 Search Parts
              </Link>
              <Link
                href="/#categories"
                className="inline-flex items-center justify-center px-10 py-5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-2xl hover:shadow-blue-400/50 hover:scale-110 border-2 border-white/40 text-lg transform hover:-translate-y-1"
              >
                📦 Browse Catalog
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">

        {/* Browse by Category Section */}
        <section id="categories" className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-600">
                  {category.subcategoryCount} subcategories
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Services Section - Simplified for brevity, you can add the full content */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-3 text-gray-900">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for all your aerospace and industrial parts needs
            </p>
          </div>
          {/* Add service cards here - truncated for brevity */}
        </section>
      </div>
    </>
  )
}

