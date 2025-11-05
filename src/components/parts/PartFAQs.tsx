import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import type { Part } from '../../types/part'

interface PartFAQsProps {
  part: Part
}

interface FAQ {
  question: string
  answer: string
}

export default function PartFAQs({ part }: PartFAQsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  // Generate dynamic FAQs based on part data
  const faqs: FAQ[] = [
    {
      question: `What is ${part.productname}?`,
      answer: `${part.productname} is a ${part.sub_category} manufactured by ${part.manufacturer}. This part belongs to the ${part.category} category and is commonly used in aerospace and industrial applications. ${part.description || 'This is a high-quality component designed for precision and durability.'}`
    },
    {
      question: `Is ${part.productname} in stock?`,
      answer: `${part.availability_status === 'In Stock' 
        ? `Yes! ${part.productname} is currently in stock and available for immediate shipment. We maintain inventory of this part to ensure fast delivery times.` 
        : `${part.productname} availability varies. Please request a quote for current stock status and lead time. Our procurement team can source this part quickly through our extensive supplier network.`}`
    },
    {
      question: `What are the specifications of ${part.productname}?`,
      answer: `${part.productname} is a ${part.sub_category} part with the following details: Category - ${part.category}, Subcategory - ${part.sub_category}, Manufacturer - ${part.manufacturer}. ${part.description || 'For detailed technical specifications, dimensions, and material composition, please contact our technical support team or request a datasheet.'}`
    },
    {
      question: `How do I order ${part.productname}?`,
      answer: `Ordering ${part.productname} is easy! You can request a quote directly from this page using the RFQ form. Simply provide your contact information and quantity needed. Our sales team will respond within 24 hours with pricing, availability, and delivery options. For urgent orders, call us directly at (555) 000-0000.`
    },
    {
      question: `What is the lead time for ${part.productname}?`,
      answer: `${part.availability_status === 'In Stock' 
        ? `${part.productname} is in stock and typically ships within 24-48 hours of order confirmation. Express shipping options are available for urgent requirements.` 
        : `Lead time for ${part.productname} depends on current availability. Standard lead time is 2-4 weeks, but our procurement team often secures parts faster through our global supplier network. Contact us for the most current lead time information.`}`
    },
    {
      question: `Can I get a datasheet for ${part.productname}?`,
      answer: `Yes! Technical datasheets for ${part.productname} are available upon request. The datasheet includes detailed specifications, dimensions, tolerances, material certifications, and compliance information. Request a quote or contact our technical team to receive the complete documentation package for ${part.productname}.`
    },
    {
      question: `What industries use ${part.productname}?`,
      answer: `${part.productname} (${part.sub_category}) is commonly used in aerospace, defense, electronics, automotive, and industrial manufacturing. As a ${part.category} component, it meets strict quality standards required for critical applications. Our customers include OEMs, contract manufacturers, maintenance facilities, and research institutions.`
    },
    {
      question: `Is ${part.productname} covered by warranty?`,
      answer: `All parts including ${part.productname} come with our standard quality guarantee. We source only from authorized distributors and reputable manufacturers to ensure authenticity. Each shipment includes proper documentation and certifications. Specific warranty terms depend on the manufacturer and application - contact us for details.`
    },
    {
      question: `Can I get bulk pricing for ${part.productname}?`,
      answer: `Yes! We offer volume discounts for ${part.productname} and all parts in our catalog. The more you order, the better the price. Bulk orders also qualify for flexible payment terms and dedicated account management. Request a quote specifying your quantity requirements to receive volume pricing for ${part.productname}.`
    },
    {
      question: `What if ${part.productname} is discontinued?`,
      answer: `If ${part.productname} becomes discontinued or obsolete, our sourcing specialists can help find suitable replacements or locate remaining stock. We maintain relationships with brokers and distributors worldwide who specialize in hard-to-find and legacy parts. We can also suggest direct cross-references and form-fit-function alternatives.`
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <>
      {/* Add FAQ Schema to page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <HelpCircle className="h-6 w-6 text-blue-600" />
            Frequently Asked Questions about {part.productname}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Common questions about {part.productname} - {part.sub_category} from {part.manufacturer}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden transition-all hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 py-4 bg-white border-t">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}

          {/* Additional Help Section */}
          <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Still have questions about {part.productname}?
            </h3>
            <p className="text-blue-800 mb-4">
              Our technical support team is ready to help you with any questions about {part.productname} or other parts in our catalog.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-900">📧 Email:</span>{' '}
                <a href="mailto:support@asapamatom.com" className="text-blue-600 hover:underline">
                  support@asapamatom.com
                </a>
              </div>
              <div>
                <span className="font-medium text-blue-900">📞 Phone:</span>{' '}
                <a href="tel:+15550000000" className="text-blue-600 hover:underline">
                  (555) 000-0000
                </a>
              </div>
              <div>
                <span className="font-medium text-blue-900">⏰ Hours:</span>{' '}
                <span className="text-blue-800">Mon-Fri 8AM-6PM EST</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

