import { useManufacturerContext } from '../../contexts/ManufacturerContext'
import { Package, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function ManufacturerSelector() {
  const {
    selectedManufacturer,
    setSelectedManufacturer,
    manufacturers,
    isLoading,
  } = useManufacturerContext()

  if (isLoading) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Manufacturer</h3>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 w-32 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (manufacturers.length === 0) {
    return null
  }

  // If only one manufacturer, don't show selector
  if (manufacturers.length === 1) {
    return null
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Select Manufacturer</h3>
      <div className="flex flex-wrap gap-3">
        {manufacturers.map((manufacturer) => {
          const isSelected = selectedManufacturer === manufacturer.name
          return (
            <button
              key={manufacturer.slug}
              onClick={() => setSelectedManufacturer(manufacturer.name)}
              className={cn(
                'relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md',
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'p-2 rounded-full',
                    isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  <Package className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{manufacturer.name}</div>
                  <div className="text-sm text-gray-500">
                    {manufacturer.partCount.toLocaleString()} parts
                  </div>
                  <div className="text-xs text-gray-400">
                    {manufacturer.categoryCount} categories
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-5 w-5 text-blue-500" />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

