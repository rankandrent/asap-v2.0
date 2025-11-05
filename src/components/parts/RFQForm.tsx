import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import type { Part } from "../../types/part"
import { submitRFQ } from "../../lib/rfqQueries"
import type { RFQFormData } from "../../types/rfq"

interface RFQFormProps {
  part: Part
}

export default function RFQForm({ part }: RFQFormProps) {
  const [formData, setFormData] = useState<Omit<RFQFormData, 'quantity' | 'urgency'> & { quantity: string, urgency: 'standard' | 'urgent' | 'critical' }>({
    name: "",
    email: "",
    phone: "",
    company: "",
    quantity: "1",
    target_price: undefined,
    message: "",
    urgency: "standard"
  })

  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // Prepare tracking data
      const trackingData = {
        sourcePage: 'Part Detail Page',
        sourceUrl: window.location.href,
        referrer: document.referrer || undefined,
        userAgent: navigator.userAgent
      }

      // Prepare RFQ data
      const rfqData: RFQFormData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        part_number: part.productname,
        part_description: part.description || `${part.category} - ${part.sub_category}`,
        quantity: parseInt(formData.quantity) || 1,
        target_price: formData.target_price ? parseFloat(formData.target_price as any) : undefined,
        message: formData.message || undefined,
        urgency: formData.urgency
      }

      // Submit RFQ
      const { error: submitError } = await submitRFQ(rfqData, trackingData)

      if (submitError) {
        throw new Error(submitError.message || 'Failed to submit RFQ')
      }

      setSubmitted(true)
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          quantity: "1",
          target_price: undefined,
          message: "",
          urgency: "standard"
        })
      }, 5000)
    } catch (err: any) {
      setError(err.message || 'Failed to submit RFQ. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Card className="border-2 border-blue-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl text-blue-900">Request for Quote (RFQ)</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Get competitive pricing for <span className="font-semibold">{part.productname}</span>
            </CardDescription>
          </div>
          <Badge className="bg-green-500 text-white">Fast Response</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">RFQ Submitted Successfully!</h3>
            <p className="text-gray-600">Our team will contact you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Product Info */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-3">Product Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Part Number:</span>
                  <p className="font-mono font-semibold">{part.productname}</p>
                </div>
                <div>
                  <span className="text-gray-600">Manufacturer:</span>
                  <p className="font-semibold">{part.manufacturer}</p>
                </div>
                <div>
                  <span className="text-gray-600">Category:</span>
                  <p>{part.category}</p>
                </div>
                <div>
                  <span className="text-gray-600">Availability:</span>
                  <Badge variant={part.availability_status === "In Stock" ? "default" : "secondary"}>
                    {part.availability_status || "Contact Us"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <Input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your Company Inc."
                  className="w-full"
                />
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Required <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="100"
                  min="1"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Price (Optional)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  name="target_price"
                  value={formData.target_price || ''}
                  onChange={handleChange}
                  placeholder="10.00"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency <span className="text-red-500">*</span>
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="standard">Standard</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Additional Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Requirements or Questions
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your specific requirements, delivery timeline, or any questions..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <Button 
                type="submit" 
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '⏳ Submitting...' : '📧 Submit RFQ Request'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="px-6 py-6"
                onClick={() => window.print()}
              >
                🖨️ Print
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-xs text-gray-600 font-medium">24hr Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">💰</div>
                <div className="text-xs text-gray-600 font-medium">Best Prices</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🔒</div>
                <div className="text-xs text-gray-600 font-medium">Secure</div>
              </div>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

