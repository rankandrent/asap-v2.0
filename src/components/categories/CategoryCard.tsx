import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import type { Category } from "../../types/part"
import { Package } from "lucide-react"

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link to={`/categories/${category.slug}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{category.name}</CardTitle>
            <Package className="h-6 w-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            {category.subcategoryCount} {category.subcategoryCount === 1 ? 'subcategory' : 'subcategories'}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}

