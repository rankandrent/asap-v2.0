import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { formatPrice } from "../../lib/utils"
import type { Part } from "../../types/part"

interface PartAvailabilityProps {
  part: Part
}

export default function PartAvailability({ part }: PartAvailabilityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability & Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {part.price && (
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-2xl font-bold">{formatPrice(part.price)}</p>
          </div>
        )}
        {part.quantity !== undefined && (
          <div>
            <p className="text-sm text-muted-foreground">Quantity Available</p>
            <p className="text-lg font-semibold">{part.quantity.toLocaleString()}</p>
          </div>
        )}
        {part.lead_time && (
          <div>
            <p className="text-sm text-muted-foreground">Lead Time</p>
            <p className="text-lg">{part.lead_time}</p>
          </div>
        )}
        {part.certifications && part.certifications.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Certifications</p>
            <div className="flex flex-wrap gap-2">
              {part.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary rounded text-sm"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

