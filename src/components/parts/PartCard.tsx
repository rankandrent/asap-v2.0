import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import type { Part } from "../../types/part"
import { Badge } from "../ui/badge"

interface PartCardProps {
  part: Part
}

export default function PartCard({ part }: PartCardProps) {
  const availabilityColors: Record<string, string> = {
    "In Stock": "bg-green-100 text-green-800",
    "Backorder": "bg-yellow-100 text-yellow-800",
    "Out of Stock": "bg-red-100 text-red-800",
  }

  return (
    <Link to={`/parts/${encodeURIComponent(part.productname)}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-mono break-all">
              {part.productname}
            </CardTitle>
            {part.availability_status && (
              <Badge
                className={`${availabilityColors[part.availability_status] || "bg-gray-100 text-gray-800"} text-xs`}
              >
                {part.availability_status}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2">
            {part.description}
          </CardDescription>
          {part.images && part.images.length > 0 && (
            <div className="mt-4">
              <img
                src={part.images[0]}
                alt={part.productname}
                className="w-full h-32 object-contain rounded"
                loading="lazy"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

