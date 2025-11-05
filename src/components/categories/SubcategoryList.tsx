import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import type { Subcategory } from "../../types/part"
import LoadingSpinner from "../common/LoadingSpinner"
import { Package } from "lucide-react"

interface SubcategoryListProps {
  subcategories: Subcategory[]
  categorySlug: string
  isLoading?: boolean
}

export default function SubcategoryList({
  subcategories,
  categorySlug,
  isLoading,
}: SubcategoryListProps) {
  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!subcategories || subcategories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No subcategories found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subcategories.map((subcategory) => (
        <Link
          key={subcategory.slug}
          to={`/categories/${categorySlug}/${subcategory.slug}`}
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                <Package className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {subcategory.partCount.toLocaleString()} {subcategory.partCount === 1 ? 'part' : 'parts'}
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

