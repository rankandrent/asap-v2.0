import SEO from "../components/common/SEO"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Package, Clock, Headphones, Truck, Shield, CheckCircle } from "lucide-react"

export default function AboutUsPage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ASAP-Amatom.com",
    "description": "Solution-based system integrator offering custom-procurement, distribution, logistics, and project management solutions",
    "url": "https://asapamatom.netlify.app",
    "telephone": "+1-714-705-4780",
    "email": "quotes@asapamatom.netlify.app",
    "logo": "https://asapamatom.netlify.app/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "sameAs": []
  }

  return (
    <>
      <SEO
        title="About Us - ASAP-Amatom.com | Our Story & Services"
        description="ASAP Semiconductor is a solution-based system integrator offering custom-procurement, distribution, logistics, and project management solutions to Fortune 100 companies, FAA operators, DoD, OEMs, and more."
        canonical="https://asapamatom.netlify.app/about-us"
        keywords="about ASAP Semiconductor, aerospace parts distributor, defense contractor, logistics solutions, procurement services, FAA certified supplier"
        schema={organizationSchema}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            About ASAP-Amatom.com
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your strategic sourcing partner for simplified fulfillment and immediate solutions
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Company Overview */}
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-3xl font-bold text-gray-900">
                ASAP Semiconductor at a Glance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  Since our inception, we have established ourselves as a <strong>solution-based system integrator</strong> that offers custom-procurement, distribution, logistics, and project management solutions to <strong>Fortune 100 companies</strong>, <strong>FAA 121, 129, & 135 operators</strong>, the <strong>US Department of Defense</strong>, original equipment manufacturers (OEM), repair stations, and many others.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  We are more than just a simple distribution platform for part fulfillment; we are your <strong>strategic sourcing partner</strong> for simplified fulfillment, offering immediate solutions for requirements when other channels fail. We also provide the quickest shipping options while maintaining highly competitive pricing. <strong>You do not need to forgo quality or timeliness when you shop with us.</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Our Services */}
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="h-8 w-8 text-green-600" />
                Our Services
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service 1 */}
                <div className="flex gap-4 p-6 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-blue-600 rounded-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      24/7x365 Fulfillment & Sourcing
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Comprehensive fulfillment and sourcing for aerospace, defense, civil aviation, IT hardware, industrial parts, and board-level components. Available around the clock, every day of the year.
                    </p>
                  </div>
                </div>

                {/* Service 2 */}
                <div className="flex gap-4 p-6 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-purple-600 rounded-lg">
                      <Headphones className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Tailored Solutions & Consultation
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      One-on-one consultation to ensure that requirements are fulfilled and operations continue smoothly. Customized solutions tailored to your specific needs.
                    </p>
                  </div>
                </div>

                {/* Service 3 */}
                <div className="flex gap-4 p-6 bg-orange-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-orange-600 rounded-lg">
                      <Truck className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Customized Shipping Options
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Flexible shipping options to meet time constraints and AOG (Aircraft On Ground) situations. Express delivery and emergency shipping available.
                    </p>
                  </div>
                </div>

                {/* Service 4 */}
                <div className="flex gap-4 p-6 bg-teal-50 rounded-lg border border-teal-200 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-teal-600 rounded-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Lot Management & Consignment
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Help you eliminate excess inventory with maximized returns. Professional lot management and consignment services to optimize your inventory strategy.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why Choose Us */}
          <Card className="border-2 border-indigo-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-indigo-600" />
                Why Choose Us
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <div className="text-4xl font-bold text-blue-600 mb-2">Fortune 100</div>
                  <div className="text-gray-700 font-medium">Trusted Partner</div>
                  <p className="text-sm text-gray-600 mt-2">Serving Fortune 100 companies with excellence</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                  <div className="text-4xl font-bold text-green-600 mb-2">FAA</div>
                  <div className="text-gray-700 font-medium">Certified Supplier</div>
                  <p className="text-sm text-gray-600 mt-2">Authorized for FAA 121, 129, & 135 operators</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-4xl font-bold text-purple-600 mb-2">DoD</div>
                  <div className="text-gray-700 font-medium">Government Contractor</div>
                  <p className="text-sm text-gray-600 mt-2">US Department of Defense approved supplier</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0 shadow-xl">
            <CardContent className="pt-12 pb-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Contact us today to discuss your sourcing needs and discover how we can help streamline your operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+17147054780"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  📞 Call: +1 (714) 705-4780
                </a>
                <a
                  href="mailto:quotes@asapamatom.netlify.app"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-900 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-white/30"
                >
                  📧 Email Us
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

