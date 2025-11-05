import { useQuery } from "@tanstack/react-query"
import { getPartsBySubcategory } from "../../lib/queries"
import type { Part } from "../../types/part"
import PartCard from "./PartCard"
import LoadingSpinner from "../common/LoadingSpinner"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { slugify } from "../../lib/utils"

interface RelatedPartsProps {
  currentPart: Part
  limit?: number
}

export default function RelatedParts({ currentPart, limit = 4 }: RelatedPartsProps) {
  const categorySlug = slugify(currentPart.category)
  const subcategorySlug = slugify(currentPart.sub_category)

  const { data, isLoading } = useQuery({
    queryKey: ["related-parts", categorySlug, subcategorySlug],
    queryFn: () => getPartsBySubcategory(categorySlug, subcategorySlug, 1, limit + 1),
    enabled: !!categorySlug && !!subcategorySlug,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Related Parts</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  // Filter out the current part
  const relatedParts =
    data?.parts.filter((p) => p.productname !== currentPart.productname).slice(0, limit) || []

  if (relatedParts.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Parts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedParts.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

