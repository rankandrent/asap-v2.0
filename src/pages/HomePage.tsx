import { useCategories } from "../hooks/useCategories"
import CategoryGrid from "../components/categories/CategoryGrid"
import LoadingSpinner from "../components/common/LoadingSpinner"
import SEO from "../components/common/SEO"
import { FileText, Headphones, ShoppingCart, Shield, Truck, Wrench, Clock, Award } from "lucide-react"
import { Card, CardContent } from "../components/ui/card"

export default function HomePage() {
  const { data: categories, isLoading, error } = useCategories()

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ASAPAmatom.com",
    "description": "Official Amatom Parts Catalog - 500,000+ aerospace and industrial parts",
    "url": "https://asapamatom.netlify.app",
    "logo": "https://asapamatom.netlify.app/logo.png",
    "sameAs": []
  }

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ASAPAmatom.com",
    "url": "https://asapamatom.netlify.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://asapamatom.netlify.app/search?q={search_term_string}",
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
        title="ASAPAmatom.com - Official Amatom Parts Catalog | 500,000+ Parts"
        description="Browse complete catalog of Amatom aerospace and industrial parts. 500,000+ parts across multiple categories including Standoffs, Fasteners, and more. Official Amatom manufacturer parts."
        canonical="https://asapamatom.netlify.app/"
        keywords="Amatom parts, aerospace parts, industrial parts, standoffs, fasteners, Amatom catalog, aviation parts, 500000 parts"
        schema={combinedSchema}
      />

      <div className="container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to ASAPAmatom.com
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Official Amatom Parts Catalog
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-4 bg-card rounded-lg">
              <div className="text-3xl font-bold text-primary">500,000+</div>
              <div className="text-sm text-muted-foreground">Parts Available</div>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <div className="text-3xl font-bold text-primary">Amatom</div>
              <div className="text-sm text-muted-foreground">Manufacturer</div>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Catalog Access</div>
            </div>
          </div>
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
              Join thousands of satisfied customers who trust ASAPAmatom for their parts needs
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

        <section>
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : error ? (
            <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Database Connection Required</h3>
              <p className="text-muted-foreground mb-4">
                Please configure your Supabase credentials in the .env file
              </p>
              <div className="text-sm text-left max-w-2xl mx-auto bg-white p-4 rounded border">
                <p className="font-mono mb-2">Required in .env file:</p>
                <pre className="text-xs">
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
                </pre>
              </div>
            </div>
          ) : (
            <CategoryGrid categories={categories || []} />
          )}
        </section>
      </div>
    </>
  )
}

