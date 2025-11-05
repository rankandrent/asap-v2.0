import type { Part } from "../../types/part"
import { Badge } from "../ui/badge"
import { Package2, Factory } from "lucide-react"

interface PartHeaderProps {
  part: Part
}

export default function PartHeader({ part }: PartHeaderProps) {
  const availabilityColors: Record<string, string> = {
    "In Stock": "bg-green-100 text-green-800",
    "Backorder": "bg-yellow-100 text-yellow-800",
    "Out of Stock": "bg-red-100 text-red-800",
  }

  return (
    <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 -mx-6 -mt-6 px-6 pt-6 pb-8 mb-6 border-b-4 border-blue-600">
      <div className="space-y-4">
        {/* Manufacturer Badge */}
        <div className="flex items-center gap-2">
          <Factory className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-600">Manufacturer:</span>
          <Badge className="bg-blue-600 text-white hover:bg-blue-700">
            {part.manufacturer}
          </Badge>
        </div>

        {/* Main Title */}
        <div>
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Package2 className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
                {part.productname}
              </h1>
              {part.description && (
                <p className="text-xl text-gray-700 font-medium leading-relaxed">
                  {part.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Category & Availability Badges */}
        <div className="flex flex-wrap gap-3 pt-2">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border-2 border-blue-200 shadow-sm">
            <span className="text-sm font-medium text-gray-600">Category:</span>
            <span className="font-bold text-blue-900">{part.category}</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border-2 border-indigo-200 shadow-sm">
            <span className="text-sm font-medium text-gray-600">Subcategory:</span>
            <span className="font-bold text-indigo-900">{part.sub_category}</span>
          </div>
          {part.availability_status && (
            <Badge
              className={`${availabilityColors[part.availability_status] || "bg-gray-100 text-gray-800"} text-base px-4 py-2`}
            >
              {part.availability_status}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

