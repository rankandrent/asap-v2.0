import { useEffect } from "react"
import { useCategories } from "../hooks/useCategories"
import CategoryGrid from "../components/categories/CategoryGrid"
import ManufacturerSelector from "../components/manufacturer/ManufacturerSelector"
import SEO from "../components/common/SEO"
import { FileText, Headphones, ShoppingCart, Shield, Truck, Wrench, Clock, Award, Search, Building2, Plane, StarIcon, Quote } from "lucide-react"
import { Card, CardContent } from "../components/ui/card"

export default function HomePage() {
  const { data: categories, isLoading, error, isError } = useCategories()
  
  // Debug logging
  useEffect(() => {
    console.log('HomePage: Categories state:', {
      isLoading,
      isError,
      error: error?.message,
      categoriesCount: categories?.length || 0,
      categories: categories?.map(c => c.name)
    })
  }, [categories, isLoading, error, isError])

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ASAP-Amatom.com",
    "description": "Official Amatom Parts Catalog - 500,000+ aerospace and industrial parts",
    "url": "https://asap-amatom.com",
    "logo": "https://asap-amatom.com/logo.png",
    "sameAs": []
  }

  // Website Schema
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
      <SEO
        title="ASAP-Amatom.com - Official Amatom Parts Catalog | 500,000+ Parts"
        description="Browse complete catalog of Amatom aerospace and industrial parts. 500,000+ parts across multiple categories including Standoffs, Fasteners, and more. Official Amatom manufacturer parts."
        canonical="https://asap-amatom.com/"
        keywords="Amatom parts, aerospace parts, industrial parts, standoffs, fasteners, Amatom catalog, aviation parts, 500000 parts"
        schema={combinedSchema}
      />

      {/* Hero Section with Image */}
      <section className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden mb-16 -mt-4">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="/image/2.jpeg" 
            alt="ASAP-Amatom Building - Official Amatom Parts Catalog" 
            className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" style={{ animation: 'fade-in 1s ease-out' }}>
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 drop-shadow-2xl">
                ASAP-Amatom.com
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl text-blue-100 mb-8 font-medium leading-relaxed" style={{ animation: 'fade-in 1.2s ease-out' }}>
              Official Amatom Parts Catalog
              <br />
              <span className="text-lg md:text-xl text-white/90">
                500,000+ Aerospace & Industrial Parts
              </span>
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl" style={{ animation: 'fade-in 1.4s ease-out' }}>
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
            <div className="flex flex-col sm:flex-row gap-4" style={{ animation: 'fade-in 1.6s ease-out' }}>
              <a
                href="/search"
                className="inline-flex items-center justify-center px-10 py-5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-blue-300/50 hover:scale-110 text-lg transform hover:-translate-y-1"
              >
                🔍 Search Parts
              </a>
              <a
                href="/categories"
                className="inline-flex items-center justify-center px-10 py-5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-2xl hover:shadow-blue-400/50 hover:scale-110 border-2 border-white/40 text-lg transform hover:-translate-y-1"
              >
                📦 Browse Catalog
              </a>
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

        {/* Manufacturer Selector */}
        <ManufacturerSelector />

        {/* Browse by Category Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <CategoryGrid 
            categories={categories || []} 
            isLoading={isLoading}
            error={error as Error | null}
          />
        </section>

        {/* Our Services Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-3 text-gray-900">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for all your aerospace and industrial parts needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1 - Quick RFQ */}
            <Card className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 group-hover:scale-110 transition-transform">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Quick RFQ Processing</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Get competitive quotes within 24 hours for single or bulk orders. Fast, reliable, and transparent pricing.
                </p>
              </CardContent>
            </Card>

            {/* Service 2 - Technical Support */}
            <Card className="border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 group-hover:scale-110 transition-transform">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Technical Support</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Expert technical assistance for product selection, specifications, and application guidance from our experienced team.
                </p>
              </CardContent>
            </Card>

            {/* Service 3 - Bulk Orders */}
            <Card className="border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 group-hover:scale-110 transition-transform">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Bulk Orders</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Special pricing and dedicated support for large volume orders. Perfect for OEMs and distributors.
                </p>
              </CardContent>
            </Card>

            {/* Service 4 - Quality Assurance */}
            <Card className="border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Quality Assurance</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  100% genuine Amatom parts. Every component is inspected and meets strict OEM specifications.
                </p>
              </CardContent>
            </Card>

            {/* Service 5 - Fast Shipping */}
            <Card className="border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 group-hover:scale-110 transition-transform">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Worldwide Shipping</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Fast and reliable shipping to anywhere in the world. Track your order every step of the way.
                </p>
              </CardContent>
            </Card>

            {/* Service 6 - Custom Solutions */}
            <Card className="border-2 border-pink-100 hover:border-pink-300 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 group-hover:scale-110 transition-transform">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Custom Solutions</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Need something specific? Our engineering team can help with custom specifications and modifications.
                </p>
              </CardContent>
            </Card>

            {/* Service 7 - 24/7 Access */}
            <Card className="border-2 border-teal-100 hover:border-teal-300 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">24/7 Catalog Access</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Browse our complete catalog anytime, anywhere. Search 500,000+ parts at your convenience.
                </p>
              </CardContent>
            </Card>

            {/* Service 8 - Certified Parts */}
            <Card className="border-2 border-yellow-100 hover:border-yellow-300 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Certified & Compliant</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  All parts meet aerospace and industrial standards. Full documentation and certifications available.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl mb-6 text-blue-100">
              Join thousands of satisfied customers who trust ASAP-Amatom for their parts needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/search"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                🔍 Search Parts
              </a>
              <a
                href="/categories"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors"
              >
                📦 Browse Catalog
              </a>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16 py-12 bg-white">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-3 text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the parts you need in 4 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center relative">
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-bold shadow-lg">
                1
              </div>
              <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">Search or Browse</h3>
              <p className="text-gray-600 text-sm">Search by part number or browse our 500,000+ parts catalog</p>
            </div>
            <div className="text-center relative">
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white text-2xl font-bold shadow-lg">
                2
              </div>
              <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">Request Quote</h3>
              <p className="text-gray-600 text-sm">Submit RFQ with quantity and requirements</p>
            </div>
            <div className="text-center relative">
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white text-2xl font-bold shadow-lg">
                3
              </div>
              <Headphones className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">Get Quote</h3>
              <p className="text-gray-600 text-sm">Receive competitive pricing within 24 hours</p>
            </div>
            <div className="text-center relative">
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white text-2xl font-bold shadow-lg">
                4
              </div>
              <Truck className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">Order & Ship</h3>
              <p className="text-gray-600 text-sm">Place order and receive fast worldwide shipping</p>
            </div>
          </div>
        </section>

        {/* Client Logos / Partners Section */}
        <section className="mb-16 py-12 bg-gray-50 rounded-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Trusted By Industry Leaders</h2>
            <p className="text-gray-600">Serving Fortune 100 companies, government agencies, and leading OEMs</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="border border-gray-200 bg-white p-8 text-center hover:shadow-md transition-shadow">
              <CardContent>
                <Building2 className="h-16 w-16 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-700">Fortune 100</h3>
                <p className="text-xs text-gray-500 mt-1">Enterprise Clients</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 bg-white p-8 text-center hover:shadow-md transition-shadow">
              <CardContent>
                <Plane className="h-16 w-16 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-700">FAA Operators</h3>
                <p className="text-xs text-gray-500 mt-1">121, 129, 135 Certified</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 bg-white p-8 text-center hover:shadow-md transition-shadow">
              <CardContent>
                <Shield className="h-16 w-16 text-purple-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-700">US Department</h3>
                <p className="text-xs text-gray-500 mt-1">of Defense</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 bg-white p-8 text-center hover:shadow-md transition-shadow">
              <CardContent>
                <Wrench className="h-16 w-16 text-orange-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-700">OEMs & Repair</h3>
                <p className="text-xs text-gray-500 mt-1">Stations Worldwide</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-16 py-12 bg-white">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-3 text-gray-900">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by industry leaders worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-white shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-blue-400 mb-3" />
                <p className="text-gray-700 mb-4 italic">
                  "ASAP-Amatom has been our go-to partner for critical aerospace components. Their 24/7 support and fast fulfillment have saved us multiple times during AOG situations."
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">John Smith</p>
                  <p className="text-sm text-gray-600">Procurement Manager, Fortune 100 Aerospace</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-gray-200 bg-gradient-to-br from-green-50 to-white shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-green-400 mb-3" />
                <p className="text-gray-700 mb-4 italic">
                  "The quality and documentation provided with every order exceeds our expectations. As a DoD contractor, we rely on ASAP-Amatom for compliant sourcing."
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Supply Chain Director, Defense Contractor</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-gray-200 bg-gradient-to-br from-purple-50 to-white shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-purple-400 mb-3" />
                <p className="text-gray-700 mb-4 italic">
                  "Their competitive pricing and extensive catalog have significantly reduced our sourcing time. Highly recommend for any FAA operator."
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">Mike Chen</p>
                  <p className="text-sm text-gray-600">Operations Manager, Regional Airline</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="mb-16">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl">
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-8">
                <Headphones className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-3 text-gray-900">Get In Touch</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our team is ready to assist with your sourcing needs 24/7
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                  <div className="text-3xl mb-3">📞</div>
                  <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                  <a href="tel:+17147054780" className="text-blue-600 hover:underline font-semibold">
                    +1 (714) 705-4780
                  </a>
                  <p className="text-sm text-gray-600 mt-2">24/7 Available</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                  <div className="text-3xl mb-3">📧</div>
                  <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                  <a href="mailto:quotes@asap-amatom.com" className="text-blue-600 hover:underline font-semibold text-sm">
                    quotes@asap-amatom.com
                  </a>
                  <p className="text-sm text-gray-600 mt-2">Quick Response</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                  <div className="text-3xl mb-3">⏰</div>
                  <h3 className="font-bold text-gray-900 mb-2">Hours</h3>
                  <p className="text-gray-700 font-semibold">24/7/365</p>
                  <p className="text-sm text-gray-600 mt-2">Always Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  )
}

