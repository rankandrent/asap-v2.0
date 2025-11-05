import type { Category } from "../../types/part"
import CategoryCard from "./CategoryCard"
import LoadingSpinner from "../common/LoadingSpinner"

interface CategoryGridProps {
  categories: Category[]
  isLoading?: boolean
}

export default function CategoryGrid({ categories, isLoading }: CategoryGridProps) {
  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No categories found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => (
        <CategoryCard key={category.slug} category={category} />
      ))}
    </div>
  )
}

