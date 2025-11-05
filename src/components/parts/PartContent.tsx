import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import type { Part } from "../../types/part"

interface PartContentProps {
  part: Part
}

export default function PartContent({ part }: PartContentProps) {
  // Generate dynamic content based on part data
  const generateOverview = () => {
    const category = part.category || "parts"
    
    return `The ${part.productname} is a high-quality ${part.sub_category.toLowerCase()} manufactured by ${part.manufacturer}. 
    This precision-engineered component belongs to our ${category} category and is designed for aerospace and industrial applications 
    where reliability and performance are critical. ${part.description} represents the industry standard for quality and durability.`
  }

  const generateTechnicalInfo = () => {
    const specs = part.specifications || {}
    const hasSpecs = Object.keys(specs).length > 0
    
    return `This ${part.sub_category} features ${hasSpecs ? 'advanced specifications' : 'industry-standard design'} 
    that ensure optimal performance in demanding environments. Built with precision manufacturing techniques, this part meets 
    or exceeds all relevant industry standards. The ${part.productname} is specifically designed for ${part.category.toLowerCase()} 
    applications, providing excellent reliability and long service life.`
  }

  const generateApplications = () => {
    const category = part.category.toLowerCase()
    
    const applications = {
      standoffs: [
        "Circuit board mounting and spacing",
        "Electronic equipment assembly",
        "Panel mounting applications",
        "Equipment enclosure construction",
        "Rack mounting systems",
        "Aerospace instrumentation",
        "Industrial control panels"
      ],
      fasteners: [
        "Structural assembly",
        "Panel attachment",
        "Equipment mounting",
        "Aerospace applications",
        "Automotive assembly",
        "Industrial machinery",
        "Marine equipment"
      ]
    }
    
    const categoryApps = applications[category as keyof typeof applications] || [
      "Industrial equipment assembly",
      "Aerospace applications",
      "Manufacturing processes",
      "Maintenance and repair",
      "Custom fabrication projects"
    ]
    
    return categoryApps
  }

  const generateMaterialInfo = () => {
    const subcategory = part.sub_category.toLowerCase()
    let material = "high-grade material"
    let properties = []
    
    if (subcategory.includes("aluminum")) {
      material = "aerospace-grade aluminum alloy"
      properties = [
        "Lightweight yet durable construction",
        "Excellent corrosion resistance",
        "Good thermal conductivity",
        "Non-magnetic properties",
        "Easy to machine and fabricate"
      ]
    } else if (subcategory.includes("stainless steel") || subcategory.includes("steel")) {
      material = "stainless steel (typically 300 series)"
      properties = [
        "Superior strength and durability",
        "Excellent corrosion resistance",
        "High temperature tolerance",
        "Magnetic or non-magnetic options",
        "Long-lasting performance"
      ]
    } else if (subcategory.includes("brass")) {
      material = "brass alloy"
      properties = [
        "Excellent corrosion resistance",
        "Good electrical conductivity",
        "Antimicrobial properties",
        "Easy to machine",
        "Aesthetic appeal"
      ]
    } else {
      properties = [
        "High-quality construction",
        "Durability and reliability",
        "Industry-standard compliance",
        "Precision manufacturing",
        "Long service life"
      ]
    }
    
    return { material, properties }
  }

  const generateFeatures = () => {
    const features = [
      `Manufactured by ${part.manufacturer} - a trusted name in the industry`,
      `Precision-engineered ${part.sub_category.toLowerCase()} design`,
      `Meets or exceeds industry standards for ${part.category.toLowerCase()}`,
      "Quality control tested for reliability",
      "Consistent dimensions and tolerances"
    ]
    
    if (part.certifications && part.certifications.length > 0) {
      features.push(`Certified: ${part.certifications.join(", ")}`)
    }
    
    if (part.availability_status === "In Stock") {
      features.push("Available for immediate shipment")
    }
    
    return features
  }

  const generateInstallation = () => {
    const category = part.category.toLowerCase()
    
    if (category.includes("standoff")) {
      return {
        title: "Installation Guidelines",
        steps: [
          "Verify hole alignment and spacing before installation",
          "Ensure mounting surface is clean and free of debris",
          "Hand-thread the standoff initially to prevent cross-threading",
          "Tighten to manufacturer's recommended torque specifications",
          "Use appropriate tools to avoid damage to threads or finish",
          "Verify proper thread engagement for secure mounting",
          "Check alignment after installation"
        ]
      }
    }
    
    return {
      title: "Installation & Usage Guidelines",
      steps: [
        "Review product specifications before installation",
        "Ensure compatibility with your application",
        "Follow industry best practices for installation",
        "Use appropriate tools and equipment",
        "Verify proper fit and alignment",
        "Follow safety guidelines during installation",
        "Inspect after installation for quality assurance"
      ]
    }
  }

  const generateCompatibility = () => {
    return {
      title: "Compatibility Information",
      content: `The ${part.productname} is designed to be compatible with standard ${part.category.toLowerCase()} 
      applications. This ${part.sub_category} follows industry-standard dimensions and specifications, ensuring broad 
      compatibility with various equipment and assemblies. For specific compatibility requirements or custom applications, 
      please consult our technical team or reference the detailed specifications section.`
    }
  }

  const materialInfo = generateMaterialInfo()
  const applications = generateApplications()
  const features = generateFeatures()
  const installation = generateInstallation()
  const compatibility = generateCompatibility()

  return (
    <div className="space-y-6 mt-6">
      {/* Product Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Product Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {generateOverview()}
          </p>
        </CardContent>
      </Card>

      {/* Technical Information */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-4">
            {generateTechnicalInfo()}
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This product is manufactured to precise specifications 
              using advanced manufacturing processes. All dimensions and tolerances are maintained 
              within strict quality control standards.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Material Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Material & Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Constructed from <strong>{materialInfo.material}</strong>, this component offers:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {materialInfo.properties.map((prop, index) => (
              <li key={index}>{prop}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features & Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Common Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            The {part.productname} is ideal for a wide range of applications, including:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {applications.map((app, index) => (
              <div key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">{app}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Installation Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>{installation.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {installation.steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="font-semibold text-blue-600 mr-3">{index + 1}.</span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
            <p className="text-sm text-yellow-900">
              <strong>Important:</strong> Always follow proper safety procedures and use appropriate 
              personal protective equipment when handling and installing parts.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Compatibility */}
      <Card>
        <CardHeader>
          <CardTitle>{compatibility.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {compatibility.content}
          </p>
        </CardContent>
      </Card>

      {/* Quality & Standards */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Assurance & Standards</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-4">
            All {part.manufacturer} products, including the {part.productname}, undergo rigorous quality 
            control testing to ensure they meet or exceed industry standards. Our manufacturing processes 
            are ISO compliant, and each part is inspected for dimensional accuracy, surface finish, and 
            material composition.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">100%</div>
              <div className="text-sm text-gray-600">Quality Inspected</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">ISO</div>
              <div className="text-sm text-gray-600">Certified Manufacturing</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">OEM</div>
              <div className="text-sm text-gray-600">Spec Compliant</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ordering Information */}
      <Card>
        <CardHeader>
          <CardTitle>Ordering & Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-4">
            To order the {part.productname} or for assistance with product selection, our experienced 
            team is ready to help. We offer technical support, custom configurations, and volume pricing 
            for large orders. Contact us for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Product specifications and technical data sheets</li>
            <li>Custom part configurations</li>
            <li>Volume pricing and bulk orders</li>
            <li>Lead time and availability information</li>
            <li>Technical support and application assistance</li>
            <li>Compatibility verification</li>
          </ul>
          {part.lead_time && (
            <div className="mt-4 p-3 bg-green-50 rounded">
              <p className="text-sm text-green-900">
                <strong>Lead Time:</strong> {part.lead_time}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Q: Is this part available for immediate shipment?
              </h4>
              <p className="text-gray-700 pl-4">
                A: {part.availability_status === "In Stock" 
                  ? "Yes, this part is currently in stock and available for immediate shipment." 
                  : "Please check availability status above or contact us for current lead times."}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Q: Do you offer technical support for installation?
              </h4>
              <p className="text-gray-700 pl-4">
                A: Yes, our technical team is available to assist with installation guidelines, 
                specifications, and application-specific questions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Q: Can I get a sample or small quantity order?
              </h4>
              <p className="text-gray-700 pl-4">
                A: Yes, we accommodate both small quantity orders and bulk purchases. Contact us 
                for pricing and minimum order quantities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Q: Are custom specifications available?
              </h4>
              <p className="text-gray-700 pl-4">
                A: For custom specifications or modifications, please contact our engineering team 
                to discuss your requirements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

