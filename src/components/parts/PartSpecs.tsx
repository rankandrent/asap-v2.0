import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface PartSpecsProps {
  specifications?: Record<string, any>
}

export default function PartSpecs({ specifications }: PartSpecsProps) {
  if (!specifications || Object.keys(specifications).length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(specifications).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between py-2 border-b last:border-0"
            >
              <span className="font-medium text-muted-foreground capitalize">
                {key.replace(/_/g, " ")}:
              </span>
              <span className="text-right">
                {typeof value === "object" ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

