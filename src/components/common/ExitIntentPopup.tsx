import { useState, useEffect } from 'react'
import { X, AlertCircle, CheckCircle, Mail, Phone, User, MessageSquare } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { submitRFQ } from '../../lib/rfqQueries'
import type { RFQFormData } from '../../types/rfq'

interface ExitIntentData {
  name: string
  email: string
  phone: string
  message: string
  interest: string
}

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<ExitIntentData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    interest: ''
  })

  useEffect(() => {
    // Check if user has already seen popup (session storage)
    const hasSeenPopup = sessionStorage.getItem('exitPopupShown')
    if (hasSeenPopup) return

    // Wait 3 seconds before activating (don't annoy immediate visitors)
    const timer = setTimeout(() => {
      // Detect exit intent (mouse leaving viewport towards top)
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !hasShown && !isVisible) {
          setIsVisible(true)
          setHasShown(true)
          sessionStorage.setItem('exitPopupShown', 'true')
        }
      }

      document.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [hasShown, isVisible])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Prepare RFQ data
      const rfqData: RFQFormData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        part_number: 'Exit Intent Capture',
        part_description: formData.interest || 'General inquiry from exit popup',
        quantity: 1,
        urgency: 'standard',
        message: formData.message || 'User was about to leave the site'
      }

      const trackingData = {
        sourcePage: 'Exit Intent Popup',
        sourceUrl: window.location.href,
        referrer: document.referrer || undefined,
        userAgent: navigator.userAgent
      }

      await submitRFQ(rfqData, trackingData)

      setIsSuccess(true)
      
      // Auto-close after 3 seconds on success
      setTimeout(() => {
        setIsVisible(false)
      }, 3000)
    } catch (err) {
      setError('Failed to submit. Please try again.')
      console.error('Exit form submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Popup Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-in zoom-in-95 slide-in-from-top-10 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          {isSuccess ? (
            // Success State
            <div className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Thank You! 🎉
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                We've received your information and will contact you within 24 hours!
              </p>
              <p className="text-sm text-gray-500">
                Check your email ({formData.email}) for confirmation.
              </p>
              <Button
                onClick={handleClose}
                className="mt-6"
              >
                Continue Browsing
              </Button>
            </div>
          ) : (
            // Form State
            <>
              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-8 pb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                  <AlertCircle className="h-64 w-64" />
                </div>
                <div className="relative z-10">
                  <AlertCircle className="h-12 w-12 mb-4" />
                  <h2 className="text-3xl font-bold mb-2">
                    Wait! Don't Leave Empty-Handed! 👋
                  </h2>
                  <p className="text-red-50 text-lg">
                    Before you go, let us help you find the perfect parts or get you a quick quote!
                  </p>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="px-8 py-6 bg-blue-50 border-b">
                <h3 className="font-semibold text-gray-900 mb-3">
                  What you'll get:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900">Fast Response</span>
                      <p className="text-gray-600">Reply within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900">Best Pricing</span>
                      <p className="text-gray-600">Competitive quotes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900">Expert Help</span>
                      <p className="text-gray-600">Technical support</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="exit-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="exit-name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="exit-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="exit-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@company.com"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="exit-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="exit-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Interest/Looking For */}
                <div>
                  <label htmlFor="exit-interest" className="block text-sm font-medium text-gray-700 mb-2">
                    What are you looking for?
                  </label>
                  <select
                    id="exit-interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an option...</option>
                    <option value="Specific Part Number">Specific Part Number</option>
                    <option value="Standoffs">Standoffs</option>
                    <option value="Spacers">Spacers</option>
                    <option value="Screws & Bolts">Screws & Bolts</option>
                    <option value="Bearings & Bushings">Bearings & Bushings</option>
                    <option value="Custom Quote">Custom Quote</option>
                    <option value="Bulk Order">Bulk Order</option>
                    <option value="Just Browsing">Just Browsing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="exit-message" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Details (Optional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Textarea
                      id="exit-message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Part numbers, quantities, or any specific requirements..."
                      rows={3}
                      className="pl-10 resize-none"
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Get Your Free Quote 🚀
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleClose}
                    variant="outline"
                    className="sm:w-auto"
                  >
                    No Thanks
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  We respect your privacy. Your information is secure and will never be shared.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}

