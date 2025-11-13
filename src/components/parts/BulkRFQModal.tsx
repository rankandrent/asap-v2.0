import { useState } from "react"
import { X, Plus, Trash2, Upload } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface BulkRFQModalProps {
  isOpen: boolean
  onClose: () => void
}

interface RFQItem {
  id: string
  partNumber: string
  quantity: string
}

export default function BulkRFQModal({ isOpen, onClose }: BulkRFQModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  })

  const [items, setItems] = useState<RFQItem[]>([
    { id: "1", partNumber: "", quantity: "" }
  ])

  const [submitted, setSubmitted] = useState(false)

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), partNumber: "", quantity: "" }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof RFQItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Bulk RFQ Submitted:", { formData, items })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
      // Reset form
      setFormData({ name: "", email: "", phone: "", company: "", message: "" })
      setItems([{ id: "1", partNumber: "", quantity: "" }])
    }, 2000)
  }

  const handleTextareaPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const lines = pastedText.split('\n').filter(line => line.trim())
    
    const newItems: RFQItem[] = lines.map((line, index) => {
      const parts = line.split(/[\t,]/).map(p => p.trim())
      return {
        id: Date.now().toString() + index,
        partNumber: parts[0] || "",
        quantity: parts[1] || "1"
      }
    })
    
    if (newItems.length > 0) {
      setItems(newItems)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="p-12 text-center">
            <div className="text-7xl mb-4">✅</div>
            <h3 className="text-3xl font-bold text-green-600 mb-2">Bulk RFQ Submitted!</h3>
            <p className="text-gray-600">We'll process your request for {items.length} parts and contact you soon.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">📦 Bulk RFQ Request</h2>
                <p className="text-indigo-100 text-sm">Request quotes for multiple parts at once</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Contact Information */}
              <Card className="border-2 border-indigo-200">
                <CardHeader className="bg-indigo-50">
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (714) 705-4780"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <Input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Your Company Inc."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Parts List */}
              <Card className="border-2 border-purple-200">
                <CardHeader className="bg-purple-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Parts List ({items.length} items)</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Add part numbers and quantities</p>
                    </div>
                    <Button
                      type="button"
                      onClick={addItem}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Part
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Quick Paste Option */}
                  <div className="mb-6 p-4 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Upload className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 mb-2">
                          Quick Paste from Excel/Spreadsheet
                        </p>
                        <textarea
                          placeholder="Paste part numbers here (one per line or comma/tab separated)&#10;Example:&#10;17300-B-0256-15, 100&#10;17300-C-0512-20, 250&#10;17300-A-0128-10, 50"
                          className="w-full px-3 py-2 border border-blue-300 rounded text-sm font-mono"
                          rows={4}
                          onPaste={handleTextareaPaste}
                        />
                        <p className="text-xs text-blue-700 mt-2">
                          💡 Tip: Copy from Excel (Part Number, Quantity) and paste here
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Manual Entry */}
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={item.id} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-center w-8 h-10 bg-purple-600 text-white rounded font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Part Number <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="text"
                              value={item.partNumber}
                              onChange={(e) => updateItem(item.id, "partNumber", e.target.value)}
                              placeholder="e.g., 17300-B-0256-15"
                              required
                              className="font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Quantity <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                              placeholder="100"
                              min="1"
                              required
                            />
                          </div>
                        </div>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Message */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Any special requirements, delivery timeline, or questions..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </CardContent>
              </Card>

              {/* Summary & Submit */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
                    <p className="text-sm text-gray-600">Review before submitting</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-600">{items.length}</div>
                    <div className="text-sm text-gray-600">Total Parts</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6 text-lg"
                  >
                    📤 Submit Bulk RFQ Request
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="px-8"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

