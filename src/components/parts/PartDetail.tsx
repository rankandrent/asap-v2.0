import { useState } from "react"
import type { Part } from "../../types/part"
import PartHeader from "./PartHeader"
import PartSpecs from "./PartSpecs"
import PartAvailability from "./PartAvailability"
import RFQForm from "./RFQForm"
import BulkRFQModal from "./BulkRFQModal"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Package, FileText, Truck, Shield, ShoppingCart } from "lucide-react"

interface PartDetailProps {
  part: Part
}

export default function PartDetail({ part }: PartDetailProps) {
  const [showBulkRFQ, setShowBulkRFQ] = useState(false)
  return (
    <div className="space-y-8">
      <PartHeader part={part} />

      {/* Bulk RFQ Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowBulkRFQ(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-6 text-base shadow-lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          📦 Submit Bulk RFQ (Multiple Parts)
        </Button>
      </div>

      {/* Bulk RFQ Modal */}
      <BulkRFQModal isOpen={showBulkRFQ} onClose={() => setShowBulkRFQ(false)} />
      
      {/* Key Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Manufacturer</p>
                <p className="font-bold text-gray-900">{part.manufacturer}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Quality</p>
                <p className="font-bold text-gray-900">OEM Standard</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-600 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Shipping</p>
                <p className="font-bold text-gray-900">Worldwide</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Documentation</p>
                <p className="font-bold text-gray-900">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Availability & Info */}
        <div className="lg:col-span-1 space-y-6">
          <PartAvailability part={part} />
          
          <Card className="border-gray-200">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="font-semibold text-gray-900">{part.category}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">Subcategory</p>
                  <p className="font-semibold text-gray-900">{part.sub_category}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">Part Number</p>
                  <p className="font-mono text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-2 rounded">
                    {part.productname}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
            <CardHeader>
              <CardTitle className="text-white">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-blue-100 text-sm">
                Our technical team is ready to assist with product selection and specifications.
              </p>
              <a 
                href="tel:+17147054780"
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-md font-medium transition-colors"
              >
                📞 Contact Support: +1 (714) 705-4780
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - RFQ Form */}
        <div className="lg:col-span-2">
          <RFQForm part={part} />
        </div>
      </div>

      {/* Specifications */}
      <PartSpecs specifications={part.specifications} />
    </div>
  )
}

